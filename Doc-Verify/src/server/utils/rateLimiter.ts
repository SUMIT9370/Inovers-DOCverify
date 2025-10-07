import rateLimit from 'express-rate-limit';

type RateLimitOptions = Partial<Parameters<typeof rateLimit>[0]>;

const defaultOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
} as const;

export const createRateLimiter = (customOptions: Partial<RateLimitOptions> = {}) => {
  return rateLimit({
    ...defaultOptions,
    ...customOptions,
  });
};
