'use client'

import { Header } from "@/components/layout/Header"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Search, Filter, ArrowUpDown, Star } from "lucide-react"
import { useState } from "react"

const allYields = [
  { platform: "Aave V3", token: "USDC", apy: 4.2, tvl: "$1.2B", riskScore: 0.9, logo: "🏦", category: "Lending", change24h: 0.15 },
  { platform: "Compound V3", token: "DAI", apy: 3.8, tvl: "$890M", riskScore: 0.85, logo: "🏛️", category: "Lending", change24h: -0.08 },
  { platform: "Yearn Finance", token: "USDT", apy: 5.1, tvl: "$650M", riskScore: 0.75, logo: "🌾", category: "Yield Farming", change24h: 0.34 },
  { platform: "Curve Finance", token: "3CRV", apy: 6.3, tvl: "$2.1B", riskScore: 0.8, logo: "〰️", category: "DEX", change24h: 0.22 },
  { platform: "Uniswap V3", token: "ETH/USDC", apy: 8.7, tvl: "$1.8B", riskScore: 0.65, logo: "🦄", category: "DEX", change24h: 1.2 },
  { platform: "Lido", token: "stETH", apy: 3.9, tvl: "$15.2B", riskScore: 0.88, logo: "🌊", category: "Liquid Staking", change24h: 0.05 },
  { platform: "Rocket Pool", token: "rETH", apy: 4.1, tvl: "$2.8B", riskScore: 0.82, logo: "🚀", category: "Liquid Staking", change24h: 0.12 },
  { platform: "Balancer", token: "BAL/WETH", apy: 12.4, tvl: "$450M", riskScore: 0.55, logo: "⚖️", category: "DEX", change24h: -0.45 },
]

export default function YieldsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("apy")

  const categories = ["All", "Lending", "DEX", "Yield Farming", "Liquid Staking"]

  const filteredYields = allYields
    .filter(yield_ => 
      (selectedCategory === "All" || yield_.category === selectedCategory) &&
      (yield_.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
       yield_.token.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "apy": return b.apy - a.apy
        case "tvl": return parseFloat(b.tvl.replace(/[$B-M]/g, "")) - parseFloat(a.tvl.replace(/[$B-M]/g, ""))
        case "risk": return b.riskScore - a.riskScore
        default: return 0
      }
    })

  const getRiskBadge = (score: number) => {
    if (score >= 0.8) return <Badge className="bg-green-500/20 text-green-400">Low Risk</Badge>
    if (score >= 0.6) return <Badge className="bg-yellow-500/20 text-yellow-400">Medium Risk</Badge>
    return <Badge className="bg-red-500/20 text-red-400">High Risk</Badge>
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              DeFi <span className="primary-gradient">Yields</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Discover the best yield opportunities across all DeFi protocols
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="yield-card border-green-500/20 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search yields by platform or token..."
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
                    <option value="apy">Sort by APY</option>
                    <option value="tvl">Sort by TVL</option>
                    <option value="risk">Sort by Risk</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredYields.map((yield_, index) => (
              <Card key={index} className="yield-card border-green-500/20 hover:border-green-500/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{yield_.logo}</span>
                      <div>
                        <CardTitle className="text-white font-bold">{yield_.platform}</CardTitle>
                        <p className="text-gray-400 text-sm">{yield_.token}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {yield_.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* APY */}
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-3xl font-bold text-green-400 mb-1">{yield_.apy}%</p>
                      <p className="text-sm text-gray-400">Current APY</p>
                      <p className={`text-xs mt-1 ${yield_.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {yield_.change24h >= 0 ? '+' : ''}{yield_.change24h}% 24h
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">TVL</p>
                        <p className="text-white font-bold">{yield_.tvl}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                        {getRiskBadge(yield_.riskScore)}
                      </div>
                    </div>

                    {/* Risk Score Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Safety Score</span>
                        <span className="text-white text-sm font-medium">{Math.round(yield_.riskScore * 100)}/100</span>
                      </div>
                      <Progress value={yield_.riskScore * 100} className="h-2" />
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold">
                      <Star className="mr-2 h-4 w-4" />
                      Add to Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredYields.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No yields found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
