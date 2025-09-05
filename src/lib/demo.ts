// Demo data for testing authentication system
// This file creates some test users for demonstration purposes

import { AuthService } from './auth/service'

export async function createDemoData() {
  const authService = AuthService.getInstance()
  
  // Create a demo user for testing
  try {
    const existingUser = await authService.getUserByEmail('demo@sellerservices.com')
    if (!existingUser) {
      const demoUser = await authService.createUser({
        email: 'demo@sellerservices.com',
        name: 'Demo User'
      })
      
      // Set a demo password (password123)
      await authService.setUserPassword(demoUser.id, 'password123')
      
      console.log('Demo user created: demo@sellerservices.com / password123')
    }
  } catch (error) {
    console.log('Demo data already exists or error creating demo data')
  }
}

// Automatically create demo data when this module is imported
// Commented out to prevent automatic execution
// createDemoData()

export const DEMO_CREDENTIALS = {
  email: 'demo@sellerservices.com',
  password: 'password123'
}