'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/wagmi'
import { ReactNode, useState } from 'react'

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 30000,
      },
    },
  }))

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          options={{
            hideBalance: false,
            hideTooltips: false,
            hideQuestionMarkCTA: false,
            hideNoWalletCTA: false,
            walletConnectName: "WalletConnect",
            enforceSupportedChains: true,
            initialChainId: 0,
          }}
          customTheme={{
            '--ck-font-family': 'Inter, sans-serif',
            '--ck-border-radius': '12px',
            '--ck-primary-button-color': '#00ff00',
            '--ck-primary-button-background': '#000000',
            '--ck-primary-button-hover-background': '#001a00',
            '--ck-body-background': '#000000',
            '--ck-body-color': '#ffffff',
            '--ck-modal-background': '#111111',
            '--ck-secondary-button-background': '#222222',
            '--ck-secondary-button-hover-background': '#333333',
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
