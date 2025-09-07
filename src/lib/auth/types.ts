export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  userId: string
  type: 'oauth' | 'credentials'
  provider: string
  providerAccountId: string
  access_token?: string
  refresh_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: Date
  createdAt: Date
}

export interface VerificationToken {
  identifier: string
  token: string
  expires: Date
  type: 'email_verification' | 'password_reset'
  createdAt: Date
}

export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  agreedToTerms: boolean
  name?: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  session?: Session
  error?: string
  action?: 'redirect_to_password' | 'redirect_to_register' | 'success'
  redirectUrl?: string
}

export interface EmailCheckResponse {
  exists: boolean
  email: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
  confirmPassword: string
}

export type AuthError = 
  | 'invalid_credentials'
  | 'user_not_found'
  | 'email_already_exists'
  | 'weak_password'
  | 'invalid_token'
  | 'token_expired'
  | 'rate_limited'
  | 'network_error'
  | 'unknown_error'