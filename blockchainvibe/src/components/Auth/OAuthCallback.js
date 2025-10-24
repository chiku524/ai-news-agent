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
        
        setStatus('Processing OAuth callback...');
        setError(null); // Clear any previous errors
        
        // Handle the OAuth callback
        await socialAuthService.handleOAuthCallback();
        
        setStatus('Authentication successful! Redirecting...');
        setError(null); // Ensure no error is set on success
        
        // Add a small delay to show success message before redirect
        setTimeout(() => {
          setStatus('Redirecting to dashboard...');
        }, 1000);
        
      } catch (error) {
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
