import rateLimit from 'express-rate-limit';
import environment from '@/config/environment';

export const generalLimiter = rateLimit({
  windowMs: environment.RATE_LIMIT_WINDOW_MS,
  max: environment.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many attempts from this IP, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs for API routes
  message: {
    success: false,
    error: {
      message: 'Too many API requests from this IP, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
