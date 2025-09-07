# Setup Instructions for OAuth2 Authentication

## Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API or Google Sign-In API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
7. Copy the Client ID and Client Secret to your .env file

## Discord OAuth2 Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "OAuth2" tab
4. Copy the Client ID and Client Secret
5. Add redirect URIs:
   - `http://localhost:3000/auth/discord/callback` (development)
   - `https://yourdomain.com/auth/discord/callback` (production)
6. Under "Scopes", select "identify" and "email"

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual OAuth2 credentials in the `.env` file

3. For production, update the redirect URIs and APP_URL to match your domain

## Required OAuth2 Scopes

### Google:
- `openid` - Basic authentication
- `profile` - User's basic profile info
- `email` - User's email address

### Discord:
- `identify` - Basic user info
- `email` - User's email address

## Security Notes

- Never commit your `.env` file to version control
- Use strong, random values for SESSION_SECRET and JWT_SECRET
- In production, use HTTPS for all redirect URIs
- Regularly rotate your OAuth2 secrets