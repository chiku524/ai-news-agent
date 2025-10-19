# 🚀 Cloudflare Deployment Guide - AI News Agent

## 🌟 **Cloudflare Services Used:**

- **Cloudflare Pages**: Frontend hosting
- **Cloudflare Workers**: Backend API
- **Cloudflare D1**: SQLite database
- **Cloudflare KV**: Caching and session storage
- **Cloudflare R2**: Static asset storage

## 📋 **Prerequisites:**

1. **Cloudflare Account** (free tier available)
2. **Domain** (optional, can use Cloudflare Pages subdomain)
3. **OAuth Apps** configured for production URLs

## 🗄️ **Database Setup (D1):**

### **Step 1: Create D1 Database**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create ai-news-agent-db
```

### **Step 2: Create Database Schema**
```sql
-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    picture TEXT,
    provider TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    preferences JSON DEFAULT '{}',
    interests JSON DEFAULT '[]',
    reading_history JSON DEFAULT '[]'
);

-- Create news_articles table
CREATE TABLE news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT,
    published_at DATETIME,
    summary TEXT,
    image_url TEXT,
    categories JSON DEFAULT '[]',
    tags JSON DEFAULT '[]',
    relevance_score REAL DEFAULT 0.0,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create user_reading_history table
CREATE TABLE user_reading_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    article_id TEXT NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER DEFAULT 0,
    rating INTEGER
);

-- Create indexes
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_articles_article_id ON news_articles(article_id);
CREATE INDEX idx_reading_history_user_id ON user_reading_history(user_id);
```

### **Step 3: Apply Schema**
```bash
# Apply schema to D1 database
wrangler d1 execute ai-news-agent-db --file=schema.sql
```

## 🔧 **Environment Variables:**

### **Cloudflare Workers Environment Variables:**
```bash
# Set environment variables
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put TWITTER_CLIENT_ID
wrangler secret put TWITTER_CLIENT_SECRET
wrangler secret put JWT_SECRET
```

### **Cloudflare Pages Environment Variables:**
In Cloudflare Pages dashboard:
```
REACT_APP_GOOGLE_CLIENT_ID=your_production_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_production_github_client_id
REACT_APP_TWITTER_CLIENT_ID=your_production_twitter_client_id
REACT_APP_REDIRECT_URI=https://your-domain.com/auth/callback
REACT_APP_API_URL=https://your-worker.your-subdomain.workers.dev
```

## 🚀 **Deployment Steps:**

### **Step 1: Deploy Backend (Cloudflare Workers)**

1. **Update wrangler.toml:**
   ```toml
   name = "ai-news-agent-api"
   main = "server/cloudflare_worker.js"
   compatibility_date = "2024-01-01"
   
   [[d1_databases]]
   binding = "DB"
   database_name = "ai-news-agent-db"
   database_id = "your-d1-database-id"
   ```

2. **Deploy Worker:**
   ```bash
   cd server
   wrangler deploy
   ```

3. **Get Worker URL:**
   - Note the Worker URL: `https://ai-news-agent-api.your-subdomain.workers.dev`

### **Step 2: Deploy Frontend (Cloudflare Pages)**

1. **Connect Repository:**
   - Go to Cloudflare Pages dashboard
   - Connect your GitHub repository
   - Select `client` as root directory

2. **Build Settings:**
   ```
   Build command: npm run build
   Build output directory: build
   Node.js version: 18
   ```

3. **Environment Variables:**
   - Add all REACT_APP_* variables
   - Set REACT_APP_API_URL to your Worker URL

4. **Deploy:**
   - Click "Save and Deploy"
   - Wait for build to complete

### **Step 3: Configure Custom Domain (Optional)**

1. **Add Domain:**
   - In Cloudflare Pages, go to Custom domains
   - Add your domain
   - Update DNS records as instructed

2. **Update OAuth Redirect URIs:**
   - Google: `https://your-domain.com/auth/callback`
   - GitHub: `https://your-domain.com/auth/callback`
   - Twitter: `https://your-domain.com/auth/callback`

## 🔒 **Security Configuration:**

### **Cloudflare Security Settings:**

1. **WAF Rules:**
   ```javascript
   // Block suspicious requests
   (http.request.uri.path contains "admin" and not ip.src in {192.168.0.0/16 10.0.0.0/8})
   ```

2. **Rate Limiting:**
   ```javascript
   // Rate limit API endpoints
   (http.request.uri.path starts_with "/api/")
   ```

3. **Bot Management:**
   - Enable Bot Fight Mode
   - Configure challenge pages

### **CORS Configuration:**
```javascript
// In Cloudflare Worker
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
```

## 📊 **Performance Optimization:**

### **Cloudflare Caching:**
```javascript
// Cache API responses
const cache = caches.default;
const cacheKey = new Request(request.url, request);

// Check cache
let response = await cache.match(cacheKey);
if (!response) {
  // Generate response
  response = await generateResponse();
  
  // Cache for 5 minutes
  response.headers.set('Cache-Control', 'public, max-age=300');
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
}
```

### **Static Asset Optimization:**
- Enable Cloudflare Auto Minify
- Enable Brotli compression
- Use Cloudflare Images for optimization

## 🔍 **Monitoring & Analytics:**

### **Cloudflare Analytics:**
- Web Analytics (free)
- Workers Analytics
- D1 Analytics

### **Error Tracking:**
```javascript
// In Worker
try {
  // Your code
} catch (error) {
  console.error('Worker error:', error);
  // Send to error tracking service
}
```

## 🧪 **Testing Deployment:**

### **Health Check:**
```bash
curl https://your-worker.your-subdomain.workers.dev/api/health
```

### **OAuth Test:**
1. Visit your Pages URL
2. Test OAuth login flows
3. Check database for user creation

### **Performance Test:**
```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/
```

## 🔄 **CI/CD Pipeline:**

### **GitHub Actions:**
```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v2
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

## 📈 **Scaling Considerations:**

### **D1 Database:**
- Free tier: 5GB storage, 25M reads/month
- Paid tiers available for higher limits

### **Workers:**
- Free tier: 100K requests/day
- Paid tiers for higher limits

### **Pages:**
- Free tier: 500 builds/month
- Unlimited bandwidth

## 🎉 **Success Metrics:**

Your deployment is successful when:
- ✅ Frontend loads at your domain
- ✅ OAuth login works with all providers
- ✅ Users are saved to D1 database
- ✅ API responses are fast (< 200ms)
- ✅ No CORS errors
- ✅ SSL certificate is valid

## 🆘 **Troubleshooting:**

### **Common Issues:**

1. **CORS Errors:**
   - Check CORS headers in Worker
   - Verify allowed origins

2. **Database Connection:**
   - Check D1 binding in wrangler.toml
   - Verify database exists

3. **OAuth Errors:**
   - Check redirect URIs match exactly
   - Verify environment variables

4. **Build Failures:**
   - Check Node.js version
   - Verify build command

**Your AI News Agent is now ready for Cloudflare deployment!** 🚀
