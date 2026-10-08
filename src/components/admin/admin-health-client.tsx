"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface CheckItem {
  check: string;
  category: string;
  status: "UP" | "DEGRADED" | "DOWN";
  responseMs: number;
  statusCode: number | null;
  meta: string | null;
}

interface LatestRun {
  runId: string;
  startedAt: string;
  total: number;
  up: number;
  degraded: number;
  down: number;
  avgMs: number;
  checks: CheckItem[];
}

interface RunSummary {
  runId: string;
  startedAt: string;
  total: number;
  up: number;
  degraded: number;
  down: number;
  avgMs: number;
}

interface FailureRow {
  check: string;
  statusCode: number | null;
  responseMs: number;
  meta: string | null;
  runId: string;
  createdAt: string;
}

function ist(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

function statusDot(status: string) {
  if (status === "UP") return "bg-emerald-500";
  if (status === "DEGRADED") return "bg-amber-500";
  return "bg-red-500";
}

const CATEGORY_LABELS: Record<string, string> = {
  CORE: "Core pages & APIs",
  SERVICE: "Services (DB, converter)",
  SITEMAP: "All sitemap pages",
};

export function AdminHealthClient() {
  const [data, setData] = useState<{ latest: LatestRun | null; history: RunSummary[]; failures24h: FailureRow[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  const runNow = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/admin/health/run", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "run failed");
    } finally {
      setRunning(false);
    }
  };

  const latest = data?.latest ?? null;
  const overall = !latest ? "UNKNOWN" : latest.down > 0 ? "DOWN" : latest.degraded > 0 ? "DEGRADED" : "UP";

  const grouped = (latest?.checks ?? []).reduce<Record<string, CheckItem[]>>((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Site Health</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {latest ? `Last run ${ist(latest.startedAt)} IST · auto-refresh 60s` : "No runs yet"}
              </p>
            </div>
            <span
              className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                overall === "UP"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : overall === "DEGRADED"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    : overall === "DOWN"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${overall === "UP" ? "bg-emerald-500" : overall === "DEGRADED" ? "bg-amber-500" : overall === "DOWN" ? "bg-red-500" : "bg-gray-400"}`} />
              {overall === "UP" ? "All systems go" : overall}
            </span>
          </div>
          <button
            onClick={runNow}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 text-sm font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
            {running ? "Running full sweep…" : "Run check now"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="text-center py-20 text-gray-500">Loading…</div>
        ) : (
          <>
            {latest && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: "Checks", value: latest.total, cls: "text-gray-900 dark:text-gray-100" },
                  { label: "Up", value: latest.up, cls: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Degraded", value: latest.degraded, cls: "text-amber-600 dark:text-amber-400" },
                  { label: "Down", value: latest.down, cls: "text-red-600 dark:text-red-400" },
                  { label: "Avg response", value: `${latest.avgMs}ms`, cls: "text-blue-600 dark:text-blue-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
                    <p className={`mt-1 text-2xl font-bold ${s.cls}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {data && data.history.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Last {data.history.length} runs (24h)</p>
                <div className="flex flex-wrap gap-1">
                  {[...data.history].reverse().map((r) => {
                    const cls = r.down > 0 ? "bg-red-500" : r.degraded > 0 ? "bg-amber-500" : "bg-emerald-500";
                    return (
                      <div
                        key={r.runId}
                        title={`${ist(r.startedAt)} · ${r.up}/${r.total} up · avg ${r.avgMs}ms`}
                        className={`h-6 w-2.5 rounded-sm ${cls}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {data && data.failures24h.length > 0 && (
              <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-white dark:bg-gray-900 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
                  <AlertTriangle className="h-4 w-4" /> Failures in last 24h
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        <th className="py-2 pr-4">Time (IST)</th>
                        <th className="py-2 pr-4">Check</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.failures24h.map((f, i) => (
                        <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                          <td className="py-2 pr-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{ist(f.createdAt)}</td>
                          <td className="py-2 pr-4 break-all">{f.check}</td>
                          <td className="py-2 pr-4">{f.statusCode ?? f.meta ?? "timeout"}</td>
                          <td className="py-2">{f.responseMs}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {Object.keys(grouped).map((cat) => (
              <div key={cat} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {CATEGORY_LABELS[cat] ?? cat}{" "}
                  <span className="font-normal text-gray-400">({grouped[cat].length})</span>
                </p>
                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {grouped[cat].map((c) => (
                    <div key={c.check} className="flex items-center gap-3 py-1.5 text-sm">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot(c.status)}`} />
                      {c.status === "UP" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      ) : c.status === "DEGRADED" ? (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                      )}
                      <span className="break-all flex-1 text-gray-700 dark:text-gray-300">{c.check}</span>
                      <span className="text-gray-400 tabular-nums">{c.responseMs}ms</span>
                      <span className="text-gray-400 tabular-nums w-12 text-right">{c.statusCode ?? "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {!latest && (
              <div className="text-center py-16 text-gray-500">
                No health data yet. GitHub Actions cron ya “Run check now” se pehla run chalega.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
