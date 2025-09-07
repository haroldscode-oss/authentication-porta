import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Toaster } from "@/components/ui/sonner"
import { LogoSplash } from "@/components/LogoSplash"
import { AuthCard } from "@/components/AuthCard"
import { Marketplace } from "@/components/Marketplace"

type AppState = 'splash' | 'auth' | 'marketplace'

function App() {
  const [appState, setAppState] = useState<AppState>('splash')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      // Skip animation for users who prefer reduced motion
      setTimeout(() => {
        setAppState('auth')
        setIsReady(true)
      }, 100)
    } else {
      // Normal animation flow
      setIsReady(true)
    }
  }, [])

  const handleSplashComplete = () => {
    setAppState('auth')
  }

  const handleAuthComplete = () => {
    setAppState('marketplace')
  }

  if (!isReady) {
    return null
  }

  return (
    <div style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }} className="bg-background text-foreground">
      <AnimatePresence mode="wait">
        {appState === 'splash' && (
          <LogoSplash key="splash" onComplete={handleSplashComplete} />
        )}
        {appState === 'auth' && (
          <AuthCard key="auth" onComplete={handleAuthComplete} />
        )}
        {appState === 'marketplace' && (
          <Marketplace key="marketplace" />
        )}
      </AnimatePresence>
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App