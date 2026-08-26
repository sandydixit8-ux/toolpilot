import { NextResponse } from 'next/server';

const RENDER_URL = process.env.CONVERTER_SERVICE_URL;

export async function GET() {
  if (!RENDER_URL) {
    return NextResponse.json({ ok: false, error: 'No CONVERTER_SERVICE_URL set' });
  }

  try {
    const res = await fetch(`${RENDER_URL}/health`, {
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json();
    return NextResponse.json({ ok: true, render: data });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ ok: false, error: error.message });
  }
}
