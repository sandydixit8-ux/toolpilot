"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Zap, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/motion/animated-gradient-text";
import { Floating } from "@/components/motion/floating";
import { allTools } from "@/config/tools";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-blue-600 via-blue-700 to-violet-800 px-6 py-16 text-center text-white sm:px-12"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/30 blur-[90px]" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-violet-400/30 blur-[90px]" />
        </div>
        <Floating className="absolute left-6 top-8 hidden sm:block" amplitude={8} duration={6}>
          <Zap className="h-6 w-6 text-white/70" />
        </Floating>
        <Floating className="absolute right-8 bottom-10 hidden sm:block" amplitude={9} duration={7}>
          <Shield className="h-6 w-6 text-white/70" />
        </Floating>

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Free forever · No signup · No install
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to get started? <AnimatedGradientText>It takes 10 seconds.</AnimatedGradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Explore all {allTools.length} free tools — private, fast and built to work in your browser.
          </p>
          <Button
            size="xl"
            className="mt-8 border border-white/25 bg-white text-blue-700 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] hover:bg-blue-50 hover:text-blue-800"
            asChild
          >
            <Link href="/tools" className="gap-2">
              Explore All Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}