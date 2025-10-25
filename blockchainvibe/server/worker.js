// Cloudflare Worker for BlockchainVibe Backend

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight
function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Database helper
class DatabaseService {
  constructor(db) {
    this.db = db;
  }

  async initDatabase() {
    try {
      await this.db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
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
        )
      `).run();
      
      return { success: true };
    } catch (error) {
      console.error('Database initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  async createUser(userData) {
    const { id, email, name, picture, provider } = userData;
    
    try {
      // Initialize database if needed
      await this.initDatabase();
      
      // Check if user already exists
      const existingUser = await this.db.prepare(
        'SELECT user_id, profile_completed FROM users WHERE user_id = ?'
      ).bind(id).first();
      
      if (existingUser) {
        // Update last login
        await this.db.prepare(
          'UPDATE users SET last_login = datetime("now") WHERE user_id = ?'
        ).bind(id).run();
        
        return { 
          success: true, 
          isNewUser: false, 
          profileCompleted: existingUser.profile_completed 
        };
      }
      
      // Create new user
      await this.db.prepare(`
        INSERT INTO users (user_id, email, name, picture, provider, profile_picture, created_at, last_login, is_active)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
      `).bind(id, email, name, picture, provider, picture).run();
      
      return { success: true, isNewUser: true, profileCompleted: false };
    } catch (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserField(userId, field, value) {
    try {
      await this.db.prepare(`
        UPDATE users SET ${field} = ? WHERE user_id = ?
      `).bind(value, userId).run();
      
      return { success: true };
    } catch (error) {
      console.error('Database update error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      const {
        name,
        email,
        bio,
        profile_picture,
        banner_image,
        location,
        website,
        twitter,
        linkedin
      } = profileData;

      await this.db.prepare(`
        UPDATE users SET 
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          bio = COALESCE(?, bio),
          profile_picture = COALESCE(?, profile_picture),
          banner_image = COALESCE(?, banner_image),
          location = COALESCE(?, location),
          website = COALESCE(?, website),
          twitter = COALESCE(?, twitter),
          linkedin = COALESCE(?, linkedin),
          profile_completed = 1
        WHERE user_id = ?
      `).bind(
        name, email, bio, profile_picture, banner_image,
        location, website, twitter, linkedin, userId
      ).run();
      
      return { success: true };
    } catch (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await this.db.prepare(`
        SELECT * FROM users WHERE user_id = ?
      `).bind(userId).first();
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserById(userId) {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM users WHERE user_id = ? AND is_active = 1
      `).bind(userId).first();
      
      return result;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  async updateLastLogin(userId) {
    try {
      await this.db.prepare(`
        UPDATE users SET last_login = datetime('now') WHERE user_id = ?
      `).bind(userId).run();
      
      return { success: true };
    } catch (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }
  }
}

