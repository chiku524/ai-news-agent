# News Sources Setup Guide

## 📰 **Legal & Ethical News Aggregation**

This guide explains how to set up news sources for BlockchainVibe while remaining legal and ethical.

## 🎯 **Approach Overview**

### **1. RSS Feed Aggregation (Primary - Free & Legal)**
- ✅ **Completely Legal**: RSS feeds are designed for aggregation
- ✅ **No API Keys Required**: Most major news sources provide RSS feeds
- ✅ **Real-time Updates**: Feeds update automatically
- ✅ **Proper Attribution**: Always link back to original source

### **2. News API Services (Secondary - Paid)**
- ✅ **Legal with Licensing**: Commercial APIs with proper terms
- ✅ **Higher Quality**: Better structured data
- ✅ **Rate Limits**: Controlled access to prevent abuse

### **3. User Experience**
- 🔗 **External Links**: All articles redirect to original source
- 📝 **Proper Attribution**: Clear source attribution on every article
- 🚫 **No Content Theft**: Only show previews, not full articles

## 🚀 **Setup Instructions**

### **Step 1: Enable RSS Feeds (Immediate)**

The following RSS feeds are already configured and ready to use:

```javascript
// Already configured in news-sources.js
RSS_FEEDS: [
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml",
    category: "general",
    priority: 1,
    enabled: true
  },
  {
    name: "CoinTelegraph", 
    url: "https://cointelegraph.com/rss",
    category: "general",
    priority: 1,
    enabled: true
  },
  {
    name: "Decrypt",
    url: "https://decrypt.co/feed",
    category: "general", 
    priority: 1,
    enabled: true
  },
  {
    name: "The Block",
    url: "https://www.theblock.co/rss.xml",
    category: "general",
    priority: 1,
    enabled: true
  }
]
```

### **Step 2: Add News API Keys (Optional)**

To enable paid news APIs, add these environment variables to your Cloudflare Worker:

```bash
# NewsAPI (Free tier: 1000 requests/day)
wrangler secret put NEWSAPI_KEY

# GNews (Free tier: 100 requests/day)  
wrangler secret put GNEWS_API_KEY

# CryptoPanic (Free tier: 1000 requests/day)
wrangler secret put CRYPTOPANIC_API_KEY
```

Then enable them in `news-sources.js`:

```javascript
NEWS_APIS: [
  {
    name: "NewsAPI",
    url: "https://newsapi.org/v2/everything",
    apiKey: process.env.NEWSAPI_KEY,
    enabled: true, // Change to true
    rateLimit: 1000,
    cost: "Free tier: 1000 requests/day"
  }
]
```

### **Step 3: Deploy Updated Backend**

```bash
cd server
wrangler deploy
```

## 📋 **Legal Compliance Checklist**

### ✅ **What We Do (Legal)**
- [x] **RSS Feed Aggregation**: Use publicly available RSS feeds
- [x] **Link Attribution**: All articles link to original source
- [x] **Preview Only**: Show only title, excerpt, and metadata
- [x] **Source Attribution**: Clear indication of original source
- [x] **No Content Reproduction**: Never show full article content
- [x] **Respect Robots.txt**: Honor website crawling policies
- [x] **Rate Limiting**: Don't overwhelm source servers

### ❌ **What We Don't Do (Illegal)**
- [ ] **Full Content Scraping**: Never reproduce full articles
- [ ] **Bypass Paywalls**: Don't circumvent subscription requirements
- [ ] **Copyright Infringement**: Don't use copyrighted content without permission
- [ ] **Aggressive Crawling**: Don't overload source servers
- [ ] **Content Theft**: Don't present others' content as our own

## 🔧 **Technical Implementation**

### **News Flow**
1. **RSS Feeds** → Parse XML → Extract metadata
2. **News APIs** → Fetch structured data → Transform format
3. **Deduplication** → Remove duplicate articles
4. **Categorization** → Classify by topic (Bitcoin, DeFi, etc.)
5. **Relevance Scoring** → AI-powered personalization
6. **Frontend Display** → Show previews with external links

### **Data Structure**
```javascript
{
  id: "unique-article-id",
  title: "Article Title",
  url: "https://original-source.com/article", // External link
  source: "CoinDesk", // Attribution
  published_at: "2024-01-01T00:00:00Z",
  summary: "Article preview...", // Not full content
  categories: ["bitcoin", "trading"],
  tags: ["bitcoin", "price", "ath"],
  image_url: "https://original-source.com/image.jpg",
  author: "Original Author",
  relevance_score: 0.95,
  engagement_metrics: {
    likes: 150,
    views: 2500, 
    comments: 45
  }
}
```

## 🎯 **User Experience**

### **Article Display**
- **Title**: Clickable, links to original source
- **Excerpt**: Preview of article content
- **Source**: Clear attribution (e.g., "CoinDesk")
- **Read More Button**: Redirects to original article
- **Image**: Thumbnail from original source
- **Metadata**: Author, publish date, categories

### **Legal Disclaimers**
Add these to your app:

```html
<!-- In your app footer or about page -->
<p>
  Articles are aggregated from various news sources. 
  All content belongs to their respective publishers. 
  Click "Read More" to view the full article on the original source.
</p>
```

## 📊 **Monitoring & Analytics**

### **Track These Metrics**
- **Click-through Rate**: How many users click to original sources
- **Source Attribution**: Ensure proper credit to original sources
- **Error Rates**: Monitor RSS feed and API failures
- **Rate Limiting**: Stay within API limits

### **Logging**
```javascript
// Log all external clicks for analytics
const trackExternalClick = (articleUrl, source) => {
  // Analytics tracking
  console.log(`External click: ${source} - ${articleUrl}`);
};
```

## 🚨 **Important Notes**

### **RSS Feed Reliability**
- RSS feeds can be unreliable or change URLs
- Always have fallback mechanisms
- Monitor feed health regularly

### **API Rate Limits**
- Respect all rate limits
- Implement proper caching
- Have fallback to RSS feeds

### **Content Updates**
- News content changes frequently
- Implement proper caching strategies
- Update every 5-10 minutes

## 🎉 **Benefits of This Approach**

1. **Legal Compliance**: 100% legal news aggregation
2. **Ethical**: Proper attribution and linking
3. **Scalable**: Can add more sources easily
4. **User-Friendly**: Clear navigation to original content
5. **Monetization**: Can add affiliate links or ads
6. **SEO Friendly**: External links help with search rankings

## 🔄 **Next Steps**

1. **Deploy the updated backend** with RSS feed support
2. **Test the news aggregation** with real RSS feeds
3. **Add API keys** for enhanced content (optional)
4. **Monitor performance** and user engagement
5. **Add more RSS sources** as needed
6. **Implement caching** for better performance

This approach ensures you have a legal, ethical, and scalable news aggregation platform that provides value to users while respecting content creators' rights.
