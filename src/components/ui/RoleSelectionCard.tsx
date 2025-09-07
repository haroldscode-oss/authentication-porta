import { motion } from 'framer-motion'
import { Store, ShoppingBag } from '@phosphor-icons/react'

export type UserRole = 'buyer' | 'seller'

interface RoleSelectionCardProps {
  selectedRole: UserRole | null
  onRoleSelect: (role: UserRole) => void
}

export function RoleSelectionCard({ selectedRole, onRoleSelect }: RoleSelectionCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Buyer Card */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onRoleSelect('buyer')}
        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
          selectedRole === 'buyer'
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            selectedRole === 'buyer' ? 'bg-blue-500' : 'bg-gray-100'
          }`}>
            <ShoppingBag 
              className={`w-6 h-6 ${
                selectedRole === 'buyer' ? 'text-white' : 'text-gray-600'
              }`} 
            />
          </div>
          <div>
            <h3 className={`font-semibold ${
              selectedRole === 'buyer' ? 'text-blue-900' : 'text-gray-900'
            }`}>
              Buyer
            </h3>
            <p className={`text-sm ${
              selectedRole === 'buyer' ? 'text-blue-700' : 'text-gray-600'
            }`}>
              Find services
            </p>
          </div>
        </div>
      </motion.button>

      {/* Seller Card */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onRoleSelect('seller')}
        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
          selectedRole === 'seller'
            ? 'border-green-500 bg-green-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            selectedRole === 'seller' ? 'bg-green-500' : 'bg-gray-100'
          }`}>
            <Store 
              className={`w-6 h-6 ${
                selectedRole === 'seller' ? 'text-white' : 'text-gray-600'
              }`} 
            />
          </div>
          <div>
            <h3 className={`font-semibold ${
              selectedRole === 'seller' ? 'text-green-900' : 'text-gray-900'
            }`}>
              Seller
            </h3>
            <p className={`text-sm ${
              selectedRole === 'seller' ? 'text-green-700' : 'text-gray-600'
            }`}>
              Offer services
            </p>
          </div>
        </div>
      </motion.button>
    </div>
  )
}