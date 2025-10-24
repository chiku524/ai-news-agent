#!/usr/bin/env node

/**
 * GitHub OAuth Configuration Test Script
 * 
 * This script helps diagnose GitHub OAuth issues by testing the configuration
 * and providing specific steps to fix common problems.
 */

const https = require('https');

// Your GitHub OAuth app configuration
const GITHUB_CLIENT_ID = 'Ov23lisuJwAjEECYLj0y';
const GITHUB_CLIENT_SECRET = '7567121f79e7ba2520d5d8cce22a4f90e90ff3c8';

// Test URLs
const PRODUCTION_REDIRECT_URI = 'https://blockchainvibe.news/auth/callback';
const LOCALHOST_REDIRECT_URI = 'http://localhost:3000/auth/callback';

console.log('🔍 GitHub OAuth Configuration Test');
console.log('=====================================\n');

console.log('📋 Current Configuration:');
console.log(`Client ID: ${GITHUB_CLIENT_ID}`);
console.log(`Client Secret: ${GITHUB_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`Production Redirect URI: ${PRODUCTION_REDIRECT_URI}`);
console.log(`Localhost Redirect URI: ${LOCALHOST_REDIRECT_URI}\n`);

console.log('🔧 Required GitHub OAuth App Configuration:');
console.log('===========================================');
console.log('1. Go to: https://github.com/settings/developers');
console.log('2. Find your app: "AI News Agent" (Client ID: Ov23lisuJwAjEECYLj0y)');
console.log('3. Click "Edit" or "Update"');
console.log('4. In "Authorization callback URL", add BOTH:');
console.log(`   - ${PRODUCTION_REDIRECT_URI}`);
console.log(`   - ${LOCALHOST_REDIRECT_URI}`);
console.log('5. Click "Update application"\n');

console.log('🚨 Common Issues & Solutions:');
console.log('=============================');
console.log('❌ 403 Forbidden Error:');
console.log('   - Redirect URI mismatch (most common)');
console.log('   - OAuth app not configured for production domain');
console.log('   - Missing or incorrect client secret');
console.log('   - OAuth app suspended or restricted\n');

console.log('✅ Solutions:');
console.log('1. Update GitHub OAuth app callback URLs (see above)');
console.log('2. Verify client secret is correct');
console.log('3. Check if OAuth app is active (not suspended)');
console.log('4. Ensure no organization restrictions are blocking the app\n');

console.log('🧪 Test URLs:');
console.log('=============');
console.log('Production OAuth URL:');
console.log(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(PRODUCTION_REDIRECT_URI)}&scope=user:email&state=github\n`);

console.log('Localhost OAuth URL:');
console.log(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(LOCALHOST_REDIRECT_URI)}&scope=user:email&state=github\n`);

console.log('📝 Next Steps:');
console.log('==============');
console.log('1. Update your GitHub OAuth app with both callback URLs');
console.log('2. Test the OAuth flow again');
console.log('3. Check Cloudflare Workers logs for detailed error messages');
console.log('4. If still failing, consider using Discord OAuth as alternative\n');

console.log('🎮 Discord OAuth is now available as backup!');
console.log('============================================');
console.log('Discord OAuth has been added to your application.');
console.log('Users can now sign in with Discord if GitHub continues to fail.');
