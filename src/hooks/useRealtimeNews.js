// React Hook for Real-time News Updates via WebSocket

import { useEffect, useState, useCallback } from 'react';
import { newsWebSocket } from '../services/websocket';

export const useRealtimeNews = (options = {}) => {
  const {
    enabled = true,
    categories = ['all'],
    onNewArticle = null,
    onBreakingNews = null,
    autoConnect = true
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [newArticles, setNewArticles] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [error, setError] = useState(null);

  // Handle new article
  const handleNewArticle = useCallback((article) => {
    setNewArticles(prev => [article, ...prev].slice(0, 50)); // Keep last 50
    if (onNewArticle) {
      onNewArticle(article);
    }
  }, [onNewArticle]);

  // Handle breaking news
  const handleBreakingNews = useCallback((article) => {
    setBreakingNews(prev => [article, ...prev].slice(0, 10)); // Keep last 10
    if (onBreakingNews) {
      onBreakingNews(article);
    }
  }, [onBreakingNews]);

  useEffect(() => {
    if (!enabled || !autoConnect) return;

    // Get userId
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.user_id || user?.id;

    // Connect
    newsWebSocket.connect(userId);

    // Set up event listeners
    const onConnected = () => {
      setIsConnected(true);
      setError(null);
      // Subscribe to categories
      if (categories.length > 0) {
        newsWebSocket.subscribe(categories);
      }
    };

    const onDisconnected = () => {
      setIsConnected(false);
    };

    const onError = (err) => {
      setError(err);
      setIsConnected(false);
    };

    newsWebSocket.on('connected', onConnected);
    newsWebSocket.on('disconnected', onDisconnected);
    newsWebSocket.on('error', onError);
    newsWebSocket.on('new_article', handleNewArticle);
    newsWebSocket.on('breaking_news', handleBreakingNews);

    // Cleanup
    return () => {
      newsWebSocket.off('connected', onConnected);
      newsWebSocket.off('disconnected', onDisconnected);
      newsWebSocket.off('error', onError);
      newsWebSocket.off('new_article', handleNewArticle);
      newsWebSocket.off('breaking_news', handleBreakingNews);
    };
  }, [enabled, autoConnect, categories, handleNewArticle, handleBreakingNews]);

  // Update subscriptions when categories change
  useEffect(() => {
    if (isConnected && categories.length > 0) {
      newsWebSocket.subscribe(categories);
    }
  }, [isConnected, categories]);

  // Manual connect/disconnect
  const connect = useCallback((userId) => {
    newsWebSocket.connect(userId);
  }, []);

  const disconnect = useCallback(() => {
    newsWebSocket.disconnect();
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    newArticles,
    breakingNews,
    error,
    connect,
    disconnect,
    subscribe: newsWebSocket.subscribe.bind(newsWebSocket),
    unsubscribe: newsWebSocket.unsubscribe.bind(newsWebSocket)
  };
};

