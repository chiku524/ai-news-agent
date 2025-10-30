import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle,
  RefreshCw,
  Filter,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

import NewsCard from './NewsCard';
import LoadingSpinner from './LoadingSpinner';
import { useQuery } from 'react-query';
import { newsAPI } from '../services/api';

const TrendingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  position: relative;
  z-index: 2;
`;

const TrendingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 2rem;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TrendingTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  background: ${props => props.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TrendingSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
  font-size: ${props => props.theme.fontSize.lg};
`;

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props => props.gradient || props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  color: ${props => props.theme.colors.textInverse};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const NewsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  margin-top: 2rem;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

const SidebarTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const TrendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TrendingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primary}10;
    transform: translateX(4px);
  }
`;

const TrendingNumber = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.bold};
`;

const TrendingText = styled.div`
  flex: 1;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text};
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
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const EmptyStateDescription = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: 2rem;
`;

const Trending = () => {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('engagement');
  const [page, setPage] = useState(1);
  const [allNews, setAllNews] = useState([]);

  const timeFilters = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const categoryFilters = [
    { value: 'all', label: 'All Categories' },
    { value: 'defi', label: 'DeFi' },
    { value: 'nft', label: 'NFTs' },
    { value: 'layer2', label: 'Layer 2' },
    { value: 'web3', label: 'Web3' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'regulation', label: 'Regulation' }
  ];

  const sortOptions = [
    { value: 'engagement', label: 'Most Engaged' },
    { value: 'views', label: 'Most Views' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'comments', label: 'Most Discussed' },
    { value: 'recent', label: 'Most Recent' }
  ];

  const { data: trendingData, isLoading, error, refetch } = useQuery(
    ['trending', timeFilter, categoryFilter, sortBy, page],
    () => newsAPI.getTrendingNews({ 
      timeFilter, 
      categoryFilter, 
      sortBy, 
      page,
      limit: 10 
    }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: true, // Always refetch when component mounts
      refetchOnWindowFocus: false, // Don't refetch on window focus
    }
  );

  // Debug logging
  useEffect(() => {
    console.log('Trending data:', trendingData);
    console.log('Trending loading:', isLoading);
    console.log('Trending error:', error);
  }, [trendingData, isLoading, error]);

  const trendingTopics = [
    'Bitcoin ETF Approval',
    'Ethereum Layer 2 Scaling',
    'DeFi Yield Farming',
    'NFT Market Recovery',
    'Web3 Gaming Boom',
    'CBDC Development',
    'Cross-chain Bridges',
    'DAO Governance'
  ];

  useEffect(() => {
    if (trendingData?.articles) {
      if (page === 1) {
        setAllNews(trendingData.articles);
      } else {
        setAllNews(prev => [...prev, ...trendingData.articles]);
      }
    }
  }, [trendingData, page]);

  useEffect(() => {
    setPage(1);
    setAllNews([]);
  }, [timeFilter, categoryFilter, sortBy]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    setAllNews([]);
    refetch();
    toast.success('Trending news refreshed!');
  };

  const mockStats = {
    totalViews: '2.4M',
    totalLikes: '156K',
    totalComments: '23K',
    trendingArticles: allNews.length || 0
  };

  if (isLoading && page === 1) {
    return (
      <TrendingContainer>
        <LoadingSpinner message="Loading trending news..." />
      </TrendingContainer>
    );
  }

  if (error) {
    return (
      <TrendingContainer>
        <EmptyState>
          <EmptyStateIcon>⚠️</EmptyStateIcon>
          <EmptyStateTitle>Error Loading Trending News</EmptyStateTitle>
          <EmptyStateDescription>
            There was an error loading the trending news. Please try again.
          </EmptyStateDescription>
          <FilterButton onClick={handleRefresh}>
            <RefreshCw size={18} />
            Try Again
          </FilterButton>
        </EmptyState>
      </TrendingContainer>
    );
  }

  return (
    <TrendingContainer>
      <TrendingHeader>
        <HeaderContent>
          <TrendingTitle>
            <TrendingUp size={32} />
            Trending Now
          </TrendingTitle>
          <TrendingSubtitle>
            The most popular blockchain articles across the community
          </TrendingSubtitle>
        </HeaderContent>
        
        <FilterControls>
          <FilterButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={16} />
            Refresh
          </FilterButton>
        </FilterControls>
      </TrendingHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Eye size={20} />
          </StatIcon>
          <StatValue>{mockStats.totalViews}</StatValue>
          <StatLabel>Total Views</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <Heart size={20} />
          </StatIcon>
          <StatValue>{mockStats.totalLikes}</StatValue>
          <StatLabel>Total Likes</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <MessageCircle size={20} />
          </StatIcon>
          <StatValue>{mockStats.totalComments}</StatValue>
          <StatLabel>Total Comments</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <TrendingUp size={20} />
          </StatIcon>
          <StatValue>{mockStats.trendingArticles}</StatValue>
          <StatLabel>Trending Articles</StatLabel>
        </StatCard>
      </StatsGrid>

      <FilterControls style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {timeFilters.map(filter => (
            <FilterButton
              key={filter.value}
              active={timeFilter === filter.value}
              onClick={() => setTimeFilter(filter.value)}
            >
              <Clock size={14} />
              {filter.label}
            </FilterButton>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categoryFilters.map(filter => (
            <FilterButton
              key={filter.value}
              active={categoryFilter === filter.value}
              onClick={() => setCategoryFilter(filter.value)}
            >
              <Filter size={14} />
              {filter.label}
            </FilterButton>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {sortOptions.map(option => (
            <FilterButton
              key={option.value}
              active={sortBy === option.value}
              onClick={() => setSortBy(option.value)}
            >
              <BarChart3 size={14} />
              {option.label}
            </FilterButton>
          ))}
        </div>
      </FilterControls>

      <ContentGrid>
        <NewsSection>
          <SectionTitle>
            <TrendingUp size={24} />
            Most Popular Articles
          </SectionTitle>
          
          <NewsGrid>
            <AnimatePresence>
              {allNews.map((article, index) => (
                <motion.div
                  key={article.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <NewsCard
                    article={article}
                    onBookmark={() => {}}
                    onLike={() => {}}
                    onShare={() => {}}
                    showEngagement={true}
                    rank={index + 1}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </NewsGrid>

          {allNews.length > 0 && (
            <LoadMoreButton onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Load More Trending Articles
                </>
              )}
            </LoadMoreButton>
          )}
        </NewsSection>

        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Trending Topics</SidebarTitle>
            <TrendingList>
              {trendingTopics.map((topic, index) => (
                <TrendingItem key={index}>
                  <TrendingNumber>{index + 1}</TrendingNumber>
                  <TrendingText>{topic}</TrendingText>
                </TrendingItem>
              ))}
            </TrendingList>
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>Top Sources</SidebarTitle>
            <TrendingList>
              {['CoinDesk', 'Decrypt', 'The Block', 'CoinTelegraph', 'CryptoSlate'].map((source, index) => (
                <TrendingItem key={index}>
                  <TrendingNumber>{index + 1}</TrendingNumber>
                  <TrendingText>{source}</TrendingText>
                </TrendingItem>
              ))}
            </TrendingList>
          </SidebarCard>
        </Sidebar>
      </ContentGrid>
    </TrendingContainer>
  );
};

export default Trending;
