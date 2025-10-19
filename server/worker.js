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

  async createUser(userData) {
    const { id, email, name, picture, provider } = userData;
    
    try {
      await this.db.prepare(`
        INSERT OR REPLACE INTO users (user_id, email, name, picture, provider, created_at, last_login, is_active)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
      `).bind(id, email, name, picture, provider).run();
      
      return { success: true };
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
      headers: { 'Accept': 'application/json' },
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

// News API with AI integration
async function handleNews(request, env) {
  try {
    const { limit = 10, user_profile } = await request.json();
    
    // Simulate Fetch.ai uAgents news fetching
    const newsItems = await fetchBlockchainNews(limit);
    
    // Simulate SingularityNET MeTTa relevance scoring
    let userRelevanceScore = 0.0;
    if (user_profile && user_profile.user_id) {
      userRelevanceScore = await calculateUserRelevance(newsItems, user_profile, env);
    }
    
    return new Response(JSON.stringify({
      news: newsItems,
      total_count: newsItems.length,
      user_relevance_score: userRelevanceScore,
      last_updated: new Date().toISOString(),
      ai_agents: {
        fetch_ai_uagents: "active",
        singularitynet_metta: "active"
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
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

// Simulate Fetch.ai uAgents news fetching
async function fetchBlockchainNews(limit) {
  // In a real implementation, this would use Fetch.ai uAgents
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
      relevance_score: 0.95
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
      relevance_score: 0.88
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
      relevance_score: 0.82
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
      
      if (path === '/api/news/trending' && method === 'POST') {
        return await handleNews(request, env);
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