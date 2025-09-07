import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleSelectionCard, type UserRole } fro
export type RegistrationMethod = 'email' | 'discord' | 'google'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
      case 'discord':
 

        return <At size={24} color="#2563eb
  }
  const ge
      case 'discord':
      case 'google':
      case 'email':
      default:
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
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-cen
              </div>
          )
      ]
     
    
   
          
              <div classNam
              </div>
                <Star size={40} color="#ea580c" />
            </div>
        }
    case 'email':
        {
          titl
          icon: <At size={32} color="#2563eb" />,
            <div className="flex items-center justify-ce
              
            
     
    
   
      retu
}
  {
    title: "Browse & Discover",
    icon: <Shopping
      <div className="flex items-center justify-center gap-4">
          <ShoppingBag size={40} color="#9333ea" />
        <div className="w-20 h-20 bg-orange-100 rounded-
        </div>
    )
  {
    title: "St
    icon: <U
     
   
 

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
            <Button

              className="te
              Skip
          </div>
          {/* Conte

              initial={{ opacity:
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
              {/* 
                {currentS


              </h2>
              {/* Description */}
                {cu
            </motion.div>

          <div className="flex items-c
              variant="ghost"
              onClick={handlePrevious}
             
              <CaretLeft className="w-4 h-4" />
            </Butt
            <Button

              {curr
              ) : (
                  Continue
             
            </Button>
        </div>
    </motion.div>
}










