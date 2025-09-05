// API Configuration
export const API_CONFIG = {
  VERSION: 'v1',
  BASE_PATH: '/api',
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_CACHE_TTL: 300, // 5 minutes in seconds
} as const;

// Supported Networks
export const SUPPORTED_NETWORKS = {
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    gasPrice: {
      slow: 20,
      standard: 25,
      fast: 30
    }
  },
  POLYGON: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    gasPrice: {
      slow: 30,
      standard: 35,
      fast: 40
    }
  },
  ARBITRUM: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    gasPrice: {
      slow: 0.1,
      standard: 0.2,
      fast: 0.3
    }
  },
  OPTIMISM: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    gasPrice: {
      slow: 0.001,
      standard: 0.002,
      fast: 0.003
    }
  }
} as const;

// DeFi Protocols
export const DEFI_PROTOCOLS = {
  AAVE: {
    name: 'Aave',
    logo: '🏦',
    category: 'lending',
    riskScore: 0.9,
    website: 'https://aave.com',
    contractAddresses: {
      [SUPPORTED_NETWORKS.ETHEREUM.id]: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
      [SUPPORTED_NETWORKS.POLYGON.id]: '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf'
    }
  },
  COMPOUND: {
    name: 'Compound',
    logo: '🏛️',
    category: 'lending',
    riskScore: 0.85,
    website: 'https://compound.finance',
    contractAddresses: {
      [SUPPORTED_NETWORKS.ETHEREUM.id]: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B'
    }
  },
  YEARN: {
    name: 'Yearn Finance',
    logo: '🌾',
    category: 'yield-farming',
    riskScore: 0.75,
    website: 'https://yearn.finance',
    contractAddresses: {
      [SUPPORTED_NETWORKS.ETHEREUM.id]: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'
    }
  },
  CURVE: {
    name: 'Curve Finance',
    logo: '〰️',
    category: 'dex',
    riskScore: 0.8,
    website: 'https://curve.fi',
    contractAddresses: {
      [SUPPORTED_NETWORKS.ETHEREUM.id]: '0xD533a949740bb3306d119CC777fa900bA034cd52'
    }
  },
  UNISWAP: {
    name: 'Uniswap',
    logo: '🦄',
    category: 'dex',
    riskScore: 0.85,
    website: 'https://uniswap.org',
    contractAddresses: {
      [SUPPORTED_NETWORKS.ETHEREUM.id]: '0x1F98431c8aD98523631AE4a59f267346ea31F984'
    }
  },
  LIDO: {
    name: 'Lido',
    logo: '🌊',
    category: 'liquid-staking',
    riskScore: 0.88,
    website: 'https://lido.fi',
    contractAddresses: {
      [SUPPORTED_NETWORKS.ETHEREUM.id]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'
    }
  }
} as const;

