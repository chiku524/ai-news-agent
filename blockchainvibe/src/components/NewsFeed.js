import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

import NewsCard from './NewsCard';
import LoadingSpinner from './LoadingSpinner';
import { useNews } from '../hooks/useNews';
import { useUser } from '../hooks/useUser';

const FeedContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  position: relative;
  z-index: 2;
`;

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const FeedTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  background: ${props => props.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const FeedSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
  font-size: ${props => props.theme.fontSize.lg};
`;

const FeedControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &.active {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.textInverse};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  transition: transform ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeaturedNews = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 2rem;
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const EmptyStateDescription = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: 2rem;
`;

const NewsFeed = ({ category, timeframe, searchQuery }) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [allNews, setAllNews] = useState([]);
  
  const { data: newsData, isLoading, error, refetch } = useNews({
    category,
    timeframe,
    searchQuery,
    sortBy,
    page
  });

  const { trackActivity } = useUser();

  useEffect(() => {
    if (newsData?.news) {
      if (page === 1) {
        setAllNews(newsData.news);
      } else {
        setAllNews(prev => [...prev, ...newsData.news]);
      }
    }
  }, [newsData, page]);

  useEffect(() => {
    setPage(1);
    setAllNews([]);
  }, [category, timeframe, searchQuery, sortBy]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    setAllNews([]);
    refetch();
    toast.success('News feed refreshed!');
  };

  const handleNewsInteraction = async (newsId, action) => {
    try {
      await trackActivity({
        newsId,
        action,
        timestamp: new Date().toISOString()
      });
      
      toast.success(`News ${action}ed successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action} news`);
    }
  };

  if (isLoading && page === 1) {
    return (
      <FeedContainer>
        <LoadingSpinner />
      </FeedContainer>
    );
  }

  if (error) {
    return (
      <FeedContainer>
        <EmptyState>
          <EmptyStateIcon>⚠️</EmptyStateIcon>
          <EmptyStateTitle>Error Loading News</EmptyStateTitle>
          <EmptyStateDescription>
            There was an error loading the news feed. Please try again.
          </EmptyStateDescription>
          <ControlButton onClick={handleRefresh}>
            <RefreshCw size={18} />
            Try Again
          </ControlButton>
        </EmptyState>
      </FeedContainer>
    );
  }

  if (!allNews || allNews.length === 0) {
    return (
      <FeedContainer>
        <EmptyState>
          <EmptyStateIcon>📰</EmptyStateIcon>
          <EmptyStateTitle>No News Found</EmptyStateTitle>
          <EmptyStateDescription>
            {searchQuery 
              ? `No news found for "${searchQuery}". Try a different search term.`
              : 'No news available for the selected filters. Try adjusting your preferences.'
            }
          </EmptyStateDescription>
          <ControlButton onClick={handleRefresh}>
            <RefreshCw size={18} />
            Refresh
          </ControlButton>
        </EmptyState>
      </FeedContainer>
    );
  }

  const featuredNews = allNews[0];
  const regularNews = allNews.slice(1);

  return (
    <FeedContainer>
      <FeedHeader>
        <div>
          <FeedTitle>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Blockchain News Feed'}
          </FeedTitle>
          <FeedSubtitle>
            {newsData?.total_count || allNews.length} articles • 
            {newsData?.user_relevance_score ? 
              `${Math.round(newsData.user_relevance_score * 100)}% relevance` : 
              'Personalized for you'
            }
          </FeedSubtitle>
        </div>
        
        <FeedControls>
          <ControlButton
            className={sortBy === 'relevance' ? 'active' : ''}
            onClick={() => setSortBy('relevance')}
          >
            <TrendingUp size={18} />
            Relevance
          </ControlButton>
          
          <ControlButton
            className={sortBy === 'time' ? 'active' : ''}
            onClick={() => setSortBy('time')}
          >
            <Clock size={18} />
            Time
          </ControlButton>
          
          <ControlButton onClick={handleRefresh}>
            <RefreshCw size={18} />
            Refresh
          </ControlButton>
        </FeedControls>
      </FeedHeader>

      {newsData && (
        <StatsContainer>
          <StatCard>
            <StatValue>{newsData.total_count || 0}</StatValue>
            <StatLabel>Total Articles</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{Math.round((newsData.user_relevance_score || 0) * 100)}%</StatValue>
            <StatLabel>Relevance Score</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{timeframe}</StatValue>
            <StatLabel>Time Frame</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{category}</StatValue>
            <StatLabel>Category</StatLabel>
          </StatCard>
        </StatsContainer>
      )}

      <NewsGrid>
        {featuredNews && (
          <FeaturedNews>
            <NewsCard
              news={featuredNews}
              featured
              onInteraction={handleNewsInteraction}
            />
          </FeaturedNews>
        )}
        
        <AnimatePresence>
          {regularNews.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NewsCard
                news={news}
                onInteraction={handleNewsInteraction}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </NewsGrid>

      {newsData?.has_more && (
        <LoadMoreButton
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Loading more news...
            </>
          ) : (
            'Load More News'
          )}
        </LoadMoreButton>
      )}
    </FeedContainer>
  );
};

export default NewsFeed;
