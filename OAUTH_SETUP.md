# OAuth2 Setup Instructions

## Discord OAuth2 Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "Seller Services"
3. Go to "OAuth2" → "General"
4. Copy your **Client ID** and **Client Secret**
5. Add redirect URI: `http://localhost:3000/auth/discord/callback`
6. Under "OAuth2" → "URL Generator":
   - Scopes: `identify`, `email`
   - Copy the generated URL for testing

## Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API and Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Application type: "Web application"
6. Name: "Seller Services"
7. Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
8. Copy your **Client ID** and **Client Secret**

## Required Scopes

### Discord
- `identify` - Access to user's Discord tag, avatar, and ID
- `email` - Access to user's email address

### Google
- `openid` - OpenID Connect
- `email` - Access to user's email address
- `profile` - Access to user's basic profile information

## Environment Variables Needed

```bash
# Discord
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback

# Google
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

## Testing URLs

Once configured, test your OAuth flows:

- Discord: `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email`
- Google: `https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=openid+email+profile`

## Security Notes

- Never commit your `.env` file to version control
- Use test/development keys for local development
- Set up separate OAuth apps for production with production URLs
- Always validate and sanitize OAuth callback data
- Implement proper CSRF protection for OAuth flows