import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const newsAPI = {
  getTrendingNews: async (params = {}) => {
    const response = await api.post('/news/trending', params);
    return response.data;
  },

  searchNews: async (query, limit = 10) => {
    const response = await api.post('/news/search', {
      query,
      limit
    });
    return response.data;
  },

  getNewsDetail: async (newsId) => {
    const response = await api.get(`/news/${newsId}`);
    return response.data;
  },

  trackActivity: async (activityData) => {
    const response = await api.post('/user/activity', activityData);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    // Get user from localStorage or use demo user as fallback
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.user_id || user?.id || 'demo_user';
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, profileData) => {
    const response = await api.put('/user/profile', {
      userId,
      profileData
    });
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.user_id || user?.id || 'demo_user';
    const response = await api.post('/user/preferences', {
      user_id: userId,
      preferences
    });
    return response.data;
  },

  trackActivity: async (activityData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.user_id || user?.id || 'demo_user';
    const response = await api.post('/user/activity', {
      user_id: userId,
      ...activityData,
      timestamp: new Date().toISOString()
    });
    return response.data;
  },
};

export const mettaAPI = {
  getContext: async () => {
    const response = await api.get('/metta/context');
    return response.data;
  },

  searchContext: async (query) => {
    const response = await api.post('/metta/search', { query });
    return response.data;
  },
};

export default api;
