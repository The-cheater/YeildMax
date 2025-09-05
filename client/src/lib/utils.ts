import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${value.toFixed(decimals)}%`
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K'
  }
  return num.toString()
}

export function calculateAPY(principal: number, rate: number, days: number): number {
  return principal * Math.pow(1 + rate / 365, days) - principal
}

export function getRiskLevel(score: number): {
  level: string
  color: string
  description: string
} {
  if (score >= 0.8) {
    return {
      level: 'Low Risk',
      color: 'text-green-400',
      description: 'High security, established protocols'
    }
  }
  if (score >= 0.6) {
    return {
      level: 'Medium Risk',
      color: 'text-yellow-400',
      description: 'Moderate risk, good track record'
    }
  }
  return {
    level: 'High Risk',
    color: 'text-red-400',
    description: 'Higher risk, newer or volatile protocols'
  }
}

// Fixed debounce function - removed 'this' usage
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined

  return function(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function generateGradient(colors: string[]): string {
  return `linear-gradient(135deg, ${colors.join(', ')})`
}

export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (address.length <= startChars + endChars) {
    return address
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

// Additional utility functions
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function parseUnits(value: string, decimals: number = 18): bigint {
  const [integer, fraction = ''] = value.split('.')
  const fractionLength = fraction.length
  
  if (fractionLength > decimals) {
    throw new Error(`Too many decimal places: ${fractionLength} > ${decimals}`)
  }
  
  const paddedFraction = fraction.padEnd(decimals, '0')
  return BigInt(integer + paddedFraction)
}

export function formatUnits(value: bigint, decimals: number = 18): string {
  const divisor = BigInt(10) ** BigInt(decimals)
  const quotient = value / divisor
  const remainder = value % divisor
  
  const remainderString = remainder.toString().padStart(decimals, '0')
  const trimmedRemainder = remainderString.replace(/0+$/, '') || '0'
  
  return trimmedRemainder === '0' ? quotient.toString() : `${quotient}.${trimmedRemainder}`
}
