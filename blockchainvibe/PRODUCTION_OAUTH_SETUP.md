# Production OAuth Setup Guide

This guide will help you configure OAuth providers for production deployment on `blockchainvibe.news`.

## 🔧 OAuth App Configuration

### 1. Google OAuth Setup

**Current Status**: ✅ Working in production

**Configuration**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID: `579208613672-c4pvdarqdnckdai6re7n9nei5svk72st.apps.googleusercontent.com`

**Required Settings**:
- **Authorized JavaScript origins**:
  - `https://blockchainvibe.news`
  - `http://localhost:3000` (for development)
- **Authorized redirect URIs**:
  - `https://blockchainvibe.news/auth/callback`
  - `http://localhost:3000/auth/callback` (for development)

### 2. GitHub OAuth Setup

**Current Status**: ❌ Needs configuration

**Configuration**:
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Find your app: `AI News Agent` (Client ID: `Ov23lisuJwAjEECYLj0y`)
3. Click "Edit" or "Update"

**Required Settings**:
- **Authorization callback URL**:
  - `https://blockchainvibe.news/auth/callback`
  - `http://localhost:3000/auth/callback` (for development)

### 3. X (Twitter) OAuth Setup

**Current Status**: ❌ Needs configuration

**Configuration**:
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Find your app (Client ID: `QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ`)
3. Go to "App settings" → "Authentication settings"

**Required Settings**:
- **Callback URL**:
  - `https://blockchainvibe.news/auth/callback`
  - `http://localhost:3000/auth/callback` (for development)
- **OAuth 2.0**: Must be enabled
- **App permissions**: Read and Write (if needed)

## 🌐 Cloudflare Pages Environment Variables

In your Cloudflare Pages dashboard, go to Settings > Environment variables and set:

```env
REACT_APP_GOOGLE_CLIENT_ID=579208613672-c4pvdarqdnckdai6re7n9nei5svk72st.apps.googleusercontent.com
REACT_APP_GITHUB_CLIENT_ID=Ov23lisuJwAjEECYLj0y
REACT_APP_TWITTER_CLIENT_ID=QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ
REACT_APP_REDIRECT_URI=https://blockchainvibe.news/auth/callback
REACT_APP_API_URL=https://blockchainvibe-api.nico-chikuji.workers.dev
```

## 🔄 Cloudflare Workers Environment Variables

In your Cloudflare Workers dashboard, set these secrets:

```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put TWITTER_CLIENT_ID
wrangler secret put TWITTER_CLIENT_SECRET
wrangler secret put JWT_SECRET
```

## ✅ Testing Checklist

After configuration:

1. **Test Google OAuth**: Should work ✅
2. **Test GitHub OAuth**: Should work after redirect URI update
3. **Test X OAuth**: Should work after callback URL update
4. **Test local development**: All OAuth providers should work
5. **Test production**: All OAuth providers should work

## 🚨 Common Issues

### GitHub OAuth Not Working
- **Error**: `redirect_uri_mismatch`
- **Solution**: Update GitHub OAuth app callback URL to include production domain

### Twitter OAuth Not Working
- **Error**: `invalid_request` or callback not working
- **Solution**: Update Twitter app callback URL and ensure OAuth 2.0 is enabled

### Google OAuth Not Working
- **Error**: `access_blocked` or `invalid_client`
- **Solution**: Check authorized origins and redirect URIs in Google Cloud Console

## 📝 Next Steps

1. Update GitHub OAuth app callback URL
2. Update Twitter OAuth app callback URL
3. Redeploy frontend to Cloudflare Pages
4. Test all OAuth providers in production
5. Update this document with any issues found

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [GitHub OAuth Apps](https://github.com/settings/developers)
- [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [Cloudflare Pages](https://dash.cloudflare.com/pages)
- [Cloudflare Workers](https://dash.cloudflare.com/workers)
