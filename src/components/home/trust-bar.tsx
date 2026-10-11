"use client";

import { Zap, Shield, Smartphone, Star } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const claims = [
  {
    icon: <Zap className="h-5 w-5" />,
    label: "Lightning Fast",
    desc: "Instant results, zero waiting",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    label: "Privacy First",
    desc: "Files never leave your device",
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    label: "Works Everywhere",
    desc: "Mobile, tablet & desktop",
  },
  {
    icon: <Star className="h-5 w-5" />,
    label: "Always Free",
    desc: "No hidden costs, ever",
  },
];

export function TrustBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4" step={0.06}>
        {claims.map((item) => (
          <StaggerItem key={item.label}>
            <div className="flex h-full items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 text-blue-400">
                {item.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}