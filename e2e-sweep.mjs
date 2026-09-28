import { writeFileSync } from "fs";

const BASE = "https://www.toolpilotpro.in";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36";

const results = { ok: 0, bad: [] };
const ignore = new Set(["/robots.txt"]);

async function run(loc) {
  const path = new URL(loc).pathname;
  if (ignore.has(path)) return;
  try {
    const res = await fetch(loc, { headers: { "user-agent": UA }, redirect: "follow" });
    if (res.status !== 200) {
      results.bad.push({ path, status: res.status });
      return;
    }
    if (path.startsWith("/tools/")) {
      const body = await res.text();
      if (body.includes("Coming Soon")) {
        results.bad.push({ path, status: "COMING_SOON_IN_SSR" });
        return;
      }
    }
    results.ok++;
  } catch (e) {
    results.bad.push({ path, status: `ERR: ${e.message}` });
  }
}

const sm = await (await fetch(BASE + "/sitemap.xml", { headers: { "user-agent": UA } })).text();
const locs = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
console.log(`SITEMAP: ${locs.length} URLs`);

const concurrency = 12;
for (let i = 0; i < locs.length; i += concurrency) {
  await Promise.all(locs.slice(i, i + concurrency).map(run));
}

const toolCount = locs.filter((l) => new URL(l).pathname.startsWith("/tools/")).length;
const blogCount = locs.filter((l) => new URL(l).pathname.startsWith("/blog/")).length;

const report = {
  totalUrls: locs.length,
  toolPages: toolCount,
  blogPosts: blogCount,
  ok: results.ok,
  failures: results.bad,
};
writeFileSync("e2e-sweep-report.txt", JSON.stringify(report, null, 2));

console.log(`OK: ${results.ok}/${locs.length}`);
console.log(`FAILURES: ${results.bad.length}`);
for (const b of results.bad) console.log(`  ${b.status} ${b.path}`);