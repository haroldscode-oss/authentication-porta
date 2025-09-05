# Backend Specification for Seller Services Authentication System

## Overview
Complete authentication system supporting OAuth (Google, Discord) and email/password authentication with secure session management and user profile handling.

## OAuth Configuration
**Redirect URI Base**: `https://authentication-porta--haroldscode-oss.github.app`

---

Landing page showcasi

- `GET /ass
### Auth

### Reques
// GET /
Status: 200

Status: 

```typescript

### Environment Vari
# Not require

- Validate asset file paths to prev


- Rate limiting for stat
### Rate Limits
- Home page: 60 r
###

### Tests
- Navigation 
- Authenticated user redirect works
###


- Page
- Asset load performance
###

- [ ] Responsi



User authent
### Routes
GET /auth/login - S
GET /auth/google - Initiate Googl

POST /auth/logo
```
### Auth

### Request/Resp
// POST /auth/login
  email: string;

  success
  message: string;
Status: 200 | 400 | 401
// GET /auth/google
Status: 302

Response: Redi

Response: Redirect to 


Status: 302 |
// POST /auth/logou
Status: 200
// GET /auth/session

}
```
### Data Models
interface User {
  email: string;
  avatar?: string;

  u

interface Session {

  expiresAt
  ipAddress: string;


```
DATABASE_URL=postgresql://user:pas
# Session Management
SESSION_DURATION=7d
# Google OAuth
GOOGLE_CLIENT_SECRET=google-oauth-client-sec

DISCORD_CLIENT_ID=discord-oauth
DISCORD_REDIRECT_URI=https://authenticat
# S

# Rate L
```
### Validation

  email: z.string().
};
// OAuth state vali
```
### Security
- Secure session co
-
- Rate limi

- Login attemp
- Session checks: 

- User creation on firs


```typescript
- Password 


- Email/password login flow
- Discord OAuth complete flow
- Logout function

// E2E Tests
- Cross-browser compatibility
```

- Invalid OAuth codes/states
- User denies OAuth permissions
- Session store unavailable
- Concurrent logi


- Login success/failure rates 
- Session d

- Error rates and ty
### Done Cri
- [ ] Google OAuth integra
- [ ] Session 
-
- [ ] Valid
- [

## 3. Dashboard
### Purpose

```
GET /api/user/pr
GET /api/user/s
```
### Auth
- Redirect unauthentic
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress: string;
  userAgent: string;
}
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Session Management
SESSION_SECRET=random-256-bit-secret
SESSION_DURATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=google-oauth-client-id
GOOGLE_CLIENT_SECRET=google-oauth-client-secret
GOOGLE_REDIRECT_URI=https://authentication-porta--haroldscode-oss.github.app/auth/google/callback

# Discord OAuth  
DISCORD_CLIENT_ID=discord-oauth-client-id
DISCORD_CLIENT_SECRET=discord-oauth-client-secret
DISCORD_REDIRECT_URI=https://authentication-porta--haroldscode-oss.github.app/auth/discord/callback

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://authentication-porta--haroldscode-oss.github.app

# Rate Limiting
REDIS_URL=redis://host:port (optional)
```

### Validation
```typescript
// Email/Password Login
const loginSchema = {
  email: z.string().email().max(255),
  password: z.string().min(6).max(128)
};

// OAuth state validation
const stateSchema = z.string().uuid().optional();
```

### Security
- CSRF protection via state parameter in OAuth
- Secure session cookies (httpOnly, secure, sameSite)
- Password hashing with bcrypt (12 rounds)
- SQL injection prevention with parameterized queries
- XSS protection with CSP headers
- Rate limiting per IP and per user
- Input sanitization and validation

### Rate Limits
- Login attempts: 5 per 15min per IP
- OAuth initiations: 10 per 5min per IP  
- Session checks: 100 per min per IP
- Account enumeration protection

### Side Effects
- User creation on first OAuth login
- Session creation/invalidation
- Login attempt logging
- Password reset token invalidation on successful login

### Tests
```typescript
// Unit Tests
- Password hashing/verification
- Session token generation/validation
- Input validation schemas
- OAuth state generation/verification

// Integration Tests  
- Email/password login flow
- Google OAuth complete flow
- Discord OAuth complete flow
- Session management
- Logout functionality
- Rate limiting behavior
- Error handling

// E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
```

### Edge Cases
- OAuth provider downtime
- Invalid OAuth codes/states
- Expired OAuth codes
- User denies OAuth permissions
- Database connection failure
- Session store unavailable
- Malformed OAuth responses
- Concurrent login attempts
- Password with special characters
- Email case sensitivity
- Unicode in user data

### Telemetry
- Login success/failure rates by provider
- OAuth conversion rates  
- Session duration metrics
- Geographic login patterns
- Device/browser analytics
- Performance metrics (response times)
- Error rates and types

### Done Criteria
- [ ] Email/password authentication works
- [ ] Google OAuth integration complete
- [ ] Discord OAuth integration complete  
- [ ] Session management functional
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Error handling comprehensive
- [ ] Validation prevents malicious input
- [ ] Tests cover all flows
- [ ] Telemetry collection active

---

## 3. Dashboard (`/dashboard`)

### Purpose
Protected user dashboard displaying account information and platform features.

### Routes
```
GET /dashboard - Serve dashboard page
GET /api/user/profile - Get user profile data
PUT /api/user/profile - Update user profile
GET /api/user/sessions - List active sessions
DELETE /api/user/sessions/:id - Revoke specific session
```

### Auth
- Authentication required via session validation
- Redirect unauthenticated users to `/auth/login`

### Request/Response
```typescript
// GET /dashboard
Response: HTML dashboard page
Status: 200 | 302 (redirect to login)

// GET /api/user/profile



```
Content-Security-Pol
X-Content-Type-Options:
```
#
- Credential rota


- Applicat
- Security event
- Resource usage 
### Deployment Req
-
- Dependenc









































































































































































