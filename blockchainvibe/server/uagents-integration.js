// Fetch.ai uAgents Integration for BlockchainVibe
// This module integrates uAgents for intelligent news processing with MeTTa knowledge graph

import { MeTTaIntegration } from './metta-integration.js';
import { ChatProtocolIntegration } from './chat-protocol.js';

export class UAgentsIntegration {
  constructor() {
    this.agents = new Map();
    this.agentEndpoints = new Map();
    this.mettaIntegration = new MeTTaIntegration();
    this.chatProtocol = new ChatProtocolIntegration();
  }

  // Initialize uAgents for news processing
  async initializeAgents() {
    try {
      // Initialize MeTTa knowledge graph
      await this.mettaIntegration.initialize();
      
      // News Fetcher Agent
      await this.createNewsFetcherAgent();
      
      // Content Processor Agent  
      await this.createContentProcessorAgent();
      
      // Relevance Scorer Agent
      await this.createRelevanceScorerAgent();
      
      // Register agents with Chat Protocol
      await this.registerAgentsWithChatProtocol();
      
      console.log('uAgents initialized successfully with MeTTa integration');
      return true;
    } catch (error) {
      console.error('Failed to initialize uAgents:', error);
      return false;
    }
  }

  // Create News Fetcher Agent
  async createNewsFetcherAgent() {
    const agentConfig = {
      name: "news_fetcher",
      seed: "blockchainvibe_news_fetcher_2024",
      port: 8001,
      endpoint: "http://localhost:8001/submit"
    };

    // In a real implementation, this would spawn a Python uAgent process
    // For now, we'll simulate the agent behavior
    this.agents.set('news_fetcher', {
      config: agentConfig,
      status: 'active',
      lastActivity: new Date(),
      capabilities: ['fetch_rss', 'parse_content', 'extract_metadata']
    });

    return agentConfig;
  }

  // Create Content Processor Agent
  async createContentProcessorAgent() {
    const agentConfig = {
      name: "content_processor", 
      seed: "blockchainvibe_content_processor_2024",
      port: 8002,
      endpoint: "http://localhost:8002/submit"
    };

    this.agents.set('content_processor', {
      config: agentConfig,
      status: 'active',
      lastActivity: new Date(),
      capabilities: ['categorize', 'extract_entities', 'generate_summary']
    });

    return agentConfig;
  }

  // Create Relevance Scorer Agent
  async createRelevanceScorerAgent() {
    const agentConfig = {
      name: "relevance_scorer",
      seed: "blockchainvibe_relevance_scorer_2024", 
      port: 8003,
      endpoint: "http://localhost:8003/submit"
    };

    this.agents.set('relevance_scorer', {
      config: agentConfig,
      status: 'active',
      lastActivity: new Date(),
      capabilities: ['calculate_relevance', 'personalize_content', 'score_engagement']
    });

    return agentConfig;
  }

  // Process news using uAgents
  async processNewsWithAgents(newsItems, userProfile = null) {
    try {
      // Step 1: News Fetcher Agent processes raw news
      const fetchedNews = await this.callAgent('news_fetcher', {
        action: 'process_news',
        data: newsItems
      });

      // Step 2: Content Processor Agent categorizes and extracts entities
      const processedNews = await this.callAgent('content_processor', {
        action: 'process_content',
        data: fetchedNews
      });

      // Step 3: Relevance Scorer Agent calculates personalization scores
      const scoredNews = await this.callAgent('relevance_scorer', {
        action: 'calculate_relevance',
        data: processedNews,
        userProfile: userProfile
      });

      return scoredNews;
    } catch (error) {
      console.error('uAgents processing error:', error);
      // Fallback to basic processing
      return this.fallbackProcessing(newsItems, userProfile);
    }
  }

  // Call a specific agent
  async callAgent(agentName, payload) {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    try {
      // In a real implementation, this would make HTTP requests to the agent
      // For now, we'll simulate the agent responses
      return await this.simulateAgentResponse(agentName, payload);
    } catch (error) {
      console.error(`Error calling agent ${agentName}:`, error);
      throw error;
    }
  }

