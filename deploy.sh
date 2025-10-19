#!/bin/bash

# BlockchainVibe Deployment Script for Cloudflare
echo "🚀 Deploying BlockchainVibe to Cloudflare..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please log in to Cloudflare:"
    wrangler login
fi

echo "📦 Building frontend..."
cd client
npm run build
cd ..

echo "☁️ Deploying backend to Cloudflare Workers..."
cd server
wrangler deploy
cd ..

echo "📄 Deploying frontend to Cloudflare Pages..."
# Note: This requires manual setup in Cloudflare Pages dashboard
echo "📋 Next steps:"
echo "1. Go to Cloudflare Pages dashboard"
echo "2. Connect your GitHub repository"
echo "3. Set build command: npm run build"
echo "4. Set build output: client/build"
echo "5. Add custom domain: blockchainvibe.news"
echo "6. Update environment variables with your Worker URL"

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://blockchainvibe.news"
