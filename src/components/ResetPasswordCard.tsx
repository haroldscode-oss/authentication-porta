import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface ResetPasswordCardProps {
  token: string
  onBack: () => void
}

export function ResetPasswordCard({ token, onBack }: ResetPasswordCardProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      toast.error("Please enter a new password")
      return
    }
    
    if (!confirmPassword.trim()) {
      toast.error("Please confirm your new password")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await resetPassword(token, password, confirmPassword)
      
      if (result.success) {
        toast.success("Password reset successfully! You are now logged in.")
        // In a real app, redirect to dashboard would happen here
      } else {
        toast.error(result.error || "Failed to reset password")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    const checks = [
      password.length >= 8,
      /[a-zA-Z]/.test(password),
      /\d/.test(password)
    ]
    return checks.filter(Boolean).length
  }

  const passwordStrength = getPasswordStrength(password)

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl p-8 transition-all duration-300" style={{
          background: 'rgb(250, 250, 250)',
          border: '1px solid rgb(218, 224, 231)',
          boxShadow: 'rgb(255, 255, 255) 2px 2px 4px 0px inset, rgb(190, 199, 207) -2px -2px 4px 0px inset, rgba(0, 0, 0, 0.12) 0px 8px 32px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="text-center">
            <h2 className="text-xl font-bold text-card-foreground mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Button
              onClick={onBack}
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl p-8 transition-all duration-300" style={{
        background: 'rgb(250, 250, 250)',
        border: '1px solid rgb(218, 224, 231)',
        boxShadow: 'rgb(255, 255, 255) 2px 2px 4px 0px inset, rgb(190, 199, 207) -2px -2px 4px 0px inset, rgba(0, 0, 0, 0.12) 0px 8px 32px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px',
        backdropFilter: 'blur(8px)'
      }}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </Button>

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
          <h2 className="text-xl font-bold text-card-foreground mb-2">
            Reset your password
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your new password below.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 h-auto hover:bg-transparent"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlash size={20} className="text-muted-foreground" />
              ) : (
                <Eye size={20} className="text-muted-foreground" />
              )}
            </Button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= passwordStrength 
                        ? passwordStrength === 1 
                          ? 'bg-red-400'
                          : passwordStrength === 2
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                  ✓ At least 8 characters
                </div>
                <div className={/[a-zA-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                  ✓ At least one letter
                </div>
                <div className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                  ✓ At least one number
                </div>
              </div>
            </div>
          )}
          
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 h-auto hover:bg-transparent"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeSlash size={20} className="text-muted-foreground" />
              ) : (
                <Eye size={20} className="text-muted-foreground" />
              )}
            </Button>
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
            disabled={isLoading || !password.trim() || !confirmPassword.trim() || passwordStrength < 3}
          >
            {isLoading ? "Resetting password..." : "Reset password"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Remember your password?{" "}
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 underline p-0 h-auto font-normal text-xs"
              disabled={isLoading}
            >
              Back to login
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}