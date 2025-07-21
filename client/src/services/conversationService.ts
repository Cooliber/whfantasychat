import type { 
  TavernCharacterData, 
  ConversationData,
  Region,
  TavernReputation,
  CustomerSatisfaction,
  CulturalEvent
} from '../types/warhammer.types';

// Advanced Conversation System Imports
import { ConversationMemoryManager } from './conversationMemoryService';
import { EmotionalIntelligenceManager } from './emotionalIntelligenceService';
import { VoicePersonalityManager } from './voicePersonalityService';
import { AdvancedDialogueManager } from './advancedDialogueService';
import { GroupConversationManager } from './groupConversationService';
import { ConversationMinigamesManager } from './conversationMinigamesService';
import { DynamicQuestGenerator } from './dynamicQuestService';

// Enhanced Conversation Types
export interface ConversationContext {
  currentScene: string;
  activeEvents: Map<string, CulturalEvent>;
  tavernReputation: TavernReputation;
  customerSatisfaction: CustomerSatisfaction;
  currentRegion: Region;
  recentNews: string[];
  activeRumors: string[];
  playerReputation: number;
}

export interface DialogueOption {
  id: string;
  text: string;
  type: 'information' | 'quest' | 'trade' | 'social' | 'secret' | 'cultural' | 'faction';
  requirements?: {
    skills?: string[];
    reputation?: number;
    factionStanding?: { faction: string; minimum: number };
    items?: string[];
    secrets?: string[];
  };
  consequences: {
    relationshipChange?: number;
    reputationChange?: number;
    informationGained?: string[];
    questsUnlocked?: string[];
    secretsRevealed?: string[];
    moodChange?: string;
  };
  responseStyle: 'friendly' | 'formal' | 'suspicious' | 'enthusiastic' | 'dismissive' | 'secretive';
}

export interface ConversationResponse {
  text: string;
  emotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'suspicious' | 'neutral' | 'excited' | 'worried';
  followUpOptions: DialogueOption[];
  informationRevealed?: string[];
  relationshipImpact: number;
  conversationEnded: boolean;
}

// Advanced Conversation Engine
export class ConversationEngine {
  // Advanced conversation system managers
  private memoryManager: ConversationMemoryManager;
  private emotionalManager: EmotionalIntelligenceManager;
  private voiceManager: VoicePersonalityManager;
  private dialogueManager: AdvancedDialogueManager;
  private groupManager: GroupConversationManager;
  private minigamesManager: ConversationMinigamesManager;
  private questGenerator: DynamicQuestGenerator;

  constructor() {
    this.memoryManager = new ConversationMemoryManager();
    this.emotionalManager = new EmotionalIntelligenceManager();
    this.voiceManager = new VoicePersonalityManager();
    this.dialogueManager = new AdvancedDialogueManager();
    this.groupManager = new GroupConversationManager();
    this.minigamesManager = new ConversationMinigamesManager();
    this.questGenerator = new DynamicQuestGenerator();
  }
  private static readonly CONVERSATION_STARTERS: Record<string, string[]> = {
    'greeting': [
      "Greetings, friend! What brings you to our humble tavern?",
      "Welcome, traveler! The road must have been long - what news do you bring?",
      "Ah, a new face! Come, sit by the fire and share a drink with us.",
      "Well met! I don't believe we've been introduced. I am {name}.",
      "Good {timeOfDay}! You look like someone with interesting stories to tell."
    ],
    'regional_news': [
      "Have you heard the latest from {region}? Quite concerning, if you ask me.",
      "The news from {region} has everyone talking. What do you make of it?",
      "A merchant just arrived from {region} with the most peculiar tale...",
      "They say strange things are happening in {region}. Have you heard anything?"
    ],
    'tavern_comment': [
      "This tavern has quite the atmosphere tonight, wouldn't you say?",
      "I've been coming here for years, and I must say the {aspect} has really improved.",
      "Have you tried the {regionalDrink}? It's a local specialty.",
      "The entertainment tonight is quite exceptional, don't you think?"
    ],
    'faction_politics': [
      "The tensions between {faction1} and {faction2} are getting worse, I fear.",
      "I hear {faction} is making moves that could affect us all.",
      "As someone who deals with {faction}, I can tell you they're not happy about recent events.",
      "The political situation is becoming quite... complicated, wouldn't you agree?"
    ]
  };

  static generateConversationStarter(
    character: TavernCharacterData,
    context: ConversationContext,
    playerCharacter?: { reputation: number; knownSecrets: string[] }
  ): string {
    const starterTypes = ['greeting', 'regional_news', 'tavern_comment', 'faction_politics'];
    
    // Weight starter types based on character personality and context
    const weights = this.calculateStarterWeights(character, context);
    const selectedType = this.weightedRandomSelect(weights);
    
    const starters = this.CONVERSATION_STARTERS[selectedType];
    let starter = starters[Math.floor(Math.random() * starters.length)];
    
    // Replace placeholders with contextual information
    starter = this.replacePlaceholders(starter, character, context);
    
    return starter;
  }

