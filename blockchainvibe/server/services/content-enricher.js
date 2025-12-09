// Content Enrichment Service
// Adds sentiment analysis, entity extraction, summaries, and other enhancements

export class ContentEnricher {
  constructor() {
    this.sentimentKeywords = {
      bullish: ['bullish', 'surge', 'rally', 'gain', 'rise', 'up', 'positive', 'growth', 'adoption', 'breakthrough', 'milestone', 'success'],
      bearish: ['bearish', 'drop', 'fall', 'decline', 'crash', 'down', 'negative', 'concern', 'risk', 'warning', 'failure', 'loss'],
      neutral: ['update', 'announcement', 'release', 'partnership', 'integration']
    };

    this.entityPatterns = {
      tokens: /\b(BTC|ETH|SOL|ADA|DOT|AVAX|MATIC|LINK|UNI|AAVE|COMP|MKR|CRV|SNX|SUSHI|1INCH|YFI|BAL|LDO|RPL|FXS|CVX)\b/gi,
      projects: /\b(Uniswap|Aave|Compound|Maker|Curve|Chainlink|Polygon|Arbitrum|Optimism|Solana|Cardano|Polkadot|Avalanche|Cosmos|Terra|Fantom|Near|Algorand|Tezos|Filecoin)\b/gi,
      protocols: /\b(DeFi|NFT|Web3|Layer 2|Rollup|ZK-Rollup|Optimistic Rollup|Sidechain|Bridge|DAO|Governance|Staking|Yield Farming|Liquidity Mining)\b/gi
    };
  }

  /**
   * Enrich an article with additional metadata
   */
  enrichArticle(article) {
    const enriched = { ...article };

    // Extract entities
    enriched.entities = this.extractEntities(article);

    // Analyze sentiment
    enriched.sentiment = this.analyzeSentiment(article);

    // Generate summary if not present
    if (!enriched.summary && enriched.content) {
      enriched.summary = this.generateSummary(enriched.content);
    }

    // Detect breaking news
    enriched.is_breaking = this.detectBreakingNews(article);

    // Extract categories
    enriched.categories = this.extractCategories(article);

    // Calculate quality score
    enriched.quality_score = this.calculateQualityScore(article);

    // Extract tags
    enriched.tags = this.extractTags(article);

    return enriched;
  }

  /**
   * Extract entities from article
   */
  extractEntities(article) {
    const text = this.getArticleText(article);
    const entities = {
      tokens: [],
      projects: [],
      protocols: [],
      people: [],
      companies: []
    };

    // Extract tokens
    const tokenMatches = text.match(this.entityPatterns.tokens);
    if (tokenMatches) {
      entities.tokens = [...new Set(tokenMatches.map(t => t.toUpperCase()))];
    }

    // Extract projects
    const projectMatches = text.match(this.entityPatterns.projects);
    if (projectMatches) {
      entities.projects = [...new Set(projectMatches)];
    }

    // Extract protocols
    const protocolMatches = text.match(this.entityPatterns.protocols);
    if (protocolMatches) {
      entities.protocols = [...new Set(protocolMatches)];
    }

    // Extract people (common names in crypto)
    const peoplePattern = /\b(Vitalik|Buterin|Satoshi|Nakamoto|Charles|Hoskinson|Gavin|Wood|Sergey|Nazarov|Hayden|Adams|Stani|Kulechov)\b/gi;
    const peopleMatches = text.match(peoplePattern);
    if (peopleMatches) {
      entities.people = [...new Set(peopleMatches)];
    }

    return entities;
  }

  /**
   * Analyze sentiment of article
   */
  analyzeSentiment(article) {
    const text = this.getArticleText(article).toLowerCase();

    let bullishScore = 0;
    let bearishScore = 0;
    let neutralScore = 0;

    // Count sentiment keywords
    for (const keyword of this.sentimentKeywords.bullish) {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      bullishScore += matches;
    }

    for (const keyword of this.sentimentKeywords.bearish) {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      bearishScore += matches;
    }

    for (const keyword of this.sentimentKeywords.neutral) {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      neutralScore += matches;
    }

    // Determine sentiment
    if (bullishScore > bearishScore + 2) {
      return {
        overall: 'bullish',
        confidence: Math.min((bullishScore / (bullishScore + bearishScore + neutralScore)) * 100, 100),
        scores: { bullish: bullishScore, bearish: bearishScore, neutral: neutralScore }
      };
    } else if (bearishScore > bullishScore + 2) {
      return {
        overall: 'bearish',
        confidence: Math.min((bearishScore / (bullishScore + bearishScore + neutralScore)) * 100, 100),
        scores: { bullish: bullishScore, bearish: bearishScore, neutral: neutralScore }
      };
    } else {
      return {
        overall: 'neutral',
        confidence: Math.min((neutralScore / (bullishScore + bearishScore + neutralScore + 1)) * 100, 100),
        scores: { bullish: bullishScore, bearish: bearishScore, neutral: neutralScore }
      };
    }
  }

