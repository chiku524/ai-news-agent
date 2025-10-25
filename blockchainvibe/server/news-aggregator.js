// News Aggregation Service for BlockchainVibe
// Handles RSS feeds, APIs, and content processing

import { NEWS_SOURCES, NEWS_CATEGORIES, CATEGORY_KEYWORDS } from './news-sources.js';

export class NewsAggregator {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Main method to fetch news from all sources
  async fetchNews(options = {}) {
    const {
      limit = 20,
      category = 'all',
      timeFilter = '24h',
      sortBy = 'relevance',
      userProfile = null
    } = options;

    try {
      // Fetch from RSS feeds (primary source)
      const rssNews = await this.fetchFromRSSFeeds(limit * 2);
      
      // Fetch from APIs if enabled
      const apiNews = await this.fetchFromAPIs(limit);
      
      // Combine and deduplicate
      const allNews = this.deduplicateNews([...rssNews, ...apiNews]);
      
      // Filter by category
      const filteredNews = category === 'all' 
        ? allNews 
        : allNews.filter(article => this.matchesCategory(article, category));
      
      // Filter by time
      const timeFilteredNews = this.filterByTime(filteredNews, timeFilter);
      
      // Sort articles
      const sortedNews = this.sortArticles(timeFilteredNews, sortBy);
      
      // Calculate relevance scores
      const scoredNews = userProfile 
        ? await this.calculateRelevanceScores(sortedNews, userProfile)
        : sortedNews;
      
      // Limit results
      return scoredNews.slice(0, limit);
      
    } catch (error) {
      console.error('News aggregation error:', error);
      return this.getFallbackNews(limit);
    }
  }

