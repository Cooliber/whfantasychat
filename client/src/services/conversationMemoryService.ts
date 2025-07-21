import type { TavernCharacterData } from '../types/warhammer.types';

// Conversation Memory Types
export interface ConversationMemory {
  characterId: string;
  playerName: string;
  firstMeeting: Date;
  lastInteraction: Date;
  totalConversations: number;
  relationshipLevel: number; // -100 to 100
  trustLevel: number; // 0 to 100
  
  // Conversation History
  conversationSummaries: ConversationSummary[];
  sharedSecrets: SharedSecret[];
  promisesMade: Promise[];
  emotionalMoments: EmotionalMoment[];
  topicsDiscussed: TopicMemory[];
  
  // Relationship Milestones
  relationshipMilestones: RelationshipMilestone[];
  
  // Character-specific memories
  personalDetails: PersonalDetail[];
  preferences: CharacterPreference[];
  
  // Meta information
  memoryStrength: number; // How well the character remembers (0-100)
  lastMemoryUpdate: Date;
}

export interface ConversationSummary {
  id: string;
  date: Date;
  duration: number; // minutes
  mainTopics: string[];
  outcome: 'positive' | 'negative' | 'neutral';
  relationshipChange: number;
  keyMoments: string[];
  questsDiscovered: string[];
  secretsRevealed: string[];
}

export interface SharedSecret {
  id: string;
  content: string;
  importance: 'minor' | 'moderate' | 'major' | 'critical';
  dateShared: Date;
  keeperTrustworthiness: number; // How well the secret was kept
  consequences: string[];
}

export interface Promise {
  id: string;
  content: string;
  dateMade: Date;
  deadline?: Date;
  fulfilled: boolean;
  importance: 'minor' | 'moderate' | 'major' | 'critical';
  consequences: {
    ifKept: string[];
    ifBroken: string[];
  };
}

export interface EmotionalMoment {
  id: string;
  emotion: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'love' | 'betrayal';
  intensity: number; // 1-10
  trigger: string;
  date: Date;
  lastingImpact: number; // How much this affects future interactions
  recovery: number; // How much the character has recovered (0-100)
}

export interface TopicMemory {
  topic: string;
  timesDiscussed: number;
  characterReaction: 'loves' | 'likes' | 'neutral' | 'dislikes' | 'hates';
  lastDiscussed: Date;
  associatedEmotions: string[];
  keyPoints: string[];
}

export interface RelationshipMilestone {
  id: string;
  type: 'first_meeting' | 'trust_gained' | 'secret_shared' | 'promise_made' | 'promise_kept' | 
        'promise_broken' | 'conflict' | 'reconciliation' | 'friendship' | 'romance' | 'rivalry';
  date: Date;
  description: string;
  impact: number; // -50 to 50
  significance: 'minor' | 'moderate' | 'major' | 'life_changing';
}

export interface PersonalDetail {
  category: 'family' | 'background' | 'goals' | 'fears' | 'preferences' | 'skills' | 'secrets';
  detail: string;
  dateShared: Date;
  importance: number; // 1-10
  verified: boolean; // Whether the information has been confirmed
}

export interface CharacterPreference {
  category: 'conversation_style' | 'topics' | 'activities' | 'food' | 'drink' | 'music' | 'people';
  preference: string;
  strength: number; // 1-10
  dateDiscovered: Date;
  examples: string[];
}

// Conversation Memory Manager
export class ConversationMemoryManager {
  private static readonly STORAGE_KEY = 'warhammer_conversation_memories';
  private memories: Map<string, ConversationMemory> = new Map();

  constructor() {
    this.loadMemories();
  }

  // Initialize memory for a character
  initializeCharacterMemory(characterId: string, playerName: string): ConversationMemory {
    const memory: ConversationMemory = {
      characterId,
      playerName,
      firstMeeting: new Date(),
      lastInteraction: new Date(),
      totalConversations: 0,
      relationshipLevel: 0,
      trustLevel: 50, // Start with neutral trust
      conversationSummaries: [],
      sharedSecrets: [],
      promisesMade: [],
      emotionalMoments: [],
      topicsDiscussed: [],
      relationshipMilestones: [{
        id: `milestone-${Date.now()}`,
        type: 'first_meeting',
        date: new Date(),
        description: `First meeting with ${playerName}`,
        impact: 5,
        significance: 'minor'
      }],
      personalDetails: [],
      preferences: [],
      memoryStrength: this.calculateMemoryStrength(characterId),
      lastMemoryUpdate: new Date()
    };

    this.memories.set(characterId, memory);
    this.saveMemories();
    return memory;
  }

  // Get character memory
  getCharacterMemory(characterId: string, playerName: string): ConversationMemory {
    let memory = this.memories.get(characterId);
    
    if (!memory) {
      memory = this.initializeCharacterMemory(characterId, playerName);
    }
    
    return memory;
  }

