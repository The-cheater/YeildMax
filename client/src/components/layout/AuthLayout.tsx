import { ReactNode } from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex items-center justify-center space-x-3">
            <TrendingUp className="h-12 w-12 text-green-400 animate-pulse-green" />
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Yield<span className="primary-gradient">Max</span>
              </h1>
              <p className="text-xs text-green-400/80 font-medium">AI-POWERED</p>
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
