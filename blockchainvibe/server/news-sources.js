// News Sources Configuration for BlockchainVibe
// This file defines RSS feeds and API endpoints for news aggregation

export const NEWS_SOURCES = {
  // RSS Feeds (Free and Legal)
  RSS_FEEDS: [
    {
      name: "CoinDesk",
      url: "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml",
      category: "general",
      priority: 1,
      enabled: true
    },
    {
      name: "CoinTelegraph",
      url: "https://cointelegraph.com/rss",
      category: "general", 
      priority: 1,
      enabled: true
    },
    {
      name: "Decrypt",
      url: "https://decrypt.co/feed",
      category: "general",
      priority: 1,
      enabled: true
    },
    {
      name: "The Block",
      url: "https://www.theblock.co/rss.xml",
      category: "general",
      priority: 1,
      enabled: true
    },
    {
      name: "CryptoSlate",
      url: "https://cryptoslate.com/feed/",
      category: "general",
      priority: 2,
      enabled: true
    },
    {
      name: "Bitcoin Magazine",
      url: "https://bitcoinmagazine.com/rss",
      category: "bitcoin",
      priority: 2,
      enabled: true
    },
    {
      name: "Ethereum Foundation",
      url: "https://blog.ethereum.org/feed.xml",
      category: "ethereum",
      priority: 2,
      enabled: true
    }
  ],

  // News APIs (Paid Services)
  NEWS_APIS: [
    {
      name: "NewsAPI",
      url: "https://newsapi.org/v2/everything",
      apiKey: process.env.NEWSAPI_KEY,
      enabled: false, // Enable when you have API key
      rateLimit: 1000, // requests per day
      cost: "Free tier: 1000 requests/day"
    },
    {
      name: "GNews",
      url: "https://gnews.io/api/v4/search",
      apiKey: process.env.GNEWS_API_KEY,
      enabled: false, // Enable when you have API key
      rateLimit: 100, // requests per day
      cost: "Free tier: 100 requests/day"
    },
    {
      name: "CryptoPanic",
      url: "https://cryptopanic.com/api/v1/posts/",
      apiKey: process.env.CRYPTOPANIC_API_KEY,
      enabled: false, // Enable when you have API key
      rateLimit: 1000, // requests per day
      cost: "Free tier: 1000 requests/day"
    }
  ],

  // Reddit API (for community sentiment)
  REDDIT_SOURCES: [
    {
      name: "r/CryptoCurrency",
      subreddit: "CryptoCurrency",
      enabled: false, // Requires Reddit API setup
      priority: 3
    },
    {
      name: "r/ethereum", 
      subreddit: "ethereum",
      enabled: false,
      priority: 3
    },
    {
      name: "r/defi",
      subreddit: "defi", 
      enabled: false,
      priority: 3
    }
  ]
};

// Categories for content classification
export const NEWS_CATEGORIES = {
  "general": "General Crypto News",
  "bitcoin": "Bitcoin",
  "ethereum": "Ethereum", 
  "defi": "DeFi",
  "nft": "NFTs",
  "layer2": "Layer 2",
  "web3": "Web3",
  "gaming": "Gaming",
  "regulation": "Regulation",
  "trading": "Trading",
  "mining": "Mining"
};

// Keywords for content filtering and categorization
export const CATEGORY_KEYWORDS = {
  "bitcoin": ["bitcoin", "btc", "satoshi", "lightning network"],
  "ethereum": ["ethereum", "eth", "ethereum 2.0", "eth2", "beacon chain"],
  "defi": ["defi", "decentralized finance", "yield farming", "liquidity", "uniswap", "compound"],
  "nft": ["nft", "non-fungible token", "opensea", "art", "collectible"],
  "layer2": ["layer 2", "polygon", "arbitrum", "optimism", "rollup"],
  "web3": ["web3", "metaverse", "dapp", "dapps"],
  "gaming": ["gaming", "play-to-earn", "p2e", "axie", "sandbox"],
  "regulation": ["regulation", "sec", "cftc", "compliance", "legal"],
  "trading": ["trading", "exchange", "binance", "coinbase", "price"],
  "mining": ["mining", "miner", "hashrate", "difficulty"]
};
