import type { 
  TavernCharacterData, 
  ConversationData,
  ConversationContext
} from '../types/warhammer.types';
import { 
  ConversationEngine, 
  ConversationResponseGenerator,
  DialogueOption,
  ConversationResponse 
} from './conversationService';
import { 
  ConversationEventManager,
  ConversationEvent 
} from './conversationEventService';

// Enhanced Conversation State Management
export interface ActiveConversation {
  id: string;
  participantIds: string[];
  startTime: Date;
  lastActivity: Date;
  conversationHistory: Array<{
    speakerId: string;
    text: string;
    timestamp: Date;
    type: 'player' | 'character' | 'system';
  }>;
  relationshipChanges: Record<string, number>;
  informationGathered: string[];
  questsDiscovered: string[];
  secretsRevealed: string[];
  currentMood: string;
  interruptionEvents: ConversationEvent[];
}

export interface ConversationState {
  activeConversations: Map<string, ActiveConversation>;
  globalContext: ConversationContext;
  lastEventTime: number;
  conversationMetrics: {
    totalConversations: number;
    averageLength: number;
    relationshipImpacts: Record<string, number>;
    informationDiscovered: number;
  };
}

export class ConversationManager {
  private conversationState: ConversationState;
  private eventCheckInterval: number = 30000; // Check for events every 30 seconds

  constructor(initialContext: ConversationContext) {
    this.conversationState = {
      activeConversations: new Map(),
      globalContext: initialContext,
      lastEventTime: Date.now(),
      conversationMetrics: {
        totalConversations: 0,
        averageLength: 0,
        relationshipImpacts: {},
        informationDiscovered: 0
      }
    };

    // Start event monitoring
    this.startEventMonitoring();
  }

  // Start a new conversation
  startConversation(
    playerCharacter: { id: string; name: string; reputation: number },
    targetCharacter: TavernCharacterData,
    additionalParticipants: TavernCharacterData[] = []
  ): ActiveConversation {
    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const conversation: ActiveConversation = {
      id: conversationId,
      participantIds: [playerCharacter.id, targetCharacter.id, ...additionalParticipants.map(c => c.id)],
      startTime: new Date(),
      lastActivity: new Date(),
      conversationHistory: [],
      relationshipChanges: {},
      informationGathered: [],
      questsDiscovered: [],
      secretsRevealed: [],
      currentMood: 'neutral',
      interruptionEvents: []
    };

    // Generate opening message from target character
    const openingMessage = ConversationEngine.generateConversationStarter(
      targetCharacter,
      this.conversationState.globalContext,
      { reputation: playerCharacter.reputation, knownSecrets: [] }
    );

    conversation.conversationHistory.push({
      speakerId: targetCharacter.id,
      text: openingMessage,
      timestamp: new Date(),
      type: 'character'
    });

    this.conversationState.activeConversations.set(conversationId, conversation);
    this.conversationState.conversationMetrics.totalConversations++;

    return conversation;
  }

  // Get available dialogue options for a conversation
  getDialogueOptions(
    conversationId: string,
    playerCharacter: { reputation: number; skills: string[] },
    targetCharacter: TavernCharacterData
  ): DialogueOption[] {
    const conversation = this.conversationState.activeConversations.get(conversationId);
    if (!conversation) return [];

    const conversationHistory = conversation.conversationHistory.map(h => h.text);
    const relationshipLevel = this.getRelationshipLevel(targetCharacter.id, conversation);

    return ConversationEngine.generateDialogueOptions(
      targetCharacter,
      this.conversationState.globalContext,
      conversationHistory,
      playerCharacter.reputation
    );
  }

