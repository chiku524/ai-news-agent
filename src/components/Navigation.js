import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.scrolled ? props.theme.colors.surface : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  border-bottom: ${props => props.scrolled ? `1px solid ${props.theme.colors.border}` : 'none'};
  padding: 1rem 2rem;
  z-index: 1000;
  transition: all ${props => props.theme.transitions.normal};
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;
  object-fit: contain;
  display: block;
  
  /* Ensure logo loads even if SVG has issues */
  &[src="/logo.svg"] {
    min-width: 32px;
  }
`;

const LogoText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeight.medium};
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
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

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: ${props => props.theme.colors.surface};
  border-left: 1px solid ${props => props.theme.colors.border};
  padding: 2rem;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;


const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MobileMenuLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeight.medium};
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileMenuActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
`;

const Navigation = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleThemeToggle = () => {
    onThemeChange(theme === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <NavContainer scrolled={scrolled}>
        <NavContent>
          <Logo onClick={handleLogoClick}>
            <LogoImage src="/logo.svg" alt="BlockchainVibe Logo" />
            <LogoText>BlockchainVibe</LogoText>
          </Logo>

          <NavLinks>
            {navLinks.map((link, index) => (
              <NavLink key={index} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </NavLink>
            ))}
          </NavLinks>

          <NavActions>
            <ThemeButton onClick={handleThemeToggle}>
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </ThemeButton>
            
            <Button variant="secondary" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button variant="primary" onClick={handleSignUp}>
              Get Started
              <ArrowRight size={16} />
            </Button>
            
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </MobileMenuButton>
          </NavActions>
        </NavContent>
      </NavContainer>

      {mobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3 }}
        >
          <MobileMenuHeader>
            <Logo onClick={handleLogoClick}>
              <LogoImage src="/logo.svg" alt="BlockchainVibe Logo" />
              <LogoText>BlockchainVibe</LogoText>
            </Logo>
            <MobileMenuButton onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </MobileMenuButton>
          </MobileMenuHeader>

          <MobileMenuLinks>
            {navLinks.map((link, index) => (
              <MobileMenuLink key={index} href={link.href} onClick={(e) => {
                handleNavClick(e, link.href);
                setMobileMenuOpen(false);
              }}>
                {link.label}
              </MobileMenuLink>
            ))}
          </MobileMenuLinks>

          <MobileMenuActions>
            <Button variant="secondary" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button variant="primary" onClick={handleSignUp}>
              Get Started
              <ArrowRight size={16} />
            </Button>
          </MobileMenuActions>
        </MobileMenu>
      )}
    </>
  );
};

export default Navigation;
