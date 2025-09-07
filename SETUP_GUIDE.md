# Complete Setup Guide for Seller Services Authentication App

This guide will help you clone and run this project locally on your desktop IDE.

## Prerequisites

Before you start, make sure you have the following installed on your computer:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

3. **A Code Editor/IDE**
   - VS Code (recommended): https://code.visualstudio.com/
   - Or any other IDE of your choice

## Step 1: Clone the Repository

1. Open your terminal/command prompt
2. Navigate to where you want to store the project:
   ```bash
   cd Desktop  # or wherever you want the project
   ```

3. Clone this repository:
   ```bash
   git clone [YOUR_REPO_URL]
   cd spark-template
   ```

## Step 2: Install Dependencies

1. Make sure you're in the project directory:
   ```bash
   pwd  # Should show path ending with /spark-template
   ```

2. Install all required packages:
   ```bash
   npm install
   ```

   This will install:
   - React 18
   - TypeScript
   - Vite (build tool)
   - Tailwind CSS
   - Framer Motion (animations)
   - Shadcn UI components
   - And other dependencies

## Step 3: Set Up Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   touch .env  # On Windows: echo. > .env
   ```

2. Add your OAuth credentials to the `.env` file:
   ```env
   # Google OAuth2
   GOOGLE_CLIENT_ID="91900634879-i3ve94lp105k4jick85j3c2c32m3bmnl.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="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"
   GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

   # Discord OAuth2 (you'll need to get these)
   DISCORD_CLIENT_ID="your_discord_client_id"
   DISCORD_CLIENT_SECRET="your_discord_client_secret"
   DISCORD_REDIRECT_URI="http://localhost:3000/auth/discord/callback"

   # App Configuration
   NODE_ENV="development"
   VITE_APP_URL="http://localhost:3000"
   ```

## Step 4: Verify Project Structure

Your project should look like this:
```
spark-template/
├── public/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   └── ui/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── .env
```

## Step 5: Start the Development Server

1. Run the development server:
   ```bash
   npm run dev
   ```

2. You should see output like:
   ```
   VITE v5.x.x ready in xxxms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

3. Open your browser and go to: `http://localhost:5173/`

## Step 6: Test the Application

The app includes these test credentials for development:

- **Existing Discord user**: `exist@discord.com`
- **Existing Google user**: `exist@gmail.com`  
- **Existing regular user**: `exist@example.com`
- **New user**: `new@example.com`

### Test Flow:
1. Start at splash screen with SS logo animation
2. Enter one of the test emails
3. Follow the authentication flow
4. Complete onboarding for new users
5. Access the marketplace

## Step 7: Understanding the Tech Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling

### UI Components
- **Shadcn UI** components (pre-installed in `/src/components/ui/`)
- **Framer Motion** for smooth animations
- **Phosphor Icons** for icons

### Styling System
- **Tailwind CSS v3.x** with custom theme
- CSS custom properties for consistent colors
- Responsive design with mobile-first approach

## Step 8: Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Step 9: Development Tips

### Hot Reload
- Changes to `.tsx`, `.ts`, `.css` files will auto-reload
- Changes to `index.html` require manual refresh

### Component Structure
- Main app logic: `src/App.tsx`
- Authentication: `src/components/AuthCard.tsx`
- Marketplace: `src/components/Marketplace.tsx`
- UI components: `src/components/ui/`

### Styling
- Global styles: `src/index.css`
- Theme colors defined in CSS custom properties
- Use Tailwind classes for component styling

### Assets
- Images: `src/assets/images/`
- Import assets using: `import image from '@/assets/images/file.png'`

## Step 10: Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill  # macOS/Linux
   netstat -ano | findstr :5173  # Windows
   ```

2. **Dependencies not installing**:
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**:
   ```bash
   # Check for type errors
   npm run type-check
   ```

4. **Build errors**:
   ```bash
   # Try building to see production errors
   npm run build
   ```

### Environment Variables Not Working:
- Make sure `.env` is in the root directory
- Restart the dev server after changing `.env`
- Environment variables must start with `VITE_` to be accessible in frontend

## Step 11: Production Deployment

When ready to deploy:

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the production-ready files

3. Deploy to platforms like:
   - Vercel: `npm i -g vercel && vercel`
   - Netlify: Drag `dist/` folder to netlify.com
   - GitHub Pages: Use GitHub Actions

## Project Features

✅ **Splash screen** with logo animation  
✅ **Authentication flow** with OAuth2 support  
✅ **Email/password** authentication  
✅ **Password reset** via email/SMS  
✅ **User onboarding** with role selection  
✅ **Marketplace interface** with service categories  
✅ **Responsive design** for all devices  
✅ **Smooth animations** throughout  
✅ **Type-safe** TypeScript implementation  

## Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure environment variables are set correctly
4. Make sure Node.js version is compatible (16+)

---

**Happy coding! 🚀**