# OAuth Secrets Setup for Cloudflare Workers

This guide explains how to set up OAuth secrets for the Cloudflare Worker.

## Problem

If you're getting OAuth errors like "Could not determine client ID from request" or "Missing valid authorization header", it means the OAuth secrets are not properly set in Cloudflare Workers.

## Solution

You need to set the following secrets in Cloudflare Workers using the `wrangler secret put` command.

### Setting Secrets

Run the following commands in the `blockchainvibe/server` directory:

```bash
# Google OAuth
echo "YOUR_GOOGLE_CLIENT_ID" | npx wrangler secret put GOOGLE_CLIENT_ID --name blockchainvibe-api
echo "YOUR_GOOGLE_CLIENT_SECRET" | npx wrangler secret put GOOGLE_CLIENT_SECRET --name blockchainvibe-api

# GitHub OAuth
echo "YOUR_GITHUB_CLIENT_ID" | npx wrangler secret put GITHUB_CLIENT_ID --name blockchainvibe-api
echo "YOUR_GITHUB_CLIENT_SECRET" | npx wrangler secret put GITHUB_CLIENT_SECRET --name blockchainvibe-api

# Twitter OAuth
echo "YOUR_TWITTER_CLIENT_ID" | npx wrangler secret put TWITTER_CLIENT_ID --name blockchainvibe-api
echo "YOUR_TWITTER_CLIENT_SECRET" | npx wrangler secret put TWITTER_CLIENT_SECRET --name blockchainvibe-api

# JWT Secret
echo "YOUR_JWT_SECRET" | npx wrangler secret put JWT_SECRET --name blockchainvibe-api
```

### PowerShell (Windows)

```powershell
# Google OAuth
"YOUR_GOOGLE_CLIENT_ID" | npx wrangler secret put GOOGLE_CLIENT_ID --name blockchainvibe-api
"YOUR_GOOGLE_CLIENT_SECRET" | npx wrangler secret put GOOGLE_CLIENT_SECRET --name blockchainvibe-api

# GitHub OAuth
"YOUR_GITHUB_CLIENT_ID" | npx wrangler secret put GITHUB_CLIENT_ID --name blockchainvibe-api
"YOUR_GITHUB_CLIENT_SECRET" | npx wrangler secret put GITHUB_CLIENT_SECRET --name blockchainvibe-api

# Twitter OAuth
"YOUR_TWITTER_CLIENT_ID" | npx wrangler secret put TWITTER_CLIENT_ID --name blockchainvibe-api
"YOUR_TWITTER_CLIENT_SECRET" | npx wrangler secret put TWITTER_CLIENT_SECRET --name blockchainvibe-api

# JWT Secret
"YOUR_JWT_SECRET" | npx wrangler secret put JWT_SECRET --name blockchainvibe-api
```

## Where to Find Your OAuth Credentials

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Copy the Client ID and Client Secret

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App
3. Copy the Client ID and Client Secret

### Twitter OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Navigate to your App
3. Go to Keys and Tokens
4. Copy the Client ID and Client Secret

## Verifying Secrets

After setting the secrets, you can verify they are set correctly by running:

```bash
npx wrangler secret list --name blockchainvibe-api
```

This will show you a list of all secrets (but not their values).

## Important Notes

- Secrets are encrypted and cannot be viewed after being set
- You can only see that a secret exists, not its value
- To update a secret, simply run the `secret put` command again
- Secrets are available in the Worker as `env.SECRET_NAME`

## Database Recommendation

For your OAuth user authentication system, **Cloudflare D1 SQL Database** is the correct choice because:

1. **Structured Data**: User authentication data is structured and relational
2. **ACID Compliance**: D1 provides ACID transactions for data consistency
3. **SQL Queries**: Better for user lookups and authentication checks
4. **Real-time Access**: D1 provides real-time access for authentication

**R2 Object Storage** would be better for:
- File uploads (user avatars, documents)
- Static assets
- Large binary data

Your current setup with **D1 is correct** for user authentication.

