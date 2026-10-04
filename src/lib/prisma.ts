import { PrismaClient } from "@prisma/client";

/**
 * Neon is reached over the pooled endpoint. Without an explicit
 * `connect_timeout` the Prisma engine hangs on the IPv6 route and the first
 * query fails with "Can't reach database server". Pin connect/socket timeouts
 * so the engine falls over to IPv4 and reports a real error instead of
 * stalling (see build_v1.txt). Append params (idempotently) so this works
 * regardless of how DATABASE_URL is configured in the environment.
 */
const rawUrl = process.env.DATABASE_URL || "";
const params: string[] = [];
if (!rawUrl.includes("connect_timeout=")) params.push("connect_timeout=15");
if (!rawUrl.includes("socket_timeout=")) params.push("socket_timeout=15");
const separator = rawUrl.includes("?") ? "&" : "?";
const pinnedUrl = rawUrl
  ? `${rawUrl}${params.length ? separator + params.join("&") : ""}`
  : "";
export const DATABASE_URL = pinnedUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  // When DATABASE_URL is not configured (local build without DB), do not
  // instantiate PrismaClient — it would throw during module init and fail the
  // entire Next.js build (e.g. /blog static generation). Instead, create a
  // no-op stand-in whose `.blogPost` accessor is safe to call.
  if (!rawUrl) {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "blogPost") {
          // Each dynamic page calls `prisma.blogPost.findMany(...)`; return a
          // look-alike whose methods resolve to empty arrays / null.
          return new Proxy({} as Pick<PrismaClient, "blogPost">, {
            get(_t, method) {
              return (..._args: unknown[]) => {
                if (method === "findMany") return [] as unknown as Awaited<ReturnType<PrismaClient["blogPost"]["findMany"]>>;
                if (method === "findUnique") return null as unknown as Awaited<ReturnType<PrismaClient["blogPost"]["findUnique"]>>;
                return null;
              };
            },
          });
        }
        // Any other Prisma accessor is also a no-op.
        return new Proxy({} as Record<string, unknown>, {
          get(_t, m) {
            return (..._args: unknown[]) => null;
          },
        });
      },
    });
  }

  return new PrismaClient({
    datasources: { db: { url: pinnedUrl } },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