  // Process a player's dialogue choice
  processDialogueChoice(
    conversationId: string,
    selectedOption: DialogueOption,
    playerCharacter: { id: string; name: string; reputation: number },
    targetCharacter: TavernCharacterData
  ): ConversationResponse {
    const conversation = this.conversationState.activeConversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Add player's choice to history
    conversation.conversationHistory.push({
      speakerId: playerCharacter.id,
      text: selectedOption.text,
      timestamp: new Date(),
      type: 'player'
    });

    // Generate character response
    const relationshipLevel = this.getRelationshipLevel(targetCharacter.id, conversation);
    const response = ConversationResponseGenerator.generateResponse(
      targetCharacter,
      selectedOption,
      this.conversationState.globalContext,
      relationshipLevel
    );

    // Add character response to history
    conversation.conversationHistory.push({
      speakerId: targetCharacter.id,
      text: response.text,
      timestamp: new Date(),
      type: 'character'
    });

    // Update conversation state
    this.updateConversationState(conversation, selectedOption, response, targetCharacter.id);

    // Check for random events
    this.checkForConversationEvents(conversationId);

    return response;
  }

  // Update conversation state based on dialogue
  private updateConversationState(
    conversation: ActiveConversation,
    selectedOption: DialogueOption,
    response: ConversationResponse,
    characterId: string
  ): void {
    conversation.lastActivity = new Date();

    // Update relationship changes
    if (response.relationshipImpact !== 0) {
      conversation.relationshipChanges[characterId] = 
        (conversation.relationshipChanges[characterId] || 0) + response.relationshipImpact;
    }

    // Add information gathered
    if (response.informationRevealed) {
      conversation.informationGathered.push(...response.informationRevealed);
      this.conversationState.conversationMetrics.informationDiscovered += response.informationRevealed.length;
    }

    // Add quests discovered
    if (selectedOption.consequences.questsUnlocked) {
      conversation.questsDiscovered.push(...selectedOption.consequences.questsUnlocked);
    }

    // Add secrets revealed
    if (selectedOption.consequences.secretsRevealed) {
      conversation.secretsRevealed.push(...selectedOption.consequences.secretsRevealed);
    }

    // Update mood
    if (selectedOption.consequences.moodChange) {
      conversation.currentMood = selectedOption.consequences.moodChange;
    }
  }

  // Check for and process conversation events
  private checkForConversationEvents(conversationId: string): void {
    const conversation = this.conversationState.activeConversations.get(conversationId);
    if (!conversation) return;

    const conversationDuration = Date.now() - conversation.startTime.getTime();
    const tavernActivity = this.calculateTavernActivity();

    if (ConversationEventManager.shouldTriggerEvent(
      conversationDuration,
      this.conversationState.lastEventTime,
      tavernActivity
    )) {
      const activeCharacters = this.getActiveCharacters(conversation.participantIds);
      const event = ConversationEventManager.generateRandomEvent(
        this.conversationState.globalContext,
        activeCharacters
      );

      if (event) {
        this.processConversationEvent(conversationId, event, activeCharacters);
      }
    }
  }

  // Process a conversation event
  private processConversationEvent(
    conversationId: string,
    event: ConversationEvent,
    activeCharacters: TavernCharacterData[]
  ): void {
    const conversation = this.conversationState.activeConversations.get(conversationId);
    if (!conversation) return;

    // Process event impact
    const eventResult = ConversationEventManager.processEventImpact(
      event,
      activeCharacters,
      this.conversationState.globalContext
    );

    // Update global context
    this.conversationState.globalContext = eventResult.updatedContext;

    // Add event to conversation
    conversation.interruptionEvents.push(event);

    // Add system message about the event
    const eventDescription = ConversationEventManager.getEventDescription(
      event,
      this.conversationState.globalContext
    );

    conversation.conversationHistory.push({
      speakerId: 'system',
      text: `*${eventDescription}*`,
      timestamp: new Date(),
      type: 'system'
    });

    // Add character reactions
    eventResult.characterReactions.forEach(reaction => {
      conversation.conversationHistory.push({
        speakerId: reaction.characterId,
        text: `*${reaction.reaction}*`,
        timestamp: new Date(),
        type: 'character'
      });
    });

    this.conversationState.lastEventTime = Date.now();
  }

