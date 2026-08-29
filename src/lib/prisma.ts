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

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: pinnedUrl
      ? { db: { url: pinnedUrl } }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
