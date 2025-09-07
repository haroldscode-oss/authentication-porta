// Test OAuth Configuration
// This file helps verify your OAuth setup is working correctly



console.log(`   Client Secret: ${process.env.GOOGLE

// Test Google OAuth
console.log('📧 Google OAuth Configuration:');
console.log(`   Client ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   Redirect URI: ${process.env.GOOGLE_REDIRECT_URI}`);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {

console.log('⚙️  General Settings:');
c

console.log('   1. St
console.log('   3. Or use the test URLs above d









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