"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, FileText, Calculator, Briefcase, Zap, TrendingUp, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tilt } from "@/components/motion/tilt";
import { Floating } from "@/components/motion/floating";
import { AnimatedGradientText } from "@/components/motion/animated-gradient-text";
import { searchTools } from "@/config/tools";
import { cn } from "@/lib/utils";

const stats = [
  { value: "91", label: "Free tools" },
  { value: "9", label: "Categories" },
  { value: "100%", label: "Browser-side" },
  { value: "₹0", label: "Forever" },
];

function HeroChip({
  icon,
  title,
  sub,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none w-44 rounded-2xl border border-border bg-card p-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)]", className)}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/90 to-violet-600/90 text-white">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">{title}</p>
          <p className="truncate text-[10px] text-muted-foreground">{sub}</p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.trim().length >= 2 ? searchTools(query).slice(0, 5) : []), [query]);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -right-24 top-10 h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              Free forever · No signup · Private by design
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              All Your Daily Tools in{" "}
              <AnimatedGradientText>One Place</AnimatedGradientText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:mx-0"
            >
              91 free tools for PDF, images, money, career & development. Fast, simple and private — your files never
              leave your browser.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
            >
              <Button size="xl" asChild>
                <Link href="/tools" className="gap-2">
                  Explore All Tools
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="#popular">Popular Tools</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="mt-10"
            >
              <div className="relative">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.7)]">
                  <SearchGlyph />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try “income tax”, “PDF”, “ATS”…"
                    aria-label="Search tools on home"
                    className="h-10 w-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="hidden select-none rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                    ↵
                  </kbd>
                </div>
                {results.length > 0 && (
                  <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                    {results.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent"
                      >
                        <Sparkles className="h-4 w-4 shrink-0 text-blue-400" />
                        <span className="font-medium text-foreground">{tool.name}</span>
                        <span className="ml-auto truncate text-xs text-muted-foreground">{tool.category}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl font-bold text-foreground">{s.value}</dd>
                    <dd className="text-xs text-muted-foreground">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <Tilt max={9} scale={1.015} className="relative h-[430px] w-full">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-500 to-violet-600 opacity-90 blur-[2px] shadow-[0_40px_90px_-24px_rgba(37,99,235,0.55)]" style={{ transform: "translateZ(0px)" }} />
              <div
                className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-blue-500/90 to-violet-600/90 p-5 text-white shadow-2xl"
                style={{ transform: "translateZ(60px)" }}
              >
                <div className="flex items-center justify-between text-sm">
                  <Zap className="h-5 w-5 fill-current" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80">Live</span>
                </div>
                <p className="mt-4 text-2xl font-bold">₹17,994<span className="text-sm font-medium text-white/70"> /mo</span></p>
                <p className="text-xs text-white/80">Home loan EMI</p>
                <div className="mt-4 flex items-end gap-1" aria-hidden>
                  {[38, 52, 46, 62, 58, 74, 68, 82].map((h, i) => (
                    <span
                      key={i}
                      className="w-2 rounded-sm bg-white/40"
                      style={{ height: `${h * 0.5}px` }}
                    />
                  ))}
                </div>
              </div>
              <Floating className="absolute -left-2 top-16" amplitude={10} duration={5}>
                <HeroChip icon={<FileText className="h-4 w-4" />} title="PDF Compressor" sub="12.4 MB → 2.1 MB" className="z-10" />
              </Floating>
              <Floating className="absolute right-2 top-8" amplitude={12} duration={6.5} delay={0.4}>
                <HeroChip icon={<Briefcase className="h-4 w-4" />} title="ATS Checker" sub="Score: 92%" className="z-10" />
              </Floating>
              <Floating className="absolute bottom-8 -left-1" amplitude={9} duration={5.6} delay={0.2}>
                <HeroChip icon={<Calculator className="h-4 w-4" />} title="GST Calculator" sub="CGST + SGST split" className="z-10" />
              </Floating>
              <Floating className="absolute bottom-24 right-0" amplitude={11} duration={7} delay={0.6}>
                <HeroChip icon={<TrendingUp className="h-4 w-4" />} title="Word Counter" sub="1,240 words" className="z-10" />
              </Floating>
            </Tilt>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 lg:hidden" aria-hidden>
          {["PDF", "EMI", "ATS", "GST", "Word Count", "Resume Builder"].map((label) => (
            <span key={label} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchGlyph() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white">
      <Search className="h-4 w-4" aria-hidden />
    </span>
  );
}