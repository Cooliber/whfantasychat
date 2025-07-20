// netlify/functions/api.ts
import express from "express";
import serverless from "serverless-http";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  contactSubmissions;
  characters;
  conversations;
  storyThreads;
  gossipItems;
  scenes;
  currentUserId;
  currentContactId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contactSubmissions = /* @__PURE__ */ new Map();
    this.characters = /* @__PURE__ */ new Map();
    this.conversations = /* @__PURE__ */ new Map();
    this.storyThreads = /* @__PURE__ */ new Map();
    this.gossipItems = /* @__PURE__ */ new Map();
    this.scenes = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.initializeDefaultScenes();
  }
  async initializeDefaultScenes() {
    const defaultScenes = [
      {
        id: "quiet-evening",
        name: "Cichy Wiecz\xF3r",
        description: "Spokojny wiecz\xF3r w tawernie. Tylko nieliczni go\u015Bcie siedz\u0105 przy stolach, popijaj\u0105c piwo i cicho rozmawiaj\u0105c.",
        atmosphere: "peaceful",
        activeCharacters: ["wilhelm-scribe", "greta-ironforge"],
        availableActions: [
          { id: "read-book", label: "Czytaj ksi\u0119g\u0119", description: "Przegl\u0105daj staro\u017Cytne manuskrypty" },
          { id: "craft-item", label: "Tw\xF3rz przedmiot", description: "Pracuj przy ma\u0142ej ku\u017Ani" }
        ],
        backgroundMusic: "ambient-tavern",
        isActive: true
      },
      {
        id: "busy-market",
        name: "Dzie\u0144 Targowy",
        description: "Tawerna pe\u0142na jest kupc\xF3w i podr\xF3\u017Cnik\xF3w. S\u0142ycha\u0107 rozmowy o handlu i dalekich krainach.",
        atmosphere: "bustling",
        activeCharacters: ["marcus-steiner", "greta-ironforge"],
        availableActions: [
          { id: "trade-goods", label: "Handluj towarami", description: "Wynegocjuj lepsze ceny" },
          { id: "gather-news", label: "Zbieraj wie\u015Bci", description: "Dowiedz si\u0119 o wydarzeniach" }
        ],
        backgroundMusic: "market-bustle",
        isActive: false
      }
    ];
    for (const scene of defaultScenes) {
      await this.createScene(scene);
    }
  }
  // Legacy user methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createContactSubmission(insertSubmission) {
    const id = this.currentContactId++;
    const submission = {
      ...insertSubmission,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
  async getAllContactSubmissions() {
    return Array.from(this.contactSubmissions.values());
  }
  // Character system methods
  async getAllCharacters() {
    return Array.from(this.characters.values());
  }
  async getCharacterById(id) {
    return this.characters.get(id);
  }
  async createCharacter(character) {
    this.characters.set(character.id, character);
    return character;
  }
  async updateCharacter(id, updates) {
    const existing = this.characters.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.characters.set(id, updated);
    return updated;
  }
  // Conversation system methods
  async getAllConversations() {
    return Array.from(this.conversations.values());
  }
  async getConversationById(id) {
    return this.conversations.get(id);
  }
  async createConversation(conversation) {
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }
  async getConversationsByScene(sceneContext) {
    return Array.from(this.conversations.values()).filter((conv) => conv.sceneContext === sceneContext);
  }
  async getConversationsByCharacter(characterId) {
    return Array.from(this.conversations.values()).filter((conv) => conv.participants.includes(characterId));
  }
  // Story thread system methods
  async getAllStoryThreads() {
    return Array.from(this.storyThreads.values());
  }
  async getStoryThreadById(id) {
    return this.storyThreads.get(id);
  }
  async createStoryThread(thread) {
    this.storyThreads.set(thread.id, thread);
    return thread;
  }
  async updateStoryThread(id, updates) {
    const existing = this.storyThreads.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.storyThreads.set(id, updated);
    return updated;
  }
  async getActiveStoryThreads() {
    return Array.from(this.storyThreads.values()).filter((thread) => thread.status === "active");
  }
  // Gossip system methods
  async getAllGossip() {
    return Array.from(this.gossipItems.values());
  }
  async getGossipById(id) {
    return this.gossipItems.get(id);
  }
  async createGossip(gossip) {
    this.gossipItems.set(gossip.id, gossip);
    return gossip;
  }
  async getGossipByCategory(category) {
    return Array.from(this.gossipItems.values()).filter((gossip) => gossip.category === category);
  }
  async getGossipBySource(source) {
    return Array.from(this.gossipItems.values()).filter((gossip) => gossip.source === source);
  }
  // Scene system methods
  async getAllScenes() {
    return Array.from(this.scenes.values());
  }
  async getSceneById(id) {
    return this.scenes.get(id);
  }
  async createScene(scene) {
    this.scenes.set(scene.id, scene);
    return scene;
  }
  async updateScene(id, updates) {
    const existing = this.scenes.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.scenes.set(id, updated);
    return updated;
  }
  async getActiveScene() {
    return Array.from(this.scenes.values()).find((scene) => scene.isActive);
  }
  async setActiveScene(id) {
    for (const scene2 of this.scenes.values()) {
      scene2.isActive = false;
    }
    const scene = this.scenes.get(id);
    if (scene) {
      scene.isActive = true;
      return scene;
    }
    return void 0;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var tavernCharacters = pgTable("tavern_characters", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  race: text("race").notNull(),
  characterClass: text("character_class").notNull(),
  personalityTraits: text("personality_traits").notNull().array(),
  backstory: text("backstory").notNull(),
  speechPatterns: jsonb("speech_patterns").notNull(),
  relationships: jsonb("relationships").notNull(),
  conversationPreferences: jsonb("conversation_preferences").notNull(),
  narrativeRoles: jsonb("narrative_roles").notNull()
});
var conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  sceneContext: text("scene_context").notNull(),
  participants: text("participants").notNull().array(),
  messages: jsonb("messages").notNull(),
  topicTags: text("topic_tags").notNull().array(),
  emotionalTone: text("emotional_tone").notNull(),
  plotRelevanceScore: integer("plot_relevance_score").notNull(),
  storyThreadIds: text("story_thread_ids").notNull().array(),
  gossipGenerated: jsonb("gossip_generated").notNull(),
  playerChoices: jsonb("player_choices").notNull()
});
var storyThreads = pgTable("story_threads", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  // active, completed, paused
  participants: text("participants").notNull().array(),
  scenes: text("scenes").notNull().array(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});
