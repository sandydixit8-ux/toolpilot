import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const entry = rateLimit.get(ip);

    if (entry && now - entry.timestamp < WINDOW_MS) {
      if (entry.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    if (Math.random() < 0.01) {
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
