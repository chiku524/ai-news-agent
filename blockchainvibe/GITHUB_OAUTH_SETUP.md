# GitHub OAuth Setup for Local Development

Since GitHub only allows ONE callback URL per OAuth app, you need to create a separate OAuth app for local development.

## Steps:

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Create New OAuth App**
   - **Application name**: `BlockchainVibe Local Dev`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/callback`

3. **Get Client ID and Secret**
   - Copy the **Client ID** (you'll need this)
   - Generate a **Client Secret** (you'll need this too)

4. **Update Environment Files**
   - Update `.env.development.local` with the new GitHub Client ID
   - Update `run_local_server.py` with the new GitHub Client Secret

## Alternative: Use Production OAuth App

If you don't want to create a separate app, you can temporarily change the production OAuth app's callback URL to localhost for testing, but remember to change it back for production deployment.

## Current Issue

The current GitHub OAuth app (`Ov23lisuJwAjEECYLj0y`) is configured for production callback URL (`https://blockchainvibe.news/auth/callback`), which is why localhost OAuth is failing.
