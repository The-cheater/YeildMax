import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { successResponse } from '../utils/responseFormatter';
import { validateRegistration, validateLogin } from '../utils/validators';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateRegistration(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: error.details[0].message
        });
      }

      const result = await authService.register(req.body);
      
      successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: error.details[0].message
        });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id as any;
      const user = await authService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      successResponse(res, { user }, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
