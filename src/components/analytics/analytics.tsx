"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_KEY, CONSENT_EVENT } from "@/components/ui/cookie-consent";

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGoogleAnalytics(gaId: string) {
  if (document.getElementById("ga-gtag-src")) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag as Window["gtag"];
  gtag("js", new Date());
  gtag("config", gaId, {
    page_title: document.title,
    page_location: window.location.href,
  });

  const s = document.createElement("script");
  s.id = "ga-gtag-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);
}

function loadClarity(clarityId: string) {
  if (document.getElementById("ms-clarity-src")) return;
  const w = window as unknown as Record<string, unknown>;
  const queue: unknown[] = [];
  const fn = (...args: unknown[]) => {
    queue.push(args);
  };
  fn.q = queue;
  w["clarity"] = fn;
  const t = document.createElement("script");
  t.id = "ms-clarity-src";
  t.async = true;
  t.src = `https://www.clarity.ms/tag/${clarityId}`;
  document.head.appendChild(t);
}

function loadImpactAffiliate() {
  if (document.getElementById("impact-affiliate")) return;
  const s = document.createElement("script");
  s.id = "impact-affiliate";
  s.async = true;
  s.src = "https://utt.impactcdn.com/P-A7667765-027d-4552-80f9-8cd99ed154141.js";
  document.head.appendChild(s);
}

/**
 * Loads third-party analytics (GA4 and Microsoft Clarity) only after the user
 * has accepted cookies, so no tracking cookies are set before consent.
 * Re-checks on the consent-change event, so no reload is needed.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => {
      if (localStorage.getItem(CONSENT_KEY) === "accepted") setAllowed(true);
    };
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    if (gaId) loadGoogleAnalytics(gaId);
    if (clarityId) loadClarity(clarityId);
    loadImpactAffiliate();
  }, [allowed, gaId, clarityId]);

  return null;
}
