// Knowledge Graph Implementation for BlockchainVibe
// This implements a custom knowledge graph for news categorization and entity extraction
// Alternative to SingularityNET MeTTa (which is not publicly available)

export class BlockchainKnowledgeGraph {
  constructor() {
    this.entities = new Map();
    this.relationships = new Map();
    this.categories = new Map();
    this.initializeGraph();
  }

  // Initialize the knowledge graph with blockchain/crypto entities
  initializeGraph() {
    // Core blockchain entities
    this.addEntity('bitcoin', {
      type: 'cryptocurrency',
      aliases: ['btc', 'bitcoin network', 'satoshi'],
      properties: {
        market_cap: 'high',
        volatility: 'high',
        use_case: 'store_of_value',
        consensus: 'proof_of_work'
      }
    });

    this.addEntity('ethereum', {
      type: 'cryptocurrency',
      aliases: ['eth', 'ethereum network', 'ether'],
      properties: {
        market_cap: 'high',
        volatility: 'high',
        use_case: 'smart_contracts',
        consensus: 'proof_of_stake'
      }
    });

    // DeFi entities
    this.addEntity('defi', {
      type: 'ecosystem',
      aliases: ['decentralized finance', 'open finance'],
      properties: {
        category: 'financial_services',
        key_features: ['lending', 'borrowing', 'trading', 'yield_farming']
      }
    });

    this.addEntity('uniswap', {
      type: 'protocol',
      aliases: ['uni', 'uniswap protocol'],
      properties: {
        category: 'dex',
        function: 'automated_market_maker',
        blockchain: 'ethereum'
      }
    });

    // NFT entities
    this.addEntity('nft', {
      type: 'token_standard',
      aliases: ['non-fungible token', 'nfts'],
      properties: {
        standard: 'erc-721',
        use_cases: ['digital_art', 'collectibles', 'gaming', 'real_estate']
      }
    });

    this.addEntity('opensea', {
      type: 'platform',
      aliases: ['opensea marketplace'],
      properties: {
        category: 'nft_marketplace',
        blockchain: 'ethereum',
        function: 'nft_trading'
      }
    });

    // Layer 2 entities
    this.addEntity('layer2', {
      type: 'scaling_solution',
      aliases: ['l2', 'layer 2', 'scaling'],
      properties: {
        purpose: 'scalability',
        types: ['rollups', 'sidechains', 'state_channels']
      }
    });

    this.addEntity('polygon', {
      type: 'blockchain',
      aliases: ['matic', 'polygon network'],
      properties: {
        category: 'sidechain',
        parent_chain: 'ethereum',
        function: 'scaling'
      }
    });

    // Web3 entities
    this.addEntity('web3', {
      type: 'concept',
      aliases: ['web 3', 'web3.0', 'decentralized web'],
      properties: {
        principles: ['decentralization', 'user_ownership', 'permissionless'],
        technologies: ['blockchain', 'cryptocurrency', 'smart_contracts']
      }
    });

    // Establish relationships
    this.addRelationship('bitcoin', 'defi', 'influences', 0.3);
    this.addRelationship('ethereum', 'defi', 'enables', 0.9);
    this.addRelationship('ethereum', 'nft', 'supports', 0.8);
    this.addRelationship('defi', 'uniswap', 'includes', 0.8);
    this.addRelationship('nft', 'opensea', 'traded_on', 0.9);
    this.addRelationship('ethereum', 'layer2', 'scaled_by', 0.7);
    this.addRelationship('ethereum', 'polygon', 'scaled_by', 0.8);
    this.addRelationship('web3', 'ethereum', 'built_on', 0.9);
    this.addRelationship('web3', 'defi', 'includes', 0.8);
  }

  // Add entity to knowledge graph
  addEntity(name, data) {
    this.entities.set(name.toLowerCase(), {
      name,
      ...data,
      created_at: new Date().toISOString()
    });
  }

  // Add relationship between entities
  addRelationship(from, to, type, strength) {
    const key = `${from.toLowerCase()}-${to.toLowerCase()}`;
    this.relationships.set(key, {
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      type,
      strength,
      created_at: new Date().toISOString()
    });
  }

  // Extract entities from text
  extractEntities(text) {
    const entities = [];
    const lowerText = text.toLowerCase();
    
    for (const [entityName, entityData] of this.entities) {
      // Check if entity name appears in text
      if (lowerText.includes(entityName)) {
        entities.push({
          name: entityName,
          type: entityData.type,
          confidence: 0.9,
          source: 'exact_match'
        });
      }
      
      // Check aliases
      if (entityData.aliases) {
        for (const alias of entityData.aliases) {
          if (lowerText.includes(alias.toLowerCase())) {
            entities.push({
              name: entityName,
              type: entityData.type,
              alias: alias,
              confidence: 0.8,
              source: 'alias_match'
            });
          }
        }
      }
    }
    
    return entities;
  }

