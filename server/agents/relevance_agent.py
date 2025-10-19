# SingularityNET MeTTa Knowledge Graph Integration
import asyncio
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import httpx
from dataclasses import dataclass

@dataclass
class UserProfile:
    user_id: str
    interests: List[str]
    reading_history: List[str]
    preferences: Dict[str, Any]
    last_updated: datetime

class RelevanceAgent:
    """
    SingularityNET MeTTa Knowledge Graph-based relevance scoring agent
    """
    
    def __init__(self, metta_endpoint: str = None):
        self.metta_endpoint = metta_endpoint or "https://metta.singularitynet.io/api/v1"
        self.knowledge_graph = {}
        self.entity_embeddings = {}
    
    async def initialize_knowledge_graph(self):
        """Initialize MeTTa knowledge graph with blockchain entities"""
        try:
            # In a real implementation, this would connect to MeTTa
            # For now, we'll use a simplified knowledge graph
            self.knowledge_graph = {
                "entities": {
                    "bitcoin": {
                        "type": "cryptocurrency",
                        "related": ["blockchain", "mining", "halving", "store_of_value"],
                        "sentiment": 0.7,
                        "relevance_score": 0.9
                    },
                    "ethereum": {
                        "type": "platform",
                        "related": ["smart_contracts", "defi", "nft", "gas", "eth2"],
                        "sentiment": 0.8,
                        "relevance_score": 0.95
                    },
                    "defi": {
                        "type": "ecosystem",
                        "related": ["yield_farming", "liquidity", "dex", "lending"],
                        "sentiment": 0.6,
                        "relevance_score": 0.85
                    },
                    "nft": {
                        "type": "technology",
                        "related": ["digital_art", "collectibles", "gaming", "metaverse"],
                        "sentiment": 0.5,
                        "relevance_score": 0.7
                    },
                    "web3": {
                        "type": "movement",
                        "related": ["decentralization", "dapp", "metaverse", "dao"],
                        "sentiment": 0.8,
                        "relevance_score": 0.9
                    }
                },
                "relationships": {
                    "bitcoin": ["ethereum", "blockchain"],
                    "ethereum": ["defi", "nft", "web3"],
                    "defi": ["ethereum", "yield_farming"],
                    "nft": ["ethereum", "digital_art"],
                    "web3": ["ethereum", "decentralization"]
                }
            }
            print("Knowledge graph initialized successfully")
        except Exception as e:
            print(f"Error initializing knowledge graph: {e}")
    
    async def calculate_user_relevance(self, news_item: Dict[str, Any], user_profile: UserProfile) -> float:
        """Calculate relevance score using MeTTa knowledge graph"""
        if not self.knowledge_graph:
            await self.initialize_knowledge_graph()
        
        # Extract entities from news item
        news_entities = self._extract_entities(news_item)
        
        # Calculate base relevance from knowledge graph
        base_relevance = self._calculate_entity_relevance(news_entities)
        
        # Calculate user-specific relevance
        user_relevance = self._calculate_user_specific_relevance(news_entities, user_profile)
        
        # Combine scores (weighted average)
        final_score = (base_relevance * 0.6) + (user_relevance * 0.4)
        
        return min(final_score, 1.0)
    
    def _extract_entities(self, news_item: Dict[str, Any]) -> List[str]:
        """Extract entities from news item using MeTTa NLP"""
        content = (news_item.get('title', '') + ' ' + news_item.get('summary', '')).lower()
        entities = []
        
        # Simple entity extraction (in production, use MeTTa NLP services)
        for entity in self.knowledge_graph.get("entities", {}):
            if entity in content:
                entities.append(entity)
        
        # Extract additional entities from content
        blockchain_terms = [
            "bitcoin", "ethereum", "defi", "nft", "web3", "blockchain",
            "crypto", "mining", "staking", "yield farming", "dao",
            "smart contract", "dapp", "metaverse", "consensus"
        ]
        
        for term in blockchain_terms:
            if term in content and term not in entities:
                entities.append(term)
        
        return entities
    
    def _calculate_entity_relevance(self, entities: List[str]) -> float:
        """Calculate relevance based on entity importance in knowledge graph"""
        if not entities:
            return 0.0
        
        total_score = 0.0
        for entity in entities:
            entity_data = self.knowledge_graph.get("entities", {}).get(entity, {})
            relevance = entity_data.get("relevance_score", 0.0)
            total_score += relevance
        
        return total_score / len(entities) if entities else 0.0
    
    def _calculate_user_specific_relevance(self, entities: List[str], user_profile: UserProfile) -> float:
        """Calculate user-specific relevance based on interests and history"""
        if not entities or not user_profile.interests:
            return 0.0
        
        # Check interest overlap
        interest_overlap = len(set(entities) & set(user_profile.interests))
        interest_score = interest_overlap / len(user_profile.interests) if user_profile.interests else 0.0
        
        # Check reading history overlap
        history_overlap = len(set(entities) & set(user_profile.reading_history))
        history_score = min(history_overlap / 10.0, 1.0)  # Normalize history impact
        
        # Combine scores
        return (interest_score * 0.7) + (history_score * 0.3)
    
    async def update_user_profile(self, user_id: str, news_item: Dict[str, Any], interaction_type: str = "read"):
        """Update user profile based on news interaction"""
        # In a real implementation, this would update the user's profile
        # and potentially update the knowledge graph
        print(f"Updating profile for user {user_id} with {interaction_type} interaction")
        
        # Extract entities from the news item
        entities = self._extract_entities(news_item)
        
        # Update user interests based on interaction
        # This would typically be stored in a database
        return {
            "user_id": user_id,
            "entities": entities,
            "interaction_type": interaction_type,
            "timestamp": datetime.now().isoformat()
        }
    
    async def get_recommendations(self, user_profile: UserProfile, limit: int = 5) -> List[str]:
        """Get personalized recommendations based on MeTTa knowledge graph"""
        if not self.knowledge_graph:
            await self.initialize_knowledge_graph()
        
        recommendations = []
        
        # Find related entities based on user interests
        for interest in user_profile.interests:
            if interest in self.knowledge_graph.get("entities", {}):
                related = self.knowledge_graph.get("relationships", {}).get(interest, [])
                recommendations.extend(related)
        
        # Remove duplicates and limit results
        unique_recommendations = list(set(recommendations))[:limit]
        
        return unique_recommendations
    
    async def analyze_sentiment(self, news_item: Dict[str, Any]) -> Dict[str, float]:
        """Analyze sentiment using MeTTa NLP capabilities"""
        content = news_item.get('title', '') + ' ' + news_item.get('summary', '')
        
        # Simple sentiment analysis (in production, use MeTTa NLP)
        positive_words = ['bullish', 'surge', 'rise', 'growth', 'adoption', 'breakthrough', 'innovation']
        negative_words = ['bearish', 'crash', 'fall', 'decline', 'regulation', 'ban', 'hack']
        
        content_lower = content.lower()
        positive_count = sum(1 for word in positive_words if word in content_lower)
        negative_count = sum(1 for word in negative_words if word in content_lower)
        
        total_words = len(content.split())
        sentiment_score = (positive_count - negative_count) / max(total_words, 1)
        
        return {
            "sentiment": max(-1.0, min(1.0, sentiment_score)),
            "confidence": min(abs(sentiment_score) * 2, 1.0)
        }