var gossipItems = pgTable("gossip_items", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  targets: text("targets").notNull().array(),
  veracity: boolean("veracity").notNull(),
  // true/false for accuracy
  spreadCount: integer("spread_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull()
});
var tavernScenes = pgTable("tavern_scenes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  atmosphere: text("atmosphere").notNull(),
  activeCharacters: text("active_characters").notNull().array(),
  availableActions: jsonb("available_actions").notNull(),
  backgroundMusic: text("background_music"),
  isActive: boolean("is_active").notNull().default(false)
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull()
});
var insertTavernCharacterSchema = createInsertSchema(tavernCharacters);
var insertConversationSchema = createInsertSchema(conversations);
var insertStoryThreadSchema = createInsertSchema(storyThreads);
var insertGossipItemSchema = createInsertSchema(gossipItems);
var insertTavernSceneSchema = createInsertSchema(tavernScenes);
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true
});
var digitalEnlightenment = pgTable("digital_enlightenment", {
  id: text("id").primaryKey(),
  characterId: text("character_id").notNull(),
  knowledgeLevel: integer("knowledge_level").notNull().default(1),
  // 1-10 tech awareness
  digitalTraits: jsonb("digital_traits").notNull(),
  // AI learning patterns
  adaptationHistory: jsonb("adaptation_history").notNull(),
  // How character learns
  technologyReactions: jsonb("technology_reactions").notNull(),
  // Responses to tech
  enlightenmentStage: text("enlightenment_stage").notNull().default("medieval"),
  // medieval, awareness, integration, transcendence
  memoryFragments: jsonb("memory_fragments").notNull(),
  // Cross-temporal memories
  paradoxResolution: jsonb("paradox_resolution").notNull(),
  // How they handle anachronisms
  fusionAbilities: jsonb("fusion_abilities").notNull()
  // Medieval-tech fusion skills
});
var enlightenmentEvents = pgTable("enlightenment_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  // discovery, adaptation, paradox, fusion
  characterIds: text("character_ids").notNull().array(),
  description: text("description").notNull(),
  technologyInvolved: text("technology_involved").notNull(),
  medievalContext: text("medieval_context").notNull(),
  outcome: text("outcome").notNull(),
  enlightenmentGain: integer("enlightenment_gain").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  playerChoice: boolean("player_choice").notNull().default(false)
});
var technomancySkills = pgTable("technomancy_skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").notNull(),
  // Tech + medieval prerequisites
  effects: jsonb("effects").notNull(),
  // What the skill does
  incantations: text("incantations").notNull().array(),
  // Polish mystical phrases
  technologyRequired: text("technology_required").notNull().array(),
  masteryLevel: integer("mastery_level").notNull()
  // 1-5
});

