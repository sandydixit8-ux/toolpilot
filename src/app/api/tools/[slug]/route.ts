import { NextResponse } from "next/server";
import { getToolBySlug } from "@/config/tools";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Tool not found" } }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: tool });
}
