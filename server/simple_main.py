from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
from routes.auth import router as auth_router
from models.database import create_tables, get_db, UserService
from agents.news_agent import NewsAgent
from agents.relevance_agent import RelevanceAgent, UserProfile
from services.metta_service import MeTTaService

app = FastAPI(
    title="AI News Agent API",
    description="AI-powered blockchain news agent",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router)

# Initialize AI agents
news_agent = NewsAgent()
relevance_agent = RelevanceAgent()
metta_service = MeTTaService()

# Initialize database tables
@app.on_event("startup")
async def startup_event():
    create_tables()
    # Initialize MeTTa knowledge graph
    await relevance_agent.initialize_knowledge_graph()

# Simple models
class NewsItem(BaseModel):
    id: str
    title: str
    content: str
    url: str
    source: str
    published_at: datetime
    categories: List[str] = []

class NewsRequest(BaseModel):
    limit: int = 20
    timeframe: str = "24h"
    categories: Optional[List[str]] = None

@app.get("/")
async def root():
    return {
        "message": "AI News Agent API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now()
    }

@app.post("/news/trending")
async def get_trending_news(request: NewsRequest, db = Depends(get_db)):
    """Get trending blockchain news using Fetch.ai uAgents and SingularityNET MeTTa"""
    try:
        # Get news using Fetch.ai uAgents
        news_items = await news_agent.get_trending_news(limit=request.limit)
        
        # Calculate user-specific relevance if user profile provided
        user_relevance_score = 0.0
        if request.user_profile and request.user_profile.get('user_id'):
            user_id = request.user_profile['user_id']
            
            # Get user from database
            user = UserService.get_user_by_id(db, user_id)
            if user:
                # Create user profile for relevance calculation
                user_profile = UserProfile(
                    user_id=user_id,
                    interests=user.interests or [],
                    reading_history=user.reading_history or [],
                    preferences=user.preferences or {},
                    last_updated=user.last_login
                )
                
                # Calculate relevance for each news item using MeTTa
                for item in news_items:
                    news_dict = {
                        'title': item.title,
                        'summary': item.summary,
                        'url': item.url
                    }
                    relevance = await relevance_agent.calculate_user_relevance(news_dict, user_profile)
                    item.relevance_score = relevance
                
                # Calculate overall user relevance score
                if news_items:
                    user_relevance_score = sum(item.relevance_score for item in news_items) / len(news_items)
        
        # Convert to response format
        news_response = []
        for item in news_items:
            news_response.append(NewsItem(
                id=item.id,
                title=item.title,
                url=item.url,
                source=item.source,
                published_at=item.published_at,
                summary=item.summary,
                image_url=item.image_url,
                categories=item.categories,
                tags=item.tags,
                relevance_score=item.relevance_score
            ))
        
        return {
            "news": news_response,
            "total_count": len(news_response),
            "user_relevance_score": user_relevance_score,
            "last_updated": datetime.now()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching news: {str(e)}")

@app.get("/categories")
async def get_news_categories():
    """Get available news categories"""
    return {
        "categories": [
            "DeFi",
            "NFTs", 
            "Layer 2",
            "Web3",
            "Cryptocurrency",
            "Blockchain Technology",
            "Regulation",
            "Enterprise",
            "Gaming",
            "Metaverse"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
