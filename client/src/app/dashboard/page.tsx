'use client'

import { Header } from "@/components/layout/Header"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { YieldComparison } from "@/components/dashboard/YieldComparison"
import { PortfolioTracker } from "@/components/dashboard/PortfolioTracker"
import { RiskAssessment } from "@/components/dashboard/RiskAssessment"
import { RecommendationPanel } from "@/components/dashboard/RecommendationPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Brain,
  Bell,
  Star,
  ArrowRight,
  Activity
} from "lucide-react"

const quickStats = [
  { label: "Portfolio Value", value: "$12,400", change: "+2.4%", icon: Wallet, color: "text-green-400" },
  { label: "Monthly Yield", value: "$287.50", change: "+12.3%", icon: DollarSign, color: "text-blue-400" },
  { label: "Active Positions", value: "4", change: "+1", icon: Activity, color: "text-purple-400" },
  { label: "Risk Score", value: "76/100", change: "Stable", icon: Shield, color: "text-yellow-400" },
]

const recentActivities = [
  { type: "deposit", platform: "Aave", amount: "$1,000", token: "USDC", time: "2 hours ago", status: "completed" },
  { type: "reward", platform: "Yearn", amount: "$12.50", token: "YFI", time: "1 day ago", status: "completed" },
  { type: "withdraw", platform: "Compound", amount: "$500", token: "DAI", time: "2 days ago", status: "completed" },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, <span className="primary-gradient">{user?.name}</span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Here's what's happening with your DeFi portfolio today
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
                  <Star className="h-4 w-4 mr-1" />
                  Portfolio Health: Excellent
                </Badge>
                <Button variant="outline" size="icon" className="border-green-500/50 text-green-400">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="yield-card border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium mb-2">{stat.label}</p>
                    <p className={`metric-value ${stat.color}`}>{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Portfolio Overview */}
            <div className="xl:col-span-2">
              <PortfolioTracker />
            </div>

            {/* Recent Activity */}
            <div>
              <Card className="yield-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-400" />
                      <span>Recent Activity</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-white/3 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'deposit' ? 'bg-green-500/20' : 
                          activity.type === 'reward' ? 'bg-blue-500/20' : 'bg-red-500/20'
                        }`}>
                          {activity.type === 'deposit' && <TrendingUp className="h-4 w-4 text-green-400" />}
                          {activity.type === 'reward' && <Star className="h-4 w-4 text-blue-400" />}
                          {activity.type === 'withdraw' && <ArrowRight className="h-4 w-4 text-red-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • {activity.platform}
                          </p>
                          <p className="text-gray-400 text-xs">{activity.time}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${
                            activity.type === 'withdraw' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {activity.type === 'withdraw' ? '-' : '+'}{activity.amount}
                          </p>
                          <p className="text-xs text-gray-400">{activity.token}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Risk Assessment & AI Recommendations */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div>
              <RiskAssessment />
            </div>
            <div className="xl:col-span-2">
              <RecommendationPanel />
            </div>
          </div>

          {/* Top Yields */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                Top <span className="primary-gradient">Opportunities</span>
              </h2>
              <Button className="bg-green-500 hover:bg-green-600 text-black font-bold">
                View All Yields
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <YieldComparison />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
