# URGENT: OAuth App Configuration Required

## 🚨 Current Issues

**GitHub OAuth**: HTTP 404 "Not Found" - The GitHub OAuth app is not configured with the production callback URL.

**Twitter OAuth**: HTTP 401 "Unauthorized" - The Twitter OAuth app is not configured with the production callback URL.

**Google OAuth**: ✅ Working - Already properly configured.

## 🔧 Required OAuth App Updates

### 1. GitHub OAuth App Configuration

**Current Status**: ❌ NOT CONFIGURED FOR PRODUCTION

**Required Action**:
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Find your app: `AI News Agent` (Client ID: `Ov23lisuJwAjEECYLj0y`)
3. Click "Edit" or "Update"
4. **CRITICAL**: Update the **Authorization callback URL** to:
   ```
   https://blockchainvibe.news/auth/callback
   ```
5. Save changes

**Current Callback URL**: Likely set to `http://localhost:3000/auth/callback` (localhost)
**Required Callback URL**: `https://blockchainvibe.news/auth/callback` (production)

### 2. Twitter OAuth App Configuration

**Current Status**: ❌ NOT CONFIGURED FOR PRODUCTION

**Required Action**:
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Find your app (Client ID: `QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ`)
3. Go to "App settings" → "Authentication settings"
4. **CRITICAL**: Update the **Callback URL** to:
   ```
   https://blockchainvibe.news/auth/callback
   ```
5. Ensure **OAuth 2.0** is enabled
6. Save changes

**Current Callback URL**: Likely set to `http://localhost:3000/auth/callback` (localhost)
**Required Callback URL**: `https://blockchainvibe.news/auth/callback` (production)

### 3. Google OAuth App Configuration

**Current Status**: ✅ ALREADY CONFIGURED

**Verification** (Optional):
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID: `579208613672-c4pvdarqdnckdai6re7n9nei5svk72st.apps.googleusercontent.com`
4. Verify **Authorized redirect URIs** includes:
   ```
   https://blockchainvibe.news/auth/callback
   ```

## 🎯 Why This Fixes the Issues

**GitHub 404 Error**: 
- GitHub returns 404 when the callback URL doesn't match what's configured in the OAuth app
- The app is currently configured for localhost, but production sends `https://blockchainvibe.news/auth/callback`

**Twitter 401 Error**:
- Twitter returns 401 "unauthorized_client" when the callback URL doesn't match
- The app is currently configured for localhost, but production sends `https://blockchainvibe.news/auth/callback`

## 📋 Steps to Fix

1. **Update GitHub OAuth App** (5 minutes)
   - Add production callback URL
   - Save changes

2. **Update Twitter OAuth App** (5 minutes)
   - Add production callback URL
   - Ensure OAuth 2.0 is enabled
   - Save changes

3. **Test OAuth** (2 minutes)
   - Try GitHub login → Should work
   - Try Twitter login → Should work
   - Google login → Should continue working

## ⚠️ Important Notes

- **Both OAuth apps MUST be updated** for production to work
- The callback URLs must match **exactly** (including https://)
- Changes may take 1-2 minutes to propagate
- Test immediately after making changes

## 🔗 Quick Links

- [GitHub OAuth Apps](https://github.com/settings/developers)
- [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**After updating both OAuth apps, all three authentication providers should work perfectly in production!** 🚀
