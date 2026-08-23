import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash } from "crypto";

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://adservice.google.co.in https://www.googletagmanager.com https://utt.impactcdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https://pagead2.googlesyndication.com https://adservice.google.com https://www.google-analytics.com https://analytics.google.com; frame-src 'self' https://pagead2.googlesyndication.com https://adservice.google.com https://www.google.com; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com"
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
