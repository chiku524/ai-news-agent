import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Heart, 
  Share2, 
  Bookmark, 
  TrendingUp,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CardContainer = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary};
  }
  
  ${props => props.featured && `
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 400px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `}
`;

const ImageContainer = styled.div`
  position: relative;
  height: ${props => props.featured ? '100%' : '200px'};
  overflow: hidden;
  background: ${props => props.theme.colors.background};
  
  ${props => props.featured && `
    @media (max-width: 768px) {
      height: 200px;
    }
  `}
`;

const NewsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${props => props.theme.transitions.normal};
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.gradients.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${props => props.theme.colors.textMuted};
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const RelevanceScore = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ContentContainer = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  ${props => props.featured && `
    justify-content: center;
  `}
`;

const NewsHeader = styled.div`
  margin-bottom: 1rem;
`;

const NewsTitle = styled.h3`
  font-size: ${props => props.featured ? props.theme.fontSize['2xl'] : props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.featured ? 3 : 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsExcerpt = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.featured ? props.theme.fontSize.base : props.theme.fontSize.sm};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.featured ? 4 : 3};
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const NewsMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.fontSize.sm};
`;

const SourceName = styled.span`
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.primary};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  font-size: ${props => props.theme.fontSize.sm};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    color: ${props => props.theme.colors.primary};
  }
`;

const ReadMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateX(2px);
  }
`;

const NewsCard = ({ news, featured = false, onInteraction }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleAction = (action) => {
    switch (action) {
      case 'like':
        setIsLiked(!isLiked);
        onInteraction?.(news.id, isLiked ? 'unlike' : 'like');
        break;
      case 'bookmark':
        setIsBookmarked(!isBookmarked);
        onInteraction?.(news.id, isBookmarked ? 'unbookmark' : 'bookmark');
        break;
      case 'share':
        setIsShared(true);
        onInteraction?.(news.id, 'share');
        // Reset after a short delay
        setTimeout(() => setIsShared(false), 2000);
        break;
      default:
        break;
    }
  };

  const handleReadMore = () => {
    onInteraction?.(news.id, 'read');
    window.open(news.url, '_blank');
  };

  const formatTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };


  return (
    <CardContainer
      featured={featured}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <ImageContainer featured={featured}>
        {news.image_url ? (
          <NewsImage src={news.image_url} alt={news.title} />
        ) : (
          <ImagePlaceholder>
            📰
          </ImagePlaceholder>
        )}
        
        {news.categories && news.categories.length > 0 && (
          <CategoryBadge>
            {news.categories[0]}
          </CategoryBadge>
        )}
        
        {news.relevance_score && (
          <RelevanceScore>
            <TrendingUp size={12} />
            {Math.round(news.relevance_score * 100)}%
          </RelevanceScore>
        )}
      </ImageContainer>

      <ContentContainer featured={featured}>
        <NewsHeader>
          <NewsTitle featured={featured}>
            {news.title}
          </NewsTitle>
          
          <NewsExcerpt featured={featured}>
            {news.content || news.excerpt || 'No description available.'}
          </NewsExcerpt>
        </NewsHeader>

        <NewsMeta>
          <MetaItem>
            <Clock size={14} />
            {formatTimeAgo(news.published_at)}
          </MetaItem>
          
          <MetaItem>
            <SourceName>{news.source}</SourceName>
          </MetaItem>
          
          {news.author && (
            <MetaItem>
              by {news.author}
            </MetaItem>
          )}
        </NewsMeta>

        {news.tags && news.tags.length > 0 && (
          <TagsContainer>
            {news.tags.slice(0, 3).map((tag, index) => (
              <Tag key={index}>
                {tag}
              </Tag>
            ))}
            {news.tags.length > 3 && (
              <Tag>+{news.tags.length - 3} more</Tag>
            )}
          </TagsContainer>
        )}

        <ActionsContainer>
          <ActionButtons>
            <ActionButton
              className={isLiked ? 'active' : ''}
              onClick={() => handleAction('like')}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              {news.engagement_metrics?.likes || 0}
            </ActionButton>
            
            <ActionButton
              className={isBookmarked ? 'active' : ''}
              onClick={() => handleAction('bookmark')}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </ActionButton>
            
            <ActionButton
              className={isShared ? 'active' : ''}
              onClick={() => handleAction('share')}
            >
              <Share2 size={16} />
            </ActionButton>
            
            <ActionButton>
              <MessageCircle size={16} />
              {news.engagement_metrics?.comments || 0}
            </ActionButton>
          </ActionButtons>

          <ReadMoreButton onClick={handleReadMore}>
            Read More
            <ChevronRight size={16} />
          </ReadMoreButton>
        </ActionsContainer>
      </ContentContainer>
    </CardContainer>
  );
};

export default NewsCard;
