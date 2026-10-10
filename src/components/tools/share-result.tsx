"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Send, Twitter } from "lucide-react";

interface ShareResultProps {
  message: string;
  url?: string;
  title?: string;
}

export function ShareResult({ message, url, title = "ToolPilot" }: ShareResultProps) {
  const [copied, setCopied] = useState(false);
  const target = url || (typeof window !== "undefined" ? window.location.href : "");
  const text = `${message} ${target}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const shareNative = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text: message, url: target });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Share this result</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
        </a>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(target)}&text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 transition-colors"
        >
          <Send className="h-3.5 w-3.5" /> Telegram
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(target)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Twitter className="h-3.5 w-3.5" /> Post
        </a>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            onClick={shareNative}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        )}
      </div>
    </div>
  );
}