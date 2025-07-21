import type { Express } from "express";
import { storage } from "../../server/storage";
import { insertContactSubmissionSchema } from "../../shared/schema";
import { z } from "zod";
import { conversationEngine } from "../../server/openrouter-conversation";

// In-memory storage for active conversations (will be replaced with database in production)
const activeConversations = new Map<string, any>();
const conversationPolling = new Map<string, any[]>();

export function registerServerlessRoutes(app: Express): void {
  
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

  // Get character response
  app.post("/api/tavern/character-response", async (req, res) => {
    try {
      const { characterId, prompt, scene, atmosphere } = req.body;
      
      const context = {
        scene: scene || 'Cichy Wieczór',
        atmosphere: atmosphere || 'Spokojny, intymny, tajemniczy',
        recentEvents: [],
        participantIds: [characterId],
        conversationHistory: []
      };

      const response = await conversationEngine.generateCharacterResponse(
        characterId,
        prompt,
        context
      );

      res.json({ success: true, response, characterId, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Character response error:', error);
      res.status(500).json({ error: "Failed to generate character response" });
    }
  });

  // Get all characters
  app.get("/api/tavern/characters", async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json({ characters });
    } catch (error) {
      console.error('Characters fetch error:', error);
      res.status(500).json({ error: "Failed to fetch characters" });
    }
  });

  // Get character by ID
  app.get("/api/tavern/characters/:id", async (req, res) => {
    try {
      const character = await storage.getCharacterById(req.params.id);
      if (!character) {
        res.status(404).json({ error: "Character not found" });
        return;
      }
      res.json({ character });
    } catch (error) {
      console.error('Character fetch error:', error);
      res.status(500).json({ error: "Failed to fetch character" });
    }
  });

  // Polling endpoint for real-time updates (WebSocket replacement)
  app.get("/api/tavern/poll/:clientId", async (req, res) => {
    try {
      const clientId = req.params.clientId;
      const lastMessageId = req.query.lastMessageId as string;
      
      // Get new messages for this client
      const messages = conversationPolling.get(clientId) || [];
      const newMessages = lastMessageId 
        ? messages.filter(msg => msg.id > lastMessageId)
        : messages.slice(-5); // Return last 5 messages if no lastMessageId
      
      res.json({ 
        success: true, 
        messages: newMessages,
        clientId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Polling error:', error);
      res.status(500).json({ error: "Failed to poll for updates" });
    }
  });

  // Start conversation endpoint (replaces WebSocket message)
  app.post("/api/tavern/start-conversation", async (req, res) => {
    try {
      const { clientId, scene, participantIds, theme } = req.body;
      
      // Generate initial conversation
      const context = {
        scene: scene || 'Cichy Wieczór',
        atmosphere: getSceneAtmosphere(scene || 'Cichy Wieczór'),
        recentEvents: [],
        participantIds: participantIds || [],
        conversationHistory: []
      };

      const messages = await conversationEngine.generateConversation(context);
      
      // Store messages for polling
      const formattedMessages = messages.map((msg, index) => ({
        id: `${Date.now()}-${index}`,
        type: 'conversation-started',
        characterId: msg.characterId,
        message: msg.message,
        timestamp: new Date().toISOString()
      }));

      if (!conversationPolling.has(clientId)) {
        conversationPolling.set(clientId, []);
      }
      conversationPolling.get(clientId)!.push(...formattedMessages);

      res.json({ 
        success: true, 
        messages: formattedMessages,
        conversationId: `conv-${Date.now()}`
      });
    } catch (error) {
      console.error('Start conversation error:', error);
      res.status(500).json({ error: "Failed to start conversation" });
    }
  });

  // Send message endpoint (replaces WebSocket message)
  app.post("/api/tavern/send-message", async (req, res) => {
    try {
      const { clientId, characterId, prompt, scene } = req.body;
      
      const context = {
        scene: scene || 'Cichy Wieczór',
        atmosphere: getSceneAtmosphere(scene || 'Cichy Wieczór'),
        recentEvents: [],
        participantIds: [characterId],
        conversationHistory: []
      };

      const response = await conversationEngine.generateCharacterResponse(
        characterId,
        prompt,
        context
      );

      const responseMessage = {
        id: `${Date.now()}`,
        type: 'character-response',
        characterId: characterId,
        message: response,
        timestamp: new Date().toISOString()
      };

      // Store message for polling
      if (!conversationPolling.has(clientId)) {
        conversationPolling.set(clientId, []);
      }
      conversationPolling.get(clientId)!.push(responseMessage);

      res.json({ 
        success: true, 
        message: responseMessage
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Get story threads
  app.get("/api/tavern/story-threads", async (req, res) => {
    try {
      const threads = await storage.getAllStoryThreads();
      res.json({ threads });
    } catch (error) {
      console.error('Story threads fetch error:', error);
      res.status(500).json({ error: "Failed to fetch story threads" });
    }
  });

  // Get gossip items
  app.get("/api/tavern/gossip", async (req, res) => {
    try {
      const gossip = await storage.getAllGossipItems();
      res.json({ gossip });
    } catch (error) {
      console.error('Gossip fetch error:', error);
      res.status(500).json({ error: "Failed to fetch gossip" });
    }
  });

  // Get scenes
  app.get("/api/tavern/scenes", async (req, res) => {
    try {
      const scenes = await storage.getAllScenes();
      res.json({ scenes });
    } catch (error) {
      console.error('Scenes fetch error:', error);
      res.status(500).json({ error: "Failed to fetch scenes" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
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
