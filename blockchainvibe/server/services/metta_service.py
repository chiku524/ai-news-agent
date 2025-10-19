# SingularityNET MeTTa Knowledge Graph Service
import asyncio
import httpx
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

class MeTTaService:
    """
    Service for interacting with SingularityNET's MeTTa knowledge graph
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or "demo_key"  # In production, use real API key
        self.base_url = base_url or "https://metta.singularitynet.io/api/v1"
        self.session = None
    
    async def __aenter__(self):
        self.session = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            timeout=30.0
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.aclose()
    
    async def query_knowledge_graph(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """Query the MeTTa knowledge graph"""
        try:
            if not self.session:
                await self.__aenter__()
            
            # In a real implementation, this would make actual API calls to MeTTa
            # For now, we'll simulate the response
            response = await self._simulate_metta_query(query, limit)
            return response
            
        except Exception as e:
            print(f"Error querying MeTTa: {e}")
            return {"entities": [], "relationships": [], "error": str(e)}
    
    async def _simulate_metta_query(self, query: str, limit: int) -> Dict[str, Any]:
        """Simulate MeTTa API response for development"""
        # This simulates what a real MeTTa query would return
        blockchain_entities = {
            "bitcoin": {
                "id": "bitcoin",
                "name": "Bitcoin",
                "type": "cryptocurrency",
                "description": "First and largest cryptocurrency by market cap",
                "properties": {
                    "market_cap": "high",
                    "consensus": "proof_of_work",
                    "supply": "limited"
                },
                "relationships": ["blockchain", "mining", "halving"]
            },
            "ethereum": {
                "id": "ethereum",
                "name": "Ethereum",
                "type": "platform",
                "description": "Decentralized platform for smart contracts",
                "properties": {
                    "market_cap": "high",
                    "consensus": "proof_of_stake",
                    "supply": "unlimited"
                },
                "relationships": ["smart_contracts", "defi", "nft"]
            },
            "defi": {
                "id": "defi",
                "name": "DeFi",
                "type": "ecosystem",
                "description": "Decentralized Finance ecosystem",
                "properties": {
                    "total_value_locked": "high",
                    "innovation": "rapid"
                },
                "relationships": ["ethereum", "yield_farming", "liquidity"]
            }
        }
        
        # Simple keyword matching
        query_lower = query.lower()
        matching_entities = []
        
        for entity_id, entity_data in blockchain_entities.items():
            if (entity_id in query_lower or 
                entity_data["name"].lower() in query_lower or
                any(rel in query_lower for rel in entity_data["relationships"])):
                matching_entities.append(entity_data)
        
        return {
            "entities": matching_entities[:limit],
            "relationships": self._get_relationships(matching_entities),
            "query": query,
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_relationships(self, entities: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """Extract relationships between entities"""
        relationships = []
        entity_ids = [entity["id"] for entity in entities]
        
        for entity in entities:
            for rel in entity.get("relationships", []):
                if rel in entity_ids:
                    relationships.append({
                        "source": entity["id"],
                        "target": rel,
                        "type": "related_to"
                    })
        
        return relationships
    
    async def get_entity_embeddings(self, entities: List[str]) -> Dict[str, List[float]]:
        """Get vector embeddings for entities from MeTTa"""
        try:
            if not self.session:
                await self.__aenter__()
            
            # In a real implementation, this would call MeTTa's embedding service
            embeddings = {}
            for entity in entities:
                # Simulate embedding generation
                embeddings[entity] = self._generate_dummy_embedding(entity)
            
            return embeddings
            
        except Exception as e:
            print(f"Error getting embeddings: {e}")
            return {}
    
    def _generate_dummy_embedding(self, entity: str) -> List[float]:
        """Generate dummy embedding for development"""
        # In production, this would be a real embedding from MeTTa
        import hashlib
        hash_obj = hashlib.md5(entity.encode())
        hash_int = int(hash_obj.hexdigest(), 16)
        
        # Generate deterministic "random" vector
        embedding = []
        for i in range(128):  # 128-dimensional embedding
            seed = (hash_int + i) % 1000
            value = (seed / 1000.0) * 2 - 1  # Normalize to [-1, 1]
            embedding.append(value)
        
        return embedding
    
    async def analyze_text_with_metta(self, text: str) -> Dict[str, Any]:
        """Analyze text using MeTTa NLP capabilities"""
        try:
            if not self.session:
                await self.__aenter__()
            
            # In a real implementation, this would call MeTTa's NLP service
            analysis = {
                "entities": self._extract_entities_from_text(text),
                "sentiment": self._analyze_sentiment(text),
                "topics": self._extract_topics(text),
                "confidence": 0.85
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing text with MeTTa: {e}")
            return {"error": str(e)}
    
    def _extract_entities_from_text(self, text: str) -> List[Dict[str, str]]:
        """Extract entities from text using MeTTa NLP"""
        # Simple entity extraction (in production, use MeTTa NLP)
        entities = []
        text_lower = text.lower()
        
        blockchain_terms = {
            "bitcoin": "cryptocurrency",
            "ethereum": "platform",
            "defi": "ecosystem",
            "nft": "technology",
            "blockchain": "technology",
            "crypto": "general",
            "mining": "process",
            "staking": "process"
        }
        
        for term, entity_type in blockchain_terms.items():
            if term in text_lower:
                entities.append({
                    "text": term,
                    "type": entity_type,
                    "confidence": 0.8
                })
        
        return entities
    
    def _analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using MeTTa NLP"""
        # Simple sentiment analysis (in production, use MeTTa NLP)
        positive_words = ['bullish', 'surge', 'rise', 'growth', 'adoption', 'breakthrough']
        negative_words = ['bearish', 'crash', 'fall', 'decline', 'regulation', 'ban']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        total_words = len(text.split())
        if total_words == 0:
            return {"sentiment": 0.0, "confidence": 0.0}
        
        sentiment_score = (positive_count - negative_count) / total_words
        confidence = min(abs(sentiment_score) * 10, 1.0)
        
        return {
            "sentiment": max(-1.0, min(1.0, sentiment_score)),
            "confidence": confidence
        }
    
    def _extract_topics(self, text: str) -> List[str]:
        """Extract topics from text using MeTTa NLP"""
        # Simple topic extraction (in production, use MeTTa NLP)
        topics = []
        text_lower = text.lower()
        
        topic_keywords = {
            "trading": ["price", "market", "bull", "bear", "trading"],
            "technology": ["blockchain", "consensus", "mining", "staking"],
            "defi": ["defi", "yield", "farming", "liquidity", "dex"],
            "nft": ["nft", "art", "collectible", "gaming"],
            "regulation": ["sec", "regulation", "government", "legal"]
        }
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                topics.append(topic)
        
        return topics
    
    async def get_knowledge_graph_stats(self) -> Dict[str, Any]:
        """Get statistics about the MeTTa knowledge graph"""
        try:
            if not self.session:
                await self.__aenter__()
            
            # In a real implementation, this would query MeTTa's stats API
            return {
                "total_entities": 1000000,  # Simulated
                "total_relationships": 5000000,  # Simulated
                "last_updated": datetime.now().isoformat(),
                "coverage": {
                    "blockchain": 0.95,
                    "cryptocurrency": 0.90,
                    "defi": 0.85,
                    "nft": 0.80
                }
            }
            
        except Exception as e:
            print(f"Error getting knowledge graph stats: {e}")
            return {"error": str(e)}
