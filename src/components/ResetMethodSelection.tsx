import { Button } from "@/components/ui/button"
import { ArrowLeft, Envelope, DeviceMobile } from "@phosphor-icons/react"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface ResetMethodSelectionProps {
  email: string
  onBack: () => void
  onMethodSelect: (method: 'email' | 'sms') => void
}

export function ResetMethodSelection({ email, onBack, onMethodSelect }: ResetMethodSelectionProps) {
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  const maskedPhone = '•••-•••-••••' // Mock phone number

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
            Choose reset method
          </h2>
          <p className="text-muted-foreground text-sm">
            How would you like to receive your password reset code?
          </p>
        </div>

        {/* Method Options */}
        <div className="space-y-3">
          <Button
            onClick={() => onMethodSelect('email')}
            variant="outline"
            className="w-full h-16 rounded-xl border-slate-200 hover:bg-gray-50 transition-all duration-200 text-left"
            style={{ justifyContent: 'flex-start' }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Envelope size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Send reset code via Email</div>
                <div className="text-sm text-muted-foreground">{maskedEmail}</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => onMethodSelect('sms')}
            variant="outline"
            className="w-full h-16 rounded-xl border-slate-200 hover:bg-gray-50 transition-all duration-200 text-left"
            style={{ justifyContent: 'flex-start' }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <DeviceMobile size={20} className="text-green-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Send reset code via SMS</div>
                <div className="text-sm text-muted-foreground">{maskedPhone}</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}