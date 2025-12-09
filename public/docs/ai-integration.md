# AI Integration Guide

Complete guide to BlockchainVibe's AI architecture, including Fetch.ai uAgents, SingularityNET MeTTa Knowledge Graph, and Chat Protocol integration.

## 🎯 Overview

BlockchainVibe leverages cutting-edge AI technologies to deliver intelligent news aggregation and personalization:

- **Fetch.ai uAgents Framework**: Autonomous agents for news processing
- **SingularityNET MeTTa Knowledge Graph**: Enhanced entity extraction and reasoning
- **Chat Protocol**: ASI:One compatible human-agent interaction

## 🤖 Fetch.ai uAgents

### Architecture

BlockchainVibe uses two specialized uAgents that work continuously in the background:

1. **News Fetcher Agent** - Fetches and processes news
2. **Relevance Scorer Agent** - Calculates personalized relevance scores

### News Fetcher Agent

**Agent ID**: `blockchainvibe-news-fetcher`

**Capabilities**:
- Fetch news from multiple RSS sources
- Parse and extract metadata
- Score article quality
- Categorize content
- Extract entities and tags

**Endpoint**: `http://localhost:8001/submit` (development)

**Agent Configuration**:
```python
agent = Agent(
    name="news_fetcher",
    seed="blockchainvibe_news_fetcher_2024",
    port=8001,
    endpoint=["http://localhost:8001/submit"]
)
```

**Message Format**:
```json
{
  "action": "process_news",
  "data": [
    {
      "title": "Article Title",
      "url": "https://...",
      "source": "CoinDesk",
      "published_at": "2025-01-15T10:00:00Z",
      "summary": "Article summary..."
    }
  ],
  "user_profile": null
}
```

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "id": "article_123",
      "title": "Article Title",
      "processed_by": "news_fetcher",
      "quality_score": 0.85,
      "language": "en",
      "word_count": 250,
      "has_image": true,
      "source_credibility": 0.9,
      "processing_timestamp": "2025-01-15T10:30:00Z"
    }
  ],
  "processing_time": 0.45,
  "agent_name": "news_fetcher"
}
```

**Quality Scoring Algorithm**:
- **Title Quality**: 0.1 (if length between 20-200 chars)
- **Summary Quality**: 0.1 (if length > 50 chars)
- **Source Credibility**: 0.2 (Tier 1 sources: 0.9, Tier 2: 0.7, Tier 3: 0.5)
- **Image Presence**: 0.1
- **Recency**: 0.1 (if < 24 hours old)

**Source Credibility Tiers**:
- **Tier 1** (0.9): CoinDesk, CoinTelegraph, Decrypt, The Block
- **Tier 2** (0.7): CryptoSlate, Bitcoin Magazine, Ethereum Foundation
- **Tier 3** (0.5): Medium, Substack, Blogs

### Relevance Scorer Agent

**Agent ID**: `blockchainvibe-relevance-scorer`

**Capabilities**:
- Calculate personalized relevance scores
- Analyze user profiles
- Predict engagement potential
- Provide personalization factors

**Endpoint**: `http://localhost:8003/submit` (development)

**Agent Configuration**:
```python
agent = Agent(
    name="relevance_scorer",
    seed="blockchainvibe_relevance_scorer_2024",
    port=8003,
    endpoint=["http://localhost:8003/submit"]
)
```

**Message Format**:
```json
{
  "action": "calculate_relevance",
  "data": [
    {
      "id": "article_123",
      "title": "Article Title",
      "summary": "Article summary...",
      "categories": ["bitcoin"]
    }
  ],
  "user_profile": {
    "interests": ["bitcoin", "trading"],
    "reading_history": ["Bitcoin price", "Ethereum"],
    "preferred_sources": ["CoinDesk"],
    "topic_preferences": ["trading", "bitcoin"],
    "reading_time_preference": "medium"
  }
}
```

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "id": "article_123",
      "title": "Article Title",
      "processed_by": "relevance_scorer",
      "relevance_score": 0.92,
      "personalized_score": 0.88,
      "engagement_potential": 0.85,
      "recency_score": 0.9,
      "personalization_factors": [
        "matches_interest:bitcoin",
        "preferred_source",
        "matches_topic:trading"
      ],
      "processing_timestamp": "2025-01-15T10:30:00Z"
    }
  ],
  "processing_time": 0.32,
  "agent_name": "relevance_scorer"
}
```

**Relevance Scoring Algorithm**:

Final score = weighted combination of:

1. **Base Relevance** (30%): General relevance to blockchain community
2. **Personalized Score** (40%): Match with user interests and history
3. **Engagement Potential** (20%): Likelihood of user engagement
4. **Recency Score** (10%): How fresh the article is

**Personalized Score Factors**:
- Interest matching: +0.2 per matched interest
- Reading history: +0.1 per matched history item
- Preferred sources: +0.15 if from preferred source
- Topic preferences: +0.1 per matched topic
- Reading time preference: +0.1 if matches preferred length

**Engagement Potential Factors**:
- Title characteristics: +0.1 (optimal length 30-100 chars)
- Emotional words: +0.1 (breakthrough, revolutionary, exclusive, etc.)
- Question in title: +0.05
- Image presence: +0.1
- Source credibility: up to +0.2
- Quality score: up to +0.1

### Agent Communication

Agents communicate asynchronously using uAgents message protocol:

```python
from uagents import Agent, Context, Model

