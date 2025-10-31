# API Reference

Complete reference for the BlockchainVibe REST API. All endpoints support JSON request/response formats.

## 🌐 Base URL

```
Production: https://api.blockchainvibe.com
Development: http://localhost:8787
```

## 🔐 Authentication

Most endpoints require authentication using JWT tokens obtained via OAuth.

### Getting a Token

1. Authenticate via OAuth (Google, GitHub, Twitter/X, Discord)
2. Receive JWT token in response
3. Include token in `Authorization` header for subsequent requests

### Using Tokens

Include the JWT token in the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Expiration

Tokens expire after **30 minutes**. Refresh tokens are not currently supported - re-authenticate to get a new token.

## 📊 Response Format

All API responses follow this structure:

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Common Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 🏥 Health Check

### GET /api/health

Check API health and status.

**No authentication required**

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "oauth": "configured"
  }
}
```

---

## 🔑 Authentication APIs

### POST /api/auth/google

Authenticate with Google OAuth.

#### Request Body

```json
{
  "code": "oauth_authorization_code",
  "redirect_uri": "http://localhost:3000/auth/callback"
}
```

#### Response

```json
{
  "success": true,
  "access_token": "jwt_token_here",
  "user": {
    "id": "google_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "provider": "google"
  }
}
```

### POST /api/auth/github

Authenticate with GitHub OAuth.

#### Request Body

```json
{
  "code": "oauth_authorization_code",
  "redirect_uri": "http://localhost:3000/auth/callback"
}
```

#### Response

```json
{
  "success": true,
  "access_token": "jwt_token_here",
  "user": {
    "id": "github_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "provider": "github"
  }
}
```

### POST /api/auth/callback

Handle OAuth callback (internal use).

---

## 👤 User APIs

### GET /api/user/profile

Get current user's profile.

**Authentication required**

#### Response

```json
{
  "success": true,
  "user": {
    "user_id": "user_123",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "provider": "google",
    "profile_picture": "https://...",
    "banner_image": "https://...",
    "bio": "User bio",
    "location": "Location",
    "website": "https://...",
    "twitter": "@username",
    "linkedin": "linkedin.com/in/username",
    "profile_completed": true,
    "created_at": "2025-01-01T00:00:00Z",
    "last_login": "2025-01-15T10:00:00Z"
  }
}
```

### PUT /api/user/profile

Update user profile.

**Authentication required**

#### Request Body

```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "location": "New Location",
  "website": "https://example.com",
  "twitter": "@newusername",
  "linkedin": "linkedin.com/in/newusername"
}
```

#### Response

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### POST /api/user/activity

Track user activity (read, like, save, etc.).

**Authentication required**

#### Request Body

```json
{
  "type": "read",
  "article_id": "article_123",
  "article_title": "Article Title",
  "article_source": "CoinDesk",
  "duration_ms": 45000,
  "metadata": {
    "category": "bitcoin",
    "read_percentage": 85
  }
}
```

#### Activity Types

- `read` - User read an article
- `like` - User liked an article
- `save` - User saved/bookmarked an article
- `share` - User shared an article
- `view` - User viewed an article

#### Response

```json
{
  "success": true,
  "message": "Activity tracked"
}
```

### GET /api/user/likes

Get user's liked articles.

**Authentication required**

#### Query Parameters

- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

#### Response

```json
{
  "success": true,
  "articles": [
    {
      "id": "article_123",
      "title": "Article Title",
      "url": "https://...",
      "source": "CoinDesk",
      "published_at": "2025-01-15T10:00:00Z",
      "summary": "Article summary...",
      "image_url": "https://...",
      "categories": ["bitcoin"],
      "relevance_score": 0.85,
      "liked_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total_count": 42,
  "limit": 20,
  "offset": 0
}
```

### GET /api/user/saved

Get user's saved articles.

**Authentication required**

#### Query Parameters

- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

#### Response

Same format as `/api/user/likes`

---

## 📰 News APIs

### POST /api/news/trending

Get trending news articles.

**No authentication required** (better results with authentication)

#### Request Body

```json
{
  "limit": 20,
  "timeFilter": "24h",
  "categoryFilter": "all",
  "sortBy": "engagement"
}
```

#### Parameters

- `limit` (optional): Number of articles (default: 20, max: 100)
- `timeFilter` (optional): `1h`, `24h`, `7d`, `30d` (default: `24h`)
- `categoryFilter` (optional): `all`, `bitcoin`, `ethereum`, `defi`, `nft`, `layer2`, etc. (default: `all`)
- `sortBy` (optional): `engagement`, `date`, `relevance` (default: `engagement`)

#### Response

```json
{
  "articles": [
    {
      "id": "article_123",
      "title": "Bitcoin Reaches New All-Time High",
      "url": "https://...",
      "source": "CoinDesk",
      "published_at": "2025-01-15T10:00:00Z",
      "summary": "Bitcoin price surges to new highs...",
      "content": "Full article content...",
      "image_url": "https://...",
      "author": "Author Name",
      "categories": ["bitcoin", "trading"],
      "tags": ["bitcoin", "price", "ath"],
      "relevance_score": 0.92,
      "engagement_metrics": {
        "likes": 150,
        "views": 2500,
        "comments": 45
      },
      "entities": [
        {
          "type": "cryptocurrency",
          "name": "Bitcoin",
          "confidence": 0.95
        }
      ]
    }
  ],
  "total_count": 150,
  "last_updated": "2025-01-15T10:30:00Z",
  "type": "trending"
}
```

### POST /api/news/personalized

Get personalized news articles for the authenticated user.

**Authentication required**

#### Request Body

```json
{
  "limit": 20,
  "timeFilter": "24h",
  "categoryFilter": "all",
  "sortBy": "relevance"
}
```

#### Parameters

Same as `/api/news/trending`, but sorted by relevance by default.

#### Response

Same format as `/api/news/trending`, but articles include:

```json
{
  "relevance_score": 0.95,
  "personalized_score": 0.88,
  "personalization_factors": [
    "matches_interest:bitcoin",
    "preferred_source",
    "matches_topic:trading"
  ]
}
```

### POST /api/news/search

Search news articles.

**No authentication required** (better results with authentication)

#### Request Body

```json
{
  "query": "ethereum upgrade",
  "limit": 20,
  "categoryFilter": "all",
  "timeFilter": "7d"
}
```

#### Parameters

- `query` (required): Search query string
- `limit` (optional): Number of results (default: 20, max: 100)
- `categoryFilter` (optional): Filter by category
- `timeFilter` (optional): Filter by time

#### Response

Same format as `/api/news/trending`

### GET /api/news/:articleId

Get detailed information about a specific article.

**No authentication required**

#### Response

```json
{
  "success": true,
  "article": {
    "id": "article_123",
    "title": "Article Title",
    "url": "https://...",
    "source": "CoinDesk",
    "published_at": "2025-01-15T10:00:00Z",
    "summary": "Summary...",
    "content": "Full content...",
    "image_url": "https://...",
    "author": "Author Name",
    "categories": ["bitcoin"],
    "tags": ["bitcoin", "price"],
    "relevance_score": 0.92,
    "engagement_metrics": {
      "likes": 150,
      "views": 2500,
      "comments": 45
    },
    "entities": [
      {
        "type": "cryptocurrency",
        "name": "Bitcoin",
        "confidence": 0.95
      }
    ],
    "related_articles": [
      {
        "id": "article_456",
        "title": "Related Article",
        "url": "https://...",
        "relevance_score": 0.85
      }
    ]
  }
}
```

---

## 📊 Analytics APIs

### GET /api/analytics/summary

Get analytics summary for the authenticated user.

**Authentication required**

#### Response

```json
{
  "success": true,
  "articlesRead": 150,
  "timeSpentMinutes": 450,
  "readingTrendsByDay": [
    {
      "dow": "0",
      "cnt": 25
    }
  ],
  "topSources": [
    {
      "source": "CoinDesk",
      "cnt": 45
    }
  ],
  "peakReadingHour": 14,
  "avgReadSeconds": 180
}
```

### GET /api/ai/insights

Get AI-powered insights about the user's reading patterns.

**Authentication required**

#### Response

```json
{
  "success": true,
  "insights": [
    {
      "type": "reading_pattern",
      "content": "You typically read around 14:00",
      "confidence": 0.85
    },
    {
      "type": "content_preference",
      "content": "Most-read source this week: CoinDesk",
      "confidence": 0.90
    },
    {
      "type": "trend_analysis",
      "content": "Growing interest in NFTs (25% increase)",
      "confidence": 0.75
    }
  ]
}
```

---

## 🤖 Agent APIs

### POST /api/chat/message

Send a message to an AI agent via Chat Protocol.

**Authentication required**

#### Request Body

```json
{
  "agent_id": "blockchainvibe-news-fetcher",
  "message_type": "query",
  "content": "What are the latest Bitcoin news?",
  "conversation_id": "conv_123"
}
```

#### Parameters

- `agent_id` (required): Agent ID (`blockchainvibe-news-fetcher` or `blockchainvibe-relevance-scorer`)
- `message_type` (required): `text`, `query`, `command`, `feedback`
- `content` (required): Message content
- `conversation_id` (optional): Conversation ID for context

#### Response

```json
{
  "message_id": "msg_123",
  "agent_id": "blockchainvibe-news-fetcher",
  "user_id": "user_123",
  "message_type": "query_response",
  "content": "Here are the latest Bitcoin news articles...",
  "data": {
    "query": "What are the latest Bitcoin news?",
    "results": [
      {
        "title": "Bitcoin Article",
        "url": "https://..."
      }
    ]
  },
  "metadata": {
    "processing_time": 250,
    "query_type": "news_search"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### GET /api/agents

Get list of available agents.

**No authentication required**

#### Response

```json
{
  "success": true,
  "agents": [
    {
      "id": "blockchainvibe-news-fetcher",
      "name": "BlockchainVibe News Fetcher",
      "description": "Fetches and processes blockchain news",
      "capabilities": ["news_fetching", "content_processing", "quality_scoring"],
      "status": "active",
      "endpoint": "http://localhost:8001/submit",
      "asione_compatible": true
    },
    {
      "id": "blockchainvibe-relevance-scorer",
      "name": "BlockchainVibe Relevance Scorer",
      "description": "Calculates personalized relevance scores",
      "capabilities": ["relevance_scoring", "personalization", "user_profiling"],
      "status": "active",
      "endpoint": "http://localhost:8003/submit",
      "asione_compatible": true
    }
  ]
}
```

### GET /api/metta/status

Check MeTTa Knowledge Graph integration status.

**No authentication required**

#### Response

```json
{
  "success": true,
  "available": true,
  "stats": {
    "queries_processed": 15000,
    "entities_extracted": 45000,
    "relationships_mapped": 23000
  }
}
```

---

## 🔧 Utility APIs

### GET /api/categories

Get list of available news categories.

**No authentication required**

#### Response

```json
{
  "success": true,
  "categories": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "keywords": ["bitcoin", "btc", "satoshi"]
    },
    {
      "id": "ethereum",
      "name": "Ethereum",
      "keywords": ["ethereum", "eth", "ethereum 2.0"]
    },
    {
      "id": "defi",
      "name": "DeFi",
      "keywords": ["defi", "decentralized finance", "yield farming"]
    }
  ]
}
```

### POST /api/upload

Upload file (profile picture, banner image).

**Authentication required**

#### Request

Multipart form data with file field.

#### Response

```json
{
  "success": true,
  "url": "https://r2.cloudflare.com/uploads/...",
  "filename": "profile_picture.jpg",
  "size": 123456
}
```

---

## 🚨 Rate Limiting

API requests are rate-limited to ensure fair usage:

- **Unauthenticated**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Agent APIs**: 50 requests/hour per agent

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1642233600
```

## 📝 Example Usage

### JavaScript/Fetch

```javascript
// Get trending news
const response = await fetch('https://api.blockchainvibe.com/api/news/trending', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    limit: 20,
    timeFilter: '24h',
    categoryFilter: 'bitcoin'
  })
});

const data = await response.json();
console.log(data.articles);
```

### cURL

```bash
curl -X POST https://api.blockchainvibe.com/api/news/trending \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "limit": 20,
    "timeFilter": "24h",
    "categoryFilter": "bitcoin"
  }'
```

### Python

```python
import requests

url = "https://api.blockchainvibe.com/api/news/trending"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}
data = {
    "limit": 20,
    "timeFilter": "24h",
    "categoryFilter": "bitcoin"
}

response = requests.post(url, json=data, headers=headers)
articles = response.json()["articles"]
```

---

**Need help?** Check out the [AI Integration Guide](./ai-integration.md) or contact support.

