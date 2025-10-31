# Fetch.ai Agent Addresses

## How to Get Agent Addresses

Agent addresses in Fetch.ai uAgents are generated deterministically from the seed when the agent is initialized. To get the actual agent addresses, you need to run the agents.

### Method 1: Run Agents and Check Logs

1. **News Fetcher Agent Address:**
   ```bash
   cd blockchainvibe/server/agents
   python news_fetcher_agent.py
   ```
   Look for the log line: `Agent address: <address>`

2. **Relevance Scorer Agent Address:**
   ```bash
   cd blockchainvibe/server/agents
   python relevance_scorer_agent.py
   ```
   Look for the log line: `Agent address: <address>`

### Method 2: Python Script to Get Addresses

Create a script to get addresses without fully starting agents:

```python
from uagents import Agent

# News Fetcher Agent
news_fetcher = Agent(name="news_fetcher", seed="blockchainvibe_news_fetcher_2024")
print(f"News Fetcher Agent Address: {news_fetcher.address}")

# Relevance Scorer Agent
relevance_scorer = Agent(name="relevance_scorer", seed="blockchainvibe_relevance_scorer_2024")
print(f"Relevance Scorer Agent Address: {relevance_scorer.address}")
```

### Agent Information for Submission

**News Fetcher Agent:**
- **Agent ID**: `blockchainvibe-news-fetcher`
- **Name**: BlockchainVibe News Fetcher
- **Seed**: `blockchainvibe_news_fetcher_2024`
- **Address**: (Generated from seed - run agent to get address)
- **Endpoint**: `http://localhost:8001/submit` (dev) / Production endpoint via Cloudflare Workers

**Relevance Scorer Agent:**
- **Agent ID**: `blockchainvibe-relevance-scorer`
- **Name**: BlockchainVibe Relevance Scorer
- **Seed**: `blockchainvibe_relevance_scorer_2024`
- **Address**: (Generated from seed - run agent to get address)
- **Endpoint**: `http://localhost:8003/submit` (dev) / Production endpoint via Cloudflare Workers

### Note for Hackathon Submission

If you cannot run the agents before submission, you can specify:
- **Seeds**: `blockchainvibe_news_fetcher_2024` and `blockchainvibe_relevance_scorer_2024`
- **Explanation**: "Agent addresses are generated deterministically from seeds using Fetch.ai uAgents framework. Addresses are available when agents are running and logged at startup. Both agents are registered on Agentverse with Chat Protocol enabled."

