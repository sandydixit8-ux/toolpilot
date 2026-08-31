"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench, FileText, Mail, Users, TrendingUp,
  BarChart3, ArrowLeft,
} from "lucide-react";

interface Analytics {
  tools: { total: number; published: number; draft: number };
  blog: { total: number; published: number };
  contacts: { total: number; recent: number };
  subscribers: { total: number; confirmed: number };
  leads: { total: number };
  topTools: { slug: string; count: number }[];
  totalUsage: number;
  recentActivity: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-gray-500">Failed to load analytics.</div>;

  const stats = [
    { label: "Published Tools", value: data.tools.published, icon: Wrench, color: "text-orange-600 dark:text-orange-400" },
    { label: "Blog Posts", value: data.blog.published, icon: FileText, color: "text-purple-600 dark:text-purple-400" },
    { label: "Contacts (7d)", value: data.contacts.recent, icon: Mail, color: "text-blue-600 dark:text-blue-400" },
    { label: "Subscribers", value: data.subscribers.total, icon: Users, color: "text-green-600 dark:text-green-400" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Site-wide usage and engagement metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <s.icon className={`h-6 w-6 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Most Used Tools</h2>
            </div>
            {data.topTools.length === 0 ? (
              <p className="text-sm text-gray-400">No usage data yet.</p>
            ) : (
              <div className="space-y-3">
                {data.topTools.map((t) => {
                  const maxCount = data.topTools[0]?.count || 1;
                  const pct = Math.round((t.count / maxCount) * 100);
                  return (
                    <div key={t.slug}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{t.slug}</span>
                        <span className="text-gray-500 dark:text-gray-400">{t.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Total Tool Uses</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{data.totalUsage}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Content Overview</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tools (Published / Total)</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.tools.published} / {data.tools.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Blog Posts (Published / Total)</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.blog.published} / {data.blog.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Leads</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.leads.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subscriber Confirmation Rate</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {data.subscribers.total > 0 ? Math.round((data.subscribers.confirmed / data.subscribers.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Contact Submissions</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.contacts.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
