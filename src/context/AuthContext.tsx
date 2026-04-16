import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { User, AuthContextType } from '../types/index'
import { api } from '../services/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { token, user: userData } = await api.login(email, password)
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, name: string, password: string) => {
    setIsLoading(true)
    try {
      const { token, user: userData } = await api.signup(email, name, password)
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    api.logout()
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
