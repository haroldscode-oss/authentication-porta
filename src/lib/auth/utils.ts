import * as bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const rounds = parseInt(import.meta.env.VITE_BCRYPT_ROUNDS || '12')
  return bcrypt.hash(password, rounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  return uuidv4() + '-' + Date.now() + '-' + Math.random().toString(36).substring(2)
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
  return 'sess_' + generateToken()
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}

/**
 * Normalize email (trim and lowercase)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Validate password strength
 * Requirements: min 8 chars, at least 1 letter and 1 number
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Calculate expiry date
 */
export function calculateExpiry(duration: string): Date {
  const now = new Date()
  
  if (duration.endsWith('m')) {
    const minutes = parseInt(duration.slice(0, -1))
    return new Date(now.getTime() + minutes * 60 * 1000)
  }
  
  if (duration.endsWith('h')) {
    const hours = parseInt(duration.slice(0, -1))
    return new Date(now.getTime() + hours * 60 * 60 * 1000)
  }
  
  if (duration.endsWith('d')) {
    const days = parseInt(duration.slice(0, -1))
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  }
  
  // Default to 7 days
  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expires: Date): boolean {
  return new Date() > expires
}

/**
 * Generate OAuth state parameter
 */
export function generateOAuthState(): string {
  return 'state_' + generateToken()
}

/**
 * Get OAuth redirect URLs
 */
export function getOAuthUrls() {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin
  
  return {
    google: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      redirectUri: `${baseUrl}/auth/callback/google`,
      scope: 'openid email profile'
    },
    discord: {
      authUrl: 'https://discord.com/api/oauth2/authorize',
      tokenUrl: 'https://discord.com/api/oauth2/token',
      redirectUri: `${baseUrl}/auth/callback/discord`,
      scope: 'identify email'
    }
  }
}