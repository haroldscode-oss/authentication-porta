import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"
import discordIcon from "@/assets/images/discord-icon.svg"
import googleIcon from "@/assets/images/google-icon.svg"

export function AuthCard() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{email?: string; password?: string}>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const newErrors: {email?: string; password?: string} = {}
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Successfully logged in!")
      // Redirect to dashboard would happen here
    } catch (error) {
      toast.error("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: 'discord' | 'google') => {
    toast.info(`Redirecting to ${provider}...`)
    // OAuth redirect would happen here
    window.location.href = `/auth/${provider}`
  }

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "radial-gradient(circle at 50% 50%, oklch(0.98 0 0) 0%, oklch(0.96 0 0) 100%)"
      }}
    >
      <Card className="w-full max-w-md shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <img src={ssLogo} alt="Seller Services Logo" className="w-16 h-16" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-medium text-foreground">
              Seller Services
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleOAuthLogin('discord')}
              className="w-full h-12 text-white font-medium rounded-lg transition-colors duration-200"
              style={{ 
                backgroundColor: 'oklch(0.6 0.15 260)', 
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.55 0.18 260)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.6 0.15 260)'
              }}
              disabled={isLoading}
            >
              <img src={discordIcon} alt="Discord" className="w-5 h-5 mr-3" />
              Continue with Discord
            </Button>
            
            <Button
              onClick={() => handleOAuthLogin('google')}
              variant="outline"
              className="w-full h-12 border-2 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
              style={{ 
                borderColor: 'oklch(0.85 0 0)', 
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
              disabled={isLoading}
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-card px-3 text-muted-foreground text-sm">OR</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-11 ${errors.email ? 'border-destructive' : ''}`}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-11 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-medium text-white rounded-lg transition-colors duration-200"
              style={{ 
                backgroundColor: 'oklch(0.6 0.15 240)', 
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.55 0.18 240)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.6 0.15 240)'
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Log in with Email"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              No account?{" "}
              <button 
                onClick={() => window.location.href = "/auth/register"}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              By continuing you agree to our{" "}
              <button className="text-primary hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-primary hover:underline">
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}