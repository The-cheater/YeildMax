'use client'

import { Header } from "@/components/layout/Header"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { PortfolioTracker } from "@/components/dashboard/PortfolioTracker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Wallet, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  PieChart,
  Target
} from "lucide-react"

const transactions = [
  { id: 1, type: "deposit", platform: "Aave", token: "USDC", amount: 1000, date: "2025-09-04", status: "completed" },
  { id: 2, type: "withdraw", platform: "Compound", token: "DAI", amount: 500, date: "2025-09-03", status: "completed" },
  { id: 3, type: "deposit", platform: "Yearn", token: "USDT", amount: 2000, date: "2025-09-02", status: "completed" },
  { id: 4, type: "deposit", platform: "Curve", token: "3CRV", amount: 1500, date: "2025-09-01", status: "pending" },
]

const goals = [
  { name: "Emergency Fund", target: 10000, current: 7500, color: "bg-blue-500" },
  { name: "Retirement", target: 50000, current: 23000, color: "bg-purple-500" },
  { name: "Investment Goals", target: 25000, current: 12400, color: "bg-green-500" },
]

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              My <span className="primary-gradient">Portfolio</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Track and manage your DeFi investments
            </p>
          </div>

          {/* Portfolio Overview */}
          <PortfolioTracker />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
            {/* Recent Transactions */}
            <div className="xl:col-span-2">
              <Card className="yield-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-400" />
                      <span>Recent Transactions</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-white/3 rounded-lg hover:bg-white/8 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {tx.type === 'deposit' ? 
                              <ArrowDownRight className="h-4 w-4 text-green-400" /> :
                              <ArrowUpRight className="h-4 w-4 text-red-400" />
                            }
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {tx.type === 'deposit' ? 'Deposit to' : 'Withdraw from'} {tx.platform}
                            </p>
                            <p className="text-gray-400 text-sm">{tx.date}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()} {tx.token}
                          </p>
                          <Badge className={
                            tx.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goals Progress */}
            <div>
              <Card className="yield-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-400" />
                    <span>Financial Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {goals.map((goal, index) => {
                      const progress = (goal.current / goal.target) * 100
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{goal.name}</span>
                            <span className="text-sm text-gray-400">
                              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <p className="text-xs text-gray-400">
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      )
                    })}

                    <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold mt-6">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
