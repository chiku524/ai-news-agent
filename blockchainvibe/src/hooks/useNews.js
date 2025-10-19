import { useQuery, useMutation, useQueryClient } from 'react-query';
import { newsAPI } from '../services/api';

export const useNews = (params = {}) => {
  const {
    category = 'all',
    timeframe = '24h',
    searchQuery = '',
    sortBy = 'relevance',
    page = 1,
    limit = 20
  } = params;

  return useQuery(
    ['news', { category, timeframe, searchQuery, sortBy, page, limit }],
    () => newsAPI.getTrendingNews({
      category,
      timeframe,
      searchQuery,
      sortBy,
      page,
      limit
    }),
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );
};

export const useSearchNews = (query, options = {}) => {
  const { limit = 10 } = options;

  return useQuery(
    ['search', query, limit],
    () => newsAPI.searchNews(query, limit),
    {
      enabled: !!query && query.length > 2,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useNewsDetail = (newsId) => {
  return useQuery(
    ['news', newsId],
    () => newsAPI.getNewsDetail(newsId),
    {
      enabled: !!newsId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export const useTrackActivity = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (activityData) => newsAPI.trackActivity(activityData),
    {
      onSuccess: () => {
        // Invalidate user profile queries to refresh recommendations
        queryClient.invalidateQueries(['user', 'profile']);
      },
    }
  );
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (preferences) => newsAPI.updatePreferences(preferences),
    {
      onSuccess: () => {
        // Invalidate news queries to refresh with new preferences
        queryClient.invalidateQueries(['news']);
        queryClient.invalidateQueries(['user', 'profile']);
      },
    }
  );
};
