import React from 'react';
import styled from 'styled-components';
import { 
  User, 
  Heart, 
  Bookmark,
  Eye,
  TrendingUp,
  Calendar,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Mail,
  BarChart3,
  Activity
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import LoadingSpinner from './LoadingSpinner';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
`;

const BannerImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.imageUrl ? `url(${props.imageUrl})` : props.theme.gradients.primary};
  background-size: cover;
  background-position: center;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.imageUrl ? 'none' : props.theme.gradients.primary};
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textInverse};
  margin: -60px auto 1rem auto;
  border: 4px solid ${props => props.theme.colors.surface};
  position: relative;
  z-index: 1;
`;

const UserName = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const UserBio = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.base};
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const UserInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.sm};
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 2rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivitySection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const UserProfile = () => {
  const { userProfile, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <ProfileContainer>
        <LoadingSpinner message="Loading profile..." />
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Error loading profile</h2>
          <p>Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </ProfileContainer>
    );
  }

  const profileData = userProfile || {
    name: 'User',
    email: 'user@example.com',
    bio: 'Blockchain enthusiast and crypto investor',
    profile_picture: null,
    banner_image: null,
    location: 'San Francisco, CA',
    website: 'https://example.com',
    twitter: '@username',
    linkedin: 'linkedin.com/in/username'
  };

  const stats = {
    articlesRead: 127,
    articlesLiked: 42,
    articlesSaved: 18,
    readingStreak: 7,
    totalTimeSpent: '24h 30m',
    favoriteTopic: 'DeFi',
    joinDate: 'January 2024'
  };

  const recentActivity = [
    { icon: <Eye size={16} />, title: 'Read "Ethereum 2.0 Staking Guide"', time: '2 hours ago' },
    { icon: <Heart size={16} />, title: 'Liked "DeFi Yield Farming Strategies"', time: '4 hours ago' },
    { icon: <Bookmark size={16} />, title: 'Saved "NFT Market Analysis"', time: '1 day ago' },
    { icon: <TrendingUp size={16} />, title: 'Completed 7-day reading streak', time: '2 days ago' }
  ];

  return (
    <ProfileContainer>
      <ProfileHeader>
        <BannerImage imageUrl={profileData.banner_image} />
        <Avatar imageUrl={profileData.profile_picture}>
          {!profileData.profile_picture && profileData.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <UserName>{profileData.name}</UserName>
        <UserEmail>
          <Mail size={16} />
          {profileData.email}
        </UserEmail>
        {profileData.bio && <UserBio>{profileData.bio}</UserBio>}
        
        <UserInfo>
          {profileData.location && (
            <InfoItem>
              <MapPin size={16} />
              {profileData.location}
            </InfoItem>
          )}
          {profileData.website && (
            <InfoItem>
              <Globe size={16} />
              <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </InfoItem>
          )}
          {profileData.twitter && (
            <InfoItem>
              <Twitter size={16} />
              <a href={`https://twitter.com/${profileData.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                {profileData.twitter}
              </a>
            </InfoItem>
          )}
          {profileData.linkedin && (
            <InfoItem>
              <Linkedin size={16} />
              <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </InfoItem>
          )}
        </UserInfo>
      </ProfileHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Eye size={20} />
          </StatIcon>
          <StatValue>{stats.articlesRead}</StatValue>
          <StatLabel>Articles Read</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <Heart size={20} />
          </StatIcon>
          <StatValue>{stats.articlesLiked}</StatValue>
          <StatLabel>Articles Liked</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <Bookmark size={20} />
          </StatIcon>
          <StatValue>{stats.articlesSaved}</StatValue>
          <StatLabel>Articles Saved</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <TrendingUp size={20} />
          </StatIcon>
          <StatValue>{stats.readingStreak}</StatValue>
          <StatLabel>Day Streak</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <Calendar size={20} />
          </StatIcon>
          <StatValue>{stats.totalTimeSpent}</StatValue>
          <StatLabel>Time Spent</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <BarChart3 size={20} />
          </StatIcon>
          <StatValue>{stats.favoriteTopic}</StatValue>
          <StatLabel>Favorite Topic</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle>
        <Activity size={24} />
        Recent Activity
      </SectionTitle>

      <ActivitySection>
        {recentActivity.map((activity, index) => (
          <ActivityItem key={index}>
            <ActivityIcon>
              {activity.icon}
            </ActivityIcon>
            <ActivityContent>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivitySection>
    </ProfileContainer>
  );
};

export default UserProfile;