import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const TestContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${props => props.theme.colors.background};
`;

const TestBox = styled.div`
  width: 200px;
  height: 200px;
  background: ${props => props.theme.colors.primary}20;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
  z-index: 10;
  position: relative;
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background: ${props => props.theme.colors.secondary}80;
  border-radius: 8px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const SimpleBackgroundTest = () => {
  const { theme } = useTheme();
  
  console.log('SimpleBackgroundTest theme:', theme);
  
  return (
    <TestContainer>
      <TestBox>
        Background Test
      </TestBox>
      
      {/* Add some floating elements directly */}
      <FloatingElement top={20} left={20} delay={0} />
      <FloatingElement top={60} left={70} delay={1} />
      <FloatingElement top={30} left={80} delay={2} />
      <FloatingElement top={70} left={30} delay={1.5} />
    </TestContainer>
  );
};

export default SimpleBackgroundTest;
