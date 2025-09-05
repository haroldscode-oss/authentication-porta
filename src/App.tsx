import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Toaster } from "@/components/ui/sonner"
import { LogoSplash } from "@/components/LogoSplash"
import { AuthCard } from "@/components/AuthCard"

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      // Skip animation for users who prefer reduced motion
      setTimeout(() => {
        setShowSplash(false)
        setIsReady(true)
      }, 100)
    } else {
      // Normal animation flow
      setIsReady(true)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (!isReady) {
    return null
  }

  return (
    <div style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }} className="bg-background text-foreground">>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <LogoSplash key="splash" onComplete={handleSplashComplete} />
        ) : (
          <AuthCard key="auth" />
        )}
      </AnimatePresence>
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App