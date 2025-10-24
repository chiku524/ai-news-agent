import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, 
  RefreshCw, 
  Search,
  ChevronRight,
  Activity,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

import NewsCard from '../NewsCard';
import LoadingSpinner from '../LoadingSpinner';
import ProfileCompletionModal from '../Auth/ProfileCompletionModal';
import { newsAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  width: 1.25rem;
  height: 1.25rem;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.gradient || props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textInverse};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const NewsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.textInverse};
  }
`;

const NewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const DashboardContent = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState(null);

  // Check if profile completion is needed
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const profileCompleted = localStorage.getItem('profileCompleted');
    
    setUser(userData);
    
    if (userData && !profileCompleted) {
      setShowProfileModal(true);
    }
  }, []);

  const { data: newsData, isLoading: newsLoading, refetch: refetchNews } = useQuery(
    ['news', 'trending'],
    () => newsAPI.getTrendingNews({ limit: 6 }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const handleProfileComplete = async (profileData) => {
    try {
      console.log('Profile completion started with data:', profileData);
      console.log('Current user data:', user);

      const backendProfileData = {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        profile_picture: profileData.profilePicture, // This is now a URL
        banner_image: profileData.bannerImage, // This is now a URL
        location: profileData.location,
        website: profileData.website,
        twitter: profileData.twitter,
        linkedin: profileData.linkedin
      };

      const userId = user?.user_id || user?.id;
      console.log('User ID found:', userId);
      
      if (!userId) {
        throw new Error('User ID not found. Please try logging in again.');
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'https://blockchainvibe-api.nico-chikuji.workers.dev';
      console.log('Calling API:', `${apiUrl}/api/user/profile`);

      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          userId,
          profileData: backendProfileData
        })
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('API success response:', result);

      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('profileCompleted', 'true');
      localStorage.removeItem('pendingProfileData');
      
      setUser(updatedUser);
      setShowProfileModal(false);
      toast.success('Profile completed successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(`Failed to complete profile: ${error.message}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRefresh = async () => {
    try {
      await refetchNews();
      toast.success('News refreshed!');
    } catch (error) {
      toast.error('Failed to refresh news');
    }
  };

  const trendingTopics = [
    'Bitcoin ETF Approval',
    'Ethereum Layer 2 Scaling',
    'DeFi Yield Farming',
    'NFT Market Recovery',
    'Web3 Gaming Boom',
    'CBDC Development'
  ];

  if (newsLoading) {
    return (
      <DashboardContainer>
        <LoadingSpinner message="Loading dashboard..." />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Welcome back, {user?.name || 'User'}!</Title>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon size={20} />
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </SearchContainer>
          <RefreshButton onClick={handleRefresh} disabled={newsLoading}>
            <RefreshCw size={16} />
            Refresh
          </RefreshButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon gradient={currentTheme.gradients.primary}>
            <TrendingUp size={20} />
          </StatIcon>
          <StatContent>
            <StatValue>{newsData?.articles?.length || 0}</StatValue>
            <StatLabel>Latest Articles</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon gradient={currentTheme.gradients.secondary}>
            <Activity size={20} />
          </StatIcon>
          <StatContent>
            <StatValue>95%</StatValue>
            <StatLabel>Relevance Score</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon gradient={currentTheme.gradients.accent}>
            <Zap size={20} />
          </StatIcon>
          <StatContent>
            <StatValue>24h</StatValue>
            <StatLabel>Update Frequency</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <NewsSection>
          <SectionHeader>
            <SectionTitle>Latest Blockchain News</SectionTitle>
            <ViewAllButton onClick={() => navigate('/news')}>
              View All
              <ChevronRight size={16} />
            </ViewAllButton>
          </SectionHeader>
          
          <NewsGrid>
            {newsData?.articles?.slice(0, 4).map((article, index) => (
              <NewsCard
                key={article.id || index}
                article={article}
                onBookmark={() => {}}
                onLike={() => {}}
                onShare={() => {}}
              />
            ))}
          </NewsGrid>
        </NewsSection>

        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Trending Topics</SidebarTitle>
            <TrendingList>
              {trendingTopics.map((topic, index) => (
                <TrendingItem key={index} onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}>
                  <TrendingNumber>{index + 1}</TrendingNumber>
                  <TrendingText>{topic}</TrendingText>
                </TrendingItem>
              ))}
            </TrendingList>
          </SidebarCard>
        </Sidebar>
      </ContentGrid>

      {showProfileModal && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onComplete={handleProfileComplete}
          userData={user}
        />
      )}
    </DashboardContainer>
  );
};

export default DashboardContent;
