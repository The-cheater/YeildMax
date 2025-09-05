import Moralis from 'moralis';
import axios from 'axios';
import { ethers } from 'ethers';
import logger from '../utils/logger';
import { Redis } from 'ioredis';

export class RealDeFiService {
  private redis: Redis;
  private provider: ethers.providers.JsonRpcProvider;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.provider = new ethers.providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    );
    this.initializeMoralis();
  }

  private async initializeMoralis() {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY!,
      });
    }
  }

  // Fetch real-time DeFi yields from multiple sources
  async fetchRealTimeYields(): Promise<any[]> {
    try {
      const cacheKey = 'defi_yields_realtime';
      const cached = await this.redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      const [aaveData, compoundData, defiLlamaData, curveData] = await Promise.all([
        this.fetchAaveYields(),
        this.fetchCompoundYields(), 
        this.fetchDeFiLlamaYields(),
        this.fetchCurveYields()
      ]);

      const allYields = [...aaveData, ...compoundData, ...defiLlamaData, ...curveData];
      
      // Cache for 5 minutes
      await this.redis.setex(cacheKey, 300, JSON.stringify(allYields));
      
      return allYields;
    } catch (error) {
      logger.error('Error fetching real-time yields:', error);
      throw error;
    }
  }

  private async fetchAaveYields(): Promise<any[]> {
    try {
      const response = await axios.get('https://aave-api-v2.aave.com/data/markets-data');
      
      return response.data.reserves.map((reserve: any) => ({
        platform: 'Aave V3',
        token: reserve.symbol,
        apy: parseFloat(reserve.liquidityRate) / 1e25 * 100, // Convert from ray to percentage
        tvl: `$${(parseFloat(reserve.totalLiquidity) / 1e18 * reserve.price.priceInEth).toFixed(2)}M`,
        riskScore: this.calculateAaveRiskScore(reserve),
        category: 'lending',
        chainId: 1,
        contractAddress: reserve.aTokenAddress,
        audits: ['PeckShield', 'Trail of Bits', 'OpenZeppelin'],
        metrics: {
          dailyVolume: parseFloat(reserve.totalBorrows) / 1e18,
          utilization: (parseFloat(reserve.totalBorrows) / parseFloat(reserve.totalLiquidity)) * 100
        },
        lastUpdated: new Date()
      }));
    } catch (error) {
      logger.error('Error fetching Aave data:', error);
      return [];
    }
  }

  private async fetchCompoundYields(): Promise<any[]> {
    try {
      const response = await axios.get('https://api.compound.finance/api/v2/ctoken');
      
      return response.data.cToken.map((token: any) => ({
        platform: 'Compound V3',
        token: token.underlying_symbol || 'ETH',
        apy: parseFloat(token.supply_rate.value) * 100,
        tvl: `$${(parseFloat(token.total_supply.value) * parseFloat(token.exchange_rate.value)).toFixed(2)}M`,
        riskScore: this.calculateCompoundRiskScore(token),
        category: 'lending',
        chainId: 1,
        contractAddress: token.token_address,
        audits: ['OpenZeppelin', 'ConsenSys Diligence'],
        metrics: {
          dailyVolume: parseFloat(token.total_borrows.value),
          utilization: parseFloat(token.borrow_rate.value) * 100
        },
        lastUpdated: new Date()
      }));
    } catch (error) {
      logger.error('Error fetching Compound data:', error);
      return [];
    }
  }

  private async fetchDeFiLlamaYields(): Promise<any[]> {
    try {
      const response = await axios.get('https://yields.llama.fi/pools');
      
      return response.data.data
        .slice(0, 50)
        .filter((pool: any) => pool.tvlUsd > 1000000) // Filter pools with >$1M TVL
        .map((pool: any) => ({
          platform: pool.project,
          token: pool.symbol,
          apy: pool.apy || 0,
          tvl: `$${(pool.tvlUsd / 1000000).toFixed(1)}M`,
          riskScore: this.calculateDeFiLlamaRiskScore(pool),
          category: this.mapDeFiLlamaCategory(pool.category),
          chainId: this.getChainId(pool.chain),
          contractAddress: pool.pool,
          audits: pool.audits || [],
          metrics: {
            dailyVolume: pool.volumeUsd1d || 0,
            weeklyVolume: pool.volumeUsd7d || 0,
            apy1d: pool.apy1d || 0,
            apy7d: pool.apy7d || 0,
            apy30d: pool.apy30d || 0
          },
          lastUpdated: new Date()
        }));
    } catch (error) {
      logger.error('Error fetching DeFiLlama data:', error);
      return [];
    }
  }

  private async fetchCurveYields(): Promise<any[]> {
    try {
      const response = await axios.get('https://api.curve.fi/api/getPools/ethereum/main');
      
      return response.data.data.poolData.map((pool: any) => ({
        platform: 'Curve Finance',
        token: pool.coins.map((coin: any) => coin.symbol).join('/'),
        apy: parseFloat(pool.gaugeCrvApy[0] || '0') + parseFloat(pool.gaugeRewardsApy[0] || '0'),
        tvl: `$${(pool.usdTotal / 1000000).toFixed(1)}M`,
        riskScore: this.calculateCurveRiskScore(pool),
        category: 'dex',
        chainId: 1,
        contractAddress: pool.address,
        audits: ['MixBytes', 'ChainSecurity'],
        metrics: {
          dailyVolume: pool.volumeUSD || 0,
          virtualPrice: pool.virtualPrice || 1,
          amplification: pool.A || 0
        },
        lastUpdated: new Date()
      }));
    } catch (error) {
      logger.error('Error fetching Curve data:', error);
      return [];
    }
  }

  // Enhanced 1inch integration for optimal swaps
  async getOptimalSwapRoute(fromToken: string, toToken: string, amount: string): Promise<any> {
    try {
      const response = await axios.get('https://api.1inch.dev/swap/v5.2/1/quote', {
        params: {
          src: fromToken,
          dst: toToken,
          amount: amount
        },
        headers: {
          'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`
        }
      });

      return {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: response.data.toAmount,
        protocols: response.data.protocols,
        gasEstimate: response.data.gas,
        estimatedGas: response.data.estimatedGas
      };
    } catch (error) {
      logger.error('Error getting 1inch swap route:', error);
      throw error;
    }
  }

  // Real-time portfolio tracking using Moralis
  async trackPortfolioRealTime(walletAddress: string): Promise<any> {
    try {
      const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
        chain: '0x1',
        address: walletAddress
      });

      const portfolio = response.raw.result.map((token: any) => ({
        token: token.symbol,
        balance: token.balance_formatted,
        value: parseFloat(token.usd_value || '0'),
        price: parseFloat(token.usd_price || '0'),
        change24h: parseFloat(token.usd_price_24hr_percent_change || '0')
      }));

      return {
        totalValue: portfolio.reduce((sum: number, token: any) => sum + token.value, 0),
        tokens: portfolio,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Error tracking portfolio:', error);
      throw error;
    }
  }

  // Helper methods for risk scoring
  private calculateAaveRiskScore(reserve: any): number {
    const utilization = parseFloat(reserve.totalBorrows) / parseFloat(reserve.totalLiquidity);
    const baseScore = 0.9; // Aave is generally low risk
    
    // Adjust based on utilization
    if (utilization > 0.8) return Math.max(baseScore - 0.2, 0.5);
    if (utilization > 0.6) return baseScore - 0.1;
    
    return baseScore;
  }

  private calculateCompoundRiskScore(token: any): number {
    const utilization = parseFloat(token.borrow_rate.value);
    const baseScore = 0.85; // Compound baseline
    
    if (utilization > 0.1) return Math.max(baseScore - 0.15, 0.5);
    if (utilization > 0.05) return baseScore - 0.1;
    
    return baseScore;
  }

  private calculateDeFiLlamaRiskScore(pool: any): number {
    let score = 0.7; // Base score
    
    // Adjust based on TVL
    if (pool.tvlUsd > 100000000) score += 0.2; // $100M+ TVL
    if (pool.tvlUsd > 1000000000) score += 0.1; // $1B+ TVL
    
    // Adjust based on audit count
    if (pool.audits && pool.audits.length > 0) score += 0.1;
    
    // Adjust based on chain
    if (pool.chain === 'Ethereum') score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private calculateCurveRiskScore(pool: any): number {
    const baseScore = 0.8;
    const virtualPrice = parseFloat(pool.virtualPrice || '1');
    
    // Curve pools with virtual price close to 1 are safer
    if (virtualPrice > 1.05 || virtualPrice < 0.95) return baseScore - 0.1;
    
    return baseScore;
  }

  private mapDeFiLlamaCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Lending': 'lending',
      'DEX': 'dex',
      'Yield': 'yield-farming',
      'Liquid Staking': 'liquid-staking'
    };
    
    return categoryMap[category] || 'defi';
  }

  private getChainId(chainName: string): number {
    const chainMap: { [key: string]: number } = {
      'Ethereum': 1,
      'Polygon': 137,
      'Arbitrum': 42161,
      'Optimism': 10,
      'BSC': 56
    };
    
    return chainMap[chainName] || 1;
  }
}

export const realDeFiService = new RealDeFiService();
