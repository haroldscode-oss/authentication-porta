import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, DeviceMobile } from "@phosphor-icons/react"
import { toast } from "sonner"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface SmsVerificationCardProps {
  phone: string
  onBack: () => void
  onSuccess: () => void
}

export function SmsVerificationCard({ phone, onBack, onSuccess }: SmsVerificationCardProps) {
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
      toast.success("SMS code verified successfully!")
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
      toast.success("Verification code resent to your phone")
    } catch (error) {
      toast.error("Failed to resend code. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
          disabled={isLoading}
        >
          <ArrowLeft size={20} />
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4" style={{
            filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 2px 2px 4px) drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 8px)',
            textShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 4px, rgba(255, 255, 255, 0.3) -1px -1px 2px'
          }}>
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center text-blue-600">
              <DeviceMobile size={48} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-card-foreground mb-2">
            Check your phone
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter the 6-digit code sent to<br />
            <span className="font-medium text-foreground">{phone}</span>
          </p>
        </div>

        {/* Code Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-12 text-center text-lg font-mono tracking-wider bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="text-blue-600 hover:text-blue-700 underline p-0 h-auto font-normal text-sm"
            disabled={isLoading}
          >
            Didn't receive code? Resend
          </Button>
        </div>
      </div>
    </div>
  )
}