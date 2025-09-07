import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleSelectionCard, type UserRole } from './ui/RoleSelectionCard'
import { Button } from '@/components/ui/button'
import { CaretLeft, Users, ShoppingBag, Star, Store, At, Phone, MessageSquare } from '@phosphor-icons/react'

export type RegistrationMethod = 'email' | 'discord' | 'google'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  illustration: React.ReactNode
}

function getOnboardingSteps(registrationMethod: RegistrationMethod): OnboardingStep[] {
  const baseSteps = [
    {
      id: 1,
      title: "Choose Your Role",
      description: "Select whether you're here to buy or sell services. You can always change this later.",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      illustration: (
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Store className="w-10 h-10 text-blue-600" />
          </div>
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
            <Users className="w-10 h-10 text-green-600" />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Browse & Discover",
      description: "Explore thousands of services from verified sellers. Find exactly what you're looking for.",
      icon: <ShoppingBag className="w-8 h-8 text-green-600" />,
      illustration: (
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-purple-600" />
          </div>
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Star className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Start Trading",
      description: "Connect with professionals worldwide. Start buying or selling services today!",
      icon: <Star className="w-8 h-8 text-orange-600" />,
      illustration: (
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
            <Star className="w-10 h-10 text-green-600" />
          </div>
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      )
    }
  ]

  // Add method-specific welcome step at the beginning
  const welcomeStep = {
    id: 0,
    title: getWelcomeTitle(registrationMethod),
    description: getWelcomeDescription(registrationMethod),
    icon: getWelcomeIcon(registrationMethod),
    illustration: getWelcomeIllustration(registrationMethod)
  }

  return [welcomeStep, ...baseSteps]
}

function getWelcomeTitle(method: RegistrationMethod): string {
  switch (method) {
    case 'discord':
      return "Welcome Discord User!"
    case 'google':
      return "Welcome Google User!"
    case 'email':
      return "Welcome to Seller Services!"
    default:
      return "Welcome!"
  }
}

function getWelcomeDescription(method: RegistrationMethod): string {
  switch (method) {
    case 'discord':
      return "Great to have you here! Your Discord account is now connected to our marketplace."
    case 'google':
      return "Thanks for joining with Google! You're all set to start exploring our marketplace."
    case 'email':
      return "Welcome aboard! Your account has been created successfully."
    default:
      return "Let's get you started on your marketplace journey."
  }
}

function getWelcomeIcon(method: RegistrationMethod): React.ReactNode {
  switch (method) {
    case 'discord':
      return <MessageSquare className="w-8 h-8 text-indigo-600" />
    case 'google':
      return <At className="w-8 h-8 text-red-600" />
    case 'email':
      return <At className="w-8 h-8 text-blue-600" />
    default:
      return <Star className="w-8 h-8 text-blue-600" />
  }
}

function getWelcomeIllustration(method: RegistrationMethod): React.ReactNode {
  switch (method) {
    case 'discord':
      return (
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center">
            <MessageSquare className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
      )
    case 'google':
      return (
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center">
            <At className="w-12 h-12 text-red-600" />
          </div>
        </div>
      )
    case 'email':
      return (
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center">
            <At className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      )
    default:
      return (
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center">
            <Star className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      )
  }
}

interface OnboardingGuideProps {
  registrationMethod: RegistrationMethod
  onComplete: (userRole: UserRole) => void
}

export function OnboardingGuide({ registrationMethod, onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  
  const onboardingSteps = getOnboardingSteps(registrationMethod)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(selectedRole || 'buyer')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete('buyer') // Default to buyer if skipped
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const currentStepData = onboardingSteps[currentStep]
  const isRoleSelectionStep = currentStepData.id === 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {/* Header with skip button */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-blue-600 w-6'
                      : index < currentStep
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip
            </Button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Illustration */}
              <div className="mb-8">
                {currentStepData.illustration}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {currentStepData.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                {currentStepData.description}
              </p>

              {/* Role Selection Cards (only on step 1) */}
              {isRoleSelectionStep && (
                <div className="mb-8">
                  <RoleSelectionCard
                    selectedRole={selectedRole}
                    onRoleSelect={handleRoleSelect}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <CaretLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isRoleSelectionStep && !selectedRole}
              className="px-8"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                "Get Started"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}