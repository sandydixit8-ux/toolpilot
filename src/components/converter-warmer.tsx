'use client';

import { useEffect } from 'react';

const BASE = (
  process.env.NEXT_PUBLIC_RENDER_CONVERTER_URL || 'https://toolpilot-5b6c.onrender.com'
).replace(/\/$/, '');

const WARM_URL = `${BASE}/health`;
const TTL_MS = 10 * 60 * 1000;
const KEY = 'converter-warmed-at';

/**
 * Fire-and-forget warm-up for the Render converter service, which sleeps on
 * the free tier after ~15 min idle. Real traffic keeps it awake so users do
 * not hit a 10-30s cold start on PDF/video tools. Throttled per browser so a
 * visitor pings the service at most once every 10 minutes.
 */
export function ConverterWarmer() {
  useEffect(() => {
    try {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (Date.now() - last < TTL_MS) return;
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      // localStorage unavailable — warm once anyway
    }
    fetch(WARM_URL, { mode: 'no-cors', cache: 'no-store', keepalive: true }).catch(() => {});
  }, []);

  return null;
}
