import rateLimit, { Options as RateLimitOptions } from 'express-rate-limit';

// Convert time string to milliseconds (if needed)
const parseTimeString = (timeStr: string): number => {
  const units: { [key: string]: number } = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  
  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) {
    // If it's already in milliseconds, return as number
    const ms = parseInt(timeStr);
    if (!isNaN(ms)) return ms;
    throw new Error('Invalid time string format');
  }
  
  const [, value, unit] = match;
  return parseInt(value) * units[unit];
};

interface ExtendedRateLimitOptions extends Omit<RateLimitOptions, 'windowMs'> {
  windowStr?: string;
  windowMs?: number;
}

// Rate limiter factory
export const createRateLimiter = (options: ExtendedRateLimitOptions): ReturnType<typeof rateLimit> => {
  const finalOptions: RateLimitOptions = {
    ...options,
    windowMs: options.windowMs || (options.windowStr ? parseTimeString(options.windowStr) : 900000), // default 15m
    max: options.max || 100,
    message: options.message || {
      error: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: options.standardHeaders ?? true,
    legacyHeaders: options.legacyHeaders ?? false
  };

  return rateLimit(finalOptions);
};