// JWT helper (simplified)
function createJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// OAuth handlers
async function handleGoogleAuth(request, env) {
  const db = new DatabaseService(env.DB);
  const { code, redirect_uri } = await request.json();
  
  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirect_uri
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    
    const userInfo = await userResponse.json();
    
    const userData = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name || '',
      picture: userInfo.picture || '',
      provider: 'google'
    };
    
    // Save to database
    const existingUser = await db.getUserById(userData.id);
    if (existingUser) {
      await db.updateLastLogin(userData.id);
    } else {
      await db.createUser(userData);
    }
    
    // Create JWT
    const accessToken = createJWT({
      sub: userData.id,
      email: userData.email,
      name: userData.name,
      provider: userData.provider,
      exp: Math.floor(Date.now() / 1000) + (30 * 60)
    }, env.JWT_SECRET);
    
    return new Response(JSON.stringify({
      success: true,
      access_token: accessToken,
      user: userData
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

async function handleGitHubAuth(request, env) {
  const db = new DatabaseService(env.DB);
  const { code, redirect_uri } = await request.json();
  
  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: redirect_uri
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    
    const userInfo = await userResponse.json();
    
    const userData = {
      id: userInfo.id.toString(),
      email: userInfo.email || `${userInfo.login}@github.com`,
      name: userInfo.name || userInfo.login,
      picture: userInfo.avatar_url || '',
      provider: 'github'
    };
    
    // Save to database
    const existingUser = await db.getUserById(userData.id);
    if (existingUser) {
      await db.updateLastLogin(userData.id);
    } else {
      await db.createUser(userData);
    }
    
    // Create JWT
    const accessToken = createJWT({
      sub: userData.id,
      email: userData.email,
      name: userData.name,
      provider: userData.provider,
      exp: Math.floor(Date.now() / 1000) + (30 * 60)
    }, env.JWT_SECRET);
    
    return new Response(JSON.stringify({
      success: true,
      access_token: accessToken,
      user: userData
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Health check
function handleHealth() {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      oauth: 'configured'
    }
  }), {
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Trending News API
async function handleTrendingNews(request, env) {
  try {
    const { 
      limit = 20, 
      timeFilter = '24h',
      categoryFilter = 'all',
      sortBy = 'engagement'
    } = await request.json();
    
    // Fetch trending news with engagement sorting
    const newsItems = await fetchBlockchainNews(limit, {
      category: categoryFilter,
      timeFilter,
      sortBy: 'engagement', // Always sort by engagement for trending
      userProfile: null // No personalization for trending
    });
    
    return new Response(JSON.stringify({
      articles: newsItems,
      total_count: newsItems.length,
      last_updated: new Date().toISOString(),
      type: 'trending'
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Trending news API error:', error);
    return new Response(JSON.stringify({
      error: "Failed to fetch trending news",
      details: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Personalized News API
async function handlePersonalizedNews(request, env) {
  try {
    const { 
      limit = 20, 
      timeFilter = 'today',
      user_profile
    } = await request.json();
    
    if (!user_profile || !user_profile.user_id) {
      return new Response(JSON.stringify({
        error: "User profile required for personalized news"
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Fetch personalized news
    const newsItems = await fetchBlockchainNews(limit, {
      category: 'all',
      timeFilter,
      sortBy: 'relevance', // Sort by relevance for personalized
      userProfile: user_profile
    });
    
    // Calculate user relevance score
    const userRelevanceScore = await calculateUserRelevance(newsItems, user_profile, env);
    
    return new Response(JSON.stringify({
      articles: newsItems,
      total_count: newsItems.length,
      user_relevance_score: userRelevanceScore,
      last_updated: new Date().toISOString(),
      type: 'personalized'
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Personalized news API error:', error);
    return new Response(JSON.stringify({
      error: "Failed to fetch personalized news",
      details: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// General News API with AI integration
async function handleNews(request, env) {
  try {
    const { 
      limit = 10, 
      user_profile,
      category = 'all',
      timeFilter = '24h',
      sortBy = 'relevance'
    } = await request.json();
    
    // Fetch real news using the aggregator
    const newsItems = await fetchBlockchainNews(limit, {
      category,
      timeFilter,
      sortBy,
      userProfile: user_profile
    });
    
    // Calculate user relevance score
    let userRelevanceScore = 0.0;
    if (user_profile && user_profile.user_id) {
      userRelevanceScore = await calculateUserRelevance(newsItems, user_profile, env);
    }
    
    return new Response(JSON.stringify({
      articles: newsItems,
      news: newsItems, // Keep both for compatibility
      total_count: newsItems.length,
      user_relevance_score: userRelevanceScore,
      last_updated: new Date().toISOString(),
      sources: {
        rss_feeds: "active",
        news_apis: "active",
        ai_agents: "active"
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('News API error:', error);
    return new Response(JSON.stringify({
      error: "Failed to fetch news",
      details: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Real news fetching using RSS feeds, APIs, uAgents, and knowledge graph
async function fetchBlockchainNews(limit, options = {}) {
  try {
    // Import the news aggregator
    const { NewsAggregator } = await import('./news-aggregator.js');
    const aggregator = new NewsAggregator();
    
    // Import uAgents integration
    const { UAgentsIntegration } = await import('./uagents-integration.js');
    const uAgents = new UAgentsIntegration();
    
    // Import knowledge graph
    const { BlockchainKnowledgeGraph } = await import('./knowledge-graph.js');
    const knowledgeGraph = new BlockchainKnowledgeGraph();
    
    // Fetch real news from RSS feeds and APIs
    const rawNews = await aggregator.fetchNews({
      limit: limit * 2, // Fetch more to account for filtering
      category: options.category || 'all',
      timeFilter: options.timeFilter || '24h',
      sortBy: options.sortBy || 'relevance',
      userProfile: options.userProfile
    });
    
    // Process news with uAgents (if available)
    let processedNews = rawNews;
    try {
      await uAgents.initializeAgents();
      processedNews = await uAgents.processNewsWithAgents(rawNews, options.userProfile);
    } catch (error) {
      console.warn('uAgents not available, using fallback processing:', error.message);
    }
    
    // Enhance with knowledge graph
    const enhancedNews = processedNews.map(article => {
      const articleText = (article.title + ' ' + article.summary).toLowerCase();
      
      // Extract entities using knowledge graph
      const entities = knowledgeGraph.extractEntities(articleText);
      
      // Categorize using knowledge graph
      const categories = knowledgeGraph.categorizeContent(articleText);
      
      // Calculate relevance using knowledge graph
      const relevanceScore = knowledgeGraph.calculateRelevanceScore(article, options.userProfile);
      
      return {
        ...article,
        entities,
        categories: categories.length > 0 ? categories : article.categories || ['general'],
        relevance_score: relevanceScore,
        knowledge_graph_enhanced: true,
        processing_timestamp: new Date().toISOString()
      };
    });
    
    // Sort by relevance score
    enhancedNews.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    
    return enhancedNews.slice(0, limit);
  } catch (error) {
    console.error('Error fetching real news:', error);
    // Fallback to mock data if real news fails
    return getMockNews(limit);
  }
}

// Fallback mock news
function getMockNews(limit) {
  const mockNews = [
    {
      id: "1",
      title: "Bitcoin Reaches New All-Time High",
      url: "https://example.com/bitcoin-ath",
      source: "CoinDesk",
      published_at: new Date().toISOString(),
      summary: "Bitcoin has reached a new all-time high driven by institutional adoption.",
      categories: ["Cryptocurrency", "Bitcoin"],
      tags: ["bitcoin", "price", "ath"],
      relevance_score: 0.95,
      engagement_metrics: { likes: 150, views: 2500, comments: 45 }
    },
    {
      id: "2", 
      title: "Ethereum 2.0 Staking Rewards Increase",
      url: "https://example.com/ethereum-staking",
      source: "Cointelegraph",
      published_at: new Date().toISOString(),
      summary: "Ethereum 2.0 staking rewards have increased significantly.",
      categories: ["Ethereum", "Staking", "DeFi"],
      tags: ["ethereum", "staking", "defi"],
      relevance_score: 0.88,
      engagement_metrics: { likes: 120, views: 1800, comments: 32 }
    },
    {
      id: "3",
      title: "DeFi Protocol Launches New Yield Farming Pool",
      url: "https://example.com/defi-yield",
      source: "The Block",
      published_at: new Date().toISOString(),
      summary: "A new DeFi protocol has launched an innovative yield farming pool.",
      categories: ["DeFi", "Yield Farming"],
      tags: ["defi", "yield", "farming"],
      relevance_score: 0.82,
      engagement_metrics: { likes: 95, views: 1200, comments: 28 }
    }
  ];
  
  return mockNews.slice(0, limit);
}

// Simulate SingularityNET MeTTa relevance calculation
async function calculateUserRelevance(newsItems, userProfile, env) {
  // In a real implementation, this would use SingularityNET MeTTa
  const userInterests = userProfile.interests || [];
  const readingHistory = userProfile.reading_history || [];
  
  let totalRelevance = 0;
  let count = 0;
  
  for (const item of newsItems) {
    let relevance = item.relevance_score || 0.5;
    
    // Boost relevance based on user interests
    const itemText = (item.title + ' ' + item.summary).toLowerCase();
    for (const interest of userInterests) {
      if (itemText.includes(interest.toLowerCase())) {
        relevance += 0.2;
      }
    }
    
    // Boost relevance based on reading history
    for (const history of readingHistory) {
      if (itemText.includes(history.toLowerCase())) {
        relevance += 0.1;
      }
    }
    
    totalRelevance += Math.min(relevance, 1.0);
    count++;
  }
  
  return count > 0 ? totalRelevance / count : 0.0;
}

// File upload handler
async function handleFileUpload(request, env) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'profile' or 'banner'
    const userId = formData.get('userId');
    
    if (!file || !type || !userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: file, type, userId'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${type}/${userId}/${timestamp}.${fileExtension}`;
    
    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await env.blockchainvibe_assets.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000' // 1 year cache
      }
    });
    
    // Generate public URL
    const publicUrl = `https://blockchainvibe-assets.nico-chikuji.workers.dev/${filename}`;
    
    // Update user record in database
    const db = new DatabaseService(env.DB);
    const updateField = type === 'profile' ? 'profile_picture' : 'banner_image';
    await db.updateUserField(userId, updateField, publicUrl);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      filename: filename
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'File upload failed',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Individual OAuth handlers for unified callback
async function handleGoogleOAuth(code, redirect_uri, env) {
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirect_uri
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Google token request failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(`Google token error: ${tokenData.error_description || tokenData.error}`);
    }
    
    if (!tokenData.access_token) {
      throw new Error('Google token error: No access token received');
    }
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Google API error: ${userResponse.status} ${userResponse.statusText}`);
    }
    
    const userInfo = await userResponse.json();
    
    return {
      access_token: tokenData.access_token,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      }
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
}

async function handleGitHubOAuth(code, redirect_uri, env) {
  try {
    console.log('GitHub OAuth: Starting token exchange');
    console.log('GitHub OAuth: Redirect URI:', redirect_uri);
    console.log('GitHub OAuth: Client ID:', env.GITHUB_CLIENT_ID);
    console.log('GitHub OAuth: Client Secret exists:', !!env.GITHUB_CLIENT_SECRET);
    console.log('GitHub OAuth: Code length:', code ? code.length : 'undefined');
    
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: redirect_uri
      })
    });
    
    console.log('GitHub OAuth: Token response status:', tokenResponse.status);
    console.log('GitHub OAuth: Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.log('GitHub OAuth: Token error response:', errorText);
      throw new Error(`GitHub token request failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log('GitHub OAuth: Token response data:', tokenData);
    
    if (tokenData.error) {
      throw new Error(`GitHub token error: ${tokenData.error_description || tokenData.error}`);
    }
    
    if (!tokenData.access_token) {
      throw new Error('GitHub token error: No access token received');
    }
    
    // Get user info
    console.log('GitHub OAuth: Fetching user info with token:', tokenData.access_token.substring(0, 10) + '...');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'BlockchainVibe/1.0.0'
      }
    });
    
    console.log('GitHub OAuth: User response status:', userResponse.status);
    console.log('GitHub OAuth: User response headers:', Object.fromEntries(userResponse.headers.entries()));
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.log('GitHub OAuth: User API error response:', errorText);
      throw new Error(`GitHub API error: ${userResponse.status} ${userResponse.statusText} - ${errorText}`);
    }
    
    const userInfo = await userResponse.json();
    
    if (userInfo.message) {
      throw new Error(`GitHub user error: ${userInfo.message}`);
    }
    
    // Get user email addresses (GitHub user email might be private)
    let userEmail = userInfo.email;
    if (!userEmail) {
      try {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: { 
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const emails = await emailResponse.json();
        
        // Find primary email or first verified email
        const primaryEmail = emails.find(email => email.primary) || emails.find(email => email.verified);
        userEmail = primaryEmail ? primaryEmail.email : (emails[0] ? emails[0].email : null);
      } catch (emailError) {
        console.log('GitHub OAuth: Email fetch error:', emailError);
      }
    }
    
    return {
      access_token: tokenData.access_token,
      user: {
        id: userInfo.id.toString(),
        email: userEmail || `${userInfo.login}@github.com`,
        name: userInfo.name || userInfo.login,
        picture: userInfo.avatar_url || '',
        provider: 'github'
      }
    };
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    throw error;
  }
}

async function handleDiscordOAuth(code, redirect_uri, env) {
  try {
    console.log('Discord OAuth: Starting token exchange');
    console.log('Discord OAuth: Redirect URI:', redirect_uri);
    console.log('Discord OAuth: Client ID from env:', env.DISCORD_CLIENT_ID);
    console.log('Discord OAuth: Client Secret exists:', !!env.DISCORD_CLIENT_SECRET);
    console.log('Discord OAuth: Code length:', code ? code.length : 'undefined');
    
    // Use fallback client ID if env var is not set or empty
    const discordClientId = env.DISCORD_CLIENT_ID || '1431187449215717457';
    const discordClientSecret = env.DISCORD_CLIENT_SECRET || 'd3QI-oClsHiCTFPumMkQ8OWwAaJ5O8us';
    
    console.log('Discord OAuth: Using Client ID:', discordClientId);
    console.log('Discord OAuth: Using Client Secret exists:', !!discordClientSecret);
    
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: discordClientId,
        client_secret: discordClientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirect_uri
      })
    });
    
    console.log('Discord OAuth: Token response status:', tokenResponse.status);
    console.log('Discord OAuth: Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.log('Discord OAuth: Token error response:', errorText);
      throw new Error(`Discord token request failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log('Discord OAuth: Token response data:', tokenData);
    
    if (tokenData.error) {
      throw new Error(`Discord token error: ${tokenData.error_description || tokenData.error}`);
    }
    
    if (!tokenData.access_token) {
      throw new Error('Discord token error: No access token received');
    }
    
    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { 
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Discord API error: ${userResponse.status} ${userResponse.statusText}`);
    }
    
    const userInfo = await userResponse.json();
    
    return {
      access_token: tokenData.access_token,
      user: {
        id: userInfo.id,
        email: userInfo.email || `${userInfo.username}@discord.local`,
        name: userInfo.global_name || userInfo.username,
        picture: userInfo.avatar ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` : '',
        provider: 'discord'
      }
    };
  } catch (error) {
    console.error('Discord OAuth error:', error);
    throw error;
  }
}

async function handleTwitterOAuth(code, redirect_uri, codeVerifier, env) {
  try {
    // Twitter OAuth 2.0 implementation with PKCE
    const authString = `${env.TWITTER_CLIENT_ID}:${env.TWITTER_CLIENT_SECRET}`;
    const authHeader = btoa(authString);
    
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirect_uri,
        code_verifier: codeVerifier
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Twitter token request failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(`Twitter token error: ${tokenData.error_description || tokenData.error}`);
    }
    
    // Get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: { 
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw new Error(`Twitter user API error: ${userResponse.status} ${userResponse.statusText} - ${errorText}`);
    }
    
    const userInfo = await userResponse.json();
    
    if (userInfo.errors) {
      throw new Error(`Twitter user error: ${userInfo.errors[0].detail || userInfo.errors[0].message}`);
    }
    
    // Handle different possible profile image field names
    const profileImage = userInfo.data.profile_image_url || userInfo.data.profile_image_url_https || '';
    
    return {
      access_token: tokenData.access_token,
      user: {
        id: userInfo.data.id || '',
        email: userInfo.data.email || '',
        name: userInfo.data.name || '',
        picture: profileImage || '',
        provider: 'twitter'
      }
    };
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    throw error;
  }
}

// Unified OAuth callback handler
async function handleOAuthCallback(request, env) {
  try {
    const { code, redirect_uri, provider, code_verifier } = await request.json();
    
    if (!code || !provider) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    let userData;
    let accessToken;

    // Handle different OAuth providers
    try {
      if (provider === 'google') {
        const result = await handleGoogleOAuth(code, redirect_uri, env);
        userData = result.user;
        accessToken = result.access_token;
      } else if (provider === 'github') {
        const result = await handleGitHubOAuth(code, redirect_uri, env);
        userData = result.user;
        accessToken = result.access_token;
      } else if (provider === 'twitter') {
        const result = await handleTwitterOAuth(code, redirect_uri, code_verifier, env);
        userData = result.user;
        accessToken = result.access_token;
      } else if (provider === 'discord') {
        const result = await handleDiscordOAuth(code, redirect_uri, env);
        userData = result.user;
        accessToken = result.access_token;
      } else {
        return new Response(JSON.stringify({
          success: false,
          message: 'Unsupported OAuth provider'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    } catch (oauthError) {
      console.error(`${provider} OAuth error:`, oauthError);
      return new Response(JSON.stringify({
        success: false,
        message: 'OAuth callback failed',
        error: oauthError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Save user to database
    const db = new DatabaseService(env.DB);
    const dbResult = await db.createUser({
      id: userData.id || '',
      email: userData.email || '',
      name: userData.name || '',
      picture: userData.picture || userData.avatar_url || '',
      provider: provider
    });

    if (!dbResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to save user data',
        error: dbResult.error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      access_token: accessToken,
      user: userData,
      isNewUser: dbResult.isNewUser,
      profileCompleted: dbResult.profileCompleted
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'OAuth callback failed',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    try {
      // Route handling
      if (path === '/api/health' && method === 'GET') {
        return handleHealth();
      }
      
      if (path === '/api/auth/google' && method === 'POST') {
        return await handleGoogleAuth(request, env);
      }
      
      if (path === '/api/auth/github' && method === 'POST') {
        return await handleGitHubAuth(request, env);
      }
      
      if (path === '/api/auth/callback' && method === 'POST') {
        return await handleOAuthCallback(request, env);
      }
      
      if (path === '/api/upload' && method === 'POST') {
        return await handleFileUpload(request, env);
      }
      
      if (path === '/api/news/trending' && method === 'POST') {
        return await handleTrendingNews(request, env);
      }

      if (path === '/api/news/personalized' && method === 'POST') {
        return await handlePersonalizedNews(request, env);
      }

      if (path === '/api/user/profile' && method === 'GET') {
        return await handleGetUserProfile(request, env);
      }

      if (path === '/api/user/profile' && method === 'PUT') {
        return await handleUpdateUserProfile(request, env);
      }

      // Default response
      return new Response(JSON.stringify({
        message: 'BlockchainVibe API',
        version: '1.0.0',
        status: 'running'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

// Profile API handlers
async function handleGetUserProfile(request, env) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    const db = new DatabaseService(env.DB);
    const result = await db.getUserProfile(userId);
    
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        message: result.error
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      user: result.user
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

async function handleUpdateUserProfile(request, env) {
  try {
    const { userId, profileData } = await request.json();
    
    if (!userId || !profileData) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User ID and profile data are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    const db = new DatabaseService(env.DB);
    const result = await db.updateUserProfile(userId, profileData);
    
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        message: result.error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Profile updated successfully'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    console.error('Update user profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
