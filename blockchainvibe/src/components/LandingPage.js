import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  Star,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from './Navigation';
import AnimatedBackground from './AnimatedBackground';
import Footer from './Footer';

const LandingContainer = styled.div`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  position: relative;
  z-index: 2;
  isolation: isolate;
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

const VideoPlayer = styled.video`
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16/9;
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.surface};
  margin-top: 2rem;
  position: relative;
  z-index: 1;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
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

const CTASection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.surface};
  text-align: center;
  position: relative;
  z-index: 1;
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


// Pricing Section Styles
const PricingSection = styled.section`
  padding: 6rem 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  z-index: 1;
`;

const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const PricingCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 2rem;
  position: relative;
  transition: all ${props => props.theme.transitions.normal};
  
  ${props => props.featured && `
    border-color: ${props.theme.colors.primary};
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const PricingHeader = styled.div`
  margin-bottom: 2rem;
`;

const PricingTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const PricingPrice = styled.div`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  
  span {
    font-size: ${props => props.theme.fontSize.lg};
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const PricingFeatures = styled.div`
  margin-bottom: 2rem;
`;

const PricingFeature = styled.div`
  padding: 0.5rem 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.md};
`;

const PricingButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  border: none;
  
  ${props => props.variant === 'primary' && `
    background: ${props.theme.colors.primary};
    color: ${props.theme.colors.textInverse};
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: transparent;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.surfaceHover};
    }
  `}
`;

// About Section Styles
const AboutSection = styled.section`
  padding: 6rem 0;
  background: ${props => props.theme.colors.surface};
  position: relative;
  z-index: 1;
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const AboutText = styled.div`
  text-align: left;
`;

const AboutDescription = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 1.5rem;
`;

const AboutStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AboutStat = styled(motion.div)`
  text-align: center;
  
  h3 {
    font-size: ${props => props.theme.fontSize['3xl']};
    font-weight: ${props => props.theme.fontWeight.bold};
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.fontSize.md};
  }
`;

// Contact Section Styles
const ContactSection = styled.section`
  padding: 6rem 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  z-index: 1;
`;

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  text-align: left;
`;

const ContactItem = styled.div`
  margin-bottom: 2rem;
  
  h4 {
    font-size: ${props => props.theme.fontSize.lg};
    font-weight: ${props => props.theme.fontWeight.semibold};
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.fontSize.md};
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormInput = styled.input`
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FormTextarea = styled.textarea`
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.md};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FormButton = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;


const LandingPage = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();

  const Reveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0, transitionEnd: { opacity: 1 } } : undefined}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    );
  };

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
      <AnimatedBackground />
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
            <VideoPlayer
              controls
              preload="metadata"
              poster=""
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </VideoPlayer>
          </DemoVideo>
        </HeroContent>
      </HeroSection>

      <FeaturesSection id="features">
        <FeaturesContainer>
          <Reveal>
            <SectionTitle>
              Why Choose BlockchainVibe?
            </SectionTitle>
          </Reveal>
          <SectionSubtitle>
            Experience the future of blockchain news consumption with our cutting-edge AI technology
          </SectionSubtitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <FeatureCard>
                  <FeatureIcon>
                    {feature.icon}
                  </FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              </Reveal>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <PricingSection id="pricing">
        <PricingContainer>
          <Reveal>
            <SectionTitle>
              Simple, Transparent Pricing
            </SectionTitle>
          </Reveal>
          <SectionSubtitle>
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </SectionSubtitle>
          
          <PricingGrid>
            <PricingCard>
              <PricingHeader>
                <PricingTitle>Free</PricingTitle>
                <PricingPrice>$0<span>/month</span></PricingPrice>
              </PricingHeader>
              <PricingFeatures>
                <PricingFeature>✓ 10 articles per day</PricingFeature>
                <PricingFeature>✓ Basic AI filtering</PricingFeature>
                <PricingFeature>✓ Email support</PricingFeature>
              </PricingFeatures>
              <PricingButton variant="secondary">Get Started</PricingButton>
            </PricingCard>
            
            <PricingCard featured>
              <PricingBadge>Most Popular</PricingBadge>
              <PricingHeader>
                <PricingTitle>Pro</PricingTitle>
                <PricingPrice>$29<span>/month</span></PricingPrice>
              </PricingHeader>
              <PricingFeatures>
                <PricingFeature>✓ Unlimited articles</PricingFeature>
                <PricingFeature>✓ Advanced AI personalization</PricingFeature>
                <PricingFeature>✓ Priority support</PricingFeature>
                <PricingFeature>✓ Custom feeds</PricingFeature>
              </PricingFeatures>
              <PricingButton variant="primary">Start Free Trial</PricingButton>
            </PricingCard>
            
            <PricingCard>
              <PricingHeader>
                <PricingTitle>Enterprise</PricingTitle>
                <PricingPrice>Custom</PricingPrice>
              </PricingHeader>
              <PricingFeatures>
                <PricingFeature>✓ Everything in Pro</PricingFeature>
                <PricingFeature>✓ White-label solution</PricingFeature>
                <PricingFeature>✓ Dedicated support</PricingFeature>
                <PricingFeature>✓ Custom integrations</PricingFeature>
              </PricingFeatures>
              <PricingButton variant="secondary">Contact Sales</PricingButton>
            </PricingCard>
          </PricingGrid>
        </PricingContainer>
      </PricingSection>

      <AboutSection id="about">
        <AboutContainer>
          <AboutContent>
            <AboutText>
              <Reveal>
                <SectionTitle>
                  About BlockchainVibe
                </SectionTitle>
              </Reveal>
              <SectionSubtitle>
                We're revolutionizing how the blockchain community consumes news through 
                cutting-edge AI technology and intelligent automation.
              </SectionSubtitle>
              <AboutDescription>
                Founded by blockchain enthusiasts and AI researchers, BlockchainVibe combines 
                the power of Fetch.ai's uAgents framework with SingularityNET's MeTTa knowledge 
                graph to deliver personalized, relevant, and timely blockchain news.
              </AboutDescription>
            </AboutText>
            <AboutStats>
              <Reveal delay={0.1}>
                <AboutStat>
                  <h3>50+</h3>
                  <p>News Sources</p>
                </AboutStat>
              </Reveal>
              <Reveal delay={0.2}>
                <AboutStat>
                  <h3>24/7</h3>
                  <p>AI Monitoring</p>
                </AboutStat>
              </Reveal>
              <Reveal delay={0.3}>
                <AboutStat>
                  <h3>99.9%</h3>
                  <p>Accuracy Rate</p>
                </AboutStat>
              </Reveal>
            </AboutStats>
          </AboutContent>
        </AboutContainer>
      </AboutSection>

      <ContactSection id="contact">
        <ContactContainer>
          <Reveal>
            <SectionTitle>
              Get in Touch
            </SectionTitle>
          </Reveal>
          <SectionSubtitle>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </SectionSubtitle>
          
          <ContactContent>
            <ContactInfo>
              <ContactItem>
                <h4>Email</h4>
                <p>hello@blockchainvibe.news</p>
              </ContactItem>
              <ContactItem>
                <h4>Discord</h4>
                <p>Join our community</p>
              </ContactItem>
              <ContactItem>
                <h4>Twitter</h4>
                <p>@BlockchainVibe</p>
              </ContactItem>
            </ContactInfo>
            
            <ContactForm>
              <FormGroup>
                <FormInput type="text" placeholder="Your Name" />
              </FormGroup>
              <FormGroup>
                <FormInput type="email" placeholder="Your Email" />
              </FormGroup>
              <FormGroup>
                <FormTextarea placeholder="Your Message" rows="5" />
              </FormGroup>
              <FormButton>Send Message</FormButton>
            </ContactForm>
          </ContactContent>
        </ContactContainer>
      </ContactSection>

      <CTASection>
        <CTAContainer>
          <CTATitle>Ready to Transform Your News Experience?</CTATitle>
          <CTADescription>
            Get started with BlockchainVibe today and experience intelligent, 
            personalized blockchain news powered by AI.
          </CTADescription>
          <CTAButtons>
            <PrimaryButton onClick={handleGetStarted}>
              Start Your Journey
              <ArrowRight size={20} />
            </PrimaryButton>
          </CTAButtons>
        </CTAContainer>
      </CTASection>

      <Footer />
    </LandingContainer>
  );
};

export default LandingPage;
