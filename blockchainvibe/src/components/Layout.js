import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import AnimatedBackground from './AnimatedBackground';
import { useSidebar } from '../contexts/SidebarContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : props.theme.layout.sidebarWidth};
  padding: 0;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
  background: transparent;
  transition: margin-left ${props => props.theme.transitions.normal};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const Layout = ({ children, showSidebar = true }) => {
  const { collapsed } = useSidebar();
  
  return (
    <LayoutContainer>
      <AnimatedBackground />
      {showSidebar && <Sidebar />}
      <MainContent sidebarCollapsed={collapsed}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
