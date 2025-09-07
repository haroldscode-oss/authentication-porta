// Test OAuth Configuration
// This file helps verify your OAuth setup is working correctly

require('dotenv').config();

console.log('🔧 Testing OAuth Configuration...\n');

// Test Google OAuth
console.log('📧 Google OAuth Configuration:');
console.log(`   Client ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   Redirect URI: ${process.env.GOOGLE_REDIRECT_URI}`);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&response_type=code&scope=openid+email+profile&access_type=offline`;
  console.log(`\n🔗 Google Test URL:\n   ${googleAuthUrl}\n`);
}

// Test Discord OAuth
console.log('🎮 Discord OAuth Configuration:');
console.log(`   Client ID: ${process.env.DISCORD_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   Client Secret: ${process.env.DISCORD_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   Redirect URI: ${process.env.DISCORD_REDIRECT_URI}`);

if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify+email`;
  console.log(`\n🔗 Discord Test URL:\n   ${discordAuthUrl}\n`);
}

// General settings
console.log('⚙️  General Settings:');
console.log(`   App URL: ${process.env.APP_URL}`);
console.log(`   Port: ${process.env.PORT}`);
console.log(`   Environment: ${process.env.NODE_ENV}`);

console.log('\n🚀 To test OAuth:');
console.log('   1. Start your backend server');
console.log('   2. Click the OAuth buttons in your app');
console.log('   3. Or use the test URLs above directly');
console.log('\n📝 Note: Make sure your redirect URIs match exactly in your OAuth provider settings!');