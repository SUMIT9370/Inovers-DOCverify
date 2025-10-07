import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User, { IUser } from '../models/User';
import { TokenService } from '../utils/jwt';
import { createRateLimiter } from '../utils/rateLimiter';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
      userType?: string;
    }
  }
}

// Validate JWT secrets on startup
TokenService.validateSecrets();

// Rate limiter options for auth routes
const limiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  },
  standardHeaders: true,
  legacyHeaders: false
} as const;

// Create and export the rate limiter middleware
export const authRateLimiter = createRateLimiter(limiterOptions);

// Authentication middleware
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const refreshToken = req.header('X-Refresh-Token');

    if (!token) {
      throw new Error('No authentication token provided');
    }

    try {
      const decoded = TokenService.verifyAccessToken(token);
      const user = await User.findById(decoded.userId).exec();

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      if (!user.isEmailVerified) {
        throw new Error('Email not verified');
      }

      req.user = user;
      req.userId = decoded.userId;
      req.userType = user.userType;
      
      // Check if token is expiring soon and refresh if possible
      if (TokenService.isTokenExpiringSoon(decoded) && refreshToken) {
        try {
          const refreshDecoded = TokenService.verifyRefreshToken(refreshToken);
          const newToken = TokenService.generateAccessToken({
            userId: refreshDecoded.userId,
            userType: refreshDecoded.userType
          });
          res.setHeader('X-New-Token', newToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        if (!refreshToken) {
          throw new Error('Token expired. Please log in again.');
        }

        try {
          const refreshDecoded = TokenService.verifyRefreshToken(refreshToken);
          const newToken = TokenService.generateAccessToken({
            userId: refreshDecoded.userId,
            userType: refreshDecoded.userType
          });
          res.setHeader('X-New-Token', newToken);
          
          const user = await User.findById(refreshDecoded.userId).exec();
          if (!user || !user.isActive || !user.isEmailVerified) {
            throw new Error('Invalid user state');
          }

          req.user = user;
          req.userId = refreshDecoded.userId;
          req.userType = user.userType;
          next();
        } catch (refreshError) {
          throw new Error('Session expired. Please log in again.');
        }
      } else {
        throw new Error('Invalid authentication token');
      }
    }
  } catch (error) {
    res.status(401).json({ 
      error: error instanceof Error ? error.message : 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Authorization middleware generator
export const checkUserType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userType || !allowedTypes.includes(req.userType)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
        code: 'FORBIDDEN'
      });
    }
    next();
  };
};
