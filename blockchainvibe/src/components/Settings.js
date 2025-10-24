import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Zap,
  Save,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

const SettingsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const SettingsHeader = styled.div`
  margin-bottom: 3rem;
`;

const SettingsTitle = styled.h1`
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

const SettingsSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: 2rem;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsNav = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  height: fit-content;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary + '20' : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  text-align: left;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const SettingsContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.sm};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
`;

const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ToggleTitle = styled.div`
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text};
`;

const ToggleDescription = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const Toggle = styled.button`
  position: relative;
  width: 48px;
  height: 24px;
  border: none;
  border-radius: 12px;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all ${props => props.theme.transitions.fast};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => props.primary ? `
    background: ${props.theme.colors.primary};
    color: ${props.theme.colors.textInverse};
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  ` : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.surfaceHover};
    }
  `}
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const DangerZone = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const DangerTitle = styled.h3`
  color: #dc2626;
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  margin-bottom: 1rem;
`;

const DangerDescription = styled.p`
  color: #991b1b;
  font-size: ${props => props.theme.fontSize.sm};
  margin-bottom: 1.5rem;
`;

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      bio: '',
      location: '',
      website: '',
      twitter: '',
      linkedin: ''
    },
    notifications: {
      emailNews: true,
      pushNotifications: true,
      weeklyDigest: true,
      breakingNews: true,
      priceAlerts: false,
      newFeatures: true
    },
    privacy: {
      profileVisibility: 'public',
      showReadingHistory: true,
      allowDataCollection: true,
      shareAnalytics: false
    },
    appearance: {
      theme: theme,
      fontSize: 'medium',
      compactMode: false
    },
    ai: {
      enablePersonalization: true,
      enableRelevanceScoring: true,
      enableRecommendations: true,
      shareDataForTraining: false
    }
  });

  useEffect(() => {
    // Load user settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    handleSettingChange('appearance', 'theme', newTheme);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      toast.success('Account deletion requested. You will receive an email confirmation.');
    }
  };

  const renderProfileSettings = () => (
    <>
      <SectionTitle>
        <User size={20} />
        Profile Information
      </SectionTitle>
      
      <FormGroup>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={settings.profile.name}
          onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
          placeholder="Enter your full name"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={settings.profile.email}
          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
          placeholder="Enter your email address"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="bio">Bio</Label>
        <TextArea
          id="bio"
          value={settings.profile.bio}
          onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
          placeholder="Tell us about yourself..."
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          value={settings.profile.location}
          onChange={(e) => handleSettingChange('profile', 'location', e.target.value)}
          placeholder="City, Country"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={settings.profile.website}
          onChange={(e) => handleSettingChange('profile', 'website', e.target.value)}
          placeholder="https://yourwebsite.com"
        />
      </FormGroup>
    </>
  );

  const renderNotificationSettings = () => (
    <>
      <SectionTitle>
        <Bell size={20} />
        Notifications
      </SectionTitle>
      
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Email News Updates</ToggleTitle>
          <ToggleDescription>Receive daily news summaries via email</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.notifications.emailNews}
          onClick={() => handleSettingChange('notifications', 'emailNews', !settings.notifications.emailNews)}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Push Notifications</ToggleTitle>
          <ToggleDescription>Get notified about breaking news and updates</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.notifications.pushNotifications}
          onClick={() => handleSettingChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Weekly Digest</ToggleTitle>
          <ToggleDescription>Receive a weekly summary of top stories</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.notifications.weeklyDigest}
          onClick={() => handleSettingChange('notifications', 'weeklyDigest', !settings.notifications.weeklyDigest)}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Breaking News Alerts</ToggleTitle>
          <ToggleDescription>Immediate notifications for major blockchain events</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.notifications.breakingNews}
          onClick={() => handleSettingChange('notifications', 'breakingNews', !settings.notifications.breakingNews)}
        />
      </ToggleContainer>
    </>
  );

  const renderAISettings = () => (
    <>
      <SectionTitle>
        <Zap size={20} />
        AI & Personalization
      </SectionTitle>
      
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Enable Personalization</ToggleTitle>
          <ToggleDescription>Use AI to personalize your news feed based on your interests</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.ai.enablePersonalization}
          onClick={() => handleSettingChange('ai', 'enablePersonalization', !settings.ai.enablePersonalization)}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Relevance Scoring</ToggleTitle>
          <ToggleDescription>Use MeTTa knowledge graph to score article relevance</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.ai.enableRelevanceScoring}
          onClick={() => handleSettingChange('ai', 'enableRelevanceScoring', !settings.ai.enableRelevanceScoring)}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Smart Recommendations</ToggleTitle>
          <ToggleDescription>Get AI-powered article recommendations using Fetch.ai uAgents</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.ai.enableRecommendations}
          onClick={() => handleSettingChange('ai', 'enableRecommendations', !settings.ai.enableRecommendations)}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Share Data for Training</ToggleTitle>
          <ToggleDescription>Help improve AI models by sharing anonymized usage data</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.ai.shareDataForTraining}
          onClick={() => handleSettingChange('ai', 'shareDataForTraining', !settings.ai.shareDataForTraining)}
        />
      </ToggleContainer>
    </>
  );

  const renderAppearanceSettings = () => (
    <>
      <SectionTitle>
        <Palette size={20} />
        Appearance
      </SectionTitle>
      
      <FormGroup>
        <Label htmlFor="theme">Theme</Label>
        <Select
          id="theme"
          value={settings.appearance.theme}
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="fontSize">Font Size</Label>
        <Select
          id="fontSize"
          value={settings.appearance.fontSize}
          onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </Select>
      </FormGroup>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Compact Mode</ToggleTitle>
          <ToggleDescription>Use a more compact layout for better space utilization</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.appearance.compactMode}
          onClick={() => handleSettingChange('appearance', 'compactMode', !settings.appearance.compactMode)}
        />
      </ToggleContainer>
    </>
  );

  const renderPrivacySettings = () => (
    <>
      <SectionTitle>
        <Shield size={20} />
        Privacy & Security
      </SectionTitle>
      
      <FormGroup>
        <Label htmlFor="profileVisibility">Profile Visibility</Label>
        <Select
          id="profileVisibility"
          value={settings.privacy.profileVisibility}
          onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="friends">Friends Only</option>
        </Select>
      </FormGroup>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Show Reading History</ToggleTitle>
          <ToggleDescription>Allow others to see your reading activity</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.privacy.showReadingHistory}
          onClick={() => handleSettingChange('privacy', 'showReadingHistory', !settings.privacy.showReadingHistory)}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Allow Data Collection</ToggleTitle>
          <ToggleDescription>Help improve the service by sharing usage analytics</ToggleDescription>
        </ToggleLabel>
        <Toggle
          active={settings.privacy.allowDataCollection}
          onClick={() => handleSettingChange('privacy', 'allowDataCollection', !settings.privacy.allowDataCollection)}
        />
      </ToggleContainer>
    </>
  );

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI & Personalization', icon: Zap },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'ai':
        return renderAISettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'privacy':
        return renderPrivacySettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>
          <SettingsIcon size={32} />
          Settings
        </SettingsTitle>
        <SettingsSubtitle>
          Customize your BlockchainVibe experience
        </SettingsSubtitle>
      </SettingsHeader>

      <SettingsGrid>
        <SettingsNav>
          {sections.map((section) => (
            <NavItem
              key={section.id}
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon size={18} />
              {section.label}
            </NavItem>
          ))}
        </SettingsNav>

        <SettingsContent>
          {renderContent()}

          <ButtonGroup>
            <Button primary onClick={handleSaveSettings}>
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => window.location.reload()}>
              Cancel
            </Button>
          </ButtonGroup>

          {activeSection === 'privacy' && (
            <DangerZone>
              <DangerTitle>Danger Zone</DangerTitle>
              <DangerDescription>
                Once you delete your account, there is no going back. Please be certain.
              </DangerDescription>
              <Button className="danger" onClick={handleDeleteAccount}>
                <Trash2 size={18} />
                Delete Account
              </Button>
            </DangerZone>
          )}
        </SettingsContent>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;
