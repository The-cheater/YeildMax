'use client'

import { Header } from "@/components/layout/Header"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { YieldChart } from "@/components/charts/YieldChart"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Percent,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react"

const analyticsData = {
  totalReturn: 12.4,
  monthlyYield: 287.50,
  yearlyProjection: 3450,
  bestPerformer: "Curve 3CRV",
  worstPerformer: "Balancer BAL/WETH"
}

const performanceMetrics = [
  { name: "Total Return", value: "+12.4%", trend: "up", period: "All Time" },
  { name: "Monthly Yield", value: "$287.50", trend: "up", period: "This Month" },
  { name: "Yearly Projection", value: "$3,450", trend: "up", period: "Projected" },
  { name: "Risk Score", value: "76/100", trend: "stable", period: "Current" },
]

const platformPerformance = [
  { name: "Aave USDC", return: 8.2, allocation: 35, color: "bg-green-500" },
  { name: "Compound DAI", return: 6.4, allocation: 25, color: "bg-blue-500" },
  { name: "Yearn USDT", return: 15.3, allocation: 22, color: "bg-yellow-500" },
  { name: "Curve 3CRV", return: 18.7, allocation: 18, color: "bg-purple-500" },
]

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Portfolio <span className="primary-gradient">Analytics</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Deep insights into your DeFi portfolio performance
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="yield-card border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      {index === 0 && <TrendingUp className="h-6 w-6 text-green-400" />}
                      {index === 1 && <DollarSign className="h-6 w-6 text-green-400" />}
                      {index === 2 && <BarChart3 className="h-6 w-6 text-green-400" />}
                      {index === 3 && <Percent className="h-6 w-6 text-green-400" />}
                    </div>
                    <div className="flex items-center space-x-1">
                      {metric.trend === "up" && <ArrowUp className="h-4 w-4 text-green-400" />}
                      {metric.trend === "down" && <ArrowDown className="h-4 w-4 text-red-400" />}
                      <Badge className={
                        metric.trend === "up" ? "bg-green-500/20 text-green-400" :
                        metric.trend === "down" ? "bg-red-500/20 text-red-400" :
                        "bg-gray-500/20 text-gray-400"
                      }>
                        {metric.period}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium mb-2">{metric.name}</p>
                    <p className={`metric-value ${
                      metric.trend === "up" ? "text-green-400" :
                      metric.trend === "down" ? "text-red-400" :
                      "text-white"
                    }`}>
                      {metric.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Portfolio Performance Chart */}
            <Card className="yield-card border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  <span>Portfolio Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <YieldChart />
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">7D Return</p>
                    <p className="text-green-400 font-bold">+2.4%</p>
                  </div>
                  <div className="text-center p-3 bg-white/3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">30D Return</p>
                    <p className="text-green-400 font-bold">+8.7%</p>
                  </div>
                  <div className="text-center p-3 bg-white/3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">1Y Return</p>
                    <p className="text-green-400 font-bold">+45.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card className="yield-card border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>Platform Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {platformPerformance.map((platform, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{platform.name}</span>
                        <div className="text-right">
                          <span className="text-green-400 font-bold">+{platform.return}%</span>
                          <p className="text-gray-400 text-sm">{platform.allocation}% allocation</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className={`${platform.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${platform.allocation}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
                  <h4 className="text-white font-bold mb-2">Performance Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Best Performer</p>
                      <p className="text-green-400 font-medium">{analyticsData.bestPerformer}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Needs Attention</p>
                      <p className="text-yellow-400 font-medium">{analyticsData.worstPerformer}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