  private static calculateStarterWeights(
    character: TavernCharacterData,
    context: ConversationContext
  ): Record<string, number> {
    const weights = {
      'greeting': 3, // Base weight
      'regional_news': 2,
      'tavern_comment': 2,
      'faction_politics': 1
    };

    // Adjust based on character traits
    if (character.personalityTraits.includes('Curious')) {
      weights.regional_news += 2;
    }
    if (character.personalityTraits.includes('Social')) {
      weights.greeting += 2;
      weights.tavern_comment += 1;
    }
    if (character.personalityTraits.includes('Political')) {
      weights.faction_politics += 3;
    }

    // Adjust based on context
    if (context.recentNews.length > 0) {
      weights.regional_news += 2;
    }
    if (context.activeEvents.size > 0) {
      weights.tavern_comment += 2;
    }
    if (context.tavernReputation.overall > 70) {
      weights.tavern_comment += 1;
    }

    return weights;
  }

  private static replacePlaceholders(
    text: string,
    character: TavernCharacterData,
    context: ConversationContext
  ): string {
    const replacements: Record<string, string> = {
      '{name}': character.name,
      '{region}': context.currentRegion,
      '{timeOfDay}': this.getTimeOfDay(),
      '{aspect}': this.getRandomTavernAspect(),
      '{regionalDrink}': this.getRegionalDrink(context.currentRegion),
      '{faction}': this.getRandomFaction(character),
      '{faction1}': 'Empire',
      '{faction2}': 'Bretonnia'
    };

    let result = text;
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      result = result.replace(new RegExp(placeholder, 'g'), replacement);
    });

    return result;
  }

  static generateDialogueOptions(
    character: TavernCharacterData,
    context: ConversationContext,
    conversationHistory: string[],
    playerReputation: number
  ): DialogueOption[] {
    const options: DialogueOption[] = [];

    // Always include basic social options
    options.push(this.createBasicSocialOption(character));
    
    // Add information gathering options
    if (this.canGatherInformation(character, playerReputation)) {
      options.push(this.createInformationOption(character, context));
    }

    // Add quest-related options
    if (this.hasQuestPotential(character, context)) {
      options.push(this.createQuestOption(character, context));
    }

    // Add trade options for merchants
    if (character.characterClass === 'Merchant' || character.skills.includes('Haggle')) {
      options.push(this.createTradeOption(character));
    }

    // Add secret investigation options
    if (this.canInvestigateSecrets(character, playerReputation, conversationHistory)) {
      options.push(this.createSecretOption(character));
    }

    // Add cultural exchange options
    if (this.canDiscussCulture(character, context)) {
      options.push(this.createCulturalOption(character, context));
    }

    // Add faction-related options
    if (this.hasFactionRelevance(character, context)) {
      options.push(this.createFactionOption(character, context));
    }

    return options.slice(0, 6); // Limit to 6 options for UI clarity
  }

  private static createBasicSocialOption(character: TavernCharacterData): DialogueOption {
    const socialTexts = [
      "How are you finding the evening?",
      "What brings you to this tavern tonight?",
      "I'd love to hear about your travels.",
      "Tell me about yourself, friend."
    ];

    return {
      id: 'social-basic',
      text: socialTexts[Math.floor(Math.random() * socialTexts.length)],
      type: 'social',
      consequences: {
        relationshipChange: 5,
        moodChange: 'friendly'
      },
      responseStyle: character.conversationPreferences.responseStyle
    };
  }

  private static createInformationOption(
    character: TavernCharacterData,
    context: ConversationContext
  ): DialogueOption {
    const infoTexts = [
      "What news do you have from the roads?",
      "Have you heard any interesting rumors lately?",
      "What's the word about recent events in the region?",
      "Any interesting gossip from your travels?"
    ];

    return {
      id: 'info-gather',
      text: infoTexts[Math.floor(Math.random() * infoTexts.length)],
      type: 'information',
      requirements: {
        reputation: 10
      },
      consequences: {
        informationGained: context.recentNews.slice(0, 2),
        relationshipChange: 3
      },
      responseStyle: 'friendly'
    };
  }

  private static createQuestOption(
    character: TavernCharacterData,
    context: ConversationContext
  ): DialogueOption {
    const questTexts = [
      "Do you know of any work that needs doing around here?",
      "I'm looking for opportunities to help the community.",
      "Are there any tasks that could use an extra pair of hands?",
      "I heard you might know of some work for a capable person."
    ];

    return {
      id: 'quest-inquiry',
      text: questTexts[Math.floor(Math.random() * questTexts.length)],
      type: 'quest',
      requirements: {
        reputation: 25
      },
      consequences: {
        questsUnlocked: ['random-quest'],
        relationshipChange: 10
      },
      responseStyle: 'enthusiastic'
    };
  }

  private static createTradeOption(character: TavernCharacterData): DialogueOption {
    return {
      id: 'trade-inquiry',
      text: "I'm interested in doing some business. What do you have to offer?",
      type: 'trade',
      requirements: {
        skills: ['Haggle']
      },
      consequences: {
        informationGained: ['Trade Opportunities'],
        relationshipChange: 5
      },
      responseStyle: 'formal'
    };
  }

  private static createSecretOption(character: TavernCharacterData): DialogueOption {
    const secretTexts = [
      "You seem like someone who knows more than they let on...",
      "I get the feeling there's more to your story.",
      "Something tells me you're not just an ordinary traveler.",
      "I sense there's something you're not telling me."
    ];

    return {
      id: 'secret-probe',
      text: secretTexts[Math.floor(Math.random() * secretTexts.length)],
      type: 'secret',
      requirements: {
        skills: ['Investigation'],
        reputation: 40
      },
      consequences: {
        secretsRevealed: ['character-hint'],
        relationshipChange: -5, // Risky to probe
        moodChange: 'suspicious'
      },
      responseStyle: 'secretive'
    };
  }

  private static createCulturalOption(
    character: TavernCharacterData,
    context: ConversationContext
  ): DialogueOption {
    const culturalTexts = [
      `Tell me about the customs of ${character.race} people.`,
      "I'm fascinated by different cultures. What's unique about your homeland?",
      "What traditions does your people hold most dear?",
      "I'd love to learn more about your cultural background."
    ];

    return {
      id: 'cultural-exchange',
      text: culturalTexts[Math.floor(Math.random() * culturalTexts.length)],
      type: 'cultural',
      consequences: {
        informationGained: ['Cultural Knowledge'],
        relationshipChange: 8,
        reputationChange: 2
      },
      responseStyle: 'friendly'
    };
  }

  private static createFactionOption(
    character: TavernCharacterData,
    context: ConversationContext
  ): DialogueOption {
    const factionTexts = [
      "What's your take on the current political situation?",
      "How do you see the relations between the different factions?",
      "The political climate seems tense lately. What are your thoughts?",
      "As someone with connections, what's your view on recent developments?"
    ];

    return {
      id: 'faction-politics',
      text: factionTexts[Math.floor(Math.random() * factionTexts.length)],
      type: 'faction',
      requirements: {
        reputation: 30
      },
      consequences: {
        informationGained: ['Political Intelligence'],
        relationshipChange: 5
      },
      responseStyle: 'formal'
    };
  }

  // Helper methods for option availability
  private static canGatherInformation(character: TavernCharacterData, playerReputation: number): boolean {
    return playerReputation >= 10 && character.conversationPreferences.initiationLikelihood > 0.3;
  }

  private static hasQuestPotential(character: TavernCharacterData, context: ConversationContext): boolean {
    return character.goals.length > 0 || context.activeEvents.size > 0;
  }

  private static canInvestigateSecrets(
    character: TavernCharacterData,
    playerReputation: number,
    conversationHistory: string[]
  ): boolean {
    return character.characterSecrets.size > 0 && 
           playerReputation >= 40 && 
           conversationHistory.length >= 2;
  }

  private static canDiscussCulture(character: TavernCharacterData, context: ConversationContext): boolean {
    return character.race !== 'Empire' || context.currentRegion !== 'Empire';
  }

  private static hasFactionRelevance(character: TavernCharacterData, context: ConversationContext): boolean {
    return character.factionStandings.size > 0 || character.socialStanding.rank >= 5;
  }

  // Utility methods
  private static weightedRandomSelect(weights: Record<string, number>): string {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [item, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) return item;
    }
    
    return Object.keys(weights)[0];
  }

  private static getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private static getRandomTavernAspect(): string {
    const aspects = ['atmosphere', 'service', 'food', 'drink', 'entertainment', 'cleanliness'];
    return aspects[Math.floor(Math.random() * aspects.length)];
  }

  private static getRegionalDrink(region: Region): string {
    const drinks: Record<Region, string[]> = {
      'Empire': ['Empire Ale', 'Reikland Wine'],
      'Bretonnia': ['Bretonnian Wine', 'Noble Brandy'],
      'Dwarf Holds': ['Dwarf Ale', 'Clan Whiskey'],
      'Elf Enclaves': ['Elven Wine', 'Moonwine'],
      'Kislev': ['Vodka', 'Ice Wine'],
      'Tilea': ['Tilean Wine', 'Grappa'],
      'Estalia': ['Sherry', 'Sangria'],
      'Border Princes': ['Frontier Brew', 'Mixed Spirits'],
      'Norsca': ['Mead', 'Battle Brew']
    };
    
    const regionDrinks = drinks[region] || ['Local Ale'];
    return regionDrinks[Math.floor(Math.random() * regionDrinks.length)];
  }

  private static getRandomFaction(character: TavernCharacterData): string {
    const factions = Array.from(character.factionStandings.keys());
    return factions.length > 0 ? factions[Math.floor(Math.random() * factions.length)] : 'Empire';
  }

  // Enhanced conversation method using all advanced features
  async startEnhancedConversation(
    character: TavernCharacterData,
    playerName: string,
    context: ConversationContext
  ): Promise<{
    response: ConversationData;
    availableOptions: any[];
    memoryReferences: string[];
    emotionalState: any;
    voiceProfile: any;
    questOpportunities: any[];
    minigameOptions: any[];
  }> {
    // Initialize or get character memory
    const memory = this.memoryManager.getCharacterMemory(character.id, playerName);

    // Initialize emotional state
    let emotionalState = this.emotionalManager.getEmotionalState(character.id);
    if (!emotionalState) {
      emotionalState = this.emotionalManager.initializeEmotionalState(character);
    }

    // Get or generate voice profile
    let voiceProfile = this.voiceManager.getVoiceProfile(character.id);
    if (!voiceProfile) {
      voiceProfile = this.voiceManager.generateVoiceProfile(character);
    }

    // Initialize dialogue trees
    this.dialogueManager.initializeCharacterDialogue(character);

    // Get relationship dynamics
    const relationship = this.emotionalManager.getRelationshipDynamics(character.id, playerName) ||
      this.emotionalManager.initializeRelationshipDynamics(character.id, playerName);

    // Get available dialogue options
    const availableOptions = this.dialogueManager.getAvailableDialogueOptions(
      character.id,
      memory,
      relationship,
      { playerName, context }
    );

    // Get memory references for natural conversation flow
    const memoryReferences = this.memoryManager.getConversationReferences(character.id);

    // Generate enhanced greeting with voice profile
    const greeting = this.voiceManager.generateGreeting(
      character.id,
      this.getTimeOfDay(),
      relationship.relationshipStatus
    );

    // Apply voice profile to greeting
    const enhancedGreeting = this.voiceManager.applyVoiceProfile(
      character.id,
      greeting,
      {
        emotion: emotionalState.dominantEmotion,
        formality: voiceProfile.formalityLevel,
        relationship: relationship.relationshipStatus
      }
    );

    // Check for quest opportunities
    const questOpportunities = this.checkForQuestOpportunities(character, memory, relationship, context);

    // Check for minigame opportunities
    const minigameOptions = this.checkForMinigameOpportunities(character, relationship, context);

    // Generate base conversation response
    const baseResponse = this.generateConversation(character, 'greeting', context);

    // Enhance response with memory references
    if (memoryReferences.length > 0 && Math.random() < 0.3) {
      const reference = memoryReferences[Math.floor(Math.random() * memoryReferences.length)];
      baseResponse.response = `${reference} ${baseResponse.response}`;
    }

    // Apply voice profile to response
    baseResponse.response = this.voiceManager.applyVoiceProfile(
      character.id,
      baseResponse.response,
      {
        emotion: emotionalState.dominantEmotion,
        formality: voiceProfile.formalityLevel,
        relationship: relationship.relationshipStatus
      }
    );

    return {
      response: baseResponse,
      availableOptions,
      memoryReferences,
      emotionalState,
      voiceProfile,
      questOpportunities,
      minigameOptions
    };
  }

  // Process enhanced conversation turn
  async processEnhancedConversationTurn(
    character: TavernCharacterData,
    playerName: string,
    playerInput: string,
    dialogueType: string,
    context: ConversationContext
  ): Promise<{
    response: ConversationData;
    emotionalResponse: any;
    memoryUpdates: any[];
    relationshipChange: number;
    questsGenerated: any[];
    nextOptions: any[];
  }> {
    const memory = this.memoryManager.getCharacterMemory(character.id, playerName);
    const relationship = this.emotionalManager.getRelationshipDynamics(character.id, playerName)!;

    // Process emotional response to player input
    const emotionalResponse = this.emotionalManager.processEmotionalResponse(
      character.id,
      dialogueType,
      playerInput,
      { memory, relationship, context }
    );

    // Generate conversation response
    const baseResponse = this.generateConversation(character, dialogueType as any, context);

    // Apply voice profile with emotional context
    const voiceProfile = this.voiceManager.getVoiceProfile(character.id)!;
    baseResponse.response = this.voiceManager.applyVoiceProfile(
      character.id,
      baseResponse.response,
      {
        emotion: emotionalResponse.newDominantEmotion,
        formality: voiceProfile.formalityLevel,
        relationship: relationship.relationshipStatus
      }
    );

    // Add emotional reaction to response
    baseResponse.response = `${emotionalResponse.emotionalReaction} ${baseResponse.response}`;

    // Update conversation memory
    this.memoryManager.addConversationSummary(character.id, {
      date: new Date(),
      duration: 5, // Estimated duration
      mainTopics: [dialogueType],
      outcome: emotionalResponse.relationshipImpact > 0 ? 'positive' : 'negative',
      relationshipChange: emotionalResponse.relationshipImpact,
      keyMoments: [playerInput],
      questsDiscovered: [],
      secretsRevealed: []
    });

    // Check for dynamic quest generation
    const questsGenerated = this.checkAndGenerateQuests(character, memory, relationship, {
      topics: [dialogueType],
      emotions: [emotionalResponse.newDominantEmotion],
      relationships: relationship,
      memory,
      playerActions: [playerInput]
    });

    // Get next dialogue options
    const nextOptions = this.dialogueManager.getAvailableDialogueOptions(
      character.id,
      memory,
      relationship,
      { playerName, context }
    );

    return {
      response: baseResponse,
      emotionalResponse,
      memoryUpdates: [],
      relationshipChange: emotionalResponse.relationshipImpact,
      questsGenerated,
      nextOptions
    };
  }

  // Helper methods for enhanced features
  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private checkForQuestOpportunities(
    character: TavernCharacterData,
    memory: any,
    relationship: any,
    context: ConversationContext
  ): any[] {
    const opportunities = [];

    // Check relationship threshold for personal quests
    if (relationship.friendship > 40) {
      opportunities.push({
        type: 'personal_quest',
        title: `Help ${character.name} with a personal matter`,
        requirements: ['Trust level: Medium'],
        description: 'A personal quest opportunity has emerged'
      });
    }

    // Check for regional quest opportunities
    if (context.recentNews.length > 0) {
      opportunities.push({
        type: 'regional_quest',
        title: 'Investigate recent events',
        requirements: ['Local knowledge'],
        description: 'Recent news suggests opportunities for involvement'
      });
    }

    return opportunities;
  }

  private checkForMinigameOpportunities(
    character: TavernCharacterData,
    relationship: any,
    context: ConversationContext
  ): any[] {
    const opportunities = [];

    // Persuasion contest
    if (relationship.trustLevel < 70) {
      opportunities.push({
        type: 'persuasion',
        title: 'Persuasion Contest',
        description: 'Try to convince them of your point of view',
        difficulty: 'Medium'
      });
    }

    // Information trading
    if (character.characterClass === 'Merchant' || character.skills.includes('Gossip')) {
      opportunities.push({
        type: 'information_trading',
        title: 'Information Exchange',
        description: 'Trade information and secrets',
        difficulty: 'Easy'
      });
    }

    // Drinking contest
    if (context.currentScene.includes('tavern') && Math.random() < 0.3) {
      opportunities.push({
        type: 'drinking_contest',
        title: 'Drinking Contest',
        description: 'Challenge them to a friendly drinking competition',
        difficulty: 'Variable'
      });
    }

    // Storytelling contest
    if (character.skills.includes('Storytelling') || character.characterClass === 'Bard') {
      opportunities.push({
        type: 'storytelling',
        title: 'Storytelling Contest',
        description: 'Compete in a tale-telling competition',
        difficulty: 'Hard'
      });
    }

    return opportunities;
  }

  private checkAndGenerateQuests(
    character: TavernCharacterData,
    memory: any,
    relationship: any,
    conversationContext: any
  ): any[] {
    const quests = [];

    // Try to generate quest from conversation
    const generatedQuest = this.questGenerator.generateQuestFromConversation(
      character,
      `conv-${Date.now()}`,
      conversationContext
    );

    if (generatedQuest) {
      quests.push(generatedQuest);
    }

    return quests;
  }

  // Public getters for advanced features
  getMemoryManager(): ConversationMemoryManager {
    return this.memoryManager;
  }

  getEmotionalManager(): EmotionalIntelligenceManager {
    return this.emotionalManager;
  }

  getVoiceManager(): VoicePersonalityManager {
    return this.voiceManager;
  }

  getDialogueManager(): AdvancedDialogueManager {
    return this.dialogueManager;
  }

  getGroupManager(): GroupConversationManager {
    return this.groupManager;
  }

  getMinigamesManager(): ConversationMinigamesManager {
    return this.minigamesManager;
  }

  getQuestGenerator(): DynamicQuestGenerator {
    return this.questGenerator;
  }
}

