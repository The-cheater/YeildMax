import { Request, Response, NextFunction } from 'express';
import { strategyService } from '../services/strategyService';
import { successResponse } from '../utils/responseFormatter';

export class StrategyController {
  async getAllStrategies(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, riskLevel, minInvestment } = req.query;
      const strategies = await strategyService.getAllStrategies({ category, riskLevel, minInvestment });
      return successResponse(res, strategies, 'Strategies fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getStrategyById(req: Request, res: Response, next: NextFunction) {
    try {
      const strategy = await strategyService.getStrategyById(req.params.id);
      if (!strategy) {
        return res.status(404).json({ status: 'error', message: 'Strategy not found' });
      }
      return successResponse(res, strategy, 'Strategy details fetched');
    } catch (error) {
      next(error);
    }
  }

  async executeStrategy(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const strategyId = req.params.id;
      const { amount } = req.body;
      const execution = await strategyService.executeStrategy(userId, strategyId, amount);
      return successResponse(res, execution, 'Strategy executed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserStrategies(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const strategies = await strategyService.getUserStrategies(userId);
      return successResponse(res, strategies, 'User strategies fetched');
    } catch (error) {
      next(error);
    }
  }
}

export const strategyController = new StrategyController();
