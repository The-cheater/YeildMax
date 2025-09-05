import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errorMessages
      });
    }
    
    next();
  };
};

// Rate limiting middleware for API endpoints
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
});

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes: any) {
    const totalHits = rejRes.totalHits;
    const msBeforeNext = rejRes.msBeforeNext;

    res.set('Retry-After', Math.round(msBeforeNext / 1000) || 1);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests',
      retryAfter: Math.round(msBeforeNext / 1000) || 1,
    });
  }
};
