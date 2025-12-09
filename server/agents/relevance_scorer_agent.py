#!/usr/bin/env python3
"""
Fetch.ai uAgents - Relevance Scorer Agent
This agent calculates relevance scores and personalization for news articles
"""

import asyncio
import json
import logging
import math
from datetime import datetime
from typing import List, Dict, Any
from uagents import Agent, Context, Model

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define models for agent communication
class RelevanceRequest(Model):
    action: str
    data: List[Dict[str, Any]]
    user_profile: Dict[str, Any] = None

class RelevanceResponse(Model):
    success: bool
    data: List[Dict[str, Any]]
    processing_time: float
    agent_name: str

class RelevanceScorerAgent:
    def __init__(self):
        self.agent = Agent(
            name="relevance_scorer",
            seed="blockchainvibe_relevance_scorer_2024",
            port=8003,
            endpoint=["http://localhost:8003/submit"]
        )
        self.setup_handlers()
    
    def setup_handlers(self):
        @self.agent.on_event("startup")
        async def startup(ctx: Context):
            ctx.logger.info(f"Relevance Scorer Agent started: {self.agent.name}")
            ctx.logger.info(f"Agent address: {self.agent.address}")
        
        @self.agent.on_message(model=RelevanceRequest)
        async def handle_relevance_request(ctx: Context, sender: str, msg: RelevanceRequest):
            ctx.logger.info(f"Received relevance request: {msg.action}")
            
            start_time = datetime.now()
            
            try:
                if msg.action == "calculate_relevance":
                    scored_news = await self.calculate_relevance_scores(msg.data, msg.user_profile)
                    
                    response = RelevanceResponse(
                        success=True,
                        data=scored_news,
                        processing_time=(datetime.now() - start_time).total_seconds(),
                        agent_name="relevance_scorer"
                    )
                    
                    await ctx.send(sender, response)
                    ctx.logger.info(f"Calculated relevance for {len(scored_news)} news items")
                
                else:
                    error_response = RelevanceResponse(
                        success=False,
                        data=[],
                        processing_time=(datetime.now() - start_time).total_seconds(),
                        agent_name="relevance_scorer"
                    )
                    await ctx.send(sender, error_response)
                    
            except Exception as e:
                ctx.logger.error(f"Error processing relevance request: {e}")
                error_response = RelevanceResponse(
                    success=False,
                    data=[],
                    processing_time=(datetime.now() - start_time).total_seconds(),
                    agent_name="relevance_scorer"
                )
                await ctx.send(sender, error_response)
    
    async def calculate_relevance_scores(self, news_items: List[Dict[str, Any]], user_profile: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Calculate relevance scores for news items based on user profile"""
        scored_items = []
        
        for item in news_items:
            try:
                # Calculate base relevance score
                base_score = item.get('relevance_score', 0.5)
                
                # Calculate personalized relevance
                personalized_score = self.calculate_personalized_relevance(item, user_profile)
                
                # Calculate engagement potential
                engagement_score = self.calculate_engagement_potential(item)
                
                # Calculate recency score
                recency_score = self.calculate_recency_score(item)
                
                # Combine scores with weights
                final_score = (
                    base_score * 0.3 +
                    personalized_score * 0.4 +
                    engagement_score * 0.2 +
                    recency_score * 0.1
                )
                
                # Get personalization factors
                personalization_factors = self.get_personalization_factors(item, user_profile)
                
                enhanced_item = {
                    **item,
                    "processed_by": "relevance_scorer",
                    "relevance_score": min(final_score, 1.0),
                    "personalized_score": personalized_score,
                    "engagement_potential": engagement_score,
                    "recency_score": recency_score,
                    "personalization_factors": personalization_factors,
                    "processing_timestamp": datetime.now().isoformat()
                }
                
                scored_items.append(enhanced_item)
                
            except Exception as e:
                logger.error(f"Error calculating relevance for item {item.get('id', 'unknown')}: {e}")
                # Include the original item even if processing fails
                scored_items.append(item)
        
        # Sort by relevance score
        scored_items.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        
        return scored_items
    
    def calculate_personalized_relevance(self, item: Dict[str, Any], user_profile: Dict[str, Any] = None) -> float:
        """Calculate personalized relevance score based on user profile"""
        if not user_profile:
            return 0.5
        
        score = 0.5
        article_text = (item.get('title', '') + ' ' + item.get('summary', '')).lower()
        
        # User interests matching
        if 'interests' in user_profile:
            interests = user_profile['interests']
            for interest in interests:
                if interest.lower() in article_text:
                    score += 0.2
                    break
        
        # Reading history matching
        if 'reading_history' in user_profile:
            history = user_profile['reading_history']
            for history_item in history:
                if history_item.lower() in article_text:
                    score += 0.1
                    break
        
        # Preferred sources
        if 'preferred_sources' in user_profile:
            preferred_sources = user_profile['preferred_sources']
            if item.get('source', '').lower() in [s.lower() for s in preferred_sources]:
                score += 0.15
        
        # Topic preferences
        if 'topic_preferences' in user_profile:
            topic_preferences = user_profile['topic_preferences']
            item_categories = item.get('categories', [])
            for category in item_categories:
                if category.lower() in [t.lower() for t in topic_preferences]:
                    score += 0.1
                    break
        
        # Reading time preferences
        if 'reading_time_preference' in user_profile:
            word_count = len(item.get('summary', '').split())
            preferred_length = user_profile['reading_time_preference']
            
            if preferred_length == 'short' and word_count < 100:
                score += 0.1
            elif preferred_length == 'medium' and 100 <= word_count <= 300:
                score += 0.1
            elif preferred_length == 'long' and word_count > 300:
                score += 0.1
        
        return min(score, 1.0)
    
    def calculate_engagement_potential(self, item: Dict[str, Any]) -> float:
        """Calculate potential engagement score based on article characteristics"""
        score = 0.5
        
        # Title characteristics
        title = item.get('title', '')
        if len(title) > 30 and len(title) < 100:
            score += 0.1
        
        # Emotional words in title
        emotional_words = ['breakthrough', 'revolutionary', 'exclusive', 'urgent', 'critical', 'major']
        if any(word in title.lower() for word in emotional_words):
            score += 0.1
        
        # Question in title
        if '?' in title:
            score += 0.05
        
        # Image presence
        if item.get('image_url'):
            score += 0.1
        
        # Source credibility
        source_credibility = item.get('source_credibility', 0.5)
        score += source_credibility * 0.2
        
        # Quality score
        quality_score = item.get('quality_score', 0.5)
        score += quality_score * 0.1
        
        return min(score, 1.0)
    
    def calculate_recency_score(self, item: Dict[str, Any]) -> float:
        """Calculate recency score based on publication time"""
        try:
            pub_date = datetime.fromisoformat(item.get('published_at', '').replace('Z', '+00:00'))
            hours_old = (datetime.now() - pub_date).total_seconds() / 3600
            
            # Exponential decay for recency
            if hours_old < 1:
                return 1.0
            elif hours_old < 6:
                return 0.9
            elif hours_old < 24:
                return 0.7
            elif hours_old < 72:
                return 0.5
            else:
                return 0.3
        except:
            return 0.5
    
    def get_personalization_factors(self, item: Dict[str, Any], user_profile: Dict[str, Any] = None) -> List[str]:
        """Get list of personalization factors that influenced the score"""
        factors = []
        
        if not user_profile:
            return factors
        
        article_text = (item.get('title', '') + ' ' + item.get('summary', '')).lower()
        
        # Interest matching
        if 'interests' in user_profile:
            interests = user_profile['interests']
            for interest in interests:
                if interest.lower() in article_text:
                    factors.append(f"matches_interest:{interest}")
                    break
        
        # Source preference
        if 'preferred_sources' in user_profile:
            preferred_sources = user_profile['preferred_sources']
            if item.get('source', '').lower() in [s.lower() for s in preferred_sources]:
                factors.append("preferred_source")
        
        # Topic preference
        if 'topic_preferences' in user_profile:
            topic_preferences = user_profile['topic_preferences']
            item_categories = item.get('categories', [])
            for category in item_categories:
                if category.lower() in [t.lower() for t in topic_preferences]:
                    factors.append(f"matches_topic:{category}")
                    break
        
        # Reading time preference
        if 'reading_time_preference' in user_profile:
            word_count = len(item.get('summary', '').split())
            preferred_length = user_profile['reading_time_preference']
            
            if preferred_length == 'short' and word_count < 100:
                factors.append("matches_reading_time:short")
            elif preferred_length == 'medium' and 100 <= word_count <= 300:
                factors.append("matches_reading_time:medium")
            elif preferred_length == 'long' and word_count > 300:
                factors.append("matches_reading_time:long")
        
        return factors
    
    def run(self):
        """Run the agent"""
        self.agent.run()

if __name__ == "__main__":
    agent = RelevanceScorerAgent()
    agent.run()
