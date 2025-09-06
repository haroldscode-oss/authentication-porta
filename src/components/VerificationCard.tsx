import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface VerificationCardProps {
  email: string
  onVerify: (code: string) => void
  onResend: () => void
  onBack: () => void
}

export function VerificationCard({ email, onVerify, onResend, onBack }: VerificationCardProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) {
      toast.error('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onVerify(code)
      toast.success('Email verified successfully!')
    } catch (error) {
      toast.error('Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onResend()
      toast.success('Verification code resent!')
    } catch (error) {
      toast.error('Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCode = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numbers = value.replace(/\D/g, '').slice(0, 6)
    return numbers
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        <div className="card-3d rounded-2xl p-8 transition-all duration-300">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label="Go back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>

          <div className="text-center mb-8 mt-8">
            {/* Email Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
              <Mail size={32} className="text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Check your email
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6-digit Code Input */}
            <div>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(formatCode(e.target.value))}
                placeholder="000000"
                className="h-12 text-center text-2xl font-mono tracking-widest bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={code.length !== 6 || isLoading}
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify code'
              )}
            </Button>
          </form>

          {/* Resend Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive code?{' '}
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium underline disabled:opacity-50"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}