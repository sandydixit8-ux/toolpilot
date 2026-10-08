import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const HOUR_MS = 3600000;

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const latestLog = await prisma.healthCheckLog.findFirst({
      orderBy: { createdAt: "desc" },
      select: { runId: true, createdAt: true },
    });

    let latest = null;
    let history: Array<{
      runId: string;
      startedAt: string;
      total: number;
      up: number;
      degraded: number;
      down: number;
      avgMs: number;
    }> = [];

    if (latestLog) {
      const checks = await prisma.healthCheckLog.findMany({
        where: { runId: latestLog.runId },
        orderBy: { category: "asc" },
      });
      latest = {
        runId: latestLog.runId,
        startedAt: latestLog.createdAt.toISOString(),
        total: checks.length,
        up: checks.filter((c) => c.status === "UP").length,
        degraded: checks.filter((c) => c.status === "DEGRADED").length,
        down: checks.filter((c) => c.status === "DOWN").length,
        avgMs: Math.round(checks.reduce((s, c) => s + c.responseMs, 0) / (checks.length || 1)),
        checks: checks.map((c) => ({
          check: c.check,
          category: c.category,
          status: c.status,
          responseMs: c.responseMs,
          statusCode: c.statusCode,
          meta: c.meta,
        })),
      };

      const runGroups = await prisma.$queryRaw<Array<{ runId: string; startedAt: Date; total: bigint; up: bigint; degraded: bigint; down: bigint; avgMs: number }>>`
        SELECT "runId",
               MIN("createdAt") AS "startedAt",
               COUNT(*) AS total,
               COUNT(*) FILTER (WHERE status = 'UP') AS up,
               COUNT(*) FILTER (WHERE status = 'DEGRADED') AS degraded,
               COUNT(*) FILTER (WHERE status = 'DOWN') AS down,
               ROUND(AVG("responseMs")) AS "avgMs"
        FROM "HealthCheckLog"
        WHERE "createdAt" > NOW() - INTERVAL '24 hours'
        GROUP BY "runId"
        ORDER BY MIN("createdAt") DESC
        LIMIT 48
      `;
      history = runGroups.map((g) => ({
        runId: g.runId,
        startedAt: g.startedAt.toISOString(),
        total: Number(g.total),
        up: Number(g.up),
        degraded: Number(g.degraded),
        down: Number(g.down),
        avgMs: Number(g.avgMs),
      }));
    }

    const since = new Date(Date.now() - 24 * HOUR_MS);
    const failures24h = await prisma.healthCheckLog.findMany({
      where: { status: "DOWN", createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { check: true, statusCode: true, responseMs: true, meta: true, createdAt: true, runId: true },
    });

    return NextResponse.json({
      latest,
      history,
      failures24h: failures24h.map((f) => ({
        check: f.check,
        statusCode: f.statusCode,
        responseMs: f.responseMs,
        meta: f.meta,
        runId: f.runId,
        createdAt: f.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("health GET failed:", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
