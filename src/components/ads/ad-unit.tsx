"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  slotId: string;
  format?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CONSENT_KEY = "toolpilot-cookie-consent";
const CONSENT_EVENT = "toolpilot-consent-change";

let adsScriptPromise: Promise<void> | null = null;

/**
 * AdSense ships ~145 KB of third-party JavaScript that Lighthouse flags as
 * mostly unused on first load. Loading it only when a slot is about to be
 * scrolled into view keeps it off the critical path for the mobile LCP.
 * Above-the-fold slots still load straight away because they intersect
 * immediately, so revenue is unaffected for the ads that matter.
 */
function loadAdsScript(publisherId: string): Promise<void> {
  if (adsScriptPromise) return adsScriptPromise;
  adsScriptPromise = new Promise<void>((resolve) => {
    if (document.querySelector("script[data-toolpilot-adsense]")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.dataset.toolpilotAdsense = "true";
    script.onload = () => resolve();
    // A blocked ad request must never leave the slot hanging.
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return adsScriptPromise;
}

function readConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function AdUnit({ slotId, format = "auto", responsive = true, className = "", style }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [consent, setConsent] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [pushed, setPushed] = useState(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    setConsent(readConsent());
    // The banner fires this as soon as the reader accepts, so ads can appear
    // without a reload.
    const onChange = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Warm the third-party download shortly before the slot is visible so the ad
  // still fills in by the time the reader reaches it.
  useEffect(() => {
    const element = adRef.current;
    if (!element || nearViewport) return;
    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [nearViewport]);

  useEffect(() => {
    if (consent !== true || !nearViewport || pushed || !publisherId) return;
    if (!adRef.current) return;

    let cancelled = false;
    void (async () => {
      await loadAdsScript(publisherId);
      if (cancelled || !adRef.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setPushed(true);
      } catch {
        // AdSense not loaded yet or blocked
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [consent, nearViewport, pushed, publisherId]);

  if (!publisherId) return null;

  return (
    <div
      className={`ad-container flex justify-center ${consent ? "my-6" : "my-0"} ${className}`}
      style={style}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          // Nothing is requested until consent is given, so keep the reserved
          // space from collapsing to zero and shifting the page later.
          minHeight: consent ? undefined : 0,
          ...(responsive ? {} : { width: "728px", height: "90px" }),
        }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={responsive ? format : undefined}
        data-full-width-responsive={responsive ? "true" : undefined}
      />
    </div>
  );
}
