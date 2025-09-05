import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { successResponse } from '../utils/responseFormatter';
import { validateUserUpdate } from '../utils/validators';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const user = await userService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      return successResponse(res, user, 'User profile fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateUserUpdate(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: error.details[0].message
        });
      }

      const userId = req.user._id;
      const updatedUser = await userService.updateUser(userId, req.body);
      
      return successResponse(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const preferences = req.body;
      
      const updatedUser = await userService.updateUserPreferences(userId, preferences);
      
      return successResponse(res, updatedUser.preferences, 'Preferences updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Current password and new password are required'
        });
      }

      const userId = req.user._id;
      await userService.changePassword(userId, currentPassword, newPassword);
      
      return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({
          status: 'error',
          message: 'Password is required to delete account'
        });
      }

      await userService.deleteUser(userId, password);
      
      return res.status(204).json({
        status: 'success',
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const stats = await userService.getUserStats(userId);
      
      return successResponse(res, stats, 'User statistics fetched');
    } catch (error) {
      next(error);
    }
  }

  // Admin-only endpoints
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      const users = await userService.getAllUsers(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );
      
      return successResponse(res, users, 'Users fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      return successResponse(res, user, 'User details fetched');
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
