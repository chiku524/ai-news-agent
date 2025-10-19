import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  Star,
  Play,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}10 0%, 
    ${props => props.theme.colors.secondary}10 100%);
  position: relative;
  overflow: hidden;
  padding-top: 80px; /* Add space for fixed navbar */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%236366f1" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: ${props => props.theme.fontWeight.extrabold};
  background: ${props => props.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.lg};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const DemoVideo = styled(motion.div)`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows['2xl']};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
`;

const VideoPlaceholder = styled.div`
  aspect-ratio: 16/9;
  background: ${props => props.theme.gradients.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
`;

const PlayButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: all ${props => props.theme.transitions.normal};
  margin-bottom: 1rem;
  
  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.colors.primaryHover};
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.surface};
  margin-top: 2rem;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  text-align: center;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.fontSize.xl};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  text-align: center;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  color: ${props => props.theme.colors.textInverse};
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 4rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled.div`
  & h3 {
    font-size: ${props => props.theme.fontSize['3xl']};
    font-weight: ${props => props.theme.fontWeight.bold};
    margin-bottom: 0.5rem;
  }
  
  & p {
    font-size: ${props => props.theme.fontSize.lg};
    opacity: 0.9;
  }
`;

const CTASection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.background};
  text-align: center;
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const CTADescription = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const Footer = styled.footer`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 3rem 2rem 2rem 2rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  & h4 {
    font-size: ${props => props.theme.fontSize.lg};
    font-weight: ${props => props.theme.fontWeight.semibold};
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  & li {
    margin-bottom: 0.5rem;
  }
  
  & a {
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.fast};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.textInverse};
    transform: translateY(-2px);
  }
`;

const LandingPage = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const features = [
    {
      icon: <Brain size={32} />,
      title: "AI-Powered Intelligence",
      description: "Leverages Fetch.ai uAgents and SingularityNET MeTTa for intelligent news analysis and personalization."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Real-time Trending",
      description: "Get the latest blockchain news as it happens with our advanced trending algorithms."
    },
    {
      icon: <Shield size={32} />,
      title: "Personalized Feed",
      description: "News tailored to your interests and reading patterns using advanced ML algorithms."
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Optimized for speed with intelligent caching and real-time updates."
    },
    {
      icon: <Users size={32} />,
      title: "Community Driven",
      description: "Connect with other blockchain enthusiasts and share insights."
    },
    {
      icon: <Star size={32} />,
      title: "Premium Sources",
      description: "Curated from top blockchain news sources and verified information."
    }
  ];

  return (
    <LandingContainer>
      <Navigation theme={theme} onThemeChange={onThemeChange} />
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AI-Powered Blockchain News
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stay ahead of the curve with intelligent news aggregation, 
            personalized recommendations, and real-time insights from the blockchain world.
          </HeroSubtitle>
          
          <CTAButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PrimaryButton onClick={handleGetStarted}>
              Get Started Free
              <ArrowRight size={20} />
            </PrimaryButton>
            
            <SecondaryButton onClick={handleSignIn}>
              Sign In
            </SecondaryButton>
          </CTAButtons>
          
          <DemoVideo
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <VideoPlaceholder>
              <PlayButton>
                <Play size={32} fill="currentColor" />
              </PlayButton>
              <p>Watch Demo</p>
            </VideoPlaceholder>
          </DemoVideo>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose BlockchainVibe?</SectionTitle>
          <SectionSubtitle>
            Experience the future of blockchain news consumption with our cutting-edge AI technology
          </SectionSubtitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <StatsSection>
        <StatsContainer>
          <StatItem>
            <h3>10K+</h3>
            <p>Active Users</p>
          </StatItem>
          <StatItem>
            <h3>1M+</h3>
            <p>Articles Processed</p>
          </StatItem>
          <StatItem>
            <h3>99.9%</h3>
            <p>Uptime</p>
          </StatItem>
          <StatItem>
            <h3>24/7</h3>
            <p>Real-time Updates</p>
          </StatItem>
        </StatsContainer>
      </StatsSection>

      <CTASection>
        <CTAContainer>
          <CTATitle>Ready to Transform Your News Experience?</CTATitle>
          <CTADescription>
            Join thousands of blockchain enthusiasts who trust BlockchainVibe 
            for their daily dose of intelligent, personalized news.
          </CTADescription>
          <CTAButtons>
            <PrimaryButton onClick={handleGetStarted}>
              Start Your Journey
              <ArrowRight size={20} />
            </PrimaryButton>
          </CTAButtons>
        </CTAContainer>
      </CTASection>

      <Footer>
        <FooterContainer>
          <FooterSection>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#api">API</a></li>
              <li><a href="#docs">Documentation</a></li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h4>Resources</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#status">Status</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </FooterSection>
        </FooterContainer>
        
        <FooterBottom>
          <p>&copy; 2024 BlockchainVibe. All rights reserved.</p>
          <SocialLinks>
            <SocialLink href="#twitter">
              <Twitter size={20} />
            </SocialLink>
            <SocialLink href="#github">
              <Github size={20} />
            </SocialLink>
            <SocialLink href="#linkedin">
              <Linkedin size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterBottom>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
