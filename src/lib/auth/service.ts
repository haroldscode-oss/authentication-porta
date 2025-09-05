import { 
  User, 
  Account, 
  Session, 
  VerificationToken, 
  AuthResponse, 
  EmailCheckResponse, 
  LoginCredentials, 
  RegisterCredentials,
  PasswordResetRequest,
  PasswordResetConfirm,
  AuthError
} from './types'
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  generateSessionToken,
  validateEmail,
  normalizeEmail,
  validatePassword,
  calculateExpiry,
  isTokenExpired,
  generateOAuthState,
  getOAuthUrls
} from './utils'

/**
 * Authentication service using Spark KV storage
 * In production, this would be replaced with a proper database
 */
export class AuthService {
  private static instance: AuthService
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // User management
  async createUser(data: { email: string; name?: string; image?: string }): Promise<User> {
    const userId = crypto.randomUUID()
    const now = new Date()
    
    const user: User = {
      id: userId,
      email: normalizeEmail(data.email),
      name: data.name,
      image: data.image,
      createdAt: now,
      updatedAt: now
    }
    
    await spark.kv.set(`user:${userId}`, user)
    await spark.kv.set(`user:email:${user.email}`, userId)
    
    return user
  }

  async getUserById(id: string): Promise<User | null> {
    return await spark.kv.get<User>(`user:${id}`) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = normalizeEmail(email)
    const userId = await spark.kv.get<string>(`user:email:${normalizedEmail}`)
    if (!userId) return null
    return this.getUserById(userId)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.getUserById(id)
    if (!user) return null
    
    const updatedUser = { ...user, ...data, updatedAt: new Date() }
    await spark.kv.set(`user:${id}`, updatedUser)
    
    return updatedUser
  }

  // Password management
  async setUserPassword(userId: string, password: string): Promise<void> {
    const hashedPassword = await hashPassword(password)
    await spark.kv.set(`password:${userId}`, { hash: hashedPassword, createdAt: new Date() })
  }

  async verifyUserPassword(userId: string, password: string): Promise<boolean> {
    const passwordData = await spark.kv.get<{ hash: string }>(`password:${userId}`)
    if (!passwordData) return false
    
    return verifyPassword(password, passwordData.hash)
  }

  // Session management
  async createSession(userId: string): Promise<Session> {
    const sessionToken = generateSessionToken()
    const expires = calculateExpiry(import.meta.env.VITE_SESSION_EXPIRY || '7d')
    
    const session: Session = {
      id: crypto.randomUUID(),
      sessionToken,
      userId,
      expires,
      createdAt: new Date()
    }
    
    await spark.kv.set(`session:${sessionToken}`, session)
    await spark.kv.set(`user:session:${userId}`, sessionToken)
    
    return session
  }

  async getSession(sessionToken: string): Promise<Session | null> {
    const session = await spark.kv.get<Session>(`session:${sessionToken}`)
    if (!session || isTokenExpired(session.expires)) {
      if (session) {
        await this.deleteSession(sessionToken)
      }
      return null
    }
    return session
  }

  async deleteSession(sessionToken: string): Promise<void> {
    const session = await spark.kv.get<Session>(`session:${sessionToken}`)
    if (session) {
      await spark.kv.delete(`session:${sessionToken}`)
      await spark.kv.delete(`user:session:${session.userId}`)
    }
  }

  // Account management (OAuth)
  async createAccount(data: {
    userId: string
    type: 'oauth' | 'credentials'
    provider: string
    providerAccountId: string
    access_token?: string
    refresh_token?: string
    expires_at?: number
  }): Promise<Account> {
    const account: Account = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await spark.kv.set(`account:${account.id}`, account)
    await spark.kv.set(`account:provider:${data.provider}:${data.providerAccountId}`, account.id)
    
    return account
  }

  async getAccountByProvider(provider: string, providerAccountId: string): Promise<Account | null> {
    const accountId = await spark.kv.get<string>(`account:provider:${provider}:${providerAccountId}`)
    if (!accountId) return null
    
    return await spark.kv.get<Account>(`account:${accountId}`) || null
  }

  // Verification tokens
  async createVerificationToken(data: {
    identifier: string
    type: 'email_verification' | 'password_reset'
    expiresIn?: string
  }): Promise<VerificationToken> {
    const token = generateToken()
    const expires = calculateExpiry(data.expiresIn || '30m')
    
    const verificationToken: VerificationToken = {
      identifier: data.identifier,
      token,
      expires,
      type: data.type,
      createdAt: new Date()
    }
    
    await spark.kv.set(`verification:${token}`, verificationToken)
    
    return verificationToken
  }

  async verifyToken(token: string): Promise<VerificationToken | null> {
    const verificationToken = await spark.kv.get<VerificationToken>(`verification:${token}`)
    if (!verificationToken || isTokenExpired(verificationToken.expires)) {
      if (verificationToken) {
        await spark.kv.delete(`verification:${token}`)
      }
      return null
    }
    return verificationToken
  }

