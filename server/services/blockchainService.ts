import { ethers } from 'ethers';
import logger from '../utils/logger';

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    );
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address owner) view returns (uint256)'],
        this.provider
      );

      const balance = await tokenContract.balanceOf(walletAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      logger.error('Error getting token balance:', error);
      throw error;
    }
  }

  async getEthBalance(walletAddress: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(walletAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      logger.error('Error getting ETH balance:', error);
      throw error;
    }
  }

  async estimateGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getGasPrice();
      return ethers.utils.formatUnits(gasPrice, 'gwei');
    } catch (error) {
      logger.error('Error estimating gas price:', error);
      throw error;
    }
  }

  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      logger.error('Error getting transaction receipt:', error);
      throw error;
    }
  }

  async simulateTransaction(transaction: any): Promise<any> {
    try {
      // Simulate transaction using eth_call
      const result = await this.provider.call(transaction);
      return result;
    } catch (error) {
      logger.error('Error simulating transaction:', error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
