import React from 'react';
import styled from 'styled-components';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${props => props.theme.colors.background};
`;

const ErrorContent = styled.div`
  max-width: 600px;
  text-align: center;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem;
`;

const ErrorIcon = styled(AlertCircle)`
  width: 64px;
  height: 64px;
  color: ${props => props.theme.colors.error || '#ef4444'};
  margin: 0 auto 1.5rem;
`;

const ErrorTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.borderRadius.md};
  
  summary {
    cursor: pointer;
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.fontSize.sm};
    margin-bottom: 0.5rem;
  }
  
  pre {
    font-size: ${props => props.theme.fontSize.xs};
    color: ${props => props.theme.colors.textMuted};
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

const ButtonGroup = styled.div`
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
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  border: none;
  
  ${props => props.primary ? `
    background: ${props.theme.colors.primary};
    color: ${props.theme.colors.textInverse};
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
      transform: translateY(-2px);
    }
  ` : `
    background: ${props.theme.colors.surfaceHover};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.surface};
      border-color: ${props.theme.colors.primary};
    }
  `}
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    this.navigate = null;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Store error details for display
    this.setState({
      error,
      errorInfo
    });

    // TODO: Log error to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const { fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.handleReset);
      }

      // Default error UI
      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorIcon />
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              We're sorry, but something unexpected happened. Please try refreshing the page or return to the home page.
            </ErrorMessage>
            
            {showDetails && error && (
              <ErrorDetails>
                <summary>Error Details (Development Only)</summary>
                <pre>{error.toString()}</pre>
                {errorInfo && (
                  <pre>{errorInfo.componentStack}</pre>
                )}
              </ErrorDetails>
            )}

            <ButtonGroup>
              <Button primary onClick={this.handleReset}>
                <RefreshCw size={18} />
                Refresh Page
              </Button>
              <Button onClick={this.handleGoHome}>
                <Home size={18} />
                Go Home
              </Button>
            </ButtonGroup>
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

