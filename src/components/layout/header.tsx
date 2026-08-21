"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { searchTools } from "@/config/tools";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Calculators", href: "/tools/calculators" },
  { label: "Career", href: "/tools/career" },
  { label: "Business", href: "/tools/business" },
  { label: "Developer", href: "/tools/developer" },
  { label: "AI Tools", href: "/tools/ai" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
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
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                {item.label}
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
              <span className="text-xs">Search tools...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Ctrl K
              </kbd>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  {item.label}
                </Link>
              ))}
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
