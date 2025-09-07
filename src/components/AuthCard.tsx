import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { ArrowRight, ArrowLeft, Eye, EyeSlash, Phone, Envelope } from "@phosphor-icons/react"
import { OnboardingGuide, type RegistrationMethod } from "@/components/OnboardingGuide"
import { oauth } from "@/lib/oauth"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

type AuthFlow = 'signin' | 'signup'
type AuthStep = 'email' | 'password' | 'signup-form' | 'sms-verification' | 'welcome' | 'onboarding' | 'forgot-password' | 'reset-method' | 'reset-password' | 'email-verification'

export function AuthCard({ onComplete }: { onComplete?: () => void }) {
  const [authFlow, setAuthFlow] = useState<AuthFlow>('signin')
  const [currentStep, setCurrentStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [smsCode, setSmsCode] = useState("")
  const [emailCode, setEmailCode] = useState("")
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationMethod, setRegistrationMethod] = useState<RegistrationMethod>('email')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    fullName?: string
    phoneNumber?: string
    smsCode?: string
    emailCode?: string
    terms?: string
  }>({})

  // Handle OAuth success callback
  useEffect(() => {
    const handleOAuthSuccess = (event: CustomEvent) => {
      const { user, provider } = event.detail
      console.log('OAuth success:', user)
      
      setEmail(user.email)
      setFullName(user.name)
      setRegistrationMethod(provider)
      
      // Check if this is an existing account (simplified logic)
      const accountStatus = checkAccountStatus(user.email)
      
      if (accountStatus === 'existing' || accountStatus === 'discord-oauth' || accountStatus === 'google-oauth') {
        // Existing user - show welcome then onboarding
        setCurrentStep('welcome')
        toast.success(`Signed in with ${provider}!`)
        setTimeout(() => {
          setCurrentStep('onboarding')
        }, 2500)
      } else {
        // New user - show create account flow
        setAuthFlow('signup')
        setCurrentStep('signup-form')
        toast.message(`Welcome! Let's set up your ${provider} account.`)
      }
      
      setIsLoading(false)
    }

    const handleOAuthError = () => {
      toast.error('Authentication failed. Please try again.')
      setIsLoading(false)
    }

    // Listen for OAuth events
    window.addEventListener('oauth-success', handleOAuthSuccess as EventListener)
    window.addEventListener('oauth-error', handleOAuthError)

    // Check if there's already an OAuth user from a previous session
    const existingUser = oauth.getCurrentUser()
    if (existingUser && currentStep === 'email') {
      handleOAuthSuccess({ detail: { user: existingUser, provider: existingUser.provider } } as CustomEvent)
    }

    return () => {
      window.removeEventListener('oauth-success', handleOAuthSuccess as EventListener)
      window.removeEventListener('oauth-error', handleOAuthError)
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\s+/g, ''))
  }

  // Predefined test credentials
  const testAccounts = {
    existing: ['exist@example.com'],
    new: ['new@example.com'],
    discordOAuth: ['exist@discord.com'],
    googleOAuth: ['exist@gmail.com']
  }

  const checkAccountStatus = (email: string) => {
    if (testAccounts.existing.includes(email)) return 'existing'
    if (testAccounts.new.includes(email)) return 'new'
    if (testAccounts.discordOAuth.includes(email)) return 'discord-oauth'
    if (testAccounts.googleOAuth.includes(email)) return 'google-oauth'
    return 'unknown'
  }

  const handleOAuthLogin = (provider: 'discord' | 'google') => {
    setIsLoading(true)
    setRegistrationMethod(provider) // Track registration method
    
    try {
      if (provider === 'google') {
        oauth.loginWithGoogle()
      } else if (provider === 'discord') {
        oauth.loginWithDiscord()
      }
      
      // Note: The OAuth flow will redirect to the backend, then back to the frontend
      // The OAuth callback will be handled automatically by the oauth utility
    } catch (error) {
      console.error('OAuth login error:', error)
      toast.error(`Failed to authenticate with ${provider}`)
      setIsLoading(false)
    }
  }

  const handleEmailContinue = () => {
    setErrors({})
    
    if (!email) {
      setErrors({ email: "Email is required" })
      return
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }
    
    setIsLoading(true)
    
    // Simulate checking account status
    setTimeout(() => {
      const accountStatus = checkAccountStatus(email.toLowerCase())
      
      if (accountStatus === 'existing') {
        // Account exists - go to password screen
        setRegistrationMethod('email') // Set email method
        setCurrentStep('password')
        toast.success("Account found! Please enter your password.")
      } else if (accountStatus === 'new') {
        // New user - go to signup form with email prefilled
        setRegistrationMethod('email') // Set email method
        setAuthFlow('signup')
        setCurrentStep('signup-form')
        toast.message("Let's create your account!")
      } else if (accountStatus === 'discord-oauth') {
        // Discord OAuth user - redirect to Discord auth
        setRegistrationMethod('discord') // Set Discord method
        toast.message("We found a Discord account! Redirecting to Discord authentication...")
        setTimeout(() => {
          handleOAuthLogin('discord')
        }, 1000)
        return // Don't reset loading here as OAuth will handle it
      } else if (accountStatus === 'google-oauth') {
        // Google OAuth user - redirect to Google auth
        setRegistrationMethod('google') // Set Google method
        toast.message("We found a Google account! Redirecting to Google authentication...")
        setTimeout(() => {
          handleOAuthLogin('google')
        }, 1000)
        return // Don't reset loading here as OAuth will handle it
      } else {
        // Unknown email - treat as new user for now
        setRegistrationMethod('email') // Set email method
        setAuthFlow('signup')
        setCurrentStep('signup-form')
        toast.message("Let's create your account!")
      }
      
      setIsLoading(false)
    }, 800)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!fullName.trim()) {
      setErrors({ fullName: "Full name is required" })
      return
    }
    
    // Phone number is now optional - only validate if provided
    if (phoneNumber.trim() && !validatePhone(phoneNumber)) {
      setErrors({ phoneNumber: "Please enter a valid phone number" })
      return
    }
    
    if (!password) {
      setErrors({ password: "Password is required" })
      return
    }
    
    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" })
      return
    }
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      return
    }
    
    if (!acceptedTerms) {
      setErrors({ terms: "You must accept the Terms of Service" })
      return
    }
    
    setIsLoading(true)
    
    // Simulate account creation and SMS sending
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // If phone number is provided, go to SMS verification
      if (phoneNumber.trim()) {
        toast.success("Verification code sent to your phone!")
        setCurrentStep('sms-verification')
      } else {
        // Skip SMS verification if no phone number provided
        toast.success("Account created successfully!")
        setCurrentStep('welcome')
        setTimeout(() => {
          setCurrentStep('onboarding')
        }, 2500)
      }
    } catch (error) {
      toast.error("Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSmsVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!smsCode || smsCode.length !== 6) {
      setErrors({ smsCode: "Please enter the 6-digit code" })
      return
    }
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if this is coming from the reset flow or signup flow
      if (authFlow === 'signup') {
        toast.success("Phone verified successfully!")
        setCurrentStep('welcome')
        setTimeout(() => {
          setCurrentStep('onboarding')
        }, 2500)
      } else {
        // This is from password reset flow
        toast.success("SMS code verified successfully!")
        setCurrentStep('email') // Back to login after successful verification
      }
    } catch (error) {
      toast.error("Invalid verification code")
      setErrors({ smsCode: "Invalid verification code" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!password) {
      setErrors({ password: "Password is required" })
      return
    }
    
    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" })
      return
    }
    
    setIsLoading(true)
    
    // Simulate authentication - for test accounts, accept any 6+ char password
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const accountStatus = checkAccountStatus(email.toLowerCase())
      
      if (accountStatus === 'existing') {
        toast.success("Successfully logged in!")
        setCurrentStep('welcome')
        setTimeout(() => {
          setCurrentStep('onboarding')
        }, 2500)
      } else {
        // Invalid account for password login
        throw new Error("Account not found")
      }
    } catch (error) {
      toast.error("Invalid email or password")
      setErrors({ password: "Invalid email or password" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setCurrentStep('reset-method')
  }

  const handleResetMethod = (method: 'email' | 'phone') => {
    setResetMethod(method)
    setIsLoading(true)
    
    // Simulate sending the reset code
    setTimeout(() => {
      setIsLoading(false)
      if (method === 'email') {
        // Go directly to email verification 6-digit code page
        setCurrentStep('email-verification')
        toast.success("Verification code sent to your email!")
      } else {
        // Go directly to SMS verification 6-digit code page  
        setCurrentStep('sms-verification')
        toast.success("Verification code sent to your phone!")
      }
    }, 800)
  }

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!emailCode || emailCode.length !== 6) {
      setErrors({ emailCode: "Please enter the 6-digit code" })
      return
    }
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Email verified successfully!")
      setCurrentStep('email') // Back to login after successful verification
    } catch (error) {
      toast.error("Invalid verification code")
      setErrors({ emailCode: "Invalid verification code" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Reset link sent to your ${resetMethod}!`)
      setCurrentStep('email')
    } catch (error) {
      toast.error("Failed to send reset link")
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (currentStep === 'password') {
      setCurrentStep('email')
      setErrors({})
    } else if (currentStep === 'signup-form') {
      setCurrentStep('email')
      setErrors({})
    } else if (currentStep === 'sms-verification') {
      setCurrentStep('signup-form')
      setErrors({})
    } else if (currentStep === 'reset-method') {
      setCurrentStep('password')
      setErrors({})
    } else if (currentStep === 'reset-password') {
      setCurrentStep('reset-method')
      setErrors({})
    } else if (currentStep === 'email-verification') {
      setCurrentStep('reset-method')
      setErrors({})
    }
  }

  // Welcome Animation Component
  if (currentStep === 'welcome') {
    return (
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.23, 1, 0.32, 1]
        }}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.15, 
              duration: 0.9, 
              ease: [0.23, 1, 0.32, 1]
            }}
            className="mb-8"
          >
            <img 
              src={ssLogo} 
              alt="SS Logo" 
              className="w-32 h-32 mx-auto object-contain" 
              style={{
                filter: 'drop-shadow(rgba(0, 0, 0, 0.1) 0px 20px 30px) drop-shadow(rgba(59, 130, 246, 0.3) 0px 0px 40px)'
              }}
            />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Welcome to Seller Services!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg text-gray-600"
          >
            You're all set. Let's get started!
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8"
          >
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  if (currentStep === 'onboarding') {
    return <OnboardingGuide 
      onComplete={() => {
        toast.success("Welcome to Seller Services!")
        // Navigate to marketplace after onboarding
        onComplete?.()
      }} 
      registrationMethod={registrationMethod}
      userEmail={email}
    />
  }

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0, y: 4 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.85,
        ease: [0.23, 1, 0.32, 1],
        type: "tween"
      }}
      className="min-h-screen flex items-center justify-center p-4 relative bg-white"
      style={{
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
      }}
    >
      {/* Navigation Button - Top Left */}
      {(currentStep === 'password' || currentStep === 'signup-form' || currentStep === 'sms-verification' || currentStep === 'reset-method' || currentStep === 'reset-password' || currentStep === 'email-verification') && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute top-6 left-6 z-10"
        >
          <Button
            onClick={goBack}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 p-0 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </Button>
        </motion.div>
      )}

      {/* Auth Flow Switch Button - Top Right */}
      {false && ( // Hidden since we're using detection-based flow
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute top-6 right-6 z-10"
        >
          <Button
            onClick={switchAuthFlow}
            variant="outline"
            className="h-10 px-4 bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-white transition-all duration-200"
          >
            {authFlow === 'signin' ? 'Sign up' : 'Sign in'}
          </Button>
        </motion.div>
      )}

      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl p-8 transition-all duration-300" style={{
          background: 'rgb(255, 255, 255)',
          border: '1px solid rgb(218, 224, 231)',
          boxShadow: 'rgb(255, 255, 255) 2px 2px 4px 0px inset, rgb(190, 199, 207) -2px -2px 4px 0px inset, rgba(0, 0, 0, 0.12) 0px 8px 32px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px',
          backdropFilter: 'blur(8px)'
        }}>
          <AnimatePresence mode="wait">
            {currentStep === 'email' && (
              <motion.div
                key="email-step"
                initial={{ scale: 0.99, opacity: 0, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.99, opacity: 0, y: -2 }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4" style={{
                    filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 2px 2px 4px) drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 8px)',
                    textShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 4px, rgba(255, 255, 255, 0.3) -1px -1px 2px'
                  }}>
                    <img 
                      src={ssLogo} 
                      alt="SS Logo" 
                      className="w-24 h-24 mx-auto object-contain" 
                      style={{
                        filter: 'drop-shadow(rgba(0, 0, 0, 0.04) 0px 10px 8px) drop-shadow(rgba(0, 0, 0, 0.1) 0px 4px 3px)'
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Seller Services
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Enter your email to continue
                  </p>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={() => handleOAuthLogin('discord')}
                    className="w-full h-12 bg-[#5865F2] text-white rounded-xl font-medium hover:bg-[#4752C4] transition-all duration-200 shadow-lg"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Continue with Discord
                  </Button>
                  
                  <Button
                    onClick={() => handleOAuthLogin('google')}
                    className="w-full h-12 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-gray-50 hover:text-slate-900 transition-all duration-200 shadow-lg"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-slate-900">
                      Continue with Google
                    </span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-medium">OR</span>
                  </div>
                </div>

                {/* Email Form */}
                <div className="space-y-4">
                  <div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleEmailContinue}
                    className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Continue"}
                    {!isLoading && <ArrowRight size={18} />}
                  </Button>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <a href="#" className="underline hover:text-foreground transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 'password' && (
              <motion.div
                key="password-step"
                initial={{ scale: 0.99, opacity: 0, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.99, opacity: 0, y: -2 }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4" style={{
                    filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 2px 2px 4px) drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 8px)',
                    textShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 4px, rgba(255, 255, 255, 0.3) -1px -1px 2px'
                  }}>
                    <img 
                      src={ssLogo} 
                      alt="SS Logo" 
                      className="w-16 h-16 mx-auto object-contain" 
                      style={{
                        filter: 'drop-shadow(rgba(0, 0, 0, 0.04) 0px 10px 8px) drop-shadow(rgba(0, 0, 0, 0.1) 0px 4px 3px)'
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Welcome back
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {email}
                  </p>
                </div>

                {/* Password Form */}
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                {/* Forgot Password */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'signup-form' && (
              <motion.div
                key="signup-step"
                initial={{ scale: 0.99, opacity: 0, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.99, opacity: 0, y: -2 }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4" style={{
                    filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 2px 2px 4px) drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 8px)',
                    textShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 4px, rgba(255, 255, 255, 0.3) -1px -1px 2px'
                  }}>
                    <img 
                      src={ssLogo} 
                      alt="SS Logo" 
                      className="w-16 h-16 mx-auto object-contain" 
                      style={{
                        filter: 'drop-shadow(rgba(0, 0, 0, 0.04) 0px 10px 8px) drop-shadow(rgba(0, 0, 0, 0.1) 0px 4px 3px)'
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Almost there!
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {email}
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm"
                      disabled={isLoading}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Phone number (optional)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm"
                      disabled={isLoading}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms of Service Checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1"
                      disabled={isLoading}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-normal cursor-pointer">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-600">{errors.terms}</p>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </motion.div>
            )}

            {currentStep === 'sms-verification' && (
              <motion.div
                key="sms-step"
                initial={{ scale: 0.99, opacity: 0, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.99, opacity: 0, y: -2 }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4" style={{
                    filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 2px 2px 4px) drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 8px)',
                    textShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 4px, rgba(255, 255, 255, 0.3) -1px -1px 2px'
                  }}>
                    <Phone size={48} className="mx-auto text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Verify your phone
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code sent to<br />
                    <span className="font-medium">{phoneNumber || "your phone"}</span>
                  </p>
                </div>

                {/* SMS Code Form */}
                <form onSubmit={handleSmsVerification} className="space-y-4">
                  <div>
                    <Input
                      id="smsCode"
                      type="text"
                      placeholder="000000"
                      value={smsCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setSmsCode(value)
                        // Auto-submit when 6 digits are entered
                        if (value.length === 6) {
                          setTimeout(() => {
                            const form = e.target.closest('form')
                            if (form) {
                              const submitEvent = new Event('submit', { bubbles: true })
                              form.dispatchEvent(submitEvent)
                            }
                          }, 100)
                        }
                      }}
                      className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm text-center text-lg font-mono tracking-widest"
                      disabled={isLoading}
                      maxLength={6}
                    />
                    {errors.smsCode && (
                      <p className="text-sm text-red-600 mt-1">{errors.smsCode}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    disabled={isLoading || smsCode.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify code"}
                  </Button>
                </form>

                {/* Resend Code */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => toast.success("Verification code resent!")}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    disabled={isLoading}
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'reset-method' && (
              <motion.div
                key="reset-method-step"
                initial={{ scale: 0.99, opacity: 0, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.99, opacity: 0, y: -2 }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4" style={{
                    filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 2px 2px 4px) drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 8px)',
                    textShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 4px, rgba(255, 255, 255, 0.3) -1px -1px 2px'
                  }}>
                    <img 
                      src={ssLogo} 
                      alt="SS Logo" 
                      className="w-16 h-16 mx-auto object-contain" 
                      style={{
                        filter: 'drop-shadow(rgba(0, 0, 0, 0.04) 0px 10px 8px) drop-shadow(rgba(0, 0, 0, 0.1) 0px 4px 3px)'
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Reset password
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    How would you like to reset your password?
                  </p>
                </div>

                {/* Reset Method Options */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleResetMethod('email')}
                    className="w-full h-12 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center gap-3"
                  >
                    <Envelope size={20} />
                    Send reset code via Email
                  </Button>
                  
                  <Button
                    onClick={() => handleResetMethod('phone')}
                    className="w-full h-12 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center gap-3"
                  >
                    <Phone size={20} />
                    Send reset code via SMS
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 'email-verification' && (
              <motion.div
                key="email-verification-step"
                initial={{ scale: 0.99, opacity: 0, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.99, opacity: 0, y: -2 }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-6" style={{
                    filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 2px 2px 4px) drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 8px)',
                    textShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 4px, rgba(255, 255, 255, 0.3) -1px -1px 2px'
                  }}>
                    <Envelope size={48} className="mx-auto text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-4">
                    Check your email
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Enter the 6-digit code sent to<br />
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                {/* Email Code Form */}
                <form onSubmit={handleEmailVerification} className="space-y-6">
                  <div>
                    <Input
                      id="emailCode"
                      type="text"
                      placeholder="000000"
                      value={emailCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setEmailCode(value)
                        // Auto-submit when 6 digits are entered
                        if (value.length === 6) {
                          setTimeout(() => {
                            const form = e.target.closest('form')
                            if (form) {
                              const submitEvent = new Event('submit', { bubbles: true })
                              form.dispatchEvent(submitEvent)
                            }
                          }, 100)
                        }
                      }}
                      className="w-full h-14 text-center text-xl font-mono tracking-[0.5em] bg-white border border-slate-200 rounded-xl shadow-sm"
                      style={{
                        outline: 'oklch(0.2 0 0) none 0px',
                        transition: '0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      disabled={isLoading}
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                    {errors.emailCode && (
                      <p className="text-sm text-red-600 mt-1">{errors.emailCode}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg disabled:opacity-50"
                    disabled={isLoading || emailCode.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify code"}
                  </Button>
                </form>

                {/* Resend Code */}
                <div className="mt-6 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => toast.success("Verification code resent to your email!")}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-sm"
                    disabled={isLoading}
                  >
                    Didn't receive code? <span className="underline">Resend</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 'reset-password' && (
              <motion.div
                key="reset-password-step"
                initial={{ scale: 0.99, opacity: 0, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.99, opacity: 0, y: -2 }}
                transition={{ 
                  duration: 0.45, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    {resetMethod === 'email' ? (
                      <Envelope size={48} className="mx-auto text-blue-600" />
                    ) : (
                      <Phone size={48} className="mx-auto text-blue-600" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Check your {resetMethod}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    We'll send a reset {resetMethod === 'email' ? 'link' : 'code'} to<br />
                    <span className="font-medium">{resetMethod === 'email' ? email : phoneNumber}</span>
                  </p>
                </div>

                {/* Reset Form */}
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send reset code via Email"}
                  </Button>
                </form>

                {/* Back to sign in */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('email')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}