import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyticsEventSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /bytespider/i,
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /anchorfree/i,
  /petalbot/i,
  /amazonbot/i,
  /applebot/i,
  /yandex/i,
  /baiduspider/i,
  /duckduckbot/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /twitterbot/i,
  /whatsapp/i,
  /slackbot/i,
  /telegrambot/i,
  /discordbot/i,
  /gptbot/i,
  /ccbot/i,
  /anthropic-ai/i,
  /claude-www/i,
  /dataforseo/i,
  /zelenka/i,
  /uptimerobot/i,
  /pingdom/i,
  /statuscake/i,
  /google-inspectiontool/i,
  /lighthouse/i,
  /phantom/i,
  /headlesschrome/i,
  /python-requests/i,
  /python-urllib/i,
  /aiohttp/i,
  /go-http-client/i,
  /okhttp/i,
  /node-fetch/i,
  /axios/i,
  /undici/i,
  /postmanruntime/i,
  /insomnia/i,
  /k6/i,
  /\bcurl\/?\d/i,
  /\bwget/i,
  /mozilla\/5\.0\s*$/, // bare UA without version details
];

function isBot(request: Request): boolean {
  const ua = request.headers.get("user-agent") || "";
  if (!ua.trim()) return true;
  if (BOT_PATTERNS.some((p) => p.test(ua))) return true;
  const secChUa = request.headers.get("sec-ch-ua") || "";
  return secChUa.includes("HeadlessChrome");
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

    await prisma.toolUsage.create({
      data: {
        toolSlug: page,
        metadata: JSON.stringify({ event, ...metadata }),
      },
    });

    return NextResponse.json({ success: true, data: { recorded: true } });
  } catch (error) {
    console.error("[Analytics Event]", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to record event" } },
      { status: 500 }
    );
  }
}
