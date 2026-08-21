import { NextResponse } from "next/server";
import { allTools, getToolBySlug } from "@/config/tools";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");
  const search = searchParams.get("q");

  if (slug) {
    const tool = getToolBySlug(slug);
    if (!tool) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Tool not found" } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: tool });
  }

  let tools = [...allTools];
  if (category) tools = tools.filter((t) => t.categorySlug === category);
  if (search) {
    const q = search.toLowerCase();
    tools = tools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q))
    );
  }

  return NextResponse.json({ success: true, data: tools });
}