# Send message to agent
await agent.send(agent_address, message)

# Receive message
@agent.on_message(model=NewsRequest)
async def handle_message(ctx: Context, sender: str, msg: NewsRequest):
    # Process message
    response = NewsResponse(...)
    await ctx.send(sender, response)
```

### Running Agents Locally

1. **Install Dependencies**:
```bash
cd server/agents
pip install -r requirements.txt
```

2. **Start Agents**:
```bash
python run_agents.py
```

This starts both agents on ports 8001 and 8003.

3. **Verify Agents**:
```bash
curl http://localhost:8001/health
curl http://localhost:8003/health
```

## 🧠 SingularityNET MeTTa Knowledge Graph

### Overview

MeTTa (Meta Type Theory) Knowledge Graph provides enhanced reasoning and entity extraction capabilities for BlockchainVibe.

### Integration

**Endpoint**: Configured via `METTA_ENDPOINT` environment variable
**API Key**: Set via `METTA_API_KEY` environment variable

### Key Features

#### Entity Extraction

Extract blockchain entities from article content:

```javascript
const entities = await mettaIntegration.extractEntitiesWithMeTTa(
  "Bitcoin price surged after Ethereum upgrade announcement"
);
```

**Response**:
```json
{
  "entities": [
    {
      "name": "Bitcoin",
      "type": "cryptocurrency",
      "confidence": 0.95,
      "properties": {
        "symbol": "BTC",
        "category": "cryptocurrency"
      }
    },
    {
      "name": "Ethereum",
      "type": "cryptocurrency",
      "confidence": 0.92,
      "properties": {
        "symbol": "ETH",
        "category": "blockchain_platform"
      }
    }
  ],
  "source": "metta",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### Categorization

Smart categorization using knowledge graph:

```javascript
const categories = await mettaIntegration.categorizeWithMeTTa(
  "DeFi protocol announces yield farming rewards"
);
```

**Response**:
```json
{
  "concepts": [
    {
      "category": "DeFi",
      "confidence": 0.88,
      "reasoning": "Article mentions DeFi protocol and yield farming",
      "source": "metta"
    }
  ]
}
```

#### Relevance Calculation

Calculate relevance using knowledge graph:

```javascript
const relevance = await mettaIntegration.calculateRelevanceWithMeTTa(
  article,
  userProfile
);
```

**Response**:
```json
{
  "relevance_score": 0.92,
  "reasoning": "Article matches user interests in DeFi and yield farming",
  "matched_concepts": [
    {
      "concept": "yield_farming",
      "relevance": 0.88
    }
  ],
  "source": "metta"
}
```

### MeTTa Query Format

```javascript
const result = await mettaIntegration.queryKnowledge(
  "Extract blockchain entities from this article",
  {
    type: "entity_extraction",
    domain: "blockchain",
    format: "structured"
  }
);
```

### Fallback Behavior

If MeTTa is unavailable, the system falls back to basic processing:

```javascript
{
  "entities": [],
  "relationships": [],
  "concepts": [],
  "confidence": 0.5,
  "source": "fallback",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 💬 Chat Protocol Integration

### Overview

Chat Protocol enables human-agent interaction and ASI:One compatibility.

### Agent Registration

Agents are automatically registered with Chat Protocol:

```javascript
await chatProtocol.registerAgent({
  id: 'blockchainvibe-news-fetcher',
  name: 'BlockchainVibe News Fetcher',
  description: 'Fetches and processes blockchain news',
  capabilities: ['news_fetching', 'content_processing', 'quality_scoring'],
  endpoint: 'http://localhost:8001/submit',
  asione_compatible: true
});
```

### Message Types

#### Text Messages

```json
{
  "agent_id": "blockchainvibe-news-fetcher",
  "message_type": "text",
  "content": "What's the latest Bitcoin news?",
  "conversation_id": "conv_123"
}
```

#### Query Messages

```json
{
  "agent_id": "blockchainvibe-relevance-scorer",
  "message_type": "query",
  "content": "Calculate relevance for these articles",
  "data": {
    "articles": [...],
    "user_profile": {...}
  },
  "conversation_id": "conv_123"
}
```

#### Command Messages

```json
{
  "agent_id": "blockchainvibe-news-fetcher",
  "message_type": "command",
  "content": "refresh_news_sources",
  "conversation_id": "conv_123"
}
```

#### Feedback Messages

```json
{
  "agent_id": "blockchainvibe-relevance-scorer",
  "message_type": "feedback",
  "content": "Relevance score was too high",
  "conversation_id": "conv_123"
}
```

### Agent Discovery

Discover available agents:

```javascript
const agents = await chatProtocol.getAvailableAgents();
```

**Response**:
```json
{
  "agents": [
    {
      "id": "blockchainvibe-news-fetcher",
      "name": "BlockchainVibe News Fetcher",
      "description": "Fetches and processes blockchain news",
      "capabilities": ["news_fetching", "content_processing"],
      "status": "active",
      "asione_compatible": true
    }
  ]
}
```

### Conversation Management

```javascript
// Get conversation history
const conversation = chatProtocol.getConversationHistory("conv_123");

// Create new conversation
const conversation = chatProtocol.getOrCreateConversation("conv_123", "user_123");
```

## 🔄 Integration Workflow

### Complete News Processing Flow

1. **News Fetcher Agent** fetches raw articles from RSS feeds
2. **MeTTa Knowledge Graph** extracts entities and categorizes
3. **News Fetcher Agent** processes and scores quality
4. **Relevance Scorer Agent** calculates personalized scores
5. **MeTTa Knowledge Graph** provides reasoning for scores
6. Articles stored with all metadata and scores

### Example Integration

```javascript
// 1. Fetch news
const newsItems = await newsAggregator.fetchFromRSSFeeds(50);

// 2. Process with News Fetcher Agent
const processedNews = await uAgentsIntegration.processNewsWithAgents(
  newsItems,
  null
);

// 3. Enhance with MeTTa
const enhancedNews = await uAgentsIntegration.processNewsWithMeTTa(
  processedNews,
  userProfile
);

// 4. Calculate relevance with Relevance Scorer Agent
const scoredNews = await relevanceScorerAgent.calculateRelevance(
  enhancedNews,
  userProfile
);

// 5. Return personalized results
return scoredNews.sort((a, b) => b.relevance_score - a.relevance_score);
```

## 🛠️ Configuration

### Environment Variables

```bash
# MeTTa Knowledge Graph
METTA_ENDPOINT=https://metta.singularitynet.io/api
METTA_API_KEY=your_metta_api_key

# ASI:One Interface (optional)
ASI_ONE_ENDPOINT=https://asi.one/api
ASI_ONE_API_KEY=your_asi_one_api_key

# Agent Endpoints
NEWS_FETCHER_ENDPOINT=http://localhost:8001/submit
RELEVANCE_SCORER_ENDPOINT=http://localhost:8003/submit
```

### Cloudflare Workers Setup

```bash
wrangler secret put METTA_ENDPOINT
wrangler secret put METTA_API_KEY
```

## 📊 Monitoring & Analytics

### Agent Status

```javascript
const status = uAgentsIntegration.getAgentStatus();
```

**Response**:
```json
{
  "news_fetcher": {
    "status": "active",
    "lastActivity": "2025-01-15T10:30:00Z",
    "capabilities": ["fetch_rss", "parse_content", "extract_metadata"]
  },
  "relevance_scorer": {
    "status": "active",
    "lastActivity": "2025-01-15T10:30:00Z",
    "capabilities": ["calculate_relevance", "personalize_content"]
  }
}
```

### MeTTa Status

```javascript
const mettaStatus = uAgentsIntegration.getMeTTaStatus();
```

**Response**:
```json
{
  "available": true,
  "stats": {
    "queries_processed": 15000,
    "entities_extracted": 45000,
    "relationships_mapped": 23000
  }
}
```

### Chat Protocol Stats

```javascript
const stats = chatProtocol.getStats();
```

**Response**:
```json
{
  "total_agents": 2,
  "active_agents": 2,
  "total_conversations": 1250,
  "total_messages": 8750
}
```

## 🚀 Best Practices

### Agent Usage

1. **Batch Processing**: Process multiple articles in batches for efficiency
2. **Error Handling**: Always handle agent unavailability gracefully
3. **Caching**: Cache agent responses when appropriate
4. **Timeouts**: Set reasonable timeouts for agent requests

### MeTTa Integration

1. **Entity Extraction**: Use MeTTa for accurate entity extraction
2. **Categorization**: Leverage MeTTa's reasoning for better categorization
3. **Relevance**: Combine MeTTa results with agent calculations
4. **Fallback**: Always have fallback logic when MeTTa is unavailable

### Chat Protocol

1. **Conversation IDs**: Use unique conversation IDs for context
2. **Message Types**: Choose appropriate message types
3. **Error Handling**: Handle agent errors gracefully
4. **Discovery**: Use agent discovery to find available agents

---

**Next Steps**: Check out the [API Reference](./api-reference.md) for detailed endpoint documentation.

