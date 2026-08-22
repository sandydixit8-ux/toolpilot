"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, TrendingUp } from "lucide-react";

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
}

export function AffiliatePromo({ title = "Recommended Tools", items, className }: AffiliatePromoProps) {
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
                  {item.rating && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < item.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer nofollow">
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
