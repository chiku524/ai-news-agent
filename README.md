# 🚀 BlockchainVibe

A modern, AI-powered blockchain news aggregator with OAuth authentication and Cloudflare deployment. Feel the vibe of blockchain intelligence!

## ✨ Features

- **🔐 OAuth Authentication**: Google, GitHub, and X (Twitter) login
- **🤖 AI-Powered News**: Fetch.ai uAgents for intelligent news gathering
- **🧠 Knowledge Graph**: SingularityNET MeTTa for relevance scoring
- **📰 Smart Aggregation**: Personalized news based on user interests
- **🌙 Dark/Light Theme**: Beautiful, responsive UI
- **☁️ Cloudflare Ready**: Optimized for Cloudflare Pages and Workers
- **🗄️ Database Integration**: User data persistence with SQLite/D1
- **📱 Mobile Responsive**: Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-news-agent
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   # Copy environment files
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   
   # Edit with your OAuth credentials
   nano client/.env
   nano server/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

## 🔧 Configuration

### OAuth Setup

1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized origins: `http://localhost:3000`
   - Add redirect URI: `http://localhost:3000/auth/callback`

2. **GitHub OAuth**:
   - Go to [GitHub OAuth Apps](https://github.com/settings/developers)
   - Create new OAuth App
   - Set callback URL: `http://localhost:3000/auth/callback`

3. **X (Twitter) OAuth**:
   - Go to [Twitter Developer Portal](https://developer.twitter.com/)
   - Create new app
   - Set callback URL: `http://localhost:3000/auth/callback`

### Environment Variables

**Frontend (`client/.env`)**:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_TWITTER_CLIENT_ID=your_twitter_client_id
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/callback
REACT_APP_API_URL=http://localhost:8000
```

**Backend (`server/.env`)**:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
JWT_SECRET=your_jwt_secret
DATABASE_URL=sqlite:///./ai_news_agent.db
```

## ☁️ Cloudflare Deployment

### Prerequisites
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

### Deploy Backend (Workers)

1. **Create D1 Database**
   ```bash
   wrangler d1 create ai-news-agent-db
   ```

2. **Set environment variables**
   ```bash
   wrangler secret put GOOGLE_CLIENT_ID
   wrangler secret put GOOGLE_CLIENT_SECRET
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   wrangler secret put TWITTER_CLIENT_ID
   wrangler secret put TWITTER_CLIENT_SECRET
   wrangler secret put JWT_SECRET
   ```

3. **Deploy Worker**
   ```bash
   cd server
   wrangler deploy
   ```

### Deploy Frontend (Pages)

1. **Connect to Cloudflare Pages**
   - Go to Cloudflare Pages dashboard
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set build output: `client/build`

2. **Set environment variables**
   - Add all `REACT_APP_*` variables
   - Set `REACT_APP_API_URL` to your Worker URL

3. **Deploy**
   - Click "Save and Deploy"

## 📁 Project Structure

```
ai-news-agent/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── styles/         # Styled components
│   └── package.json
├── server/                 # FastAPI backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── worker.js           # Cloudflare Worker
│   └── requirements.txt
├── wrangler.toml           # Cloudflare Workers config
├── cloudflare-pages.toml   # Cloudflare Pages config
└── README.md
```

## 🤖 AI Integration

### Fetch.ai uAgents
The webapp uses Fetch.ai's uAgents framework for intelligent news gathering:
- **News Agent**: Fetches news from multiple blockchain sources
- **Relevance Scoring**: Calculates relevance based on blockchain keywords
- **Real-time Processing**: Asynchronous news aggregation
- **Source Diversity**: Multiple RSS feeds and news APIs

### SingularityNET MeTTa
Integration with SingularityNET's MeTTa knowledge graph:
- **Knowledge Graph**: Blockchain entity relationships
- **User Profiling**: Personalized relevance scoring
- **Entity Extraction**: NLP-based content analysis
- **Sentiment Analysis**: News sentiment evaluation

### How It Works
1. **News Gathering**: uAgents fetch news from blockchain sources
2. **Entity Extraction**: MeTTa extracts blockchain entities and relationships
3. **Relevance Scoring**: User-specific relevance based on interests and history
4. **Personalization**: News ranked by user relevance and MeTTa insights

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run client` - Start only frontend
- `npm run server` - Start only backend
- `npm run build` - Build for production
- `npm run deploy:worker` - Deploy to Cloudflare Workers
- `npm run deploy:pages` - Deploy to Cloudflare Pages

### Tech Stack

**Frontend**:
- React 18
- Styled Components
- Framer Motion
- React Router
- React Query
- Lucide React

**Backend**:
- FastAPI
- SQLAlchemy
- PyJWT
- httpx

**AI & ML**:
- Fetch.ai uAgents (News gathering)
- SingularityNET MeTTa (Knowledge graph)
- NLTK (Natural language processing)
- Scikit-learn (Machine learning)

**Cloudflare**:
- Workers (Backend)
- Pages (Frontend)
- D1 (Database)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the blockchain community**