  // Add conversation summary
  addConversationSummary(
    characterId: string,
    summary: Omit<ConversationSummary, 'id'>
  ): void {
    const memory = this.memories.get(characterId);
    if (!memory) return;

    const conversationSummary: ConversationSummary = {
      ...summary,
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    memory.conversationSummaries.push(conversationSummary);
    memory.totalConversations++;
    memory.lastInteraction = new Date();
    memory.relationshipLevel += summary.relationshipChange;
    memory.lastMemoryUpdate = new Date();

    // Limit conversation history based on memory strength
    const maxSummaries = Math.floor(memory.memoryStrength / 10) + 5; // 5-15 summaries
    if (memory.conversationSummaries.length > maxSummaries) {
      memory.conversationSummaries = memory.conversationSummaries.slice(-maxSummaries);
    }

    this.saveMemories();
  }

  // Add shared secret
  addSharedSecret(
    characterId: string,
    secret: Omit<SharedSecret, 'id' | 'dateShared' | 'keeperTrustworthiness'>
  ): void {
    const memory = this.memories.get(characterId);
    if (!memory) return;

    const sharedSecret: SharedSecret = {
      ...secret,
      id: `secret-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateShared: new Date(),
      keeperTrustworthiness: 100 // Assume secrets are kept initially
    };

    memory.sharedSecrets.push(sharedSecret);
    memory.trustLevel += this.getSecretTrustBonus(secret.importance);
    
    // Add relationship milestone
    this.addRelationshipMilestone(characterId, {
      type: 'secret_shared',
      description: `Shared a ${secret.importance} secret`,
      impact: this.getSecretTrustBonus(secret.importance),
      significance: secret.importance === 'critical' ? 'major' : 'moderate'
    });

    this.saveMemories();
  }

  // Add promise
  addPromise(
    characterId: string,
    promise: Omit<Promise, 'id' | 'dateMade' | 'fulfilled'>
  ): void {
    const memory = this.memories.get(characterId);
    if (!memory) return;

    const newPromise: Promise = {
      ...promise,
      id: `promise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateMade: new Date(),
      fulfilled: false
    };

    memory.promisesMade.push(newPromise);
    
    this.addRelationshipMilestone(characterId, {
      type: 'promise_made',
      description: `Promise made: ${promise.content}`,
      impact: 5,
      significance: 'minor'
    });

    this.saveMemories();
  }

  // Fulfill or break promise
  updatePromise(characterId: string, promiseId: string, fulfilled: boolean): void {
    const memory = this.memories.get(characterId);
    if (!memory) return;

    const promise = memory.promisesMade.find(p => p.id === promiseId);
    if (!promise) return;

    promise.fulfilled = fulfilled;
    
    const impact = fulfilled ? 
      this.getPromiseKeptBonus(promise.importance) : 
      this.getPromiseBrokenPenalty(promise.importance);
    
    memory.relationshipLevel += impact;
    memory.trustLevel += impact;

    this.addRelationshipMilestone(characterId, {
      type: fulfilled ? 'promise_kept' : 'promise_broken',
      description: `Promise ${fulfilled ? 'kept' : 'broken'}: ${promise.content}`,
      impact,
      significance: promise.importance === 'critical' ? 'major' : 'moderate'
    });

    this.saveMemories();
  }

  // Add emotional moment
  addEmotionalMoment(
    characterId: string,
    moment: Omit<EmotionalMoment, 'id' | 'date' | 'recovery'>
  ): void {
    const memory = this.memories.get(characterId);
    if (!memory) return;

    const emotionalMoment: EmotionalMoment = {
      ...moment,
      id: `emotion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(),
      recovery: 0
    };

    memory.emotionalMoments.push(emotionalMoment);
    
    // Emotional moments affect relationship
    const impact = this.getEmotionalImpact(moment.emotion, moment.intensity);
    memory.relationshipLevel += impact;

    this.saveMemories();
  }

  // Add relationship milestone
  addRelationshipMilestone(
    characterId: string,
    milestone: Omit<RelationshipMilestone, 'id' | 'date'>
  ): void {
    const memory = this.memories.get(characterId);
    if (!memory) return;

    const newMilestone: RelationshipMilestone = {
      ...milestone,
      id: `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date()
    };

    memory.relationshipMilestones.push(newMilestone);
    this.saveMemories();
  }

  // Get conversation references for character responses
  getConversationReferences(characterId: string, topic?: string): string[] {
    const memory = this.memories.get(characterId);
    if (!memory) return [];

    const references: string[] = [];

    // Recent conversation references
    const recentSummaries = memory.conversationSummaries.slice(-3);
    recentSummaries.forEach(summary => {
      if (!topic || summary.mainTopics.includes(topic)) {
        references.push(`Remember when we talked about ${summary.mainTopics[0]}?`);
      }
    });

    // Shared secret references
    if (memory.sharedSecrets.length > 0) {
      references.push("Given what you've told me in confidence...");
    }

    // Promise references
    const unfulfilled = memory.promisesMade.filter(p => !p.fulfilled);
    if (unfulfilled.length > 0) {
      references.push(`About that promise you made regarding ${unfulfilled[0].content}...`);
    }

    // Emotional moment references
    const significantMoments = memory.emotionalMoments.filter(m => m.intensity >= 7);
    if (significantMoments.length > 0) {
      const lastMoment = significantMoments[significantMoments.length - 1];
      references.push(`I still remember how ${lastMoment.emotion} you were about ${lastMoment.trigger}`);
    }

    return references.slice(0, 2); // Limit to 2 references per response
  }

  // Helper methods
  private calculateMemoryStrength(characterId: string): number {
    // Base memory strength varies by character type
    // Scholars have better memory, simple folk have worse memory
    return Math.floor(Math.random() * 40) + 60; // 60-100
  }

  private getSecretTrustBonus(importance: SharedSecret['importance']): number {
    const bonuses = { minor: 5, moderate: 10, major: 20, critical: 35 };
    return bonuses[importance];
  }

  private getPromiseKeptBonus(importance: Promise['importance']): number {
    const bonuses = { minor: 10, moderate: 20, major: 35, critical: 50 };
    return bonuses[importance];
  }

  private getPromiseBrokenPenalty(importance: Promise['importance']): number {
    const penalties = { minor: -15, moderate: -30, major: -50, critical: -75 };
    return penalties[importance];
  }

  private getEmotionalImpact(emotion: EmotionalMoment['emotion'], intensity: number): number {
    const positiveEmotions = ['joy', 'love', 'surprise'];
    const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust', 'betrayal'];
    
    if (positiveEmotions.includes(emotion)) {
      return Math.floor(intensity * 2);
    } else if (negativeEmotions.includes(emotion)) {
      return Math.floor(intensity * -2);
    }
    return 0;
  }

  // Persistence methods
  private saveMemories(): void {
    try {
      const memoriesData = Array.from(this.memories.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memoriesData));
    } catch (error) {
      console.error('Failed to save conversation memories:', error);
    }
  }

