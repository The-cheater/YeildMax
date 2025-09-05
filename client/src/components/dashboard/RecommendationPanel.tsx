'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowRight, Star, Zap, Target, Shield, TrendingUp } from "lucide-react"

const recommendations = [
  {
    type: "optimize",
    title: "Optimize USDC Allocation for Higher Yields",
    description: "Move $2,500 USDC from Aave (4.2% APY) to Yearn Finance (5.1% APY) for better returns.",
    potentialGain: "+$22.50/month",
    confidence: 95,
    action: "one_click",
    priority: "high",
    timeToExecute: "~2 minutes",
    gasEstimate: "$12",
    category: "yield"
  },
  {
    type: "diversify",
    title: "Reduce Stablecoin Concentration Risk",
    description: "Your portfolio is 68% stablecoins. Consider adding ETH liquid staking for diversification.",
    potentialGain: "Risk reduction + potential upside",
    confidence: 87,
    action: "explore",
    priority: "medium",
    timeToExecute: "~5 minutes",
    gasEstimate: "$18",
    category: "risk"
  },
  {
    type: "new_opportunity",
    title: "High-Yield Curve LP Pool Available",
    description: "New USDC-USDT-DAI pool on Curve offering 8.2% APY with additional CRV rewards.",
    potentialGain: "+$156/month",
    confidence: 78,
    action: "new_position",
    priority: "high",
    timeToExecute: "~3 minutes",
    gasEstimate: "$25",
    category: "yield"
  },
  {
    type: "risk_reduction",
    title: "Rebalance High-Risk Positions",
    description: "Consider reducing exposure to newer protocols and increasing allocation to battle-tested platforms.",
    potentialGain: "Lower portfolio risk",
    confidence: 82,
    action: "explore",
    priority: "medium",
    timeToExecute: "~10 minutes",
    gasEstimate: "$35",
    category: "risk"
  }
]

const aiInsights = {
  marketSentiment: "Bullish",
  gasPrice: "23 gwei",
  bestTimeToExecute: "Now",
  totalPotentialGain: "+$178.50/month",
  portfolioHealth: 92
}

export function RecommendationPanel() {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-400"
    if (confidence >= 75) return "text-yellow-400"
    return "text-orange-400"
  }

  const getTypeConfig = (type: string) => {
    const configs = {
      optimize: { 
        color: 'bg-blue-500/20 text-blue-400', 
        icon: TrendingUp,
        label: 'Optimize'
      },
      diversify: { 
        color: 'bg-purple-500/20 text-purple-400', 
        icon: Target,
        label: 'Diversify'
      },
      new_opportunity: { 
        color: 'bg-green-500/20 text-green-400', 
        icon: Zap,
        label: 'New Opportunity'
      },
      risk_reduction: { 
        color: 'bg-yellow-500/20 text-yellow-400', 
        icon: Shield,
        label: 'Risk Reduction'
      }
    }
    return configs[type as keyof typeof configs] || configs.optimize
  }

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      high: "bg-red-500/20 text-red-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-gray-500/20 text-gray-400"
    }
    return priorityClasses[priority as keyof typeof priorityClasses]
  }

  return (
    <div className="space-y-8">
      {/* AI Insights Header */}
      <Card className="yield-card border-green-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Brain className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Market Intelligence</h3>
                <p className="text-gray-400">Real-time analysis & optimization</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              Live Analysis
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/3 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">Market Sentiment</p>
              <p className="text-green-400 font-bold">{aiInsights.marketSentiment}</p>
            </div>
            <div className="text-center p-4 bg-white/3 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">Gas Price</p>
              <p className="text-blue-400 font-bold">{aiInsights.gasPrice}</p>
            </div>
            <div className="text-center p-4 bg-white/3 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">Best Time</p>
              <p className="text-purple-400 font-bold">{aiInsights.bestTimeToExecute}</p>
            </div>
            <div className="text-center p-4 bg-white/3 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">Potential Gain</p>
              <p className="text-green-400 font-bold">{aiInsights.totalPotentialGain}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="yield-card border-green-500/20">
        <CardHeader>
          <CardTitle className="card-title flex items-center space-x-3 text-white">
            <Brain className="h-6 w-6 text-green-400" />
            <span>Smart Recommendations</span>
            <Badge className="bg-green-500/20 text-green-400 ml-auto">
              4 Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((rec, index) => {
              const typeConfig = getTypeConfig(rec.type)
              const IconComponent = typeConfig.icon

              return (
                <div key={index} className="p-6 rounded-xl bg-white/3 hover:bg-white/8 transition-all duration-300 border border-white/10 hover:border-green-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                        <Badge className={getPriorityBadge(rec.priority)}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <span className={`text-sm font-bold ${getConfidenceColor(rec.confidence)}`}>
                          {rec.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-black font-bold px-6"
                    >
                      {rec.action === 'one_click' ? 'Execute Now' : 
                       rec.action === 'explore' ? 'Learn More' : 'Add Position'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-3">{rec.title}</h4>
                  <p className="text-gray-400 mb-4 leading-relaxed">{rec.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-green-400 font-bold text-lg">{rec.potentialGain}</p>
                        <p className="text-xs text-gray-500">Potential gain</p>
                      </div>
                      <div>
                        <p className="text-blue-400 font-bold">{rec.timeToExecute}</p>
                        <p className="text-xs text-gray-500">Execution time</p>
                      </div>
                      <div>
                        <p className="text-purple-400 font-bold">{rec.gasEstimate}</p>
                        <p className="text-xs text-gray-500">Est. gas cost</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Progress value={rec.confidence} className="w-24 h-2" />
                      <span className="text-xs text-gray-400">Confidence</span>
                    </div>
                    {rec.action === 'one_click' && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        One-click execution
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Portfolio Health Summary */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-400" />
                <div>
                  <h4 className="text-white font-bold">Portfolio Health Score</h4>
                  <p className="text-gray-400 text-sm">Based on diversification, risk, and yield optimization</p>
                </div>
              </div>
              <div className="text-right">
                <span className="metric-value text-green-400">{aiInsights.portfolioHealth}</span>
                <span className="text-gray-400 text-xl">/100</span>
              </div>
            </div>
            <Progress value={aiInsights.portfolioHealth} className="h-3 mb-4" />
            <p className="text-sm text-gray-300">
              <strong className="text-white">Excellent performance!</strong> Your diversified strategy and active optimization are delivering strong risk-adjusted returns. Consider implementing the high-priority recommendations above for even better results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
