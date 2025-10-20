# 🚀 BlockchainVibe Deployment Guide

Deploy your AI-powered blockchain news aggregator to `blockchainvibe.news` using Cloudflare.

## 📋 Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install with `npm install -g wrangler`
3. **Domain**: You already have `blockchainvibe.news` ✅
4. **GitHub Repository**: Your code should be in a GitHub repo

## 🔧 Step 1: Prepare Your OAuth Apps

### Update OAuth Redirect URIs

You need to update your OAuth app settings to include the production domain:

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   - `https://blockchainvibe.news`
5. Add to **Authorized redirect URIs**:
   - `https://blockchainvibe.news/auth/callback`

#### GitHub OAuth:
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Edit your OAuth App
3. Set **Authorization callback URL**:
   - `https://blockchainvibe.news/auth/callback`

#### X (Twitter) OAuth:
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Edit your app settings
3. Set **Callback URL**:
   - `https://blockchainvibe.news/auth/callback`

## 🚀 Step 2: Deploy Backend (Cloudflare Workers)

### 2.1 Login to Cloudflare
```bash
wrangler login
```

### 2.2 Deploy the Worker
```bash
cd server
wrangler deploy
```

This will give you a URL like: `https://blockchainvibe-api.your-subdomain.workers.dev`

### 2.3 Set Environment Variables
```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put TWITTER_CLIENT_ID
wrangler secret put TWITTER_CLIENT_SECRET
wrangler secret put JWT_SECRET
```

### 2.4 Create D1 Database
```bash
wrangler d1 create blockchainvibe-db
```

This will give you a database ID. Update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "blockchainvibe-db"
database_id = "your-database-id-here"
```

## 🌐 Step 3: Deploy Frontend (Cloudflare Pages)

### 3.1 Connect GitHub Repository
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Connect your GitHub repository
4. Select your repository

### 3.2 Configure Build Settings
- **Framework preset**: Create React App
- **Build command**: `npm install && npm run build`
- **Build output directory**: `build`
- **Root directory**: `/` (leave empty)

### 3.3 Set Environment Variables
In Cloudflare Pages dashboard, go to Settings > Environment variables:

```
REACT_APP_GOOGLE_CLIENT_ID=579208613672-c4pvdarqdnckdai6re7n9nei5svk72st.apps.googleusercontent.com
REACT_APP_GITHUB_CLIENT_ID=Ov23lisuJwAjEECYLj0y
REACT_APP_TWITTER_CLIENT_ID=QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ
REACT_APP_REDIRECT_URI=https://blockchainvibe.news/auth/callback
REACT_APP_API_URL=https://blockchainvibe-api.nico-chikuji.workers.dev
```

**Important**: Make sure you've updated your OAuth app settings (GitHub and Twitter) to include the production callback URL before deploying!

📋 **For detailed OAuth configuration steps, see**: [PRODUCTION_OAUTH_SETUP.md](./PRODUCTION_OAUTH_SETUP.md)

### 3.4 Deploy
Click "Save and Deploy"

## 🔗 Step 4: Connect Custom Domain

### 4.1 Add Custom Domain
1. In Cloudflare Pages dashboard
2. Go to Custom domains
3. Click "Set up a custom domain"
4. Enter: `blockchainvibe.news`

### 4.2 Update DNS
Cloudflare will automatically configure DNS for you.

## 🔄 Step 5: Update API URL

After getting your Worker URL, update the frontend environment:

1. Go to Cloudflare Pages > Settings > Environment variables
2. Update `REACT_APP_API_URL` with your actual Worker URL
3. Redeploy the frontend

## ✅ Step 6: Test Your Deployment

1. Visit `https://blockchainvibe.news`
2. Test OAuth login with Google, GitHub, and X
3. Verify news loading and AI features
4. Check mobile responsiveness

## 🛠️ Troubleshooting

### Common Issues:

#### OAuth Errors:
- **"Access blocked"**: Check redirect URIs in OAuth apps
- **"Invalid client"**: Verify client IDs and secrets

#### API Errors:
- **CORS errors**: Check CORS settings in Worker
- **Database errors**: Verify D1 database binding

#### Build Errors:
- **Environment variables**: Ensure all required vars are set
- **Build command**: Verify npm scripts are correct

### Debug Commands:
```bash
# Check Worker logs
wrangler tail

# Test Worker locally
wrangler dev

# Check Pages build logs
# Go to Cloudflare Pages dashboard > Deployments
```

## 🎉 Success!

Your BlockchainVibe app should now be live at:
- **Frontend**: https://blockchainvibe.news
- **API**: https://blockchainvibe-api.your-subdomain.workers.dev

## 📊 Monitoring

- **Analytics**: Cloudflare Analytics in dashboard
- **Performance**: Cloudflare Speed insights
- **Security**: Cloudflare Security insights

## 🔄 Updates

To update your app:
1. Push changes to GitHub
2. Cloudflare Pages will auto-deploy
3. For backend changes: `wrangler deploy`

---

**Need help?** Check the Cloudflare documentation or create an issue in your repository.
