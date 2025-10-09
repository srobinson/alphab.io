// Simple in-memory rate limiter for quick implementation
// For production, consider using @upstash/ratelimit with Redis

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      const record = store[key];
      if (record && record.resetTime < now) {
        delete store[key];
      }
    });
  },
  5 * 60 * 1000
);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Simple sliding window rate limiter
 * @param identifier - Unique identifier (e.g., IP address)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60 * 1000 // 1 minute
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;

  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  const record = store[key];

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count++;

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.reset).toISOString(),
    "Retry-After": result.success ? "0" : Math.ceil((result.reset - Date.now()) / 1000).toString(),
  };
}

/**
 * Middleware helper to check rate limit and return appropriate response
 */
export function checkRateLimit(
  request: Request,
  options: {
    limit?: number;
    windowMs?: number;
    identifier?: string;
  } = {}
): { allowed: boolean; headers: Record<string, string> } {
  // Get identifier from options or extract from request
  const identifier =
    options.identifier ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const result = rateLimit(identifier, options.limit || 60, options.windowMs || 60 * 1000);

  const headers = getRateLimitHeaders(result);

  return {
    allowed: result.success,
    headers,
  };
}
