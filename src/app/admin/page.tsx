import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-page-auth";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin Dashboard | ToolPilot",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  await requireAdminPage();
  const [contacts, subscribers, posts, tools, recentContacts] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.newsletterSubscriber.count(),
    prisma.blogPost.count(),
    prisma.tool.count(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { name: true, email: true, subject: true, createdAt: true },
    }),
  ]);

  return (
    <AdminDashboardClient
      contacts={contacts}
      subscribers={subscribers}
      posts={posts}
      tools={tools}
      recentContacts={recentContacts.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
