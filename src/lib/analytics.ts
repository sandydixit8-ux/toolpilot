/**
 * Google Analytics 4 event helper.
 *
 * GA4 only records pageviews out of the box. To grow traffic you need to know
 * which tools people actually *use*, which answers/FAQs get opened, and which
 * affiliate links earn — this is what tells you where to invest content.
 *
 * Usage (client components only):
 *   import { gaEvent } from "@/lib/analytics";
 *   gaEvent("tool_use", { tool_slug: slug });
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function gaEvent(name: string, params: Params = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
