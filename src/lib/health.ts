import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const SITE_URL = "https://www.toolpilotpro.in";
const RENDER_URL = process.env.CONVERTER_SERVICE_URL || "https://toolpilot-5b6c.onrender.com";
const SLOW_MS = 4000;
const RETENTION_DAYS = 7;

export type HealthStatus = "UP" | "DEGRADED" | "DOWN";

export interface HealthCheckResult {
  check: string;
  category: "CORE" | "SERVICE" | "SITEMAP";
  status: HealthStatus;
  responseMs: number;
  statusCode: number | null;
  meta?: string;
}

async function timedFetch(
  url: string,
  method: "GET" | "HEAD" = "GET",
  timeoutMs = 15000
): Promise<{ status: number | null; ms: number; error?: string }> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.body) await res.body.cancel().catch(() => {});
    return { status: res.status, ms: Date.now() - t0 };
  } catch (e) {
    return { status: null, ms: Date.now() - t0, error: e instanceof Error ? e.message : String(e) };
  }
}

function classify(status: number | null, ms: number): HealthStatus {
  if (status === 200) return ms > SLOW_MS ? "DEGRADED" : "UP";
  if (status === 429) return "DEGRADED";
  return "DOWN";
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

export async function runHealthChecks() {
  const runId = randomUUID();
  const results: HealthCheckResult[] = [];

  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const sitemap = await timedFetch(sitemapUrl);
  results.push({
    check: sitemapUrl,
    category: "CORE",
    status: classify(sitemap.status, sitemap.ms),
    responseMs: sitemap.ms,
    statusCode: sitemap.status,
    meta: sitemap.error,
  });

  let locs: string[] = [];
  if (sitemap.status === 200) {
    try {
      const xmlRes = await fetch(sitemapUrl, { cache: "no-store", signal: AbortSignal.timeout(15000) });
      const xml = await xmlRes.text();
      locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    } catch {
      locs = [];
    }
  }

  const keepaliveUrl = `${SITE_URL}/api/keepalive/converter`;
  const coreUrls = [
    `${SITE_URL}/`,
    `${SITE_URL}/tools`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/privacy`,
    `${SITE_URL}/terms`,
    `${SITE_URL}/ads.txt`,
    `${SITE_URL}/robots.txt`,
    keepaliveUrl,
  ];
  const renderPromise = (async () => {
    const render = await timedFetch(`${RENDER_URL}/`, "GET", 30000);
    const status: HealthStatus =
      render.status !== null && render.status < 500 ? (render.ms > SLOW_MS ? "DEGRADED" : "UP") : "DOWN";
    return {
      check: `${RENDER_URL} (converter service)`,
      category: "SERVICE" as const,
      status,
      responseMs: render.ms,
      statusCode: render.status,
      meta: render.error,
    };
  })();
  const dbPromise = (async () => {
    const dbStart = Date.now();
    let dbStatus: HealthStatus = "UP";
    let dbMeta: string | undefined;
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = "DOWN";
      dbMeta = e instanceof Error ? e.message : String(e);
    }
    return {
      check: "Neon database",
      category: "SERVICE" as const,
      status: dbStatus,
      responseMs: Date.now() - dbStart,
      statusCode: null,
      meta: dbMeta,
    };
  })();

  const [coreResults, pageResults, renderResult, dbResult] = await Promise.all([
    mapPool(coreUrls, 6, async (url) => {
      const r = await timedFetch(url, "GET", url === keepaliveUrl ? 50000 : 15000);
      const status: HealthStatus =
        url === keepaliveUrl && r.status === 200 ? "UP" : classify(r.status, r.ms);
      return {
        check: url,
        category: "CORE" as const,
        status,
        responseMs: r.ms,
        statusCode: r.status,
        meta: r.error,
      };
    }),
    mapPool(locs, 8, async (url) => {
      const r = await timedFetch(url);
      return {
        check: url,
        category: "SITEMAP" as const,
        status: classify(r.status, r.ms),
        responseMs: r.ms,
        statusCode: r.status,
        meta: r.error,
      };
    }),
    renderPromise,
    dbPromise,
  ]);
  results.push(...coreResults, ...pageResults, renderResult, dbResult);

  await prisma.healthCheckLog.createMany({
    data: results.map((r) => ({
      runId,
      check: r.check,
      category: r.category,
      status: r.status,
      responseMs: r.responseMs,
      statusCode: r.statusCode,
      meta: r.meta ?? null,
    })),
  });

  await notifyTelegram(results, runId);

  await prisma.healthCheckLog.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - RETENTION_DAYS * 86400000) } },
  });

  const down = results.filter((r) => r.status === "DOWN");
  const degraded = results.filter((r) => r.status === "DEGRADED");
  const avgMs = Math.round(results.reduce((s, r) => s + r.responseMs, 0) / results.length);

  return { runId, total: results.length, up: results.length - down.length - degraded.length, down: down.length, degraded: degraded.length, avgMs };
}

async function notifyTelegram(results: HealthCheckResult[], runId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const prevRun = await prisma.healthCheckLog.findFirst({
    where: { runId: { not: runId } },
    orderBy: { createdAt: "desc" },
    select: { runId: true },
  });
  const prevDown = prevRun
    ? await prisma.healthCheckLog.findMany({
        where: { runId: prevRun.runId, status: "DOWN" },
        select: { check: true },
      })
    : [];
  const prevDownSet = new Set(prevDown.map((d) => d.check));

  const downNow = results.filter((r) => r.status === "DOWN");
  const downSet = new Set(downNow.map((r) => r.check));
  const newFailures = downNow.filter((r) => !prevDownSet.has(r.check));
  const recovered = prevDownSet.size > 0 && downSet.size === 0;

  let text: string | null = null;
  if (newFailures.length > 0) {
    const lines = newFailures
      .slice(0, 10)
      .map((r) => `• ${r.check} → ${r.statusCode ?? r.meta ?? "no response"} (${r.responseMs}ms)`);
    text =
      `🔴 <b>ToolPilot health</b> — ${newFailures.length} check(s) DOWN\n` +
      lines.join("\n") +
      (newFailures.length > 10 ? `\n…and ${newFailures.length - 10} more` : "") +
      `\n\nRun ${runId.slice(0, 8)} · <a href="${SITE_URL}/admin/health">Dashboard</a>`;
  } else if (recovered) {
    text = `🟢 <b>ToolPilot health</b> — recovered, all ${results.length} checks up\n\n<a href="${SITE_URL}/admin/health">Dashboard</a>`;
  }

  if (!text) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10000),
  }).catch(() => {});
}
