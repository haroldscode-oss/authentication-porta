import { motion } from "framer-motion"
import ssLogo from "@/assets/images/ss-logo.svg"

interface LogoSplashProps {
  onComplete: () => void
}

export function LogoSplash({ onComplete }: LogoSplashProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-background flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      onAnimationComplete={() => setTimeout(onComplete, 500)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 bg-primary/5 rounded-full blur-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ 
            duration: 1, 
            delay: 0.3,
            ease: "easeOut"
          }}
        />
        <img 
          src={ssLogo} 
          alt="SS Logo" 
          className="w-32 h-32 relative z-10"
        />
      </motion.div>
    </motion.div>
  )
}