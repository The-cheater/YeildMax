'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('yieldmax_token')
    const userData = localStorage.getItem('yieldmax_user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password })
      const { token, user: apiUser } = data.data

      const normalizedUser = {
        id: apiUser._id || apiUser.id,
        email: apiUser.email,
        name: apiUser.name || apiUser.email.split('@')[0],
        avatar: apiUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${apiUser.email}`
      }

      setUser(normalizedUser)
      localStorage.setItem('yieldmax_token', token)
      localStorage.setItem('yieldmax_user', JSON.stringify(normalizedUser))
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, { email, password, name })
      const { token, user: apiUser } = data.data

      const normalizedUser = {
        id: apiUser._id || apiUser.id,
        email: apiUser.email,
        name: apiUser.name || name,
        avatar: apiUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${apiUser.email}`
      }

      setUser(normalizedUser)
      localStorage.setItem('yieldmax_token', token)
      localStorage.setItem('yieldmax_user', JSON.stringify(normalizedUser))
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('yieldmax_token')
    localStorage.removeItem('yieldmax_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
