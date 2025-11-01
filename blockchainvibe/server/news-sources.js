// News Sources Configuration for BlockchainVibe
// This file defines RSS feeds and API endpoints for news aggregation

export const NEWS_SOURCES = {
  // RSS Feeds (Free and Legal - No API Keys Required)
  RSS_FEEDS: [
    // Tier 1: Major General News Sources (Highest Priority)
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
      priority: 1,
      enabled: true
    },
    {
      name: "Blockworks",
      url: "https://blockworks.co/feed",
      category: "general",
      priority: 1,
      enabled: true
    },
    {
      name: "The Defiant",
      url: "https://thedefiant.io/feed",
      category: "defi",
      priority: 1,
      enabled: true
    },
    {
      name: "Messari",
      url: "https://messari.io/rss",
      category: "general",
      priority: 1,
      enabled: true
    },
    
    // Tier 2: Specialized and Regional Sources
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
    },
    {
      name: "BeInCrypto",
      url: "https://beincrypto.com/feed/",
      category: "general",
      priority: 2,
      enabled: true
    },
    {
      name: "UToday",
      url: "https://u.today/rss",
      category: "general",
      priority: 2,
      enabled: true
    },
    {
      name: "AMBCrypto",
      url: "https://ambcrypto.com/feed/",
      category: "general",
      priority: 2,
      enabled: true
    },
    {
      name: "CryptoPotato",
      url: "https://cryptopotato.com/feed/",
      category: "general",
      priority: 2,
      enabled: true
    },
    {
      name: "CoinJournal",
      url: "https://coinjournal.net/feed/",
      category: "general",
      priority: 2,
      enabled: true
    },
    {
      name: "Crypto Briefing",
      url: "https://cryptobriefing.com/feed/",
      category: "general",
      priority: 2,
      enabled: true
    },
    {
      name: "Crypto News",
      url: "https://cryptonews.com/feed/",
      category: "general",
      priority: 2,
      enabled: true
    },
    
    // Tier 3: Platform-Specific and Technical Sources
    {
      name: "Polkadot Blog",
      url: "https://polkadot.network/blog/feed/",
      category: "web3",
      priority: 3,
      enabled: true
    },
    {
      name: "Solana Foundation",
      url: "https://solana.com/news/rss.xml",
      category: "web3",
      priority: 3,
      enabled: true
    },
    {
      name: "Polygon Blog",
      url: "https://blog.polygon.technology/feed/",
      category: "layer2",
      priority: 3,
      enabled: true
    },
    {
      name: "Arbitrum Blog",
      url: "https://arbitrum.io/blog/feed/",
      category: "layer2",
      priority: 3,
      enabled: true
    },
    {
      name: "Optimism Blog",
      url: "https://optimism.io/feed",
      category: "layer2",
      priority: 3,
      enabled: true
    },
    {
      name: "Uniswap Blog",
      url: "https://uniswap.org/blog/feed.xml",
      category: "defi",
      priority: 3,
      enabled: true
    },
    {
      name: "Chainlink Blog",
      url: "https://blog.chain.link/feed/",
      category: "defi",
      priority: 3,
      enabled: true
    },
    
    // Tier 4: Additional Quality Sources
    {
      name: "CoinGape",
      url: "https://coingape.com/feed/",
      category: "general",
      priority: 4,
      enabled: true
    },
    {
      name: "NewsBTC",
      url: "https://www.newsbtc.com/feed/",
      category: "general",
      priority: 4,
      enabled: true
    },
    {
      name: "CryptoCompare",
      url: "https://www.cryptocompare.com/rss/news/",
      category: "general",
      priority: 4,
      enabled: true
    },
    {
      name: "Bitcoinist",
      url: "https://bitcoinist.com/feed/",
      category: "bitcoin",
      priority: 4,
      enabled: true
    },
    {
      name: "Ethereum World News",
      url: "https://ethereumworldnews.com/feed/",
      category: "ethereum",
      priority: 4,
      enabled: true
    },
    {
      name: "DeFi Pulse",
      url: "https://defipulse.com/blog/rss",
      category: "defi",
      priority: 4,
      enabled: true
    }
  ],

  // News APIs (Paid Services)
  NEWS_APIS: [
    {
      name: "NewsAPI",
      url: "https://newsapi.org/v2/everything",
      apiKey: null, // Set in wrangler.toml if needed
      enabled: false, // Enable when you have API key
      rateLimit: 1000, // requests per day
      cost: "Free tier: 1000 requests/day"
    },
    {
      name: "GNews",
      url: "https://gnews.io/api/v4/search",
      apiKey: null, // Set in wrangler.toml if needed
      enabled: false, // Enable when you have API key
      rateLimit: 100, // requests per day
      cost: "Free tier: 100 requests/day"
    },
    {
      name: "CryptoPanic",
      url: "https://cryptopanic.com/api/v1/posts/",
      apiKey: null, // Set in wrangler.toml if needed
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
  "mining": "Mining",
  "solana": "Solana",
  "cardano": "Cardano",
  "polkadot": "Polkadot"
};

// Keywords for content filtering and categorization
export const CATEGORY_KEYWORDS = {
  "bitcoin": ["bitcoin", "btc", "satoshi", "lightning network", "bitcoin etf", "halving"],
  "ethereum": ["ethereum", "eth", "ethereum 2.0", "eth2", "beacon chain", "eth merge", "shanghai"],
  "defi": ["defi", "decentralized finance", "yield farming", "liquidity", "uniswap", "compound", "aave", "maker", "curve"],
  "nft": ["nft", "non-fungible token", "opensea", "art", "collectible", "nft marketplace"],
  "layer2": ["layer 2", "polygon", "arbitrum", "optimism", "rollup", "l2", "zk-rollup", "sidechain"],
  "web3": ["web3", "metaverse", "dapp", "dapps", "blockchain app"],
  "gaming": ["gaming", "play-to-earn", "p2e", "axie", "sandbox", "web3 gaming", "gamefi"],
  "regulation": ["regulation", "sec", "cftc", "compliance", "legal", "regulatory", "sec approval"],
  "trading": ["trading", "exchange", "binance", "coinbase", "price", "market", "crypto exchange"],
  "mining": ["mining", "miner", "hashrate", "difficulty", "proof of work"],
  "solana": ["solana", "sol", "phantom", "solana ecosystem"],
  "cardano": ["cardano", "ada", "plutus", "alonzo"],
  "polkadot": ["polkadot", "dot", "parachain", "kusama"]
};