// server/routes.ts
import { z } from "zod";

// server/openrouter.ts
import OpenAI from "openai";
var OpenRouterEngine = class {
  client;
  constructor(config) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || "https://openrouter.ai/api/v1"
    });
  }
  async generateResponse(prompt, model = "meta-llama/llama-3.1-8b-instruct:free") {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      });
      return response.choices[0]?.message?.content || "Nie mog\u0119 odpowiedzie\u0107 w tym momencie.";
    } catch (error) {
      console.error("OpenRouter API error:", error);
      throw new Error("Failed to generate response via OpenRouter");
    }
  }
  async generateConversation(participants, context) {
    const systemPrompt = `Jeste\u015B mistrzem gry w \u015Bwiecie Warhammer Fantasy. Generuj autentyczne rozmowy mi\u0119dzy postaciami w tawernie.

UCZESTNICY:
${participants.map((p) => `${p.name}: ${p.personality} - ${p.speakingStyle}`).join("\n")}

KONTEKST:
Scena: ${context.scene}
Atmosfera: ${context.atmosphere}
Temat: ${context.theme}

ZASADY:
1. Ka\u017Cda posta\u0107 MUSI m\xF3wi\u0107 po polsku w swoim unikalnym stylu
2. U\u017Cywaj \u015Bredniowiecznych polskich wyra\u017Ce\u0144
3. Odwo\u0142uj si\u0119 do mitologii Warhammer Fantasy
4. Generuj 2-3 wiadomo\u015Bci
5. Ka\u017Cda wiadomo\u015B\u0107 to naturalna reakcja na poprzedni\u0105

Odpowiedz w formacie JSON: {"messages": [{"characterId": "id", "message": "tekst po polsku", "timestamp": "timestamp"}]}`;
    try {
      const response = await this.generateResponse(systemPrompt, "meta-llama/llama-3.1-70b-instruct:free");
      const parsed = JSON.parse(response);
      if (parsed.messages && Array.isArray(parsed.messages)) {
        return parsed.messages.map((msg) => ({
          characterId: msg.characterId,
          message: msg.message,
          timestamp: /* @__PURE__ */ new Date()
        }));
      }
      return [
        {
          characterId: participants[0].id,
          message: `${participants[0].name}: Dziwne czasy nasta\u0142y w naszych ziemiach...`,
          timestamp: /* @__PURE__ */ new Date()
        }
      ];
    } catch (error) {
      console.error("OpenRouter conversation error:", error);
      return [
        {
          characterId: participants[0].id,
          message: `S\u0142ysza\u0142em niepokoj\u0105ce wie\u015Bci z p\xF3\u0142nocy. Co\u015B si\u0119 dzieje w Starym \u015Awiecie.`,
          timestamp: /* @__PURE__ */ new Date()
        },
        {
          characterId: participants[1]?.id || participants[0].id,
          message: `Tak, czuj\u0119 to w powietrzu. Magia si\u0119 zmienia, bestie staj\u0105 si\u0119 \u015Bmielsze.`,
          timestamp: new Date(Date.now() + 3e3)
        }
      ];
    }
  }
};

