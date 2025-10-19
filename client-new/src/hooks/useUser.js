import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userAPI } from '../services/api';

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading, error } = useQuery(
    ['user', 'profile'],
    () => userAPI.getProfile(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const trackActivityMutation = useMutation(
    (activityData) => userAPI.trackActivity(activityData),
    {
      onSuccess: () => {
        // Invalidate user profile to refresh recommendations
        queryClient.invalidateQueries(['user', 'profile']);
      },
    }
  );

  const updatePreferencesMutation = useMutation(
    (preferences) => userAPI.updatePreferences(preferences),
    {
      onSuccess: () => {
        // Invalidate news queries to refresh with new preferences
        queryClient.invalidateQueries(['news']);
        queryClient.invalidateQueries(['user', 'profile']);
      },
    }
  );

  const trackActivity = async (activityData) => {
    try {
      await trackActivityMutation.mutateAsync(activityData);
    } catch (error) {
      console.error('Failed to track activity:', error);
      throw error;
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      await updatePreferencesMutation.mutateAsync(preferences);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  return {
    userProfile,
    isLoading,
    error,
    trackActivity,
    updatePreferences,
    isTrackingActivity: trackActivityMutation.isLoading,
    isUpdatingPreferences: updatePreferencesMutation.isLoading,
  };
};
