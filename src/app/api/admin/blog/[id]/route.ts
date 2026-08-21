import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { blogPostSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: Props) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, slug, content, excerpt, author, categoryId, seoTitle, seoDescription, status } = parsed.data;

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existingSlug = await prisma.blogPost.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== id) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        author: author || "ToolPilot Team",
        categoryId: categoryId || null,
        seoTitle,
        seoDescription,
        status: status || "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    return NextResponse.json(post);
  } catch (error: unknown) {
    console.error("[Admin Blog PUT]", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[Admin Blog DELETE]", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
