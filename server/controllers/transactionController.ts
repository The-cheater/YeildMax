import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transactionService';
import { successResponse } from '../utils/responseFormatter';
import { validateTransaction } from '../utils/validators';

export class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateTransaction(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: error.details[0].message
        });
      }

      const userId = req.user._id;
      const transaction = await transactionService.createTransaction(userId, req.body);
      
      return successResponse(res, transaction, 'Transaction created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getUserTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10, type, status, platform } = req.query;
      
      const filters = {
        type: type as string,
        status: status as string,
        platform: platform as string
      };

      const transactions = await transactionService.getUserTransactions(
        userId,
        parseInt(page as string),
        parseInt(limit as string),
        filters
      );
      
      return successResponse(res, transactions, 'Transactions fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const transactionId = req.params.id;
      
      const transaction = await transactionService.getTransactionById(userId, transactionId);
      
      if (!transaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found'
        });
      }
      
      return successResponse(res, transaction, 'Transaction details fetched');
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const transactionId = req.params.id;
      
      const updatedTransaction = await transactionService.updateTransaction(
        userId,
        transactionId,
        req.body
      );
      
      return successResponse(res, updatedTransaction, 'Transaction updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const transactionId = req.params.id;
      
      await transactionService.deleteTransaction(userId, transactionId);
      
      return res.status(204).json({
        status: 'success',
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { period = '30d' } = req.query;
      
      const stats = await transactionService.getTransactionStats(userId, period as string);
      
      return successResponse(res, stats, 'Transaction statistics fetched');
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
