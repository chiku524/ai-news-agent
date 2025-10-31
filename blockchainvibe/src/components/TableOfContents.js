import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, FileText, Code, Brain, HelpCircle, MessageCircle, Bug, FileCheck, Shield, Scale } from 'lucide-react';

const Sidebar = styled.aside`
  position: sticky;
  top: 6rem;
  width: 280px;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  padding: 2rem 1rem 2rem 0;
  margin-right: 2rem;
  
  @media (max-width: 968px) {
    display: none;
  }
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
`;

const TOCSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TOCItem = styled.li`
  margin-bottom: 0.5rem;
`;

const TOCLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${props => props.theme.fontSize.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  background: ${props => props.active ? props.theme.colors.surface : 'transparent'};
  font-weight: ${props => props.active ? props.theme.fontWeight.medium : props.theme.fontWeight.normal};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.surface};
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const TableOfContents = () => {
  const location = useLocation();
  
  const tocSections = [
    {
      title: 'Getting Started',
      items: [
        { path: '/docs', label: 'Overview', icon: <BookOpen size={16} /> },
        { path: '/docs/getting-started', label: 'Getting Started', icon: <FileText size={16} /> },
        { path: '/docs/features', label: 'Features', icon: <FileText size={16} /> },
        { path: '/docs/user-guide', label: 'User Guide', icon: <FileText size={16} /> },
      ]
    },
    {
      title: 'Technical',
      items: [
        { path: '/docs/api-reference', label: 'API Reference', icon: <Code size={16} /> },
        { path: '/docs/ai-integration', label: 'AI Integration', icon: <Brain size={16} /> },
        { path: '/docs/architecture', label: 'Architecture', icon: <FileText size={16} /> },
      ]
    },
    {
      title: 'Resources',
      items: [
        { path: '/docs/whitepaper', label: 'Whitepaper', icon: <FileText size={16} /> },
      ]
    },
    {
      title: 'Support',
      items: [
        { path: '/docs/help-center', label: 'Help Center', icon: <HelpCircle size={16} /> },
        { path: '/docs/contact-us', label: 'Contact Us', icon: <MessageCircle size={16} /> },
        { path: '/docs/bug-report', label: 'Report a Bug', icon: <Bug size={16} /> },
      ]
    },
    {
      title: 'Legal',
      items: [
        { path: '/docs/terms', label: 'Terms of Service', icon: <Scale size={16} /> },
        { path: '/docs/privacy', label: 'Privacy Policy', icon: <Shield size={16} /> },
      ]
    }
  ];

  return (
    <Sidebar>
      {tocSections.map((section, sectionIndex) => (
        <TOCSection key={sectionIndex}>
          <SectionTitle>{section.title}</SectionTitle>
          <TOCList>
            {section.items.map((item, itemIndex) => {
              const isActive = location.pathname === item.path;
              return (
                <TOCItem key={itemIndex}>
                  <TOCLink to={item.path} active={isActive}>
                    {item.icon}
                    {item.label}
                  </TOCLink>
                </TOCItem>
              );
            })}
          </TOCList>
        </TOCSection>
      ))}
    </Sidebar>
  );
};

export default TableOfContents;

