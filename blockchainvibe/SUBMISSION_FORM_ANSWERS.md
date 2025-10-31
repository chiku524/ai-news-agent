# Hackathon Submission Form - Quick Reference

Copy and paste these answers directly into the submission form:

---

## 📋 Form Fields

### Link to your submission (hackathon project's most useful link) *Required*
```
https://blockchainvibe.news
```

### Tweet Link:
```
(Leave blank or add if you have tweeted about the project)
```

### Project Title *Required*
```
BlockchainVibe - AI-Powered Blockchain News Aggregator
```

### Project Description *Required*
```
BlockchainVibe is an AI-powered blockchain news aggregation platform that leverages Fetch.ai uAgents and SingularityNET MeTTa Knowledge Graph to deliver intelligent, personalized news from the blockchain ecosystem.

Key Features:
- Autonomous News Processing: Two specialized Fetch.ai uAgents (News Fetcher and Relevance Scorer) continuously process and score blockchain news
- MeTTa Knowledge Graph Integration: Uses SingularityNET MeTTa for entity extraction, relationship mapping, and semantic understanding
- Personalized Recommendations: AI-driven personalization that learns from user behavior and interests
- Real-time Aggregation: Processes news from 50+ blockchain sources in real-time
- Chat Protocol Enabled: Agents registered on Agentverse and discoverable through ASI:One
- Cloudflare Edge Deployment: Built on Cloudflare Workers and Pages for global performance

Problem Solved:
Addresses information overload in the blockchain news ecosystem by providing intelligent curation, personalization, and real-time insights tailored to each user's interests.

Technologies Used:
- Fetch.ai uAgents Framework (News Fetcher Agent, Relevance Scorer Agent)
- SingularityNET MeTTa Knowledge Graph
- Chat Protocol / ASI:One
- Cloudflare Workers & Pages
- React, Node.js
```

### Project Github Link *Required*
```
https://github.com/chiku524/ai-news-agent
```

### Project Website:
```
https://blockchainvibe.news
```

### Did you submit this project to the official Cypherpunk Hackathon on Colosseum (Yes/No) *Required*?
```
No
```
*(Change to "Yes" if you submit to Colosseum - see instructions below)*

### Link to your Loom / Demo Video *Required*
```
https://www.youtube.com/watch?v=vVkr_wuyFSM
```

### Presentation link:
```
(Leave blank or add if you have a presentation)
```

### Project Twitter Profile Link:
```
(Leave blank or add Twitter/X profile if available)
```

### Fetch.ai Agent Address:
```
News Fetcher Agent:
- Agent ID: blockchainvibe-news-fetcher
- Seed: blockchainvibe_news_fetcher_2024
- Address: Generated deterministically from seed by uAgents framework at runtime
- Agentverse Registration: ✅ Registered with Chat Protocol enabled

Relevance Scorer Agent:
- Agent ID: blockchainvibe-relevance-scorer
- Seed: blockchainvibe_relevance_scorer_2024
- Address: Generated deterministically from seed by uAgents framework at runtime
- Agentverse Registration: ✅ Registered with Chat Protocol enabled

Note: Agent addresses are generated from seeds when agents start. Addresses are deterministic but only available when agents are running. Both agents are registered on Agentverse with Chat Protocol enabled for ASI:One discovery.
```

### Anything Else?:
```
Additional Notes:
- All agents are categorized under Innovation Lab (badges included in README)
- Comprehensive documentation available at https://blockchainvibe.news/docs
- Full API reference documentation included
- Agents are registered on Agentverse with Chat Protocol enabled
- Demo video demonstrates real-time agent communication and reasoning
- Project uses meaningful integration of Fetch.ai and SingularityNET technologies
- Live website demonstrates all features with real blockchain news aggregation
```

---

## 🏛️ Submitting to Colosseum Cypherpunk Hackathon

### Why Submit to Colosseum?
- **Additional Visibility**: Reach a wider audience and judges
- **Potential Additional Prizes**: Many hackathons have cross-platform prizes
- **Networking Opportunities**: Connect with more developers and projects
- **Community Access**: Join the Colosseum ecosystem

### How to Submit to Colosseum:

1. **Visit Colosseum Platform**
   - Go to: https://colosseum.org/
   - Navigate to the Cypherpunk Hackathon page
   - Register/login if needed

2. **Find Submission Form**
   - Look for "Submit Project" or "Project Submission" button
   - Usually in the hackathon dashboard or competition page

3. **Fill Out Form**
   - Use the same information from the form above
   - Ensure all links are publicly accessible
   - Include agent details and registration info

4. **Verify Before Submitting**
   - ✅ All links are working
   - ✅ GitHub repository is public
   - ✅ Demo video is accessible
   - ✅ Website is live and functional
   - ✅ Agents are registered on Agentverse (if required)

5. **After Submission**
   - Update the form answer: "Did you submit to Colosseum?" → Change to "Yes"
   - Keep submission details consistent across platforms
   - Monitor both platforms for updates or questions from judges

### Important Notes:
- Submit to both platforms (current hackathon + Colosseum) for maximum visibility
- Keep submission details consistent across platforms
- Ensure all links are working and publicly accessible
- Make sure agents are live and discoverable during the judging period
- Respond promptly to any judge questions or requests

---

## ✅ Pre-Submission Checklist

Before submitting, verify:

- [ ] GitHub repository is public and up-to-date
- [ ] Demo video is uploaded and accessible on YouTube
- [ ] Website is live and functional at https://blockchainvibe.news
- [ ] Documentation is accessible at https://blockchainvibe.news/docs
- [ ] All links in the form are tested and working
- [ ] Agents are registered on Agentverse (if required)
- [ ] README includes agent information and badges
- [ ] Project description accurately represents the project
- [ ] All required fields are filled out

---

## 📝 Agent Address Retrieval (Optional)

If you need the actual agent addresses (generated at runtime):

1. **Install uAgents**:
   ```bash
   pip install uagents
   ```

2. **Run Python script**:
   ```python
   from uagents import Agent
   
   # News Fetcher Agent
   news_fetcher = Agent(name="news_fetcher", seed="blockchainvibe_news_fetcher_2024")
   print(f"News Fetcher Agent Address: {news_fetcher.address}")
   
   # Relevance Scorer Agent
   relevance_scorer = Agent(name="relevance_scorer", seed="blockchainvibe_relevance_scorer_2024")
   print(f"Relevance Scorer Agent Address: {relevance_scorer.address}")
   ```

3. **Or run agents and check logs**:
   ```bash
   cd server/agents
   python news_fetcher_agent.py
   python relevance_scorer_agent.py
   ```
   Look for: `Agent address: <address>` in the startup logs

---

Good luck with your submission! 🚀

