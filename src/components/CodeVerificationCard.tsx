import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface CodeVerificationCardProps {
  email: string
  resetMethod: 'email' | 'sms'
  onBack: () => void
  onVerifySuccess: () => void
}

export function CodeVerificationCard({ email, resetMethod, onBack, onVerifySuccess }: CodeVerificationCardProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('')
      const newCode = [...code]
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char
        }
      })
      setCode(newCode)
      
      // Focus next empty input or last input
      const nextIndex = Math.min(index + pastedCode.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const codeString = code.join('')
    if (codeString.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, accept specific codes
      if (codeString === '123456' || codeString === '000000') {
        toast.success("Code verified successfully!")
        onVerifySuccess()
      } else {
        toast.error("Invalid verification code. Please try again.")
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`New verification code sent via ${resetMethod}`)
    } catch (error) {
      toast.error("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const isCodeComplete = code.every(digit => digit !== '')

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
            Enter verification code
          </h2>
          <p className="text-muted-foreground text-sm">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-card-foreground">
              {resetMethod === 'email' ? email : `••••••${email.slice(-4)}`}
            </span>
          </p>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
                autoComplete="off"
              />
            ))}
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
            disabled={isLoading || !isCodeComplete}
          >
            {isLoading ? "Verifying..." : "Verify code"}
          </Button>
        </form>

        {/* Resend Option */}
        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          
          <Button
            variant="ghost"
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            disabled={isResending || isLoading}
          >
            {isResending ? "Sending..." : `Resend code via ${resetMethod}`}
          </Button>
        </div>

        {/* Demo Helper */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 text-center">
            <strong>Demo:</strong> Use code <code className="font-mono bg-blue-100 px-1 rounded">123456</code> or <code className="font-mono bg-blue-100 px-1 rounded">000000</code>
          </p>
        </div>
      </div>
    </div>
  )
}