// AI-Powered Response Generator
export class ConversationResponseGenerator {
  private static readonly RESPONSE_TEMPLATES: Record<string, Record<string, string[]>> = {
    'social': {
      'friendly': [
        "Ah, {playerName}! I'm doing quite well, thank you for asking. {personalDetail}",
        "The evening treats me kindly, friend. {moodReason} How about yourself?",
        "I find myself in good spirits tonight. {contextualComment} What brings you here?",
        "Well enough, well enough! {characterTrait} makes for interesting company."
      ],
      'formal': [
        "I am quite well, thank you for your inquiry. {formalDetail}",
        "The evening progresses satisfactorily. {politicalComment} And yourself?",
        "I find the circumstances agreeable. {businessComment} How may I assist you?",
        "All is as it should be. {dutyComment} What is your business here?"
      ],
      'gruff': [
        "Can't complain, I suppose. {gruffComment}",
        "Been better, been worse. {practicalComment} What's it to you?",
        "Surviving another day. {worldlyComment} You asking for a reason?",
        "Well enough to drink and talk. {directComment} Speak your mind."
      ]
    },
    'information': {
      'friendly': [
        "Oh, I've heard quite a bit! {newsItem} What do you make of it?",
        "There's always something happening on the roads. {rumorItem} Interesting times!",
        "Plenty of talk going around. {gossipItem} Though you didn't hear it from me!",
        "The merchants bring all sorts of news. {tradeNews} Keeps things lively!"
      ],
      'suspicious': [
        "Why do you ask? {suspiciousComment} Information has value, you know.",
        "Depends who's asking... {cautionaryTale} Can't be too careful these days.",
        "I might know something. {vagueThreat} But what's in it for me?",
        "News travels fast, but not for free. {businessProposition}"
      ],
      'secretive': [
        "*leans in closer* {whisperStart} but keep that between us.",
        "*glances around nervously* {secretInfo} - if anyone asks, we never spoke.",
        "*speaks in hushed tones* {confidentialInfo} You understand the discretion required?",
        "*taps nose knowingly* {hintedKnowledge} Some things are better left unsaid."
      ]
    },
    'quest': {
      'enthusiastic': [
        "Actually, yes! {questDescription} It would be perfect for someone like you!",
        "Funny you should ask! {questGiver} was just looking for capable help with {questType}.",
        "There is something, now that you mention it. {questDetails} Interested?",
        "I might know of an opportunity. {questReward} if you're up for {questChallenge}."
      ],
      'cautious': [
        "There might be something... {questWarning} but it's not without risks.",
        "I know of work, but {questDanger}. Still interested?",
        "There's a job, though {questComplexity}. Think you can handle it?",
        "Work exists, but {questRequirement}. Do you meet the qualifications?"
      ]
    },
    'trade': {
      'formal': [
        "I deal in {tradeGoods}. {qualityAssurance} What are you looking for?",
        "My business involves {tradeSpecialty}. {reputationClaim} How can I serve you?",
        "I offer {serviceType} at fair prices. {businessPhilosophy} Shall we negotiate?",
        "Quality {productType} is my specialty. {customerTestimonial} What's your need?"
      ],
      'shrewd': [
        "I might have what you need... {negotiationOpener} for the right price.",
        "Business is business, friend. {marketConditions} What's your offer?",
        "Everything has a price. {valueProposition} What can you afford?",
        "I don't give anything away. {hardBargain} But I'm fair in my dealings."
      ]
    },
    'secret': {
      'defensive': [
        "I don't know what you're implying. {denial} I'm just a simple {occupation}.",
        "You're mistaken, friend. {deflection} Perhaps you have me confused with someone else?",
        "That's quite an accusation. {indignation} I've done nothing to warrant such suspicion.",
        "I think you're seeing things that aren't there. {dismissal} Maybe you've had too much to drink?"
      ],
      'nervous': [
        "*shifts uncomfortably* {nervousLaughter} I'm not sure what you mean...",
        "*avoids eye contact* {evasion} Why would you think such a thing?",
        "*fidgets with hands* {anxiousResponse} I really should be going...",
        "*voice wavers slightly* {fearfulReaction} Please, I don't want any trouble."
      ],
      'intrigued': [
        "*raises eyebrow* {curiosity} You're quite perceptive, aren't you?",
        "*leans back, studying you* {assessment} What makes you think that?",
        "*slight smile* {acknowledgment} Perhaps we should speak more privately?",
        "*nods slowly* {respect} You have good instincts. What do you want to know?"
      ]
    }
  };

