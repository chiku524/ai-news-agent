import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Search, 
  Calendar,
  Tag,
  ThumbsUp
} from 'lucide-react';
import toast from 'react-hot-toast';

import NewsCard from './NewsCard';
import LoadingSpinner from './LoadingSpinner';

const LikedContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LikedHeader = styled.div`
  margin-bottom: 3rem;
`;

const LikedTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  background: ${props => props.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LikedSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: 2rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textMuted};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
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

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
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

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`;

const LikedArticles = () => {
  const [likedArticles, setLikedArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching liked articles
    const mockLikedArticles = [
      {
        id: '1',
        title: 'Revolutionary DeFi Protocol Launches Cross-Chain Bridge',
        summary: 'New protocol enables seamless asset transfers across multiple blockchain networks, potentially revolutionizing DeFi interoperability.',
        source: 'DeFi News',
        publishedAt: '2024-01-15T14:20:00Z',
        category: 'DeFi',
        tags: ['defi', 'cross-chain', 'bridge', 'interoperability'],
        url: 'https://example.com/defi-bridge',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
        likedAt: '2024-01-15T15:30:00Z',
        relevanceScore: 0.96
      },
      {
        id: '2',
        title: 'Bitcoin Mining Becomes More Sustainable with New Green Energy Initiative',
        summary: 'Major mining operations transition to renewable energy sources, significantly reducing Bitcoin\'s carbon footprint.',
        source: 'Crypto Sustainability',
        publishedAt: '2024-01-14T11:15:00Z',
        category: 'Bitcoin',
        tags: ['bitcoin', 'mining', 'sustainability', 'green-energy'],
        url: 'https://example.com/bitcoin-green',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        likedAt: '2024-01-14T12:45:00Z',
        relevanceScore: 0.89
      },
      {
        id: '3',
        title: 'Ethereum Layer 2 Solutions See Massive Adoption Growth',
        summary: 'Layer 2 scaling solutions are experiencing unprecedented adoption, with transaction volumes reaching new highs.',
        source: 'Ethereum Weekly',
        publishedAt: '2024-01-13T16:30:00Z',
        category: 'Ethereum',
        tags: ['ethereum', 'layer2', 'scaling', 'adoption'],
        url: 'https://example.com/eth-layer2',
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        likedAt: '2024-01-13T18:00:00Z',
        relevanceScore: 0.93
      },
      {
        id: '4',
        title: 'NFT Marketplace Introduces AI-Powered Curation System',
        summary: 'Leading NFT platform implements artificial intelligence to help users discover and curate digital art collections.',
        source: 'NFT Insider',
        publishedAt: '2024-01-12T09:45:00Z',
        category: 'NFTs',
        tags: ['nft', 'ai', 'curation', 'marketplace'],
        url: 'https://example.com/nft-ai',
        imageUrl: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400',
        likedAt: '2024-01-12T10:30:00Z',
        relevanceScore: 0.87
      }
    ];

    setTimeout(() => {
      setLikedArticles(mockLikedArticles);
      setFilteredArticles(mockLikedArticles);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = likedArticles;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.likedAt) - new Date(a.likedAt);
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
  }, [likedArticles, searchQuery, sortBy]);

  const handleUnlikeArticle = (articleId) => {
    setLikedArticles(prev => prev.filter(article => article.id !== articleId));
    toast.success('Article removed from liked list');
  };

  const handleShareArticle = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.url
      });
    } else {
      navigator.clipboard.writeText(article.url);
      toast.success('Article link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <LikedContainer>
        <LoadingSpinner message="Loading liked articles..." />
      </LikedContainer>
    );
  }

  return (
    <LikedContainer>
      <LikedHeader>
        <LikedTitle>
          <Heart size={32} />
          Liked Articles
        </LikedTitle>
        <LikedSubtitle>
          Articles you've shown interest in and liked
        </LikedSubtitle>
      </LikedHeader>

      <StatsContainer>
        <StatCard>
          <StatValue>{likedArticles.length}</StatValue>
          <StatLabel>Total Liked</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{new Set(likedArticles.map(a => a.category)).size}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{Math.round(likedArticles.reduce((acc, a) => acc + a.relevanceScore, 0) / likedArticles.length * 100)}%</StatValue>
          <StatLabel>Avg Relevance</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{likedArticles.filter(a => new Date(a.likedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</StatValue>
          <StatLabel>This Week</StatLabel>
        </StatCard>
      </StatsContainer>

      <ControlsContainer>
        <SearchContainer>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search liked articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <FilterContainer>
          <FilterButton
            className={sortBy === 'date' ? 'active' : ''}
            onClick={() => setSortBy('date')}
          >
            <Calendar size={16} />
            Date
          </FilterButton>
          <FilterButton
            className={sortBy === 'relevance' ? 'active' : ''}
            onClick={() => setSortBy('relevance')}
          >
            <ThumbsUp size={16} />
            Relevance
          </FilterButton>
          <FilterButton
            className={sortBy === 'title' ? 'active' : ''}
            onClick={() => setSortBy('title')}
          >
            <Tag size={16} />
            Title
          </FilterButton>
        </FilterContainer>
      </ControlsContainer>

      {filteredArticles.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>❤️</EmptyStateIcon>
          <EmptyStateTitle>
            {searchQuery ? 'No articles found' : 'No liked articles yet'}
          </EmptyStateTitle>
          <EmptyStateDescription>
            {searchQuery 
              ? `No articles match "${searchQuery}". Try a different search term.`
              : 'Start liking articles you find interesting to see them here.'
            }
          </EmptyStateDescription>
          {!searchQuery && (
            <ActionButton onClick={() => window.location.href = '/news'}>
              Browse News
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        <ArticlesGrid>
          <AnimatePresence>
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NewsCard
                  news={article}
                  onInteraction={(id, action) => {
                    if (action === 'unlike') {
                      handleUnlikeArticle(id);
                    } else if (action === 'share') {
                      handleShareArticle(article);
                    }
                  }}
                  showLikeButton={false}
                  showShareButton={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </ArticlesGrid>
      )}
    </LikedContainer>
  );
};

export default LikedArticles;
