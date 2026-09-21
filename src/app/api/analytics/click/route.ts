import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isBot, getClientIp, isBurst } from "@/lib/analytics-guard";

export const dynamic = "force-dynamic";

interface ClickBody {
  product?: string;
  url?: string;
  source?: string;
  path?: string;
}

export async function POST(request: Request) {
  try {
    if (isBot(request)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    const body = (await request.json().catch(() => ({}))) as ClickBody;

    const product = typeof body.product === "string" && body.product.length <= 200 ? body.product : "";
    const url = typeof body.url === "string" && body.url.length <= 2000 ? body.url : "";
    const source = typeof body.source === "string" && body.source.length <= 500 ? body.source : null;
    const path = typeof body.path === "string" && body.path.length <= 500 ? body.path : null;

    if (!product || !url) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    const ip = getClientIp(request);
    if (isBurst(ip)) {
      return NextResponse.json({ success: true, data: { recorded: false } });
    }

    await prisma.affiliateClick.create({
      data: {
        product: product.slice(0, 200),
        url: url.slice(0, 2000),
        source,
        path,
      },
    });

    return NextResponse.json({ success: true, data: { recorded: true } });
  } catch (error) {
    console.error("[Affiliate Click]", error);
    return NextResponse.json({ success: true, data: { recorded: false } });
  }
}