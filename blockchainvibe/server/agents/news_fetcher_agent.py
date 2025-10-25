#!/usr/bin/env python3
"""
Fetch.ai uAgents - News Fetcher Agent
This agent is responsible for fetching and processing news from various sources
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import List, Dict, Any
from uagents import Agent, Context, Model
from uagents.network import Network

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define models for agent communication
class NewsRequest(Model):
    action: str
    data: List[Dict[str, Any]]
    user_profile: Dict[str, Any] = None

class NewsResponse(Model):
    success: bool
    data: List[Dict[str, Any]]
    processing_time: float
    agent_name: str

class NewsFetcherAgent:
    def __init__(self):
        self.agent = Agent(
            name="news_fetcher",
            seed="blockchainvibe_news_fetcher_2024",
            port=8001,
            endpoint=["http://localhost:8001/submit"]
        )
        self.setup_handlers()
    
    def setup_handlers(self):
        @self.agent.on_event("startup")
        async def startup(ctx: Context):
            ctx.logger.info(f"News Fetcher Agent started: {self.agent.name}")
            ctx.logger.info(f"Agent address: {self.agent.address}")
        
        @self.agent.on_message(model=NewsRequest)
        async def handle_news_request(ctx: Context, sender: str, msg: NewsRequest):
            ctx.logger.info(f"Received news request: {msg.action}")
            
            start_time = datetime.now()
            
            try:
                if msg.action == "process_news":
                    processed_news = await self.process_news(msg.data)
                    
                    response = NewsResponse(
                        success=True,
                        data=processed_news,
                        processing_time=(datetime.now() - start_time).total_seconds(),
                        agent_name="news_fetcher"
                    )
                    
                    await ctx.send(sender, response)
                    ctx.logger.info(f"Processed {len(processed_news)} news items")
                
                else:
                    error_response = NewsResponse(
                        success=False,
                        data=[],
                        processing_time=(datetime.now() - start_time).total_seconds(),
                        agent_name="news_fetcher"
                    )
                    await ctx.send(sender, error_response)
                    
            except Exception as e:
                ctx.logger.error(f"Error processing news request: {e}")
                error_response = NewsResponse(
                    success=False,
                    data=[],
                    processing_time=(datetime.now() - start_time).total_seconds(),
                    agent_name="news_fetcher"
                )
                await ctx.send(sender, error_response)
    
    async def process_news(self, news_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process news items with enhanced metadata extraction"""
        processed_items = []
        
        for item in news_items:
            try:
                # Enhance the news item with additional processing
                enhanced_item = {
                    **item,
                    "processed_by": "news_fetcher",
                    "processing_timestamp": datetime.now().isoformat(),
                    "quality_score": self.calculate_quality_score(item),
                    "language": self.detect_language(item.get('title', '') + ' ' + item.get('summary', '')),
                    "word_count": len(item.get('summary', '').split()),
                    "has_image": bool(item.get('image_url')),
                    "source_credibility": self.assess_source_credibility(item.get('source', ''))
                }
                
                processed_items.append(enhanced_item)
                
            except Exception as e:
                logger.error(f"Error processing news item {item.get('id', 'unknown')}: {e}")
                # Include the original item even if processing fails
                processed_items.append(item)
        
        return processed_items
    
    def calculate_quality_score(self, item: Dict[str, Any]) -> float:
        """Calculate a quality score for the news item"""
        score = 0.5  # Base score
        
        # Title quality
        title = item.get('title', '')
        if len(title) > 20 and len(title) < 200:
            score += 0.1
        
        # Summary quality
        summary = item.get('summary', '')
        if len(summary) > 50:
            score += 0.1
        
        # Source credibility
        source = item.get('source', '').lower()
        credible_sources = ['coindesk', 'cointelegraph', 'decrypt', 'the block', 'cryptoslate']
        if any(credible in source for credible in credible_sources):
            score += 0.2
        
        # Image presence
        if item.get('image_url'):
            score += 0.1
        
        # Recent publication
        try:
            pub_date = datetime.fromisoformat(item.get('published_at', '').replace('Z', '+00:00'))
            hours_old = (datetime.now() - pub_date).total_seconds() / 3600
            if hours_old < 24:
                score += 0.1
        except:
            pass
        
        return min(score, 1.0)
    
    def detect_language(self, text: str) -> str:
        """Simple language detection"""
        # This is a simplified version - in production, use a proper language detection library
        english_indicators = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
        words = text.lower().split()
        english_word_count = sum(1 for word in words if word in english_indicators)
        
        if len(words) > 0 and english_word_count / len(words) > 0.1:
            return 'en'
        return 'unknown'
    
    def assess_source_credibility(self, source: str) -> float:
        """Assess the credibility of the news source"""
        source_lower = source.lower()
        
        # Tier 1: Highly credible sources
        tier1_sources = ['coindesk', 'cointelegraph', 'decrypt', 'the block']
        if any(tier1 in source_lower for tier1 in tier1_sources):
            return 0.9
        
        # Tier 2: Good sources
        tier2_sources = ['cryptoslate', 'bitcoin magazine', 'ethereum foundation']
        if any(tier2 in source_lower for tier2 in tier2_sources):
            return 0.7
        
        # Tier 3: Average sources
        tier3_sources = ['medium', 'substack', 'blog']
        if any(tier3 in source_lower for tier3 in tier3_sources):
            return 0.5
        
        # Default for unknown sources
        return 0.3
    
    def run(self):
        """Run the agent"""
        self.agent.run()

if __name__ == "__main__":
    agent = NewsFetcherAgent()
    agent.run()
