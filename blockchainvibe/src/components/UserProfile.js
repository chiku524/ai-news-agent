import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Settings, 
  Heart, 
  Clock,
  Save,
  Camera
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import LoadingSpinner from './LoadingSpinner';
import FileUpload from './FileUpload';

const ProfileContainer = styled.div`
  max-width: 800px;
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
  margin: 0 auto 1rem auto;
  border: 3px solid ${props => props.theme.colors.border};
`;

const UserName = styled.h1`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: 1.5rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
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

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  border-bottom: 2px solid transparent;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  
  &.active {
    color: ${props => props.theme.colors.primary};
    border-bottom-color: ${props => props.theme.colors.primary};
  }
`;

const TabContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
`;

const PreferencesSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const PreferenceGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const PreferenceLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const PreferenceDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.sm};
  margin-bottom: 1rem;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    border-color: ${props => props.theme.colors.primary};
  }
  
  input[type="checkbox"] {
    margin: 0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UserProfile = () => {
  const { userProfile, isLoading, updatePreferences, isUpdatingPreferences } = useUser();
  const [activeTab, setActiveTab] = useState('preferences');
  const [preferences, setPreferences] = useState({
    categories: [],
    sources: [],
    timeframe: '24h',
    notifications: true,
    emailDigest: false
  });

  const categories = [
    'DeFi', 'NFTs', 'Layer 2', 'Web3', 'Cryptocurrency',
    'Blockchain Technology', 'Regulation', 'Enterprise', 'Gaming', 'Metaverse'
  ];

  const sources = [
    'CoinDesk', 'Cointelegraph', 'Decrypt', 'The Block',
    'Coinbase', 'Binance', 'CoinMarketCap'
  ];

  React.useEffect(() => {
    if (userProfile?.preferences) {
      setPreferences(userProfile.preferences);
    }
  }, [userProfile]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategoryToggle = (category) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSourceToggle = (source) => {
    setPreferences(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences(preferences);
    } catch (error) {
    }
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <LoadingSpinner message="Loading profile..." />
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar imageUrl={userProfile?.profile_picture}>
          {!userProfile?.profile_picture && 'U'}
        </Avatar>
        <UserName>{userProfile?.user_id || 'Demo User'}</UserName>
        <UserEmail>demo@ainewsagent.com</UserEmail>
      </ProfileHeader>

      <StatsContainer>
        <StatCard>
          <StatValue>{userProfile?.activity_history?.length || 0}</StatValue>
          <StatLabel>Articles Read</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{userProfile?.interests?.length || 0}</StatValue>
          <StatLabel>Interests</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>95%</StatValue>
          <StatLabel>Relevance Score</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>24h</StatValue>
          <StatLabel>Preferred Timeframe</StatLabel>
        </StatCard>
      </StatsContainer>

      <TabsContainer>
        <Tab 
          className={activeTab === 'preferences' ? 'active' : ''}
          onClick={() => setActiveTab('preferences')}
        >
          <Settings size={18} style={{ marginRight: '0.5rem' }} />
          Preferences
        </Tab>
        <Tab 
          className={activeTab === 'customize' ? 'active' : ''}
          onClick={() => setActiveTab('customize')}
        >
          <Camera size={18} style={{ marginRight: '0.5rem' }} />
          Customize
        </Tab>
        <Tab 
          className={activeTab === 'activity' ? 'active' : ''}
          onClick={() => setActiveTab('activity')}
        >
          <Clock size={18} style={{ marginRight: '0.5rem' }} />
          Activity
        </Tab>
        <Tab 
          className={activeTab === 'interests' ? 'active' : ''}
          onClick={() => setActiveTab('interests')}
        >
          <Heart size={18} style={{ marginRight: '0.5rem' }} />
          Interests
        </Tab>
      </TabsContainer>

      <TabContent>
        {activeTab === 'preferences' && (
          <PreferencesSection>
            <SectionTitle>News Preferences</SectionTitle>
            
            <PreferenceGroup>
              <PreferenceLabel>Categories</PreferenceLabel>
              <PreferenceDescription>
                Select the categories you're most interested in
              </PreferenceDescription>
              <CheckboxGroup>
                {categories.map(category => (
                  <CheckboxItem key={category}>
                    <input
                      type="checkbox"
                      checked={preferences.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    {category}
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </PreferenceGroup>

            <PreferenceGroup>
              <PreferenceLabel>News Sources</PreferenceLabel>
              <PreferenceDescription>
                Choose your preferred news sources
              </PreferenceDescription>
              <CheckboxGroup>
                {sources.map(source => (
                  <CheckboxItem key={source}>
                    <input
                      type="checkbox"
                      checked={preferences.sources.includes(source)}
                      onChange={() => handleSourceToggle(source)}
                    />
                    {source}
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </PreferenceGroup>

            <PreferenceGroup>
              <PreferenceLabel>Timeframe</PreferenceLabel>
              <PreferenceDescription>
                How recent should the news be?
              </PreferenceDescription>
              <Select
                value={preferences.timeframe}
                onChange={(e) => handlePreferenceChange('timeframe', e.target.value)}
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </Select>
            </PreferenceGroup>

            <PreferenceGroup>
              <PreferenceLabel>Notifications</PreferenceLabel>
              <PreferenceDescription>
                How would you like to be notified about breaking news?
              </PreferenceDescription>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                />
                Push notifications for breaking news
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={preferences.emailDigest}
                  onChange={(e) => handlePreferenceChange('emailDigest', e.target.checked)}
                />
                Daily email digest
              </CheckboxItem>
            </PreferenceGroup>

            <SaveButton
              onClick={handleSavePreferences}
              disabled={isUpdatingPreferences}
            >
              <Save size={18} />
              {isUpdatingPreferences ? 'Saving...' : 'Save Preferences'}
            </SaveButton>
          </PreferencesSection>
        )}

        {activeTab === 'customize' && (
          <PreferencesSection>
            <SectionTitle>Profile Customization</SectionTitle>
            
            <PreferenceGroup>
              <PreferenceLabel>Profile Picture</PreferenceLabel>
              <PreferenceDescription>
                Upload a profile picture to personalize your account
              </PreferenceDescription>
              <FileUpload 
                type="profile" 
                onUploadSuccess={(url) => {
                  // Update the user profile with the new image URL
                  if (userProfile) {
                    userProfile.profile_picture = url;
                  }
                }}
              />
            </PreferenceGroup>

            <PreferenceGroup>
              <PreferenceLabel>Banner Image</PreferenceLabel>
              <PreferenceDescription>
                Upload a banner image for your profile header
              </PreferenceDescription>
              <FileUpload 
                type="banner" 
                onUploadSuccess={(url) => {
                  // Update the user profile with the new banner URL
                  if (userProfile) {
                    userProfile.banner_image = url;
                  }
                }}
              />
            </PreferenceGroup>
          </PreferencesSection>
        )}

        {activeTab === 'activity' && (
          <div>
            <SectionTitle>Recent Activity</SectionTitle>
            <p>Your reading history and interactions will appear here.</p>
          </div>
        )}

        {activeTab === 'interests' && (
          <div>
            <SectionTitle>Your Interests</SectionTitle>
            <p>Based on your reading patterns, we've identified these interests:</p>
            {/* Interest tags would be displayed here */}
          </div>
        )}
      </TabContent>
    </ProfileContainer>
  );
};

export default UserProfile;
