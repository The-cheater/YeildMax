import { Request, Response, NextFunction } from 'express';
import { portfolioService } from '../services/portfolioService';
import { successResponse } from '../utils/responseFormatter';

export class PortfolioController {
  async getUserPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const portfolio = await portfolioService.getUserPortfolio(userId);
      return successResponse(res, portfolio, 'Portfolio fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async addPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const position = await portfolioService.addPosition(userId, req.body);
      return successResponse(res, position, 'Position added successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const positionId = req.params.positionId;
      const position = await portfolioService.updatePosition(userId, positionId, req.body);
      return successResponse(res, position, 'Position updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPortfolioAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const analytics = await portfolioService.getAnalytics(userId);
      return successResponse(res, analytics, 'Portfolio analytics fetched');
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();
