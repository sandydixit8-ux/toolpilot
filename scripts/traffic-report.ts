/**
 * Traffic report - reads the analytics tables and prints a readable snapshot.
 *
 * Covers pageviews (7d / 30d / all-time, daily trend, top pages, referrers,
 * countries), tool usage, affiliate clicks and newsletter growth so we can tell
 * what is actually getting traffic versus what is only indexed.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(n: number) {
  return new Date(Date.now() - n * DAY);
}

function pct(part: number, total: number) {
  if (!total) return "0.0%";
  return ((part / total) * 100).toFixed(1) + "%";
}

function bar(n: number, max: number, width = 24) {
  if (!max) return "";
  const len = Math.max(1, Math.round((n / max) * width));
  return "#".repeat(len);
}

function host(ref: string | null): string {
  if (!ref) return "(direct)";
  try {
    const u = new URL(ref);
    const h = u.hostname.replace(/^www\./, "");
    if (/toolpilotpro\.in$/.test(h)) return "(internal)";
    return h;
  } catch {
    return "(unknown)";
  }
}

async function main() {
  const now = new Date();
  const [pv7, pv30, pvAll] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.pageView.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.pageView.count(),
  ]);

  console.log("=".repeat(72));
  console.log("TOOLPILOTPRO TRAFFIC REPORT");
  console.log("generated: " + now.toISOString());
  console.log("=".repeat(72));

  console.log("\n## PAGEVIEW TOTALS");
  console.log(`  last 24h : ${await prisma.pageView.count({ where: { createdAt: { gte: daysAgo(1) } } })}`);
  console.log(`  last 7d  : ${pv7}`);
  console.log(`  last 30d : ${pv30}`);
  console.log(`  all time : ${pvAll}`);
  const first = await prisma.pageView.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } });
  if (first) {
    const ageDays = Math.max(1, (now.getTime() - first.createdAt.getTime()) / DAY);
    console.log(`  collecting since: ${first.createdAt.toISOString().slice(0, 10)} (${ageDays.toFixed(1)} days)`);
    console.log(`  avg/day (30d): ${(pv30 / 30).toFixed(1)}   avg/day (7d): ${(pv7 / 7).toFixed(1)}`);
  }

  // ---- daily trend, last 14 days
  console.log("\n## DAILY TREND (last 14 days)");
  const since14 = daysAgo(14);
  const recent = await prisma.pageView.findMany({
    where: { createdAt: { gte: since14 } },
    select: { createdAt: true },
  });
  const byDay = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY).toISOString().slice(0, 10);
    byDay.set(d, 0);
  }
  for (const r of recent) {
    const d = r.createdAt.toISOString().slice(0, 10);
    if (byDay.has(d)) byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  const dayMax = Math.max(1, ...byDay.values());
  for (const [d, n] of byDay) {
    console.log(`  ${d}  ${String(n).padStart(4)}  ${bar(n, dayMax)}`);
  }

  // ---- top pages 30d
  console.log("\n## TOP PAGES (last 30 days)");
  const pages = await prisma.pageView.groupBy({
    by: ["path"],
    where: { createdAt: { gte: daysAgo(30) } },
    _count: { _all: true },
    orderBy: { _count: { path: "desc" } },
    take: 25,
  });
  const pageMax = Math.max(1, ...pages.map((p) => p._count._all));
  pages.forEach((p, i) => {
    const label = p.path.length > 46 ? p.path.slice(0, 45) + "~" : p.path;
    console.log(
      `  ${String(i + 1).padStart(2)}. ${String(p._count._all).padStart(4)}  ${pct(p._count._all, pv30).padStart(6)}  ${label.padEnd(47)} ${bar(p._count._all, pageMax, 16)}`
    );
  });
  const distinct = await prisma.pageView.groupBy({ by: ["path"], where: { createdAt: { gte: daysAgo(30) } } });
  console.log(`  distinct paths (30d): ${distinct.length}`);

  // ---- blog vs tools vs other
  console.log("\n## TRAFFIC BY SECTION (last 30 days)");
  const allPages30 = await prisma.pageView.groupBy({
    by: ["path"],
    where: { createdAt: { gte: daysAgo(30) } },
    _count: { _all: true },
  });
  const sections: Record<string, number> = { home: 0, tools: 0, blog: 0, other: 0 };
  for (const p of allPages30) {
    const n = p._count._all;
    if (p.path === "/") sections.home += n;
    else if (p.path.startsWith("/tools")) sections.tools += n;
    else if (p.path.startsWith("/blog")) sections.blog += n;
    else sections.other += n;
  }
  for (const [k, v] of Object.entries(sections)) {
    console.log(`  ${k.padEnd(6)} ${String(v).padStart(4)}  ${pct(v, pv30).padStart(6)}  ${bar(v, pv30, 20)}`);
  }

  // ---- referrers
  console.log("\n## REFERRERS / CHANNELS (last 30 days)");
  const refRows = await prisma.pageView.findMany({
    where: { createdAt: { gte: daysAgo(30) } },
    select: { referrer: true },
  });
  const refMap = new Map<string, number>();
  for (const r of refRows) {
    const h = host(r.referrer);
    refMap.set(h, (refMap.get(h) ?? 0) + 1);
  }
  const refs = [...refMap.entries()].sort((a, b) => b[1] - a[1]);
  const refMax = Math.max(1, ...refs.map((r) => r[1]));
  for (const [h, n] of refs.slice(0, 20)) {
    console.log(`  ${String(n).padStart(4)}  ${pct(n, pv30).padStart(6)}  ${h.padEnd(34)} ${bar(n, refMax, 16)}`);
  }
  const external = pv30 - (refMap.get("(direct)") ?? 0) - (refMap.get("(internal)") ?? 0);
  console.log(`  -> external referred: ${external} (${pct(external, pv30)})`);

  // ---- countries
  console.log("\n## COUNTRIES (last 30 days)");
  const countryRows = await prisma.pageView.groupBy({
    by: ["country"],
    where: { createdAt: { gte: daysAgo(30) } },
    _count: { _all: true },
    orderBy: { _count: { country: "desc" } },
    take: 12,
  });
  for (const c of countryRows) {
    console.log(`  ${String(c._count._all).padStart(4)}  ${pct(c._count._all, pv30).padStart(6)}  ${c.country ?? "(unknown)"}`);
  }

  // ---- tool usage
  console.log("\n## TOOL USAGE");
  const [tu7, tu30, tuAll] = await Promise.all([
    prisma.toolUsage.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.toolUsage.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.toolUsage.count(),
  ]);
  console.log(`  last 7d: ${tu7}   last 30d: ${tu30}   all time: ${tuAll}`);
  const tools30 = await prisma.toolUsage.groupBy({
    by: ["toolSlug"],
    where: { createdAt: { gte: daysAgo(30) } },
    _count: { _all: true },
    orderBy: { _count: { toolSlug: "desc" } },
    take: 20,
  });
  const toolMax = Math.max(1, ...tools30.map((t) => t._count._all));
  tools30.forEach((t, i) => {
    console.log(
      `  ${String(i + 1).padStart(2)}. ${String(t._count._all).padStart(4)}  ${t.toolSlug.padEnd(34)} ${bar(t._count._all, toolMax, 14)}`
    );
  });
  const distinctTools = await prisma.toolUsage.groupBy({ by: ["toolSlug"], where: { createdAt: { gte: daysAgo(30) } } });
  console.log(`  distinct tools used (30d): ${distinctTools.length}`);

  // ---- affiliate clicks
  console.log("\n## AFFILIATE CLICKS");
  const [ac7, ac30, acAll] = await Promise.all([
    prisma.affiliateClick.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.affiliateClick.count(),
  ]);
  console.log(`  last 7d: ${ac7}   last 30d: ${ac30}   all time: ${acAll}`);
  const acByProduct = await prisma.affiliateClick.groupBy({
    by: ["product"],
    where: { createdAt: { gte: daysAgo(30) } },
    _count: { _all: true },
    orderBy: { _count: { product: "desc" } },
  });
  for (const a of acByProduct) console.log(`  ${String(a._count._all).padStart(4)}  ${a.product}`);
  const acBySource = await prisma.affiliateClick.groupBy({
    by: ["source"],
    where: { createdAt: { gte: daysAgo(30) } },
    _count: { _all: true },
    orderBy: { _count: { source: "desc" } },
    take: 10,
  });
  if (acBySource.length) {
    console.log("  by source:");
    for (const a of acBySource) console.log(`    ${String(a._count._all).padStart(3)}  ${a.source ?? "(none)"}`);
  }

  // ---- newsletter
  console.log("\n## NEWSLETTER");
  const [nlAll, nlConfirmed, nl7, nl30] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: daysAgo(30) } } }),
  ]);
  console.log(`  total: ${nlAll}   confirmed: ${nlConfirmed}   pending: ${nlAll - nlConfirmed}`);
  console.log(`  new last 7d: ${nl7}   new last 30d: ${nl30}`);

  // ---- contact
  const ct = await prisma.contactSubmission.count().catch(() => -1);
  if (ct >= 0) console.log(`\n## CONTACT SUBMISSIONS\n  total: ${ct}`);

  // ---- content inventory
  const [published, tools] = await Promise.all([
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.tool.count().catch(() => -1),
  ]);
  console.log("\n## CONTENT INVENTORY");
  console.log(`  published blog posts: ${published}`);
  if (tools > 0) console.log(`  active tools: ${tools}`);

  console.log("\n" + "=".repeat(72));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
