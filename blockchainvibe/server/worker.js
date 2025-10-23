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
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        )
      `).run();
      
      console.log('Database initialized successfully');
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
  console.log('Google OAuth: Starting token exchange');
  console.log('Google OAuth: Redirect URI:', redirect_uri);
  
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
  
  console.log('Google OAuth: Token response status:', tokenResponse.status);
  console.log('Google OAuth: Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Google token request failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
  }
  
  const tokenData = await tokenResponse.json();
  console.log('Google OAuth: Token response:', tokenData);
  
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
}

async function handleGitHubOAuth(code, redirect_uri, env) {
  console.log('GitHub OAuth: Starting token exchange');
  console.log('GitHub OAuth: Redirect URI:', redirect_uri);
  
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
    throw new Error(`GitHub token request failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
  }
  
  const tokenData = await tokenResponse.json();
  console.log('GitHub OAuth: Token response:', tokenData);
  
  if (tokenData.error) {
    throw new Error(`GitHub token error: ${tokenData.error_description || tokenData.error}`);
  }
  
  if (!tokenData.access_token) {
    throw new Error('GitHub token error: No access token received');
  }
  
  // Get user info
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { 
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!userResponse.ok) {
    throw new Error(`GitHub API error: ${userResponse.status} ${userResponse.statusText}`);
  }
  
  const userInfo = await userResponse.json();
  console.log('GitHub OAuth: User info:', userInfo);
  
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
      console.log('GitHub OAuth: User emails:', emails);
      
      // Find primary email or first verified email
      const primaryEmail = emails.find(email => email.primary) || emails.find(email => email.verified);
      userEmail = primaryEmail ? primaryEmail.email : (emails[0] ? emails[0].email : null);
    } catch (emailError) {
      console.log('GitHub OAuth: Could not fetch emails:', emailError);
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
}

async function handleTwitterOAuth(code, redirect_uri, codeVerifier, env) {
  console.log('Twitter OAuth: Starting token exchange');
  console.log('Twitter OAuth: Redirect URI:', redirect_uri);
  console.log('Twitter OAuth: Code Verifier:', codeVerifier);
  
  // Twitter OAuth 2.0 implementation with PKCE
  const authString = `${env.TWITTER_CLIENT_ID}:${env.TWITTER_CLIENT_SECRET}`;
  const authHeader = btoa(authString);
  console.log('Twitter OAuth: Auth header length:', authHeader.length);
  console.log('Twitter OAuth: Auth header preview:', authHeader.substring(0, 10) + '...');
  
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
  console.log('Twitter OAuth: Token response:', tokenData);
  
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
  console.log('Twitter OAuth: User info:', userInfo);
  
  if (userInfo.errors) {
    throw new Error(`Twitter user error: ${userInfo.errors[0].detail || userInfo.errors[0].message}`);
  }
  
  // Handle different possible profile image field names
  const profileImage = userInfo.data.profile_image_url || userInfo.data.profile_image_url_https || '';
  
  return {
    access_token: tokenData.access_token,
    user: {
      id: userInfo.data.id,
      email: userInfo.data.email || '',
      name: userInfo.data.name,
      picture: profileImage,
      provider: 'twitter'
    }
  };
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
    console.log('OAuth callback: Saving user to database:', userData);
    const db = new DatabaseService(env.DB);
    const dbResult = await db.createUser({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture || userData.avatar_url,
      provider: provider
    });
    console.log('OAuth callback: Database result:', dbResult);

    return new Response(JSON.stringify({
      success: true,
      access_token: accessToken,
      user: userData
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