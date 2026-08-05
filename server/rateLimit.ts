/**
 * In-memory sliding window rate limiter.
 * Tracks attempts by IP address and blocks after maxAttempts within windowMs.
 * Suitable for single-instance deployments (Render autoscale).
 */

type AttemptRecord = {
  timestamps: number[];
};

const stores = new Map<string, Map<string, AttemptRecord>>();

export interface RateLimitConfig {
  /** Unique name for this limiter (e.g. "admin-login") */
  name: string;
  /** Maximum number of attempts allowed within the window */
  maxAttempts: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

function getStore(name: string): Map<string, AttemptRecord> {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name)!;
}

/**
 * Check if a request is allowed under the rate limit.
 * Call this before processing the request.
 */
export function checkRateLimit(config: RateLimitConfig, identifier: string): RateLimitResult {
  const store = getStore(config.name);
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let record = store.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Remove expired timestamps
  record.timestamps = record.timestamps.filter(t => t > windowStart);

  if (record.timestamps.length >= config.maxAttempts) {
    // Blocked — calculate retry after
    const oldestInWindow = record.timestamps[0]!;
    const retryAfterMs = oldestInWindow + config.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(retryAfterMs, 0),
    };
  }

  // Allowed — record this attempt
  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: config.maxAttempts - record.timestamps.length,
    retryAfterMs: 0,
  };
}

/**
 * Reset the rate limit for a specific identifier (e.g. after successful login).
 */
export function resetRateLimit(name: string, identifier: string): void {
  const store = getStore(name);
  store.delete(identifier);
}

// Periodic cleanup to prevent memory leaks (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  stores.forEach((store) => {
    store.forEach((record, key) => {
      // Remove records with no recent timestamps (older than 1 hour)
      if (record.timestamps.every((t: number) => t < now - 3600000)) {
        store.delete(key);
      }
    });
  });
}, 600000);
