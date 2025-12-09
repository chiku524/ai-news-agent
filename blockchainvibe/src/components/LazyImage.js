import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity ${props => props.theme.transitions.normal};
  opacity: ${props => props.loaded ? 1 : 0};
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.gradients.surface || props.theme.colors.surfaceHover};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${props => props.theme.colors.textMuted};
  opacity: ${props => props.loaded ? 0 : 1};
  transition: opacity ${props => props.theme.transitions.normal};
  pointer-events: none;
`;

const BlurPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.1);
  opacity: ${props => props.loaded ? 0 : 1};
  transition: opacity ${props => props.theme.transitions.normal};
  pointer-events: none;
`;

/**
 * LazyImage component with blur-up placeholder and lazy loading
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} placeholder - Placeholder emoji or text
 * @param {boolean} useBlur - Whether to use blur-up effect
 * @param {string} className - Additional CSS classes
 */
const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '📰',
  useBlur = false,
  className,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Use Intersection Observer for lazy loading
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, start loading
            if (imgRef.current && !loaded && !error) {
              const img = new Image();
              img.onload = () => setLoaded(true);
              img.onerror = () => setError(true);
              img.src = src;
            }
            // Unobserve after loading starts
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, loaded, error]);

  // Fallback: if Intersection Observer is not supported, load immediately
  useEffect(() => {
    if (!window.IntersectionObserver && !loaded && !error) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
      img.src = src;
    }
  }, [src, loaded, error]);

  return (
    <ImageContainer className={className}>
      {useBlur && src && !error && (
        <BlurPlaceholder src={src} loaded={loaded} />
      )}
      {!useBlur && !loaded && !error && (
        <Placeholder loaded={loaded}>{placeholder}</Placeholder>
      )}
      {error && (
        <Placeholder loaded={false}>{placeholder}</Placeholder>
      )}
      <Image
        ref={imgRef}
        src={loaded ? src : undefined}
        alt={alt}
        loaded={loaded && !error}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </ImageContainer>
  );
};

export default LazyImage;

