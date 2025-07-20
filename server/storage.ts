import { 
  users, 
  contactSubmissions, 
  tavernCharacters,
  conversations,
  storyThreads,
  gossipItems,
  tavernScenes,
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContactSubmission,
  type TavernCharacter,
  type InsertTavernCharacter,
  type Conversation,
  type InsertConversation,
  type StoryThread,
  type InsertStoryThread,
  type GossipItem,
  type InsertGossipItem,
  type TavernScene,
  type InsertTavernScene
} from "@shared/schema";

export interface IStorage {
  // Legacy user system
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Tavern character system
  getAllCharacters(): Promise<TavernCharacter[]>;
  getCharacterById(id: string): Promise<TavernCharacter | undefined>;
  createCharacter(character: InsertTavernCharacter): Promise<TavernCharacter>;
  updateCharacter(id: string, updates: Partial<InsertTavernCharacter>): Promise<TavernCharacter | undefined>;
  
  // Conversation system
  getAllConversations(): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationsByScene(sceneContext: string): Promise<Conversation[]>;
  getConversationsByCharacter(characterId: string): Promise<Conversation[]>;
  
  // Story thread system
  getAllStoryThreads(): Promise<StoryThread[]>;
  getStoryThreadById(id: string): Promise<StoryThread | undefined>;
  createStoryThread(thread: InsertStoryThread): Promise<StoryThread>;
  updateStoryThread(id: string, updates: Partial<InsertStoryThread>): Promise<StoryThread | undefined>;
  getActiveStoryThreads(): Promise<StoryThread[]>;
  
  // Gossip system
  getAllGossip(): Promise<GossipItem[]>;
  getGossipById(id: string): Promise<GossipItem | undefined>;
  createGossip(gossip: InsertGossipItem): Promise<GossipItem>;
  getGossipByCategory(category: string): Promise<GossipItem[]>;
  getGossipBySource(source: string): Promise<GossipItem[]>;
  
