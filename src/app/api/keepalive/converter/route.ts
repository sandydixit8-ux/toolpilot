import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RENDER_URL = process.env.CONVERTER_SERVICE_URL || 'https://toolpilot-5b6c.onrender.com';

export async function GET() {
  const started = Date.now();
  const ok = await fetch(`${RENDER_URL}/`, {
    signal: AbortSignal.timeout(55000),
    cache: "no-store",
  })
    .then((r) => r.status > 0)
    .catch(() => false);
  return NextResponse.json({ ok, ms: Date.now() - started });
}