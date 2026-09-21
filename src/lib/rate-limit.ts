import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type MemoryWindow = { count: number; resetAt: number };

const memoryWindows = new Map<string, MemoryWindow>();
const distributedLimiters = new Map<string, Ratelimit>();
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();
let redis: Redis | undefined;

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

function cleanupMemoryWindows() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of memoryWindows) {
    if (entry.resetAt <= now) memoryWindows.delete(key);
  }
}

function checkMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  cleanupMemoryWindows();

  const now = Date.now();
  const entry = memoryWindows.get(key);

  if (!entry || entry.resetAt <= now) {
    memoryWindows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return { allowed: true };
  }

  return { allowed: false, retryAfterMs: Math.max(1, entry.resetAt - now) };
}

function getDistributedLimiter(maxRequests: number, windowMs: number): Ratelimit {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN for production rate limiting.",
    );
  }

  redis ??= new Redis({ url, token });

  const limiterKey = `${maxRequests}:${windowMs}`;
  const cached = distributedLimiters.get(limiterKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs} ms`),
    prefix: `astc:ratelimit:${maxRequests}:${windowMs}`,
    analytics: false,
  });
  distributedLimiters.set(limiterKey, limiter);
  return limiter;
}

export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("x-real-ip")?.trim()
    || "unknown";
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (maxRequests < 1 || windowMs < 1) {
    throw new Error("Rate limit values must be positive integers.");
  }

  if (process.env.NODE_ENV !== "production") {
    return checkMemoryRateLimit(key, maxRequests, windowMs);
  }

  const result = await getDistributedLimiter(maxRequests, windowMs).limit(key);
  if (result.success) return { allowed: true };

  return {
    allowed: false,
    retryAfterMs: Math.max(1, result.reset - Date.now()),
  };
}