  /**
   * Generate a summary from content
   */
  generateSummary(content, maxLength = 200) {
    if (!content) return '';

    // Simple extractive summarization (first few sentences)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length === 0) {
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }

    // Take first 2-3 sentences that fit in maxLength
    let summary = '';
    for (const sentence of sentences.slice(0, 3)) {
      if ((summary + sentence).length <= maxLength) {
        summary += sentence.trim() + '. ';
      } else {
        break;
      }
    }

    return summary.trim() || content.substring(0, maxLength) + '...';
  }

  /**
   * Detect if article is breaking news
   */
  detectBreakingNews(article) {
    const title = (article.title || '').toLowerCase();
    const text = this.getArticleText(article).toLowerCase();

    // Breaking news indicators
    const breakingKeywords = [
      'breaking', 'urgent', 'just in', 'developing', 'live', 'alert',
      'exclusive', 'first', 'reports', 'confirmed', 'announced'
    ];

    const hasBreakingKeyword = breakingKeywords.some(keyword => 
      title.includes(keyword) || text.includes(keyword)
    );

    // Check recency (very recent articles more likely to be breaking)
    const isRecent = this.isVeryRecent(article);

    // Check source authority (tier 1 sources more likely to have breaking news)
    const isAuthoritative = (article.source_priority || 4) <= 2;

    return hasBreakingKeyword && (isRecent || isAuthoritative);
  }

  /**
   * Check if article is very recent (less than 2 hours old)
   */
  isVeryRecent(article) {
    if (!article.published_at) return false;

    try {
      const publishedTime = new Date(article.published_at).getTime();
      const now = Date.now();
      const ageHours = (now - publishedTime) / (1000 * 60 * 60);
      return ageHours < 2;
    } catch {
      return false;
    }
  }

  /**
   * Extract categories from article
   */
  extractCategories(article) {
    const text = this.getArticleText(article).toLowerCase();
    const categories = new Set();

    // Check against category keywords
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS || {})) {
      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          categories.add(category);
          break;
        }
      }
    }

    // Use existing category if available
    if (article.category) {
      categories.add(article.category);
    }

    return Array.from(categories);
  }

  /**
   * Calculate quality score for article
   */
  calculateQualityScore(article) {
    let score = 0.5;

    // Title quality
    const title = article.title || '';
    if (title.length >= 30 && title.length <= 100) {
      score += 0.1;
    }

    // Content length
    const content = article.content || article.summary || '';
    if (content.length >= 200) {
      score += 0.1;
    }
    if (content.length >= 500) {
      score += 0.1;
    }

    // Image presence
    if (article.image_url) {
      score += 0.1;
    }

    // Source priority (higher priority = higher quality)
    const sourcePriority = article.source_priority || 4;
    if (sourcePriority <= 2) {
      score += 0.2;
    } else if (sourcePriority === 3) {
      score += 0.1;
    }

    // Author presence
    if (article.author) {
      score += 0.05;
    }

    // URL validity
    if (article.url && article.url.startsWith('http')) {
      score += 0.05;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Extract tags from article
   */
  extractTags(article) {
    const tags = new Set();
    const text = this.getArticleText(article).toLowerCase();

    // Common tags
    const commonTags = [
      'bitcoin', 'ethereum', 'defi', 'nft', 'web3', 'crypto', 'blockchain',
      'trading', 'regulation', 'adoption', 'partnership', 'launch', 'update'
    ];

    for (const tag of commonTags) {
      if (text.includes(tag)) {
        tags.add(tag);
      }
    }

    // Add entities as tags
    const entities = this.extractEntities(article);
    entities.tokens.forEach(token => tags.add(token.toLowerCase()));
    entities.projects.forEach(project => tags.add(project.toLowerCase()));

    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }

  /**
   * Get article text for analysis
   */
  getArticleText(article) {
    return `${article.title || ''} ${article.content || article.summary || article.excerpt || ''}`;
  }

  /**
   * Enrich multiple articles
   */
  enrichArticles(articles) {
    return articles.map(article => this.enrichArticle(article));
  }
}

// Singleton instance
export const contentEnricher = new ContentEnricher();

