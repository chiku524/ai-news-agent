import React from 'react';
import styled from 'styled-components';
import { Github, Twitter, Globe, Mail } from 'lucide-react';

const FooterContainer = styled.footer`
  margin-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  position: relative;
  z-index: 2;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Brand = styled.div`
  color: ${props => props.theme.colors.text};
`;

const BrandTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  background: ${props => props.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const Column = styled.div``;

const ColumnTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fontWeight.semibold};
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled.a`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${props => props.theme.fontSize.sm};
  &:hover { color: ${props => props.theme.colors.text}; }
`;

const BottomBar = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 0;
`;

const BottomInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.sm};
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Socials = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.textSecondary};
  &:hover { color: ${props => props.theme.colors.text}; border-color: ${props => props.theme.colors.primary}; }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <Brand>
          <BrandTitle>BlockchainVibe</BrandTitle>
          <BrandText>AI-powered blockchain news, personalized with uAgents and a knowledge graph.</BrandText>
        </Brand>
        <Column>
          <ColumnTitle>Product</ColumnTitle>
          <LinkList>
            <FooterLink href="/trending">Trending</FooterLink>
            <FooterLink href="/for-you">For You</FooterLink>
            <FooterLink href="/news">News Feed</FooterLink>
            <FooterLink href="/analytics">Analytics</FooterLink>
          </LinkList>
        </Column>
        <Column>
          <ColumnTitle>Resources</ColumnTitle>
          <LinkList>
            <FooterLink href="https://github.com/chiku524/ai-news-agent" target="_blank" rel="noreferrer">GitHub</FooterLink>
            <FooterLink href="/settings">Settings</FooterLink>
            <FooterLink href="/profile">Profile</FooterLink>
            <FooterLink href="/signin">Sign In</FooterLink>
          </LinkList>
        </Column>
      </FooterInner>
      <BottomBar>
        <BottomInner>
          <div>© {new Date().getFullYear()} BlockchainVibe. All rights reserved.</div>
          <Socials>
            <IconLink href="https://blockchainvibe.news" aria-label="Website"><Globe size={18} /></IconLink>
            <IconLink href="https://github.com/chiku524/ai-news-agent" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></IconLink>
            <IconLink href="#" aria-label="Twitter"><Twitter size={18} /></IconLink>
            <IconLink href="mailto:contact@blockchainvibe.news" aria-label="Email"><Mail size={18} /></IconLink>
          </Socials>
        </BottomInner>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;
