import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const drift = keyframes`
  0% { transform: translateX(-100px) translateY(0px); }
  100% { transform: translateX(calc(100vw + 100px)) translateY(-100px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.backgroundTertiary} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%,
    ${props => props.theme.colors.background} 100%
  );
  pointer-events: none;
  /* Avoid triggering layout/visibility thrash on some devices */
  will-change: auto;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 255, 198, 0.04) 0%, transparent 50%);
  /* Keep overlay static to prevent perceived fade on foreground elements */
  animation: none;
`;

const BlockchainBlock = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.15),
    rgba(139, 92, 246, 0.15)
  );
  border: 2px solid rgba(99, 102, 241, 0.4);
  border-radius: 8px;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  box-shadow: 0 8px 40px rgba(99, 102, 241, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    background: linear-gradient(45deg, 
      rgba(99, 102, 241, 0.2),
      transparent
    );
    border-radius: 4px;
    transform: translate(-50%, -50%);
    animation: ${pulse} ${props => props.duration * 0.7}s ease-in-out infinite;
  }
`;

const CryptoParticle = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(99, 102, 241, 0.4);
  border-radius: 50%;
  animation: ${drift} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, 
      rgba(99, 102, 241, 0.3) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${pulse} ${props => props.duration * 0.5}s ease-in-out infinite;
  }
`;

const NetworkLine = styled.div`
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(99, 102, 241, 0.6) 50%,
    transparent 100%
  );
  width: ${props => props.width}px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  transform: rotate(${props => props.angle}deg);
  animation: ${shimmer} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
`;

const Hexagon = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: linear-gradient(45deg, 
    rgba(139, 92, 246, 0.12),
    rgba(99, 102, 241, 0.12)
  );
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: ${rotate} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  border: 2px solid rgba(139, 92, 246, 0.4);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    background: linear-gradient(45deg, 
      rgba(99, 102, 241, 0.2),
      transparent
    );
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    transform: translate(-50%, -50%);
    animation: ${pulse} ${props => props.duration * 0.8}s ease-in-out infinite;
  }
`;

const DataFlow = styled.div`
  position: absolute;
  width: 3px;
  height: 100px;
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(99, 102, 241, 0.6) 50%,
    transparent 100%
  );
  animation: ${drift} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  transform: rotate(${props => props.angle}deg);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
`;

const AnimatedBackground = ({ variant = 'default', debug = false }) => {
  const containerRef = useRef(null);

  // Debug logging
  if (debug) {
    console.log('AnimatedBackground rendering with debug mode');
  }

  // Generate random positions and properties for elements
  const generateElements = () => {
    const elements = [];
    
    // Blockchain blocks
    for (let i = 0; i < 6; i++) {
      elements.push({
        type: 'block',
        size: Math.random() * 60 + 30,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5
      });
    }
    
    // Crypto particles
    for (let i = 0; i < 8; i++) {
      elements.push({
        type: 'particle',
        size: Math.random() * 8 + 4,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10
      });
    }
    
    // Network lines
    for (let i = 0; i < 4; i++) {
      elements.push({
        type: 'line',
        width: Math.random() * 300 + 150,
        top: Math.random() * 100,
        left: Math.random() * 100,
        angle: Math.random() * 360,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 8
      });
    }
    
    // Hexagons
    for (let i = 0; i < 3; i++) {
      elements.push({
        type: 'hexagon',
        size: Math.random() * 50 + 30,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 6
      });
    }
    
    // Data flow
    for (let i = 0; i < 2; i++) {
      elements.push({
        type: 'dataflow',
        top: Math.random() * 100,
        left: Math.random() * 100,
        angle: Math.random() * 360,
        duration: Math.random() * 18 + 12,
        delay: Math.random() * 7
      });
    }
    
    return elements;
  };

  const elements = generateElements();

  return (
    <>
      {debug && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 0, 0, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 99999,
          pointerEvents: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          Debug: {elements.length} elements
        </div>
      )}
      <BackgroundContainer ref={containerRef}>
        <GradientOverlay />
      
      {elements.map((element, index) => {
        const key = `${element.type}-${index}`;
        
        switch (element.type) {
          case 'block':
            return (
              <BlockchainBlock
                key={key}
                size={element.size}
                top={element.top}
                left={element.left}
                duration={element.duration}
                delay={element.delay}
              />
            );
          case 'particle':
            return (
              <CryptoParticle
                key={key}
                size={element.size}
                top={element.top}
                left={element.left}
                duration={element.duration}
                delay={element.delay}
              />
            );
          case 'line':
            return (
              <NetworkLine
                key={key}
                width={element.width}
                top={element.top}
                left={element.left}
                angle={element.angle}
                duration={element.duration}
                delay={element.delay}
              />
            );
          case 'hexagon':
            return (
              <Hexagon
                key={key}
                size={element.size}
                top={element.top}
                left={element.left}
                duration={element.duration}
                delay={element.delay}
              />
            );
          case 'dataflow':
            return (
              <DataFlow
                key={key}
                top={element.top}
                left={element.left}
                angle={element.angle}
                duration={element.duration}
                delay={element.delay}
              />
            );
          default:
            return null;
        }
      })}
      </BackgroundContainer>
    </>
  );
};

export default AnimatedBackground;
