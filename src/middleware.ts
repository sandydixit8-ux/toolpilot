import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

const FALLBACK_CONVERTER = "https://toolpilot-5b6c.onrender.com";

/**
 * Origins the browser talks to directly at runtime: the converter service
 * (warm-up ping on every page, plus the Word-to-PDF health probe). Derived from
 * env so a service move does not silently start failing CSP checks.
 */
function connectOrigins(): string[] {
  const candidates = [
    process.env.CONVERTER_SERVICE_URL,
    process.env.NEXT_PUBLIC_RENDER_CONVERTER_URL,
    FALLBACK_CONVERTER,
  ];
  const origins = new Set<string>();
  for (const raw of candidates) {
    if (!raw) continue;
    try {
      origins.add(new URL(raw).origin);
    } catch {
      // ignore malformed values
    }
  }
  return [...origins];
}

function hashIp(ip: string): string {
  let h = 5381;
  for (let i = 0; i < ip.length; i++) {
    h = ((h << 5) + h + ip.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // Deprecated header: "1; mode=block" is known to create XSS vectors in old
  // browsers, and no current browser needs it once CSP is present. "0" is the
  // OWASP-recommended value.
  response.headers.set("X-XSS-Protection", "0");
  const extraConnect = connectOrigins().join(" ");
  // script-src keeps 'unsafe-inline' on purpose: AdSense and the GA4 bootstrap
  // inject inline tags, and a nonce policy would force every route to render
  // per-request, giving up the ISR/CDN caching the site depends on.
  // 'unsafe-eval' is not needed: the only WebAssembly users (ffmpeg.wasm,
  // tesseract.js) are covered by the narrower 'wasm-unsafe-eval', and pdf.js
  // disables its optional eval path when CSP forbids it.
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: https://pagead2.googlesyndication.com https://adservice.google.com https://adservice.google.co.in https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://utt.impactcdn.com https://cdn.jsdelivr.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' blob: https://unpkg.com https://pagead2.googlesyndication.com https://adservice.google.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.clarity.ms https://cdn.jsdelivr.net https://tessdata.projectnaptha.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://csi.gstatic.com ${extraConnect}; frame-src 'self' https://pagead2.googlesyndication.com https://adservice.google.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google; worker-src 'self' blob:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com`
  );
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const rawIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ip = hashIp(rawIp);
    const now = Date.now();
    const entry = rateLimit.get(ip);

    if (entry && now - entry.timestamp < WINDOW_MS) {
      if (entry.count >= MAX_REQUESTS) {
        const retryAfter = Math.ceil((entry.timestamp + WINDOW_MS - now) / 1000);
        const apiResponse = NextResponse.json(
          { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
          { status: 429 }
        );
        apiResponse.headers.set("Retry-After", String(retryAfter));
        apiResponse.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
        apiResponse.headers.set("X-RateLimit-Remaining", "0");
        return apiResponse;
      }
      entry.count++;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    if (rateLimit.size > 10000) {
      for (const [key, val] of rateLimit) {
        if (now - val.timestamp > WINDOW_MS) rateLimit.delete(key);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|og\\.png|icon-.*\\.png|apple-touch-icon\\.png|site\\.webmanifest).*)"],
};
