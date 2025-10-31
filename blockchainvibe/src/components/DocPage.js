import React, { useEffect, useState } from 'react';
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
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.text};
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${props => props.theme.colors.border};
  }
  
  h3 {
    font-size: ${props => props.theme.fontSize.xl};
    font-weight: ${props => props.theme.fontWeight.semibold};
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  h4 {
    font-size: ${props => props.theme.fontSize.lg};
    font-weight: ${props => props.theme.fontWeight.semibold};
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: ${props => props.theme.colors.text};
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
    line-height: 1.8;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  code {
    background: ${props => props.theme.colors.surface};
    padding: 0.2rem 0.4rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: 1rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }
  
  pre code {
    background: none;
    padding: 0;
  }
  
  blockquote {
    border-left: 4px solid ${props => props.theme.colors.primary};
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: ${props => props.theme.colors.textSecondary};
    font-style: italic;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }
  
  th, td {
    border: 1px solid ${props => props.theme.colors.border};
    padding: 0.75rem;
    text-align: left;
  }
  
  th {
    background: ${props => props.theme.colors.surface};
    font-weight: ${props => props.theme.fontWeight.semibold};
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
  const { theme, setTheme } = useTheme();
  
  // Determine file path based on page type
  const getFilePath = () => {
    const legalPages = ['terms', 'privacy', 'whitepaper'];
    if (legalPages.includes(page)) {
      const fileName = page === 'terms' ? 'TERMS_OF_SERVICE' : 
                       page === 'privacy' ? 'PRIVACY_POLICY' : 'WHITEPAPER';
      return `https://github.com/chiku524/ai-news-agent/blob/main/blockchainvibe/${fileName}.md`;
    }
    return `https://github.com/chiku524/ai-news-agent/blob/main/blockchainvibe/docs/${page || 'index'}.md`;
  };
  
  return (
    <DocPageContainer>
      <AnimatedBackground />
      <Navigation theme={theme} onThemeChange={setTheme} />
      <PageContainer>
        <PageContent>
          <PageTitle>{title}</PageTitle>
          <PageText>
            <p>
              The full documentation for <strong>{title}</strong> is available in our GitHub repository.
              Click the link below to view the complete documentation:
            </p>
            <p style={{ textAlign: 'center', margin: '2rem 0' }}>
              <a 
                href={getFilePath()}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                View Full Documentation on GitHub →
              </a>
            </p>
            <p>
              <strong>Documentation Structure:</strong>
            </p>
            <ul>
              <li>General documentation files are located in the <code>blockchainvibe/docs/</code> directory</li>
              <li>Legal documents (Terms of Service, Privacy Policy, Whitepaper) are in the root <code>blockchainvibe/</code> directory</li>
              <li>All documentation is written in Markdown format for easy reading</li>
            </ul>
            <p>
              <strong>Alternative Access:</strong>
            </p>
            <ul>
              <li>You can clone the repository: <code>git clone https://github.com/chiku524/ai-news-agent.git</code></li>
              <li>Navigate to <code>blockchainvibe/docs/</code> or the root directory for legal documents</li>
              <li>View the files in your preferred Markdown viewer</li>
            </ul>
            <p style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '0.5rem' }}>
              <strong>Note:</strong> We're working on implementing an in-app documentation viewer. 
              For now, please access the full documentation via GitHub or by cloning the repository.
            </p>
          </PageText>
        </PageContent>
      </PageContainer>
      <Footer />
    </DocPageContainer>
  );
};

export default DocPage;

