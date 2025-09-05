import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'

interface OAuthCallbackProps {
  provider: 'google' | 'discord'
}

export function OAuthCallback({ provider }: OAuthCallbackProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const { handleOAuthCallback } = useAuth()

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const state = urlParams.get('state')
        const error = urlParams.get('error')

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state')
        }

        // Use the auth context to handle the callback
        const result = await handleOAuthCallback({
          code,
          state,
          provider
        })

        if (!result.success) {
          throw new Error(result.error || 'Authentication failed')
        }

        setStatus('success')
        
        // Show success message
        const action = result.action === 'registered' ? 'Account created' : 'Signed in'
        toast.success(`${action} successfully with ${provider}!`)
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)

      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        toast.error(error instanceof Error ? error.message : 'Authentication failed')
        
        // Redirect back to login after delay
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      }
    }

    processCallback()
  }, [provider, handleOAuthCallback])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <div className="mb-6">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Completing sign in...
              </h2>
              <p className="text-muted-foreground">
                Authenticating with {provider === 'google' ? 'Google' : 'Discord'}
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Sign in successful!
              </h2>
              <p className="text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Authentication failed
              </h2>
              <p className="text-muted-foreground">
                Redirecting back to sign in...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}