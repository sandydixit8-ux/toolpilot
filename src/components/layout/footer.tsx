"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/toolpilotpro", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/toolpilotpro", icon: Instagram },
  { label: "Twitter / X", href: "https://www.twitter.com/toolpilotpro", icon: Twitter },
  { label: "YouTube", href: "https://www.youtube.com/@toolpilotpro", icon: Youtube },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/toolpilotpro", icon: Linkedin },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

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
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <span className="text-blue-600 dark:text-blue-400">Tool</span>
              <span>Pilot</span>
              <span className="text-blue-600 dark:text-blue-400">Pro</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free online tools for work, money, career & everyday life.
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-blue-600 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tools/${cat.slug}`}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-3">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Stay Updated</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Get tips on new tools and features. No spam.
            </p>
            {status === "success" ? (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
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

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} ToolPilot. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
            Technology Partner: <span className="font-medium text-gray-500 dark:text-gray-500">Ridhyansh Tech Infra Private Limited</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
