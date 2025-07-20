import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { conversationEngine } from "./openai";
import { WebSocketServer, WebSocket } from 'ws';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get all contact submissions (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Tavern conversation routes
  app.post("/api/tavern/generate-conversation", async (req, res) => {
    try {
      const { scene, atmosphere, participantIds, conversationHistory, recentEvents } = req.body;
      
      const context = {
        scene: scene || 'Cichy Wieczór',
        atmosphere: atmosphere || 'Spokojny, intymny, tajemniczy',
        recentEvents: recentEvents || [],
        participantIds: participantIds || [],
        conversationHistory: conversationHistory || []
      };

      const messages = await conversationEngine.generateConversation(context);
      res.json({ success: true, messages });
    } catch (error) {
      console.error('Conversation generation error:', error);
      res.status(500).json({ error: "Failed to generate conversation" });
    }
  });

  app.post("/api/tavern/character-response", async (req, res) => {
    try {
      const { characterId, prompt, context } = req.body;
      
      const response = await conversationEngine.generateCharacterResponse(
        characterId, 
        prompt, 
        context
      );
      
      res.json({ success: true, response });
    } catch (error) {
      console.error('Character response error:', error);
      res.status(500).json({ error: "Failed to generate character response" });
    }
  });

  app.get("/api/tavern/characters", async (req, res) => {
    try {
      const characters = conversationEngine.getAllCharacters();
      res.json({ characters });
    } catch (error) {
      res.status(500).json({ error: "Failed to get characters" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time tavern conversations
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  interface TavernClient {
    ws: WebSocket;
    id: string;
    currentScene: string;
    activeParticipants?: string[];
    conversationTheme?: string;
    responseInterval?: number;
  }

  const clients = new Set<TavernClient>();
  let conversationInterval: NodeJS.Timeout | null = null;

  wss.on('connection', (ws) => {
    const client: TavernClient = {
      ws,
      id: Math.random().toString(36).substr(2, 9),
      currentScene: 'Cichy Wieczór'
    };

    clients.add(client);
    console.log(`Tavern client connected: ${client.id}`);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      clientId: client.id,
      message: 'Connected to Warhammer Fantasy Tavern'
    }));

    // Start conversation loop if this is the first client
    if (clients.size === 1 && !conversationInterval) {
      startConversationLoop();
    }

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'scene-change':
            client.currentScene = message.scene;
            break;
            
          case 'start-conversation':
            await handleStartConversation(message, client);
            break;
            
          case 'send-message':
            await handlePlayerMessage(message, client);
            break;
            
          case 'update-participants':
            if (message.participantIds) {
              client.activeParticipants = message.participantIds;
              client.conversationTheme = message.theme || 'ogólny';
              client.responseInterval = message.responseInterval || 45;
              console.log(`Updated participants for ${client.id}:`, message.participantIds);
            }
            break;

          case 'update-timing':
            if (message.responseInterval) {
              client.responseInterval = message.responseInterval;
              console.log(`Updated response interval to ${message.responseInterval}s for ${client.id}`);
            }
            break;

          case 'update-theme':
            if (message.theme) {
              client.conversationTheme = message.theme;
              console.log(`Updated conversation theme to ${message.theme} for ${client.id}`);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(client);
      console.log(`Tavern client disconnected: ${client.id}`);
      
      // Stop conversation loop if no clients
      if (clients.size === 0 && conversationInterval) {
        clearInterval(conversationInterval);
        conversationInterval = null;
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(client);
    });
  });

  async function startConversationLoop() {
    conversationInterval = setInterval(async () => {
      if (clients.size === 0) return;

      try {
        // Get random characters for conversation
        const allCharacters = conversationEngine.getAllCharacters();
        const shuffled = allCharacters.sort(() => Math.random() - 0.5);
        const participants = shuffled.slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 characters

        // Generate conversation context
        const scenes = ['Cichy Wieczór', 'Dzień Targowy', 'Noc Burzy'];
        const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
        
        const context = {
          scene: randomScene,
          atmosphere: getSceneAtmosphere(randomScene),
          recentEvents: [
            'Stranger arrived asking about old ruins',
            'Merchant\'s goods went missing',
            'Strange sounds heard from the forest'
          ],
          participantIds: participants.map(p => p.id),
          conversationHistory: []
        };

        const messages = await conversationEngine.generateConversation(context);

        // Broadcast to all connected clients
        const broadcastData = {
          type: 'auto-conversation',
          scene: randomScene,
          participants: participants.map(p => ({ id: p.id, name: p.name })),
          messages: messages,
          timestamp: new Date().toISOString()
        };

        broadcast(broadcastData);

      } catch (error) {
        console.error('Auto conversation error:', error);
      }
    }, 45000); // Every 45 seconds for demo (would be 2-5 minutes in production)
  }

  async function handleStartConversation(message: any, client: TavernClient) {
    try {
      const context = {
        scene: client.currentScene,
        atmosphere: getSceneAtmosphere(client.currentScene),
        recentEvents: message.recentEvents || [],
        participantIds: message.participantIds || [],
        conversationHistory: message.conversationHistory || []
      };

      const messages = await conversationEngine.generateConversation(context);

      const response = {
        type: 'conversation-started',
        messages: messages,
        timestamp: new Date().toISOString()
      };

      client.ws.send(JSON.stringify(response));
    } catch (error) {
      console.error('Start conversation error:', error);
    }
  }

  async function handlePlayerMessage(message: any, client: TavernClient) {
    try {
      const { characterId, prompt } = message;
      
      const context = {
        scene: client.currentScene,
        atmosphere: getSceneAtmosphere(client.currentScene),
        recentEvents: [],
        participantIds: [characterId],
        conversationHistory: []
      };

      const response = await conversationEngine.generateCharacterResponse(
        characterId,
        prompt,
        context
      );

      const responseData = {
        type: 'character-response',
        characterId: characterId,
        response: response,
        timestamp: new Date().toISOString()
      };

      client.ws.send(JSON.stringify(responseData));
    } catch (error) {
      console.error('Player message error:', error);
    }
  }

  function getSceneAtmosphere(scene: string): string {
    const atmospheres: Record<string, string> = {
      'Cichy Wieczór': 'Spokojny, intymny, tajemniczy',
      'Dzień Targowy': 'Energiczny, hałaśliwy, handlowy',
      'Noc Burzy': 'Dramatyczny, solidarny, przygodowy',
      'Mysterious Gathering': 'Napięty, sekretny, groźny',
      'Busy Market Day': 'Chaotyczny, głośny, pełen życia'
    };
    return atmospheres[scene] || 'Spokojny, przyjazny';
  }

  function broadcast(data: any) {
    clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }

  return httpServer;
}
