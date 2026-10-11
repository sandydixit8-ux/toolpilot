"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { Search, Menu, X, LogIn, Shield, LogOut, ChevronDown, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher, useI18n } from "@/components/i18n";
import { allTools, searchTools, getPopularTools } from "@/config/tools";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Header() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchTools>>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastQueryRef = useRef("");

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tool of allTools) counts[tool.categorySlug] = (counts[tool.categorySlug] || 0) + 1;
    return counts;
  }, []);

  const popular = useMemo(() => getPopularTools().slice(0, 6), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    lastQueryRef.current = q;
    setActiveIndex(-1);
    if (q.trim().length >= 2) {
      setResults(searchTools(q).slice(0, 8));
    } else {
      setResults([]);
    }
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    lastQueryRef.current = "";
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
        setCatsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    resultsRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onSearchKey = useCallback(
    (e: React.KeyboardEvent) => {
      const list = results;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (list.length > 0) setActiveIndex((i) => (i + 1) % list.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (list.length > 0) setActiveIndex((i) => (i <= 0 ? list.length - 1 : i - 1));
      } else if (e.key === "Enter") {
        const target =
          list[activeIndex >= 0 ? activeIndex : 0];
        if (target) {
          window.location.href = `/tools/${target.slug}`;
        }
      }
    },
    [results, activeIndex]
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all",
          scrolled ? "glass-strong shadow-[0_8px_32px_-16px_rgba(0,0,0,0.55)]" : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 fill-current" />
            </span>
            <span className="flex items-baseline gap-1">
              <span>ToolPilot</span>
              <span className="text-gradient text-sm font-bold">Pro</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setCatsOpen(true)}
              onMouseLeave={() => setCatsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-expanded={catsOpen}
                aria-haspopup="true"
              >
                Categories
                <ChevronDown className={cn("h-4 w-4 transition-transform", catsOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {catsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-0 top-full z-50 mt-2 w-[420px] rounded-2xl border border-border bg-card p-2 shadow-2xl"
                  >
                    <Link
                      href="/tools"
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <span>Browse all {allTools.length} tools</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <div className="grid grid-cols-3 gap-1 p-1">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/tools/${cat.slug}`}
                          className="group rounded-xl px-3 py-2 transition-colors hover:bg-accent"
                        >
                          <span className="block truncate text-sm font-medium text-foreground group-hover:text-blue-400">
                            {cat.name.replace(" Tools", "")}
                          </span>
                          <span className="text-xs text-muted-foreground">{catCounts[cat.slug] ?? 0} tools</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-muted-foreground"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">{t("hero.search")}</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:flex">
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

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden overflow-hidden border-t border-border glass-strong"
            >
              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-1 border-t border-border pt-2">
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/tools/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {cat.name.replace(" Tools", "")}
                        <span className="ml-1 text-xs text-muted-foreground/60">{catCounts[cat.slug] ?? 0}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border mt-2 pt-2">
                  {session ? (
                    <>
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-500 hover:bg-accent"
                      >
                        <Shield className="h-4 w-4" />
                        {t("admin.dashboard")}
                      </Link>
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-500 hover:bg-accent"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[10vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search tools"
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-xl mx-4 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t("hero.search")}
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={onSearchKey}
                  aria-label="Search tools"
                  className="h-13 w-full flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="select-none rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {results.length > 0 && (
                <div ref={resultsRef} role="listbox" className="max-h-80 overflow-y-auto p-2">
                  {results.map((tool, i) => (
                    <Link
                      key={tool.slug}
                      role="option"
                      aria-selected={i === activeIndex}
                      data-index={i}
                      href={`/tools/${tool.slug}`}
                      onClick={closeSearch}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        i === activeIndex ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"
                      )}
                    >
                      <span className="max-w-[40%] truncate text-xs text-muted-foreground/70">{tool.category}</span>
                      <span className="font-medium text-foreground">{tool.name}</span>
                      <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground/60">
                        {tool.popular && "Popular"}
                        <kbd className="rounded border border-border px-1 font-mono text-[10px]">
                          {i === activeIndex ? "↵" : "↑↓"}
                        </kbd>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {query.trim().length < 2 && (
                <div className="p-4">
                  <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Popular tools
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popular.map((tool) => (
                      <button
                        key={tool.slug}
                        type="button"
                        onClick={() => handleSearch(tool.name)}
                        className="rounded-full border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-500/50 hover:text-foreground"
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim().length >= 2 && results.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No tools found for &quot;{query}&quot;
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}