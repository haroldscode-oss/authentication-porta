#!/bin/bash

# OAuth Backend Test Script
# This script verifies that all OAuth components are properly set up

echo "🔍 OAuth Backend Setup Verification"
echo "=================================="

# Check if server file exists
if [ -f "server/index.js" ]; then
    echo "✅ Server file exists: server/index.js"
else
    echo "❌ Server file missing: server/index.js"
fi

# Check if .env file exists and has required variables
if [ -f ".env" ]; then
    echo "✅ Environment file exists: .env"
    
    # Check for required environment variables
    if grep -q "GOOGLE_CLIENT_ID" .env; then
        echo "✅ Google Client ID configured"
    else
        echo "❌ Google Client ID missing"
    fi
    
    if grep -q "DISCORD_CLIENT_ID" .env; then
        if grep -q "your_discord_app_id_here" .env; then
            echo "⚠️  Discord Client ID needs to be configured"
        else
            echo "✅ Discord Client ID configured"
        fi
    else
        echo "❌ Discord Client ID missing"
    fi
else
    echo "❌ Environment file missing: .env"
fi

# Check if OAuth utility exists
if [ -f "src/lib/oauth.ts" ]; then
    echo "✅ OAuth utility exists: src/lib/oauth.ts"
else
    echo "❌ OAuth utility missing: src/lib/oauth.ts"
fi

# Check if frontend environment file exists
if [ -f ".env.local" ]; then
    echo "✅ Frontend environment file exists: .env.local"
else
    echo "❌ Frontend environment file missing: .env.local"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Add Discord OAuth credentials to .env file"
echo "2. Start the backend server: npm run server"
echo "3. Start the frontend: npm run dev"
echo "4. Test OAuth flow at http://localhost:5173"
echo ""
echo "🔗 OAuth URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   Google:   http://localhost:3001/auth/google"
echo "   Discord:  http://localhost:3001/auth/discord"