import { Request, Response, NextFunction } from 'express';
import { realDeFiService } from '../services/realDefiService';
import { successResponse } from '../utils/responseFormatter';

export class YieldController {
  async getRealTimeYields(req: Request, res: Response, next: NextFunction) {
    try {
      const yields = await realDeFiService.fetchRealTimeYields();
      return successResponse(res, yields, 'Real-time yields fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getOptimalSwap(req: Request, res: Response, next: NextFunction) {
    try {
      const { fromToken, toToken, amount } = req.query;
      const swapRoute = await realDeFiService.getOptimalSwapRoute(
        fromToken as string,
        toToken as string,
        amount as string
      );
      return successResponse(res, swapRoute, 'Optimal swap route found');
    } catch (error) {
      next(error);
    }
  }

  async trackPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletAddress } = req.params;
      const portfolio = await realDeFiService.trackPortfolioRealTime(walletAddress);
      return successResponse(res, portfolio, 'Portfolio tracked successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const yieldController = new YieldController();
