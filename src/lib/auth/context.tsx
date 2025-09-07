import React, { createContext, useContext, useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { AuthState, User, Session, AuthResponse } from './types'
import { AuthService } from './service'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, password: string, confirmPassword: string, agreedToTerms: boolean, name?: string, phone?: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  checkEmail: (email: string) => Promise<{ exists: boolean; email: string }>
  requestPasswordReset: (email: string) => Promise<AuthResponse>
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<AuthResponse>
  getOAuthUrl: (provider: 'google' | 'discord') => string
  handleOAuthCallback: (params: { code: string; state: string; provider: 'google' | 'discord' }) => Promise<AuthResponse>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentSessionToken] = useKV<string>('auth:session_token', '')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  
  const authService = AuthService.getInstance()
  
  // Load session on mount
  useEffect(() => {
    loadSession()
  }, [currentSessionToken])
  
  const loadSession = async () => {
    setIsLoading(true)
    try {
      if (!currentSessionToken) {
        setUser(null)
        setSession(null)
        return
      }
      
      const sessionData = await authService.getSession(currentSessionToken)
      if (!sessionData) {
        setUser(null)
        setSession(null)
        // Clear invalid session token
        await spark.kv.delete('auth:session_token')
        return
      }
      
      const userData = await authService.getUserById(sessionData.userId)
      if (!userData) {
        setUser(null)
        setSession(null)
        await authService.deleteSession(currentSessionToken)
        await spark.kv.delete('auth:session_token')
        return
      }
      
      setUser(userData)
      setSession(sessionData)
    } catch (error) {
      console.error('Failed to load session:', error)
      setUser(null)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  const refreshSession = async () => {
    await loadSession()
  }
  
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.loginWithPassword({ email, password })
      
      if (response.success && response.user && response.session) {
        setUser(response.user)
        setSession(response.session)
        await spark.kv.set('auth:session_token', response.session.sessionToken)
      }
      
      return response
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const register = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    agreedToTerms: boolean,
    name?: string,
    phone?: string
  ): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.registerWithPassword({
        email,
        password,
        confirmPassword,
        agreedToTerms,
        name,
        phone
      })
      
      if (response.success && response.user && response.session) {
        setUser(response.user)
        setSession(response.session)
        await spark.kv.set('auth:session_token', response.session.sessionToken)
      }
      
      return response
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      if (session) {
        await authService.deleteSession(session.sessionToken)
      }
      await spark.kv.delete('auth:session_token')
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const checkEmail = async (email: string) => {
    return authService.checkEmailExists(email)
  }
  
  const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
    return authService.requestPasswordReset({ email })
  }
  
  const resetPassword = async (
    token: string, 
    password: string, 
    confirmPassword: string
  ): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.resetPassword({
        token,
        password,
        confirmPassword
      })
      
      if (response.success && response.user && response.session) {
        setUser(response.user)
        setSession(response.session)
        await spark.kv.set('auth:session_token', response.session.sessionToken)
      }
      
      return response
    } catch (error) {
      console.error('Password reset error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const getOAuthUrl = (provider: 'google' | 'discord'): string => {
    return authService.getOAuthLoginUrl(provider)
  }

  const handleOAuthCallback = async (params: { 
    code: string; 
    state: string; 
    provider: 'google' | 'discord' 
  }): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.handleOAuthCallback(params)
      
      if (response.success && response.user && response.session) {
        setUser(response.user)
        setSession(response.session)
        await spark.kv.set('auth:session_token', response.session.sessionToken)
      }
      
      return response
    } catch (error) {
      console.error('OAuth callback error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred during authentication.'
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    login,
    register,
    logout,
    checkEmail,
    requestPasswordReset,
    resetPassword,
    getOAuthUrl,
    handleOAuthCallback,
    refreshSession
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}