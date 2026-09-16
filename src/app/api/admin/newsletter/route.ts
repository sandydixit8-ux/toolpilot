import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { isConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const [total, confirmed, campaigns] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
      prisma.newsletterCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    ]);

    return NextResponse.json({
      emailConfigured: isConfigured(),
      subscribers: { total, confirmed, pending: total - confirmed },
      campaigns: campaigns.map((c) => ({
        id: c.id,
        subject: c.subject,
        sentCount: c.sentCount,
        failedCount: c.failedCount,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[Admin Newsletter GET]", error);
    return NextResponse.json({ error: "Failed to load newsletter data" }, { status: 500 });
  }
}