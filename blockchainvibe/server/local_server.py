#!/usr/bin/env python3
"""
Local development server for BlockchainVibe
This runs the same OAuth logic as the Cloudflare Worker but locally
"""

import os
import json
import asyncio
import aiohttp
from urllib.parse import urlencode
import base64
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(title="BlockchainVibe Local API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://blockchainvibe.news"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables (you'll need to set these)
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "579208613672-c4pvdarqdnckdai6re7n9nei5svk72st.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "your_google_client_secret")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "Ov23lisuJwAjEECYLj0y")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "7567121f79e7ba2520d5d8cce22a4f90e90ff3c8")
TWITTER_CLIENT_ID = os.getenv("TWITTER_CLIENT_ID", "QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ")
TWITTER_CLIENT_SECRET = os.getenv("TWITTER_CLIENT_SECRET", "Qw8ImtckPxdNs9YljLMigQwtmJqtjrPE5pLb0VfqKDxlCQDQme")

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "BlockchainVibe Local API is running"}

@app.post("/api/auth/callback")
async def oauth_callback(request: Request):
    try:
        body = await request.json()
        code = body.get("code")
        redirect_uri = body.get("redirect_uri")
        provider = body.get("provider")
        code_verifier = body.get("code_verifier")
        
        print(f"OAuth callback: {provider} - {code[:10]}...")
        
        if not code or not provider:
            raise HTTPException(status_code=400, detail="Missing required parameters")
        
        user_data = None
        access_token = None
        
        if provider == "google":
            user_data, access_token = await handle_google_oauth(code, redirect_uri)
        elif provider == "github":
            user_data, access_token = await handle_github_oauth(code, redirect_uri)
        elif provider == "twitter":
            user_data, access_token = await handle_twitter_oauth(code, redirect_uri, code_verifier)
        else:
            raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
        
        return {
            "success": True,
            "access_token": access_token,
            "user": user_data
        }
        
    except Exception as e:
        print(f"OAuth callback error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "OAuth callback failed",
                "error": str(e)
            }
        )

async def handle_google_oauth(code, redirect_uri):
    """Handle Google OAuth"""
    async with aiohttp.ClientSession() as session:
        # Exchange code for token
        token_data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri
        }
        
        async with session.post(
            "https://oauth2.googleapis.com/token",
            data=token_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        ) as response:
            token_result = await response.json()
            
        if "error" in token_result:
            raise Exception(f"Google token error: {token_result.get('error_description', token_result['error'])}")
        
        # Get user info
        async with session.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {token_result['access_token']}"}
        ) as response:
            user_info = await response.json()
            
        return {
            "id": user_info["id"],
            "email": user_info["email"],
            "name": user_info["name"],
            "picture": user_info["picture"]
        }, token_result["access_token"]

async def handle_github_oauth(code, redirect_uri):
    """Handle GitHub OAuth"""
    async with aiohttp.ClientSession() as session:
        # Exchange code for token
        token_data = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": redirect_uri
        }
        
        async with session.post(
            "https://github.com/login/oauth/access_token",
            data=token_data,
            headers={"Accept": "application/json"}
        ) as response:
            token_result = await response.json()
            
        if "error" in token_result:
            raise Exception(f"GitHub token error: {token_result.get('error_description', token_result['error'])}")
        
        # Get user info
        async with session.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {token_result['access_token']}"}
        ) as response:
            user_info = await response.json()
            
        # Get user email if not public
        user_email = user_info.get("email")
        if not user_email:
            try:
                async with session.get(
                    "https://api.github.com/user/emails",
                    headers={"Authorization": f"Bearer {token_result['access_token']}"}
                ) as response:
                    emails = await response.json()
                    primary_email = next((email for email in emails if email.get("primary")), None)
                    user_email = primary_email["email"] if primary_email else f"{user_info['login']}@github.local"
            except:
                user_email = f"{user_info['login']}@github.local"
        
        return {
            "id": str(user_info["id"]),
            "email": user_email,
            "name": user_info.get("name") or user_info["login"],
            "picture": user_info["avatar_url"]
        }, token_result["access_token"]

async def handle_twitter_oauth(code, redirect_uri, code_verifier):
    """Handle Twitter OAuth"""
    async with aiohttp.ClientSession() as session:
        # Exchange code for token
        token_data = {
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri,
            "code_verifier": code_verifier
        }
        
        auth_header = base64.b64encode(f"{TWITTER_CLIENT_ID}:{TWITTER_CLIENT_SECRET}".encode()).decode()
        
        async with session.post(
            "https://api.twitter.com/2/oauth2/token",
            data=token_data,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {auth_header}"
            }
        ) as response:
            token_result = await response.json()
            
        if "error" in token_result:
            raise Exception(f"Twitter token error: {token_result.get('error_description', token_result['error'])}")
        
        # Get user info
        async with session.get(
            "https://api.twitter.com/2/users/me",
            headers={"Authorization": f"Bearer {token_result['access_token']}"}
        ) as response:
            user_info = await response.json()
            
        if "errors" in user_info:
            raise Exception(f"Twitter user error: {user_info['errors'][0].get('detail', user_info['errors'][0]['message'])}")
        
        return {
            "id": user_info["data"]["id"],
            "email": user_info["data"].get("email", ""),
            "name": user_info["data"]["name"],
            "picture": user_info["data"]["profile_image_url"]
        }, token_result["access_token"]

if __name__ == "__main__":
    print("Starting BlockchainVibe Local API Server...")
    print("Make sure to set your OAuth client secrets in environment variables:")
    print("- GOOGLE_CLIENT_SECRET")
    print("- GITHUB_CLIENT_SECRET") 
    print("- TWITTER_CLIENT_SECRET")
    print("\nServer will run on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
