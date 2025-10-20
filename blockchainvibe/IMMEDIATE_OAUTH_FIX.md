# 🚨 IMMEDIATE FIX: Update Production OAuth Apps

## **Current Issue**
GitHub and Twitter OAuth are failing because the OAuth apps are not configured with the production callback URL.

## **Quick Fix (5 minutes)**

### **1. Fix GitHub OAuth App**
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Find your app: `AI News Agent` (Client ID: `Ov23lisuJwAjEECYLj0y`)
3. Click **"Edit"**
4. **Authorization callback URL**: `https://blockchainvibe.news/auth/callback`
5. Click **"Update application"**

### **2. Fix Twitter OAuth App**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Find your app (Client ID: `QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ`)
3. Go to **"App settings" > "Authentication settings"**
4. **Callback URL**: `https://blockchainvibe.news/auth/callback`
5. **OAuth 2.0**: ✅ Enabled
6. Click **"Save"**

## **After This Fix**
- ✅ GitHub OAuth will work
- ✅ Twitter OAuth will work
- ✅ Google OAuth will continue working
- 🎉 All three authentication providers will work!

## **Next Steps**
After fixing the immediate issue, follow the `COMPLETE_OAUTH_SETUP.md` guide to create separate development and production OAuth apps for better isolation and testing.
