'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wallet, DollarSign, TrendingUp, Eye, Plus, ArrowUpRight } from "lucide-react"
import { YieldChart } from "@/components/charts/YieldChart"

const portfolioData = [
  { 
    name: 'Aave USDC', 
    value: 4500, 
    color: '#22c55e',
    apy: 4.2,
    dailyYield: 0.52,
    platform: 'Aave',
    token: 'USDC',
    logo: '🏦'
  },
  { 
    name: 'Compound DAI', 
    value: 3200, 
    color: '#3b82f6',
    apy: 3.8,
    dailyYield: 0.33,
    platform: 'Compound',
    token: 'DAI',
    logo: '🏛️'
  },
  { 
    name: 'Yearn USDT', 
    value: 2800, 
    color: '#f59e0b',
    apy: 5.1,
    dailyYield: 0.39,
    platform: 'Yearn',
    token: 'USDT',
    logo: '🌾'
  },
  { 
    name: 'Curve 3CRV', 
    value: 1900, 
    color: '#8b5cf6',
    apy: 6.3,
    dailyYield: 0.33,
    platform: 'Curve',
    token: '3CRV',
    logo: '〰️'
  },
]

const performanceData = [
  { period: '1D', value: '+$12.67', percentage: '+0.12%', color: 'text-green-400' },
  { period: '7D', value: '+$89.43', percentage: '+0.85%', color: 'text-green-400' },
  { period: '30D', value: '+$387.21', percentage: '+3.67%', color: 'text-green-400' },
  { period: '1Y', value: '+$4,521.33', percentage: '+42.8%', color: 'text-green-400' },
]

export function PortfolioTracker() {
  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)
  const totalDailyYield = portfolioData.reduce((sum, item) => sum + item.dailyYield, 0)
  const averageAPY = portfolioData.reduce((sum, item) => sum + item.apy, 0) / portfolioData.length

  return (
    <div className="space-y-8">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Value */}
        <Card className="yield-card border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Wallet className="h-6 w-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-400">+2.4%</Badge>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-2">Total Portfolio Value</p>
              <p className="metric-value text-white">${totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Yield */}
        <Card className="yield-card border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-400">Daily</Badge>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-2">Daily Yield</p>
              <p className="metric-value text-blue-400">+${totalDailyYield.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Average APY */}
        <Card className="yield-card border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-400">AVG</Badge>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-2">Average APY</p>
              <p className="metric-value text-purple-400">{averageAPY.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart & Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <Card className="yield-card border-green-500/20">
          <CardHeader>
            <CardTitle className="card-title text-white flex items-center justify-between">
              <span>Portfolio Performance</span>
              <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <YieldChart />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {performanceData.map((perf, index) => (
                <div key={index} className="text-center p-3 bg-white/3 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">{perf.period}</p>
                  <p className={`font-bold ${perf.color}`}>{perf.value}</p>
                  <p className={`text-xs ${perf.color}`}>{perf.percentage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Distribution */}
        <Card className="yield-card border-green-500/20">
          <CardHeader>
            <CardTitle className="card-title text-white flex items-center justify-between">
              <span>Asset Distribution</span>
              <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                <Plus className="h-4 w-4 mr-2" />
                Add Position
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.map((item, index) => (
                <div key={index} className="p-4 bg-white/3 rounded-xl hover:bg-white/8 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.logo}</span>
                      <div>
                        <h4 className="text-white font-bold">{item.platform}</h4>
                        <p className="text-gray-400 text-sm">{item.token}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${item.value.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+${item.dailyYield.toFixed(2)}/day</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-300">{item.apy}% APY</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3">
                    <Progress 
                      value={(item.value / totalValue) * 100} 
                      className="h-2" 
                      style={{ 
                        '--progress-background': item.color 
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
