import React from 'react';
import styled from 'styled-components';
import AnimatedBackground from './AnimatedBackground';

const TestContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${props => props.theme.colors.background};
`;

const TestContent = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 10;
  position: relative;
`;

const BackgroundTest = () => {
  return (
    <TestContainer>
      <AnimatedBackground debug={true} />
      <TestContent>
        <h1>Animated Background Test</h1>
        <p>You should see floating blockchain elements in the background!</p>
        <p>If you can see this text clearly, the background is working correctly.</p>
      </TestContent>
    </TestContainer>
  );
};

export default BackgroundTest;
