import OpenAI from 'openai';
import { PythonShell } from 'python-shell';
import { realDeFiService } from './realDefiService';
import logger from '../utils/logger';

interface UserProfile {
  riskTolerance: 'low' | 'medium' | 'high';
  investmentAmount: number;
  timeHorizon: 'short' | 'medium' | 'long';
  preferredProtocols: string[];
  currentPortfolio?: any[];
  historicalPerformance?: number;
}

interface RecommendationRequest {
  userProfile: UserProfile;
  marketData?: any[];
  portfolioData?: any[];
}

interface AIRecommendation {
  strategy: {
    name: string;
    description: string;
    expectedAPY: number;
    riskScore: number;
    timeframe: string;
  };
  allocations: {
    protocol: string;
    token: string;
    percentage: number;
    amount: number;
    reasoning: string;
  }[];
  reasoning: string;
  confidence: number;
  warnings: string[];
}

export class AIRecommendationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async generateRecommendations(request: RecommendationRequest): Promise<AIRecommendation> {
    try {
      // Get latest market data
      const marketData = await realDeFiService.fetchRealTimeYields();
      
      // Process user profile and generate features
      const features = this.extractFeatures(request.userProfile, marketData);
      
      // Get ML-based recommendations
      const mlRecommendations = await this.getMLRecommendations(features);
      
      // Enhance with GPT explanations
      const enhancedRecommendations = await this.enhanceWithAI(
        mlRecommendations,
        request.userProfile,
        marketData
      );

      return enhancedRecommendations;
    } catch (error) {
      logger.error('Error generating AI recommendations:', error);
      throw error;
    }
  }

  private extractFeatures(userProfile: UserProfile, marketData: any[]): any {
    // Convert user preferences to numerical features
    const riskScore = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.9
    }[userProfile.riskTolerance];

    const timeHorizonScore = {
      'short': 0.3,
      'medium': 0.6,
      'long': 1.0
    }[userProfile.timeHorizon];

    // Market features
    const avgMarketAPY = marketData.reduce((sum, item) => sum + item.apy, 0) / marketData.length;
    const avgMarketRisk = marketData.reduce((sum, item) => sum + item.riskScore, 0) / marketData.length;

    return {
      user_risk_score: riskScore,
      investment_amount: userProfile.investmentAmount,
      time_horizon_score: timeHorizonScore,
      preferred_protocols_count: userProfile.preferredProtocols.length,
      historical_performance: userProfile.historicalPerformance || 0,
      market_avg_apy: avgMarketAPY,
      market_avg_risk: avgMarketRisk,
      portfolio_size: userProfile.currentPortfolio?.length || 0
    };
  }

  private async getMLRecommendations(features: any): Promise<any> {
    try {
      // Call Python ML model
      const options = {
        mode: 'json' as const,
        pythonOptions: ['-u'],
        scriptPath: './python_models/',
        args: [JSON.stringify(features)]
      };

      const results = await PythonShell.run('yield_optimizer.py', options);
      return JSON.parse(results[0] as string);
    } catch (error) {
      logger.error('Error calling ML model:', error);
      // Fallback to rule-based recommendations
      return this.getRuleBasedRecommendations(features);
    }
  }

  private getRuleBasedRecommendations(features: any): any {
    const { user_risk_score, investment_amount, time_horizon_score } = features;
    
    // Simple rule-based logic for fallback
    let recommendations = [];
    
    if (user_risk_score <= 0.4) { // Low risk
      recommendations = [
        { protocol: 'Aave', weight: 0.4, min_apy: 2, max_apy: 6 },
        { protocol: 'Compound', weight: 0.3, min_apy: 2, max_apy: 5 },
        { protocol: 'Lido', weight: 0.3, min_apy: 3, max_apy: 5 }
      ];
    } else if (user_risk_score <= 0.7) { // Medium risk
      recommendations = [
        { protocol: 'Yearn', weight: 0.3, min_apy: 5, max_apy: 12 },
        { protocol: 'Curve', weight: 0.3, min_apy: 4, max_apy: 10 },
        { protocol: 'Aave', weight: 0.4, min_apy: 3, max_apy: 7 }
      ];
    } else { // High risk
      recommendations = [
        { protocol: 'Uniswap V3', weight: 0.4, min_apy: 8, max_apy: 25 },
        { protocol: 'Balancer', weight: 0.3, min_apy: 10, max_apy: 30 },
        { protocol: 'Yearn', weight: 0.3, min_apy: 6, max_apy: 15 }
      ];
    }

    return {
      recommendations,
      expected_apy: recommendations.reduce((sum, rec) => sum + (rec.min_apy + rec.max_apy) / 2 * rec.weight, 0),
      risk_score: user_risk_score,
      confidence: 0.75
    };
  }

  private async enhanceWithAI(
    mlRecommendations: any,
    userProfile: UserProfile,
    marketData: any[]
  ): Promise<AIRecommendation> {
    try {
      const prompt = this.buildAIPrompt(mlRecommendations, userProfile, marketData);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert DeFi yield optimization advisor. Provide detailed, 
            actionable investment strategies with clear reasoning. Always consider risk management 
            and diversification. Format your response as structured JSON.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Combine ML recommendations with AI reasoning
      const finalRecommendations: AIRecommendation = {
        strategy: {
          name: aiResponse.strategy_name || 'Personalized Yield Strategy',
          description: aiResponse.strategy_description || 'AI-optimized yield farming strategy',
          expectedAPY: mlRecommendations.expected_apy,
          riskScore: mlRecommendations.risk_score,
          timeframe: userProfile.timeHorizon
        },
        allocations: this.buildAllocations(mlRecommendations, userProfile, marketData, aiResponse),
        reasoning: aiResponse.detailed_reasoning || 'Strategy optimized based on your risk profile and market conditions',
        confidence: mlRecommendations.confidence,
        warnings: aiResponse.warnings || []
      };

      return finalRecommendations;
    } catch (error) {
      logger.error('Error enhancing with AI:', error);
      // Fallback without AI enhancement
      return this.buildBasicRecommendation(mlRecommendations, userProfile, marketData);
    }
  }

  private buildAIPrompt(mlRecommendations: any, userProfile: UserProfile, marketData: any[]): string {
    return `
Analyze the following data and provide personalized DeFi yield farming recommendations:

USER PROFILE:
- Risk Tolerance: ${userProfile.riskTolerance}
- Investment Amount: $${userProfile.investmentAmount}
- Time Horizon: ${userProfile.timeHorizon}
- Preferred Protocols: ${userProfile.preferredProtocols.join(', ')}
- Historical Performance: ${userProfile.historicalPerformance || 0}%

ML RECOMMENDATIONS:
${JSON.stringify(mlRecommendations, null, 2)}

TOP MARKET OPPORTUNITIES:
${JSON.stringify(marketData.slice(0, 10), null, 2)}

Please provide:
1. A strategy name and description
2. Detailed reasoning for the allocation
3. Risk warnings and considerations
4. Expected outcomes and timeline

Format as JSON with keys: strategy_name, strategy_description, detailed_reasoning, warnings
`;
  }

  private buildAllocations(
    mlRecommendations: any,
    userProfile: UserProfile,
    marketData: any[],
    aiResponse: any
  ): any[] {
    const allocations = [];
    
    for (const rec of mlRecommendations.recommendations) {
      // Find matching protocols in market data
      const matchingProtocols = marketData.filter(
        item => item.platform.toLowerCase().includes(rec.protocol.toLowerCase())
      );
      
      if (matchingProtocols.length > 0) {
        const bestMatch = matchingProtocols.sort((a, b) => b.apy - a.apy)[0];
        
        allocations.push({
          protocol: bestMatch.platform,
          token: bestMatch.token,
          percentage: rec.weight * 100,
          amount: userProfile.investmentAmount * rec.weight,
          reasoning: `Selected ${bestMatch.platform} for ${bestMatch.token} offering ${bestMatch.apy.toFixed(2)}% APY with risk score ${bestMatch.riskScore.toFixed(2)}`
        });
      }
    }
    
    return allocations;
  }

  private buildBasicRecommendation(
    mlRecommendations: any,
    userProfile: UserProfile,
    marketData: any[]
  ): AIRecommendation {
    return {
      strategy: {
        name: 'Balanced Yield Strategy',
        description: 'Diversified approach based on your risk tolerance',
        expectedAPY: mlRecommendations.expected_apy,
        riskScore: mlRecommendations.risk_score,
        timeframe: userProfile.timeHorizon
      },
      allocations: this.buildAllocations(mlRecommendations, userProfile, marketData, {}),
      reasoning: 'Strategy optimized using machine learning models based on your preferences and current market conditions',
      confidence: mlRecommendations.confidence,
      warnings: ['Please do your own research before investing', 'DeFi investments carry inherent risks']
    };
  }

  // Real-time strategy optimization
  async optimizeStrategy(
    currentStrategy: any,
    marketChanges: any,
    performanceData: any
  ): Promise<any> {
    try {
      const prompt = `
Optimize the following DeFi strategy based on market changes and performance data:

CURRENT STRATEGY:
${JSON.stringify(currentStrategy, null, 2)}

MARKET CHANGES:
${JSON.stringify(marketChanges, null, 2)}

PERFORMANCE DATA:
${JSON.stringify(performanceData, null, 2)}

Provide optimization recommendations including:
1. Rebalancing suggestions
2. New opportunities to consider
3. Positions to reduce or exit
4. Risk adjustments needed

Format as JSON.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a DeFi strategy optimizer. Provide actionable rebalancing advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      logger.error('Error optimizing strategy:', error);
      throw error;
    }
  }
}

export const aiRecommendationService = new AIRecommendationService();
