import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Loader } from 'lucide-react';
import socialAuthService from '../../services/socialAuth';

const CallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const CallbackContent = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Spinner = styled.div`
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const CallbackText = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
`;

const OAuthCallback = () => {
  useEffect(() => {
    // Add debugging
    console.log('OAuthCallback: Starting callback handling');
    console.log('Current URL:', window.location.href);
    console.log('URL params:', window.location.search);
    
    // Handle the OAuth callback
    socialAuthService.handleOAuthCallback();
  }, []);

  return (
    <CallbackContainer>
      <CallbackContent>
        <Spinner>
          <Loader size={48} />
        </Spinner>
        <CallbackText>
          Completing authentication...
        </CallbackText>
      </CallbackContent>
    </CallbackContainer>
  );
};

export default OAuthCallback;
