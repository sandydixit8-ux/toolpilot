"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon, Calculator, Briefcase, Building2, Code2, Sparkles, Languages, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tilt } from "@/components/motion/tilt";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { CATEGORIES } from "@/lib/constants";
import { allTools } from "@/config/tools";
import type { ReactNode } from "react";

const categoryIcons: Record<string, ReactNode> = {
  pdf: <FileText className="h-6 w-6" />,
  image: <ImageIcon className="h-6 w-6" />,
  calculators: <Calculator className="h-6 w-6" />,
  career: <Briefcase className="h-6 w-6" />,
  business: <Building2 className="h-6 w-6" />,
  developer: <Code2 className="h-6 w-6" />,
  ai: <Sparkles className="h-6 w-6" />,
  translation: <Languages className="h-6 w-6" />,
  video: <Video className="h-6 w-6" />,
};

export function CategoryGrid() {
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const tool of allTools) m[tool.categorySlug] = (m[tool.categorySlug] || 0) + 1;
    return m;
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Browse by Category</h2>
          <p className="mt-1 text-muted-foreground">Find the right tool for your task</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tools" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={0.05}>
        {CATEGORIES.map((cat) => (
          <StaggerItem key={cat.slug}>
            <Tilt max={5} scale={1.015}>
              <Link href={`/tools/${cat.slug}`} className="card card-morph group block h-full p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-600/25 text-blue-400 transition-all group-hover:from-blue-500 group-hover:to-violet-600 group-hover:text-white">
                    {categoryIcons[cat.slug]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{cat.description}</p>
                    <p className="mt-3 text-xs font-medium text-blue-400">
                      {counts[cat.slug] ?? 0} tools →
                    </p>
                  </div>
                </div>
              </Link>
            </Tilt>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}