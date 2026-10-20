/**
 * Submit the site's URLs to IndexNow (Bing, Yandex, Seznam, Naver, Yep).
 *
 * Usage:
 *   npx tsx scripts/indexnow-ping.ts             # submit full sitemap
 *   npx tsx scripts/indexnow-ping.ts <url> ...   # submit specific URLs
 *
 * IndexNow instant-indexes changed URLs without waiting for a crawl, which
 * speeds up discovery after content consolidation and new publishes.
 */
const HOST = "www.toolpilotpro.in";
const BASE = `https://${HOST}`;
const KEY = "7f3a9c2e5b8d416fe0a1c6d94b2e8350";
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function sitemapUrls(): Promise<string[]> {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function submit(urls: string[]) {
  if (!urls.length) {
    console.log("No URLs to submit.");
    return;
  }
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };
  console.log(`Submitting ${urls.length} URL(s) to IndexNow ...`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`HTTP ${res.status} ${res.statusText}`);
  if (text) console.log(text);

  // 200 = OK, 202 = accepted/validation pending. Others are errors.
  if (res.status === 200 || res.status === 202) {
    console.log(`OK: ${urls.length} URL(s) submitted.`);
  } else if (res.status === 403) {
    console.error("403: key file not found or does not match — check /" + KEY + ".txt is deployed.");
    process.exitCode = 1;
  } else if (res.status === 422) {
    console.error("422: URLs do not belong to the host, or key mismatch.");
    process.exitCode = 1;
  } else {
    console.error(`Unexpected status ${res.status}.`);
    process.exitCode = 1;
  }
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a && !a.startsWith("-"));
  const urls = args.length ? args.map((u) => (u.startsWith("http") ? u : `${BASE}${u.startsWith("/") ? "" : "/"}${u}`)) : await sitemapUrls();
  await submit(urls);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
