/**
 * Google Trends research for US + UK tool/tax keywords.
 *
 * Google Trends is a DEMAND signal, not a traffic source: it shows what people
 * are searching for right now (rising vs falling) so you can publish timely
 * content and capture the traffic while interest is peaking. Use the output to
 * decide which pillar posts / tool pages to build next.
 *
 * Usage:
 *   npx tsx scripts/google-trends.ts                  # default US+UK keyword set
 *   npx tsx scripts/google-trends.ts "uk vat" "hmrc self assessment"
 *
 * Uses the `google-trends-api` package, which performs the cookie/consent
 * handshake Google requires. The upstream endpoints are undocumented and can
 * rate-limit; treat failures as "try again later", not fatal.
 */
import googleTrends from "google-trends-api";

type Geo = "US" | "GB";

interface RelatedItem {
  query: string;
  value: number;
  formattedValue?: string;
}

// Default keyword set: the US/UK tax + tool terms the site targets.
const DEFAULT_KEYWORDS: Record<Geo, string[]> = {
  US: [
    "us income tax calculator",
    "self employment tax calculator",
    "paycheck calculator",
    "take home pay calculator",
    "federal income tax brackets",
    "1099 tax calculator",
    "irs tax refund calculator",
  ],
  GB: [
    "uk income tax calculator",
    "national insurance calculator",
    "vat calculator",
    "take home pay calculator uk",
    "hmrc tax calculator",
    "self assessment tax calculator",
    "personal allowance",
  ],
};

const GEO_NAME: Record<Geo, string> = { US: "United States", GB: "United Kingdom" };

async function relatedQueries(keyword: string, geo: Geo, attempts = 3) {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      const raw = await googleTrends.relatedQueries({
        keyword,
        geo,
        startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        hl: "en-US",
      });
      const parsed = JSON.parse(raw);
      const ranked = parsed?.default?.rankedList as
        | Array<{ rankedKeyword: RelatedItem[] }>
        | undefined;
      const top = ranked?.[0]?.rankedKeyword ?? [];
      const rising = ranked?.[1]?.rankedKeyword ?? [];
      return { top, rising };
    } catch (err) {
      lastErr = err;
      if (i < attempts) await new Promise((r) => setTimeout(r, 5000 * i));
    }
  }
  throw lastErr;
}

async function main() {
  const cli = process.argv.slice(2).filter(Boolean);
  const stamp = new Date().toISOString().slice(0, 10);
  console.log(`Google Trends research (${stamp})`);

  let blocked = 0;
  let total = 0;

  async function guardedRun(geo: Geo, keywords: string[]) {
    console.log(`\n=== ${GEO_NAME[geo]} (${geo}) ===`);
    for (const kw of keywords) {
      total++;
      try {
        const { top, rising } = await relatedQueries(kw, geo);
        console.log(`\n"${kw}"`);
        if (rising.length) {
          console.log("  RISING (create content now):");
          for (const r of rising.slice(0, 6)) {
            const pct = r.formattedValue ? ` (${r.formattedValue})` : "";
            console.log(`    + ${r.query}${pct}`);
          }
        } else {
          console.log("  RISING: (none reported)");
        }
        if (top.length) {
          console.log("  TOP:");
          for (const t of top.slice(0, 5)) console.log(`    - ${t.query} [${t.value}]`);
        }
      } catch (err) {
        const msg = (err as Error).message || "";
        if (msg.includes("429") || msg.includes("<html")) blocked++;
        console.log(`\n"${kw}" -> failed: ${msg.split("\n")[0]} (retry later)`);
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (cli.length) {
    for (const geo of ["US", "GB"] as Geo[]) await guardedRun(geo, cli);
  } else {
    for (const geo of ["US", "GB"] as Geo[]) await guardedRun(geo, DEFAULT_KEYWORDS[geo]);
  }

  if (blocked === total && total > 0) {
    console.log(
      "\nAll requests were blocked (HTTP 429 / consent page). Google Trends aggressively " +
        "blocks datacenter and cloud IPs. Run this script from a normal residential/home " +
        "network, or from your own machine (not CI). It is a research helper, not a build step."
    );
  }

  console.log(
    "\nAction guide: turn every RISING query with a high percentage into a timely blog " +
      "post or tool page targeting that exact phrase. Match the site's US (federal) or UK " +
      "(HMRC) figures when relevant, and add the new URL to the sitemap + IndexNow."
  );
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
