import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Envelope } from "@phosphor-icons/react"
import { toast } from "sonner"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface EmailVerificationCardProps {
  email: string
  onBack: () => void
  onSuccess: () => void
}

export function EmailVerificationCard({ email, onBack, onSuccess }: EmailVerificationCardProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setCode(numericValue)
    
    // Auto-submit when 6 digits are entered
    if (numericValue.length === 6) {
      handleVerify(numericValue)
    }
  }

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code
    
    if (codeToVerify.length !== 6) {
      toast.error("Please enter a 6-digit code")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any 6-digit code
      toast.success("Email verified successfully!")
      onSuccess()
    } catch (error) {
      toast.error("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success("Verification code resent to your email")
    } catch (error) {
      toast.error("Failed to resend code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(248, 250, 252), rgb(226, 232, 240), rgb(30, 41, 59), rgb(15, 23, 42), rgb(0, 0, 0))',
        backgroundSize: '600% 600%',
        backgroundPosition: '90% 65%',
        animation: 'subtle-flow 20s ease-in-out infinite',
        backdropFilter: 'blur(40px)',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
      }}
    >
      {/* Back Button - positioned absolutely */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="fixed top-4 left-4 w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center shadow-lg z-10"
        disabled={isLoading}
      >
        <ArrowLeft size={20} />
      </Button>

      <div className="w-full max-w-md mx-auto">
        <div 
          className="rounded-2xl p-8 transition-all duration-500 ease-out"
          style={{
            background: 'rgb(250, 250, 250)',
            border: '1px solid rgb(218, 224, 231)',
            boxShadow: 'rgb(255, 255, 255) 2px 2px 4px 0px inset, rgb(190, 199, 207) -2px -2px 4px 0px inset, rgba(0, 0, 0, 0.12) 0px 8px 32px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px',
            backdropFilter: 'blur(8px)',
            opacity: 1,
            transform: 'scale(1) translateY(0)',
            animation: 'smooth-fade-in 0.6s ease-out'
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

          {/* Code Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
            <div className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-14 text-center text-xl font-mono tracking-[0.5em] bg-white border border-slate-200 rounded-xl shadow-sm"
                style={{
                  outline: 'oklch(0.2 0 0) none 0px',
                  transition: '0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                disabled={isLoading}
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg disabled:opacity-50"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify code"}
            </Button>
          </form>

          {/* Resend Option */}
          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-sm"
              disabled={isLoading}
            >
              Didn't receive code? <span className="underline">Resend</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}