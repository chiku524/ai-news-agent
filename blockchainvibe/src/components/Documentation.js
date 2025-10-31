import React from 'react';
import styled from 'styled-components';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import AnimatedBackground from './AnimatedBackground';
import Footer from './Footer';
import TableOfContents from './TableOfContents';
import { useTheme } from '../contexts/ThemeContext';

const DocsPageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  position: relative;
  z-index: 2;
  isolation: isolate;
`;

const DocsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const DocsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const DocsTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const DocsDescription = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const DocsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const DocCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DocIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textInverse};
`;

const DocCardTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const DocCardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const DocLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeight.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Documentation = () => {
  const { theme, setTheme } = useTheme();
  const docs = [
    {
      title: 'Getting Started',
      description: 'Quick start guide to get up and running with BlockchainVibe',
      link: '/docs/getting-started',
      icon: <FileText size={24} />
    },
    {
      title: 'Features',
      description: 'Complete overview of all platform features and capabilities',
      link: '/docs/features',
      icon: <FileText size={24} />
    },
    {
      title: 'API Reference',
      description: 'Complete REST API documentation with examples',
      link: '/docs/api-reference',
      icon: <FileText size={24} />
    },
    {
      title: 'AI Integration',
      description: 'Guide to AI agents, MeTTa Knowledge Graph, and Chat Protocol',
      link: '/docs/ai-integration',
      icon: <FileText size={24} />
    },
    {
      title: 'User Guide',
      description: 'Detailed instructions for using all platform features',
      link: '/docs/user-guide',
      icon: <FileText size={24} />
    },
    {
      title: 'Architecture',
      description: 'System architecture and infrastructure details',
      link: '/docs/architecture',
      icon: <FileText size={24} />
    }
  ];

  return (
    <DocsPageContainer>
      <AnimatedBackground />
      <Navigation theme={theme} onThemeChange={setTheme} />
      <DocsContainer>
        <TableOfContents />
        <ContentWrapper>
          <DocsHeader>
            <DocsTitle>Documentation</DocsTitle>
            <DocsDescription>
              Comprehensive documentation for BlockchainVibe. Learn how to use the platform,
              integrate with our API, and understand our AI-powered architecture.
            </DocsDescription>
          </DocsHeader>
          <DocsGrid>
            {docs.map((doc, index) => (
              <DocCard key={index}>
                <DocIcon>{doc.icon}</DocIcon>
                <DocCardTitle>{doc.title}</DocCardTitle>
                <DocCardDescription>{doc.description}</DocCardDescription>
                <DocLink to={doc.link}>
                  Read more →
                </DocLink>
              </DocCard>
            ))}
          </DocsGrid>
        </ContentWrapper>
      </DocsContainer>
      <Footer />
    </DocsPageContainer>
  );
};

export default Documentation;

