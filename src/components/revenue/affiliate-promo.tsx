"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp } from "lucide-react";

interface AffiliateItem {
  name: string;
  description: string;
  url: string;
  ctaText?: string;
  rating?: number;
  badge?: string;
}

interface AffiliatePromoProps {
  title?: string;
  items: AffiliateItem[];
  className?: string;
  tracking?: { source: string; path?: string };
}

function trackClick(item: AffiliateItem, tracking?: { source: string; path?: string }) {
  try {
    const payload = JSON.stringify({
      product: item.name,
      url: item.url,
      source: tracking?.source || "",
      path: tracking?.path || "",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics/click",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      void fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // tracking is best-effort; never block navigation
  }
}

export function AffiliatePromo({ title = "Recommended Tools", items, className, tracking }: AffiliatePromoProps) {
  if (!items.length) return null;

  return (
    <div className={`my-8 ${className || ""}`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <Card key={i} className="border-orange-200 dark:border-orange-800/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{item.name}</h4>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs" asChild>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    onClick={() => trackClick(item, tracking)}
                  >
                    {item.ctaText || "Try"} <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 text-center">Affiliate links — we may earn a commission at no cost to you</p>
    </div>
  );
}