  // Scene system
  getAllScenes(): Promise<TavernScene[]>;
  getSceneById(id: string): Promise<TavernScene | undefined>;
  createScene(scene: InsertTavernScene): Promise<TavernScene>;
  updateScene(id: string, updates: Partial<InsertTavernScene>): Promise<TavernScene | undefined>;
  getActiveScene(): Promise<TavernScene | undefined>;
  setActiveScene(id: string): Promise<TavernScene | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private characters: Map<string, TavernCharacter>;
  private conversations: Map<string, Conversation>;
  private storyThreads: Map<string, StoryThread>;
  private gossipItems: Map<string, GossipItem>;
  private scenes: Map<string, TavernScene>;
  private currentUserId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.characters = new Map();
    this.conversations = new Map();
    this.storyThreads = new Map();
    this.gossipItems = new Map();
    this.scenes = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    
    // Initialize with default scenes
    this.initializeDefaultScenes();
  }

  private async initializeDefaultScenes() {
    const defaultScenes: InsertTavernScene[] = [
      {
        id: 'quiet-evening',
        name: 'Cichy Wieczór',
        description: 'Spokojny wieczór w tawernie. Tylko nieliczni goście siedzą przy stolach, popijając piwo i cicho rozmawiając.',
        atmosphere: 'peaceful',
        activeCharacters: ['wilhelm-scribe', 'greta-ironforge'],
        availableActions: [
          { id: 'read-book', label: 'Czytaj księgę', description: 'Przeglądaj starożytne manuskrypty' },
          { id: 'craft-item', label: 'Twórz przedmiot', description: 'Pracuj przy małej kuźni' }
        ],
        backgroundMusic: 'ambient-tavern',
        isActive: true
      },
      {
        id: 'busy-market',
        name: 'Dzień Targowy',
        description: 'Tawerna pełna jest kupców i podróżników. Słychać rozmowy o handlu i dalekich krainach.',
        atmosphere: 'bustling',
        activeCharacters: ['marcus-steiner', 'greta-ironforge'],
        availableActions: [
          { id: 'trade-goods', label: 'Handluj towarami', description: 'Wynegocjuj lepsze ceny' },
          { id: 'gather-news', label: 'Zbieraj wieści', description: 'Dowiedz się o wydarzeniach' }
        ],
        backgroundMusic: 'market-bustle',
        isActive: false
      }
    ];

    for (const scene of defaultScenes) {
      await this.createScene(scene);
    }
  }

  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date().toISOString()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  // Character system methods
  async getAllCharacters(): Promise<TavernCharacter[]> {
    return Array.from(this.characters.values());
  }

  async getCharacterById(id: string): Promise<TavernCharacter | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(character: InsertTavernCharacter): Promise<TavernCharacter> {
    this.characters.set(character.id, character as TavernCharacter);
    return character as TavernCharacter;
  }

  async updateCharacter(id: string, updates: Partial<InsertTavernCharacter>): Promise<TavernCharacter | undefined> {
    const existing = this.characters.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.characters.set(id, updated);
    return updated;
  }

  // Conversation system methods
  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async getConversationById(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    this.conversations.set(conversation.id, conversation as Conversation);
    return conversation as Conversation;
  }

  async getConversationsByScene(sceneContext: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.sceneContext === sceneContext);
  }

  async getConversationsByCharacter(characterId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.participants.includes(characterId));
  }

  // Story thread system methods
  async getAllStoryThreads(): Promise<StoryThread[]> {
    return Array.from(this.storyThreads.values());
  }

  async getStoryThreadById(id: string): Promise<StoryThread | undefined> {
    return this.storyThreads.get(id);
  }

  async createStoryThread(thread: InsertStoryThread): Promise<StoryThread> {
    this.storyThreads.set(thread.id, thread as StoryThread);
    return thread as StoryThread;
  }

  async updateStoryThread(id: string, updates: Partial<InsertStoryThread>): Promise<StoryThread | undefined> {
    const existing = this.storyThreads.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.storyThreads.set(id, updated);
    return updated;
  }

  async getActiveStoryThreads(): Promise<StoryThread[]> {
    return Array.from(this.storyThreads.values())
      .filter(thread => thread.status === 'active');
  }

  // Gossip system methods
  async getAllGossip(): Promise<GossipItem[]> {
    return Array.from(this.gossipItems.values());
  }

  async getGossipById(id: string): Promise<GossipItem | undefined> {
    return this.gossipItems.get(id);
  }

  async createGossip(gossip: InsertGossipItem): Promise<GossipItem> {
    this.gossipItems.set(gossip.id, gossip as GossipItem);
    return gossip as GossipItem;
  }

  async getGossipByCategory(category: string): Promise<GossipItem[]> {
    return Array.from(this.gossipItems.values())
      .filter(gossip => gossip.category === category);
  }

  async getGossipBySource(source: string): Promise<GossipItem[]> {
    return Array.from(this.gossipItems.values())
      .filter(gossip => gossip.source === source);
  }

  // Scene system methods
  async getAllScenes(): Promise<TavernScene[]> {
    return Array.from(this.scenes.values());
  }

  async getSceneById(id: string): Promise<TavernScene | undefined> {
    return this.scenes.get(id);
  }

  async createScene(scene: InsertTavernScene): Promise<TavernScene> {
    this.scenes.set(scene.id, scene as TavernScene);
    return scene as TavernScene;
  }

  async updateScene(id: string, updates: Partial<InsertTavernScene>): Promise<TavernScene | undefined> {
    const existing = this.scenes.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.scenes.set(id, updated);
    return updated;
  }

  async getActiveScene(): Promise<TavernScene | undefined> {
    return Array.from(this.scenes.values()).find(scene => scene.isActive);
  }

  async setActiveScene(id: string): Promise<TavernScene | undefined> {
    // Deactivate all scenes first
    for (const scene of this.scenes.values()) {
      scene.isActive = false;
    }
    
    // Activate the specified scene
    const scene = this.scenes.get(id);
    if (scene) {
      scene.isActive = true;
      return scene;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
