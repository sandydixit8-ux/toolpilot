import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}
