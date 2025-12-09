import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'BlockchainVibe - AI-Powered Blockchain News Aggregator',
  description = 'AI-powered blockchain news platform with intelligent personalization using Fetch.ai uAgents and SingularityNET MeTTa Knowledge Graph. Stay ahead with real-time blockchain news tailored to your interests.',
  keywords = 'blockchain news, crypto news, AI news aggregator, Fetch.ai, uAgents, SingularityNET, MeTTa, blockchain intelligence, cryptocurrency news, DeFi news, NFT news, Solana news',
  image = 'https://blockchainvibe.news/logo.svg',
  url = 'https://blockchainvibe.news',
  type = 'website',
  author = 'BlockchainVibe',
  siteName = 'BlockchainVibe'
}) => {
  const fullTitle = title.includes('BlockchainVibe') ? title : `${title} | BlockchainVibe`;
  const fullUrl = url.startsWith('http') ? url : `https://blockchainvibe.news${url}`;
  const fullImage = image.startsWith('http') ? image : `https://blockchainvibe.news${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@blockchainvibe" />
      <meta name="twitter:site" content="@blockchainvibe" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="BlockchainVibe" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/logo192.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
    </Helmet>
  );
};

export default SEO;

