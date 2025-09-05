'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Clock,
  Sparkles,
  Target,
  AlertTriangle
} from 'lucide-react'

interface RecommendationEngineProps {
  userProfile?: any;
}

export function RecommendationEngine({ userProfile }: RecommendationEngineProps) {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          riskTolerance: 'medium',
          investmentAmount: 5000,
          timeHorizon: 'medium',
          preferredProtocols: ['Aave', 'Yearn', 'Curve']
        })
      })
      
      const data = await response.json()
      setRecommendations(data.data)
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!recommendations) {
    return (
      <Card className="yield-card border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-6 w-6 text-green-400" />
            <span>AI Recommendation Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-green-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Get Personalized Yield Strategies
            </h3>
            <p className="text-gray-400 mb-6">
              Our AI analyzes 50+ protocols and your preferences to create optimal yield farming strategies
            </p>
            <Button 
              onClick={generateRecommendations}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3"
            >
              {loading ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Generate Strategy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <Card className="yield-card border-green-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="h-6 w-6 text-green-400" />
              <span>{recommendations.strategy.name}</span>
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400">
              {Math.round(recommendations.confidence * 100)}% Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">{recommendations.strategy.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {recommendations.strategy.expectedAPY.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400">Expected APY</div>
            </div>
            
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(recommendations.strategy.riskScore * 100)}/100
              </div>
              <div className="text-sm text-gray-400">Risk Score</div>
            </div>
            
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {recommendations.strategy.timeframe}
              </div>
              <div className="text-sm text-gray-400">Time Horizon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocations */}
      <Card className="yield-card border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-green-400" />
            <span>Recommended Allocations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.allocations.map((allocation: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 font-bold text-lg">
                        {allocation.protocol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{allocation.protocol}</h4>
                      <p className="text-gray-400 text-sm">{allocation.token}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {allocation.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      ${allocation.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <Progress value={allocation.percentage} className="mb-2" />
                <p className="text-gray-300 text-sm">{allocation.reasoning}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Reasoning */}
      <Card className="yield-card border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-6 w-6 text-green-400" />
            <span>AI Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{recommendations.reasoning}</p>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {recommendations.warnings && recommendations.warnings.length > 0 && (
        <Card className="yield-card border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Important Considerations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.warnings.map((warning: string, index: number) => (
                <li key={index} className="text-yellow-300 flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="text-center">
        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3 text-lg">
          Execute Strategy
        </Button>
      </div>
    </div>
  )
}
