// SEO metadata for different pages
export const seoMetadata = {
  home: {
    title: 'BlockchainVibe - AI-Powered Blockchain News Aggregator',
    description: 'AI-powered blockchain news platform with intelligent personalization using Fetch.ai uAgents and SingularityNET MeTTa Knowledge Graph. Stay ahead with real-time blockchain news tailored to your interests.',
    keywords: 'blockchain news, crypto news, AI news aggregator, Fetch.ai, uAgents, SingularityNET, MeTTa, blockchain intelligence, cryptocurrency news, DeFi news, NFT news, Solana news',
    url: '/'
  },
  dashboard: {
    title: 'Dashboard - Personalized Blockchain News',
    description: 'Your personalized blockchain news dashboard with AI-powered recommendations. Track trending news, your reading patterns, and discover content tailored to your interests.',
    keywords: 'blockchain dashboard, personalized news, crypto dashboard, news analytics',
    url: '/dashboard'
  },
  trending: {
    title: 'Trending News - Latest Blockchain Updates',
    description: 'Discover the most trending blockchain and cryptocurrency news. Real-time updates from top sources across DeFi, NFTs, Layer 2, and more.',
    keywords: 'trending crypto news, trending blockchain news, popular crypto articles, hot crypto news',
    url: '/trending'
  },
  forYou: {
    title: 'For You - Personalized Blockchain News Feed',
    description: 'Your personalized blockchain news feed powered by AI. Discover articles tailored to your interests, reading patterns, and preferences.',
    keywords: 'personalized news, AI recommendations, tailored content, custom news feed',
    url: '/for-you'
  },
  news: {
    title: 'News Feed - All Blockchain News',
    description: 'Comprehensive blockchain and cryptocurrency news feed. Stay updated with the latest developments across the crypto ecosystem.',
    keywords: 'blockchain news feed, crypto news feed, cryptocurrency news, all crypto news',
    url: '/news'
  },
  docs: {
    title: 'Documentation - BlockchainVibe Guide',
    description: 'Complete documentation for BlockchainVibe. Learn how to use AI-powered blockchain news aggregation, API integration, and advanced features.',
    keywords: 'BlockchainVibe documentation, API documentation, user guide, blockchain news API',
    url: '/docs'
  },
  apiReference: {
    title: 'API Reference - BlockchainVibe Developer Guide',
    description: 'Complete API reference for BlockchainVibe. Integrate AI-powered blockchain news aggregation into your applications.',
    keywords: 'BlockchainVibe API, news API, blockchain API, crypto news API, developer guide',
    url: '/docs/api-reference'
  },
  aiIntegration: {
    title: 'AI Integration - Fetch.ai & SingularityNET Guide',
    description: 'Learn how BlockchainVibe uses Fetch.ai uAgents and SingularityNET MeTTa Knowledge Graph for intelligent news processing and personalization.',
    keywords: 'Fetch.ai uAgents, SingularityNET MeTTa, AI integration, agent-based news, knowledge graph',
    url: '/docs/ai-integration'
  },
  whitepaper: {
    title: 'Whitepaper - BlockchainVibe Platform',
    description: 'Complete technical whitepaper detailing BlockchainVibe\'s architecture, AI integration, and vision for intelligent blockchain news aggregation.',
    keywords: 'BlockchainVibe whitepaper, technical documentation, platform architecture',
    url: '/docs/whitepaper'
  },
  helpCenter: {
    title: 'Help Center - Get Support',
    description: 'Find answers to common questions about BlockchainVibe. Get help with features, troubleshooting, and platform usage.',
    keywords: 'BlockchainVibe help, support, FAQ, troubleshooting',
    url: '/docs/help-center'
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description: 'Contact the BlockchainVibe team. We\'re here to help with questions, feedback, partnerships, and support requests.',
    keywords: 'contact BlockchainVibe, support email, partnership inquiries',
    url: '/docs/contact-us'
  },
  privacy: {
    title: 'Privacy Policy - BlockchainVibe',
    description: 'BlockchainVibe Privacy Policy. Learn how we collect, use, and protect your data when using our AI-powered news platform.',
    keywords: 'privacy policy, data protection, user privacy',
    url: '/docs/privacy'
  },
  terms: {
    title: 'Terms of Service - BlockchainVibe',
    description: 'BlockchainVibe Terms of Service. Review the terms and conditions for using our AI-powered blockchain news platform.',
    keywords: 'terms of service, user agreement, terms and conditions',
    url: '/docs/terms'
  },
  analytics: {
    title: 'Analytics - Your Reading Insights',
    description: 'View your blockchain news reading analytics. Track your interests, reading patterns, and engagement metrics.',
    keywords: 'news analytics, reading insights, engagement metrics, reading statistics',
    url: '/analytics'
  },
  profile: {
    title: 'Profile - Your BlockchainVibe Account',
    description: 'Manage your BlockchainVibe profile, preferences, and account settings.',
    keywords: 'user profile, account settings, preferences',
    url: '/profile'
  },
  settings: {
    title: 'Settings - Customize Your Experience',
    description: 'Customize your BlockchainVibe experience. Adjust preferences, notifications, privacy settings, and appearance.',
    keywords: 'settings, preferences, customization, account settings',
    url: '/settings'
  }
};

// Get metadata for a specific route
export const getMetadataForRoute = (pathname) => {
  // Remove trailing slash
  const path = pathname.replace(/\/$/, '');
  
  // Check for exact matches first
  if (seoMetadata[path] || seoMetadata[path.substring(1)]) {
    return seoMetadata[path] || seoMetadata[path.substring(1)];
  }
  
  // Check for path patterns
  if (path.startsWith('/docs/api-reference')) {
    return seoMetadata.apiReference;
  }
  if (path.startsWith('/docs/ai-integration')) {
    return seoMetadata.aiIntegration;
  }
  if (path.startsWith('/docs/whitepaper')) {
    return seoMetadata.whitepaper;
  }
  if (path.startsWith('/docs/help-center')) {
    return seoMetadata.helpCenter;
  }
  if (path.startsWith('/docs/contact-us')) {
    return seoMetadata.contact;
  }
  if (path.startsWith('/docs/privacy')) {
    return seoMetadata.privacy;
  }
  if (path.startsWith('/docs/terms')) {
    return seoMetadata.terms;
  }
  if (path.startsWith('/docs')) {
    return seoMetadata.docs;
  }
  if (path.startsWith('/news/')) {
    return seoMetadata.news;
  }
  
  // Default to home
  return seoMetadata.home;
};

