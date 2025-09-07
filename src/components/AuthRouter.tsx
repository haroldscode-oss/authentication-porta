import { useState } from 'react'
import { LoginCard } from './LoginCard'
import { PasswordCard } from './PasswordCard'
import { RegisterCard } from './RegisterCard'
import { ForgotPasswordCard } from './ForgotPasswordCard'
import { ResetPasswordCard } from './ResetPasswordCard'
import { ResetPasswordOptionsCard } from './ResetPasswordOptionsCard'
import { EmailVerificationCard } from './EmailVerificationCard'
import { SmsVerificationCard } from './SmsVerificationCard'
import { OnboardingGuide } from './OnboardingGuide'
import { MarketplaceDashboard } from './MarketplaceDashboard'

export type AuthStep = 
  | 'login' 
  | 'password' 
  | 'register' 
  | 'forgot-password' 
  | 'reset-password'
  | 'reset-password-options'
  | 'email-verification'
  | 'sms-verification'
  | 'onboarding'
  | 'dashboard'

interface AuthRouterProps {
  initialStep?: AuthStep
  resetToken?: string
}

export function AuthRouter({ initialStep = 'login', resetToken }: AuthRouterProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+1 (555) 123-4567') // Demo phone number
  
  const handleStepChange = (step: AuthStep, data?: { email?: string }) => {
    if (data?.email) {
      setEmail(data.email)
    }
    setCurrentStep(step)
  }
  
  switch (currentStep) {
    case 'password':
      return (
        <PasswordCard 
          email={email} 
          onBack={() => handleStepChange('login')}
          onForgotPassword={() => handleStepChange('reset-password-options', { email })}
          onSuccess={() => handleStepChange('onboarding')}
        />
      )
      
    case 'register':
      return (
        <RegisterCard 
          email={email} 
          onBack={() => handleStepChange('login')}
          onSuccess={() => handleStepChange('onboarding')}
        />
      )
      
    case 'forgot-password':
      return (
        <ForgotPasswordCard 
          initialEmail={email}
          onBack={() => handleStepChange('login')}
        />
      )

    case 'reset-password-options':
      return (
        <ResetPasswordOptionsCard
          email={email}
          onBack={() => handleStepChange('password', { email })}
          onEmailVerification={() => handleStepChange('email-verification', { email })}
          onSmsVerification={() => handleStepChange('sms-verification', { email })}
        />
      )

    case 'email-verification':
      return (
        <EmailVerificationCard
          email={email}
          onBack={() => handleStepChange('reset-password-options', { email })}
          onSuccess={() => handleStepChange('reset-password', { email })}
        />
      )

    case 'sms-verification':
      return (
        <SmsVerificationCard
          phone={phone}
          onBack={() => handleStepChange('reset-password-options', { email })}
          onSuccess={() => handleStepChange('reset-password', { email })}
        />
      )
      
    case 'reset-password':
      return (
        <ResetPasswordCard 
          token={resetToken || 'demo-token'}
          onBack={() => handleStepChange('login')}
          onSuccess={() => handleStepChange('onboarding')}
        />
      )

    case 'onboarding':
      return (
        <OnboardingGuide 
          onComplete={() => handleStepChange('dashboard')}
        />
      )

    case 'dashboard':
      return <MarketplaceDashboard />
      
    default:
      return (
        <LoginCard 
          onEmailCheck={(email, exists) => {
            if (exists) {
              handleStepChange('password', { email })
            } else {
              handleStepChange('register', { email })
            }
          }}
        />
      )
  }
}