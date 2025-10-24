import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  RefreshCw, 
  Bell, 
  Settings,
  LogOut,
  Search,
  Bookmark,
  Heart,
  Share2,
  ChevronRight,
  Plus,
  BarChart3,
  Activity,
  Zap,
  Sun,
  Moon,
  Newspaper
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
  display: flex;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform ${props => props.theme.transitions.normal};
  }
`;

const SidebarHeader = styled.div`
  padding: 0 2rem 2rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  
  &::before {
    content: '🤖';
    font-size: 1.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textInverse};
`;

const UserDetails = styled.div`
  flex: 1;
  
  & h4 {
    font-size: ${props => props.theme.fontSize.sm};
    font-weight: ${props => props.theme.fontWeight.semibold};
    color: ${props => props.theme.colors.text};
    margin: 0 0 0.25rem 0;
  }
  
  & p {
    font-size: ${props => props.theme.fontSize.xs};
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
  }
`;

const SidebarMenu = styled.nav`
  padding: 0 1rem;
`;

const MenuSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  padding: 0 1rem;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border: none;
  background: none;
  color: ${props => props.theme.colors.text};
  text-align: left;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  font-size: ${props => props.theme.fontSize.sm};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.textInverse};
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: auto;
    flex: 1;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
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

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textMuted};
  width: 1.25rem;
  height: 1.25rem;
`;

const ActionButton = styled.button`
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
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  transition: transform ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.success};
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const NewsSectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const FilterTab = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
  }
`;

const NewsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Widget = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

const WidgetTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const TrendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const TrendingNumber = styled.div`
  width: 24px;
  height: 24px;
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
  
  & h4 {
    font-size: ${props => props.theme.fontSize.sm};
    font-weight: ${props => props.theme.fontWeight.medium};
    color: ${props => props.theme.colors.text};
    margin: 0 0 0.25rem 0;
  }
  
  & p {
    font-size: ${props => props.theme.fontSize.xs};
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingProfileData, setPendingProfileData] = useState(null);

  // Load user data and check for profile completion
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isNewUser = localStorage.getItem('isNewUser') === 'true';
    const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
    const pendingData = localStorage.getItem('pendingProfileData');
    const urlParams = new URLSearchParams(window.location.search);
    const showModal = urlParams.get('showProfileModal') === 'true';

    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (pendingData) {
      setPendingProfileData(JSON.parse(pendingData));
    }

    // Show profile modal if needed
    if ((isNewUser && !profileCompleted) || showModal) {
      setShowProfileModal(true);
    }
  }, []);

  const { data: newsData, isLoading, refetch } = useQuery(
    ['news', { category: activeFilter, timeframe: '24h' }],
    () => newsAPI.getTrendingNews({
      category: activeFilter,
      timeframe: '24h',
      limit: 10
    }),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isNewUser');
    localStorage.removeItem('profileCompleted');
    localStorage.removeItem('pendingProfileData');
    
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleProfileComplete = async (profileData) => {
    try {
      console.log('Profile completion started with data:', profileData);
      console.log('Current user data:', user);

      // Convert form data to backend format
      // Images are now stored as URLs from R2, not base64
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

      // Get user ID from stored user data
      const userId = user?.user_id || user?.id;
      
      console.log('User ID found:', userId);
      
      if (!userId) {
        throw new Error('User ID not found. Please try logging in again.');
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'https://blockchainvibe-api.nico-chikuji.workers.dev';
      console.log('Calling API:', `${apiUrl}/api/user/profile`);

      // Call API to update profile
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

      // Update local storage
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

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    // Clean up URL parameters
    const url = new URL(window.location);
    url.searchParams.delete('showProfileModal');
    window.history.replaceState({}, '', url);
  };

  const handleNewsInteraction = async (newsId, action) => {
    try {
      // Track user activity
      await newsAPI.trackActivity({
        newsId,
        action,
        timestamp: new Date().toISOString()
      });
      
      toast.success(`News ${action}ed successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action} news`);
    }
  };

  const filters = [
    { id: 'all', label: 'All News' },
    { id: 'defi', label: 'DeFi' },
    { id: 'nfts', label: 'NFTs' },
    { id: 'web3', label: 'Web3' },
    { id: 'crypto', label: 'Crypto' }
  ];

  const trendingTopics = [
    { id: 1, title: 'Bitcoin ETF Approval', mentions: '2.3K', change: '+15%' },
    { id: 2, title: 'Ethereum 2.0 Update', mentions: '1.8K', change: '+8%' },
    { id: 3, title: 'DeFi Yield Farming', mentions: '1.5K', change: '+12%' },
    { id: 4, title: 'NFT Marketplace', mentions: '1.2K', change: '+5%' },
    { id: 5, title: 'Web3 Development', mentions: '980', change: '+18%' }
  ];

  const stats = [
    {
      title: 'Articles Read',
      value: '127',
      change: '+12%',
      icon: <Activity size={20} />
    },
    {
      title: 'Relevance Score',
      value: '94%',
      change: '+3%',
      icon: <TrendingUp size={20} />
    },
    {
      title: 'Time Saved',
      value: '2.4h',
      change: '+0.5h',
      icon: <Clock size={20} />
    },
    {
      title: 'AI Insights',
      value: '23',
      change: '+7',
      icon: <Zap size={20} />
    }
  ];

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingSpinner message="Loading your personalized dashboard..." />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>BlockchainVibe</Logo>
          <UserInfo>
            <UserAvatar>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </UserAvatar>
            <UserDetails>
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.email || 'user@example.com'}</p>
            </UserDetails>
          </UserInfo>
        </SidebarHeader>

        <SidebarMenu>
          <MenuSection>
            <SectionTitle>Navigation</SectionTitle>
            <MenuItem 
              className="active"
              onClick={() => navigate('/dashboard')}
            >
              <TrendingUp size={18} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => navigate('/news')}>
              <Newspaper size={18} />
              News Feed
            </MenuItem>
            <MenuItem onClick={() => navigate('/saved')}>
              <Bookmark size={18} />
              Saved Articles
            </MenuItem>
            <MenuItem onClick={() => navigate('/liked')}>
              <Heart size={18} />
              Liked Articles
            </MenuItem>
            <MenuItem onClick={() => navigate('/analytics')}>
              <BarChart3 size={18} />
              Analytics
            </MenuItem>
          </MenuSection>

          <MenuSection>
            <SectionTitle>Categories</SectionTitle>
            {filters.map(filter => (
              <MenuItem
                key={filter.id}
                className={activeFilter === filter.id ? 'active' : ''}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </MenuItem>
            ))}
          </MenuSection>

          <MenuSection>
            <SectionTitle>Account</SectionTitle>
            <MenuItem onClick={() => navigate('/profile')}>
              <User size={18} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <Settings size={18} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogOut size={18} />
              Sign Out
            </MenuItem>
          </MenuSection>
        </SidebarMenu>
      </Sidebar>

      <MainContent>
        <TopBar>
          <div>
            <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Settings size={20} />
            </MobileMenuButton>
            <PageTitle>Dashboard</PageTitle>
          </div>
          
          <TopBarActions>
            <SearchContainer>
              <SearchIcon size={20} />
              <SearchInput
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
            
            <ActionButton onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </ActionButton>
            
            <ActionButton onClick={() => refetch()}>
              <RefreshCw size={18} />
              Refresh
            </ActionButton>
            
            <ActionButton>
              <Bell size={18} />
              Notifications
            </ActionButton>
          </TopBarActions>
        </TopBar>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatHeader>
                <StatTitle>{stat.title}</StatTitle>
                <StatIcon>{stat.icon}</StatIcon>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatChange>
                <TrendingUp size={14} />
                {stat.change}
              </StatChange>
            </StatCard>
          ))}
        </StatsGrid>

        <ContentGrid>
          <NewsSection>
            <SectionHeader>
              <NewsSectionTitle>Latest News</NewsSectionTitle>
              <ActionButton>
                <Plus size={18} />
                Add Source
              </ActionButton>
            </SectionHeader>

            <FilterTabs>
              {filters.map(filter => (
                <FilterTab
                  key={filter.id}
                  active={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </FilterTab>
              ))}
            </FilterTabs>

            <NewsGrid>
              {newsData?.news?.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NewsCard
                    news={news}
                    onInteraction={handleNewsInteraction}
                  />
                </motion.div>
              ))}
            </NewsGrid>
          </NewsSection>

          <SidebarContent>
            <Widget>
              <WidgetTitle>Trending Topics</WidgetTitle>
              <TrendingList>
                {trendingTopics.map((topic, index) => (
                  <TrendingItem key={topic.id}>
                    <TrendingNumber>{index + 1}</TrendingNumber>
                    <TrendingText>
                      <h4>{topic.title}</h4>
                      <p>{topic.mentions} mentions • {topic.change}</p>
                    </TrendingText>
                    <ChevronRight size={16} />
                  </TrendingItem>
                ))}
              </TrendingList>
            </Widget>

            <Widget>
              <WidgetTitle>Quick Actions</WidgetTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ActionButton>
                  <Bookmark size={18} />
                  View Bookmarks
                </ActionButton>
                <ActionButton>
                  <Share2 size={18} />
                  Share Dashboard
                </ActionButton>
                <ActionButton>
                  <Settings size={18} />
                  Preferences
                </ActionButton>
              </div>
            </Widget>
          </SidebarContent>
        </ContentGrid>
      </MainContent>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={handleProfileModalClose}
        userData={pendingProfileData || user}
        onComplete={handleProfileComplete}
      />
    </DashboardContainer>
  );
};

export default Dashboard;