// server/openrouter-conversation.ts
var ConversationEngine = class {
  characters = /* @__PURE__ */ new Map();
  openRouter;
  constructor() {
    this.initializeCharacters();
    this.openRouter = new OpenRouterEngine({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      baseURL: "https://openrouter.ai/api/v1"
    });
  }
  initializeCharacters() {
    const characters = [
      {
        id: "wilhelm-scribe",
        name: "Wilhelm von Schreiber",
        race: "Empire",
        class: "Scholar",
        personality: "Intellectual, cautious, curious about ancient mysteries, speaks formally",
        background: "Former university professor who discovered dangerous knowledge in forbidden texts",
        speakingStyle: "Formal, uses archaic terms, often quotes ancient texts, speaks slowly and thoughtfully",
        relationships: {
          "greta-ironforge": "Respectful academic friendship",
          "aelindra-moonwhisper": "Fascinated by her magical knowledge",
          "marcus-steiner": "Relies on his reports from the field"
        },
        secrets: ["Knows the location of a lost grimoire", "Has deciphered prophecies about coming darkness"],
        goals: ["Prevent ancient evil from awakening", "Preserve knowledge for future generations"]
      },
      {
        id: "greta-ironforge",
        name: "Greta \u017Belazna Ku\u017Ania",
        race: "Dwarf",
        class: "Blacksmith",
        personality: "Practical, direct, loyal, has a dry sense of humor",
        background: "Master blacksmith whose family has served the town for generations",
        speakingStyle: "Blunt, uses smithing metaphors, speaks with confidence, occasional grumbling",
        relationships: {
          "wilhelm-scribe": "Values his wisdom despite his bookishness",
          "balin-goldseeker": "Clan rivalry but mutual respect",
          "aelindra-moonwhisper": "Suspicious of magic but respects her skills"
        },
        secrets: ["Forged weapons with mysterious runes", "Knows about hidden dwarven passages"],
        goals: ["Protect the town with her craft", "Uphold family honor"]
      },
      {
        id: "aelindra-moonwhisper",
        name: "Aelindra Szept Ksi\u0119\u017Cyca",
        race: "Elf",
        class: "Mage",
        personality: "Mysterious, wise, speaks in riddles, connected to nature",
        background: "Ancient elf who has witnessed the rise and fall of empires",
        speakingStyle: "Poetic, uses nature metaphors, speaks softly but with authority",
        relationships: {
          "wilhelm-scribe": "Sees potential in his scholarly pursuits",
          "greta-ironforge": "Amused by dwarven stubbornness",
          "rosie-greenhill": "Shares knowledge of herbs and natural remedies"
        },
        secrets: ["Knows the true names of forest spirits", "Guards an ancient elven artifact"],
        goals: ["Maintain balance between civilized and natural worlds", "Guide worthy mortals"]
      },
      {
        id: "marcus-steiner",
        name: "Marcus Steiner",
        race: "Empire",
        class: "Scout",
        personality: "Alert, pragmatic, worldly, somewhat paranoid",
        background: "Former soldier turned scout who patrols the dangerous borderlands",
        speakingStyle: "Military terminology, short sentences, practical observations",
        relationships: {
          "wilhelm-scribe": "Reports findings to for analysis",
          "greta-ironforge": "Appreciates quality weapons",
          "lorenzo-goldhand": "Suspicious of the merchant's activities"
        },
        secrets: ["Has seen signs of Chaos cult activity", "Knows hidden paths through dangerous territory"],
        goals: ["Protect the town from external threats", "Uncover the truth about strange occurrences"]
      },
      {
        id: "lorenzo-goldhand",
        name: "Lorenzo Z\u0142ota R\u0119ka",
        race: "Tilean",
        class: "Merchant",
        personality: "Charming, ambitious, secretive, always calculating profit",
        background: "Wealthy merchant with connections across the Old World",
        speakingStyle: "Smooth, persuasive, uses trade terminology, speaks multiple languages",
        relationships: {
          "balin-goldseeker": "Business partnership with hidden tensions",
          "merry-goodbarrel": "Supplies exotic ingredients",
          "marcus-steiner": "Aware of the scout's suspicions"
        },
        secrets: ["Smuggles rare artifacts", "Has debts to dangerous people"],
        goals: ["Expand trading empire", "Pay off mysterious debts"]
      },
      {
        id: "balin-goldseeker",
        name: "Balin Poszukiwacz Z\u0142ota",
        race: "Dwarf",
        class: "Merchant",
        personality: "Shrewd, traditional, clan-focused, distrusts outsiders",
        background: "Represents dwarven merchant interests in human lands",
        speakingStyle: "Gruff, uses dwarven curses, business-focused, clan references",
        relationships: {
          "greta-ironforge": "Clan politics create tension",
          "lorenzo-goldhand": "Uneasy business alliance",
          "thorek-ironbeard": "Trusted clan brother"
        },
        secrets: ["Controls access to rare dwarven goods", "Knows location of abandoned mine"],
        goals: ["Increase clan wealth and influence", "Establish dwarven trading post"]
      }
    ];
    characters.forEach((char) => this.characters.set(char.id, char));
  }
  async generateConversation(context) {
    const participants = context.participantIds.map((id) => this.characters.get(id)).filter(Boolean);
    if (participants.length < 2) {
      throw new Error("Need at least 2 characters for conversation");
    }
    try {
      const openRouterParticipants = participants.map((char) => ({
        id: char.id,
        name: char.name,
        personality: char.personality,
        speakingStyle: char.speakingStyle
      }));
      const openRouterContext = {
        scene: context.scene,
        atmosphere: context.atmosphere,
        theme: context.recentEvents.join("; ") || "og\xF3lne rozmowy tawerny"
      };
      const messages = await this.openRouter.generateConversation(
        openRouterParticipants,
        openRouterContext
      );
      return messages;
    } catch (error) {
      console.error("OpenRouter conversation error:", error);
      return this.generateFallbackConversation(participants);
    }
  }
  generateFallbackConversation(participants) {
    const fallbackMessages = [
      {
        characterId: participants[0].id,
        message: `Dziwne czasy nasta\u0142y... S\u0142ysza\u0142em niepokoj\u0105ce wie\u015Bci z p\xF3\u0142nocy. Co\u015B si\u0119 szykuje.`,
        timestamp: /* @__PURE__ */ new Date()
      },
      {
        characterId: participants[1].id,
        message: `Tak, czuj\u0119 to w powietrzu. Nawet zwierz\u0119ta s\u0105 niespokojne ostatnio. To nie jest dobry znak.`,
        timestamp: new Date(Date.now() + 3e3)
      }
    ];
    return fallbackMessages.slice(0, participants.length);
  }
  async generateCharacterResponse(characterId, prompt, context) {
    const character = this.characters.get(characterId);
    if (!character) throw new Error(`Character ${characterId} not found`);
    const systemPrompt = `Jeste\u015B ${character.name}, ${character.race} ${character.class} w tawernie Warhammer Fantasy.

OSOBOWO\u015A\u0106: ${character.personality}
STYL M\xD3WIENIA: ${character.speakingStyle}
T\u0141O: ${character.background}

Obecna scena: ${context.scene} - ${context.atmosphere}

Odpowiadaj jak ta posta\u0107, pozostaj\u0105c wiernym jej osobowo\u015Bci i stylowi m\xF3wienia. Odpowiadaj ZAWSZE PO POLSKU. Utrzymuj odpowiedzi zwi\u0119z\u0142e (1-2 zdania). U\u017Cywaj naturalnie polskich wyra\u017Ce\u0144 \u015Bredniowiecznych.

Gracz m\xF3wi: "${prompt}"

Odpowiedz jako ${character.name}:`;
    try {
      const response = await this.openRouter.generateResponse(systemPrompt, "meta-llama/llama-3.1-70b-instruct:free");
      return response || `*${character.name} nods thoughtfully*`;
    } catch (error) {
      console.error("Character response error:", error);
      return `*${character.name} looks around the tavern thoughtfully*`;
    }
  }
  getCharacter(id) {
    return this.characters.get(id);
  }
  getAllCharacters() {
    return Array.from(this.characters.values());
  }
};
var conversationEngine = new ConversationEngine();

