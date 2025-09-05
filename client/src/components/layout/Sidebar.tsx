'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Wallet, 
  Settings, 
  HelpCircle, 
  TrendingUp,
  Shield,
  Brain,
  Target,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/', badge: null },
  { icon: TrendingUp, label: 'Yields', href: '/yields', badge: 'Hot' },
  { icon: Wallet, label: 'Portfolio', href: '/portfolio', badge: null },
  { icon: Brain, label: 'AI Insights', href: '/insights', badge: 'New' },
  { icon: Shield, label: 'Risk Analysis', href: '/risk', badge: null },
  { icon: Target, label: 'Strategies', href: '/strategies', badge: null },
  { icon: Settings, label: 'Settings', href: '/settings', badge: null },
  { icon: HelpCircle, label: 'Help', href: '/help', badge: null },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-black/50 border-r border-green-500/20 h-screen sticky top-0`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold text-white">YieldMax</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-green-500/10 transition-colors group"
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
