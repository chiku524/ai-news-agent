// Enhanced Multi-Factor Relevance Scoring System
// Implements advanced relevance calculation with multiple weighted factors

export class EnhancedRelevanceScorer {
  constructor() {
    // Factor weights (sum should be ~1.0)
    this.factorWeights = {
      contentSimilarity: 0.30,      // How similar to user's reading history
      entityMatch: 0.25,            // Matching entities (tokens, projects, people)
      sentimentAlignment: 0.15,     // User's preferred sentiment
      sourcePreference: 0.10,      // User's preferred sources
      recency: 0.10,                // Article freshness
      engagementPrediction: 0.10   // Predicted user engagement
    };
  }

  /**
   * Calculate comprehensive relevance score for an article
   */
  calculateRelevanceScore(article, userProfile = null) {
    if (!userProfile) {
      // Default score for non-authenticated users
      return this.calculateDefaultScore(article);
    }

    const factors = {
      contentSimilarity: this.calculateContentSimilarity(article, userProfile),
      entityMatch: this.calculateEntityMatch(article, userProfile),
      sentimentAlignment: this.calculateSentimentAlignment(article, userProfile),
      sourcePreference: this.calculateSourcePreference(article, userProfile),
      recency: this.calculateRecency(article),
      engagementPrediction: this.calculateEngagementPrediction(article, userProfile)
    };

    // Calculate weighted score
    let totalScore = 0;
    for (const [factor, weight] of Object.entries(this.factorWeights)) {
      totalScore += factors[factor] * weight;
    }

    // Normalize to 0-1 range
    return Math.min(Math.max(totalScore, 0), 1);
  }

  /**
   * Calculate content similarity based on reading history
   */
  calculateContentSimilarity(article, userProfile) {
    const readingHistory = userProfile.reading_history || [];
    const likedArticles = userProfile.activity?.liked_articles || [];
    const savedArticles = userProfile.activity?.saved_articles || [];
    
    if (readingHistory.length === 0 && likedArticles.length === 0 && savedArticles.length === 0) {
      return 0.5; // Neutral if no history
    }

    const articleText = this.getArticleText(article).toLowerCase();
    const articleWords = new Set(articleText.split(/\s+/).filter(w => w.length > 3));

    let similarity = 0;
    let count = 0;

    // Check against reading history
    for (const historyItem of readingHistory) {
      const historyText = (historyItem.title || historyItem.content || '').toLowerCase();
      const historyWords = new Set(historyText.split(/\s+/).filter(w => w.length > 3));
      const intersection = new Set([...articleWords].filter(x => historyWords.has(x)));
      const union = new Set([...articleWords, ...historyWords]);
      const similarityScore = intersection.size / Math.max(union.size, 1);
      similarity += similarityScore;
      count++;
    }

    // Check against liked articles
    for (const liked of likedArticles) {
      const likedText = (liked.title || liked.content || '').toLowerCase();
      const likedWords = new Set(likedText.split(/\s+/).filter(w => w.length > 3));
      const intersection = new Set([...articleWords].filter(x => likedWords.has(x)));
      const union = new Set([...articleWords, ...likedWords]);
      const similarityScore = intersection.size / Math.max(union.size, 1);
      similarity += similarityScore * 1.2; // Liked articles weighted higher
      count++;
    }

    // Check against saved articles
    for (const saved of savedArticles) {
      const savedText = (saved.title || saved.content || '').toLowerCase();
      const savedWords = new Set(savedText.split(/\s+/).filter(w => w.length > 3));
      const intersection = new Set([...articleWords].filter(x => savedWords.has(x)));
      const union = new Set([...articleWords, ...savedWords]);
      const similarityScore = intersection.size / Math.max(union.size, 1);
      similarity += similarityScore * 1.3; // Saved articles weighted even higher
      count++;
    }

    return count > 0 ? Math.min(similarity / count, 1.0) : 0.5;
  }

