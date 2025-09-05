import { Request, Response, NextFunction } from 'express';
import { aiRecommendationService } from '../services/aiRecommendationService';
import { successResponse } from '../utils/responseFormatter';

export class AIController {
  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfile = {
        riskTolerance: req.body.riskTolerance || 'medium',
        investmentAmount: parseFloat(req.body.investmentAmount) || 1000,
        timeHorizon: req.body.timeHorizon || 'medium',
        preferredProtocols: req.body.preferredProtocols || [],
        currentPortfolio: req.body.currentPortfolio,
        historicalPerformance: req.body.historicalPerformance
      };

      const recommendations = await aiRecommendationService.generateRecommendations({
        userProfile
      });

      return successResponse(res, recommendations, 'AI recommendations generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async optimizeStrategy(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentStrategy, marketChanges, performanceData } = req.body;

      const optimization = await aiRecommendationService.optimizeStrategy(
        currentStrategy,
        marketChanges,
        performanceData
      );

      return successResponse(res, optimization, 'Strategy optimization completed');
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