  // Simulate agent responses (replace with real agent calls)
  async simulateAgentResponse(agentName, payload) {
    switch (agentName) {
      case 'news_fetcher':
        return this.simulateNewsFetcher(payload);
      case 'content_processor':
        return this.simulateContentProcessor(payload);
      case 'relevance_scorer':
        return this.simulateRelevanceScorer(payload);
      default:
        return payload.data;
    }
  }

  // Simulate News Fetcher Agent
  simulateNewsFetcher(payload) {
    const { data } = payload;
    return data.map(article => ({
      ...article,
      processed_by: 'news_fetcher',
      processing_timestamp: new Date().toISOString(),
      quality_score: Math.random() * 0.3 + 0.7 // 0.7-1.0
    }));
  }

  // Simulate Content Processor Agent
  simulateContentProcessor(payload) {
    const { data } = payload;
    return data.map(article => ({
      ...article,
      processed_by: 'content_processor',
      entities: this.extractEntities(article.title + ' ' + article.summary),
      categories: this.categorizeContent(article.title + ' ' + article.summary),
      sentiment: this.analyzeSentiment(article.title + ' ' + article.summary),
      processing_timestamp: new Date().toISOString()
    }));
  }

  // Simulate Relevance Scorer Agent
  simulateRelevanceScorer(payload) {
    const { data, userProfile } = payload;
    return data.map(article => ({
      ...article,
      processed_by: 'relevance_scorer',
      relevance_score: this.calculateRelevanceScore(article, userProfile),
      personalization_factors: this.getPersonalizationFactors(article, userProfile),
      processing_timestamp: new Date().toISOString()
    }));
  }

