"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { getPopularTools } from "@/config/tools";

export function PopularGrid() {
  const popular = getPopularTools();

  return (
    <section id="popular" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white">
            <TrendingUp className="h-5 w-5" />
          </span>
          Popular Tools
        </h2>
        <p className="mt-1 text-muted-foreground">Most used tools by our users</p>
      </div>
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={0.04}>
        {popular.map((tool) => (
          <StaggerItem key={tool.slug}>
            <Link href={`/tools/${tool.slug}`} className="card card-morph group block h-full p-5">
              <p className="mb-2 text-xs font-medium text-blue-400">{tool.category}</p>
              <h3 className="group-hover:text-blue-400 transition-colors font-semibold text-foreground">{tool.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}