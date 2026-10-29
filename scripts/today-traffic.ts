import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const IST = 5.5 * 60 * 60 * 1000;
const dayKey = (d: Date) => new Date(d.getTime() + IST).toISOString().slice(0, 10);
const startOfIstDay = (key: string) => new Date(new Date(key + "T00:00:00.000Z").getTime() - IST);

async function main() {
  const today = dayKey(new Date());
  const start = startOfIstDay(today);

  const rows = await prisma.pageView.findMany({
    where: { createdAt: { gte: start } },
    select: { path: true, referrer: true, country: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`## TODAY (IST ${today}) pageviews: ${rows.length}`);
  console.log(`window: ${start.toISOString()} -> now\n`);

  const hours = new Map<number, number>();
  for (const r of rows) hours.set(new Date(r.createdAt.getTime() + IST).getUTCHours(), (hours.get(new Date(r.createdAt.getTime() + IST).getUTCHours()) ?? 0) + 1);
  console.log("by IST hour:", [...hours.entries()].sort((a, b) => a[0] - b[0]).map(([h, n]) => `${String(h).padStart(2, "0")}h=${n}`).join("  "));

  const paths = new Map<string, number>();
  for (const r of rows) paths.set(r.path, (paths.get(r.path) ?? 0) + 1);
  console.log("\ntop paths:");
  [...paths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([p, n]) => console.log(`  ${String(n).padStart(3)}  ${p}`));
  console.log(`distinct paths: ${paths.size}`);

  const refs = new Map<string, number>();
  for (const r of rows) {
    let h = r.referrer || "(direct)";
    try {
      if (r.referrer) h = new URL(r.referrer).hostname.replace(/^www\./, "");
    } catch {}
    refs.set(h, (refs.get(h) ?? 0) + 1);
  }
  console.log("\nreferrers:");
  [...refs.entries()].sort((a, b) => b[1] - a[1]).forEach(([h, n]) => console.log(`  ${String(n).padStart(3)}  ${h}`));

  const countries = new Map<string, number>();
  for (const r of rows) countries.set(r.country ?? "?", (countries.get(r.country ?? "?") ?? 0) + 1);
  console.log("\ncountries:", [...countries.entries()].map(([k, v]) => `${k}=${v}`).join("  "));

  // crawl signature: many distinct paths, tight timing, single country, no referrer
  let under10s = 0;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].createdAt.getTime() - rows[i - 1].createdAt.getTime() <= 10000) under10s++;
  }
  console.log(`\nconsecutive views <10s apart: ${under10s}/${Math.max(1, rows.length - 1)}`);
  const noRef = [...refs.values()].reduce((a, b) => a + b, 0);
  console.log(`no-referrer share: ${refs.get("(direct)") ?? 0}/${noRef}`);

  // tool usage today carries UA + IP, so it can distinguish bot from human
  const tu = await prisma.toolUsage.findMany({
    where: { createdAt: { gte: start } },
    select: { toolSlug: true, metadata: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  console.log(`\n## tool events today: ${tu.length}`);
  for (const t of tu) {
    let meta: any = {};
    try {
      meta = JSON.parse(t.metadata ?? "{}");
    } catch {}
    const ua = String(meta.ua ?? "");
    const ip = String(meta.ip ?? "");
    const mobile = /Mobile|Android|iPhone/.test(ua);
    const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "other";
    console.log(`  ${new Date(t.createdAt.getTime() + IST).toISOString().slice(11, 16)}  ${t.toolSlug.padEnd(28)} ${meta.country ?? "?"}  ${browser}${mobile ? "/mobile" : "/desktop"}  ip=${ip}`);
  }

  // yesterday for comparison
  const yKey = dayKey(new Date(start.getTime() - 1000));
  const yStart = startOfIstDay(yKey);
  const yEnd = start;
  const [yCount, tCount] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: yStart, lt: yEnd } } }),
    prisma.pageView.count(),
  ]);
  console.log(`\nyesterday (${yKey}): ${yCount}   all time: ${tCount}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