  async consumeVerificationToken(token: string): Promise<VerificationToken | null> {
    const verificationToken = await this.verifyToken(token)
    if (verificationToken) {
      await spark.kv.delete(`verification:${token}`)
    }
    return verificationToken
  }

  // Rate limiting
  async checkRateLimit(identifier: string): Promise<{ allowed: boolean; remainingAttempts: number }> {
    const key = `rate_limit:${identifier}`
    const maxAttempts = parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_ATTEMPTS || '5')
    const windowMs = 15 * 60 * 1000 // 15 minutes
    
    const data = await spark.kv.get<{ attempts: number; resetTime: number }>(key)
    const now = Date.now()
    
    if (!data || now > data.resetTime) {
      await spark.kv.set(key, { attempts: 1, resetTime: now + windowMs })
      return { allowed: true, remainingAttempts: maxAttempts - 1 }
    }
    
    if (data.attempts >= maxAttempts) {
      return { allowed: false, remainingAttempts: 0 }
    }
    
    const newAttempts = data.attempts + 1
    await spark.kv.set(key, { ...data, attempts: newAttempts })
    
    return { 
      allowed: true, 
      remainingAttempts: Math.max(0, maxAttempts - newAttempts) 
    }
  }

  // Auth methods
  async checkEmailExists(email: string): Promise<EmailCheckResponse> {
    const normalizedEmail = normalizeEmail(email)
    if (!validateEmail(normalizedEmail)) {
      throw new Error('Invalid email format')
    }
    
    const user = await this.getUserByEmail(normalizedEmail)
    return {
      exists: !!user,
      email: normalizedEmail
    }
  }

  async loginWithPassword(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials
    const normalizedEmail = normalizeEmail(email)
    
    // Rate limiting
    const rateLimit = await this.checkRateLimit(`login:${normalizedEmail}`)
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Too many attempts. Please try again later.'
      }
    }
    
    // Find user
    const user = await this.getUserByEmail(normalizedEmail)
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }
    
    // Verify password
    const isValidPassword = await this.verifyUserPassword(user.id, password)
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }
    
    // Create session
    const session = await this.createSession(user.id)
    
    return {
      success: true,
      user,
      session,
      action: 'success'
    }
  }

  async registerWithPassword(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { email, password, confirmPassword, agreedToTerms } = credentials
    const normalizedEmail = normalizeEmail(email)
    
    // Validation
    if (!validateEmail(normalizedEmail)) {
      return { success: false, error: 'Invalid email format' }
    }
    
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' }
    }
    
    if (!agreedToTerms) {
      return { success: false, error: 'You must agree to the Terms of Service and Privacy Policy' }
    }
    
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join(', ') }
    }
    
    // Check if user exists
    const existingUser = await this.getUserByEmail(normalizedEmail)
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' }
    }
    
    // Create user
    const user = await this.createUser({ email: normalizedEmail })
    await this.setUserPassword(user.id, password)
    
    // Create session
    const session = await this.createSession(user.id)
    
    return {
      success: true,
      user,
      session,
      action: 'success'
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<AuthResponse> {
    const normalizedEmail = normalizeEmail(data.email)
    
    // Always return success to prevent email enumeration
    const user = await this.getUserByEmail(normalizedEmail)
    if (user) {
      await this.createVerificationToken({
        identifier: user.email,
        type: 'password_reset',
        expiresIn: '30m'
      })
      // In a real app, send email here
    }
    
    return {
      success: true,
      error: 'If an account with that email exists, we\'ve sent password reset instructions.'
    }
  }

  async resetPassword(data: PasswordResetConfirm): Promise<AuthResponse> {
    const { token, password, confirmPassword } = data
    
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' }
    }
    
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join(', ') }
    }
    
    const verificationToken = await this.consumeVerificationToken(token)
    if (!verificationToken || verificationToken.type !== 'password_reset') {
      return { success: false, error: 'Invalid or expired reset token' }
    }
    
    const user = await this.getUserByEmail(verificationToken.identifier)
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    await this.setUserPassword(user.id, password)
    const session = await this.createSession(user.id)
    
    return {
      success: true,
      user,
      session,
      action: 'success'
    }
  }

  // OAuth methods
  getOAuthLoginUrl(provider: 'google' | 'discord'): string {
    const urls = getOAuthUrls()
    const state = generateOAuthState()
    const clientId = import.meta.env[`VITE_${provider.toUpperCase()}_CLIENT_ID`]
    
    if (!clientId) {
      throw new Error(`${provider} client ID not configured`)
    }
    
    // Store state for verification (expires in 10 minutes)
    spark.kv.set(`oauth:state:${state}`, { 
      provider, 
      createdAt: Date.now(),
      expires: Date.now() + (10 * 60 * 1000)
    })
    
    if (provider === 'google') {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: urls.google.redirectUri,
        response_type: 'code',
        scope: urls.google.scope,
        state,
        access_type: 'offline',
        prompt: 'consent'
      })
      
      return `${urls.google.authUrl}?${params.toString()}`
    }
    
    if (provider === 'discord') {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: urls.discord.redirectUri,
        response_type: 'code',
        scope: urls.discord.scope,
        state
      })
      
      return `${urls.discord.authUrl}?${params.toString()}`
    }
    
    throw new Error(`Unsupported provider: ${provider}`)
  }

  async handleOAuthCallback(params: {
    code: string
    state: string
    provider: 'google' | 'discord'
  }): Promise<AuthResponse> {
    const { code, state, provider } = params

    // Verify state
    const stateData = await spark.kv.get<{ provider: string; createdAt: number; expires: number }>(`oauth:state:${state}`)
    if (!stateData || stateData.provider !== provider || Date.now() > stateData.expires) {
      return { success: false, error: 'Invalid or expired OAuth state' }
    }

    // Clean up state
    await spark.kv.delete(`oauth:state:${state}`)

    // Check if mock mode is enabled for development
    const mockOAuth = import.meta.env.VITE_MOCK_OAUTH === 'true'
    
    if (mockOAuth) {
      // Mock OAuth flow for development
      const mockProfile = {
        id: `mock_${provider}_${Date.now()}`,
        email: `demo@${provider}.com`,
        name: `Demo User (${provider})`,
        picture: undefined
      }

      // Find or create user
      let user = await this.getUserByEmail(mockProfile.email)
      let isNewUser = false

      if (!user) {
        user = await this.createUser({
          email: mockProfile.email,
          name: mockProfile.name,
          image: mockProfile.picture
        })
        isNewUser = true
      }

      // Create mock OAuth account
      await this.createAccount({
        userId: user.id,
        type: 'oauth',
        provider,
        providerAccountId: mockProfile.id,
        access_token: 'mock_token',
        refresh_token: undefined,
        expires_at: undefined
      })

      // Create session
      const session = await this.createSession(user.id)

      return {
        success: true,
        user,
        session,
        action: isNewUser ? 'registered' : 'login'
      }
    }

    try {
      // Real OAuth flow
      // Exchange code for tokens
      const tokenData = await this.exchangeOAuthCode(provider, code)
      
      // Get user profile
      const profile = await this.getOAuthProfile(provider, tokenData.access_token)
      
      // Find or create user
      let user = await this.getUserByEmail(profile.email)
      let isNewUser = false

      if (!user) {
        // Create new user
        user = await this.createUser({
          email: profile.email,
          name: profile.name,
          image: profile.picture
        })
        isNewUser = true
      } else {
        // Update existing user with latest profile info
        user = await this.updateUser(user.id, {
          name: profile.name || user.name,
          image: profile.picture || user.image
        })
      }

      // Create or update OAuth account
      const existingAccount = await this.getAccountByProvider(provider, profile.id)
      if (!existingAccount) {
        await this.createAccount({
          userId: user.id,
          type: 'oauth',
          provider,
          providerAccountId: profile.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : undefined
        })
      }

      // Create session
      const session = await this.createSession(user.id)

      return {
        success: true,
        user,
        session,
        action: isNewUser ? 'registered' : 'login'
      }
    } catch (error) {
      console.error('OAuth callback error:', error)
      
      // If it's a CORS error, suggest enabling mock mode
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'OAuth service unavailable. Enable VITE_MOCK_OAUTH=true in .env for development.'
        }
      }
      
      return { success: false, error: 'Authentication failed. Please try again.' }
    }
  }

  private async exchangeOAuthCode(provider: 'google' | 'discord', code: string): Promise<{
    access_token: string
    refresh_token?: string
    expires_in?: number
  }> {
    const urls = getOAuthUrls()
    const clientId = import.meta.env[`VITE_${provider.toUpperCase()}_CLIENT_ID`]
    const clientSecret = import.meta.env[`${provider.toUpperCase()}_CLIENT_SECRET`]
    
    if (!clientSecret) {
      throw new Error(`${provider} client secret not configured`)
    }

    const tokenUrl = provider === 'google' ? urls.google.tokenUrl : urls.discord.tokenUrl
    const redirectUri = provider === 'google' ? urls.google.redirectUri : urls.discord.redirectUri

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Token exchange error:', errorData)
        throw new Error(`Token exchange failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(`OAuth error: ${data.error_description || data.error}`)
      }

      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('OAuth service temporarily unavailable. Please try again later.')
      }
      throw error
    }
  }

  private async getOAuthProfile(provider: 'google' | 'discord', accessToken: string): Promise<{
    id: string
    email: string
    name?: string
    picture?: string
  }> {
    try {
      if (provider === 'google') {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch Google profile: ${response.statusText}`)
        }

        const data = await response.json()
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          picture: data.picture
        }
      }

      if (provider === 'discord') {
        const response = await fetch('https://discord.com/api/users/@me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch Discord profile: ${response.statusText}`)
        }

        const data = await response.json()
        return {
          id: data.id,
          email: data.email,
          name: data.username,
          picture: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : undefined
        }
      }

      throw new Error(`Unsupported provider: ${provider}`)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Profile service temporarily unavailable. Please try again later.')
      }
      throw error
    }
  }
}