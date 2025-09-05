import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AppError } from '../utils/responseFormatter';
import logger from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(new AppError('Authorization header is required', 401));
    }

    if (!authHeader.startsWith('Bearer ')) {
      return next(new AppError('Invalid authorization format. Use Bearer <token>', 401));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        return next(new AppError('Token has expired', 401));
      } else if (jwtError.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token', 401));
      } else {
        return next(new AppError('Token verification failed', 401));
      }
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // Check if user is still active
    if (!user.isVerified && process.env.NODE_ENV === 'production') {
      return next(new AppError('Please verify your email to continue', 401));
    }

    // Attach user to request object
    req.user = user;

    // Log successful authentication (optional)
    if (process.env.NODE_ENV === 'development') {
      logger.info(`User ${user.email} authenticated successfully`);
    }

    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return next(new AppError('Authentication failed', 500));
  }
};

// Optional: Admin-only middleware
export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First run auth middleware
    await new Promise<void>((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return next(new AppError('Admin access required', 403));
    }

    next();
  } catch (error) {
    return next(error);
  }
};

// Optional: Check if user owns the resource
export const resourceOwnerMiddleware = (resourceField: string = 'userId') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const resourceId = req.params.id;
      const userId = req.user._id.toString();

      // For routes like /users/:id, check if user is accessing their own resource
      if (req.params.id && req.params.id !== userId && req.user.role !== 'admin') {
        return next(new AppError('Access denied', 403));
      }

      next();
    } catch (error) {
      return next(new AppError('Authorization failed', 500));
    }
  };
};

// Optional: Rate limiting per user
export const userRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Simple in-memory rate limiting (replace with Redis in production)
    const userRequests = global.userRequestCount || {};
    const userId = req.user._id.toString();
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100;

    if (!userRequests[userId]) {
      userRequests[userId] = { count: 1, resetTime: now + windowMs };
    } else if (now > userRequests[userId].resetTime) {
      userRequests[userId] = { count: 1, resetTime: now + windowMs };
    } else {
      userRequests[userId].count++;
    }

    if (userRequests[userId].count > maxRequests) {
      const resetTime = new Date(userRequests[userId].resetTime);
      res.set('Retry-After', Math.round((resetTime.getTime() - now) / 1000).toString());
      return next(new AppError('Too many requests. Please try again later.', 429));
    }

    global.userRequestCount = userRequests;
    next();
  } catch (error) {
    return next(new AppError('Rate limiting failed', 500));
  }
};

// Export default auth middleware
export default authMiddleware;
