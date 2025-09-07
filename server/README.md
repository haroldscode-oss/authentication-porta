# OAuth Backend Setup Guide

This backend provides OAuth authentication for Google and Discord using Express.js and Passport.js.

## Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure your .env file** with your OAuth credentials:
   ```bash
   # Google OAuth (already configured)
   GOOGLE_CLIENT_ID=91900634879-i3ve94lp105k4jick85j3c2c32m3bmnl.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   
   # Discord OAuth (add your credentials)
   DISCORD_CLIENT_ID=your_discord_app_id_here
   DISCORD_CLIENT_SECRET=your_discord_client_secret_here
   ```

3. **Start the servers**:
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately:
   npm run dev          # Frontend (port 5173)
   npm run server:dev   # Backend (port 3001)
   ```

## OAuth Provider Setup

### Google OAuth Setup ✅ (Already Configured)
Your Google OAuth is already set up with the provided credentials.

### Discord OAuth Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "OAuth2" section
4. Add redirect URI: `http://localhost:3001/auth/discord/callback`
5. Copy your Client ID and Client Secret to `.env`

## API Endpoints

The backend server (port 3001) provides these endpoints:

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/discord` - Initiate Discord OAuth  
- `GET /auth/discord/callback` - Discord OAuth callback
- `GET /auth/user` - Get current authenticated user
- `POST /auth/logout` - Logout user
- `GET /health` - Health check

## Frontend Integration

The frontend includes an OAuth utility (`src/lib/oauth.ts`) with these functions:

```typescript
import { oauth } from '@/lib/oauth';

// Login with providers
oauth.loginWithGoogle();
oauth.loginWithDiscord();

// Check authentication
const isLoggedIn = oauth.isAuthenticated();
const user = oauth.getCurrentUser();

// Logout
await oauth.logout();
```

## Testing OAuth Flow

1. Start both servers with `npm run dev:full`
2. Open http://localhost:5173 in your browser
3. Click "Continue with Google" or "Continue with Discord"
4. Complete OAuth flow
5. You'll be redirected back to your app with user data

## Environment Variables

```bash
# Backend server
PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret

# OAuth providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3001/auth/discord/callback
```

## Security Notes

- Session data is stored server-side
- User data is temporarily stored in sessionStorage on frontend
- CORS is configured for localhost development
- In production, update URLs and use HTTPS
- Never commit real credentials to version control

## Troubleshooting

1. **CORS errors**: Check that FRONTEND_URL matches your frontend port
2. **OAuth errors**: Verify redirect URIs match in provider settings
3. **Port conflicts**: Ensure ports 5173 (frontend) and 3001 (backend) are available
4. **Missing credentials**: Check that OAuth provider credentials are set in .env

## Production Deployment

For production:
1. Update all URLs to use your domain
2. Use HTTPS for all OAuth redirect URIs
3. Set `NODE_ENV=production`
4. Use a secure session secret
5. Configure proper CORS settings
6. Set up a production database for user sessions