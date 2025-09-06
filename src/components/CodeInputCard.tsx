import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface CodeInputCardProps {
  email: string
  method: 'email' | 'sms'
  onBack: () => void
  onCodeVerified: (code: string) => void
}

export function CodeInputCard({ email, method, onBack, onCodeVerified }: CodeInputCardProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    // Countdown for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return
    if (value && !/^\d+$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit) && value) {
      handleVerifyCode(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      inputRefs.current[5]?.focus()
      handleVerifyCode(pastedData)
    }
  }

  const handleVerifyCode = async (codeValue: string) => {
    if (codeValue.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any 6-digit code
      onCodeVerified(codeValue)
      toast.success("Code verified successfully!")
    } catch (error) {
      toast.error("Invalid code. Please try again.")
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendCooldown(30)
    
    try {
      // Simulate sending code
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success(`New code sent to your ${method === 'email' ? 'email' : 'phone'}`)
    } catch (error) {
      toast.error("Failed to resend code. Please try again.")
    }
  }

  const isCodeComplete = code.every(digit => digit)

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
            Enter verification code
          </h2>
          <p className="text-muted-foreground text-sm">
            We sent a 6-digit code to your {method === 'email' ? 'email' : 'phone'}
          </p>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            {method === 'email' ? email : '•••-•••-••••'}
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleInputChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:border-transparent"
                style={{
                  outline: 'none'
                }}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={() => handleVerifyCode(code.join(''))}
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
            disabled={!isCodeComplete || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="text-blue-600 hover:text-blue-700 underline p-0 h-auto font-normal text-sm"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : `Resend code`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}