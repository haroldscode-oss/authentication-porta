import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Storefront, Users, TrendingUp } from '@phosphor-icons/react'

export type UserRole = 'buyer' | 'seller' | null

interface RoleSelectionCardProps {
  onRoleSelect: (role: UserRole) => void
  onSkip: () => void
}

const roleOptions = [
  {
    id: 'buyer' as const,
    title: 'I want to buy',
    description: 'Browse and purchase products from verified sellers',
    icon: <ShoppingBag size={32} />,
    color: 'blue',
    features: ['Browse products', 'Secure checkout', 'Order tracking', 'Customer support']
  },
  {
    id: 'seller' as const,
    title: 'I want to sell',
    description: 'List products and reach thousands of potential buyers',
    icon: <Storefront size={32} />,
    color: 'green',
    features: ['List products', 'Manage inventory', 'Track sales', 'Seller analytics']
  }
]

export function RoleSelectionCard({ onRoleSelect, onSkip }: RoleSelectionCardProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex items-center justify-center p-6"
    >
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Choose your role
            </h2>
            <p className="text-gray-600">
              How would you like to use Seller Services?
            </p>
          </div>

          {/* Role Options */}
          <div className="space-y-4 mb-8">
            {roleOptions.map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
                  ${selectedRole === role.id
                    ? role.color === 'blue'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {/* Selection indicator */}
                {selectedRole === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center
                      ${role.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}
                    `}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${role.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}
                  `}>
                    {role.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {role.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`
                            w-1.5 h-1.5 rounded-full
                            ${role.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'}
                          `} />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`
                px-6 py-2 rounded-xl font-medium transition-all duration-200 text-white
                ${selectedRole
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              Continue
            </Button>
          </div>

          {/* Alternative option */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              You can change your role anytime in settings
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}