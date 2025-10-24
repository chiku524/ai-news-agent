import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  Bookmark,
  Clock,
  Target,
  Brain,
  Zap
} from 'lucide-react';
import { useUser } from '../hooks/useUser';

const AnalyticsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const AnalyticsHeader = styled.div`
  margin-bottom: 3rem;
`;

const AnalyticsTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  background: ${props => props.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const AnalyticsSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  text-align: center;
  transition: transform ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: ${props => props.theme.colors.primary};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: ${props => props.theme.colors.background};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const AIInsights = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const AIInsightsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AIInsightsTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const InsightItem = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const InsightText = styled.p`
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.6;
`;

const InsightSource = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.5rem;
  font-style: italic;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const CategoryCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  text-align: center;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    transform: translateY(-2px);
  }
`;

const CategoryName = styled.div`
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const CategoryCount = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const CategoryPercentage = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const Analytics = () => {
  const { userProfile, isLoading } = useUser();
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Simulate fetching analytics data
    const mockData = {
      totalArticles: 127,
      articlesRead: 89,
      timeSpent: 1240, // minutes
      averageRelevance: 0.87,
      topCategories: [
        { name: 'DeFi', count: 34, percentage: 38 },
        { name: 'Bitcoin', count: 28, percentage: 31 },
        { name: 'Ethereum', count: 18, percentage: 20 },
        { name: 'NFTs', count: 9, percentage: 10 }
      ],
      aiInsights: [
        {
          text: "Your reading patterns show strong interest in DeFi protocols. Consider exploring yield farming strategies.",
          source: "MeTTa Knowledge Graph"
        },
        {
          text: "Based on your activity, you might be interested in upcoming Ethereum 2.0 developments.",
          source: "Fetch.ai uAgents"
        },
        {
          text: "Your engagement with Bitcoin news is 23% higher than average users in your region.",
          source: "AI Analytics Engine"
        }
      ],
      readingTrends: {
        thisWeek: 12,
        lastWeek: 8,
        change: 50
      },
      relevanceScore: {
        current: 87,
        previous: 82,
        change: 5
      }
    };
    
    setAnalyticsData(mockData);
  }, []);

  if (isLoading) {
    return (
      <AnalyticsContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <div>Loading analytics...</div>
        </div>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <AnalyticsHeader>
        <AnalyticsTitle>Analytics Dashboard</AnalyticsTitle>
        <AnalyticsSubtitle>
          AI-powered insights into your blockchain news consumption patterns
        </AnalyticsSubtitle>
      </AnalyticsHeader>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon>
            <Eye size={24} />
          </StatIcon>
          <StatValue>{analyticsData?.articlesRead || 0}</StatValue>
          <StatLabel>Articles Read</StatLabel>
          <StatChange positive={analyticsData?.readingTrends?.change > 0}>
            {analyticsData?.readingTrends?.change > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {analyticsData?.readingTrends?.change || 0}% this week
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon>
            <Clock size={24} />
          </StatIcon>
          <StatValue>{Math.floor((analyticsData?.timeSpent || 0) / 60)}h</StatValue>
          <StatLabel>Time Spent Reading</StatLabel>
          <StatChange positive>
            <TrendingUp size={16} />
            +15% from last month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon>
            <Target size={24} />
          </StatIcon>
          <StatValue>{Math.round((analyticsData?.averageRelevance || 0) * 100)}%</StatValue>
          <StatLabel>Relevance Score</StatLabel>
          <StatChange positive={analyticsData?.relevanceScore?.change > 0}>
            {analyticsData?.relevanceScore?.change > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {analyticsData?.relevanceScore?.change || 0}% improvement
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon>
            <Heart size={24} />
          </StatIcon>
          <StatValue>23</StatValue>
          <StatLabel>Articles Liked</StatLabel>
          <StatChange positive>
            <TrendingUp size={16} />
            +8 this week
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Reading Trends</ChartTitle>
          <ChartPlaceholder>
            <BarChart3 size={48} />
            <div style={{ marginTop: '1rem' }}>Interactive chart coming soon</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Powered by Fetch.ai uAgents
            </div>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Category Distribution</ChartTitle>
          <CategoriesGrid>
            {analyticsData?.topCategories?.map((category, index) => (
              <CategoryCard key={index}>
                <CategoryName>{category.name}</CategoryName>
                <CategoryCount>{category.count}</CategoryCount>
                <CategoryPercentage>{category.percentage}%</CategoryPercentage>
              </CategoryCard>
            ))}
          </CategoriesGrid>
        </ChartCard>
      </ChartsGrid>

      <AIInsights>
        <AIInsightsHeader>
          <Brain size={24} color="#8b5cf6" />
          <AIInsightsTitle>AI-Powered Insights</AIInsightsTitle>
          <Zap size={20} color="#f59e0b" />
        </AIInsightsHeader>
        
        {analyticsData?.aiInsights?.map((insight, index) => (
          <InsightItem key={index}>
            <InsightText>{insight.text}</InsightText>
            <InsightSource>Source: {insight.source}</InsightSource>
          </InsightItem>
        ))}
      </AIInsights>
    </AnalyticsContainer>
  );
};

export default Analytics;
