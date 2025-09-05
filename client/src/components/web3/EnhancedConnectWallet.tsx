'use client'

import { useAccount, useBalance, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  LogOut, 
  Settings, 
  ChevronDown,
  Zap,
  Shield
} from 'lucide-react'
import { formatEther } from 'viem'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

export function EnhancedConnectWallet() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address })
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getChainColor = (chainName?: string) => {
    const colors: { [key: string]: string } = {
      'Ethereum': 'bg-blue-500',
      'Polygon': 'bg-purple-500',
      'Arbitrum': 'bg-cyan-500',
      'Optimism': 'bg-red-500',
      'Base': 'bg-blue-600'
    }
    return colors[chainName || ''] || 'bg-gray-500'
  }

  if (!mounted) return null

  return (
    <ConnectKitButton.Custom>
      {({ isConnected: ckIsConnected, show, truncatedAddress, ensName: ckEnsName }) => {
        if (isConnected && address && ckIsConnected) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-black/50 backdrop-blur-sm border-green-500/30 hover:border-green-500/50 text-white hover:bg-green-500/10 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-green-400" />
                      {ensAvatar && (
                        <img src={ensAvatar} alt="ENS Avatar" className="w-5 h-5 rounded-full" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">
                        {ensName || formatAddress(address)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '0.000 ETH'}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-80 bg-black/90 backdrop-blur-xl border-green-500/20 p-0"
              >
                {/* Account Info Header */}
                <div className="p-4 border-b border-green-500/20">
                  <div className="flex items-center space-x-3">
                    {ensAvatar ? (
                      <img src={ensAvatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-green-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {ensName || formatAddress(address)}
                      </div>
                      <div className="text-gray-400 text-sm font-mono">
                        {formatAddress(address)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Chain & Balance */}
                  <div className="mt-3 flex items-center justify-between">
                    <Badge className={`${getChainColor(chain?.name)} text-white px-2 py-1`}>
                      <div className="w-2 h-2 bg-white rounded-full mr-2" />
                      {chain?.name || 'Unknown'}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.000'} {balance?.symbol || 'ETH'}
                      </div>
                      <div className="text-xs text-gray-400">
                        ≈ ${balance ? (parseFloat(formatEther(balance.value)) * 2500).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-2">
                  <DropdownMenuItem 
                    className="text-gray-300 hover:text-white hover:bg-green-500/10 cursor-pointer"
                    onClick={copyAddress}
                  >
                    <Copy className="h-4 w-4 mr-3" />
                    Copy Address
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-green-500/10 cursor-pointer">
                    <ExternalLink className="h-4 w-4 mr-3" />
                    View on Explorer
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-green-500/10 cursor-pointer">
                    <Zap className="h-4 w-4 mr-3" />
                    Transaction History
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-green-500/10 cursor-pointer">
                    <Settings className="h-4 w-4 mr-3" />
                    Wallet Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-green-500/20 my-1" />
                  
                  <DropdownMenuItem 
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    onClick={() => disconnect()}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Disconnect Wallet
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }

        return (
          <Button 
            onClick={show}
            className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-3 text-lg green-glow transition-all duration-200 transform hover:scale-105"
          >
            <Wallet className="h-5 w-5 mr-2" />
            Connect Wallet
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
