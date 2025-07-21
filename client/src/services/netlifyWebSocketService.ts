// Netlify-compatible WebSocket replacement using polling
export class NetlifyWebSocketService {
  private clientId: string | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastMessageId: string | null = null;
  private isConnected: boolean = false;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private baseUrl: string;

  constructor() {
    // Use environment-specific base URL
    if (import.meta.env.VITE_API_BASE_URL) {
      this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    } else if (import.meta.env.PROD) {
      this.baseUrl = '/.netlify/functions';
    } else {
      this.baseUrl = '/api';
    }

    console.log('NetlifyWebSocketService initialized with baseUrl:', this.baseUrl);
  }

  async connect(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/websocket-fallback/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentScene: 'Cichy Wieczór'
        })
      });

      if (!response.ok) {
        throw new Error(`Connection failed: ${response.status}`);
      }

      const data = await response.json();
      this.clientId = data.clientId;
      this.isConnected = true;

      // Emit welcome event
      this.emit('welcome', data);

      // Start polling for messages
      this.startPolling();

      console.log('Connected to Netlify WebSocket service:', this.clientId);
    } catch (error) {
      console.error('Failed to connect to WebSocket service:', error);
      throw error;
    }
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.clientId = null;
    this.lastMessageId = null;
    console.log('Disconnected from WebSocket service');
  }

  async sendMessage(data: any): Promise<void> {
    if (!this.isConnected || !this.clientId) {
      throw new Error('Not connected to WebSocket service');
    }

    try {
      let endpoint = '';
      let payload = { ...data, clientId: this.clientId };

      switch (data.type) {
        case 'start-conversation':
          endpoint = '/websocket-fallback/start-conversation';
          break;
        case 'send-message':
          endpoint = '/websocket-fallback/send-message';
          break;
        default:
          // For other message types, use the API endpoints directly
          await this.handleApiMessage(data);
          return;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Send message failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Message sent successfully:', result);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  private async handleApiMessage(data: any): Promise<void> {
    try {
      let endpoint = '';
      let payload = data;

      switch (data.type) {
        case 'player-message':
          endpoint = '/tavern/character-response';
          payload = {
            characterId: data.characterId,
            prompt: data.message,
            scene: data.scene || 'Cichy Wieczór',
            atmosphere: data.atmosphere
          };
          break;
        default:
          console.warn('Unknown message type:', data.type);
          return;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Emit the response as if it came from WebSocket
      this.emit('character-response', {
        type: 'character-response',
        characterId: result.characterId,
        response: result.response,
        timestamp: result.timestamp
      });

    } catch (error) {
      console.error('API message handling failed:', error);
    }
  }

  on(event: string, handler: (data: any) => void): void {
    this.messageHandlers.set(event, handler);
  }

  off(event: string): void {
    this.messageHandlers.delete(event);
  }

  private emit(event: string, data: any): void {
    const handler = this.messageHandlers.get(event);
    if (handler) {
      handler(data);
    }
  }

  private startPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    const pollingInterval = import.meta.env.VITE_POLLING_INTERVAL
      ? parseInt(import.meta.env.VITE_POLLING_INTERVAL)
      : 2000;

    this.pollingInterval = setInterval(async () => {
      if (!this.isConnected || !this.clientId) {
        return;
      }

      try {
        const params = new URLSearchParams({
          clientId: this.clientId,
          ...(this.lastMessageId && { lastMessageId: this.lastMessageId })
        });

        const response = await fetch(`${this.baseUrl}/websocket-fallback/poll?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          if (import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true') {
            console.error('Polling failed:', response.status);
          }
          return;
        }

        const data = await response.json();

        if (data.messages && data.messages.length > 0) {
          // Process new messages
          data.messages.forEach((message: any) => {
            this.emit(message.type, message);
            this.lastMessageId = message.id;
          });
        }

      } catch (error) {
        if (import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true') {
          console.error('Polling error:', error);
        }
      }
    }, pollingInterval);
  }

  // Utility methods for common operations
  async startConversation(scene: string, participantIds: string[], theme?: string): Promise<void> {
    await this.sendMessage({
      type: 'start-conversation',
      scene,
      participantIds,
      theme
    });
  }

  async sendPlayerMessage(characterId: string, message: string, scene: string): Promise<void> {
    await this.sendMessage({
      type: 'player-message',
      characterId,
      message,
      scene
    });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getClientId(): string | null {
    return this.clientId;
  }
}

// Export singleton instance
export const netlifyWebSocketService = new NetlifyWebSocketService();
