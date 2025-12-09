// WebSocket Client Service for Real-time News Updates

class NewsWebSocket {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.userId = null;
  }

  /**
   * Connect to WebSocket server
   */
  connect(userId = null) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return; // Already connecting or connected
    }

    this.userId = userId;
    this.isConnecting = true;

    try {
      // Get API URL from environment
      const apiUrl = process.env.REACT_APP_API_URL || 
                     process.env.REACT_APP_API_URL_PROD || 
                     'https://blockchainvibe-api.nico-chikuji.workers.dev';
      
      // Convert http/https to ws/wss
      const wsUrl = apiUrl.replace(/^http/, 'ws') + '/ws/news' + 
                    (userId ? `?userId=${encodeURIComponent(userId)}` : '');

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected to real-time news feed');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed');
        this.isConnecting = false;
        this.emit('disconnected');
        this.attemptReconnect();
      };

    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.isConnecting = false;
      this.emit('error', error);
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  handleMessage(message) {
    switch (message.type) {
      case 'connected':
        console.log('[WebSocket]', message.message);
        this.emit('connected', message);
        break;

      case 'new_article':
        this.emit('new_article', message.article);
        break;

      case 'breaking_news':
        this.emit('breaking_news', message.article);
        break;

      case 'ping':
        // Respond to ping
        this.send({ type: 'pong', timestamp: Date.now() });
        break;

      default:
        console.log('[WebSocket] Unknown message type:', message.type);
    }
  }

  /**
   * Subscribe to specific categories or topics
   */
  subscribe(categories = ['all']) {
    this.send({
      type: 'subscribe',
      categories: Array.isArray(categories) ? categories : [categories]
    });
  }

  /**
   * Unsubscribe from all
   */
  unsubscribe() {
    this.send({ type: 'unsubscribe' });
  }

  /**
   * Send message to server
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message, connection not open');
    }
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocket] Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Attempt to reconnect
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnect attempts reached');
      this.emit('reconnect_failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(this.userId);
    }, delay);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const newsWebSocket = new NewsWebSocket();

// Auto-connect when user is available
if (typeof window !== 'undefined') {
  // Try to get userId from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.user_id || user?.id;
  
  if (userId) {
    // Connect after a short delay to ensure app is loaded
    setTimeout(() => {
      newsWebSocket.connect(userId);
    }, 2000);
  }

  // Reconnect when user logs in
  window.addEventListener('storage', (event) => {
    if (event.key === 'user' && event.newValue) {
      const newUser = JSON.parse(event.newValue);
      const newUserId = newUser?.user_id || newUser?.id;
      if (newUserId && !newsWebSocket.isConnected()) {
        newsWebSocket.connect(newUserId);
      }
    }
  });
}

export default newsWebSocket;

