import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const [
      totalTools,
      publishedTools,
      draftTools,
      totalBlogPosts,
      publishedPosts,
      totalContacts,
      unreadContacts,
      totalSubscribers,
      confirmedSubscribers,
      totalLeads,
      recentUsages,
      topTools,
      totalUsage,
      contactsByDay,
    ] = await Promise.all([
      prisma.tool.count(),
      prisma.tool.count({ where: { status: "PUBLISHED" } }),
      prisma.tool.count({ where: { status: "DRAFT" } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
      prisma.lead.count(),
      prisma.toolUsage.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { toolSlug: true, createdAt: true },
      }),
      prisma.toolUsage.groupBy({
        by: ["toolSlug"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.toolUsage.count(),
      prisma.contactSubmission.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    const recentActivity = recentUsages.reduce<Record<string, number>>((acc, u) => {
      acc[u.toolSlug] = (acc[u.toolSlug] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      tools: { total: totalTools, published: publishedTools, draft: draftTools },
      blog: { total: totalBlogPosts, published: publishedPosts },
      contacts: { total: totalContacts, recent: unreadContacts },
      subscribers: { total: totalSubscribers, confirmed: confirmedSubscribers },
      leads: { total: totalLeads },
      topTools: topTools.map((t) => ({ slug: t.toolSlug, count: t._count.id })),
      totalUsage,
      recentActivity,
      contactsByDay: contactsByDay.length,
    });
  } catch (error) {
    console.error("[Admin Analytics]", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