  static generateResponse(
    character: TavernCharacterData,
    selectedOption: DialogueOption,
    context: ConversationContext,
    relationshipLevel: number
  ): ConversationResponse {
    // Determine response style based on character and relationship
    const responseStyle = this.determineResponseStyle(character, selectedOption, relationshipLevel);

    // Get appropriate response template
    const templates = this.RESPONSE_TEMPLATES[selectedOption.type]?.[responseStyle] ||
                     this.RESPONSE_TEMPLATES['social']['friendly'];

    const template = templates[Math.floor(Math.random() * templates.length)];

    // Generate response text with contextual replacements
    const responseText = this.generateResponseText(template, character, context, selectedOption);

    // Determine emotional state
    const emotion = this.determineEmotion(character, selectedOption, responseStyle);

    // Generate follow-up options
    const followUpOptions = this.generateFollowUpOptions(character, selectedOption, context, relationshipLevel);

    // Calculate relationship impact
    const relationshipImpact = this.calculateRelationshipImpact(
      character, selectedOption, responseStyle, relationshipLevel
    );

    // Determine if conversation should end
    const conversationEnded = this.shouldEndConversation(character, selectedOption, relationshipLevel);

    // Extract information revealed
    const informationRevealed = this.extractInformationRevealed(selectedOption, character, context);

    return {
      text: responseText,
      emotion,
      followUpOptions,
      informationRevealed,
      relationshipImpact,
      conversationEnded
    };
  }

