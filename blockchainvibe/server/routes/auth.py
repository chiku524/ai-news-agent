from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional
import httpx
import os
from datetime import datetime, timedelta
import jwt
import json
from sqlalchemy.orm import Session
from models.database import get_db, UserService, create_tables

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
TWITTER_CLIENT_ID = os.getenv("TWITTER_CLIENT_ID")
TWITTER_CLIENT_SECRET = os.getenv("TWITTER_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"

class OAuthRequest(BaseModel):
    code: str
    redirect_uri: str
    provider: Optional[str] = None
    code_verifier: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    access_token: str
    refresh_token: str
    user: dict
    error: Optional[str] = None

def create_tokens(user_data: dict):
    """Create JWT access and refresh tokens"""
    access_payload = {
        "user_id": user_data["id"],
        "email": user_data["email"],
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    
    refresh_payload = {
        "user_id": user_data["id"],
        "exp": datetime.utcnow() + timedelta(days=30)
    }
    
    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return access_token, refresh_token

@router.post("/google", response_model=AuthResponse)
async def google_auth(request: OAuthRequest):
    """Handle Google OAuth callback"""
    try:
        # Exchange authorization code for access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": request.code,
            "grant_type": "authorization_code",
            "redirect_uri": request.redirect_uri
        }
        
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                token_url, 
                data=token_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            token_response.raise_for_status()
            token_info = token_response.json()
            
            # Get user info from Google
            user_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            headers = {"Authorization": f"Bearer {token_info['access_token']}"}
            user_response = await client.get(user_url, headers=headers)
            user_response.raise_for_status()
            user_info = user_response.json()
            
            # Create user data
            user_data = {
                "id": user_info["id"],
                "email": user_info["email"],
                "name": user_info.get("name", ""),
                "picture": user_info.get("picture", ""),
                "provider": "google"
            }
            
            # Create tokens
            access_token, refresh_token = create_tokens(user_data)
            
            return AuthResponse(
                success=True,
                access_token=access_token,
                refresh_token=refresh_token,
                user=user_data
            )
            
    except Exception as e:
        return AuthResponse(
            success=False,
            access_token="",
            refresh_token="",
            user={},
            error=str(e)
        )

@router.post("/github", response_model=AuthResponse)
async def github_auth(request: OAuthRequest):
    """Handle GitHub OAuth callback"""
    try:
        # Exchange authorization code for access token
        token_url = "https://github.com/login/oauth/access_token"
        token_data = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": request.code,
            "redirect_uri": request.redirect_uri
        }
        
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                token_url, 
                data=token_data,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            )
            token_response.raise_for_status()
            token_info = token_response.json()
            
            # Get user info from GitHub
            user_url = "https://api.github.com/user"
            headers = {"Authorization": f"Bearer {token_info['access_token']}"}
            user_response = await client.get(user_url, headers=headers)
            user_response.raise_for_status()
            user_info = user_response.json()
            
            # Get user email (may require additional API call)
            email_url = "https://api.github.com/user/emails"
            email_response = await client.get(email_url, headers=headers)
            email_data = email_response.json() if email_response.status_code == 200 else []
            primary_email = next((email["email"] for email in email_data if email["primary"]), user_info.get("email", ""))
            
            # Create user data
            user_data = {
                "id": str(user_info["id"]),
                "email": primary_email,
                "name": user_info.get("name", user_info.get("login", "")),
                "picture": user_info.get("avatar_url", ""),
                "provider": "github"
            }
            
            # Create tokens
            access_token, refresh_token = create_tokens(user_data)
            
            return AuthResponse(
                success=True,
                access_token=access_token,
                refresh_token=refresh_token,
                user=user_data
            )
            
    except Exception as e:
        return AuthResponse(
            success=False,
            access_token="",
            refresh_token="",
            user={},
            error=str(e)
        )

@router.post("/twitter", response_model=AuthResponse)
async def twitter_auth(request: OAuthRequest):
    """Handle X (Twitter) OAuth callback"""
    try:
        # Exchange authorization code for access token
        token_url = "https://api.twitter.com/2/oauth2/token"
        token_data = {
            "code": request.code,
            "grant_type": "authorization_code",
            "redirect_uri": request.redirect_uri,
            "code_verifier": request.code_verifier or "challenge"  # Use provided code_verifier or fallback
        }
        
        # Create Basic Auth header for Twitter OAuth 2.0
        import base64
        credentials = f"{TWITTER_CLIENT_ID}:{TWITTER_CLIENT_SECRET}"
        auth_header = base64.b64encode(credentials.encode()).decode()
        
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                token_url, 
                data=token_data,
                headers={
                    "Authorization": f"Basic {auth_header}",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            )
            token_response.raise_for_status()
            token_info = token_response.json()
            
            # Get user info from Twitter
            user_url = "https://api.twitter.com/2/users/me"
            headers = {"Authorization": f"Bearer {token_info['access_token']}"}
            user_response = await client.get(user_url, headers=headers)
            user_response.raise_for_status()
            user_info = user_response.json()
            
            # Create user data
            user_data = {
                "id": user_info["data"]["id"],
                "email": "",  # Twitter API v2 doesn't provide email by default
                "name": user_info["data"].get("name", ""),
                "picture": user_info["data"].get("profile_image_url", ""),
                "provider": "twitter"
            }
            
            # Create tokens
            access_token, refresh_token = create_tokens(user_data)
            
            return AuthResponse(
                success=True,
                access_token=access_token,
                refresh_token=refresh_token,
                user=user_data
            )
            
    except Exception as e:
        return AuthResponse(
            success=False,
            access_token="",
            refresh_token="",
            user={},
            error=str(e)
        )

@router.post("/callback")
async def oauth_callback(request: OAuthRequest):
    """Handle OAuth callback from frontend"""
    try:
        # Get provider from request body or determine from context
        provider = getattr(request, 'provider', None)
        if not provider:
            # Try to determine from the code or other means
            # For now, we'll need to modify the OAuthRequest model
            raise HTTPException(status_code=400, detail="Provider not specified")
        
        if provider == "google":
            return await google_auth(request)
        elif provider == "github":
            return await github_auth(request)
        elif provider == "twitter":
            return await twitter_auth(request)
        else:
            raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
            
    except Exception as e:
        return AuthResponse(
            success=False,
            access_token="",
            refresh_token="",
            user={},
            error=str(e)
        )
