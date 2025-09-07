import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CaretLeft, CaretRight, ShoppingBag, Storefront, Users, Star, DiscordLogo, GoogleLogo, At } from '@phosphor-icons/react'
import { RoleSelectionCard, type UserRole } from './RoleSelectionCard'

export type RegistrationMethod = 'email' | 'discord' | 'google'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  illustration: React.ReactNode
}

// Get customized welcome step based on registration method
const getWelcomeStep = (registrationMethod?: RegistrationMethod, userEmail?: string): OnboardingStep => {
  const getRegistrationIcon = () => {
    switch (registrationMethod) {
      case 'discord':
        return <DiscordLogo size={24} color="#5865F2" />
      case 'google':
        return <GoogleLogo size={24} color="#4285F4" />
      case 'email':
      default:
        return <At size={24} color="#2563eb" />
    }
  }

  const getWelcomeMessage = () => {
    switch (registrationMethod) {
      case 'discord':
        return `Welcome! We've connected your Discord account ${userEmail ? `(${userEmail})` : ''} to Seller Services. You're now part of our gaming and community marketplace.`
      case 'google':
        return `Welcome! We've connected your Google account ${userEmail ? `(${userEmail})` : ''} to Seller Services. Your marketplace journey starts here.`
      case 'email':
        return `Welcome! You've successfully created your account ${userEmail ? `with ${userEmail}` : ''}. Ready to explore our marketplace?`
      default:
        return "Welcome to Seller Services! Your one-stop marketplace for connecting sellers and buyers. Let's get you started."
    }
  }

  return {
    id: 1,
    title: "Welcome to Seller Services",
    description: getWelcomeMessage(),
    icon: <Storefront size={32} color="#2563eb" />,
    illustration: (
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Storefront size={40} color="#2563eb" />
        </div>
        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
          <Users size={40} color="#16a34a" />
        </div>
        {registrationMethod && (
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-gray-200 absolute translate-x-16 translate-y-8">
            {getRegistrationIcon()}
          </div>
        )}
      </div>
    )
  }
}
// Get customized secondary steps based on registration method
const getRegistrationSpecificSteps = (registrationMethod?: RegistrationMethod): OnboardingStep[] => {
  switch (registrationMethod) {
    case 'discord':
      return [
        {
          id: 5,
          title: "Discord Integration",
          description: "Your Discord profile is connected! Use your Discord identity to build trust with other gamers and tech enthusiasts in our community.",
          icon: <DiscordLogo size={32} color="#5865F2" />,
          illustration: (
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center">
                <DiscordLogo size={40} color="#5865F2" />
              </div>
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
                <Users size={40} color="#16a34a" />
              </div>
            </div>
          )
        }
      ]
    case 'google':
      return [
        {
          id: 6,
          title: "Google Connected",
          description: "Your Google account is linked! Enjoy seamless access and sync your preferences across all your devices in our marketplace.",
          icon: <GoogleLogo size={32} color="#4285F4" />,
          illustration: (
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
                <GoogleLogo size={40} color="#4285F4" />
              </div>
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Star size={40} color="#ea580c" />
              </div>
            </div>
          )
        }
      ]
    case 'email':
      return [
        {
          id: 7,
          title: "Email Verified",
          description: "Your email is confirmed! Stay updated with order notifications, seller updates, and exclusive marketplace offers.",
          icon: <At size={32} color="#2563eb" />,
          illustration: (
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
                <At size={40} color="#2563eb" />
              </div>
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
                <Star size={40} color="#16a34a" />
              </div>
            </div>
          )
        }
      ]
    default:
      return []
  }
}
const onboardingSteps: OnboardingStep[] = [
  {
    id: 2,
    title: "Browse & Discover",
    description: "Explore thousands of products from verified sellers. Find exactly what you're looking for.",
    icon: <ShoppingBag size={32} color="#16a34a" />,
    illustration: (
      <div className="flex items-center justify-center gap-4">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center">
          <ShoppingBag size={40} color="#9333ea" />
        </div>
        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center">
          <Star size={40} color="#ea580c" />
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Start Selling",
    description: "Ready to become a seller? List your products and reach thousands of potential buyers.",
    icon: <Users size={32} color="#9333ea" />,
    illustration: (
      <div className="flex items-center justify-center gap-4">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Storefront size={40} color="#2563eb" />
        </div>
        <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center">
          <Star size={40} color="#ca8a04" />
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Trusted Community",
    description: "Join a trusted marketplace with verified sellers, secure payments, and excellent support.",
    icon: <Star size={32} color="#ca8a04" />,
    illustration: (
      <div className="flex items-center justify-center gap-4">
        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
          <Users size={40} color="#16a34a" />
        </div>
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Star size={40} color="#2563eb" />
        </div>
      </div>
    )
  }
]

const getBuyerSteps = (registrationMethod?: RegistrationMethod, userEmail?: string): OnboardingStep[] => {
  const baseSteps = [
    getWelcomeStep(registrationMethod, userEmail), // Customized welcome
    onboardingSteps[0], // Browse & Discover
    onboardingSteps[2]  // Trusted Community
  ]
  
  // Insert registration-specific step after welcome
  const specificSteps = getRegistrationSpecificSteps(registrationMethod)
  if (specificSteps.length > 0) {
    baseSteps.splice(1, 0, ...specificSteps)
  }
  
  return baseSteps
}

const getSellerSteps = (registrationMethod?: RegistrationMethod, userEmail?: string): OnboardingStep[] => {
  const baseSteps = [
    getWelcomeStep(registrationMethod, userEmail), // Customized welcome
    onboardingSteps[1], // Start Selling
    onboardingSteps[2]  // Trusted Community
  ]
  
  // Insert registration-specific step after welcome
  const specificSteps = getRegistrationSpecificSteps(registrationMethod)
  if (specificSteps.length > 0) {
    baseSteps.splice(1, 0, ...specificSteps)
  }
  
  return baseSteps
}

const getDefaultSteps = (registrationMethod?: RegistrationMethod, userEmail?: string): OnboardingStep[] => {
  const baseSteps = [
    getWelcomeStep(registrationMethod, userEmail), // Customized welcome
    ...onboardingSteps // All other steps
  ]
  
  // Insert registration-specific step after welcome
  const specificSteps = getRegistrationSpecificSteps(registrationMethod)
  if (specificSteps.length > 0) {
    baseSteps.splice(1, 0, ...specificSteps)
  }
  
  return baseSteps
}

interface OnboardingGuideProps {
  onComplete: () => void
  registrationMethod?: RegistrationMethod
  userEmail?: string
}

export function OnboardingGuide({ onComplete, registrationMethod, userEmail }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(-1) // Start with role selection (-1)
  const [userRole, setUserRole] = useState<UserRole>(null)

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role)
    setCurrentStep(0) // Move to first onboarding step
  }

  const handleRoleSkip = () => {
    setCurrentStep(0) // Move to first onboarding step without selecting role
  }

  // Get appropriate steps based on user role with customized content
  const getStepsForRole = () => {
    switch (userRole) {
      case 'buyer':
        return getBuyerSteps(registrationMethod, userEmail)
      case 'seller':
        return getSellerSteps(registrationMethod, userEmail)
      default:
        return getDefaultSteps(registrationMethod, userEmail)
    }
  }

  const currentSteps = getStepsForRole()

  const handleNext = () => {
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentStepData = currentSteps[currentStep]

  // Show role selection first
  if (currentStep === -1) {
    return (
      <RoleSelectionCard 
        onRoleSelect={handleRoleSelect}
        onSkip={handleRoleSkip}
      />
    )
  }

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
              {currentSteps.map((_, index) => (
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
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                {currentStepData.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-0"
            >
              <CaretLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
            >
              {currentStep === currentSteps.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Continue
                  <CaretRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}