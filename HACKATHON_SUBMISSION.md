# Hackathon Submission Form - BlockchainVibe

## Form Fields

### Link to your submission (hackathon project's most useful link)
**Answer**: https://blockchainvibe.news

This is the live, fully functional website where judges can test the platform with all features including:
- OAuth authentication
- AI-powered news aggregation
- Personalized recommendations
- Real-time trending news
- User analytics
- Chat Protocol integration

### Tweet Link
**Answer**: (Optional - Leave blank or add if you have tweeted about the project)

### Project Title
**Answer**: BlockchainVibe - AI-Powered Blockchain News Aggregator

### Project Description
**Answer**:

BlockchainVibe is an AI-powered blockchain news aggregation platform that leverages Fetch.ai uAgents and SingularityNET MeTTa Knowledge Graph to deliver intelligent, personalized news from the blockchain ecosystem.

**Key Features:**
- **Autonomous News Processing**: Two specialized Fetch.ai uAgents (News Fetcher and Relevance Scorer) continuously process and score blockchain news
- **MeTTa Knowledge Graph Integration**: Uses SingularityNET MeTTa for entity extraction, relationship mapping, and semantic understanding
- **Personalized Recommendations**: AI-driven personalization that learns from user behavior and interests
- **Real-time Aggregation**: Processes news from 50+ blockchain sources in real-time
- **Chat Protocol Enabled**: Agents registered on Agentverse and discoverable through ASI:One
- **Cloudflare Edge Deployment**: Built on Cloudflare Workers and Pages for global performance

**Problem Solved:**
Addresses information overload in the blockchain news ecosystem by providing intelligent curation, personalization, and real-time insights tailored to each user's interests.

**Technologies Used:**
- Fetch.ai uAgents Framework (News Fetcher Agent, Relevance Scorer Agent)
- SingularityNET MeTTa Knowledge Graph
- Chat Protocol / ASI:One
- Cloudflare Workers & Pages
- React, Node.js

### Project Github Link
**Answer**: https://github.com/chiku524/ai-news-agent

### Project Website
**Answer**: https://blockchainvibe.news

### Did you submit this project to the official Cypherpunk Hackathon on Colosseum?
**Answer**: No (or Yes, if you submit it)

**Note**: See instructions below for submitting to Colosseum.

### Link to your Loom / Demo Video
**Answer**: https://www.youtube.com/watch?v=9MMPRB8rj-0

### Presentation link
**Answer**: (Optional - Leave blank or add if you have a presentation)

### Project Twitter Profile Link
**Answer**: (Optional - Leave blank or add Twitter/X profile if available)

### Fetch.ai Agent Address
**Answer**:

**News Fetcher Agent:**
- Agent ID: `blockchainvibe-news-fetcher`
- Seed: `blockchainvibe_news_fetcher_2024`
- Address: Generated deterministically from seed by uAgents framework at runtime
- To get the actual address, run: `python server/agents/news_fetcher_agent.py` and check the startup log for the agent address

**Relevance Scorer Agent:**
- Agent ID: `blockchainvibe-relevance-scorer`
- Seed: `blockchainvibe_relevance_scorer_2024`
- Address: Generated deterministically from seed by uAgents framework at runtime
- To get the actual address, run: `python server/agents/relevance_scorer_agent.py` and check the startup log for the agent address

**Note**: Agent addresses are generated from seeds when the agents start. The addresses are deterministic but only available when agents are running. Both agents are registered on Agentverse with Chat Protocol enabled for ASI:One discovery.

### Anything Else?
**Answer**:

**Additional Notes:**
- All agents are categorized under Innovation Lab (badges included in README)
- Comprehensive documentation available in `/docs` directory
- Full API reference documentation included
- Agents are registered on Agentverse with Chat Protocol enabled
- Demo video demonstrates real-time agent communication and reasoning
- Project uses meaningful integration of Fetch.ai and SingularityNET technologies
- Live website demonstrates all features with real blockchain news aggregation

---

## Cypherpunk Hackathon on Colosseum Submission Guide

### Step 1: Access Colosseum Platform
1. Visit: https://colosseum.org/
2. Navigate to the Cypherpunk Hackathon page
3. Register/login to the platform if needed

### Step 2: Submit Your Project
1. Find the project submission form on Colosseum
2. Fill out all required fields:
   - Project name: BlockchainVibe
   - Description: (Use the same description as above)
   - GitHub link: https://github.com/chiku524/ai-news-agent
   - Demo video: https://www.youtube.com/watch?v=9MMPRB8rj-0
   - Website: https://blockchainvibe.news
   - Category: Innovation Lab / AI Agents Track
   - Agent details: Include both agent IDs and addresses (if available)

### Step 3: Verify Agent Registration
1. Ensure agents are registered on Agentverse
2. Verify Chat Protocol is enabled
3. Document agent addresses (run agents to get addresses)

### Step 4: Benefits of Colosseum Submission
- Additional visibility for the project
- Potential for additional prizes
- Networking opportunities
- Access to Colosseum community resources
- Cross-platform exposure

### Important Notes:
- Submit to both platforms (current hackathon + Colosseum) for maximum visibility
- Keep submission details consistent across platforms
- Ensure all links are working and publicly accessible
- Make sure agents are live and discoverable during the judging period

