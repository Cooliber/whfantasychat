import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Simple in-memory storage for demo (in production, use a database)
const clients = new Map<string, any>();
const conversations = new Map<string, any[]>();

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const path = event.path;
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};

    // Handle different WebSocket-like operations
    switch (method) {
      case 'POST':
        if (path.includes('/connect')) {
          return handleConnect(body, headers);
        } else if (path.includes('/send-message')) {
          return handleSendMessage(body, headers);
        } else if (path.includes('/start-conversation')) {
          return handleStartConversation(body, headers);
        }
        break;

      case 'GET':
        if (path.includes('/poll')) {
          return handlePoll(queryParams, headers);
        } else if (path.includes('/status')) {
          return handleStatus(headers);
        }
        break;
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };

  } catch (error) {
    console.error('WebSocket fallback error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

function handleConnect(body: any, headers: any) {
  const clientId = body.clientId || generateClientId();
  
  clients.set(clientId, {
    id: clientId,
    currentScene: body.currentScene || 'Cichy Wieczór',
    connectedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  });

  conversations.set(clientId, []);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      type: 'welcome',
      clientId: clientId,
      message: 'Connected to Warhammer Fantasy Tavern',
      timestamp: new Date().toISOString()
    }),
  };
}

function handleSendMessage(body: any, headers: any) {
  const { clientId, characterId, message, scene } = body;
  
  if (!clients.has(clientId)) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Client not found' }),
    };
  }

  // Update client activity
  const client = clients.get(clientId);
  client.lastActivity = new Date().toISOString();
  clients.set(clientId, client);

  // Add message to conversation
  const messageData = {
    id: generateMessageId(),
    type: 'player-message',
    clientId,
    characterId,
    message,
    scene,
    timestamp: new Date().toISOString()
  };

  if (!conversations.has(clientId)) {
    conversations.set(clientId, []);
  }
  conversations.get(clientId)!.push(messageData);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      messageId: messageData.id,
      timestamp: messageData.timestamp
    }),
  };
}

function handleStartConversation(body: any, headers: any) {
  const { clientId, scene, participantIds, theme } = body;
  
  if (!clients.has(clientId)) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Client not found' }),
    };
  }

  // Update client
  const client = clients.get(clientId);
  client.currentScene = scene;
  client.lastActivity = new Date().toISOString();
  clients.set(clientId, client);

  // Create conversation start event
  const conversationData = {
    id: generateMessageId(),
    type: 'conversation-started',
    clientId,
    scene,
    participantIds,
    theme,
    timestamp: new Date().toISOString()
  };

  if (!conversations.has(clientId)) {
    conversations.set(clientId, []);
  }
  conversations.get(clientId)!.push(conversationData);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      conversationId: conversationData.id,
      timestamp: conversationData.timestamp
    }),
  };
}

function handlePoll(queryParams: any, headers: any) {
  const clientId = queryParams.clientId;
  const lastMessageId = queryParams.lastMessageId;
  
  if (!clientId || !clients.has(clientId)) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Client not found' }),
    };
  }

  // Update client activity
  const client = clients.get(clientId);
  client.lastActivity = new Date().toISOString();
  clients.set(clientId, client);

  // Get new messages
  const clientConversations = conversations.get(clientId) || [];
  let newMessages = clientConversations;

  if (lastMessageId) {
    const lastIndex = clientConversations.findIndex(msg => msg.id === lastMessageId);
    newMessages = lastIndex >= 0 ? clientConversations.slice(lastIndex + 1) : [];
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      messages: newMessages,
      clientId,
      timestamp: new Date().toISOString(),
      hasMore: newMessages.length > 0
    }),
  };
}

function handleStatus(headers: any) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'healthy',
      activeClients: clients.size,
      activeConversations: conversations.size,
      timestamp: new Date().toISOString()
    }),
  };
}

function generateClientId(): string {
  return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
