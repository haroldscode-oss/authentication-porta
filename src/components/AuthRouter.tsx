import { useState } from 'react'
import { LoginCard } from './LoginCard'
import { PasswordCard } from './PasswordCard'
import { RegisterCard } from './RegisterCard'
import { ForgotPasswordCard } from './ForgotPasswordCard'
import { ResetPasswordCard } from './ResetPasswordCard'

export type AuthStep = 
  | 'login' 
  | 'password' 
  | 'register' 
  | 'forgot-password' 
  | 'reset-password'

interface AuthRouterProps {
  initialStep?: AuthStep
  resetToken?: string
}

export function AuthRouter({ initialStep = 'login', resetToken }: AuthRouterProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep)
  const [email, setEmail] = useState('')
  
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
          onForgotPassword={() => handleStepChange('forgot-password', { email })}
        />
      )
      
    case 'register':
      return (
        <RegisterCard 
          email={email} 
          onBack={() => handleStepChange('login')}
        />
      )
      
    case 'forgot-password':
      return (
        <ForgotPasswordCard 
          initialEmail={email}
          onBack={() => handleStepChange('login')}
        />
      )
      
    case 'reset-password':
      return (
        <ResetPasswordCard 
          token={resetToken || ''}
          onBack={() => handleStepChange('login')}
        />
      )
      
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