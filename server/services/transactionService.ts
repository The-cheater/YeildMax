import Transaction, { ITransaction } from '../models/Transaction';
import { AppError } from '../utils/responseFormatter';
import logger from '../utils/logger';

export class TransactionService {
  async createTransaction(userId: string, transactionData: any): Promise<ITransaction> {
    try {
      const transaction = await Transaction.create({
        userId,
        ...transactionData,
        status: 'pending'
      });

      logger.info(`Transaction created for user ${userId}:`, transaction._id);
      
      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw new AppError('Failed to create transaction', 500);
    }
  }

  async getUserTransactions(
    userId: string, 
    page: number = 1, 
    limit: number = 10, 
    filters: any = {}
  ): Promise<{ transactions: ITransaction[], totalCount: number, totalPages: number }> {
    try {
      const query: any = { userId };
      
      // Apply filters
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;
      if (filters.platform) query.platform = { $regex: filters.platform, $options: 'i' };
      if (filters.dateFrom) query.createdAt = { $gte: new Date(filters.dateFrom) };
      if (filters.dateTo) {
        query.createdAt = { 
          ...query.createdAt, 
          $lte: new Date(filters.dateTo) 
        };
      }

      const skip = (page - 1) * limit;
      
      const [transactions, totalCount] = await Promise.all([
        Transaction.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('metadata.strategyId', 'name')
          .populate('metadata.portfolioId'),
        Transaction.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        transactions,
        totalCount,
        totalPages
      };
    } catch (error) {
      logger.error('Error fetching user transactions:', error);
      throw new AppError('Failed to fetch transactions', 500);
    }
  }

  async getTransactionById(userId: string, transactionId: string): Promise<ITransaction | null> {
    try {
      const transaction = await Transaction.findOne({ 
        _id: transactionId, 
        userId 
      })
      .populate('metadata.strategyId', 'name category')
      .populate('metadata.portfolioId');

      return transaction;
    } catch (error) {
      logger.error('Error fetching transaction by ID:', error);
      throw new AppError('Failed to fetch transaction', 500);
    }
  }

  async updateTransaction(
    userId: string, 
    transactionId: string, 
    updates: any
  ): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findOne({ 
        _id: transactionId, 
        userId 
      });

      if (!transaction) {
        throw new AppError('Transaction not found', 404);
      }

      // Prevent updating certain fields based on status
      if (transaction.status === 'completed' && updates.amount) {
        throw new AppError('Cannot modify amount of completed transaction', 400);
      }

      Object.assign(transaction, updates);
      await transaction.save();

      logger.info(`Transaction ${transactionId} updated by user ${userId}`);
      
      return transaction;
    } catch (error) {
      logger.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    try {
      const transaction = await Transaction.findOne({ 
        _id: transactionId, 
        userId 
      });

      if (!transaction) {
        throw new AppError('Transaction not found', 404);
      }

      // Only allow deletion of pending or failed transactions
      if (transaction.status === 'completed') {
        throw new AppError('Cannot delete completed transaction', 400);
      }

      await Transaction.deleteOne({ _id: transactionId, userId });
      
      logger.info(`Transaction ${transactionId} deleted by user ${userId}`);
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getTransactionStats(userId: string, period: string = '30d'): Promise<any> {
    try {
      const now = new Date();
      let startDate = new Date();

      // Calculate start date based on period
      switch (period) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      const stats = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalVolume: { $sum: '$value' },
            totalGasFees: { $sum: '$gasFee' },
            avgTransactionValue: { $avg: '$value' },
            depositCount: {
              $sum: { $cond: [{ $eq: ['$type', 'deposit'] }, 1, 0] }
            },
            withdrawCount: {
              $sum: { $cond: [{ $eq: ['$type', 'withdraw'] }, 1, 0] }
            },
            rewardCount: {
              $sum: { $cond: [{ $eq: ['$type', 'reward'] }, 1, 0] }
            },
            swapCount: {
              $sum: { $cond: [{ $eq: ['$type', 'swap'] }, 1, 0] }
            },
            pendingCount: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            completedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            failedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            }
          }
        }
      ]);

      // Get platform breakdown
      const platformStats = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$platform',
            count: { $sum: 1 },
            volume: { $sum: '$value' }
          }
        },
        { $sort: { volume: -1 } }
      ]);

      // Get daily transaction volume (for charts)
      const dailyVolume = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            volume: { $sum: '$value' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      return {
        period,
        overview: stats[0] || {
          totalTransactions: 0,
          totalVolume: 0,
          totalGasFees: 0,
          avgTransactionValue: 0,
          depositCount: 0,
          withdrawCount: 0,
          rewardCount: 0,
          swapCount: 0,
          pendingCount: 0,
          completedCount: 0,
          failedCount: 0
        },
        platformBreakdown: platformStats,
        dailyVolume
      };
    } catch (error) {
      logger.error('Error calculating transaction stats:', error);
      throw new AppError('Failed to calculate transaction statistics', 500);
    }
  }

  async updateTransactionStatus(transactionId: string, status: string, txHash?: string): Promise<void> {
    try {
      const updates: any = { status };
      if (txHash) updates.txHash = txHash;

      await Transaction.findByIdAndUpdate(transactionId, updates);
      
      logger.info(`Transaction ${transactionId} status updated to ${status}`);
    } catch (error) {
      logger.error('Error updating transaction status:', error);
      throw new AppError('Failed to update transaction status', 500);
    }
  }
}

export const transactionService = new TransactionService();