  /**
   * Calculate entity match score
   */
  calculateEntityMatch(article, userProfile) {
    const userInterests = userProfile.interests || userProfile.preferences?.topics || [];
    const userTokens = userProfile.preferences?.tokens || [];
    const userProjects = userProfile.preferences?.projects || [];

    if (userInterests.length === 0 && userTokens.length === 0 && userProjects.length === 0) {
      return 0.5;
    }

    const articleText = this.getArticleText(article).toLowerCase();
    const articleEntities = this.extractEntities(article);

    let matchScore = 0;
    let matches = 0;

    // Check interests
    for (const interest of userInterests) {
      const interestLower = interest.toLowerCase();
      if (articleText.includes(interestLower) || articleEntities.includes(interestLower)) {
        matchScore += 0.3;
        matches++;
      }
    }

    // Check tokens (weighted higher)
    for (const token of userTokens) {
      const tokenLower = token.toLowerCase();
      if (articleText.includes(tokenLower) || articleEntities.includes(tokenLower)) {
        matchScore += 0.4;
        matches++;
      }
    }

    // Check projects (weighted highest)
    for (const project of userProjects) {
      const projectLower = project.toLowerCase();
      if (articleText.includes(projectLower) || articleEntities.includes(projectLower)) {
        matchScore += 0.5;
        matches++;
      }
    }

    // Normalize based on number of user interests
    const totalInterests = userInterests.length + userTokens.length + userProjects.length;
    return totalInterests > 0 ? Math.min(matchScore / Math.max(totalInterests, 1), 1.0) : 0.5;
  }

  /**
   * Calculate sentiment alignment
   */
  calculateSentimentAlignment(article, userProfile) {
    const preferredSentiment = userProfile.preferences?.sentiment || 'neutral';
    const articleSentiment = article.sentiment || this.analyzeSentiment(article);

    if (preferredSentiment === 'neutral') return 0.5;

    const sentimentMap = {
      'bullish': 1,
      'positive': 1,
      'neutral': 0.5,
      'bearish': 0,
      'negative': 0
    };

    const preferredValue = sentimentMap[preferredSentiment] || 0.5;
    const articleValue = sentimentMap[articleSentiment] || 0.5;

    // Calculate alignment (closer values = higher alignment)
    const alignment = 1 - Math.abs(preferredValue - articleValue);
    return alignment;
  }

  /**
   * Calculate source preference score
   */
  calculateSourcePreference(article, userProfile) {
    const preferredSources = userProfile.preferences?.sources || userProfile.preferred_sources || [];
    
    if (preferredSources.length === 0) return 0.5;

    const articleSource = (article.source || '').toLowerCase();
    const isPreferred = preferredSources.some(source => 
      source.toLowerCase() === articleSource
    );

    return isPreferred ? 1.0 : 0.3;
  }

  /**
   * Calculate recency score
   */
  calculateRecency(article) {
    if (!article.published_at) return 0.5;

    const publishedTime = new Date(article.published_at).getTime();
    const now = Date.now();
    const ageHours = (now - publishedTime) / (1000 * 60 * 60);

    // Exponential decay: newer articles score higher
    if (ageHours < 1) return 1.0;
    if (ageHours < 6) return 0.9;
    if (ageHours < 24) return 0.7;
    if (ageHours < 72) return 0.5;
    if (ageHours < 168) return 0.3; // 1 week
    return 0.1; // Older than 1 week
  }

  /**
   * Predict engagement based on user behavior patterns
   */
  calculateEngagementPrediction(article, userProfile) {
    const activity = userProfile.activity || {};
    const readingHistory = userProfile.reading_history || [];

    // Analyze user's preferred article characteristics
    const preferredLength = this.getPreferredLength(readingHistory);
    const preferredCategories = this.getPreferredCategories(readingHistory);
    const preferredTimeOfDay = this.getPreferredTimeOfDay(activity);

    let prediction = 0.5;

    // Article length preference
    const articleLength = (article.content || article.summary || '').length;
    if (preferredLength > 0) {
      const lengthDiff = Math.abs(articleLength - preferredLength) / preferredLength;
      prediction += (1 - Math.min(lengthDiff, 1)) * 0.2;
    }

    // Category preference
    const articleCategory = article.category || article.categories?.[0];
    if (preferredCategories.length > 0 && articleCategory) {
      if (preferredCategories.includes(articleCategory.toLowerCase())) {
        prediction += 0.3;
      }
    }

    // Time of day preference (if available)
    if (preferredTimeOfDay) {
      const currentHour = new Date().getHours();
      const timeMatch = this.checkTimeMatch(currentHour, preferredTimeOfDay);
      if (timeMatch) {
        prediction += 0.1;
      }
    }

    return Math.min(prediction, 1.0);
  }

