import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * DB reachability probe. The Neon pooled endpoint can hang the Prisma engine
 * on IPv6; the pinned connect/socket timeouts in src/lib/prisma.ts force a
 * fast, real result. Used by operators/uptime checks to prove "Neon reachable
 * via Vercel API".
 */
export async function GET() {
  const t0 = Date.now();
  try {
    const rows = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1 as ok`;
    const database = rows && rows[0] && rows[0].ok === 1 ? "reachable" : "unreachable";
    return NextResponse.json({
      ok: true,
      service: "toolpilotpro-api",
      database,
      latencyMs: Date.now() - t0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "toolpilotpro-api",
        database: "unreachable",
        latencyMs: Date.now() - t0,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message.split("\n")[0] : String(error),
      },
      { status: 503 }
    );
  }
}