#!/bin/bash

# Quick script to delete all Cloudflare Pages deployments
# Usage: ./run-delete-deployments.sh YOUR_API_TOKEN

if [ -z "$1" ]; then
    echo "Error: API Token required"
    echo ""
    echo "Usage: ./run-delete-deployments.sh YOUR_API_TOKEN"
    echo ""
    echo "To get your API Token:"
    echo "1. Go to: https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use 'Edit Cloudflare Workers' template"
    echo "4. Copy the token"
    exit 1
fi

export CF_API_TOKEN="$1"
export CF_ACCOUNT_ID="10374f367672f4d19db430601db0926b"
export CF_PAGES_PROJECT_NAME="blockchainvibe"

cd /c/Users/chiku/OneDrive/Desktop/delete-all-deployments

echo "Deleting all deployments for project: blockchainvibe"
echo "Account ID: 10374f367672f4d19db430601db0926b"
echo ""
echo "This will delete all deployments except the live production deployment."
echo "Starting in 3 seconds..."
sleep 3

npm start


