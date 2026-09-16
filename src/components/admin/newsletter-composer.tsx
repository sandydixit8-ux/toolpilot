"use client";

import { useState } from "react";
import { Send, Mail, Loader2, CheckCircle2, AlertTriangle, Globe } from "lucide-react";

interface Campaign {
  id: string;
  subject: string;
  sentCount: number;
  failedCount: number;
  createdAt: string;
}

export function NewsletterComposer({
  initial,
}: {
  initial: { subscribers: { total: number; confirmed: number; pending: number }; campaigns: Campaign[] };
}) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [busy, setBusy] = useState<null | "test" | "broadcast">(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initial.campaigns);

  const smtpHint =
    "SMTP not configured yet — set SMTP_HOST / SMTP_USER / SMTP_PASS in Vercel to enable sending.";

  const send = async (mode: "test" | "broadcast") => {
    if (!subject.trim() || !content.trim()) {
      setMessage({ type: "err", text: "Subject and content are required." });
      return;
    }
    setBusy(mode);
    setMessage(null);
    try {
      const body: Record<string, string> = { subject: subject.trim(), content: content.trim() };
      if (mode === "test") body.testEmail = testEmail.trim() || (initial as { adminEmail?: string } & typeof initial).adminEmail || "";
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Failed to send." });
      } else if (data.mode === "test") {
        setMessage(
          data.sent
            ? { type: "ok", text: "Test email sent." }
            : { type: "err", text: data.error || "Test email could not be sent (SMTP error)." }
        );
      } else {
        setMessage({
          type: "ok",
          text: `Broadcast sent: ${data.sent}/${data.total} delivered${data.failed ? `, ${data.failed} failed` : ""}.`,
        });
        setCampaigns((prev) => [
          {
            id: data.campaignId,
            subject: subject.trim(),
            sentCount: data.sent,
            failedCount: data.failed,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch {
      setMessage({ type: "err", text: "Network error — try again." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Weekly tools roundup — free picks for productivity"
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder={"Write your newsletter. Blank lines create paragraphs, links are shown as plain text.\n\nExample:\nThis week we added ArticleAI summarizer and fixed search across all 88 tools.\n\nBookmark your favourites: /tools"}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Test email (optional)</span>
          <input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => send("broadcast")}
            disabled={busy !== null}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy === "broadcast" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send to {initial.subscribers.confirmed} confirmed
          </button>
          <button
            onClick={() => send("test")}
            disabled={busy !== null}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {busy === "test" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Send test
          </button>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              message.type === "ok"
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {message.type === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          <Globe className="h-4 w-4 shrink-0" />
          {smtpHint}
        </div>
      </div>

      <div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Campaign History</h2>
          </div>
          {campaigns.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400">No campaigns sent yet.</p>
          ) : (
            <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
              {campaigns.map((c) => (
                <li key={c.id} className="px-4 py-3">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{c.subject}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ·
                    {c.sentCount} delivered{c.failedCount ? ` · ${c.failedCount} failed` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}