import { useState, useRef, useEffect } from "react"
import { ArrowLeft } from "@phosphor-icons/reac
import { useAuth } from "@/lib/auth"

import { useAuth } from "@/lib/auth"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface VerificationCodeCardProps {
}
  method: 'email' | 'sms'
  const [code, setCo
  onSuccess: () => void
}

export function VerificationCodeCard({ email, method, onBack, onSuccess }: VerificationCodeCardProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds countdown
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyCode, resendCode } = useAuth()

    // Only allow si
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
    if (value && index <
    }


          setCode(digits)
        }
    }


    if (finalCode.length !== 
      return


      const result = await v
      if (result.success) {
        onSuccess()
     

      }
      toast.error("An unexpected error occurred. Please try again.")
      inputRefs.current[0]?.focus()
     
  }

    
    
      const result = await resendCode(email)
      if (result.success) {
     
    
      } else {
      }
      toast.error("An un
      setIsLoading(false)
  }
  const formatTime = (seconds: num
    const secs = seconds 
  }
  return 
      <d
     
   

          variant="ghost"
          className="mb-4 p-2 -ml-2 hover:bg-gray
    
        </Button>
        {/* Header */}
          <d
     

              alt="SS 
    
         
          </div>
      
          <p className="tex
          </p>
            {email}
        </div>
        {/* Code Input */}
          <div className="flex gap
              <input
                ref={(el) => (inputRe
       
                value
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 te
                  boxShadow: digit 
              /
          </div>
     
   

          </Button>

    
            Didn't rec
    
         
              onClick={handleResendCode}
      
              Resend code
          ) : (
              Resend co
          )}

        <div className="mt-6 text-cen
            Wr
              variant="ghost"
       
            >
            </Button>
        </div>
    </div>
}




    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
          <p className="text-muted-foreground text-sm mb-1">
            We sent a 6-digit code to your {method}
          </p>
          <p className="text-card-foreground font-medium text-sm">
            {email}
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="w-12 h-12 text-center text-lg font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-slate-400 transition-all duration-200"
                style={{
                  boxShadow: digit ? '0 0 0 1px rgba(59, 130, 246, 0.3)' : undefined
                }}
              />
            ))}
          </div>

          <Button
            onClick={() => handleSubmit()}
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
            disabled={isLoading || code.some(digit => digit === '')}
          >
            {isLoading ? "Verifying..." : "Verify code"}
          </Button>
        </div>

        {/* Resend Code */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          
          {canResend ? (
            <Button
              variant="ghost"
              onClick={handleResendCode}
              className="text-blue-600 hover:text-blue-700 underline p-0 h-auto font-medium text-sm"
              disabled={isLoading}
            >
              Resend code
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend code in {formatTime(timeLeft)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Wrong {method}?{" "}
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 underline p-0 h-auto font-normal text-xs"
              disabled={isLoading}
            >
              Go back
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}