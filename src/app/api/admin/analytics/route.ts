import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { allTools } from "@/config/tools";

export const dynamic = "force-dynamic";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function istKey(d: Date): string {
  return new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date(Date.now() + IST_OFFSET_MS);
  const todayUtc = new Date(now.toISOString().slice(0, 10));
  for (let i = n - 1; i >= 0; i--) {
    days.push(istKey(new Date(todayUtc.getTime() - i * 86400000)));
  }
  return days;
}

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const nameMap = new Map(allTools.map((t) => [t.slug, t.name]));

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
      events,
      monthRows,
      topTools,
      totalUsage,
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
      prisma.toolUsage.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: { toolSlug: true, metadata: true, createdAt: true },
      }),
      prisma.toolUsage.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        select: { createdAt: true },
      }),
      prisma.toolUsage.groupBy({
        by: ["toolSlug"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.toolUsage.count(),
    ]);

    const dayBuckets = new Map<string, number>();
    for (const r of monthRows) {
      const k = istKey(r.createdAt);
      dayBuckets.set(k, (dayBuckets.get(k) || 0) + 1);
    }
    const daily = lastNDays(30).map((date) => ({ date, count: dayBuckets.get(date) || 0 }));

    const totalByDay = daily.map((d) => d.count).reduce((a, b) => a + b, 0);
    const todayKey = istKey(new Date());
    const todayCount = dayBuckets.get(todayKey) || 0;

    const toolsWithCounts = topTools.map((t) => ({
      slug: t.toolSlug,
      name: nameMap.get(t.toolSlug) || t.toolSlug,
      count: t._count.id,
    }));

    const eventList = events.map((e) => {
      let path = "";
      try {
        const meta = JSON.parse(e.metadata || "{}");
        path = typeof meta.path === "string" ? meta.path : "";
      } catch {
        path = "";
      }
      return {
        slug: e.toolSlug,
        name: nameMap.get(e.toolSlug) || e.toolSlug,
        path,
        createdAt: e.createdAt.toISOString(),
      };
    });

    const recentActivity = recentUsages.reduce<Record<string, number>>((acc, u) => {
      acc[u.toolSlug] = (acc[u.toolSlug] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json(
      {
        tools: { total: totalTools, published: publishedTools, draft: draftTools },
        blog: { total: totalBlogPosts, published: publishedPosts },
        contacts: { total: totalContacts, recent: unreadContacts },
        subscribers: { total: totalSubscribers, confirmed: confirmedSubscribers },
        leads: { total: totalLeads },
        overview: {
          today: todayCount,
          week: daily.slice(-7).reduce((a, d) => a + d.count, 0),
          month: totalByDay,
          total: totalUsage,
          distinctTools: topTools.length,
        },
        daily,
        topTools: toolsWithCounts,
        events: eventList,
        recentActivity,
      },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("[Admin Analytics]", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}