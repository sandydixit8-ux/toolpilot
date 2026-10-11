"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Tilt } from "@/components/motion/tilt";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { getFeaturedTools } from "@/config/tools";

export function FeaturedGrid() {
  const featured = getFeaturedTools();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        Featured Tools
      </h2>
      <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
        {featured.map((tool) => (
          <StaggerItem key={tool.slug}>
            <Tilt max={5} scale={1.02}>
              <Link href={`/tools/${tool.slug}`} className="card card-morph group block h-full p-6">
                <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500" />
                <p className="mt-4 text-xs font-medium text-blue-400">{tool.category}</p>
                <h3 className="mt-1 text-lg font-bold text-foreground">{tool.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{tool.longDescription}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-400">
                  Try it now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Tilt>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}