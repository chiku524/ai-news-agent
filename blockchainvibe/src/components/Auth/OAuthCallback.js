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
  const [status, setStatus] = React.useState('Completing authentication...');
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Add debugging
        console.log('OAuthCallback: Starting callback handling');
        console.log('Current URL:', window.location.href);
        console.log('URL params:', window.location.search);
        
        setStatus('Processing OAuth callback...');
        
        // Handle the OAuth callback
        await socialAuthService.handleOAuthCallback();
        
        setStatus('Authentication successful! Redirecting...');
        // Clear any previous errors on success
        setError(null);
      } catch (error) {
        console.error('OAuthCallback error:', error);
        setError(error.message);
        setStatus('Authentication failed');
      }
    };

    handleCallback();
  }, []);

  return (
    <CallbackContainer>
      <CallbackContent>
        <Spinner>
          <Loader size={48} />
        </Spinner>
        <CallbackText>
          {status}
        </CallbackText>
        {error && (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            Error: {error}
          </div>
        )}
      </CallbackContent>
    </CallbackContainer>
  );
};

export default OAuthCallback;
