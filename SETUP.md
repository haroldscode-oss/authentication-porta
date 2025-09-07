# Seller Services Marketplace - Environment Setup Guide

## Quick Setup Checklist

### 🔐 Authentication Services

#### Google OAuth2
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

#### Discord OAuth2
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section
4. Add redirect URIs:
   - `http://localhost:3000/auth/discord/callback` (development)
   - `https://yourdomain.com/auth/discord/callback` (production)

### 📧 Email Service Setup

#### Gmail SMTP (Recommended for development)
1. Enable 2FA on your Gmail account
2. Generate an App Password
3. Use your Gmail and App Password in SMTP settings

#### SendGrid (Recommended for production)
1. Create account at [SendGrid](https://sendgrid.com/)
2. Generate API key
3. Verify your sender domain

### 📱 SMS Service Setup

#### Twilio (Recommended)
1. Create account at [Twilio](https://www.twilio.com/)
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Create a Verify Service for OTP

### 🗄️ Database Setup

#### PostgreSQL (Recommended)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb seller_services_db

# Create user
sudo -u postgres createuser -s your_username
```

### 🚀 Required Environment Variables (Minimum)

For basic functionality, you need:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/seller_services_db"

# JWT
JWT_SECRET="your-super-secure-32-character-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Email (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# App Config
NODE_ENV="development"
PORT="3000"
BASE_URL="http://localhost:3000"
```

### 🔧 Backend API Routes Structure

Your backend should implement these routes:

```
Authentication Routes:
POST   /api/auth/register           - Email/password registration
POST   /api/auth/login              - Email/password login
POST   /api/auth/logout             - Logout user
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset-password     - Reset password with token
POST   /api/auth/verify-email       - Verify email with token
POST   /api/auth/resend-verification - Resend verification email

OAuth Routes:
GET    /auth/google                 - Initiate Google OAuth
GET    /auth/google/callback        - Google OAuth callback
GET    /auth/discord                - Initiate Discord OAuth
GET    /auth/discord/callback       - Discord OAuth callback

SMS/Phone Routes:
POST   /api/auth/send-sms-code      - Send SMS verification code
POST   /api/auth/verify-sms-code    - Verify SMS code
POST   /api/auth/verify-phone       - Verify phone number

User Routes:
GET    /api/user/profile            - Get user profile
PUT    /api/user/profile            - Update user profile
POST   /api/user/upload-avatar      - Upload profile picture

Marketplace Routes:
GET    /api/services                - Get all services
GET    /api/services/:id            - Get service by ID
POST   /api/services                - Create new service (sellers only)
PUT    /api/services/:id            - Update service (owner only)
DELETE /api/services/:id            - Delete service (owner only)

Category Routes:
GET    /api/categories              - Get all categories
GET    /api/categories/:id/services - Get services by category

Order Routes:
POST   /api/orders                  - Create new order
GET    /api/orders                  - Get user's orders
GET    /api/orders/:id              - Get order details
PUT    /api/orders/:id/status       - Update order status

Search Routes:
GET    /api/search/services         - Search services
GET    /api/search/users            - Search users
```

### 🛡️ Security Best Practices

1. **Never commit .env file** - Add to .gitignore
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS in production**
4. **Set up CORS properly**
5. **Use rate limiting**
6. **Validate all inputs**
7. **Sanitize user data**

### 📝 Installation Steps

1. Copy `.env.example` to `.env`
2. Fill in your actual credentials
3. Install dependencies: `npm install`
4. Set up database: `npm run db:migrate`
5. Start development server: `npm run dev`

### 🔍 Testing Credentials

For testing the frontend flow without backend:
- `exist@example.com` - Existing user (goes to password)
- `new@example.com` - New user (goes to signup)
- `exist@discord.com` - Discord OAuth user
- `exist@gmail.com` - Google OAuth user