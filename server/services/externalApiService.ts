import axios from 'axios';
import logger from '../utils/logger';

export class ExternalApiService {
  private coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3';
  private defiLlamaBaseUrl = 'https://api.llama.fi';

  async fetchCoinGeckoPrices(coinIds: string[]): Promise<any> {
    try {
      const response = await axios.get(`${this.coinGeckoBaseUrl}/simple/price`, {
        params: {
          ids: coinIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching CoinGecko prices:', error);
      throw error;
    }
  }

  async fetchDeFiLlamaProtocols(): Promise<any> {
    try {
      const response = await axios.get(`${this.defiLlamaBaseUrl}/protocols`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching DeFiLlama protocols:', error);
      throw error;
    }
  }

  async fetchDeFiLlamaYields(): Promise<any> {
    try {
      const response = await axios.get(`${this.defiLlamaBaseUrl}/yields`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching DeFiLlama yields:', error);
      throw error;
    }
  }

  async fetchAaveData(): Promise<any> {
    try {
      const response = await axios.get('https://aave-api-v2.aave.com/data/markets-data');
      return response.data;
    } catch (error) {
      logger.error('Error fetching Aave data:', error);
      throw error;
    }
  }

  async fetchCompoundData(): Promise<any> {
    try {
      const response = await axios.get('https://api.compound.finance/api/v2/ctoken');
      return response.data;
    } catch (error) {
      logger.error('Error fetching Compound data:', error);
      throw error;
    }
  }
}

export const externalApiService = new ExternalApiService();
