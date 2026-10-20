/**
 * Internal demand report — find content opportunities from the site's OWN data.
 *
 * Google Trends tells you about the whole market; this tells you about YOUR
 * audience. It uses the data already collected (PageView, ToolUsage,
 * AffiliateClick) plus the tool/blog inventory to surface:
 *
 *   1. Traffic magnets  — tools and pages that already get the most visits.
 *   2. Content gaps     — tools/pages with traffic but no supporting blog post.
 *   3. Dead weight      — published pages with almost no views (refresh or merge).
 *   4. Revenue signals  — affiliate products/pages that actually get clicks.
 *   5. Channel mix      — how visitors arrive (referrer buckets).
 *
 * Output is a plain console report; redirect to a file if you want a record.
 *
 * Usage:
 *   npx tsx scripts/demand-report.ts            # last 30 days
 *   npx tsx scripts/demand-report.ts 90         # last N days
 */
import { PrismaClient } from "@prisma/client";
import { allTools } from "../src/config/tools";

const prisma = new PrismaClient();

function pct(n: number, total: number): string {
  if (!total) return "0%";
  return `${((n / total) * 100).toFixed(1)}%`;
}

function bar(n: number, max: number, width = 24): string {
  if (!max) return "";
  const len = Math.max(1, Math.round((n / max) * width));
  return "#".repeat(len);
}

