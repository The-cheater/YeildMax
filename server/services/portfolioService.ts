import Portfolio, { IPortfolio } from '../models/Portfolio';
import Transaction from '../models/Transaction';
import { AppError } from '../utils/responseFormatter';
import logger from '../utils/logger';

export class PortfolioService {
  async getUserPortfolio(userId: string): Promise<IPortfolio | null> {
    try {
      let portfolio = await Portfolio.findOne({ userId }).populate('positions.transactions');
      
      // Create portfolio if it doesn't exist
      if (!portfolio) {
        portfolio = await Portfolio.create({
          userId,
          totalValue: 0,
          positions: [],
          performance: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
          riskScore: 0
        });
      }

      // Update portfolio values
      await this.updatePortfolioValues(portfolio);
      
      return portfolio;
    } catch (error) {
      logger.error('Error fetching user portfolio:', error);
      throw new AppError('Failed to fetch portfolio', 500);
    }
  }

  async addPosition(userId: string, positionData: any): Promise<IPortfolio> {
    try {
      const portfolio = await Portfolio.findOne({ userId });
      
      if (!portfolio) {
        throw new AppError('Portfolio not found', 404);
      }

      // Check if position already exists
      const existingPosition = portfolio.positions.find(
        pos => pos.platform === positionData.platform && pos.token === positionData.token
      );

      if (existingPosition) {
        // Update existing position
        existingPosition.amount += positionData.amount;
        existingPosition.currentValue += positionData.initialValue;
        existingPosition.lastUpdated = new Date();
      } else {
        // Add new position
        portfolio.positions.push({
          ...positionData,
          currentValue: positionData.initialValue,
          startDate: new Date(),
          lastUpdated: new Date(),
          transactions: []
        });
      }

      await portfolio.save();
      await this.updatePortfolioValues(portfolio);
      
      return portfolio;
    } catch (error) {
      logger.error('Error adding position:', error);
      throw error;
    }
  }

  async updatePosition(userId: string, positionId: string, updates: any): Promise<IPortfolio> {
    try {
      const portfolio = await Portfolio.findOne({ userId });
      
      if (!portfolio) {
        throw new AppError('Portfolio not found', 404);
      }

      const position = portfolio.positions.id(positionId);
      
      if (!position) {
        throw new AppError('Position not found', 404);
      }

      Object.assign(position, updates);
      position.lastUpdated = new Date();

      await portfolio.save();
      await this.updatePortfolioValues(portfolio);
      
      return portfolio;
    } catch (error) {
      logger.error('Error updating position:', error);
      throw error;
    }
  }

  async removePosition(userId: string, positionId: string): Promise<IPortfolio> {
    try {
      const portfolio = await Portfolio.findOne({ userId });
      
      if (!portfolio) {
        throw new AppError('Portfolio not found', 404);
      }

      portfolio.positions.id(positionId)?.remove();
      await portfolio.save();
      await this.updatePortfolioValues(portfolio);
      
      return portfolio;
    } catch (error) {
      logger.error('Error removing position:', error);
      throw error;
    }
  }

  async getAnalytics(userId: string): Promise<any> {
    try {
      const portfolio = await this.getUserPortfolio(userId);
      
      if (!portfolio) {
        throw new AppError('Portfolio not found', 404);
      }

      // Calculate analytics
      const analytics = {
        totalValue: portfolio.totalValue,
        totalPositions: portfolio.positions.length,
        averageAPY: this.calculateAverageAPY(portfolio),
        riskScore: portfolio.riskScore,
        performance: portfolio.performance,
        allocation: this.calculateAllocation(portfolio),
        topPerformers: this.getTopPerformers(portfolio),
        recentActivity: await this.getRecentActivity(userId)
      };

      return analytics;
    } catch (error) {
      logger.error('Error getting portfolio analytics:', error);
      throw error;
    }
  }

  private async updatePortfolioValues(portfolio: IPortfolio): Promise<void> {
    try {
      // Calculate total value
      portfolio.totalValue = portfolio.positions.reduce((total, position) => {
        return total + position.currentValue;
      }, 0);

      // Calculate risk score (weighted average)
      if (portfolio.positions.length > 0) {
        const totalValue = portfolio.totalValue;
        portfolio.riskScore = portfolio.positions.reduce((score, position) => {
          const weight = position.currentValue / totalValue;
          return score + ((1 - position.apy / 100) * weight); // Simple risk calculation
        }, 0);
      }

      // Update performance metrics (would need historical data)
      // This is a simplified version
      portfolio.performance = {
        daily: 0.24,
        weekly: 1.8,
        monthly: 7.2,
        yearly: 45.6
      };

      portfolio.lastRebalance = new Date();
      await portfolio.save();
    } catch (error) {
      logger.error('Error updating portfolio values:', error);
      throw error;
    }
  }

  private calculateAverageAPY(portfolio: IPortfolio): number {
    if (portfolio.positions.length === 0) return 0;
    
    const totalValue = portfolio.totalValue;
    return portfolio.positions.reduce((avgAPY, position) => {
      const weight = position.currentValue / totalValue;
      return avgAPY + (position.apy * weight);
    }, 0);
  }

  private calculateAllocation(portfolio: IPortfolio): any[] {
    const totalValue = portfolio.totalValue;
    
    return portfolio.positions.map(position => ({
      platform: position.platform,
      token: position.token,
      value: position.currentValue,
      percentage: (position.currentValue / totalValue) * 100
    }));
  }

  private getTopPerformers(portfolio: IPortfolio): any[] {
    return portfolio.positions
      .map(position => ({
        platform: position.platform,
        token: position.token,
        apy: position.apy,
        performance: ((position.currentValue - position.initialValue) / position.initialValue) * 100
      }))
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);
  }

  private async getRecentActivity(userId: string): Promise<any[]> {
    const recentTransactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('type platform token amount createdAt status');

    return recentTransactions;
  }
}

export const portfolioService = new PortfolioService();
