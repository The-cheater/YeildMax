'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/web3/EnhancedConnectWallet"
import { useAuth } from '@/contexts/AuthContext'
import { TrendingUp, Menu, X, Settings, Bell, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Yields', href: '/yields' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Strategies', href: '/strategies' },
    { name: 'Analytics', href: '/analytics' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-green-500/20 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <TrendingUp className="h-10 w-10 text-green-400 animate-pulse-green" />
              <div className="absolute inset-0 h-10 w-10 bg-green-400/20 rounded-full blur-xl"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Yield<span className="primary-gradient">Max</span>
              </h1>
              <p className="text-xs text-green-400/80 font-medium">AI-POWERED</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-green-400 transition-colors font-medium text-lg relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400">
                  <Bell className="h-5 w-5" />
                </Button>
                <ConnectWallet />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-green-400">
                      <User className="h-5 w-5" />
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-black border-green-500/20">
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-green-500/10">
                      <Link href="/settings" className="flex items-center w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-green-500/20" />
                    <DropdownMenuItem 
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-green-400">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-green-500 hover:bg-green-600 text-black font-bold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-green-500/20">
            {isAuthenticated ? (
              <>
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-green-400 transition-colors font-medium text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 space-y-4">
                  <ConnectWallet />
                  <Button 
                    variant="outline" 
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-4">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full border-green-500/50 text-green-400">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
