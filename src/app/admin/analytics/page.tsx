"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench, FileText, Mail, Users, TrendingUp,
  BarChart3, ArrowLeft, RefreshCw, Activity,
  CalendarDays, MousePointerClick,
} from "lucide-react";

interface ToolStat {
  slug: string;
  name: string;
  count: number;
}

interface RecentEvent {
  slug: string;
  name: string;
  path: string;
  createdAt: string;
}

interface DailyCount {
  date: string;
  count: number;
}

interface Analytics {
  tools: { total: number; published: number; draft: number };
  blog: { total: number; published: number };
  contacts: { total: number; recent: number };
  subscribers: { total: number; confirmed: number };
  leads: { total: number };
  overview: { today: number; week: number; month: number; total: number; distinctTools: number };
  daily: DailyCount[];
  topTools: ToolStat[];
  events: RecentEvent[];
  recentActivity: Record<string, number>;
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function istKey(iso: string): string {
  return new Date(new Date(iso).getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtDateKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
  });
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      const d = await res.json();
      setData(d);
      setUpdatedAt(new Date());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Failed to load analytics.
        <div className="mt-4">
          <button
            onClick={load}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, daily, topTools, events } = data;
  const maxDay = Math.max(1, ...daily.map((d) => d.count));
  const maxTool = Math.max(1, ...topTools.map((t) => t.count));

  const selectedDayEvents = selectedDay
    ? events.filter((e) => istKey(e.createdAt) === selectedDay)
    : [];
  const selectedDayCounts = new Map<string, number>();
  for (const e of selectedDayEvents) {
    selectedDayCounts.set(e.slug, (selectedDayCounts.get(e.slug) || 0) + 1);
  }
  const selectedDayTools = [...selectedDayCounts.entries()]
    .map(([slug, count]) => ({ slug, name: events.find((e) => e.slug === slug)?.name || slug, count }))
    .sort((a, b) => b.count - a.count);

  const stats = [
    { label: "Visits Today", value: overview.today, icon: Activity, color: "text-green-600 dark:text-green-400" },
    { label: "Last 7 Days", value: overview.week, icon: CalendarDays, color: "text-blue-600 dark:text-blue-400" },
    { label: "Last 30 Days", value: overview.month, icon: TrendingUp, color: "text-purple-600 dark:text-purple-400" },
    { label: "Total Tool Uses", value: overview.total, icon: MousePointerClick, color: "text-orange-600 dark:text-orange-400" },
    { label: "Published Tools", value: data.tools.published, icon: Wrench, color: "text-orange-600 dark:text-orange-400" },
    { label: "Blog Posts", value: data.blog.published, icon: FileText, color: "text-purple-600 dark:text-purple-400" },
    { label: "Subscribers", value: data.subscribers.total, icon: Users, color: "text-green-600 dark:text-green-400" },
    { label: "Contacts (7d)", value: data.contacts.recent, icon: Mail, color: "text-blue-600 dark:text-blue-400" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <Link href="/admin" className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {data.overview.distinctTools} tools used{updatedAt ? ` · Updated ${updatedAt.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true })} IST` : ""}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Daily Visits (30d)</h2>
            </div>
            <div className="flex h-44 items-end gap-1">
              {daily.map((d) => {
                const isSelected = selectedDay === d.date;
                const isToday = d.date === istKey(new Date().toISOString());
                return (
                  <button
                    key={d.date}
                    title={`${d.date} — ${d.count} visits`}
                    onClick={() => setSelectedDay(selectedDay === d.date ? null : d.date)}
                    className="group flex h-full flex-1 flex-col justify-end focus:outline-none"
                  >
                    <div
                      className={`w-full rounded-t transition-all ${
                        isSelected
                          ? "bg-blue-600"
                          : isToday
                          ? "bg-blue-500"
                          : "bg-blue-300 hover:bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-700"
                      }`}
                      style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-gray-400">
              {daily.length > 0 && (
                <>
                  <span>{fmtDateKey(daily[0].date)}</span>
                  <span>{fmtDateKey(daily[Math.floor(daily.length / 3)].date)}</span>
                  <span>{fmtDateKey(daily[Math.floor((daily.length * 2) / 3)].date)}</span>
                  <span>{fmtDateKey(daily[daily.length - 1].date)}</span>
                </>
              )}
            </div>
            <p className="mt-3 text-xs text-gray-400">Click a day bar to see which tools were used that day.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Most Used Tools</h2>
              <span className="ml-auto text-xs text-gray-400">{topTools.length} tools</span>
            </div>
            {topTools.length === 0 ? (
              <p className="text-sm text-gray-400">No usage data yet.</p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {topTools.map((t, i) => (
                  <div key={t.slug}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center min-w-0">
                        <span className="w-6 shrink-0 text-xs text-gray-400">{i + 1}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate" title={t.slug}>
                          {t.name}
                        </span>
                        <span className="ml-2 hidden text-xs text-gray-400 sm:inline">/tools/{t.slug}</span>
                      </span>
                      <span className="ml-2 shrink-0 text-gray-500 dark:text-gray-400">
                        {t.count}
                        <span className="ml-1 text-xs text-gray-400">
                          ({overview.total > 0 ? Math.round((t.count / overview.total) * 100) : 0}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${Math.round((t.count / maxTool) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MousePointerClick className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent Visits</h2>
              <span className="ml-auto text-xs text-gray-400">latest {events.length}</span>
            </div>
            {events.length === 0 ? (
              <p className="text-sm text-gray-400">No visits recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                {events.map((e, i) => (
                  <div
                    key={`${e.createdAt}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-gray-800"
                  >
                    <div className="flex items-center min-w-0">
                      <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{e.name}</span>
                      {e.path && e.path !== `/tools/${e.slug}` && (
                        <span className="ml-2 hidden text-xs text-gray-400 truncate md:inline">{e.path}</span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">{fmtTime(e.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {selectedDay ? `Visits on ${fmtDateKey(selectedDay)}` : "Day Breakdown"}
              </h2>
              {selectedDay && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="ml-auto text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  Clear
                </button>
              )}
            </div>
            {!selectedDay ? (
              <p className="text-sm text-gray-400">
                Click any bar in the Daily Visits chart to see the exact tools used that day, or pick a tool below to see its all-time breakdown.
              </p>
            ) : selectedDayTools.length === 0 ? (
              <p className="text-sm text-gray-400">No visit details available for this day (older than the most recent 200 events).</p>
            ) : (
              <div className="space-y-3">
                {selectedDayTools.map((t) => {
                  const pct = Math.round((t.count / (selectedDayEvents.length || 1)) * 100);
                  return (
                    <div key={t.slug}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{t.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{t.count}· {pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedDayEvents.length} total visits</span>
                  <span className="text-xs text-gray-400">{selectedDayTools.length} tools</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Content & Growth Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tools (Published / Total)</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{data.tools.published} / {data.tools.total} ({data.tools.draft} draft)</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Blog Posts (Published / Total)</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{data.blog.published} / {data.blog.total}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{data.leads.total}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Subscriber Confirmation Rate</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {data.subscribers.total > 0 ? Math.round((data.subscribers.confirmed / data.subscribers.total) * 100) : 0}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}