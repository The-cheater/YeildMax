export const SUPPORTED_NETWORKS = {
    ETHEREUM: {
      id: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      blockExplorer: 'https://etherscan.io'
    },
    POLYGON: {
      id: 137,
      name: 'Polygon',
      symbol: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      blockExplorer: 'https://polygonscan.com'
    },
    ARBITRUM: {
      id: 42161,
      name: 'Arbitrum',
      symbol: 'ETH',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      blockExplorer: 'https://arbiscan.io'
    }
  }
  
  export const SUPPORTED_PROTOCOLS = [
    {
      name: 'Aave',
      logo: '🏦',
      category: 'lending',
      riskScore: 0.9,
      website: 'https://aave.com'
    },
    {
      name: 'Compound',
      logo: '🏛️',
      category: 'lending',
      riskScore: 0.85,
      website: 'https://compound.finance'
    },
    {
      name: 'Yearn Finance',
      logo: '🌾',
      category: 'yield-farming',
      riskScore: 0.75,
      website: 'https://yearn.finance'
    },
    {
      name: 'Curve',
      logo: '〰️',
      category: 'dex',
      riskScore: 0.8,
      website: 'https://curve.fi'
    },
    {
      name: 'Uniswap',
      logo: '🦄',
      category: 'dex',
      riskScore: 0.85,
      website: 'https://uniswap.org'
    }
  ]
  
  export const API_ENDPOINTS = {
    COINGECKO: 'https://api.coingecko.com/api/v3',
    DEFILLAMA: 'https://api.llama.fi',
    COINBASE: 'https://api.coinbase.com/v2'
  }
  
  export const REFRESH_INTERVALS = {
    YIELD_DATA: 15000, // 15 seconds
    PORTFOLIO_DATA: 30000, // 30 seconds
    PRICE_DATA: 5000 // 5 seconds
  }
  
  export const RISK_THRESHOLDS = {
    LOW: 0.8,
    MEDIUM: 0.6,
    HIGH: 0.4
  }
  
  export const DEFAULT_SLIPPAGE = 0.5 // 0.5%
  export const MAX_SLIPPAGE = 5.0 // 5%
  
  export const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    SWAP: 'swap',
    STAKE: 'stake',
    UNSTAKE: 'unstake'
  } as const
  