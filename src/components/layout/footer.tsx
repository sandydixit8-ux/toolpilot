"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { allTools } from "@/config/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Editorial Policy", href: "/editorial-policy" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/toolpilotpro", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/toolpilotpro.in", icon: Instagram },
  { label: "Twitter / X", href: "https://www.twitter.com/toolpilotpro", icon: Twitter },
  { label: "YouTube", href: "https://www.youtube.com/@toolpilotpro", icon: Youtube },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/toolpilotpro", icon: Linkedin },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tool of allTools) counts[tool.categorySlug] = (counts[tool.categorySlug] || 0) + 1;
    return counts;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl mb-4 tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]">
                <Zap className="h-4 w-4 fill-current" />
              </span>
              <span className="flex items-baseline gap-1">
                <span>ToolPilot</span>
                <span className="text-gradient text-sm font-bold">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {allTools.length}+ free online tools for work, money, career & everyday life. Private by design — files
              and data stay in your browser.
            </p>
            <div className="mt-4 flex gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-blue-500/50 hover:text-blue-400"
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Categories</h3>
            <ul className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tools/${cat.slug}`}
                    className="group flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-blue-400"
                  >
                    <span>{cat.name}</span>
                    <span className="rounded-full border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground/70">
                      {catCounts[cat.slug] ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Stay Updated</h3>
            <p className="mb-3 text-sm text-muted-foreground">Get tips on new tools and features. No spam.</p>
            {status === "success" ? (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="h-4 w-4" />
                Subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 text-sm"
                />
                <Button type="submit" size="sm" disabled={status === "submitting"}>
                  {status === "submitting" ? "..." : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ToolPilot. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground/70">
            Technology Partner: <span className="font-medium text-muted-foreground">Ridhyansh Tech Infra Private Limited</span>
          </p>
        </div>
      </div>
    </footer>
  );
}