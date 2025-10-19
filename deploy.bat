@echo off
echo 🚀 Deploying BlockchainVibe to Cloudflare...

REM Check if wrangler is installed
wrangler --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Wrangler CLI not found. Installing...
    npm install -g wrangler
)

REM Check if user is logged in to Cloudflare
wrangler whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please log in to Cloudflare:
    wrangler login
)

echo 📦 Building frontend...
cd client
call npm run build
cd ..

echo ☁️ Deploying backend to Cloudflare Workers...
cd server
call wrangler deploy
cd ..

echo 📄 Deploying frontend to Cloudflare Pages...
echo 📋 Next steps:
echo 1. Go to Cloudflare Pages dashboard
echo 2. Connect your GitHub repository
echo 3. Set build command: npm run build
echo 4. Set build output: client/build
echo 5. Add custom domain: blockchainvibe.news
echo 6. Update environment variables with your Worker URL

echo ✅ Deployment complete!
echo 🌐 Your app will be available at: https://blockchainvibe.news
pause
