import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Envelope, DeviceMobile } from "@phosphor-icons/react"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface ResetPasswordOptionsCardProps {
  email: string
  onBack: () => void
  onEmailVerification: () => void
  onSmsVerification: () => void
}

export function ResetPasswordOptionsCard({ 
  email, 
  onBack, 
  onEmailVerification, 
  onSmsVerification 
}: ResetPasswordOptionsCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailReset = async () => {
    setIsLoading(true)
    try {
      // Simulate sending email verification
      await new Promise(resolve => setTimeout(resolve, 500))
      onEmailVerification()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSmsReset = async () => {
    setIsLoading(true)
    try {
      // Simulate sending SMS verification
      await new Promise(resolve => setTimeout(resolve, 500))
      onSmsVerification()
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
            Reset password
          </h2>
          <p className="text-muted-foreground text-sm">
            How would you like to reset your password?
          </p>
        </div>

        {/* Reset Options */}
        <div className="space-y-3">
          <Button
            onClick={handleEmailReset}
            disabled={isLoading}
            className="w-full h-12 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-gray-50 hover:text-slate-900 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
          >
            <Envelope size={20} className="text-blue-600" />
            Send reset code via Email
          </Button>

          <Button
            onClick={handleSmsReset}
            disabled={isLoading}
            className="w-full h-12 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-gray-50 hover:text-slate-900 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
          >
            <DeviceMobile size={20} className="text-blue-600" />
            Send reset code via SMS
          </Button>
        </div>

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