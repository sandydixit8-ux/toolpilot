import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyticsEventSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

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
