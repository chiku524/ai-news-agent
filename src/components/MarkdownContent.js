import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { Loader2 } from 'lucide-react';

const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
  line-height: 1.8;
  color: ${props => props.theme.colors.text};
  
  h1 {
    font-size: ${props => props.theme.fontSize['4xl']};
    font-weight: ${props => props.theme.fontWeight.bold};
    margin: 3rem 0 2rem 0;
    padding-bottom: 1rem;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
  
  h2 {
    font-size: ${props => props.theme.fontSize['3xl']};
    font-weight: ${props => props.theme.fontWeight.bold};
    margin: 2.5rem 0 1.5rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
  
  h3 {
    font-size: ${props => props.theme.fontSize['2xl']};
    font-weight: ${props => props.theme.fontWeight.semibold};
    margin: 2rem 0 1rem 0;
    color: ${props => props.theme.colors.text};
  }
  
  h4 {
    font-size: ${props => props.theme.fontSize.xl};
    font-weight: ${props => props.theme.fontWeight.semibold};
    margin: 1.5rem 0 0.75rem 0;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.text};
    line-height: 1.8;
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
    line-height: 1.8;
  }
  
  li {
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text};
  }
  
  code {
    background: ${props => props.theme.colors.surface};
    padding: 0.2rem 0.4rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: ${props => props.theme.colors.primary};
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
    color: ${props => props.theme.colors.text};
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
  
  hr {
    border: none;
    border-top: 1px solid ${props => props.theme.colors.border};
    margin: 2rem 0;
  }
  
  strong {
    font-weight: ${props => props.theme.fontWeight.semibold};
    color: ${props => props.theme.colors.text};
  }
  
  em {
    font-style: italic;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const MarkdownContent = ({ filePath, content }) => {
  const [markdown, setMarkdown] = useState(content || '');
  const [loading, setLoading] = useState(!content);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (content) {
      setMarkdown(content);
      return;
    }

    if (!filePath) {
      setError('No file path provided');
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from public folder
        const response = await fetch(filePath);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const text = await response.text();
        setMarkdown(text);
      } catch (err) {
        console.error('Error fetching markdown:', err);
        setError(`Unable to load content. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [filePath, content]);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size={32} />
        <p style={{ marginTop: '1rem' }}>Loading content...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <p>{error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9em', opacity: 0.7 }}>
          Please try refreshing the page or contact support if the issue persists.
        </p>
      </ErrorContainer>
    );
  }

  if (!markdown) {
    return (
      <ErrorContainer>
        <p>No content available.</p>
      </ErrorContainer>
    );
  }

  return (
    <ContentContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </ContentContainer>
  );
};

export default MarkdownContent;

