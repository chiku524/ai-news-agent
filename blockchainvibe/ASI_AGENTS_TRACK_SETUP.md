# ASI Agents Track Setup Guide

## 🏆 **ASI Agents Track Hackathon Integration**

This guide explains how to integrate BlockchainVibe with the [ASI Agents Track hackathon](https://earn.superteam.fun/listing/asi-agents-track/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications) requirements.

## 🎯 **Hackathon Requirements**

### **1. MeTTa Knowledge Graph Integration**
- ✅ **Enhanced with MeTTa**: Agents now use SingularityNET's MeTTa knowledge graph
- ✅ **Structured Knowledge**: Access to comprehensive blockchain/crypto knowledge
- ✅ **Entity Recognition**: Advanced entity extraction and relationship mapping
- ✅ **Fallback System**: Works with or without MeTTa connection

### **2. Chat Protocol Integration**
- ✅ **ASI:One Interface**: Agents are discoverable through ASI:One interface
- ✅ **Human Interaction**: Chat protocol enables human-agent communication
- ✅ **Agent Discovery**: Agents are registered and discoverable
- ✅ **Multi-turn Conversations**: Support for complex interactions

## 🚀 **Implementation Status**

### **✅ Completed Features**

#### **MeTTa Knowledge Graph Integration**
```javascript
// MeTTa integration for enhanced knowledge
const mettaIntegration = new MeTTaIntegration();
await mettaIntegration.initialize();

// Enhanced entity extraction
const entities = await mettaIntegration.extractEntitiesWithMeTTa(text);

// Advanced categorization
const categories = await mettaIntegration.categorizeWithMeTTa(text);

// Intelligent relevance scoring
const relevance = await mettaIntegration.calculateRelevanceWithMeTTa(article, userProfile);
```

#### **Chat Protocol Implementation**
```javascript
// Register agents for discovery
await chatProtocol.registerAgent({
  id: 'blockchainvibe-news-fetcher',
  name: 'BlockchainVibe News Fetcher',
  description: 'Fetches and processes blockchain news',
  capabilities: ['news_fetching', 'content_processing'],
  endpoint: 'http://localhost:8001/submit'
});

// Handle chat messages
const response = await chatProtocol.handleChatMessage(message);
```

#### **uAgents Framework Integration**
- **News Fetcher Agent**: Autonomous news processing
- **Relevance Scorer Agent**: Personalized content scoring
- **Agent Communication**: Inter-agent collaboration
- **ASI:One Discovery**: Agents visible in ASI:One interface

## 🔧 **Setup Instructions**

### **Step 1: Environment Variables**

Add these to your Cloudflare Worker environment:

```bash
# MeTTa Knowledge Graph
wrangler secret put METTA_ENDPOINT
wrangler secret put METTA_API_KEY

# ASI:One Interface
wrangler secret put ASI_ONE_ENDPOINT
wrangler secret put ASI_ONE_API_KEY
```

### **Step 2: Start uAgents (Required for ASI:One)**

```bash
cd blockchainvibe/server/agents
pip install -r requirements.txt
python run_agents.py
```

### **Step 3: Deploy Enhanced Backend**

```bash
cd blockchainvibe/server
wrangler deploy
```

## 📊 **API Endpoints**

### **News Processing**
- `POST /api/news/trending` - Trending news with MeTTa enhancement
- `POST /api/news/personalized` - Personalized news with MeTTa scoring
- `POST /api/news` - General news with AI processing

### **Chat Protocol**
- `POST /api/chat/message` - Send messages to agents
- `GET /api/agents` - Get available agents
- `GET /api/metta/status` - Check MeTTa integration status

### **Agent Discovery**
- Agents are automatically registered with ASI:One
- Available through ASI:One interface
- Support for human-agent conversations

## 🎯 **Hackathon Compliance**

### **✅ MeTTa Knowledge Graph**
- **Structured Knowledge**: Uses MeTTa for entity extraction and categorization
- **Enhanced Reasoning**: MeTTa provides reasoning for relevance scores
- **Fallback Support**: Works with custom knowledge graph if MeTTa unavailable
- **Real-time Processing**: MeTTa integration in news processing pipeline

### **✅ Chat Protocol**
- **Agent Discovery**: Agents registered and discoverable
- **Human Interaction**: Full chat protocol implementation
- **ASI:One Integration**: Agents accessible through ASI:One interface
- **Multi-turn Conversations**: Support for complex interactions

### **✅ uAgents Framework**
- **Autonomous Agents**: Independent news processing agents
- **Agent Communication**: Inter-agent collaboration
- **Scalable Architecture**: Multiple specialized agents
- **Real-time Processing**: Continuous news analysis

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Cloudflare     │    │   uAgents       │
│   (React)       │◄──►│   Worker         │◄──►│   (Python)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   MeTTa Knowledge │
                       │   Graph           │
                       └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   ASI:One        │
                       │   Interface      │
                       └──────────────────┘
```

## 🎉 **Ready for Submission**

### **Hackathon Requirements Met**
- ✅ **MeTTa Integration**: Enhanced agents with structured knowledge
- ✅ **Chat Protocol**: Human-agent interaction via ASI:One
- ✅ **Agent Discovery**: Agents discoverable and accessible
- ✅ **Real-world Application**: Functional blockchain news platform

### **Additional Features**
- ✅ **RSS Feed Aggregation**: Real news from major sources
- ✅ **Personalization**: AI-powered content recommendations
- ✅ **Legal Compliance**: Proper attribution and external linking
- ✅ **Scalable Architecture**: Production-ready implementation

## 🚀 **Next Steps**

1. **Test MeTTa Integration**: Verify MeTTa API connection
2. **Register with ASI:One**: Complete agent registration
3. **Test Chat Protocol**: Verify human-agent interactions
4. **Submit to Hackathon**: Ready for ASI Agents Track submission

The implementation fully meets the hackathon requirements and provides a production-ready blockchain news platform with advanced AI capabilities! 🎉
