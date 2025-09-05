import User, { IUser } from '../models/User';
import Portfolio from '../models/Portfolio';
import Transaction from '../models/Transaction';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/responseFormatter';
import logger from '../utils/logger';

export class UserService {
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  async updateUser(userId: string, updates: any): Promise<IUser> {
    try {
      // Remove sensitive fields that shouldn't be updated through this method
      const allowedUpdates = ['name', 'avatar', 'bio'];
      const filteredUpdates: any = {};
      
      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        filteredUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      logger.info(`User ${userId} profile updated`);
      
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { preferences } },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      logger.info(`User ${userId} preferences updated`);
      
      return user;
    } catch (error) {
      logger.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Hash and update new password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      user.password = hashedNewPassword;
      await user.save();

      logger.info(`Password changed for user ${userId}`);
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  async deleteUser(userId: string, password: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Password is incorrect', 400);
      }

      // Delete user data
      await Promise.all([
        User.findByIdAndDelete(userId),
        Portfolio.deleteMany({ userId }),
        Transaction.deleteMany({ userId })
        // Add other related data cleanup as needed
      ]);

      logger.info(`User ${userId} account deleted`);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const [user, portfolio, transactionStats] = await Promise.all([
        User.findById(userId).select('-password'),
        Portfolio.findOne({ userId }),
        this.getUserTransactionStats(userId)
      ]);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const stats = {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          memberSince: user.createdAt,
          isVerified: user.isVerified
        },
        portfolio: {
          totalValue: portfolio?.totalValue || 0,
          totalPositions: portfolio?.positions.length || 0,
          riskScore: portfolio?.riskScore || 0,
          performance: portfolio?.performance || { daily: 0, weekly: 0, monthly: 0, yearly: 0 }
        },
        transactions: transactionStats,
        achievements: await this.getUserAchievements(userId)
      };

      return stats;
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw error;
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10, search?: string): Promise<any> {
    try {
      const query: any = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const [users, totalCount] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw new AppError('Failed to fetch users', 500);
    }
  }

  private async getUserTransactionStats(userId: string): Promise<any> {
    try {
      const stats = await Transaction.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalVolume: { $sum: '$value' },
            totalGasFees: { $sum: '$gasFee' },
            completedTransactions: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            pendingTransactions: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalTransactions: 0,
        totalVolume: 0,
        totalGasFees: 0,
        completedTransactions: 0,
        pendingTransactions: 0
      };
    } catch (error) {
      logger.error('Error getting user transaction stats:', error);
      return {
        totalTransactions: 0,
        totalVolume: 0,
        totalGasFees: 0,
        completedTransactions: 0,
        pendingTransactions: 0
      };
    }
  }

  private async getUserAchievements(userId: string): Promise<any[]> {
    try {
      const achievements = [];
      
      // Get portfolio and transaction data
      const [portfolio, transactionCount] = await Promise.all([
        Portfolio.findOne({ userId }),
        Transaction.countDocuments({ userId, status: 'completed' })
      ]);

      // Achievement logic
      if (transactionCount >= 1) {
        achievements.push({
          id: 'first_transaction',
          name: 'First Transaction',
          description: 'Completed your first transaction',
          icon: '🎉',
          unlockedAt: new Date()
        });
      }

      if (transactionCount >= 10) {
        achievements.push({
          id: 'active_trader',
          name: 'Active Trader',
          description: 'Completed 10 transactions',
          icon: '📈',
          unlockedAt: new Date()
        });
      }

      if (portfolio && portfolio.totalValue >= 1000) {
        achievements.push({
          id: 'portfolio_builder',
          name: 'Portfolio Builder',
          description: 'Reached $1,000 in portfolio value',
          icon: '💎',
          unlockedAt: new Date()
        });
      }

      return achievements;
    } catch (error) {
      logger.error('Error getting user achievements:', error);
      return [];
    }
  }
}

export const userService = new UserService();
