import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SkeletonCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
  transition: all ${props => props.theme.transitions.fast};
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SkeletonAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.border};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonText = styled.div`
  flex: 1;
  height: 16px;
  background: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
  margin-bottom: 0.5rem;
  
  &:nth-child(1) { width: 60%; }
  &:nth-child(2) { width: 40%; }
`;

const SkeletonTitle = styled.div`
  height: 24px;
  background: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
  margin-bottom: 1rem;
  width: ${props => props.width || '85%'};
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  animation: ${pulse} 1.5s ease-in-out infinite;
  margin-bottom: 1rem;
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SkeletonButton = styled.div`
  width: 80px;
  height: 32px;
  background: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const NewsCardSkeleton = ({ featured = false }) => {
  if (featured) {
    return (
      <SkeletonCard>
        <SkeletonImage />
        <SkeletonTitle width="90%" />
        <SkeletonContent>
          <SkeletonText />
          <SkeletonText />
          <SkeletonText width="70%" />
        </SkeletonContent>
        <SkeletonFooter>
          <SkeletonText width="30%" />
          <SkeletonButton />
        </SkeletonFooter>
      </SkeletonCard>
    );
  }

  return (
    <SkeletonCard>
      <SkeletonHeader>
        <SkeletonAvatar />
        <div style={{ flex: 1 }}>
          <SkeletonText width="40%" />
          <SkeletonText width="30%" />
        </div>
      </SkeletonHeader>
      <SkeletonTitle />
      <SkeletonContent>
        <SkeletonText />
        <SkeletonText width="80%" />
      </SkeletonContent>
      <SkeletonFooter>
        <SkeletonText width="25%" />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SkeletonButton style={{ width: '60px' }} />
          <SkeletonButton style={{ width: '60px' }} />
        </div>
      </SkeletonFooter>
    </SkeletonCard>
  );
};

export default NewsCardSkeleton;

