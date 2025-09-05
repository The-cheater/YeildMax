import axios from 'axios';
import cron from 'node-cron';
import Yield from '../models/Yield';
import logger from '../utils/logger';

export interface YieldData {
  platform: string;
  token: string;
  apy: number;
  tvl: string;
  riskScore: number;
  category: string;
  chainId: number;
  lastUpdated: Date;
}

export class YieldService {
  async fetchCoinGeckoYields(): Promise<YieldData[]> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          category: 'decentralized-finance-defi',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1
        }
      });

      return response.data.map((coin: any) => ({
        platform: coin.name,
        token: coin.symbol.toUpperCase(),
        apy: Math.random() * 10 + 2, // Mock APY - replace with actual calculation
        tvl: `$${(coin.market_cap / 1000000).toFixed(1)}M`,
        riskScore: Math.random() * 0.4 + 0.6, // Mock risk score
        category: 'defi',
        chainId: 1, // Ethereum mainnet
        lastUpdated: new Date()
      }));
    } catch (error) {
      logger.error('Error fetching CoinGecko yields:', error);
      throw error;
    }
  }

  async fetchDeFiLlamaYields(): Promise<YieldData[]> {
    try {
      const response = await axios.get('https://yields.llama.fi/pools');
      
      return response.data.data.slice(0, 20).map((pool: any) => ({
        platform: pool.project,
        token: pool.symbol,
        apy: pool.apy || 0,
        tvl: `$${(pool.tvlUsd / 1000000).toFixed(1)}M`,
        riskScore: this.calculateRiskScore(pool),
        category: pool.category || 'defi',
        chainId: this.getChainId(pool.chain),
        lastUpdated: new Date()
      }));
    } catch (error) {
      logger.error('Error fetching DeFiLlama yields:', error);
      throw error;
    }
  }

  private calculateRiskScore(pool: any): number {
    // Simple risk calculation based on various factors
    let score = 0.8; // Base score

    // Adjust based on TVL
    if (pool.tvlUsd > 100000000) score += 0.1; // $100M+ TVL
    if (pool.tvlUsd < 10000000) score -= 0.2;  // <$10M TVL

    // Adjust based on audit status
    if (pool.audits && pool.audits.length > 0) score += 0.1;

    return Math.min(Math.max(score, 0.1), 1.0);
  }

  private getChainId(chain: string): number {
    const chainMap: { [key: string]: number } = {
      'ethereum': 1,
      'polygon': 137,
      'arbitrum': 42161,
      'optimism': 10,
      'bsc': 56
    };
    return chainMap[chain.toLowerCase()] || 1;
  }

  async updateYieldData(): Promise<void> {
    try {
      logger.info('Updating yield data...');

      const [coinGeckoYields, defiLlamaYields] = await Promise.all([
        this.fetchCoinGeckoYields(),
        this.fetchDeFiLlamaYields()
      ]);

      const allYields = [...coinGeckoYields, ...defiLlamaYields];

      // Update database
      for (const yieldData of allYields) {
        await Yield.findOneAndUpdate(
          { platform: yieldData.platform, token: yieldData.token },
          yieldData,
          { upsert: true, new: true }
        );
      }

      logger.info(`Updated ${allYields.length} yield records`);
    } catch (error) {
      logger.error('Error updating yield data:', error);
    }
  }

  async getAllYields(filters?: any): Promise<YieldData[]> {
    const query = filters || {};
    return await Yield.find(query).sort({ apy: -1 });
  }

  async getTopYields(limit: number = 10): Promise<YieldData[]> {
    return await Yield.find()
      .sort({ apy: -1 })
      .limit(limit);
  }

  async getYieldById(id: string): Promise<YieldData | null> {
    try {
      return await Yield.findById(id);
    } catch (error) {
      logger.error('Error fetching yield by id:', error);
      return null;
    }
  }
}

export const yieldService = new YieldService();

// Cron jobs for data fetching
export function startCronJobs() {
  // Update yield data every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    await yieldService.updateYieldData();
  });

  // Initial data fetch
  setTimeout(() => {
    yieldService.updateYieldData();
  }, 5000);
}