// server/routes.ts
import { WebSocketServer, WebSocket } from "ws";
async function registerRoutes(app2) {
  app2.post("/api/contact", async (req, res) => {
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
  app2.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/tavern/generate-conversation", async (req, res) => {
    try {
      const { scene, atmosphere, participantIds, conversationHistory, recentEvents } = req.body;
      const context = {
        scene: scene || "Cichy Wiecz\xF3r",
        atmosphere: atmosphere || "Spokojny, intymny, tajemniczy",
        recentEvents: recentEvents || [],
        participantIds: participantIds || [],
        conversationHistory: conversationHistory || []
      };
      const messages = await conversationEngine.generateConversation(context);
      res.json({ success: true, messages });
    } catch (error) {
      console.error("Conversation generation error:", error);
      res.status(500).json({ error: "Failed to generate conversation" });
    }
  });
  app2.post("/api/tavern/character-response", async (req, res) => {
    try {
      const { characterId, prompt, context } = req.body;
      const response = await conversationEngine.generateCharacterResponse(
        characterId,
        prompt,
        context
      );
      res.json({ success: true, response });
    } catch (error) {
      console.error("Character response error:", error);
      res.status(500).json({ error: "Failed to generate character response" });
    }
  });
  app2.get("/api/tavern/characters", async (req, res) => {
    try {
      const characters = conversationEngine.getAllCharacters();
      res.json({ characters });
    } catch (error) {
      res.status(500).json({ error: "Failed to get characters" });
    }
  });
  app2.get("/api/enlightenment/characters", async (req, res) => {
    try {
      const enlightenedCharacters = [
        {
          id: "wilhelm-enhanced",
          name: "Wilhelm von Schreiber",
          knowledgeLevel: 8,
          enlightenmentStage: "integration",
          digitalTraits: ["Data Wisdom", "Algorithm Intuition", "Binary Scholarship"],
          technomancySkills: ["Network Scrying", "Data Divination", "Digital Alchemy"],
          paradoxesResolved: 12,
          fusionAbilities: ["Quantum Manuscripts", "Holographic Libraries", "Time-Link Research"]
        },
        {
          id: "greta-enhanced",
          name: "Greta \u017Belazna Ku\u017Ania",
          knowledgeLevel: 9,
          enlightenmentStage: "transcendence",
          digitalTraits: ["Tech-Forge Mastery", "Circuit Intuition", "Metal-Silicon Synthesis"],
          technomancySkills: ["Cyber-Enchantment", "Digital Forging", "Nano-Crafting"],
          paradoxesResolved: 18,
          fusionAbilities: ["Smart-Metal Creation", "AI-Hammer Wielding", "Molecular Assembly"]
        },
        {
          id: "aelindra-enhanced",
          name: "Aelindra Szept Ksi\u0119\u017Cyca",
          knowledgeLevel: 10,
          enlightenmentStage: "transcendence",
          digitalTraits: ["Quantum Mysticism", "Digital Nature Bond", "Cyber-Druidism"],
          technomancySkills: ["Quantum Rituals", "Bio-Digital Fusion", "Network Forest Walking"],
          paradoxesResolved: 25,
          fusionAbilities: ["Living Code Manipulation", "Digital Ecosystem Creation", "Quantum Forest Networks"]
        }
      ];
      res.json({ characters: enlightenedCharacters });
    } catch (error) {
      res.status(500).json({ error: "Failed to get enlightened characters" });
    }
  });
  app2.get("/api/enlightenment/events", async (req, res) => {
    try {
      const events = [
        {
          id: "event-1",
          type: "fusion",
          description: "Wilhelm odkry\u0142 spos\xF3b na zapisywanie zakl\u0119\u0107 w kodzie binarnym, tworz\u0105c pierwsz\u0105 cyfrow\u0105 ksi\u0119g\u0119 czar\xF3w",
          characters: ["Wilhelm von Schreiber"],
          technology: "Quantum Storage",
          medievalContext: "Ancient Spellbooks",
          outcome: "Utworzenie Biblioteki Kwantowej",
          timestamp: new Date(Date.now() - 36e5)
        },
        {
          id: "event-2",
          type: "paradox",
          description: "Greta rozwi\u0105za\u0142a paradoks \u0142\u0105czenia magicznego \u017Celaza z nanomateria\u0142ami, tworz\u0105c nowe zastosowania w kowalstwie",
          characters: ["Greta \u017Belazna Ku\u017Ania"],
          technology: "Nanotechnology",
          medievalContext: "Blacksmithing Traditions",
          outcome: "Invention of Smart-Metal Alloys",
          timestamp: new Date(Date.now() - 72e5)
        },
        {
          id: "event-3",
          type: "discovery",
          description: "Aelindra nawi\u0105za\u0142a kontakt z cyfrowym lasem, gdzie dane rosn\u0105 jak drzewa i algorytmy \u015Bpiewaj\u0105 z wiatrem",
          characters: ["Aelindra Szept Ksi\u0119\u017Cyca"],
          technology: "Digital Ecosystems",
          medievalContext: "Druidic Nature Magic",
          outcome: "Creation of Living Code Networks",
          timestamp: new Date(Date.now() - 18e5)
        }
      ];
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: "Failed to get enlightenment events" });
    }
  });
  app2.post("/api/enlightenment/fusion", async (req, res) => {
    try {
      const { fusionLevel, participants, technology } = req.body;
      const fusionResult = {
        success: true,
        fusionLevel,
        participants,
        result: `Fuzja ${fusionLevel}% zako\u0144czona powodzeniem. Technologia ${technology} zosta\u0142a zintegrowana z magi\u0105 \u015Bredniowieczn\u0105.`,
        newAbilities: [
          "Enhanced Technomantic Awareness",
          "Cross-Dimensional Communication",
          "Quantum-Magic Manipulation"
        ],
        enlightenmentGain: Math.floor(fusionLevel / 20)
      };
      res.json(fusionResult);
    } catch (error) {
      res.status(500).json({ error: "Fusion process failed" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = /* @__PURE__ */ new Set();
  let conversationInterval = null;
  wss.on("connection", (ws) => {
    const client = {
      ws,
      id: Math.random().toString(36).substr(2, 9),
      currentScene: "Cichy Wiecz\xF3r"
    };
    clients.add(client);
    console.log(`Tavern client connected: ${client.id}`);
    ws.send(JSON.stringify({
      type: "welcome",
      clientId: client.id,
      message: "Connected to Warhammer Fantasy Tavern"
    }));
    if (clients.size === 1 && !conversationInterval) {
      startConversationLoop();
    }
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        switch (message.type) {
          case "scene-change":
            client.currentScene = message.scene;
            break;
          case "start-conversation":
            await handleStartConversation(message, client);
            break;
          case "send-message":
            await handlePlayerMessage(message, client);
            break;
          case "update-participants":
            if (message.participantIds) {
              client.activeParticipants = message.participantIds;
              client.conversationTheme = message.theme || "og\xF3lny";
              client.responseInterval = message.responseInterval || 45;
              console.log(`Updated participants for ${client.id}:`, message.participantIds);
            }
            break;
          case "update-timing":
            if (message.responseInterval) {
              client.responseInterval = message.responseInterval;
              console.log(`Updated response interval to ${message.responseInterval}s for ${client.id}`);
            }
            break;
          case "update-theme":
            if (message.theme) {
              client.conversationTheme = message.theme;
              console.log(`Updated conversation theme to ${message.theme} for ${client.id}`);
            }
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws.on("close", () => {
      clients.delete(client);
      console.log(`Tavern client disconnected: ${client.id}`);
      if (clients.size === 0 && conversationInterval) {
        clearInterval(conversationInterval);
        conversationInterval = null;
      }
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(client);
    });
  });
  async function startConversationLoop() {
    conversationInterval = setInterval(async () => {
      if (clients.size === 0) return;
      try {
        const allCharacters = conversationEngine.getAllCharacters();
        const shuffled = allCharacters.sort(() => Math.random() - 0.5);
        const participants = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
        const scenes = ["Cichy Wiecz\xF3r", "Dzie\u0144 Targowy", "Noc Burzy"];
        const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
        const context = {
          scene: randomScene,
          atmosphere: getSceneAtmosphere(randomScene),
          recentEvents: [
            "Stranger arrived asking about old ruins",
            "Merchant's goods went missing",
            "Strange sounds heard from the forest"
          ],
          participantIds: participants.map((p) => p.id),
          conversationHistory: []
        };
        const messages = await conversationEngine.generateConversation(context);
        const broadcastData = {
          type: "auto-conversation",
          scene: randomScene,
          participants: participants.map((p) => ({ id: p.id, name: p.name })),
          messages,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        broadcast(broadcastData);
      } catch (error) {
        console.error("Auto conversation error:", error);
      }
    }, 45e3);
  }
  async function handleStartConversation(message, client) {
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
        type: "conversation-started",
        messages,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      client.ws.send(JSON.stringify(response));
    } catch (error) {
      console.error("Start conversation error:", error);
    }
  }
  async function handlePlayerMessage(message, client) {
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
        type: "character-response",
        characterId,
        response,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      client.ws.send(JSON.stringify(responseData));
    } catch (error) {
      console.error("Player message error:", error);
    }
  }
  function getSceneAtmosphere(scene) {
    const atmospheres = {
      "Cichy Wiecz\xF3r": "Spokojny, intymny, tajemniczy",
      "Dzie\u0144 Targowy": "Energiczny, ha\u0142a\u015Bliwy, handlowy",
      "Noc Burzy": "Dramatyczny, solidarny, przygodowy",
      "Mysterious Gathering": "Napi\u0119ty, sekretny, gro\u017Any",
      "Busy Market Day": "Chaotyczny, g\u0142o\u015Bny, pe\u0142en \u017Cycia"
    };
    return atmospheres[scene] || "Spokojny, przyjazny";
  }
  function broadcast(data) {
    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }
  return httpServer;
}

// netlify/functions/api.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
registerRoutes(app);
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});
var handler = serverless(app);
export {
  handler
};