  // Categorize content based on entities
  categorizeContent(text) {
    const entities = this.extractEntities(text);
    const categories = new Set();
    
    for (const entity of entities) {
      const entityData = this.entities.get(entity.name);
      if (entityData) {
        // Map entity types to categories
        switch (entityData.type) {
          case 'cryptocurrency':
            if (entity.name === 'bitcoin') {
              categories.add('bitcoin');
            } else if (entity.name === 'ethereum') {
              categories.add('ethereum');
            } else {
              categories.add('cryptocurrency');
            }
            break;
          case 'ecosystem':
            if (entity.name === 'defi') {
              categories.add('defi');
            }
            break;
          case 'token_standard':
            if (entity.name === 'nft') {
              categories.add('nft');
            }
            break;
          case 'scaling_solution':
          case 'blockchain':
            if (entity.name === 'layer2' || entity.name === 'polygon') {
              categories.add('layer2');
            }
            break;
          case 'concept':
            if (entity.name === 'web3') {
              categories.add('web3');
            }
            break;
        }
      }
    }
    
    return Array.from(categories);
  }

  // Calculate relevance score based on knowledge graph
  calculateRelevanceScore(article, userProfile) {
    const articleText = (article.title + ' ' + article.summary).toLowerCase();
    const articleEntities = this.extractEntities(articleText);
    
    if (!userProfile || !userProfile.interests) {
      return 0.5;
    }
    
    let relevanceScore = 0.5;
    const userInterests = userProfile.interests.map(interest => interest.toLowerCase());
    
    // Check direct interest matches
    for (const entity of articleEntities) {
      if (userInterests.includes(entity.name)) {
        relevanceScore += 0.2;
      }
    }
    
    // Check related entities
    for (const entity of articleEntities) {
      const relatedEntities = this.getRelatedEntities(entity.name);
      for (const related of relatedEntities) {
        if (userInterests.includes(related.name)) {
          relevanceScore += 0.1 * related.strength;
        }
      }
    }
    
    // Check category matches
    const articleCategories = this.categorizeContent(articleText);
    if (userProfile.topic_preferences) {
      const userTopics = userProfile.topic_preferences.map(topic => topic.toLowerCase());
      for (const category of articleCategories) {
        if (userTopics.includes(category)) {
          relevanceScore += 0.15;
        }
      }
    }
    
    return Math.min(relevanceScore, 1.0);
  }

  // Get entities related to a given entity
  getRelatedEntities(entityName) {
    const related = [];
    
    for (const [key, relationship] of this.relationships) {
      if (relationship.from === entityName.toLowerCase()) {
        const targetEntity = this.entities.get(relationship.to);
        if (targetEntity) {
          related.push({
            name: relationship.to,
            type: targetEntity.type,
            relationship: relationship.type,
            strength: relationship.strength
          });
        }
      } else if (relationship.to === entityName.toLowerCase()) {
        const sourceEntity = this.entities.get(relationship.from);
        if (sourceEntity) {
          related.push({
            name: relationship.from,
            type: sourceEntity.type,
            relationship: relationship.type,
            strength: relationship.strength
          });
        }
      }
    }
    
    return related;
  }

  // Get entity information
  getEntity(name) {
    return this.entities.get(name.toLowerCase());
  }

  // Get all entities of a specific type
  getEntitiesByType(type) {
    const entities = [];
    for (const [name, data] of this.entities) {
      if (data.type === type) {
        entities.push({ name, ...data });
      }
    }
    return entities;
  }

  // Search entities by keyword
  searchEntities(keyword) {
    const results = [];
    const lowerKeyword = keyword.toLowerCase();
    
    for (const [name, data] of this.entities) {
      if (name.includes(lowerKeyword) || 
          (data.aliases && data.aliases.some(alias => alias.toLowerCase().includes(lowerKeyword)))) {
        results.push({ name, ...data });
      }
    }
    
    return results;
  }

  // Get graph statistics
  getStats() {
    return {
      total_entities: this.entities.size,
      total_relationships: this.relationships.size,
      entity_types: this.getEntityTypeCounts(),
      last_updated: new Date().toISOString()
    };
  }

  // Get count of entities by type
  getEntityTypeCounts() {
    const counts = {};
    for (const [name, data] of this.entities) {
      counts[data.type] = (counts[data.type] || 0) + 1;
    }
    return counts;
  }
}
