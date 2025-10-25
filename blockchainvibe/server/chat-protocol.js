// Chat Protocol Integration for ASI:One Interface
// This module implements the Chat Protocol for agent discovery and human interaction

export class ChatProtocolIntegration {
  constructor() {
    this.agents = new Map();
    this.conversations = new Map();
    this.asiOneEndpoint = process.env.ASI_ONE_ENDPOINT || 'https://asi.one/api';
    this.apiKey = process.env.ASI_ONE_API_KEY;
  }

  // Register agent for discovery
  async registerAgent(agentConfig) {
    const agentInfo = {
      id: agentConfig.id,
      name: agentConfig.name,
      description: agentConfig.description,
      capabilities: agentConfig.capabilities || [],
      endpoint: agentConfig.endpoint,
      status: 'active',
      registered_at: new Date().toISOString(),
      metadata: {
        version: agentConfig.version || '1.0.0',
        author: agentConfig.author || 'BlockchainVibe',
        category: agentConfig.category || 'news',
        tags: agentConfig.tags || ['blockchain', 'news', 'ai']
      }
    };

    this.agents.set(agentConfig.id, agentInfo);

    // Register with ASI:One if available
    if (this.apiKey) {
      try {
        await this.registerWithASIOne(agentInfo);
      } catch (error) {
        console.warn('Failed to register with ASI:One:', error.message);
      }
    }

    return agentInfo;
  }

  // Register agent with ASI:One platform
  async registerWithASIOne(agentInfo) {
    const response = await fetch(`${this.asiOneEndpoint}/agents/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: agentInfo.id,
        name: agentInfo.name,
        description: agentInfo.description,
        capabilities: agentInfo.capabilities,
        endpoint: agentInfo.endpoint,
        metadata: agentInfo.metadata
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Agent ${agentInfo.name} registered with ASI:One`);
      return result;
    } else {
      throw new Error(`ASI:One registration failed: ${response.status}`);
    }
  }

  // Handle chat protocol messages
  async handleChatMessage(message, context = {}) {
    const { agent_id, user_id, message_type, content, conversation_id } = message;

    // Create or get conversation
    const conversation = this.getOrCreateConversation(conversation_id, user_id);
    
    // Add message to conversation
    conversation.messages.push({
      id: this.generateMessageId(),
      agent_id,
      user_id,
      message_type,
      content,
      timestamp: new Date().toISOString(),
      context
    });

    // Process message based on type
    switch (message_type) {
      case 'text':
        return await this.handleTextMessage(message, conversation);
      case 'query':
        return await this.handleQueryMessage(message, conversation);
      case 'command':
        return await this.handleCommandMessage(message, conversation);
      case 'feedback':
        return await this.handleFeedbackMessage(message, conversation);
      default:
        return await this.handleGenericMessage(message, conversation);
    }
  }

  // Handle text messages
  async handleTextMessage(message, conversation) {
    const agent = this.agents.get(message.agent_id);
    if (!agent) {
      return this.createErrorResponse('Agent not found', message);
    }

    // Process the text message
    const response = await this.processTextMessage(message.content, conversation);
    
    return {
      message_id: this.generateMessageId(),
      agent_id: message.agent_id,
      user_id: message.user_id,
      message_type: 'text',
      content: response.content,
      metadata: response.metadata,
      timestamp: new Date().toISOString()
    };
  }

  // Handle query messages
  async handleQueryMessage(message, conversation) {
    const agent = this.agents.get(message.agent_id);
    if (!agent) {
      return this.createErrorResponse('Agent not found', message);
    }

    // Process the query
    const queryResult = await this.processQuery(message.content, conversation);
    
    return {
      message_id: this.generateMessageId(),
      agent_id: message.agent_id,
      user_id: message.user_id,
      message_type: 'query_response',
      content: queryResult.content,
      data: queryResult.data,
      metadata: queryResult.metadata,
      timestamp: new Date().toISOString()
    };
  }

  // Handle command messages
  async handleCommandMessage(message, conversation) {
    const agent = this.agents.get(message.agent_id);
    if (!agent) {
      return this.createErrorResponse('Agent not found', message);
    }

    // Process the command
    const commandResult = await this.processCommand(message.content, conversation);
    
    return {
      message_id: this.generateMessageId(),
      agent_id: message.agent_id,
      user_id: message.user_id,
      message_type: 'command_response',
      content: commandResult.content,
      status: commandResult.status,
      metadata: commandResult.metadata,
      timestamp: new Date().toISOString()
    };
  }

  // Handle feedback messages
  async handleFeedbackMessage(message, conversation) {
    // Process user feedback
    const feedbackResult = await this.processFeedback(message.content, conversation);
    
    return {
      message_id: this.generateMessageId(),
      agent_id: message.agent_id,
      user_id: message.user_id,
      message_type: 'feedback_response',
      content: feedbackResult.content,
      metadata: feedbackResult.metadata,
      timestamp: new Date().toISOString()
    };
  }

  // Process text message content
  async processTextMessage(content, conversation) {
    // Simple text processing - can be enhanced with NLP
    const response = {
      content: `I understand you said: "${content}". How can I help you with blockchain news?`,
      metadata: {
        processing_time: Date.now() - conversation.created_at,
        message_count: conversation.messages.length
      }
    };

    return response;
  }

  // Process query
  async processQuery(query, conversation) {
    // Process user query for news or information
    const response = {
      content: `Processing your query: "${query}"`,
      data: {
        query: query,
        results: [],
        suggestions: []
      },
      metadata: {
        query_type: 'news_search',
        processing_time: Date.now()
      }
    };

    return response;
  }

  // Process command
  async processCommand(command, conversation) {
    // Process user commands
    const response = {
      content: `Executing command: "${command}"`,
      status: 'success',
      metadata: {
        command: command,
        execution_time: Date.now()
      }
    };

    return response;
  }

  // Process feedback
  async processFeedback(feedback, conversation) {
    // Process user feedback
    const response = {
      content: `Thank you for your feedback: "${feedback}"`,
      metadata: {
        feedback: feedback,
        processed_at: Date.now()
      }
    };

    return response;
  }

  // Get or create conversation
  getOrCreateConversation(conversationId, userId) {
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, {
        id: conversationId,
        user_id: userId,
        created_at: Date.now(),
        messages: [],
        status: 'active'
      });
    }
    return this.conversations.get(conversationId);
  }

  // Generate message ID
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create error response
  createErrorResponse(error, originalMessage) {
    return {
      message_id: this.generateMessageId(),
      agent_id: originalMessage.agent_id,
      user_id: originalMessage.user_id,
      message_type: 'error',
      content: `Error: ${error}`,
      timestamp: new Date().toISOString()
    };
  }

  // Get available agents
  getAvailableAgents() {
    return Array.from(this.agents.values()).filter(agent => agent.status === 'active');
  }

  // Get agent by ID
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  // Get conversation history
  getConversationHistory(conversationId) {
    return this.conversations.get(conversationId);
  }

  // Update agent status
  updateAgentStatus(agentId, status) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.updated_at = new Date().toISOString();
    }
  }

  // Get chat protocol statistics
  getStats() {
    return {
      total_agents: this.agents.size,
      active_agents: this.getAvailableAgents().length,
      total_conversations: this.conversations.size,
      total_messages: Array.from(this.conversations.values())
        .reduce((total, conv) => total + conv.messages.length, 0)
    };
  }
}
