// SingularityNET MeTTa Knowledge Graph Integration
// This module integrates with MeTTa for enhanced agent knowledge and reasoning

export class MeTTaIntegration {
  constructor() {
    this.mettaEndpoint = 'https://metta.singularitynet.io/api'; // Set in wrangler.toml if needed
    this.apiKey = null; // Set in wrangler.toml if needed
    this.isAvailable = false;
  }

  // Initialize MeTTa connection
  async initialize() {
    try {
      // Test MeTTa connection
      const response = await fetch(`${this.mettaEndpoint}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.isAvailable = true;
        console.log('MeTTa knowledge graph connected successfully');
        return true;
      } else {
        console.warn('MeTTa knowledge graph not available, using fallback');
        return false;
      }
    } catch (error) {
      console.warn('MeTTa knowledge graph connection failed:', error.message);
      return false;
    }
  }

  // Query MeTTa for blockchain/crypto knowledge
  async queryKnowledge(query, context = {}) {
    if (!this.isAvailable) {
      return this.fallbackQuery(query, context);
    }

    try {
      const response = await fetch(`${this.mettaEndpoint}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          context: context,
          domain: 'blockchain',
          format: 'structured'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return this.processMeTTaResponse(data);
      } else {
        throw new Error(`MeTTa query failed: ${response.status}`);
      }
    } catch (error) {
      console.error('MeTTa query error:', error);
      return this.fallbackQuery(query, context);
    }
  }

  // Process MeTTa response into our format
  processMeTTaResponse(data) {
    return {
      entities: data.entities || [],
      relationships: data.relationships || [],
      concepts: data.concepts || [],
      confidence: data.confidence || 0.5,
      source: 'metta',
      timestamp: new Date().toISOString()
    };
  }

  // Fallback query using our custom knowledge graph (only if MeTTa unavailable)
  fallbackQuery(query, context) {
    // Only use fallback if MeTTa Knowledge Graph is truly unavailable
    // Prioritize MeTTa's Knowledge Graph APIs over custom implementation
    console.warn('MeTTa Knowledge Graph unavailable, using minimal fallback');
    return {
      entities: [],
      relationships: [],
      concepts: [],
      confidence: 0.5,
      source: 'fallback',
      timestamp: new Date().toISOString()
    };
  }

  // Enhanced entity extraction using MeTTa
  async extractEntitiesWithMeTTa(text) {
    const query = `Extract blockchain and cryptocurrency entities from: "${text}"`;
    const result = await this.queryKnowledge(query, { type: 'entity_extraction' });
    
    return result.entities.map(entity => ({
      name: entity.name,
      type: entity.type,
      confidence: entity.confidence || 0.8,
      source: 'metta',
      properties: entity.properties || {}
    }));
  }

  // Enhanced categorization using MeTTa
  async categorizeWithMeTTa(text) {
    const query = `Categorize this blockchain content: "${text}"`;
    const result = await this.queryKnowledge(query, { type: 'categorization' });
    
    return result.concepts.map(concept => ({
      category: concept.category,
      confidence: concept.confidence || 0.8,
      source: 'metta',
      reasoning: concept.reasoning || ''
    }));
  }

  // Calculate relevance using MeTTa knowledge
  async calculateRelevanceWithMeTTa(article, userProfile) {
    const userInterests = userProfile.interests || userProfile.preferences?.topics || userProfile.topics || [];
    const query = `Calculate relevance of this article for user with interests: ${JSON.stringify(userInterests)}`;
    const context = {
      article_title: article.title,
      article_summary: article.summary,
      user_interests: userInterests,
      user_history: userProfile.reading_history || []
    };

    const result = await this.queryKnowledge(query, context);
    
    return {
      relevance_score: result.confidence,
      reasoning: result.reasoning || '',
      matched_concepts: result.concepts || [],
      source: 'metta'
    };
  }

  // Get agent recommendations from MeTTa
  async getAgentRecommendations(userProfile, context) {
    const query = `Recommend specialized agents for user with profile: ${JSON.stringify(userProfile)}`;
    const result = await this.queryKnowledge(query, { 
      type: 'agent_recommendation',
      context: context 
    });

    return result.agents || [];
  }

  // Check MeTTa availability
  isMeTTaAvailable() {
    return this.isAvailable;
  }

  // Get MeTTa statistics
  async getMeTTaStats() {
    if (!this.isAvailable) {
      return { available: false };
    }

    try {
      const response = await fetch(`${this.mettaEndpoint}/stats`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching MeTTa stats:', error);
    }

    return { available: true, stats: 'unavailable' };
  }
}
