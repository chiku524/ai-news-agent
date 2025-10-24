// Test Discord OAuth Configuration
console.log('🔍 Discord OAuth Configuration Test');
console.log('=====================================');

// Test the Discord OAuth URL generation
const DISCORD_CLIENT_ID = '1431187449215717457';
const REDIRECT_URI = 'https://blockchainvibe.news/auth/callback';

console.log('\n📋 Configuration:');
console.log(`Client ID: ${DISCORD_CLIENT_ID}`);
console.log(`Redirect URI: ${REDIRECT_URI}`);

console.log('\n🧪 Test OAuth URL:');
const discordAuthUrl = `https://discord.com/api/oauth2/authorize?` +
  `client_id=${DISCORD_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `response_type=code&` +
  `scope=identify%20email&` +
  `state=discord`;

console.log(discordAuthUrl);

console.log('\n🔧 Discord OAuth App Setup:');
console.log('===========================');
console.log('1. Go to: https://discord.com/developers/applications');
console.log('2. Find your app: "AI News Agent" (Client ID: 1431187449215717457)');
console.log('3. Go to OAuth2 > General');
console.log('4. Add Redirect URI: https://blockchainvibe.news/auth/callback');
console.log('5. Save changes');

console.log('\n✅ Expected Behavior:');
console.log('- Discord OAuth should work in production');
console.log('- User should be redirected to Discord login');
console.log('- After login, user should be redirected back to the app');
console.log('- User data should be retrieved and stored');

console.log('\n🚨 Common Issues:');
console.log('- Client ID not set in Cloudflare Workers secrets');
console.log('- Redirect URI mismatch');
console.log('- Discord app not properly configured');
console.log('- Missing scopes (identify, email)');

console.log('\n📊 Debug Information:');
console.log('- Check Cloudflare Workers logs for detailed error messages');
console.log('- Verify DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET are set');
console.log('- Test the OAuth URL manually in browser');
