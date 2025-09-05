# OAuth Development Notes

## Current OAuth Implementation

This implementation includes a complete OAuth flow for Google and Discord authentication. However, there are some important considerations for a frontend-only environment:

### CORS Limitations

1. **Token Exchange**: OAuth token exchange typically requires client secrets, which cannot be safely stored in frontend code. In a production environment, this should be handled by a backend service.

2. **Current Implementation**: The current code includes token exchange logic that may fail due to CORS restrictions when running in a browser environment.

### Development Setup

For development and testing, you have two options:

#### Option 1: Mock OAuth Flow (Recommended for Demo)
Replace the OAuth callback handling with a mock implementation that simulates successful authentication:

```typescript
// In AuthService.handleOAuthCallback
// Replace the actual token exchange with:
const mockProfile = {
  id: `mock_${provider}_${Date.now()}`,
  email: `user@example.com`,
  name: `Test User`,
  picture: undefined
}
```

#### Option 2: Proxy Setup
Set up a development proxy in your `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/oauth/': {
        target: 'https://oauth2.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oauth/, '')
      }
    }
  }
})
```

### Production Considerations

For production deployment:

1. **Backend Service**: Implement OAuth token exchange in a backend service
2. **Secure Storage**: Store client secrets server-side
3. **Session Management**: Use server-side session management
4. **API Routes**: Create dedicated API routes for OAuth callbacks

### Environment Variables

Make sure these are set in your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_DISCORD_CLIENT_ID=your_discord_client_id  
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

Note: Client secrets prefixed with `GOOGLE_CLIENT_SECRET` and `DISCORD_CLIENT_SECRET` (without `VITE_`) are used server-side and won't be exposed to the browser.

### Testing OAuth

1. **Google Console**: Set up OAuth2 credentials with redirect URI: `http://localhost:5173/auth/callback/google`
2. **Discord Applications**: Set up application with redirect URI: `http://localhost:5173/auth/callback/discord`

The OAuth buttons will redirect to the respective providers and attempt to complete the flow. If CORS errors occur, consider implementing the mock flow option above.