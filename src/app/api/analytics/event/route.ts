import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { analyticsEventSchema } from "@/lib/validations";
import { getClientIp, getCountry, isBot, isBurst, IST_OFFSET_MS } from "@/lib/analytics-guard";

export const dynamic = "force-dynamic";

const DAY_CAP = 15;

async function isOverDailyCap(ip: string): Promise<boolean> {
  try {
    const date = new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10);
    const id = `${ip}|${date}`;
    const row = await prisma.usageThrottle.upsert({
      where: { ipDate: id },
      create: { ipDate: id, ip, date, count: 1 },
      update: { count: { increment: 1 } },
    });
    return row.count > DAY_CAP;
  } catch (error) {
    console.error("[Analytics Event] throttle check failed", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = analyticsEventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "event and page are required" } },
        { status: 400 }
      );
    }

    if (isBot(request)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    const { event, page, metadata } = result.data;

    // Automation (Playwright, Selenium, most scrapers) sets navigator.webdriver.
    // Their UA is often a clean Chrome string, so this is the only reliable
    // signal and keeps local/CI testing out of production analytics.
    if (metadata?.automated === true) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    const ua = request.headers.get("user-agent") || "unknown";
    const ip = getClientIp(request);
    const country = getCountry(request);

    if (isBurst(ip)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    if (await isOverDailyCap(ip)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    try {
      await prisma.toolUsage.create({
        data: {
          toolSlug: page,
          metadata: JSON.stringify({ event, ...metadata, ua, ip, country }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        return NextResponse.json({ success: true, data: { recorded: false } });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: { recorded: true } });
  } catch (error) {
    console.error("[Analytics Event]", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to record event" } },
      { status: 500 }
    );
  }
}