  private loadMemories(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const memoriesData = JSON.parse(stored);
        this.memories = new Map(memoriesData.map(([key, value]: [string, any]) => [
          key,
          {
            ...value,
            firstMeeting: new Date(value.firstMeeting),
            lastInteraction: new Date(value.lastInteraction),
            lastMemoryUpdate: new Date(value.lastMemoryUpdate),
            conversationSummaries: value.conversationSummaries.map((s: any) => ({
              ...s,
              date: new Date(s.date)
            })),
            sharedSecrets: value.sharedSecrets.map((s: any) => ({
              ...s,
              dateShared: new Date(s.dateShared)
            })),
            promisesMade: value.promisesMade.map((p: any) => ({
              ...p,
              dateMade: new Date(p.dateMade),
              deadline: p.deadline ? new Date(p.deadline) : undefined
            })),
            emotionalMoments: value.emotionalMoments.map((e: any) => ({
              ...e,
              date: new Date(e.date)
            })),
            relationshipMilestones: value.relationshipMilestones.map((m: any) => ({
              ...m,
              date: new Date(m.date)
            })),
            personalDetails: value.personalDetails.map((d: any) => ({
              ...d,
              dateShared: new Date(d.dateShared)
            })),
            preferences: value.preferences.map((p: any) => ({
              ...p,
              dateDiscovered: new Date(p.dateDiscovered)
            }))
          }
        ]));
      }
    } catch (error) {
      console.error('Failed to load conversation memories:', error);
      this.memories = new Map();
    }
  }

  // Public getters for analytics
  getAllMemories(): Map<string, ConversationMemory> {
    return new Map(this.memories);
  }

  getMemoryStats(): {
    totalCharacters: number;
    totalConversations: number;
    averageRelationship: number;
    secretsShared: number;
    promisesMade: number;
    promisesKept: number;
  } {
    const memories = Array.from(this.memories.values());
    
    return {
      totalCharacters: memories.length,
      totalConversations: memories.reduce((sum, m) => sum + m.totalConversations, 0),
      averageRelationship: memories.length > 0 ? 
        memories.reduce((sum, m) => sum + m.relationshipLevel, 0) / memories.length : 0,
      secretsShared: memories.reduce((sum, m) => sum + m.sharedSecrets.length, 0),
      promisesMade: memories.reduce((sum, m) => sum + m.promisesMade.length, 0),
      promisesKept: memories.reduce((sum, m) => 
        sum + m.promisesMade.filter(p => p.fulfilled).length, 0)
    };
  }
}