  private static determineResponseStyle(
    character: TavernCharacterData,
    selectedOption: DialogueOption,
    relationshipLevel: number
  ): string {
    // Base style from character preferences
    let baseStyle = character.conversationPreferences.responseStyle;

    // Modify based on option type and relationship
    if (selectedOption.type === 'secret' && relationshipLevel < 30) {
      return 'defensive';
    }

    if (selectedOption.type === 'secret' && relationshipLevel >= 30 && relationshipLevel < 60) {
      return 'nervous';
    }

    if (selectedOption.type === 'secret' && relationshipLevel >= 60) {
      return 'intrigued';
    }

    if (selectedOption.type === 'information' && character.personalityTraits.includes('Suspicious')) {
      return 'suspicious';
    }

    if (selectedOption.type === 'information' && character.characterSecrets.size > 0) {
      return 'secretive';
    }

    if (selectedOption.type === 'quest' && character.personalityTraits.includes('Cautious')) {
      return 'cautious';
    }

    if (selectedOption.type === 'trade' && character.skills.includes('Haggle')) {
      return 'shrewd';
    }

    return baseStyle;
  }

  private static generateResponseText(
    template: string,
    character: TavernCharacterData,
    context: ConversationContext,
    selectedOption: DialogueOption
  ): string {
    const replacements: Record<string, string> = {
      '{playerName}': 'friend', // TODO: Get actual player name
      '{personalDetail}': this.getPersonalDetail(character),
      '{moodReason}': this.getMoodReason(character, context),
      '{contextualComment}': this.getContextualComment(context),
      '{characterTrait}': this.getCharacterTrait(character),
      '{formalDetail}': this.getFormalDetail(character),
      '{politicalComment}': this.getPoliticalComment(character, context),
      '{businessComment}': this.getBusinessComment(character),
      '{dutyComment}': this.getDutyComment(character),
      '{gruffComment}': this.getGruffComment(character),
      '{practicalComment}': this.getPracticalComment(character),
      '{worldlyComment}': this.getWorldlyComment(character),
      '{directComment}': this.getDirectComment(character),
      '{newsItem}': this.getNewsItem(context),
      '{rumorItem}': this.getRumorItem(context),
      '{gossipItem}': this.getGossipItem(context),
      '{tradeNews}': this.getTradeNews(context),
      '{questDescription}': this.getQuestDescription(character),
      '{questGiver}': this.getQuestGiver(character),
      '{questType}': this.getQuestType(character),
      '{questDetails}': this.getQuestDetails(character),
      '{questReward}': this.getQuestReward(character),
      '{questChallenge}': this.getQuestChallenge(character),
      '{tradeGoods}': this.getTradeGoods(character),
      '{occupation}': character.characterClass
    };

    let result = template;
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      result = result.replace(new RegExp(placeholder, 'g'), replacement);
    });

    return result;
  }

  private static determineEmotion(
    character: TavernCharacterData,
    selectedOption: DialogueOption,
    responseStyle: string
  ): ConversationResponse['emotion'] {
    if (responseStyle === 'defensive' || responseStyle === 'suspicious') return 'suspicious';
    if (responseStyle === 'nervous') return 'worried';
    if (responseStyle === 'enthusiastic') return 'excited';
    if (selectedOption.type === 'quest') return 'happy';
    if (selectedOption.type === 'trade') return 'neutral';
    if (character.currentMood === 'Happy') return 'happy';
    if (character.currentMood === 'Sad') return 'sad';
    if (character.currentMood === 'Angry') return 'angry';

    return 'neutral';
  }

  private static generateFollowUpOptions(
    character: TavernCharacterData,
    selectedOption: DialogueOption,
    context: ConversationContext,
    relationshipLevel: number
  ): DialogueOption[] {
    const followUps: DialogueOption[] = [];

    // Add conversation continuation options
    followUps.push({
      id: 'continue-conversation',
      text: "Tell me more about that.",
      type: 'social',
      consequences: { relationshipChange: 2 },
      responseStyle: 'friendly'
    });

    // Add topic-specific follow-ups
    if (selectedOption.type === 'information') {
      followUps.push({
        id: 'ask-details',
        text: "That's fascinating. Do you know any more details?",
        type: 'information',
        consequences: { informationGained: ['Additional Details'] },
        responseStyle: 'curious'
      });
    }

    if (selectedOption.type === 'quest' && relationshipLevel >= 40) {
      followUps.push({
        id: 'accept-quest',
        text: "I'm interested. Tell me what needs to be done.",
        type: 'quest',
        consequences: { questsUnlocked: ['character-quest'] },
        responseStyle: 'determined'
      });
    }

    // Add polite exit option
    followUps.push({
      id: 'end-conversation',
      text: "Thank you for the conversation. I should let you get back to your evening.",
      type: 'social',
      consequences: { relationshipChange: 1 },
      responseStyle: 'polite'
    });

    return followUps.slice(0, 4); // Limit follow-up options
  }

  // Helper methods for generating contextual content
  private static getPersonalDetail(character: TavernCharacterData): string {
    const details = [
      `My work as a ${character.characterClass} keeps me busy`,
      `I've been thinking about ${character.goals[0] || 'the future'}`,
      `The atmosphere here reminds me of home`,
      `I find the company here quite agreeable`
    ];
    return details[Math.floor(Math.random() * details.length)];
  }

  private static getMoodReason(character: TavernCharacterData, context: ConversationContext): string {
    if (context.activeEvents.size > 0) {
      return `The ${Array.from(context.activeEvents.values())[0].name} has everyone in good spirits`;
    }
    return `The ${context.currentScene.toLowerCase()} suits my mood perfectly`;
  }

  private static getContextualComment(context: ConversationContext): string {
    if (context.customerSatisfaction.overall > 70) {
      return "This tavern has such a wonderful atmosphere";
    }
    return "There's always something interesting happening here";
  }

  private static getCharacterTrait(character: TavernCharacterData): string {
    return character.personalityTraits[0] || 'Friendly';
  }

  private static getNewsItem(context: ConversationContext): string {
    return context.recentNews[0] || "Strange weather patterns affecting the harvest";
  }

  private static getQuestDescription(character: TavernCharacterData): string {
    const quests = [
      "A delivery that needs to be made to the next town",
      "Some bandits that need clearing from the trade route",
      "A missing person who needs finding",
      "An investigation that requires a keen mind"
    ];
    return quests[Math.floor(Math.random() * quests.length)];
  }

  // Additional helper methods would continue here...
  private static getFormalDetail(character: TavernCharacterData): string {
    return `My duties as a ${character.characterClass} proceed as expected`;
  }

  private static getPoliticalComment(character: TavernCharacterData, context: ConversationContext): string {
    return `The political situation in ${context.currentRegion} requires careful attention`;
  }

  private static getBusinessComment(character: TavernCharacterData): string {
    return `Business matters require my constant attention`;
  }

  private static getDutyComment(character: TavernCharacterData): string {
    return `Duty calls, as always`;
  }

  private static getGruffComment(character: TavernCharacterData): string {
    return `Life's too short for complaints`;
  }

  private static getPracticalComment(character: TavernCharacterData): string {
    return `That's the way of things`;
  }

  private static getWorldlyComment(character: TavernCharacterData): string {
    return `Seen worse in my travels`;
  }

  private static getDirectComment(character: TavernCharacterData): string {
    return `No point beating around the bush`;
  }

  private static getRumorItem(context: ConversationContext): string {
    return context.activeRumors[0] || "Merchants speak of strange happenings to the north";
  }

  private static getGossipItem(context: ConversationContext): string {
    return "The baker's daughter is getting married next month";
  }

  private static getTradeNews(context: ConversationContext): string {
    return "Trade routes are opening up after the winter";
  }

  private static getQuestGiver(character: TavernCharacterData): string {
    return "The local magistrate";
  }

  private static getQuestType(character: TavernCharacterData): string {
    return "a delicate matter";
  }

  private static getQuestDetails(character: TavernCharacterData): string {
    return "It involves some discretion and skill";
  }

  private static getQuestReward(character: TavernCharacterData): string {
    return "Good coin and better reputation";
  }

  private static getQuestChallenge(character: TavernCharacterData): string {
    return "a bit of risk";
  }

  private static getTradeGoods(character: TavernCharacterData): string {
    return "quality goods from across the region";
  }

  private static calculateRelationshipImpact(
    character: TavernCharacterData,
    selectedOption: DialogueOption,
    responseStyle: string,
    relationshipLevel: number
  ): number {
    let impact = selectedOption.consequences.relationshipChange || 0;

    // Modify based on response style
    if (responseStyle === 'defensive' || responseStyle === 'suspicious') {
      impact -= 2;
    }
    if (responseStyle === 'enthusiastic' || responseStyle === 'friendly') {
      impact += 1;
    }

    // Modify based on character traits
    if (character.personalityTraits.includes('Friendly') && selectedOption.type === 'social') {
      impact += 1;
    }
    if (character.personalityTraits.includes('Suspicious') && selectedOption.type === 'secret') {
      impact -= 3;
    }

    return impact;
  }

  private static shouldEndConversation(
    character: TavernCharacterData,
    selectedOption: DialogueOption,
    relationshipLevel: number
  ): boolean {
    // End conversation if relationship drops too low
    if (relationshipLevel < -20) return true;

    // End if character is uncomfortable with secret probing
    if (selectedOption.type === 'secret' && relationshipLevel < 30) {
      return Math.random() < 0.3;
    }

    // Random chance to end based on character's social preferences
    const endChance = 1 - character.conversationPreferences.initiationLikelihood;
    return Math.random() < endChance * 0.1; // Low base chance
  }

  private static extractInformationRevealed(
    selectedOption: DialogueOption,
    character: TavernCharacterData,
    context: ConversationContext
  ): string[] {
    const info: string[] = [];

    if (selectedOption.consequences.informationGained) {
      info.push(...selectedOption.consequences.informationGained);
    }

    if (selectedOption.type === 'information') {
      info.push(...context.recentNews.slice(0, 1));
    }

    if (selectedOption.type === 'cultural') {
      info.push(`Cultural insight about ${character.race} customs`);
    }

    return info;
  }
}
