/**
 * A fixed-window rate limit for the context link (/agents/context/...), kept in this server's memory only. A client
 * is counted under a salted hash of its address, the salt is random per process, and every count is dropped when the
 * window ends: nothing is written anywhere, so the docs still keep no visitor's IP address. A cap on all clients
 * together bounds the route even when the address header is missing or forged.
 */

import { createHash, randomBytes } from "node:crypto";

export type RateLimiter = {
  /** Counts one request and says whether it may be answered. */
  allow(clientAddress: string | null | undefined, now?: number): boolean;
  /** Seconds until the current window ends, for Retry-After. */
  retryAfter(now?: number): number;
};

export function createRateLimiter(options: { windowMs: number; perClient: number; total: number }): RateLimiter {
  const salt = randomBytes(16);
  const counts = new Map<string, number>();
  // The first request opens the first window.
  let windowStart = Number.NEGATIVE_INFINITY;
  let total = 0;

  const roll = (now: number) => {
    if (now - windowStart >= options.windowMs) {
      windowStart = now;
      counts.clear();
      total = 0;
    }
  };

  return {
    allow(clientAddress, now = Date.now()) {
      roll(now);
      total += 1;
      if (total > options.total) return false;
      const key = createHash("sha256").update(salt).update(clientAddress ?? "").digest("base64url").slice(0, 22);
      const count = (counts.get(key) ?? 0) + 1;
      counts.set(key, count);
      return count <= options.perClient;
    },
    retryAfter(now = Date.now()) {
      return Math.max(1, Math.ceil((windowStart + options.windowMs - now) / 1000));
    },
  };
}

/** The client's address as Cloudflare reports it, else the first X-Forwarded-For hop. Used only as a counter key. */
export function clientAddress(headers: Headers): string | null {
  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || null;
}
