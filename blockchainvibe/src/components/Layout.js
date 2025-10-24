import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.theme.layout.sidebarWidth};
  padding: 0;
  overflow-x: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const Layout = ({ children, showSidebar = true }) => {
  return (
    <LayoutContainer>
      {showSidebar && <Sidebar />}
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
