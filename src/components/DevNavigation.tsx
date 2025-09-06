import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@phosphor-icons/react"
import { AuthStep } from './AuthRouter'

interface DevNavigationProps {
  onStepChange: (step: AuthStep) => void
}

export function DevNavigation({ onStepChange }: DevNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const steps: { label: string; step: AuthStep }[] = [
    { label: 'Login', step: 'login' },
    { label: 'OAuth Prompt', step: 'oauth-prompt' },
    { label: 'Password', step: 'password' },
    { label: 'Register', step: 'register' },
    { label: 'Forgot Password', step: 'forgot-password' },
    { label: 'Reset Method', step: 'reset-method-select' },
    { label: 'Code Input', step: 'code-input' },
    { label: 'Reset Password', step: 'reset-password' },
  ]

  return (
    <div className="fixed top-4 left-4 z-50">
      {isExpanded ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 space-y-2 min-w-40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Dev Navigation</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <span className="text-slate-500">×</span>
            </Button>
          </div>
          {steps.map(({ label, step }) => (
            <Button
              key={step}
              variant="ghost"
              size="sm"
              onClick={() => {
                onStepChange(step)
                setIsExpanded(false)
              }}
              className="w-full justify-start text-left h-8 px-2 text-sm hover:bg-blue-50 hover:text-blue-700"
            >
              {label}
            </Button>
          ))}
        </div>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white rounded-lg p-2 shadow-lg hover:bg-blue-700 transition-all duration-200 w-10 h-10 flex items-center justify-center"
        >
          <ArrowRight size={16} />
        </Button>
      )}
    </div>
  )
}