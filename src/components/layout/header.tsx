"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Menu, X, LogIn, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher, useI18n } from "@/components/i18n";
import { searchTools } from "@/config/tools";
import { cn } from "@/lib/utils";

const navItems = [
  { labelKey: "nav.tools", href: "/tools" },
  { labelKey: "nav.calculators", href: "/tools/calculators" },
  { labelKey: "nav.career", href: "/tools/career" },
  { labelKey: "nav.business", href: "/tools/business" },
  { labelKey: "nav.developer", href: "/tools/developer" },
  { labelKey: "nav.ai", href: "/tools/ai" },
  { labelKey: "nav.blog", href: "/blog" },
];

export function Header() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchTools>>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.length >= 2) {
      setResults(searchTools(q).slice(0, 8));
    } else {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white">
        Skip to content
      </a>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-colors",
          scrolled
            ? "border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80"
            : "border-transparent bg-white dark:bg-gray-950"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-blue-600 dark:text-blue-400">Tool</span>
            <span>Pilot</span>
            <span className="text-blue-600 dark:text-blue-400">Pro</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-gray-500"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">{t("hero.search")}</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Ctrl K
              </kbd>
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            {session ? (
              <div className="hidden sm:flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin" className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs">{t("nav.admin")}</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => signOut({ callbackUrl: "/" })} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" asChild className="hidden sm:flex items-center gap-1.5">
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4" />
                  <span className="text-xs">Login</span>
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-nav" className="lg:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                {t(item.labelKey)}
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2">
                {session ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800"
                    >
                      <Shield className="h-4 w-4" />
                      {t("admin.dashboard")}
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-800 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-[10vh]" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 px-4">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <kbd className="text-xs text-gray-400">ESC</kbd>
            </div>
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    onClick={() => { setSearchOpen(false); setQuery(""); setResults([]); }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="text-gray-500 dark:text-gray-400">{tool.category}</span>
                    <span className="font-medium">{tool.name}</span>
                  </Link>
                ))}
              </div>
            )}
            {query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500">No tools found for &quot;{query}&quot;</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