// Risk Levels
export const RISK_LEVELS = {
  LOW: {
    label: 'Low Risk',
    score: 0.8,
    color: '#22c55e',
    description: 'Established protocols with strong security track record'
  },
  MEDIUM: {
    label: 'Medium Risk',
    score: 0.6,
    color: '#f59e0b',
    description: 'Moderate risk with good track record'
  },
  HIGH: {
    label: 'High Risk',
    score: 0.4,
    color: '#ef4444',
    description: 'Higher risk protocols or newer/experimental features'
  }
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  REWARD: 'reward',
  SWAP: 'swap',
  COMPOUND: 'compound'
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

// Strategy Categories
export const STRATEGY_CATEGORIES = {
  CONSERVATIVE: {
    name: 'Conservative',
    description: 'Low-risk strategies focusing on stable returns',
    expectedAPY: { min: 2, max: 6 },
    riskLevel: 'low'
  },
  BALANCED: {
    name: 'Balanced',
    description: 'Balanced approach between risk and returns',
    expectedAPY: { min: 5, max: 12 },
    riskLevel: 'medium'
  },
  AGGRESSIVE: {
    name: 'Aggressive',
    description: 'High-risk, high-reward strategies',
    expectedAPY: { min: 10, max: 50 },
    riskLevel: 'high'
  },
  SPECIALIZED: {
    name: 'Specialized',
    description: 'Focused strategies for specific sectors or tokens',
    expectedAPY: { min: 4, max: 20 },
    riskLevel: 'medium'
  },
  AI_POWERED: {
    name: 'AI-Powered',
    description: 'Machine learning optimized strategies',
    expectedAPY: { min: 6, max: 25 },
    riskLevel: 'medium'
  }
} as const;

// External API Endpoints
export const EXTERNAL_APIS = {
  COINGECKO: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    endpoints: {
      coins: '/coins/markets',
      prices: '/simple/price',
      defi: '/coins/categories'
    },
    rateLimit: {
      requests: 50,
      window: 60000 // 1 minute
    }
  },
  DEFILLAMA: {
    baseUrl: 'https://api.llama.fi',
    endpoints: {
      protocols: '/protocols',
      yields: '/yields',
      tvl: '/tvl'
    },
    rateLimit: {
      requests: 300,
      window: 60000 // 1 minute
    }
  },
  AAVE: {
    baseUrl: 'https://aave-api-v2.aave.com',
    endpoints: {
      markets: '/data/markets-data',
      rates: '/data/rates-history'
    }
  },
  COMPOUND: {
    baseUrl: 'https://api.compound.finance/api/v2',
    endpoints: {
      ctoken: '/ctoken',
      account: '/account'
    }
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists with this email',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please provide a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  INVALID_AMOUNT: 'Amount must be a positive number',
  
  // Resources
  RESOURCE_NOT_FOUND: 'Resource not found',
  STRATEGY_NOT_FOUND: 'Strategy not found',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  PORTFOLIO_NOT_FOUND: 'Portfolio not found',
  
  // Business Logic
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  MINIMUM_INVESTMENT: 'Amount is below minimum investment requirement',
  INVALID_ALLOCATION: 'Strategy allocations must sum to 100%',
  TRANSACTION_ALREADY_COMPLETED: 'Transaction is already completed',
  
  // System
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database connection error',
  EXTERNAL_API_ERROR: 'External API error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  // Authentication
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully',
  PREFERENCES_UPDATED: 'Preferences updated successfully',
  
  // Portfolio
  POSITION_ADDED: 'Position added successfully',
  POSITION_UPDATED: 'Position updated successfully',
  POSITION_REMOVED: 'Position removed successfully',
  
  // Transactions
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  
  // Strategies
  STRATEGY_CREATED: 'Strategy created successfully',
  STRATEGY_UPDATED: 'Strategy updated successfully',
  STRATEGY_EXECUTED: 'Strategy executed successfully',
  STRATEGY_FOLLOWED: 'Strategy followed successfully',
  STRATEGY_UNFOLLOWED: 'Strategy unfollowed successfully'
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
  MONGODB_OBJECT_ID: /^[0-9a-fA-F]{24}$/
} as const;

// Cache Keys
export const CACHE_KEYS = {
  YIELDS: 'yields',
  TOP_YIELDS: 'top_yields',
  STRATEGIES: 'strategies',
  USER_PORTFOLIO: (userId: string) => `user_portfolio_${userId}`,
  USER_TRANSACTIONS: (userId: string) => `user_transactions_${userId}`,
  PROTOCOL_DATA: (protocol: string) => `protocol_${protocol}`,
  PRICE_DATA: (token: string) => `price_${token}`
} as const;

// Default Values
export const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100
  },
  STRATEGY: {
    MIN_INVESTMENT: 100,
    MAX_INVESTMENT: 1000000,
    DEFAULT_SLIPPAGE: 0.5,
    MAX_SLIPPAGE: 5.0
  },
  RISK_SCORE: 0.5,
  APY: 0,
  CURRENCY: 'USD',
  LANGUAGE: 'en',
  NOTIFICATION_PREFERENCES: {
    email: true,
    push: false,
    yield: true,
    security: true
  }
} as const;

// Time Constants (in milliseconds)
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
} as const;

// Export all constants as a single object for easy importing
export const CONSTANTS = {
  API_CONFIG,
  SUPPORTED_NETWORKS,
  DEFI_PROTOCOLS,
  RISK_LEVELS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  STRATEGY_CATEGORIES,
  EXTERNAL_APIS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  CACHE_KEYS,
  DEFAULTS,
  TIME_CONSTANTS
} as const;

export default CONSTANTS;
