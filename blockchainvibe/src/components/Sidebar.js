import React from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, 
  Newspaper, 
  Bookmark, 
  Heart, 
  BarChart3, 
  User, 
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.aside`
  width: 280px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    transform: translateX(-100%);
    transition: transform ${props => props.theme.transitions.fast};
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
  cursor: pointer;
  
  &::before {
    content: '🤖';
    font-size: 1.5rem;
  }
`;

const SidebarContent = styled.div`
  padding: 0 1rem;
`;

const MenuSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  padding: 0 1rem;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background: ${props => props.theme.colors.primary}10;
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.fontWeight.medium};
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('profileCompleted');
    navigate('/');
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo onClick={() => navigate('/dashboard')}>
          BlockchainVibe
        </Logo>
      </SidebarHeader>
      
      <SidebarContent>
        <MenuSection>
          <SectionTitle>Main</SectionTitle>
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
        </MenuSection>

        <MenuSection>
          <SectionTitle>Analytics</SectionTitle>
          <MenuItem onClick={() => navigate('/analytics')}>
            <BarChart3 size={18} />
            Analytics
          </MenuItem>
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
            Logout
          </MenuItem>
        </MenuSection>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
