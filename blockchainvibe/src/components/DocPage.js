import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Navigation from './Navigation';
import AnimatedBackground from './AnimatedBackground';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';

const DocPageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  position: relative;
  z-index: 2;
  isolation: isolate;
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem 2rem;
  position: relative;
  z-index: 1;
`;

const PageContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem;
  min-height: 60vh;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const PageText = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.8;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  h2 {
    font-size: ${props => props.theme.fontSize['2xl']};
    font-weight: ${props => props.theme.fontWeight.bold};
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DocPage = () => {
  const { page } = useParams();
  
  const pageNames = {
    'whitepaper': 'Whitepaper',
    'api-reference': 'API Reference',
    'ai-integration': 'AI Integration',
    'help-center': 'Help Center',
    'contact-us': 'Contact Us',
    'bug-report': 'Bug Report',
    'terms': 'Terms of Service',
    'privacy': 'Privacy Policy',
    'getting-started': 'Getting Started',
    'features': 'Features',
    'user-guide': 'User Guide',
    'architecture': 'Architecture'
  };
  
  const title = pageNames[page] || 'Documentation';
  const { theme, currentTheme, setTheme } = useTheme();
  
  return (
    <DocPageContainer>
      <AnimatedBackground />
      <Navigation theme={theme} onThemeChange={setTheme} />
      <PageContainer>
        <PageContent>
          <PageTitle>{title}</PageTitle>
          <PageText>
            <p>
              This documentation page is available in our documentation repository.
              The full documentation is available at:
            </p>
            <p>
              <strong>GitHub:</strong>{' '}
              <a 
                href={`https://github.com/chiku524/ai-news-agent/tree/main/blockchainvibe/docs/${page || ''}.md`}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </p>
            <p>
              <strong>Documentation Files:</strong>
            </p>
            <ul>
              <li>All documentation files are located in the <code>blockchainvibe/docs/</code> directory</li>
              <li>Legal documents are in the root directory: <code>WHITEPAPER.md</code>, <code>TERMS_OF_SERVICE.md</code>, <code>PRIVACY_POLICY.md</code></li>
            </ul>
            <p>
              For the complete documentation experience, please visit our GitHub repository
              or access the documentation files directly.
            </p>
          </PageText>
        </PageContent>
      </PageContainer>
      <Footer />
    </DocPageContainer>
  );
};

export default DocPage;

