// Source Health Monitoring Service
// Tracks source availability, response times, and automatically disables broken feeds

export class SourceHealthMonitor {
  constructor() {
    this.healthData = new Map(); // Store health metrics per source
    this.failureThreshold = 3; // Disable after 3 consecutive failures
    this.successThreshold = 2; // Re-enable after 2 consecutive successes
    this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
  }

  /**
   * Record a successful fetch from a source
   */
  recordSuccess(sourceName, responseTime, articleCount) {
    const health = this.getHealthData(sourceName);
    
    health.lastSuccess = Date.now();
    health.consecutiveFailures = 0;
    health.consecutiveSuccesses = (health.consecutiveSuccesses || 0) + 1;
    health.totalRequests = (health.totalRequests || 0) + 1;
    health.totalSuccesses = (health.totalSuccesses || 0) + 1;
    health.lastResponseTime = responseTime;
    health.lastArticleCount = articleCount;
    
    // Update average response time
    if (!health.avgResponseTime) {
      health.avgResponseTime = responseTime;
    } else {
      health.avgResponseTime = (health.avgResponseTime * 0.9) + (responseTime * 0.1); // Exponential moving average
    }
    
    // Re-enable if it was disabled
    if (health.disabled && health.consecutiveSuccesses >= this.successThreshold) {
      health.disabled = false;
      health.disabledAt = null;
      console.log(`[SourceHealth] Re-enabled source: ${sourceName}`);
    }
    
    this.healthData.set(sourceName, health);
    return health;
  }

  /**
   * Record a failed fetch from a source
   */
  recordFailure(sourceName, error) {
    const health = this.getHealthData(sourceName);
    
    health.lastFailure = Date.now();
    health.consecutiveFailures = (health.consecutiveFailures || 0) + 1;
    health.consecutiveSuccesses = 0;
    health.totalRequests = (health.totalRequests || 0) + 1;
    health.totalFailures = (health.totalFailures || 0) + 1;
    health.lastError = error?.message || 'Unknown error';
    
    // Disable if threshold reached
    if (health.consecutiveFailures >= this.failureThreshold && !health.disabled) {
      health.disabled = true;
      health.disabledAt = Date.now();
      console.warn(`[SourceHealth] Disabled source due to failures: ${sourceName}`);
    }
    
    this.healthData.set(sourceName, health);
    return health;
  }

  /**
   * Get health data for a source
   */
  getHealthData(sourceName) {
    if (!this.healthData.has(sourceName)) {
      this.healthData.set(sourceName, {
        sourceName,
        enabled: true,
        disabled: false,
        totalRequests: 0,
        totalSuccesses: 0,
        totalFailures: 0,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
        lastSuccess: null,
        lastFailure: null,
        lastResponseTime: null,
        avgResponseTime: null,
        lastArticleCount: 0,
        lastError: null,
        disabledAt: null,
        createdAt: Date.now()
      });
    }
    return this.healthData.get(sourceName);
  }

  /**
   * Check if a source is healthy and should be used
   */
  isHealthy(sourceName) {
    const health = this.getHealthData(sourceName);
    return !health.disabled && health.enabled;
  }

  /**
   * Get health status for all sources
   */
  getAllHealthStatus() {
    const status = {};
    for (const [sourceName, health] of this.healthData.entries()) {
      status[sourceName] = {
        enabled: health.enabled && !health.disabled,
        disabled: health.disabled,
        successRate: health.totalRequests > 0 
          ? (health.totalSuccesses / health.totalRequests) * 100 
          : 0,
        avgResponseTime: health.avgResponseTime,
        consecutiveFailures: health.consecutiveFailures,
        lastSuccess: health.lastSuccess,
        lastFailure: health.lastFailure,
        lastError: health.lastError,
        disabledAt: health.disabledAt
      };
    }
    return status;
  }

  /**
   * Get health metrics for a specific source
   */
  getSourceMetrics(sourceName) {
    return this.getHealthData(sourceName);
  }

  /**
   * Manually enable a source
   */
  enableSource(sourceName) {
    const health = this.getHealthData(sourceName);
    health.enabled = true;
    health.disabled = false;
    health.consecutiveFailures = 0;
    health.disabledAt = null;
    this.healthData.set(sourceName, health);
    return health;
  }

  /**
   * Manually disable a source
   */
  disableSource(sourceName) {
    const health = this.getHealthData(sourceName);
    health.enabled = false;
    health.disabled = true;
    health.disabledAt = Date.now();
    this.healthData.set(sourceName, health);
    return health;
  }

  /**
   * Reset health data for a source
   */
  resetSource(sourceName) {
    this.healthData.delete(sourceName);
    return this.getHealthData(sourceName);
  }

  /**
   * Get sources sorted by reliability
   */
  getReliableSources() {
    const sources = Array.from(this.healthData.entries())
      .map(([name, health]) => ({
        name,
        ...health,
        reliability: health.totalRequests > 0 
          ? (health.totalSuccesses / health.totalRequests) 
          : 0.5
      }))
      .filter(source => source.enabled && !source.disabled)
      .sort((a, b) => b.reliability - a.reliability);
    
    return sources;
  }

  /**
   * Clean up old health data (older than 7 days)
   */
  cleanup() {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let cleaned = 0;
    
    for (const [sourceName, health] of this.healthData.entries()) {
      if (health.createdAt < sevenDaysAgo && health.totalRequests === 0) {
        this.healthData.delete(sourceName);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`[SourceHealth] Cleaned up ${cleaned} old source health records`);
    }
  }
}

// Singleton instance
export const sourceHealthMonitor = new SourceHealthMonitor();

