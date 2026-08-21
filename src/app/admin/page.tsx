import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users, Wrench, BarChart3, Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | ToolPilot",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
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

  const stats = [
    { label: "Contact Submissions", value: contacts, icon: Mail, href: "/admin/contacts", color: "text-blue-600 dark:text-blue-400" },
    { label: "Newsletter Subscribers", value: subscribers, icon: Users, href: "/admin/subscribers", color: "text-green-600 dark:text-green-400" },
    { label: "Blog Posts", value: posts, icon: Newspaper, href: "/admin/blog", color: "text-purple-600 dark:text-purple-400" },
    { label: "Tools", value: tools, icon: Wrench, href: "/tools", color: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Overview of your site data.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/admin/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Usage metrics, top tools, and engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Contacts</h2>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-gray-400">No contacts yet.</p>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((c, i) => (
                  <div key={i} className="flex items-start justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{c.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">{c.subject}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-4">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
