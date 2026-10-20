"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gaEvent } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || "" }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  // Delegated listeners so every tool's download and every outbound click is
  // measured without touching each component. GA4 then shows which tools and
  // which content actually convert visitors — the signal that drives growth.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a") as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href") || "";
      const download = target.hasAttribute("download");
      const isBlob = href.startsWith("blob:");

      if (download || isBlob) {
        gaEvent("tool_download", {
          page_path: window.location.pathname,
          file_name: target.getAttribute("download") || "",
        });
        return;
      }

      // Outbound link (different host): shows referral/affiliate flows.
      try {
        const url = new URL(target.href, window.location.href);
        if (url.host && url.host !== window.location.host && !url.host.endsWith("toolpilotpro.in")) {
          gaEvent("outbound_click", {
            link_url: target.href,
            link_domain: url.host,
            page_path: window.location.pathname,
          });
        }
      } catch {
        // ignore malformed hrefs
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
