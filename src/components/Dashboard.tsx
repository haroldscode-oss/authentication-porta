import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { LogOut, User } from "@phosphor-icons/react"
import ssLogo from "@/assets/images/Seller_Services_Logo.png"

export function Dashboard() {
  const { user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={ssLogo} alt="Seller Services" className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Seller Services</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User size={16} />
                <span>{user?.email}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
                disabled={isLoading}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mb-6">
              <img 
                src={ssLogo} 
                alt="Seller Services" 
                className="h-16 w-16 mx-auto mb-4 opacity-80"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Seller Services!
              </h2>
              <p className="text-gray-600">
                You've successfully authenticated. Your dashboard is ready.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-blue-600 text-2xl font-bold mb-2">📊</div>
                <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">View your sales performance</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-green-600 text-2xl font-bold mb-2">📦</div>
                <h3 className="font-semibold text-gray-900 mb-1">Products</h3>
                <p className="text-sm text-gray-600">Manage your inventory</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="text-purple-600 text-2xl font-bold mb-2">💰</div>
                <h3 className="font-semibold text-gray-900 mb-1">Revenue</h3>
                <p className="text-sm text-gray-600">Track your earnings</p>
              </div>
            </div>

            {/* User Info Card */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <p className="text-sm text-green-600 bg-white px-3 py-2 rounded border">
                    ✓ Active
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <p className="text-sm text-gray-600 bg-white px-3 py-2 rounded border font-mono">
                    {user?.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}