async function main() {
  const days = Number(process.argv[2]) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  console.log(`\nToolPilot demand report — last ${days} days (since ${since.toISOString().slice(0, 10)})\n`);

  // ----- Page views -----
  const pages = await prisma.pageView.groupBy({
    by: ["path"],
    where: { createdAt: { gte: since } },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
  });
  const totalPages = pages.reduce((s, p) => s + p._count.path, 0);

  console.log(`== Top pages (${totalPages} views total) ==`);
  const maxPage = pages[0]?._count.path ?? 0;
  for (const p of pages.slice(0, 20)) {
    console.log(`  ${String(p._count.path).padStart(5)}  ${bar(p._count.path, maxPage)}  ${p.path}`);
  }

  // ----- Tool usage events -----
  const tools = await prisma.toolUsage.groupBy({
    by: ["toolSlug"],
    where: { createdAt: { gte: since } },
    _count: { toolSlug: true },
    orderBy: { _count: { toolSlug: "desc" } },
  });
  console.log(`\n== Top tools by usage (${tools.length} tools used) ==`);
  const maxTool = tools[0]?._count.toolSlug ?? 0;
  const usedSlugs = new Set(tools.map((t) => t.toolSlug));
  for (const t of tools.slice(0, 25)) {
    console.log(`  ${String(t._count.toolSlug).padStart(5)}  ${bar(t._count.toolSlug, maxTool)}  /tools/${t.toolSlug}`);
  }

  // ----- Find supporting blog posts per used tool (content gaps) -----
  // A blog post "supports" a tool if its slug shares the tool's key tokens.
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, title: true },
  });
  const postText = posts.map((p) => ({ slug: p.slug, hay: `${p.slug} ${p.title}`.toLowerCase() }));

  function hasSupport(toolSlug: string): boolean {
    const tokens = toolSlug.split("-").filter((w) => w.length > 3);
    if (!tokens.length) return true;
    // Match if a post contains the tool's main noun (any single significant
    // token, usually the action or the object: "compress", "pdf", "image"),
    // OR all tokens. Requiring ALL tokens missed posts like
    // how-to-compress-image-without-losing-quality for image-compressor.
    const core = tokens.filter((w) => !["calculator", "converter", "generator", "online", "free", "tool"].includes(w));
    const needles = core.length ? core : tokens;
    return postText.some((p) => needles.some((t) => p.hay.includes(t)));
  }

  const usedTools = tools
    .map((t) => allTools.find((x) => x.slug === t.toolSlug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  console.log("\n== Content gaps: tools with traffic but no supporting blog post ==");
  const gaps = usedTools.filter((t) => !hasSupport(t.slug));
  if (!gaps.length) console.log("  (none — every used tool has a matching post)");
  for (const t of gaps) console.log(`  MISSING POST: ${t.name} (/tools/${t.slug})`);

  // ----- Never-used tools -----
  console.log("\n== Tools with NO usage yet (consider discovery boost) ==");
  const neverUsed = allTools.filter((t) => !usedSlugs.has(t.slug));
  console.log(`  ${neverUsed.length} of ${allTools.length} tools unused in this window`);
  for (const t of neverUsed.slice(0, 25)) console.log(`  - ${t.name} (/tools/${t.slug})`);

  // ----- Affiliate clicks (revenue signal) -----
  const clicks = await prisma.affiliateClick.groupBy({
    by: ["product"],
    where: { createdAt: { gte: since } },
    _count: { product: true },
    orderBy: { _count: { product: "desc" } },
  });
  console.log(`\n== Affiliate clicks by product (${clicks.reduce((s, c) => s + c._count.product, 0)} total) ==`);
  if (!clicks.length) console.log("  (no affiliate clicks captured yet)");
  for (const c of clicks.slice(0, 15)) console.log(`  ${String(c._count.product).padStart(5)}  ${c.product}`);

  const clickPaths = await prisma.affiliateClick.groupBy({
    by: ["path"],
    where: { createdAt: { gte: since } },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
  });
  console.log("\n== Affiliate clicks by page ==");
  for (const c of clickPaths.slice(0, 10)) console.log(`  ${String(c._count.path).padStart(5)}  ${c.path ?? "(unknown)"}`);

  // ----- Referrer / channel mix -----
  const refs = await prisma.pageView.groupBy({
    by: ["referrer"],
    where: { createdAt: { gte: since } },
    _count: { referrer: true },
    orderBy: { _count: { referrer: "desc" } },
  });
  const bucket = (r: string | null): string => {
    if (!r || r === "") return "Direct / none";
    try {
      const host = new URL(r).host;
      if (host.includes("google")) return "Google (organic)";
      if (host.includes("bing") || host.includes("duckduckgo")) return "Other search";
      if (host.includes("facebook") || host.includes("instagram") || host.includes("t.co") || host.includes("twitter") || host.includes("linkedin"))
        return "Social";
      if (host.includes("toolpilotpro")) return "Internal";
      return host;
    } catch {
      return r;
    }
  };
  const channels = new Map<string, number>();
  for (const r of refs) channels.set(bucket(r.referrer), (channels.get(bucket(r.referrer)) ?? 0) + r._count.referrer);
  console.log("\n== Channel mix (page views by referrer) ==");
  const chanSorted = [...channels.entries()].sort((a, b) => b[1] - a[1]);
  const maxChan = chanSorted[0]?.[1] ?? 0;
  for (const [name, n] of chanSorted.slice(0, 15)) {
    console.log(`  ${String(n).padStart(5)}  ${pct(n, totalPages).padStart(6)}  ${bar(n, maxChan)}  ${name}`);
  }

  // ----- Summary / actions -----
  console.log("\n== Suggested actions ==");
  if (chanSorted.length && (channels.get("Google (organic)") ?? 0) / Math.max(1, totalPages) < 0.3)
    console.log("  * Organic share is low (<30%): indexing/content is the bottleneck — resubmit sitemap, publish US/UK pillar posts.");
  if (gaps.length) console.log(`  * Write ${gaps.length} supporting blog post(s) for tools that already get traffic.`);
  if (neverUsed.length > allTools.length * 0.5)
    console.log("  * Over half the tools have no usage: add them to relevant pillar pages and internal links (RelatedTools/RelatedArticles).");
  if (!clicks.length) console.log("  * No affiliate clicks yet: confirm AffiliatePromo renders on high-traffic pages.");
  console.log("");

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Fatal:", err);
  await prisma.$disconnect();
  process.exit(1);
});
