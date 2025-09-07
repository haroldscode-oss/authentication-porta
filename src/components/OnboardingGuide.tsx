import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ShoppingBag, Store, Users, Star } from 'lucide-react'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  illustration: React.ReactNode
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Seller Services",
    description: "Your one-stop marketplace for connecting sellers and buyers. Start your journey today.",
    icon: <Store className="w-8 h-8 text-blue-600" />,
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
    description: "Explore thousands of products from verified sellers. Find exactly what you're looking for.",
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
    title: "Start Selling",
    description: "Ready to become a seller? List your products and reach thousands of potential buyers.",
    icon: <Users className="w-8 h-8 text-purple-600" />,
    illustration: (
      <div className="flex items-center justify-center gap-4">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Store className="w-10 h-10 text-blue-600" />
        </div>
        <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center">
          <Star className="w-10 h-10 text-yellow-600" />
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Trusted Community",
    description: "Join a trusted marketplace with verified sellers, secure payments, and excellent support.",
    icon: <Star className="w-8 h-8 text-yellow-600" />,
    illustration: (
      <div className="flex items-center justify-center gap-4">
        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
          <Users className="w-10 h-10 text-green-600" />
        </div>
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Star className="w-10 h-10 text-blue-600" />
        </div>
      </div>
    )
  }
]

interface OnboardingGuideProps {
  onComplete: () => void
}

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
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

  const currentStepData = onboardingSteps[currentStep]

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
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}