'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle, Info, TrendingDown, TrendingUp } from "lucide-react"

const riskFactors = [
  { 
    name: "Smart Contract Risk", 
    score: 85, 
    status: "good",
    trend: "stable",
    description: "Audited contracts with strong security track record"
  },
  { 
    name: "Liquidity Risk", 
    score: 92, 
    status: "excellent",
    trend: "improving",
    description: "High liquidity across all positions"
  },
  { 
    name: "Protocol Risk", 
    score: 78, 
    status: "good",
    trend: "stable",
    description: "Established protocols with proven governance"
  },
  { 
    name: "Market Risk", 
    score: 65, 
    status: "moderate",
    trend: "volatile",
    description: "Moderate exposure to market volatility"
  },
  { 
    name: "Regulatory Risk", 
    score: 55, 
    status: "caution",
    trend: "declining",
    description: "Regulatory uncertainty in some jurisdictions"
  },
]

const riskDistribution = [
  { category: "Low Risk", percentage: 45, color: "bg-green-500", value: "$5,670" },
  { category: "Medium Risk", percentage: 35, color: "bg-yellow-500", value: "$4,410" },
  { category: "High Risk", percentage: 20, color: "bg-red-500", value: "$2,520" },
]

export function RiskAssessment() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'moderate':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'caution':
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Shield className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-3 w-3 text-green-400" />
      case 'declining':
        return <TrendingDown className="h-3 w-3 text-red-400" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      excellent: "bg-green-500/20 text-green-400",
      good: "bg-green-500/20 text-green-400",
      moderate: "bg-yellow-500/20 text-yellow-400",
      caution: "bg-red-500/20 text-red-400",
    }
    return badgeClasses[status as keyof typeof badgeClasses] || "bg-gray-500/20 text-gray-400"
  }

  const overallRisk = Math.round(riskFactors.reduce((sum, factor) => sum + factor.score, 0) / riskFactors.length)

  return (
    <div className="space-y-6">
      {/* Overall Risk Score Card */}
      <Card className="yield-card border-green-500/20">
        <CardHeader>
          <CardTitle className="card-title flex items-center space-x-3 text-white">
            <Shield className="h-6 w-6 text-green-400" />
            <span>Risk Assessment</span>
            <Badge className="bg-green-500/20 text-green-400 ml-auto">
              Updated Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Overall Risk Score */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/5 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Overall Risk Score</span>
              <div className="text-right">
                <span className={`metric-value ${getScoreColor(overallRisk)}`}>
                  {overallRisk}
                </span>
                <span className="text-gray-400 text-xl">/100</span>
              </div>
            </div>
            <Progress value={overallRisk} className="h-4 mb-4" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">
                Portfolio Risk Level: <span className="text-white font-bold">
                  {overallRisk >= 80 ? 'Low Risk' : overallRisk >= 60 ? 'Moderate Risk' : 'High Risk'}
                </span>
              </p>
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
          </div>

          {/* Risk Factors Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4">Risk Factor Analysis</h4>
            {riskFactors.map((factor, index) => (
              <div key={index} className="p-4 bg-white/3 rounded-xl hover:bg-white/8 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(factor.status)}
                    <span className="text-white font-medium">{factor.name}</span>
                    {getTrendIcon(factor.trend)}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusBadge(factor.status)}>
                      {factor.status.charAt(0).toUpperCase() + factor.status.slice(1)}
                    </Badge>
                    <span className={`text-lg font-bold ${getScoreColor(factor.score)}`}>
                      {factor.score}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <Progress value={factor.score} className="h-2" />
                </div>
                
                <p className="text-sm text-gray-400">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card className="yield-card border-green-500/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskDistribution.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/3 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${risk.color}`}></div>
                  <span className="text-white font-medium">{risk.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">{risk.value}</span>
                  <span className="text-white font-bold">{risk.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-white">Risk Management Tip:</strong>
            </p>
            <p className="text-xs text-gray-400">
              Consider rebalancing to reduce high-risk exposure. Diversify across different risk categories for optimal portfolio health.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
