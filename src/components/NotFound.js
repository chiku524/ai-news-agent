import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const NotFoundContent = styled(motion.div)`
  text-align: center;
  max-width: 600px;
`;

const NotFoundIcon = styled.div`
  font-size: 8rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoIcon = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

const NotFoundTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const NotFoundDescription = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => props.variant === 'primary' && `
    background: ${props.theme.gradients.primary};
    color: ${props.theme.colors.textInverse};
    border: none;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${props.theme.shadows.lg};
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: transparent;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.surfaceHover};
      border-color: ${props.theme.colors.primary};
    }
  `}
`;

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <NotFoundContainer>
      <NotFoundContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NotFoundIcon>
          <LogoIcon src="/logo.svg" alt="BlockchainVibe Logo" />
        </NotFoundIcon>
        <NotFoundTitle>404 - Page Not Found</NotFoundTitle>
        <NotFoundDescription>
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </NotFoundDescription>
        
        <ActionButtons>
          <Button variant="primary" onClick={handleGoHome}>
            <Home size={18} />
            Go Home
          </Button>
          
          <Button variant="secondary" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Go Back
          </Button>
        </ActionButtons>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound;
