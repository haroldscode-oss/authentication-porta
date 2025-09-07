// OAuth utility functions for frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface OAuthUser {
  id: string;
  provider: 'google' | 'discord';
  email: string;
  name: string;
  avatar?: string;
}

export const oauth = {
  // Initiate Google OAuth
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Initiate Discord OAuth
  loginWithDiscord: () => {
    window.location.href = `${API_BASE_URL}/auth/discord`;
  },

  // Handle OAuth callback (called from success page)
  handleCallback: (): OAuthUser | null => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    
    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        // Store user in sessionStorage for the session
        sessionStorage.setItem('oauth_user', JSON.stringify(user));
        return user;
      } catch (error) {
        console.error('Failed to parse OAuth user data:', error);
        return null;
      }
    }
    
    return null;
  },

  // Get current OAuth user from session
  getCurrentUser: (): OAuthUser | null => {
    try {
      const userString = sessionStorage.getItem('oauth_user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Failed to get current OAuth user:', error);
      return null;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear local session data
      sessionStorage.removeItem('oauth_user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return oauth.getCurrentUser() !== null;
  }
};

// Auto-handle OAuth success callback on page load
if (typeof window !== 'undefined') {
  const handleOAuthSuccess = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('provider') && urlParams.get('user')) {
      const user = oauth.handleCallback();
      if (user) {
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Trigger a custom event that components can listen to
        window.dispatchEvent(new CustomEvent('oauth-success', { 
          detail: { user, provider: user.provider } 
        }));
      }
    }
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleOAuthSuccess);
  } else {
    handleOAuthSuccess();
  }
}