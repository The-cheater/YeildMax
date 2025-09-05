import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { Web3Provider } from '@/components/providers/Web3Provider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'YieldMax - AI-Powered DeFi Yield Optimizer',
  description: 'Maximize your DeFi yields with AI-powered recommendations across 50+ protocols',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen gradient-bg relative">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Web3Provider>
            {children}
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  )
}