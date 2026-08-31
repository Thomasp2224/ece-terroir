/**
 * Simple in-memory sliding window rate limiter
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  key: string;
  maxRequests: number;
  windowMs: number;
}

export function checkRateLimit({ key, maxRequests, windowMs }: RateLimitOptions): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetSeconds: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= maxRequests) {
    const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, resetSeconds };
  }

  record.count += 1;
  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  return { allowed: true, remaining: maxRequests - record.count, resetSeconds };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
