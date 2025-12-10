#!/bin/bash

# Script to delete all Cloudflare Pages deployments
# 
# STEP 1: Get your Cloudflare API Token
# 1. Go to: https://dash.cloudflare.com/profile/api-tokens
# 2. Click "Create Token"
# 3. Use "Edit Cloudflare Workers" template OR create custom token with:
#    - Account: Cloudflare Pages:Edit permissions
#    - Zone Resources: Include - All zones (or specific zone)
# 4. Copy the token and paste it below

echo "=========================================="
echo "Cloudflare Pages Deployment Deletion Tool"
echo "=========================================="
echo ""
echo "Account ID: 10374f367672f4d19db430601db0926b"
echo "Project Name: blockchainvibe"
echo ""
echo "Please enter your Cloudflare API Token:"
echo "(Get it from: https://dash.cloudflare.com/profile/api-tokens)"
echo ""
read -sp "API Token: " CF_API_TOKEN
echo ""
echo ""

# Set environment variables
export CF_API_TOKEN="$CF_API_TOKEN"
export CF_ACCOUNT_ID="10374f367672f4d19db430601db0926b"
export CF_PAGES_PROJECT_NAME="blockchainvibe"

# Navigate to script directory
cd /c/Users/chiku/OneDrive/Desktop/delete-all-deployments

echo "Starting deployment deletion..."
echo "This will delete all deployments except the live production deployment."
echo ""

# Run the deletion script
npm start

echo ""
echo "Deletion complete!"
echo "You can now delete the Pages project via dashboard or CLI."


