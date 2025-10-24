import React from 'react';
import styled from 'styled-components';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StatusContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const StatusTitle = styled.h4`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`;

const OAuthStatus = ({ environment = 'development' }) => {
  const isProduction = environment === 'production';
  const isDevelopment = environment === 'development';

  const getProviderStatus = (provider, hasClientId, worksInDev = true) => {
    if (!hasClientId) {
      return { status: 'unavailable', icon: XCircle, color: '#ef4444' };
    }
    
    if (isProduction) {
      return { status: 'available', icon: CheckCircle, color: '#10b981' };
    }
    
    if (isDevelopment) {
      if (provider === 'GitHub') {
        return { status: 'warning', icon: AlertCircle, color: '#f59e0b' };
      }
      return worksInDev 
        ? { status: 'available', icon: CheckCircle, color: '#10b981' }
        : { status: 'warning', icon: AlertCircle, color: '#f59e0b' };
    }
    
    return { status: 'available', icon: CheckCircle, color: '#10b981' };
  };

  // Check if environment variables are available (with fallbacks)
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '579208613672-c4pvdarqdnckdai6re7n9nei5svk72st.apps.googleusercontent.com';
  const discordClientId = process.env.REACT_APP_DISCORD_CLIENT_ID || '1431187449215717457';
  const twitterClientId = process.env.REACT_APP_TWITTER_CLIENT_ID || 'QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ';
  const githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID || 'Ov23lisuJwAjEECYLj0y';

  console.log('OAuth Status - Environment variables:', {
    google: !!googleClientId,
    discord: !!discordClientId,
    twitter: !!twitterClientId,
    github: !!githubClientId,
    nodeEnv: process.env.NODE_ENV,
    reactAppEnv: process.env.REACT_APP_ENV,
    allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
  });

  const providers = [
    { name: 'Google', hasClientId: !!googleClientId, worksInDev: true },
    { name: 'Discord', hasClientId: !!discordClientId, worksInDev: true },
    { name: 'X (Twitter)', hasClientId: !!twitterClientId, worksInDev: true },
    { name: 'GitHub', hasClientId: !!githubClientId, worksInDev: false },
  ];

  return (
    <StatusContainer>
      <StatusTitle>
        <AlertCircle size={16} />
        OAuth Provider Status ({environment})
      </StatusTitle>
      <StatusList>
        {providers.map((provider) => {
          const { status, icon: Icon, color } = getProviderStatus(provider.name, provider.hasClientId, provider.worksInDev);
          
          let statusText = '';
          if (status === 'available') {
            statusText = 'Ready';
          } else if (status === 'warning') {
            statusText = provider.name === 'GitHub' 
              ? 'Production only (callback URL mismatch)'
              : 'May have issues';
          } else {
            statusText = 'Not configured';
          }

          return (
            <StatusItem key={provider.name}>
              <StatusIcon>
                <Icon size={14} color={color} />
              </StatusIcon>
              <span>{provider.name}:</span>
              <span style={{ color }}>{statusText}</span>
            </StatusItem>
          );
        })}
      </StatusList>
      {isDevelopment && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#f59e0b' }}>
          💡 <strong>Tip:</strong> Use Discord OAuth for local development as GitHub is configured for production only.
        </div>
      )}
    </StatusContainer>
  );
};

export default OAuthStatus;
