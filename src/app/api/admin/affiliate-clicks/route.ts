import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const now = Date.now();
    const [total, todayCount, last7Count, last30Count, topProducts, recent] = await Promise.all([
      prisma.affiliateClick.count(),
      prisma.affiliateClick.count({ where: { createdAt: { gte: new Date(now - DAY_MS) } } }),
      prisma.affiliateClick.count({ where: { createdAt: { gte: new Date(now - 7 * DAY_MS) } } }),
      prisma.affiliateClick.count({ where: { createdAt: { gte: new Date(now - 30 * DAY_MS) } } }),
      prisma.affiliateClick.groupBy({
        by: ["product"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.affiliateClick.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    ]);

    return NextResponse.json({
      total,
      today: todayCount,
      last7: last7Count,
      last30: last30Count,
      topProducts: topProducts.map((p) => ({ product: p.product, count: p._count.id })),
      recent: recent.map((r) => ({
        product: r.product,
        source: r.source,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[Admin Affiliate Clicks]", error);
    return NextResponse.json({ error: "Failed to load affiliate clicks" }, { status: 500 });
  }
}