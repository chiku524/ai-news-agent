# Architecture & Infrastructure

Complete overview of BlockchainVibe's technical architecture, infrastructure, and system design.

## 🎯 Overview

BlockchainVibe is built on a modern, scalable architecture leveraging cloud-native technologies and AI-powered services for optimal performance and user experience.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              Cloudflare Pages - Global CDN              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Backend (Cloudflare Workers)              │
│                   Serverless Edge Functions             │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼────┐ ┌──────▼──────┐ ┌─────▼──────┐
│   Cloudflare│ │ Cloudflare  │ │ Cloudflare │
│      D1     │ │      R2     │ │  Workers   │
│  (Database) │ │  (Storage)  │ │  (Agents)  │
└─────────────┘ └─────────────┘ └────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼────┐ ┌──────▼──────┐ ┌─────▼──────┐
│  Fetch.ai  │ │ Singularity │ │   ASI:One │
│  uAgents   │ │    MeTTa    │ │  Protocol │
└────────────┘ └─────────────┘ └───────────┘
```

### Technology Stack

#### Frontend

- **Framework**: React 18
- **Styling**: Styled Components, CSS Modules
- **Routing**: React Router v6
- **State Management**: React Context API, Custom Hooks
- **HTTP Client**: Axios
- **Charts**: Chart.js, Recharts
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages

#### Backend

- **Runtime**: Cloudflare Workers (V8 isolates)
- **Language**: JavaScript (ES6+)
- **Database**: Cloudflare D1 (SQLite-based)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Caching**: Cloudflare Cache API
- **Authentication**: OAuth 2.0, JWT

#### AI Services

- **Agents**: Fetch.ai uAgents Framework
- **Knowledge Graph**: SingularityNET MeTTa
- **Protocol**: Chat Protocol (ASI:One compatible)
- **Language**: Python 3.8+ (agents)

## 🌐 Infrastructure

### Cloudflare Edge Network

BlockchainVibe leverages Cloudflare's global edge network:

#### Benefits

- **Low Latency**: Content served from nearest edge location
- **High Availability**: 99.9% uptime SLA
- **DDoS Protection**: Built-in protection at edge
- **Global Scale**: 200+ data centers worldwide
- **Cost Effective**: Pay-per-use serverless pricing

#### Components

##### Cloudflare Pages

**Purpose**: Frontend hosting and deployment

**Features**:
- Automatic deployments from Git
- Preview deployments for PRs
- Custom domains and SSL
- Edge caching
- Global CDN distribution

**Configuration**:
```toml
[build]
command = "npm run build"
output = "build"
```

##### Cloudflare Workers

**Purpose**: Serverless backend API

**Features**:
- Edge computing at 200+ locations
- Zero cold starts
- Request/response manipulation
- API routing and middleware
- Integration with D1, R2, KV

**Limits**:
- CPU time: 50ms (free), 50ms (paid), 30s (unbound)
- Memory: 128MB per request
- Requests: 100,000/day (free), unlimited (paid)

##### Cloudflare D1

**Purpose**: SQLite-based edge database

**Features**:
- SQLite compatibility
- Edge replication
- Automatic backups
- ACID transactions
- Query optimization

**Database Schema**:

```sql
-- Users table
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  provider TEXT NOT NULL,
  profile_picture TEXT,
  banner_image TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  twitter TEXT,
  linkedin TEXT,
  profile_completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1
);

-- User activity table
CREATE TABLE user_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  article_id TEXT,
  article_title TEXT,
  article_source TEXT,
  duration_ms INTEGER DEFAULT 0,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

##### Cloudflare R2

**Purpose**: Object storage for user uploads

**Features**:
- S3-compatible API
- No egress fees
- Automatic scaling
- Global distribution
- Custom domains

**Use Cases**:
- Profile pictures
- Banner images
- Article thumbnails (cached)
- Static assets

## 🤖 AI Architecture

### Agent Architecture

```
┌──────────────────────────────────────────────────┐
│           News Fetcher Agent (uAgent)             │
│  ┌────────────────────────────────────────────┐  │
│  │  • RSS Feed Fetching                      │  │
│  │  • Content Parsing                        │  │
│  │  • Quality Scoring                        │  │
│  │  • Metadata Extraction                    │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────┘
                       │
                       │ Processed Articles
                       │
┌──────────────────────▼───────────────────────────┐
│       Relevance Scorer Agent (uAgent)           │
│  ┌────────────────────────────────────────────┐ │
│  │  • User Profiling                          │ │
│  │  • Relevance Calculation                   │ │
│  │  • Personalization                        │ │
│  │  • Engagement Prediction                  │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────┘
                       │
                       │ Enhanced Articles
                       │
┌──────────────────────▼───────────────────────────┐
│        MeTTa Knowledge Graph Integration        │
│  ┌────────────────────────────────────────────┐ │
│  │  • Entity Extraction                       │ │
│  │  • Relationship Mapping                   │ │
│  │  • Categorization                          │ │
│  │  • Relevance Reasoning                     │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Agent Communication

Agents communicate via Fetch.ai uAgents protocol:

1. **Message Format**: JSON-based messages
2. **Transport**: HTTP/REST
3. **Discovery**: Agent addresses managed by protocol
4. **Scheduling**: Event-driven and periodic tasks

### MeTTa Integration

MeTTa Knowledge Graph enhances articles with:

- **Entity Extraction**: Blockchain entities (projects, tokens, people)
- **Relationship Mapping**: Entity relationships
- **Categorization**: Smart category assignment
- **Reasoning**: Explains relevance calculations

## 📊 Data Flow

### News Processing Flow

```
1. RSS Feeds / News APIs
   │
   ▼