  // Helper methods for agent simulation
  extractEntities(text) {
    const entities = [];
    const cryptoKeywords = ['bitcoin', 'ethereum', 'defi', 'nft', 'blockchain', 'crypto'];
    
    cryptoKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        entities.push({
          type: 'crypto_term',
          value: keyword,
          confidence: 0.8
        });
      }
    });
    
    return entities;
  }

  categorizeContent(text) {
    const categories = [];
    const categoryKeywords = {
      'bitcoin': ['bitcoin', 'btc', 'satoshi'],
      'ethereum': ['ethereum', 'eth', 'ethereum 2.0'],
      'defi': ['defi', 'decentralized finance', 'yield farming'],
      'nft': ['nft', 'non-fungible token', 'opensea'],
      'trading': ['trading', 'price', 'market', 'exchange']
    };

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        categories.push(category);
      }
    });

    return categories.length > 0 ? categories : ['general'];
  }

  analyzeSentiment(text) {
    const positiveWords = ['bullish', 'growth', 'adoption', 'innovation', 'breakthrough'];
    const negativeWords = ['bearish', 'crash', 'decline', 'risk', 'concern'];
    
    const positiveCount = positiveWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    const negativeCount = negativeWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  calculateRelevanceScore(article, userProfile) {
    if (!userProfile) return article.relevance_score || 0.5;
    
    let score = 0.5;
    const articleText = (article.title + ' ' + article.summary).toLowerCase();
    
    // Boost score based on user interests
    const userInterests = userProfile.interests || userProfile.preferences?.topics || userProfile.topics || [];
    if (userInterests.length > 0) {
      userInterests.forEach(interest => {
        if (articleText.includes(interest.toLowerCase())) {
          score += 0.2;
        }
      });
    }
    
    // Boost score based on reading history
    if (userProfile.reading_history) {
      userProfile.reading_history.forEach(history => {
        if (articleText.includes(history.toLowerCase())) {
          score += 0.1;
        }
      });
    }
    
    // Boost score for preferred sources
    if (userProfile.preferred_sources?.includes(article.source)) {
      score += 0.15;
    }
    
    return Math.min(score, 1.0);
  }

  getPersonalizationFactors(article, userProfile) {
    if (!userProfile) return [];
    
    const factors = [];
    const articleText = (article.title + ' ' + article.summary).toLowerCase();
    
    const userInterests = userProfile.interests || userProfile.preferences?.topics || userProfile.topics || [];
    if (userInterests.length > 0) {
      userInterests.forEach(interest => {
        if (articleText.includes(interest.toLowerCase())) {
          factors.push(`matches_interest:${interest}`);
        }
      });
    }
    
    if (userProfile.preferred_sources?.includes(article.source)) {
      factors.push('preferred_source');
    }
    
    return factors;
  }

  // Fallback processing when agents are unavailable
  fallbackProcessing(newsItems, userProfile) {
    return newsItems.map(article => ({
      ...article,
      processed_by: 'fallback',
      relevance_score: this.calculateRelevanceScore(article, userProfile),
      processing_timestamp: new Date().toISOString()
    }));
  }

  // Register agents with Chat Protocol for ASI:One discovery
  async registerAgentsWithChatProtocol() {
    try {
      // Register News Fetcher Agent
      await this.chatProtocol.registerAgent({
        id: 'blockchainvibe-news-fetcher',
        name: 'BlockchainVibe News Fetcher',
        description: 'Fetches and processes blockchain news from various sources',
        capabilities: ['news_fetching', 'content_processing', 'quality_scoring'],
        endpoint: 'http://localhost:8001/submit',
        category: 'news',
        tags: ['blockchain', 'news', 'rss', 'aggregation']
      });

      // Register Relevance Scorer Agent
      await this.chatProtocol.registerAgent({
        id: 'blockchainvibe-relevance-scorer',
        name: 'BlockchainVibe Relevance Scorer',
        description: 'Calculates personalized relevance scores for news articles',
        capabilities: ['relevance_scoring', 'personalization', 'user_profiling'],
        endpoint: 'http://localhost:8003/submit',
        category: 'ai',
        tags: ['blockchain', 'ai', 'personalization', 'scoring']
      });

      console.log('Agents registered with Chat Protocol for ASI:One discovery');
    } catch (error) {
      console.error('Failed to register agents with Chat Protocol:', error);
    }
  }

  // Enhanced news processing with MeTTa knowledge graph
  async processNewsWithMeTTa(newsItems, userProfile = null) {
    try {
      const enhancedNews = [];

      for (const item of newsItems) {
        // Extract entities using MeTTa
        const entities = await this.mettaIntegration.extractEntitiesWithMeTTa(
          item.title + ' ' + item.summary
        );

        // Categorize using MeTTa
        const categories = await this.mettaIntegration.categorizeWithMeTTa(
          item.title + ' ' + item.summary
        );

        // Calculate relevance using MeTTa
        const relevanceResult = await this.mettaIntegration.calculateRelevanceWithMeTTa(
          item, userProfile
        );

        enhancedNews.push({
          ...item,
          entities: entities,
          categories: categories.map(c => c.category),
          relevance_score: relevanceResult.relevance_score,
          metta_enhanced: true,
          reasoning: relevanceResult.reasoning,
          matched_concepts: relevanceResult.matched_concepts,
          processing_timestamp: new Date().toISOString()
        });
      }

      return enhancedNews;
    } catch (error) {
      console.error('MeTTa processing error:', error);
      // Fallback to basic processing
      return this.fallbackProcessing(newsItems, userProfile);
    }
  }

  // Handle Chat Protocol messages
  async handleChatMessage(message) {
    return await this.chatProtocol.handleChatMessage(message);
  }

  // Get available agents for discovery
  getAvailableAgents() {
    return this.chatProtocol.getAvailableAgents();
  }

  // Get agent status
  getAgentStatus() {
    const status = {};
    this.agents.forEach((agent, name) => {
      status[name] = {
        status: agent.status,
        lastActivity: agent.lastActivity,
        capabilities: agent.capabilities
      };
    });
    return status;
  }

  // Get MeTTa integration status
  getMeTTaStatus() {
    return {
      available: this.mettaIntegration.isMeTTaAvailable(),
      stats: this.mettaIntegration.getMeTTaStats()
    };
  }

  // Get Chat Protocol statistics
  getChatProtocolStats() {
    return this.chatProtocol.getStats();
  }
}
