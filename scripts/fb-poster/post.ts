import { allTools, getToolsByCategory } from "../../src/config/tools";
import { categories } from "../../src/config/categories";

const SITE_URL = "https://toolpilotpro.in";
const LINE = (s: string) => (s.length > 110 ? s.slice(0, 107).trimEnd() + "..." : s);

function daysSinceEpoch(): number {
  const start = Math.floor(new Date("2026-01-01T00:00:00+05:30").getTime() / 86400000);
  const now = Math.floor(new Date(Date.now()).getTime() / 86400000);
  return now - start;
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length > 3 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(15000) });
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    return locs.filter((u) => u.includes("/blog/")).map((u) => u.split("/blog/")[1].replace(/\/$/, ""));
  } catch {
    return [];
  }
}

function slot0(day: number): string {
  const tool = allTools[day % allTools.length];
  return [
    `${tool.name} - ${LINE(tool.description)}`,
    ``,
    `Free to use, no sign-up: ${SITE_URL}/tools/${tool.slug}`,
    ``,
    `#ToolPilot #FreeTools #${tool.category.replace(/\s+/g, "")}`,
  ].join("\n");
}

function slot1(day: number, slugs: string[]): string {
  if (slugs.length === 0) return slot2(day + 1);
  const slug = slugs[day % slugs.length];
  return [
    `Guide: ${titleFromSlug(slug)}`,
    ``,
    `Read it here: ${SITE_URL}/blog/${slug}`,
    ``,
    `#ToolPilot #Blog #Productivity`,
  ].join("\n");
}

function slot2(day: number): string {
  const cat = categories[day % categories.length];
  const tools = getToolsByCategory(cat.slug).slice(0, 3);
  return [
    `Best ${cat.name} tools - all 100% free:`,
    ``,
    ...tools.map((t, i) => `${i + 1}. ${t.name} - ${t.description.replace(/\.$/, "")}`),
    ``,
    `Explore all: ${SITE_URL}/tools/${cat.slug}`,
    ``,
    `#ToolPilot #FreeTools`,
  ].join("\n");
}

function slot3(day: number): string {
  const tool = allTools[(day * 7) % allTools.length];
  const steps = tool.instructions.slice(0, 3).map((s) => s.replace(/\.$/, ""));
  return [
    `How to use ${tool.name}:`,
    ``,
    ...steps.map((s, i) => `${i + 1}. ${LINE(s)}`),
    ``,
    `Free tool: ${SITE_URL}/tools/${tool.slug}`,
    ``,
    `#ToolPilot #HowTo`,
  ].join("\n");
}

async function buildPosts(): Promise<string[]> {
  const day = daysSinceEpoch();
  const blogSlugs = await fetchBlogSlugs();
  return [slot0(day), slot1(day, blogSlugs), slot2(day + 1), slot3(day + 2)];
}

async function publish(message: string): Promise<void> {
  const pageId = process.env.FB_PAGE_ID || "";
  const token = process.env.FB_PAGE_ACCESS_TOKEN || "";
  if (!pageId || !token) throw new Error("FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN missing");

  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: token }),
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code = json?.error?.code ?? "unknown";
    throw new Error(`Graph API ${res.status} (code ${code}): ${json?.error?.message || res.statusText}`);
  }
  console.log(`published id=${json.id}`);
}

(async () => {
  const posts = await buildPosts();
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) {
    posts.forEach((p, i) => {
      console.log(`\n===== SLOT ${i} =====\n${p}\n(chars: ${p.length})`);
    });
    return;
  }
  for (const p of posts) {
    await publish(p);
  }
})().catch((e) => {
  console.error("[fb-poster]", e.message);
  process.exit(1);
});