  // End a conversation
  endConversation(conversationId: string): {
    summary: string;
    relationshipChanges: Record<string, number>;
    informationGathered: string[];
    questsDiscovered: string[];
    secretsRevealed: string[];
    duration: number;
  } {
    const conversation = this.conversationState.activeConversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const duration = conversation.lastActivity.getTime() - conversation.startTime.getTime();
    
    // Update metrics
    const currentAverage = this.conversationState.conversationMetrics.averageLength;
    const totalConversations = this.conversationState.conversationMetrics.totalConversations;
    this.conversationState.conversationMetrics.averageLength = 
      (currentAverage * (totalConversations - 1) + duration) / totalConversations;

    // Update relationship impacts
    Object.entries(conversation.relationshipChanges).forEach(([characterId, change]) => {
      this.conversationState.conversationMetrics.relationshipImpacts[characterId] = 
        (this.conversationState.conversationMetrics.relationshipImpacts[characterId] || 0) + change;
    });

    const summary = this.generateConversationSummary(conversation);

    // Remove from active conversations
    this.conversationState.activeConversations.delete(conversationId);

    return {
      summary,
      relationshipChanges: conversation.relationshipChanges,
      informationGathered: conversation.informationGathered,
      questsDiscovered: conversation.questsDiscovered,
      secretsRevealed: conversation.secretsRevealed,
      duration
    };
  }

  // Generate conversation summary
  private generateConversationSummary(conversation: ActiveConversation): string {
    const duration = Math.round((conversation.lastActivity.getTime() - conversation.startTime.getTime()) / 60000);
    const messageCount = conversation.conversationHistory.length;
    const relationshipChanges = Object.values(conversation.relationshipChanges).reduce((sum, change) => sum + change, 0);
    
    let summary = `Conversation lasted ${duration} minutes with ${messageCount} exchanges. `;
    
    if (relationshipChanges > 10) {
      summary += "The conversation went very well, strengthening relationships. ";
    } else if (relationshipChanges > 0) {
      summary += "The conversation was pleasant and improved relations. ";
    } else if (relationshipChanges < -10) {
      summary += "The conversation was tense and damaged relationships. ";
    } else {
      summary += "The conversation was neutral with mixed results. ";
    }

    if (conversation.informationGathered.length > 0) {
      summary += `You learned ${conversation.informationGathered.length} new pieces of information. `;
    }

    if (conversation.questsDiscovered.length > 0) {
      summary += `${conversation.questsDiscovered.length} new opportunities were discovered. `;
    }

    if (conversation.secretsRevealed.length > 0) {
      summary += `Some secrets were revealed during the conversation. `;
    }

    if (conversation.interruptionEvents.length > 0) {
      summary += `The conversation was interrupted by ${conversation.interruptionEvents.length} tavern events. `;
    }

    return summary.trim();
  }

  // Helper methods
  private getRelationshipLevel(characterId: string, conversation: ActiveConversation): number {
    return conversation.relationshipChanges[characterId] || 0;
  }

  private calculateTavernActivity(): number {
    const activeConversationCount = this.conversationState.activeConversations.size;
    const baseActivity = Math.min(100, activeConversationCount * 20);
    
    // Adjust for time of day
    const hour = new Date().getHours();
    let timeMultiplier = 1;
    if (hour >= 18 && hour <= 22) timeMultiplier = 1.5; // Evening peak
    if (hour >= 2 && hour <= 6) timeMultiplier = 0.3; // Late night low
    
    return Math.round(baseActivity * timeMultiplier);
  }

  private getActiveCharacters(participantIds: string[]): TavernCharacterData[] {
    // This would need to be implemented to fetch actual character data
    // For now, return empty array
    return [];
  }

  private startEventMonitoring(): void {
    setInterval(() => {
      // Check all active conversations for potential events
      this.conversationState.activeConversations.forEach((conversation, conversationId) => {
        this.checkForConversationEvents(conversationId);
      });
    }, this.eventCheckInterval);
  }

  // Public getters for conversation state
  getActiveConversations(): Map<string, ActiveConversation> {
    return new Map(this.conversationState.activeConversations);
  }

  getConversationMetrics() {
    return { ...this.conversationState.conversationMetrics };
  }

  updateGlobalContext(newContext: Partial<ConversationContext>): void {
    this.conversationState.globalContext = {
      ...this.conversationState.globalContext,
      ...newContext
    };
  }
}
