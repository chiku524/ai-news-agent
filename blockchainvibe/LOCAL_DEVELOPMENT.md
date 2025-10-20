# Local Development Setup

This guide will help you set up BlockchainVibe for local development with OAuth authentication.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm

## OAuth App Configuration

Before running locally, you need to update your OAuth app settings to include localhost URLs:

### 1. Google Cloud Console
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to APIs & Services > Credentials
- Edit your OAuth 2.0 Client ID
- **Authorized JavaScript origins**:
  - `http://localhost:3000`
  - `https://blockchainvibe.news`
- **Authorized redirect URIs**:
  - `http://localhost:3000/auth/callback`
  - `https://blockchainvibe.news/auth/callback`

### 2. GitHub OAuth App
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Edit your OAuth App
- **Authorization callback URL**:
  - `http://localhost:3000/auth/callback`
  - `https://blockchainvibe.news/auth/callback`

### 3. X (Twitter) Developer Portal
- Go to [Twitter Developer Portal](https://developer.twitter.com/)
- Navigate to your app settings
- **Callback URL**:
  - `http://localhost:3000/auth/callback`
  - `https://blockchainvibe.news/auth/callback`

## Environment Setup

1. **Update OAuth Secrets** (if needed):
   ```bash
   # Edit run_local_server.py and update the OAuth secrets
   nano run_local_server.py
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   pip install fastapi uvicorn aiohttp
   ```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```
This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8000

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
# or
python run_local_server.py
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## Testing OAuth

1. Open http://localhost:3000 in your browser
2. Click on any social login button
3. Complete the OAuth flow
4. You should be redirected back to localhost instead of production

## Troubleshooting

### OAuth Redirects to Production
- Make sure you've updated all OAuth app settings with localhost URLs
- Check that `.env.local` is being used (React automatically loads this)
- Verify the redirect URI in the OAuth app matches exactly

### Backend Not Starting
- Make sure Python dependencies are installed: `pip install fastapi uvicorn aiohttp`
- Check that port 8000 is not already in use
- Update OAuth secrets in `run_local_server.py`

### Frontend Not Loading
- Make sure Node.js dependencies are installed: `npm install`
- Check that port 3000 is not already in use
- Clear browser cache if needed

## Environment Files

- `.env.local` - Local development environment variables
- `.env` - Production environment variables
- `run_local_server.py` - Local server configuration

## Switching Between Local and Production

To switch back to production:
1. Delete or rename `.env.local`
2. The app will use `.env` (production settings)
3. OAuth will redirect to production domain

To switch back to local:
1. Ensure `.env.local` exists
2. Restart the development server
3. OAuth will redirect to localhost
