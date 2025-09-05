import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { createPublicClient } from 'viem'

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo_project_id'

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism, base],
  connectors: [
    injected({ target: 'metaMask' }),
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'YieldMax',
        description: 'AI-Powered DeFi Yield Optimizer',
        url: 'https://yieldmax.app',
        icons: ['https://yieldmax.app/icon.png']
      }
    }),
    coinbaseWallet({
      appName: 'YieldMax',
      appLogoUrl: 'https://yieldmax.app/icon.png'
    })
  ],
  transports: {
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`),
    [polygon.id]: http(`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`),
    [arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`),
    [optimism.id]: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`),
    [base.id]: http()
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
