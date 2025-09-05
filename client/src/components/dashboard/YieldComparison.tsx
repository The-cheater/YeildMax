'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, ArrowRight, Star } from "lucide-react"

interface YieldData {
  platform: string
  token: string
  apy: number
  tvl: string
  riskScore: number
  logo: string
  change24h: number
  isRecommended?: boolean
}

const mockYieldData: YieldData[] = [
  { 
    platform: "Aave V3", 
    token: "USDC", 
    apy: 4.2, 
    tvl: "$1.2B", 
    riskScore: 0.9, 
    logo: "🏦", 
    change24h: 0.15,
    isRecommended: true
  },
  { 
    platform: "Compound V3", 
    token: "DAI", 
    apy: 3.8, 
    tvl: "$890M", 
    riskScore: 0.85, 
    logo: "🏛️", 
    change24h: -0.08
  },
  { 
    platform: "Yearn Finance", 
    token: "USDT", 
    apy: 5.1, 
    tvl: "$650M", 
    riskScore: 0.75, 
    logo: "🌾", 
    change24h: 0.34,
    isRecommended: true
  },
  { 
    platform: "Curve Finance", 
    token: "3CRV", 
    apy: 6.3, 
    tvl: "$2.1B", 
    riskScore: 0.8, 
    logo: "〰️", 
    change24h: 0.22
  },
  { 
    platform: "Uniswap V3", 
    token: "ETH/USDC", 
    apy: 8.7, 
    tvl: "$1.8B", 
    riskScore: 0.65, 
    logo: "🦄", 
    change24h: 1.2
  },
  { 
    platform: "Balancer", 
    token: "BAL/WETH", 
    apy: 12.4, 
    tvl: "$450M", 
    riskScore: 0.55, 
    logo: "⚖️", 
    change24h: -0.45
  }
]

export function YieldComparison() {
  const getRiskBadge = (score: number) => {
    if (score >= 0.8) return <Badge className="bg-green-500/20 text-green-400 font-bold">Low Risk</Badge>
    if (score >= 0.6) return <Badge className="bg-yellow-500/20 text-yellow-400 font-bold">Medium Risk</Badge>
    return <Badge className="bg-red-500/20 text-red-400 font-bold">High Risk</Badge>
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400"
  }

  return (
    <Card className="yield-card border-green-500/20">
      <CardHeader className="pb-8">
        <CardTitle className="card-title flex items-center space-x-3 text-white">
          <TrendingUp className="h-7 w-7 text-green-400" />
          <span>Top Yield Opportunities</span>
          <Badge className="bg-green-500/20 text-green-400 ml-auto">
            <Star className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockYieldData.map((yield_, index) => (
            <div 
              key={index} 
              className={`relative p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                yield_.isRecommended 
                  ? 'bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/30' 
                  : 'bg-white/3 hover:bg-white/8 border border-white/10'
              }`}
            >
              {yield_.isRecommended && (
                <div className="absolute -top-2 left-4">
                  <Badge className="bg-green-500 text-black font-bold text-xs">
                    AI RECOMMENDED
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-4xl">{yield_.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{yield_.platform}</h3>
                    <div className="flex items-center space-x-3">
                      <p className="text-gray-400 font-medium">{yield_.token}</p>
                      <span className={`text-sm font-medium ${getChangeColor(yield_.change24h)}`}>
                        {yield_.change24h >= 0 ? '+' : ''}{yield_.change24h}% 24h
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="metric-value text-green-400 mb-1">{yield_.apy}%</p>
                    <p className="text-sm text-gray-400 font-medium">APY</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-bold text-white mb-1">{yield_.tvl}</p>
                    <p className="text-sm text-gray-400 font-medium">TVL</p>
                  </div>
                  
                  <div className="text-center min-w-[120px]">
                    {getRiskBadge(yield_.riskScore)}
                    <div className="mt-3 w-full">
                      <Progress value={yield_.riskScore * 100} className="h-2" />
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="bg-green-500 hover:bg-green-600 text-black font-bold px-6"
                  >
                    Deposit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
