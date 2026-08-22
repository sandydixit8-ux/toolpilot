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

export function AdUnit({ slotId, format = "auto", responsive = true, className = "", style }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [consent, setConsent] = useState<boolean | null>(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("toolpilot-cookie-consent");
    setConsent(stored === "accepted");
  }, []);

  useEffect(() => {
    if (consent !== true || pushed) return;
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setPushed(true);
    } catch {
      // AdSense not loaded yet or blocked
    }
  }, [consent, pushed]);

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!publisherId || consent === false) {
    return null;
  }

  if (consent === null) {
    return null;
  }

  return (
    <div className={`ad-container my-6 flex justify-center ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
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
