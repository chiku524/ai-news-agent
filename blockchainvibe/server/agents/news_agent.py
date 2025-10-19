# Fetch.ai uAgents-based News Agent
import asyncio
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta
import httpx
from dataclasses import dataclass

@dataclass
class NewsItem:
    id: str
    title: str
    url: str
    source: str
    published_at: datetime
    summary: str
    image_url: str = None
    categories: List[str] = None
    tags: List[str] = None
    relevance_score: float = 0.0
    content: str = None

class NewsAgent:
    """
    Fetch.ai uAgents-based news agent for blockchain news aggregation
    """
    
    def __init__(self):
        self.news_sources = [
            "https://cointelegraph.com/rss",
            "https://coindesk.com/arc/outboundfeeds/rss/?outputType=xml",
            "https://decrypt.co/feed",
            "https://www.theblock.co/rss.xml",
            "https://bitcoinmagazine.com/rss",
        ]
        self.blockchain_keywords = [
            "bitcoin", "ethereum", "blockchain", "crypto", "defi", "nft",
            "web3", "metaverse", "dao", "smart contract", "dapp",
            "consensus", "mining", "staking", "yield farming"
        ]
    
    async def fetch_news_sources(self) -> List[Dict[str, Any]]:
        """Fetch news from multiple blockchain sources"""
        all_news = []
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            tasks = []
            for source in self.news_sources:
                tasks.append(self._fetch_rss_feed(client, source))
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if isinstance(result, list):
                    all_news.extend(result)
                elif isinstance(result, Exception):
                    print(f"Error fetching news: {result}")
        
        return all_news
    
    async def _fetch_rss_feed(self, client: httpx.AsyncClient, url: str) -> List[Dict[str, Any]]:
        """Fetch and parse RSS feed"""
        try:
            response = await client.get(url)
            response.raise_for_status()
            
            # Simple RSS parsing (in production, use feedparser)
            import xml.etree.ElementTree as ET
            root = ET.fromstring(response.text)
            
            news_items = []
            for item in root.findall('.//item'):
                title = item.find('title')
                link = item.find('link')
                description = item.find('description')
                pub_date = item.find('pubDate')
                
                if title is not None and link is not None:
                    news_items.append({
                        'title': title.text or '',
                        'url': link.text or '',
                        'summary': description.text or '' if description is not None else '',
                        'published_at': pub_date.text or datetime.now().isoformat() if pub_date is not None else datetime.now().isoformat(),
                        'source': self._extract_source_name(url)
                    })
            
            return news_items
            
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return []
    
    def _extract_source_name(self, url: str) -> str:
        """Extract source name from URL"""
        if 'cointelegraph' in url:
            return 'CoinTelegraph'
        elif 'coindesk' in url:
            return 'CoinDesk'
        elif 'decrypt' in url:
            return 'Decrypt'
        elif 'theblock' in url:
            return 'The Block'
        elif 'bitcoinmagazine' in url:
            return 'Bitcoin Magazine'
        else:
            return 'Unknown'
    
    def calculate_relevance_score(self, news_item: Dict[str, Any]) -> float:
        """Calculate relevance score based on blockchain keywords"""
        title = news_item.get('title', '').lower()
        summary = news_item.get('summary', '').lower()
        content = title + ' ' + summary
        
        score = 0.0
        for keyword in self.blockchain_keywords:
            if keyword in content:
                score += 1.0
        
        # Normalize score (0-1)
        max_possible_score = len(self.blockchain_keywords)
        return min(score / max_possible_score, 1.0)
    
    async def get_trending_news(self, limit: int = 10) -> List[NewsItem]:
        """Get trending blockchain news with relevance scoring"""
        raw_news = await self.fetch_news_sources()
        
        # Calculate relevance scores
        for item in raw_news:
            item['relevance_score'] = self.calculate_relevance_score(item)
        
        # Sort by relevance score and recency
        sorted_news = sorted(
            raw_news,
            key=lambda x: (x['relevance_score'], x['published_at']),
            reverse=True
        )
        
        # Convert to NewsItem objects
        news_items = []
        for item in sorted_news[:limit]:
            news_items.append(NewsItem(
                id=f"news_{hash(item['url']) % 1000000}",
                title=item['title'],
                url=item['url'],
                source=item['source'],
                published_at=datetime.fromisoformat(item['published_at'].replace('Z', '+00:00')),
                summary=item['summary'],
                relevance_score=item['relevance_score'],
                categories=self._extract_categories(item),
                tags=self._extract_tags(item)
            ))
        
        return news_items
    
    def _extract_categories(self, news_item: Dict[str, Any]) -> List[str]:
        """Extract categories from news item"""
        categories = []
        content = (news_item.get('title', '') + ' ' + news_item.get('summary', '')).lower()
        
        category_mapping = {
            'defi': ['defi', 'decentralized finance', 'yield farming', 'liquidity'],
            'nft': ['nft', 'non-fungible token', 'digital art', 'collectible'],
            'web3': ['web3', 'dapp', 'decentralized app', 'metaverse'],
            'trading': ['trading', 'price', 'market', 'bull', 'bear'],
            'technology': ['blockchain', 'consensus', 'mining', 'staking'],
            'regulation': ['regulation', 'sec', 'government', 'legal']
        }
        
        for category, keywords in category_mapping.items():
            if any(keyword in content for keyword in keywords):
                categories.append(category)
        
        return categories if categories else ['general']
    
    def _extract_tags(self, news_item: Dict[str, Any]) -> List[str]:
        """Extract tags from news item"""
        content = (news_item.get('title', '') + ' ' + news_item.get('summary', '')).lower()
        tags = []
        
        for keyword in self.blockchain_keywords:
            if keyword in content:
                tags.append(keyword)
        
        return tags[:5]  # Limit to 5 tags
