import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, getCountry, isBot, istDateKey } from "@/lib/analytics-guard";

export const dynamic = "force-dynamic";

const schema = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(500).optional(),
  automated: z.boolean().optional(),
});

const DAY_CAP = 500;
const BURST_WINDOW_MS = 60_000;
const BURST_MAX = 40;

const burstTracker = new Map<string, { start: number; count: number }>();

function isBurst(ip: string): boolean {
  const now = Date.now();
  const track = burstTracker.get(ip);
  if (!track || now - track.start > BURST_WINDOW_MS) {
    burstTracker.set(ip, { start: now, count: 1 });
    if (burstTracker.size > 50_000) burstTracker.clear();
    return false;
  }
  track.count += 1;
  return track.count > BURST_MAX;
}

async function isOverDailyCap(ip: string): Promise<boolean> {
  try {
    const date = istDateKey();
    const id = `${ip}|${date}|pv`;
    const row = await prisma.usageThrottle.upsert({
      where: { ipDate: id },
      create: { ipDate: id, ip, date, count: 1 },
      update: { count: { increment: 1 } },
    });
    return row.count > DAY_CAP;
  } catch (error) {
    console.error("[Analytics PageView] throttle check failed", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "invalid input" }, { status: 400 });
    }

    if (isBot(request)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    // Browser automation (Playwright, Selenium, scrapers) reports
    // navigator.webdriver. Such clients carry a normal Chrome UA, so this flag
    // is what keeps test runs out of the production numbers.
    if (parsed.data.automated) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    const ip = getClientIp(request);
    if (isBurst(ip)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }
    if (await isOverDailyCap(ip)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    const path = parsed.data.path.split("?")[0].slice(0, 300);
    await prisma.pageView.create({
      data: {
        path,
        referrer: parsed.data.referrer ? parsed.data.referrer.slice(0, 500) : null,
        country: getCountry(request),
      },
    });

    return NextResponse.json({ success: true, data: { recorded: true } });
  } catch (error) {
    console.error("[Analytics PageView]", error);
    return NextResponse.json({ success: false, error: "failed" }, { status: 500 });
  }
}