  /**
   * Calculate default score for non-authenticated users
   */
  calculateDefaultScore(article) {
    let score = 0.5;

    // Boost for recency
    score += this.calculateRecency(article) * 0.3;

    // Boost for high-quality sources
    const sourcePriority = article.source_priority || 4;
    if (sourcePriority <= 2) {
      score += 0.2;
    }

    // Boost for articles with images
    if (article.image_url) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Extract entities from article text
   */
  extractEntities(article) {
    const text = this.getArticleText(article).toLowerCase();
    const entities = [];

    // Common blockchain entities
    const commonEntities = [
      'bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol',
      'cardano', 'ada', 'polkadot', 'dot', 'avalanche', 'avax',
      'uniswap', 'aave', 'compound', 'maker', 'curve', 'chainlink',
      'defi', 'nft', 'web3', 'metaverse', 'layer 2', 'rollup'
    ];

    for (const entity of commonEntities) {
      if (text.includes(entity)) {
        entities.push(entity);
      }
    }

    return entities;
  }

  /**
   * Analyze sentiment of article
   */
  analyzeSentiment(article) {
    const text = this.getArticleText(article).toLowerCase();

    const bullishKeywords = ['bullish', 'surge', 'rally', 'gain', 'rise', 'up', 'positive', 'growth', 'adoption'];
    const bearishKeywords = ['bearish', 'drop', 'fall', 'decline', 'crash', 'down', 'negative', 'concern', 'risk'];

    let bullishCount = 0;
    let bearishCount = 0;

    for (const keyword of bullishKeywords) {
      if (text.includes(keyword)) bullishCount++;
    }

    for (const keyword of bearishKeywords) {
      if (text.includes(keyword)) bearishCount++;
    }

    if (bullishCount > bearishCount + 2) return 'bullish';
    if (bearishCount > bullishCount + 2) return 'bearish';
    return 'neutral';
  }

  /**
   * Get article text for analysis
   */
  getArticleText(article) {
    return `${article.title || ''} ${article.content || article.summary || article.excerpt || ''}`;
  }

  /**
   * Get preferred article length from reading history
   */
  getPreferredLength(readingHistory) {
    if (readingHistory.length === 0) return 0;

    const lengths = readingHistory
      .map(item => (item.content || item.summary || '').length)
      .filter(len => len > 0);

    if (lengths.length === 0) return 0;

    return lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
  }

  /**
   * Get preferred categories from reading history
   */
  getPreferredCategories(readingHistory) {
    const categoryCounts = new Map();

    for (const item of readingHistory) {
      const categories = item.categories || [item.category].filter(Boolean);
      for (const cat of categories) {
        categoryCounts.set(cat.toLowerCase(), (categoryCounts.get(cat.toLowerCase()) || 0) + 1);
      }
    }

    // Return top 3 categories
    return Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);
  }

  /**
   * Get preferred time of day from activity
   */
  getPreferredTimeOfDay(activity) {
    // This would analyze activity timestamps
    // For now, return null (can be enhanced)
    return null;
  }

  /**
   * Check if current time matches preferred time
   */
  checkTimeMatch(currentHour, preferredTime) {
    // Simple time matching logic
    if (preferredTime === 'morning' && currentHour >= 6 && currentHour < 12) return true;
    if (preferredTime === 'afternoon' && currentHour >= 12 && currentHour < 18) return true;
    if (preferredTime === 'evening' && currentHour >= 18 && currentHour < 22) return true;
    return false;
  }
}

// Singleton instance
export const enhancedRelevanceScorer = new EnhancedRelevanceScorer();

