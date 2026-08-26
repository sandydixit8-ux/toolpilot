'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users, Wrench, BarChart3, Newspaper, DollarSign } from "lucide-react";
import { useI18n } from "@/components/i18n";
import type { LucideIcon } from "lucide-react";

interface Stat {
  labelKey: string;
  value: number;
  icon: LucideIcon;
  href: string;
  color: string;
}

interface RecentContact {
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

export function AdminDashboardClient({
  contacts,
  subscribers,
  posts,
  tools,
  recentContacts,
}: {
  contacts: number;
  subscribers: number;
  posts: number;
  tools: number;
  recentContacts: RecentContact[];
}) {
  const { t, locale } = useI18n();

  const stats: Stat[] = [
    { labelKey: "admin.contacts", value: contacts, icon: Mail, href: "/admin/contacts", color: "text-blue-600 dark:text-blue-400" },
    { labelKey: "admin.subscribers", value: subscribers, icon: Users, href: "/admin/subscribers", color: "text-green-600 dark:text-green-400" },
    { labelKey: "admin.blogPosts", value: posts, icon: Newspaper, href: "/admin/blog", color: "text-purple-600 dark:text-purple-400" },
    { labelKey: "admin.tools", value: tools, icon: Wrench, href: "/tools", color: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t("admin.dashboard")}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{t("admin.overview")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.labelKey} href={stat.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t(stat.labelKey)}</p>
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
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("admin.analytics")}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("admin.analyticsDesc")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/revenue">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("admin.revenue")}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("admin.revenueDesc")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t("admin.recentContacts")}</h2>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-gray-400">{t("admin.noContacts")}</p>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((c, i) => (
                  <div key={i} className="flex items-start justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{c.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">{c.subject}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-4">{new Date(c.createdAt).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US')}</span>
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
