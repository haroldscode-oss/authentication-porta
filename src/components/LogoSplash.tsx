import { motion } from "framer-motion"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

interface LogoSplashProps {
  onComplete: () => void
}

export function LogoSplash({ onComplete }: LogoSplashProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-background to-muted/30 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ 
        duration: 0.8, 
        delay: 2.8,
        ease: [0.4, 0, 0.2, 1]
      }}
      onAnimationComplete={() => setTimeout(onComplete, 100)}
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: 20 }}
        animate={{ 
          scale: [0.3, 1.05, 1], 
          opacity: [0, 1, 1], 
          y: [20, -5, 0]
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.46, 0.45, 0.94],
          times: [0, 0.6, 1]
        }}
        className="relative"
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.8, 1.6], 
            opacity: [0, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2.5, 
            delay: 0.2,
            ease: "easeOut",
            times: [0, 0.4, 1]
          }}
        />
        
        {/* Inner pulse effect */}
        <motion.div
          className="absolute inset-0 bg-primary/10 rounded-full blur-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.3, 1.1], 
            opacity: [0, 0.8, 0.4]
          }}
          transition={{ 
            duration: 1.5, 
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            times: [0, 0.5, 1]
          }}
        />
        
        {/* Logo with subtle bounce and glow */}
        <motion.div
          initial={{ filter: "brightness(0.8) contrast(1.1)" }}
          animate={{ 
            filter: ["brightness(0.8) contrast(1.1)", "brightness(1.1) contrast(1.2)", "brightness(1) contrast(1)"]
          }}
          transition={{
            duration: 1.8,
            delay: 0.3,
            ease: "easeInOut",
            times: [0, 0.6, 1]
          }}
          className="relative z-10"
        >
          <motion.img 
            src={ssLogo} 
            alt="Seller Services Logo" 
            className="w-32 h-32 drop-shadow-2xl"
            initial={{ rotate: -10 }}
            animate={{ rotate: [-10, 5, 0] }}
            transition={{
              duration: 1.5,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.7, 1]
            }}
          />
        </motion.div>

        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [-10, -30, -50],
              x: [0, Math.sin(i) * 10, Math.sin(i) * 20]
            }}
            transition={{
              duration: 2,
              delay: 0.8 + i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}