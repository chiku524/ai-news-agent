// WebSocket Service for Real-time News Updates
// Handles WebSocket connections and broadcasts new articles

export class WebSocketService {
  constructor() {
    this.connections = new Map(); // Store active connections by userId
    this.newsQueue = []; // Queue of new articles to broadcast
    this.broadcastInterval = null;
  }

  /**
   * Handle new WebSocket connection
   */
  handleConnection(request, userId = null) {
    // Extract userId from query params or headers
    const url = new URL(request.url);
    const extractedUserId = url.searchParams.get('userId') || userId;

    // Create WebSocket pair
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    // Accept the connection
    server.accept();

    // Store connection
    const connectionId = extractedUserId || `anonymous_${Date.now()}`;
    this.connections.set(connectionId, {
      socket: server,
      userId: extractedUserId,
      connectedAt: Date.now(),
      lastPing: Date.now()
    });

    // Send welcome message
    server.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to BlockchainVibe real-time feed',
      connectionId
    }));

    // Handle messages
    server.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(connectionId, message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle close
    server.addEventListener('close', () => {
      this.connections.delete(connectionId);
    });

    // Handle error
    server.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      this.connections.delete(connectionId);
    });

    // Start ping interval to keep connection alive
    const pingInterval = setInterval(() => {
      if (this.connections.has(connectionId)) {
        try {
          server.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
          const connection = this.connections.get(connectionId);
          if (connection) {
            connection.lastPing = Date.now();
          }
        } catch (error) {
          // Connection closed
          clearInterval(pingInterval);
          this.connections.delete(connectionId);
        }
      } else {
        clearInterval(pingInterval);
      }
    }, 30000); // Ping every 30 seconds

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }

  /**
   * Handle incoming WebSocket message
   */
  handleMessage(connectionId, message) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    switch (message.type) {
      case 'subscribe':
        // Subscribe to specific categories or topics
        connection.subscriptions = message.categories || message.topics || ['all'];
        connection.socket.send(JSON.stringify({
          type: 'subscribed',
          subscriptions: connection.subscriptions
        }));
        break;

      case 'unsubscribe':
        connection.subscriptions = [];
        connection.socket.send(JSON.stringify({
          type: 'unsubscribed'
        }));
        break;

      case 'pong':
        // Response to ping
        connection.lastPing = Date.now();
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  /**
   * Broadcast new article to all connected clients
   */
  broadcastArticle(article) {
    const message = JSON.stringify({
      type: 'new_article',
      article: article,
      timestamp: Date.now()
    });

    let broadcastCount = 0;
    for (const [connectionId, connection] of this.connections.entries()) {
      try {
        // Check if connection should receive this article
        const shouldReceive = this.shouldReceiveArticle(connection, article);
        
        if (shouldReceive) {
          connection.socket.send(message);
          broadcastCount++;
        }
      } catch (error) {
        // Connection closed, remove it
        console.error('Error broadcasting to connection:', connectionId, error);
        this.connections.delete(connectionId);
      }
    }

    return broadcastCount;
  }

  /**
   * Check if connection should receive article based on subscriptions
   */
  shouldReceiveArticle(connection, article) {
    // If no subscriptions, send all articles
    if (!connection.subscriptions || connection.subscriptions.length === 0) {
      return true;
    }

    // Check if article matches any subscription
    const articleCategories = article.categories || [article.category].filter(Boolean);
    const articleTags = article.tags || [];
    const articleText = `${article.title} ${article.content || article.summary || ''}`.toLowerCase();

    for (const subscription of connection.subscriptions) {
      if (subscription === 'all') return true;
      
      // Check category match
      if (articleCategories.some(cat => 
        cat.toLowerCase() === subscription.toLowerCase()
      )) {
        return true;
      }

      // Check tag match
      if (articleTags.some(tag => 
        tag.toLowerCase() === subscription.toLowerCase()
      )) {
        return true;
      }

      // Check text match (for topic subscriptions)
      if (articleText.includes(subscription.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  /**
   * Broadcast breaking news with higher priority
   */
  broadcastBreakingNews(article) {
    const message = JSON.stringify({
      type: 'breaking_news',
      article: article,
      timestamp: Date.now(),
      priority: 'high'
    });

    let broadcastCount = 0;
    for (const [connectionId, connection] of this.connections.entries()) {
      try {
        // Breaking news goes to all connections
        connection.socket.send(message);
        broadcastCount++;
      } catch (error) {
        console.error('Error broadcasting breaking news:', error);
        this.connections.delete(connectionId);
      }
    }

    return broadcastCount;
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      totalConnections: this.connections.size,
      connections: Array.from(this.connections.entries()).map(([id, conn]) => ({
        connectionId: id,
        userId: conn.userId,
        connectedAt: conn.connectedAt,
        lastPing: conn.lastPing,
        subscriptions: conn.subscriptions || []
      }))
    };
  }

  /**
   * Clean up stale connections
   */
  cleanup() {
    const now = Date.now();
    const staleThreshold = 60000; // 1 minute without ping

    for (const [connectionId, connection] of this.connections.entries()) {
      if (now - connection.lastPing > staleThreshold) {
        try {
          connection.socket.close();
        } catch (error) {
          // Already closed
        }
        this.connections.delete(connectionId);
      }
    }
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();

// Cleanup stale connections every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    webSocketService.cleanup();
  }, 5 * 60 * 1000);
}