  // Fetch news from RSS feeds
  async fetchFromRSSFeeds(limit) {
    const enabledFeeds = NEWS_SOURCES.RSS_FEEDS.filter(feed => feed.enabled);
    const newsPromises = enabledFeeds.map(feed => this.parseRSSFeed(feed));
    
    try {
      const results = await Promise.allSettled(newsPromises);
      const allArticles = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value)
        .filter(article => article && article.title);
      
      return allArticles.slice(0, limit);
    } catch (error) {
      console.error('RSS feed parsing error:', error);
      return [];
    }
  }

  // Parse individual RSS feed
  async parseRSSFeed(feed) {
    try {
      console.log(`Fetching RSS feed: ${feed.name} from ${feed.url}`);
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'BlockchainVibe/1.0 (News Aggregator)'
        }
      });
      
      if (!response.ok) {
        console.error(`RSS feed ${feed.name} returned ${response.status}`);
        throw new Error(`RSS feed ${feed.name} returned ${response.status}`);
      }
      
      const xmlText = await response.text();
      console.log(`RSS feed ${feed.name} response length:`, xmlText.length);
      const articles = this.parseRSSXML(xmlText, feed);
      console.log(`RSS feed ${feed.name} parsed ${articles.length} articles`);
      return articles;
    } catch (error) {
      console.error(`Error parsing RSS feed ${feed.name}:`, error);
      return [];
    }
  }

  // Parse RSS XML content
  parseRSSXML(xmlText, feed) {
    try {
      console.log(`Parsing XML for ${feed.name}, length: ${xmlText.length}`);
      
      // Enhanced XML parsing for 2025 RSS feeds
      const items = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];
      console.log(`Found ${items.length} items in ${feed.name}`);
      
      if (items.length === 0) {
        console.log(`No items found in ${feed.name}, trying alternative parsing`);
        // Try alternative parsing for different RSS formats
        const altItems = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];
        console.log(`Found ${altItems.length} entries in ${feed.name}`);
        return this.parseAtomXML(xmlText, feed);
      }
      
      const articles = items.map((item, index) => {
        const title = this.extractXMLContent(item, 'title');
        const link = this.extractXMLContent(item, 'link');
        const description = this.extractXMLContent(item, 'description');
        const pubDate = this.extractXMLContent(item, 'pubDate');
        const guid = this.extractXMLContent(item, 'guid');
        const author = this.extractXMLContent(item, 'author') || 
                      this.extractXMLContent(item, 'dc:creator') || 
                      this.extractXMLContent(item, 'creator') || 
                      feed.name;
        
        console.log(`Item ${index}: title="${title}", link="${link}"`);
        
        if (!title || !link) {
          console.log(`Skipping item ${index} - missing title or link`);
          return null;
        }
        
        // Enhanced content extraction for 2025
        const content = this.extractXMLContent(item, 'content:encoded') || 
                       this.extractXMLContent(item, 'content') ||
                       this.extractXMLContent(item, 'description') || 
                       this.extractXMLContent(item, 'summary');
        
        // Extract categories from multiple possible tags
        const categories = this.extractCategories(item, feed.category);
        
        // Extract media/image URLs
        const imageUrl = this.extractImageFromDescription(description) || 
                        this.extractXMLContent(item, 'media:thumbnail') ||
                        this.extractXMLContent(item, 'enclosure');
        
        const article = {
          id: guid || `${feed.name}-${index}-${Date.now()}`,
          title: this.cleanText(title),
          url: link,
          source: feed.name,
          published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          summary: this.cleanText(description),
          content: this.cleanText(content),
          excerpt: this.cleanText(description),
          categories: categories,
          tags: this.extractTags(title + ' ' + description),
          image_url: imageUrl,
          author: author,
          relevance_score: 0.5, // Will be calculated later
          engagement_metrics: {
            likes: Math.floor(Math.random() * 100),
            views: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 50)
          },
          processing_timestamp: new Date().toISOString()
        };
        
        console.log(`Created article: ${article.title}`);
        return article;
      }).filter(Boolean);
      
      console.log(`Successfully parsed ${articles.length} articles from ${feed.name}`);
      return articles;
    } catch (error) {
      console.error(`Error parsing XML for ${feed.name}:`, error);
      return [];
    }
  }

  // Parse Atom XML format
  parseAtomXML(xmlText, feed) {
    try {
      const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      console.log(`Found ${entries.length} Atom entries in ${feed.name}`);
      
      return entries.map((entry, index) => {
        const title = this.extractXMLContent(entry, 'title');
        const link = this.extractXMLContent(entry, 'link');
        const summary = this.extractXMLContent(entry, 'summary');
        const published = this.extractXMLContent(entry, 'published');
        const id = this.extractXMLContent(entry, 'id');
        const author = this.extractXMLContent(entry, 'author') || feed.name;
        
        if (!title || !link) return null;
        
        return {
          id: id || `${feed.name}-atom-${index}-${Date.now()}`,
          title: this.cleanText(title),
          url: link,
          source: feed.name,
          published_at: published ? new Date(published).toISOString() : new Date().toISOString(),
          summary: this.cleanText(summary),
          content: this.cleanText(summary),
          excerpt: this.cleanText(summary),
          categories: [feed.category],
          tags: this.extractTags(title + ' ' + summary),
          image_url: null,
          author: author,
          relevance_score: 0.5,
          engagement_metrics: {
            likes: Math.floor(Math.random() * 100),
            views: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 50)
          },
          processing_timestamp: new Date().toISOString()
        };
      }).filter(Boolean);
    } catch (error) {
      console.error(`Error parsing Atom XML for ${feed.name}:`, error);
      return [];
    }
  }

  // Fetch from news APIs
  async fetchFromAPIs(limit) {
    const enabledAPIs = NEWS_SOURCES.NEWS_APIS.filter(api => api.enabled && api.apiKey);
    const newsPromises = enabledAPIs.map(api => this.fetchFromAPI(api, limit));
    
    try {
      const results = await Promise.allSettled(newsPromises);
      return results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value)
        .filter(article => article && article.title);
    } catch (error) {
      console.error('API fetching error:', error);
      return [];
    }
  }

  // Fetch from individual API
  async fetchFromAPI(api, limit) {
    try {
      let url = api.url;
      const params = new URLSearchParams();
      
      if (api.name === 'NewsAPI') {
        params.append('q', 'bitcoin OR ethereum OR cryptocurrency OR blockchain');
        params.append('sortBy', 'publishedAt');
        params.append('language', 'en');
        params.append('pageSize', limit);
        params.append('apiKey', api.apiKey);
      } else if (api.name === 'GNews') {
        params.append('q', 'bitcoin OR ethereum OR cryptocurrency');
        params.append('lang', 'en');
        params.append('max', limit);
        params.append('apikey', api.apiKey);
      } else if (api.name === 'CryptoPanic') {
        params.append('auth_token', api.apiKey);
        params.append('public', 'true');
        params.append('filter', 'hot');
      }
      
      url += '?' + params.toString();
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BlockchainVibe/1.0 (News Aggregator)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API ${api.name} returned ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformAPIData(data, api);
    } catch (error) {
      console.error(`Error fetching from ${api.name}:`, error);
      return [];
    }
  }

  // Transform API data to our format
  transformAPIData(data, api) {
    let articles = [];
    
    if (api.name === 'NewsAPI') {
      articles = data.articles || [];
    } else if (api.name === 'GNews') {
      articles = data.articles || [];
    } else if (api.name === 'CryptoPanic') {
      articles = data.results || [];
    }
    
    return articles.map(article => ({
      id: article.url || article.id || `${api.name}-${Date.now()}-${Math.random()}`,
      title: article.title || article.headline,
      url: article.url || article.link,
      source: article.source?.name || api.name,
      published_at: article.publishedAt || article.created_at || new Date().toISOString(),
      summary: article.description || article.summary,
      content: article.content || article.description,
      excerpt: article.description || article.summary,
      categories: this.categorizeContent(article.title + ' ' + (article.description || '')),
      tags: this.extractTags(article.title + ' ' + (article.description || '')),
      image_url: article.urlToImage || article.image,
      author: article.author || api.name,
      relevance_score: 0.5,
      engagement_metrics: {
        likes: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 50)
      }
    }));
  }

  // Deduplicate news articles
  deduplicateNews(articles) {
    const seen = new Set();
    return articles.filter(article => {
      const key = article.title.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Filter by category
  matchesCategory(article, category) {
    if (category === 'all') return true;
    
    const articleText = (article.title + ' ' + article.summary).toLowerCase();
    const keywords = CATEGORY_KEYWORDS[category] || [];
    
    return keywords.some(keyword => articleText.includes(keyword.toLowerCase()));
  }

  // Filter by time
  filterByTime(articles, timeFilter) {
    const now = new Date();
    const timeMap = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const timeLimit = timeMap[timeFilter];
    if (!timeLimit) return articles;
    
    return articles.filter(article => {
      const articleDate = new Date(article.published_at);
      return (now - articleDate) <= timeLimit;
    });
  }

  // Sort articles
  sortArticles(articles, sortBy) {
    switch (sortBy) {
      case 'relevance':
        return articles.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
      case 'date':
        return articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
      case 'engagement':
        return articles.sort((a, b) => {
          const aEngagement = (a.engagement_metrics?.likes || 0) + (a.engagement_metrics?.views || 0);
          const bEngagement = (b.engagement_metrics?.likes || 0) + (b.engagement_metrics?.views || 0);
          return bEngagement - aEngagement;
        });
      default:
        return articles;
    }
  }

  // Calculate relevance scores based on user profile
  async calculateRelevanceScores(articles, userProfile) {
    const userInterests = userProfile.interests || userProfile.preferences?.topics || userProfile.topics || [];
    const readingHistory = userProfile.reading_history || [];
    
    return articles.map(article => {
      let relevance = article.relevance_score || 0.5;
      const articleText = (article.title + ' ' + article.summary).toLowerCase();
      
      // Boost relevance based on user interests
      userInterests.forEach(interest => {
        if (articleText.includes(interest.toLowerCase())) {
          relevance += 0.2;
        }
      });
      
      // Boost relevance based on reading history
      readingHistory.forEach(history => {
        if (articleText.includes(history.toLowerCase())) {
          relevance += 0.1;
        }
      });
      
      // Boost relevance for preferred sources
      if (userProfile.preferred_sources?.includes(article.source)) {
        relevance += 0.15;
      }
      
      return {
        ...article,
        relevance_score: Math.min(relevance, 1.0)
      };
    });
  }

  // Categorize content based on keywords
  categorizeContent(text) {
    const categories = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        categories.push(category);
      }
    });
    
    return categories.length > 0 ? categories : ['general'];
  }

  // Extract tags from content
  extractTags(text) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5);
    
    return [...new Set(words)];
  }

  // Utility methods
  extractXMLContent(xml, tag) {
    // Try multiple patterns for different XML structures
    const patterns = [
      new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'),
      new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'),
      new RegExp(`<${tag}[^>]*\\/>`, 'i') // Self-closing tags
    ];
    
    for (const pattern of patterns) {
      const match = xml.match(pattern);
      if (match) {
        return match[1] ? match[1].trim() : '';
      }
    }
    
    return '';
  }

  cleanText(text) {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') // Remove CDATA wrappers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  extractImageFromDescription(description) {
    const imgRegex = /<img[^>]+src="([^"]+)"/i;
    const match = description.match(imgRegex);
    return match ? match[1] : null;
  }

  // Extract categories from RSS item
  extractCategories(item, defaultCategory) {
    const categories = [];
    
    // Try different category tags
    const categoryTags = ['category', 'dc:subject', 'subject'];
    
    categoryTags.forEach(tag => {
      const categoryContent = this.extractXMLContent(item, tag);
      if (categoryContent) {
        // Split by common separators
        const cats = categoryContent.split(/[,;|]/).map(cat => cat.trim()).filter(Boolean);
        categories.push(...cats);
      }
    });
    
    // If no categories found, use default
    if (categories.length === 0) {
      categories.push(defaultCategory);
    }
    
    return [...new Set(categories)]; // Remove duplicates
  }

  // Fallback news when all sources fail
  getFallbackNews(limit) {
    return [
      {
        id: "fallback-1",
        title: "Bitcoin Reaches New All-Time High",
        url: "https://example.com/bitcoin-ath",
        source: "CoinDesk",
        published_at: new Date().toISOString(),
        summary: "Bitcoin has reached a new all-time high driven by institutional adoption.",
        content: "Bitcoin has reached a new all-time high driven by institutional adoption.",
        excerpt: "Bitcoin has reached a new all-time high driven by institutional adoption.",
        categories: ["bitcoin"],
        tags: ["bitcoin", "price", "ath"],
        image_url: null,
        author: "CoinDesk",
        relevance_score: 0.95,
        engagement_metrics: { likes: 150, views: 2500, comments: 45 }
      }
    ].slice(0, limit);
  }
}
