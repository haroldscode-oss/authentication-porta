import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface ForgotPasswordCardProps {
  initialEmail?: string
  onBack: () => void
}

export function ForgotPasswordCard({ initialEmail = "", onBack }: ForgotPasswordCardProps) {
  const [email, setEmail] = useState(initialEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await requestPasswordReset(email)
      
      if (result.success) {
        setIsSubmitted(true)
        toast.success("If an account with that email exists, we've sent password reset instructions.")
      } else {
        toast.error(result.error || "An error occurred")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl p-8 transition-all duration-300" style={{
          background: 'rgb(250, 250, 250)',
          border: '1px solid rgb(218, 224, 231)',
          boxShadow: 'rgb(255, 255, 255) 2px 2px 4px 0px inset, rgb(190, 199, 207) -2px -2px 4px 0px inset, rgba(0, 0, 0, 0.12) 0px 8px 32px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px',
          backdropFilter: 'blur(8px)'
        }}>
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
              Check your email
            </h2>
            <p className="text-muted-foreground text-sm">
              If an account with <strong>{email}</strong> exists, we've sent password reset instructions to your email.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200"
            >
              Try different email
            </Button>
            
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
            Forgot your password?
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? "Sending..." : "Send reset code via Email"}
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