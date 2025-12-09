// Advanced User Profiling System
// Tracks user behavior, preferences, and generates comprehensive profiles

export class UserProfilingService {
  constructor() {
    this.profiles = new Map(); // In-memory cache (should use D1 in production)
  }

  /**
   * Get or create user profile
   */
  async getUserProfile(userId, db = null) {
    // Check cache first
    if (this.profiles.has(userId)) {
      return this.profiles.get(userId);
    }

    // Load from database
    let profile = null;
    if (db) {
      try {
        const result = await db.prepare(
          'SELECT profile_data FROM user_profiles WHERE user_id = ?'
        ).bind(userId).first();
        
        if (result?.profile_data) {
          profile = JSON.parse(result.profile_data);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }

    // Create default profile if none exists
    if (!profile) {
      profile = this.createDefaultProfile(userId);
    }

    // Cache profile
    this.profiles.set(userId, profile);
    return profile;
  }

  /**
   * Create default user profile
   */
  createDefaultProfile(userId) {
    return {
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // Reading behavior
      reading_history: [],
      reading_stats: {
        total_articles_read: 0,
        total_reading_time_minutes: 0,
        average_reading_time_minutes: 0,
        favorite_categories: [],
        favorite_sources: [],
        reading_time_by_hour: {},
        reading_time_by_day: {}
      },
      
      // Engagement patterns
      activity: {
        liked_articles: [],
        saved_articles: [],
        shared_articles: [],
        read_articles: [],
        skipped_articles: []
      },
      
      // Interests and preferences
      interests: [],
      preferences: {
        topics: [],
        tokens: [],
        projects: [],
        sources: [],
        sentiment: 'neutral', // bullish, bearish, neutral
        article_length: 'medium', // short, medium, long
        content_type: 'all', // news, analysis, opinion
        frequency: 'daily'
      },
      
      // Behavioral patterns
      behavior: {
        peak_reading_hours: [],
        preferred_categories: [],
        engagement_rate: 0,
        completion_rate: 0,
        skip_rate: 0
      },
      
      // Learning data
      learning: {
        last_updated: new Date().toISOString(),
        confidence_score: 0, // How confident we are in the profile
        data_points: 0
      }
    };
  }

  /**
   * Update user profile based on activity
   */
  async updateProfileFromActivity(userId, activity, db = null) {
    const profile = await this.getUserProfile(userId, db);
    
    // Update based on activity type
    switch (activity.type) {
      case 'read':
        this.recordReading(profile, activity);
        break;
      case 'like':
        this.recordLike(profile, activity);
        break;
      case 'save':
        this.recordSave(profile, activity);
        break;
      case 'share':
        this.recordShare(profile, activity);
        break;
      case 'skip':
        this.recordSkip(profile, activity);
        break;
    }

    // Recalculate statistics
    this.recalculateStats(profile);

    // Update timestamp
    profile.updated_at = new Date().toISOString();
    profile.learning.last_updated = new Date().toISOString();
    profile.learning.data_points += 1;

    // Save to database
    if (db) {
      await this.saveProfile(userId, profile, db);
    }

    // Update cache
    this.profiles.set(userId, profile);

    return profile;
  }

  /**
   * Record reading activity
   */
  recordReading(profile, activity) {
    const article = activity.metadata || {};
    
    // Add to reading history (keep last 100)
    profile.reading_history.unshift({
      article_id: activity.article_id,
      title: activity.article_title || article.title,
      source: activity.article_source || article.source,
      category: article.category,
      categories: article.categories,
      tags: article.tags,
      reading_time: activity.duration_ms ? activity.duration_ms / 1000 / 60 : 0, // minutes
      timestamp: new Date().toISOString()
    });
    
    if (profile.reading_history.length > 100) {
      profile.reading_history = profile.reading_history.slice(0, 100);
    }

    // Update reading stats
    profile.reading_stats.total_articles_read += 1;
    if (activity.duration_ms) {
      const minutes = activity.duration_ms / 1000 / 60;
      profile.reading_stats.total_reading_time_minutes += minutes;
      profile.reading_stats.average_reading_time_minutes = 
        profile.reading_stats.total_reading_time_minutes / profile.reading_stats.total_articles_read;
    }

    // Track reading time by hour
    const hour = new Date().getHours();
    profile.reading_stats.reading_time_by_hour[hour] = 
      (profile.reading_stats.reading_time_by_hour[hour] || 0) + 1;

    // Track favorite categories
    if (article.category || article.categories) {
      const categories = article.categories || [article.category];
      for (const cat of categories) {
        const index = profile.reading_stats.favorite_categories.findIndex(c => c.category === cat);
        if (index >= 0) {
          profile.reading_stats.favorite_categories[index].count += 1;
        } else {
          profile.reading_stats.favorite_categories.push({ category: cat, count: 1 });
        }
      }
    }

    // Track favorite sources
    if (activity.article_source) {
      const index = profile.reading_stats.favorite_sources.findIndex(s => s.source === activity.article_source);
      if (index >= 0) {
        profile.reading_stats.favorite_sources[index].count += 1;
      } else {
        profile.reading_stats.favorite_sources.push({ source: activity.article_source, count: 1 });
      }
    }

    // Add to read articles
    if (!profile.activity.read_articles.includes(activity.article_id)) {
      profile.activity.read_articles.push(activity.article_id);
      if (profile.activity.read_articles.length > 500) {
        profile.activity.read_articles = profile.activity.read_articles.slice(-500);
      }
    }
  }

  /**
   * Record like activity
   */
  recordLike(profile, activity) {
    const article = activity.metadata || {};
    
    if (!profile.activity.liked_articles.includes(activity.article_id)) {
      profile.activity.liked_articles.push(activity.article_id);
      
      // Learn from liked articles
      this.learnFromArticle(profile, article, 'like');
    }
  }

  /**
   * Record save activity
   */
  recordSave(profile, activity) {
    const article = activity.metadata || {};
    
    if (!profile.activity.saved_articles.includes(activity.article_id)) {
      profile.activity.saved_articles.push(activity.article_id);
      
      // Learn from saved articles
      this.learnFromArticle(profile, article, 'save');
    }
  }

  /**
   * Record share activity
   */
  recordShare(profile, activity) {
    const article = activity.metadata || {};
    
    if (!profile.activity.shared_articles.includes(activity.article_id)) {
      profile.activity.shared_articles.push(activity.article_id);
      
      // Learn from shared articles
      this.learnFromArticle(profile, article, 'share');
    }
  }

  /**
   * Record skip activity
   */
  recordSkip(profile, activity) {
    const article = activity.metadata || {};
    
    if (!profile.activity.skipped_articles.includes(activity.article_id)) {
      profile.activity.skipped_articles.push(activity.article_id);
      
      // Learn what user doesn't like
      this.learnFromArticle(profile, article, 'skip', false);
    }
  }

  /**
   * Learn from article interaction
   */
  learnFromArticle(profile, article, interactionType, positive = true) {
    const weight = positive ? 1 : -0.5; // Negative weight for skips
    
    // Learn categories
    if (article.categories || article.category) {
      const categories = article.categories || [article.category];
      for (const cat of categories) {
        const index = profile.preferences.topics.findIndex(t => t.toLowerCase() === cat.toLowerCase());
        if (index >= 0) {
          profile.preferences.topics[index].score = (profile.preferences.topics[index].score || 0) + weight;
        } else {
          profile.preferences.topics.push({ name: cat, score: weight });
        }
      }
    }

    // Learn sources
    if (article.source) {
      const index = profile.preferences.sources.findIndex(s => s.toLowerCase() === article.source.toLowerCase());
      if (index >= 0) {
        profile.preferences.sources[index].score = (profile.preferences.sources[index].score || 0) + weight;
      } else {
        profile.preferences.sources.push({ name: article.source, score: weight });
      }
    }

    // Learn sentiment
    if (article.sentiment) {
      const sentiment = article.sentiment.overall || article.sentiment;
      if (positive) {
        // Track sentiment preferences
        if (!profile.preferences.sentiment_history) {
          profile.preferences.sentiment_history = { bullish: 0, bearish: 0, neutral: 0 };
        }
        profile.preferences.sentiment_history[sentiment] = 
          (profile.preferences.sentiment_history[sentiment] || 0) + 1;
        
        // Update preferred sentiment (most common)
        const maxSentiment = Object.entries(profile.preferences.sentiment_history)
          .sort((a, b) => b[1] - a[1])[0];
        if (maxSentiment) {
          profile.preferences.sentiment = maxSentiment[0];
        }
      }
    }

    // Learn tokens and projects from entities
    if (article.entities) {
      if (article.entities.tokens) {
        for (const token of article.entities.tokens) {
          const index = profile.preferences.tokens.findIndex(t => t.toLowerCase() === token.toLowerCase());
          if (index >= 0) {
            profile.preferences.tokens[index].score = (profile.preferences.tokens[index].score || 0) + weight;
          } else {
            profile.preferences.tokens.push({ name: token, score: weight });
          }
        }
      }

      if (article.entities.projects) {
        for (const project of article.entities.projects) {
          const index = profile.preferences.projects.findIndex(p => p.toLowerCase() === project.toLowerCase());
          if (index >= 0) {
            profile.preferences.projects[index].score = (profile.preferences.projects[index].score || 0) + weight;
          } else {
            profile.preferences.projects.push({ name: project, score: weight });
          }
        }
      }
    }
  }

  /**
   * Recalculate statistics
   */
  recalculateStats(profile) {
    // Calculate engagement rate
    const totalInteractions = 
      profile.activity.liked_articles.length +
      profile.activity.saved_articles.length +
      profile.activity.shared_articles.length;
    const totalRead = profile.activity.read_articles.length;
    profile.behavior.engagement_rate = totalRead > 0 ? totalInteractions / totalRead : 0;

    // Calculate completion rate (simplified)
    profile.behavior.completion_rate = 0.7; // Would need reading time vs article length

    // Calculate skip rate
    const totalShown = totalRead + profile.activity.skipped_articles.length;
    profile.behavior.skip_rate = totalShown > 0 ? profile.activity.skipped_articles.length / totalShown : 0;

    // Find peak reading hours
    const hours = Object.entries(profile.reading_stats.reading_time_by_hour)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    profile.behavior.peak_reading_hours = hours;

    // Find preferred categories
    profile.behavior.preferred_categories = profile.reading_stats.favorite_categories
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(c => c.category);

    // Calculate confidence score
    profile.learning.confidence_score = Math.min(
      profile.learning.data_points / 50, // 50 data points = full confidence
      1.0
    );
  }

  /**
   * Save profile to database
   */
  async saveProfile(userId, profile, db) {
    try {
      await db.prepare(`
        INSERT INTO user_profiles (user_id, profile_data, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          profile_data = ?,
          updated_at = ?
      `).bind(
        userId,
        JSON.stringify(profile),
        profile.updated_at,
        JSON.stringify(profile),
        profile.updated_at
      ).run();
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  /**
   * Get profile summary for API responses
   */
  getProfileSummary(profile) {
    return {
      user_id: profile.user_id,
      interests: profile.interests,
      preferences: {
        topics: profile.preferences.topics
          .filter(t => typeof t === 'object' ? t.score > 0 : true)
          .map(t => typeof t === 'object' ? t.name : t)
          .slice(0, 10),
        tokens: profile.preferences.tokens
          .filter(t => t.score > 0)
          .map(t => t.name)
          .slice(0, 10),
        projects: profile.preferences.projects
          .filter(p => p.score > 0)
          .map(p => p.name)
          .slice(0, 10),
        sources: profile.preferences.sources
          .filter(s => s.score > 0)
          .map(s => s.name)
          .slice(0, 5),
        sentiment: profile.preferences.sentiment
      },
      behavior: {
        engagement_rate: profile.behavior.engagement_rate,
        preferred_categories: profile.behavior.preferred_categories,
        peak_reading_hours: profile.behavior.peak_reading_hours
      },
      confidence_score: profile.learning.confidence_score
    };
  }
}

// Singleton instance
export const userProfilingService = new UserProfilingService();

