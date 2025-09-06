import { motion } from "framer-motion"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

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
      transition={{ duration: 0.8, delay: 3.2, ease: "easeInOut" }}
      onAnimationComplete={() => setTimeout(onComplete, 800)}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.1, 0.25, 1],
          type: "tween"
        }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 bg-primary/5 rounded-full blur-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.8, opacity: 1 }}
          transition={{ 
            duration: 1.8, 
            delay: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        />
        <img 
          src={ssLogo} 
          alt="Seller Services Logo" 
          className="w-32 h-32 relative z-10"
        />
      </motion.div>
    </motion.div>
  )
}