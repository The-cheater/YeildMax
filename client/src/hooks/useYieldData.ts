'use client'

import { useState, useEffect } from 'react'
import { YieldData, PortfolioPosition } from '@/lib/types'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'

export function useYieldData() {
  const [yieldData, setYieldData] = useState<YieldData[]>([])
  const [portfolioData, setPortfolioData] = useState<PortfolioPosition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchYieldData = async () => {
      try {
        setIsLoading(true)
        const { data } = await axios.get(`${API_BASE}/yields`)
        const apiYields = (data.data || []) as any[]

        const normalizedYields: YieldData[] = apiYields.map((y: any) => ({
          platform: y.platform,
          token: y.token,
          apy: y.apy,
          tvl: y.tvl,
          riskScore: y.riskScore,
          logo: y.logo || '🌾',
          change24h: typeof y.change24h === 'number' ? y.change24h : 0,
          category: y.category || 'lending'
        }))

        setYieldData(normalizedYields)
        setPortfolioData([])
        setError(null)
      } catch (err) {
        setError('Failed to fetch yield data')
        console.error('Error fetching yield data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchYieldData()
  }, [])

  const refreshData = () => {
    // Refresh data logic
    setIsLoading(true)
    // Re-fetch data...
  }

  return {
    yieldData,
    portfolioData,
    isLoading,
    error,
    refreshData
  }
}
