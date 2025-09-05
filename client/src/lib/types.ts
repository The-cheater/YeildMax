export interface YieldData {
    platform: string
    token: string
    apy: number
    tvl: string
    riskScore: number
    logo: string
    change24h: number
    isRecommended?: boolean
    category: 'lending' | 'dex' | 'yield-farming' | 'liquid-staking'
  }
  
  export interface PortfolioPosition {
    platform: string
    token: string
    amount: number
    value: number
    apy: number
    dailyYield: number
    riskScore: number
  }
  
  export interface RiskFactor {
    name: string
    score: number
    status: 'excellent' | 'good' | 'moderate' | 'caution' | 'high'
    description: string
  }
  
  export interface AIRecommendation {
    type: 'optimize' | 'diversify' | 'new_opportunity' | 'risk_reduction'
    title: string
    description: string
    potentialGain: string
    confidence: number
    action: 'one_click' | 'explore' | 'new_position'
    priority: 'high' | 'medium' | 'low'
  }
  
  export interface WalletState {
    isConnected: boolean
    address: string
    balance: string
    chainId: number
    isConnecting: boolean
  }
  