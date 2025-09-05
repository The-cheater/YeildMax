'use client'

import { useState } from 'react'
import { Header } from "@/components/layout/Header"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  DollarSign,
  Calendar,
  Users,
  Star,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Brain
} from "lucide-react"

const strategies = [
  {
    id: 1,
    name: "Conservative Stablecoin Strategy",
    description: "Low-risk approach focusing on established lending protocols with stablecoins",
    category: "Conservative",
    expectedAPY: "4.5%",
    riskLevel: "Low",
    minInvestment: "$1,000",
    protocols: ["Aave", "Compound"],
    followers: 1247,
    performance: "+12.3%",
    color: "bg-green-500",
    isRecommended: true
  },
  {
    id: 2,
    name: "Balanced Yield Farming",
    description: "Diversified strategy across DeFi protocols balancing risk and returns",
    category: "Balanced",
    expectedAPY: "8.7%",
    riskLevel: "Medium",
    minInvestment: "$2,500",
    protocols: ["Yearn", "Curve", "Uniswap"],
    followers: 892,
    performance: "+24.8%",
    color: "bg-blue-500",
    isRecommended: false
  },
  {
    id: 3,
    name: "Aggressive Growth",
    description: "High-yield opportunities with newer protocols and higher risk tolerance",
    category: "Aggressive",
    expectedAPY: "15.2%",
    riskLevel: "High",
    minInvestment: "$5,000",
    protocols: ["New DeFi", "Liquid Staking", "LP Tokens"],
    followers: 534,
    performance: "+45.6%",
    color: "bg-purple-500",
    isRecommended: false
  },
  {
    id: 4,
    name: "Liquid Staking Focus",
    description: "Concentrated on Ethereum staking derivatives with steady returns",
    category: "Specialized",
    expectedAPY: "6.8%",
    riskLevel: "Low-Medium",
    minInvestment: "$1,500",
    protocols: ["Lido", "Rocket Pool", "Frax"],
    followers: 756,
    performance: "+18.4%",
    color: "bg-indigo-500",
    isRecommended: true
  },
  {
    id: 5,
    name: "Multi-Chain Arbitrage",
    description: "Cross-chain opportunities leveraging price differences across networks",
    category: "Advanced",
    expectedAPY: "12.4%",
    riskLevel: "Medium-High",
    minInvestment: "$3,000",
    protocols: ["Cross-Chain", "Arbitrage Bots"],
    followers: 412,
    performance: "+31.7%",
    color: "bg-pink-500",
    isRecommended: false
  },
  {
    id: 6,
    name: "AI-Powered Dynamic",
    description: "Machine learning optimized strategy that adapts to market conditions",
    category: "AI-Powered",
    expectedAPY: "11.3%",
    riskLevel: "Medium",
    minInvestment: "$2,000",
    protocols: ["Multiple", "AI Optimization"],
    followers: 923,
    performance: "+28.9%",
    color: "bg-green-600",
    isRecommended: true
  }
]

const categories = ["All", "Conservative", "Balanced", "Aggressive", "Specialized", "Advanced", "AI-Powered"]

export default function StrategiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recommended")

  const filteredStrategies = strategies
    .filter(strategy => 
      (selectedCategory === "All" || strategy.category === selectedCategory) &&
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "recommended") {
        return b.isRecommended ? 1 : -1
      }
      if (sortBy === "apy") {
        return parseFloat(b.expectedAPY) - parseFloat(a.expectedAPY)
      }
      if (sortBy === "followers") {
        return b.followers - a.followers
      }
      return 0
    })

  const getRiskBadge = (risk: string) => {
    const riskMap = {
      "Low": "bg-green-500/20 text-green-400",
      "Low-Medium": "bg-yellow-500/20 text-yellow-400", 
      "Medium": "bg-orange-500/20 text-orange-400",
      "Medium-High": "bg-red-500/20 text-red-400",
      "High": "bg-red-600/20 text-red-300"
    }
    return riskMap[risk as keyof typeof riskMap] || "bg-gray-500/20 text-gray-400"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              DeFi <span className="primary-gradient">Strategies</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Discover proven investment strategies tailored to your risk tolerance
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="yield-card border-green-500/20 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search strategies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-green-500/20 text-white"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category 
                        ? "bg-green-500 text-black" 
                        : "border-green-500/50 text-green-400 hover:bg-green-500/10"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/5 border border-green-500/20 rounded-md px-3 py-2 text-white"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="apy">Highest APY</option>
                    <option value="followers">Most Popular</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="yield-card border-green-500/20 hover:border-green-500/40 relative">
                {strategy.isRecommended && (
                  <div className="absolute -top-2 left-4">
                    <Badge className="bg-green-500 text-black font-bold">
                      <Brain className="h-3 w-3 mr-1" />
                      AI RECOMMENDED
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white font-bold mb-2">{strategy.name}</CardTitle>
                      <Badge className="bg-blue-500/20 text-blue-400 mb-3">
                        {strategy.category}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {strategy.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-500/10 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">{strategy.expectedAPY}</p>
                        <p className="text-xs text-gray-400">Expected APY</p>
                      </div>
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                        <p className="text-2xl font-bold text-blue-400">{strategy.performance}</p>
                        <p className="text-xs text-gray-400">1Y Performance</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Risk Level</span>
                        <Badge className={getRiskBadge(strategy.riskLevel)}>
                          {strategy.riskLevel}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Min Investment</span>
                        <span className="text-white font-medium">{strategy.minInvestment}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Followers</span>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-white font-medium">{strategy.followers}</span>
                        </div>
                      </div>
                    </div>

                    {/* Protocols */}
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Protocols Used</p>
                      <div className="flex flex-wrap gap-1">
                        {strategy.protocols.map((protocol, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-500/50 text-green-400">
                            {protocol}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-4">
                      <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                        Learn More
                      </Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black font-bold">
                        Start Strategy
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Custom Strategy */}
          <div className="mt-12">
            <Card className="yield-card border-green-500/20">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                    <Plus className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Create Custom Strategy</h3>
                  <p className="text-gray-400">
                    Use our AI-powered strategy builder to create a personalized investment plan
                  </p>
                </div>
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold px-8">
                  <Target className="mr-2 h-5 w-5" />
                  Build My Strategy
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