2. News Aggregator Service
   │
   ▼
3. News Fetcher Agent (uAgent)
   ├─ Parse content
   ├─ Extract metadata
   └─ Score quality
   │
   ▼
4. MeTTa Knowledge Graph
   ├─ Extract entities
   ├─ Map relationships
   └─ Categorize
   │
   ▼
5. Relevance Scorer Agent (uAgent)
   ├─ Calculate relevance
   ├─ Personalize scores
   └─ Predict engagement
   │
   ▼
6. Cloudflare D1 (Database)
   └─ Store processed articles
   │
   ▼
7. Frontend (Cloudflare Pages)
   └─ Display to users
```

### User Activity Flow

```
1. User Action (Read, Like, Save)
   │
   ▼
2. Frontend API Call
   │
   ▼
3. Cloudflare Worker
   ├─ Authenticate user
   └─ Validate request
   │
   ▼
4. Cloudflare D1
   ├─ Store activity
   └─ Update user stats
   │
   ▼
5. Relevance Scorer Agent (async)
   ├─ Update user profile
   └─ Recalculate recommendations
   │
   ▼
6. Frontend Update
   └─ Refresh recommendations
```

## 🔐 Security

### Authentication & Authorization

#### OAuth 2.0 Flow

1. User clicks "Sign In" with provider
2. Redirect to OAuth provider
3. User authorizes BlockchainVibe
4. Provider returns authorization code
5. Backend exchanges code for tokens
6. Backend creates JWT token
7. Frontend stores JWT token
8. JWT used for authenticated requests

#### JWT Token Structure

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "provider": "google",
  "exp": 1642233600,
  "iat": 1642230000
}
```

#### Token Security

- **Expiration**: 30 minutes
- **Algorithm**: HS256
- **Storage**: HTTP-only cookies (coming soon)
- **Validation**: Server-side validation on every request

### Data Security

#### Encryption

- **In Transit**: HTTPS/TLS 1.3
- **At Rest**: Database encryption (D1)
- **Storage**: Encrypted object storage (R2)

#### Privacy

- **User Data**: Only used for personalization
- **Activity Tracking**: Anonymous analytics
- **Third-Party**: No data sharing
- **GDPR**: Full compliance

### API Security

- **Rate Limiting**: Prevent abuse
- **CORS**: Configured for allowed origins
- **Input Validation**: All inputs validated
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Content sanitization

## 📈 Scalability

### Horizontal Scaling

- **Workers**: Automatically scale with traffic
- **Pages**: Global CDN distribution
- **D1**: Edge replication
- **R2**: Automatic scaling

### Performance Optimization

#### Caching Strategy

- **Edge Caching**: Cloudflare Cache API
- **CDN Caching**: Static assets cached at edge
- **Database Queries**: Optimized queries with indexes
- **Agent Responses**: Cache agent responses when appropriate

#### Database Optimization

- **Indexes**: Strategic indexes on frequently queried columns
- **Query Optimization**: Efficient queries with proper joins
- **Connection Pooling**: Managed by Cloudflare
- **Edge Replication**: Fast reads from edge locations

#### Frontend Optimization

- **Code Splitting**: Lazy loading components
- **Asset Optimization**: Minified and compressed assets
- **Image Optimization**: WebP format, responsive images
- **Bundle Size**: Tree shaking, dead code elimination

## 🔄 Deployment

### CI/CD Pipeline

```
1. Code Commit (GitHub)
   │
   ▼
2. GitHub Actions
   ├─ Run tests
   ├─ Build frontend
   └─ Deploy to Cloudflare
   │
   ▼
3. Cloudflare Pages
   ├─ Build frontend
   └─ Deploy to edge
   │
   ▼
4. Cloudflare Workers
   ├─ Deploy backend
   └─ Update environment
```

### Deployment Process

1. **Development**: Local development with Wrangler CLI
2. **Staging**: Preview deployments for testing
3. **Production**: Automatic deployments from main branch

### Environment Management

- **Development**: Local environment variables
- **Staging**: Cloudflare environment variables
- **Production**: Cloudflare secrets

## 📊 Monitoring & Analytics

### Monitoring

- **Uptime Monitoring**: Cloudflare Analytics
- **Error Tracking**: Error logging in Workers
- **Performance Metrics**: Request timing and duration
- **Agent Status**: Monitor agent availability

### Analytics

- **User Analytics**: Reading patterns and engagement
- **API Analytics**: Request counts and errors
- **Agent Analytics**: Agent processing times and success rates
- **System Analytics**: Infrastructure metrics

## 🚀 Future Enhancements

### Planned Improvements

- **Caching Layer**: Redis for advanced caching
- **Message Queue**: Queue for async processing
- **WebSockets**: Real-time updates
- **GraphQL API**: GraphQL endpoint
- **Mobile Apps**: Native iOS and Android apps
- **Newsletter**: Email newsletter service

### Scalability Roadmap

- **Multi-Region**: Deploy to multiple regions
- **Database Sharding**: Shard database for scale
- **CDN Optimization**: Advanced CDN features
- **Load Balancing**: Intelligent load balancing

---

**Want to contribute?** Check out the [API Reference](./api-reference.md) or contact the development team.

