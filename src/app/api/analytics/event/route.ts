import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, page, metadata } = body;

    if (!event || !page) {
      return NextResponse.json({ success: false, error: { code: "INVALID_INPUT", message: "event and page are required" } }, { status: 400 });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, page, metadata);
    }

    return NextResponse.json({ success: true, data: { recorded: true } });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to record event" } }, { status: 500 });
  }
}
