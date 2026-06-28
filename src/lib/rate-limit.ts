// Lightweight in-memory per-IP fixed-window limiter. Enough to deter abuse of
// the public chat endpoint on a portfolio site (per-instance on serverless,
// which is fine here, it's a guard, not a billing system).

type Entry = { count: number; reset: number };

const buckets = new Map<string, Entry>();

export type RateResult = { ok: boolean; remaining: number; retryAfter: number };

export function rateLimit(key: string, limit = 15, windowMs = 60_000): RateResult {
  const now = Date.now();

  // opportunistic sweep so the map can't grow unbounded
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
  }

  const entry = buckets.get(key);
  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, retryAfter: 0 };
}
