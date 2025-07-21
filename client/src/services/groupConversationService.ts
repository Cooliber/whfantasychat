import type { TavernCharacterData } from '../types/warhammer.types';
import type { ConversationMemory } from './conversationMemoryService';
import type { RelationshipDynamics } from './emotionalIntelligenceService';

// Group Conversation Types
export interface GroupConversation {
  id: string;
  participants: string[]; // Character IDs including player
  initiator: string; // Who started the conversation
  topic: string;
  currentSpeaker: string;
  speakingOrder: string[];
  
  // Group dynamics
  dominanceHierarchy: Record<string, number>; // Character ID -> dominance level (0-100)
  socialTensions: Array<{
    character1: string;
    character2: string;
    tension: number; // 0-100
    reason: string;
  }>;
  
  // Conversation state
  messages: GroupMessage[];
  activeSubtopics: string[];
  conversationMood: 'friendly' | 'tense' | 'formal' | 'casual' | 'heated' | 'intimate';
  
  // Interruption and flow control
  interruptionQueue: Array<{
    characterId: string;
    urgency: number; // 0-100
    reason: string;
    intendedMessage: string;
  }>;
  
  // Group memory
  sharedExperiences: string[];
  groupSecrets: string[];
  establishedDynamics: Record<string, any>;
  
  startTime: Date;
  lastActivity: Date;
}

export interface GroupMessage {
  id: string;
  speakerId: string;
  content: string;
  timestamp: Date;
  type: 'speech' | 'action' | 'interruption' | 'aside' | 'group_reaction';
  
  // Message metadata
  addressedTo?: string[]; // Specific characters being addressed
  emotionalTone: string;
  volume: 'whisper' | 'normal' | 'loud' | 'shout';
  
  // Reactions from other participants
  reactions: Record<string, {
    type: 'agreement' | 'disagreement' | 'surprise' | 'amusement' | 'concern' | 'indifference';
    intensity: number; // 0-100
    verbalResponse?: string;
    physicalResponse?: string;
  }>;
}

export interface GroupDynamics {
  // Social hierarchy
  socialRanking: Array<{
    characterId: string;
    rank: number;
    influence: number;
    respect: number;
  }>;
  
  // Alliances and conflicts
  alliances: Array<{
    members: string[];
    strength: number; // 0-100
    type: 'friendship' | 'business' | 'romantic' | 'family' | 'political';
    formed: Date;
  }>;
  
  conflicts: Array<{
    participants: string[];
    severity: number; // 0-100
    type: 'personal' | 'professional' | 'ideological' | 'romantic' | 'cultural';
    origin: string;
  }>;
  
  // Communication patterns
  communicationStyles: Record<string, {
    talkativeLevel: number; // 0-100
    interruptionTendency: number; // 0-100
    listeningSkill: number; // 0-100
    empathy: number; // 0-100
  }>;
}

// Group Conversation Manager
export class GroupConversationManager {
  private activeGroupConversations: Map<string, GroupConversation> = new Map();
  private groupDynamicsCache: Map<string, GroupDynamics> = new Map(); // Participant hash -> dynamics

  // Start a group conversation
  startGroupConversation(
    participants: TavernCharacterData[],
    initiator: string,
    topic: string,
    context: any
  ): GroupConversation {
    const conversationId = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const participantIds = participants.map(p => p.id);
    const groupDynamics = this.calculateGroupDynamics(participants);
    
    const conversation: GroupConversation = {
      id: conversationId,
      participants: participantIds,
      initiator,
      topic,
      currentSpeaker: initiator,
      speakingOrder: this.determineSpeakingOrder(participants, groupDynamics),
      dominanceHierarchy: this.calculateDominanceHierarchy(participants),
      socialTensions: this.identifySocialTensions(participants),
      messages: [],
      activeSubtopics: [topic],
      conversationMood: this.determineInitialMood(participants, topic),
      interruptionQueue: [],
      sharedExperiences: this.findSharedExperiences(participants),
      groupSecrets: [],
      establishedDynamics: {},
      startTime: new Date(),
      lastActivity: new Date()
    };

    // Generate opening message
    const openingMessage = this.generateOpeningMessage(initiator, topic, participants);
    this.addMessage(conversation, openingMessage);

    this.activeGroupConversations.set(conversationId, conversation);
    return conversation;
  }

  // Add a message to the group conversation
  addMessage(conversation: GroupConversation, message: Omit<GroupMessage, 'id' | 'timestamp' | 'reactions'>): void {
    const fullMessage: GroupMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      reactions: {}
    };

    // Generate reactions from other participants
    conversation.participants.forEach(participantId => {
      if (participantId !== message.speakerId) {
        const reaction = this.generateCharacterReaction(
          participantId,
          fullMessage,
          conversation
        );
        fullMessage.reactions[participantId] = reaction;
      }
    });

    conversation.messages.push(fullMessage);
    conversation.lastActivity = new Date();

    // Update conversation mood based on message
    this.updateConversationMood(conversation, fullMessage);

    // Check for interruptions
    this.processInterruptions(conversation, fullMessage);
  }

  // Get next speaker in the conversation
  getNextSpeaker(conversation: GroupConversation): string {
    const currentIndex = conversation.speakingOrder.indexOf(conversation.currentSpeaker);
    const nextIndex = (currentIndex + 1) % conversation.speakingOrder.length;
    
    // Check for interruptions first
    if (conversation.interruptionQueue.length > 0) {
      const highestUrgency = Math.max(...conversation.interruptionQueue.map(i => i.urgency));
      const urgentInterruption = conversation.interruptionQueue.find(i => i.urgency === highestUrgency);
      
      if (urgentInterruption && urgentInterruption.urgency > 70) {
        // Remove from queue and return interrupter
        conversation.interruptionQueue = conversation.interruptionQueue.filter(i => i !== urgentInterruption);
        return urgentInterruption.characterId;
      }
    }
    
    return conversation.speakingOrder[nextIndex];
  }

  // Generate character response in group context
  generateGroupResponse(
    characterId: string,
    conversation: GroupConversation,
    characterData: TavernCharacterData,
    memory: ConversationMemory
  ): GroupMessage {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const groupContext = this.analyzeGroupContext(conversation, characterId);
    
    // Determine response type
    const responseType = this.determineResponseType(characterData, groupContext, lastMessage);
    
    // Generate content based on character personality and group dynamics
    const content = this.generateResponseContent(
      characterData,
      conversation,
      groupContext,
      responseType,
      memory
    );
    
    // Determine who the character is addressing
    const addressedTo = this.determineAddressees(characterData, conversation, lastMessage);
    
    return {
      id: '', // Will be set by addMessage
      speakerId: characterId,
      content,
      timestamp: new Date(),
      type: responseType,
      addressedTo,
      emotionalTone: this.determineEmotionalTone(characterData, groupContext),
      volume: this.determineVolume(characterData, conversation.conversationMood),
      reactions: {}
    };
  }

  // Calculate group dynamics
  private calculateGroupDynamics(participants: TavernCharacterData[]): GroupDynamics {
    const participantHash = participants.map(p => p.id).sort().join('-');
    
    // Check cache first
    if (this.groupDynamicsCache.has(participantHash)) {
      return this.groupDynamicsCache.get(participantHash)!;
    }

    const dynamics: GroupDynamics = {
      socialRanking: this.calculateSocialRanking(participants),
      alliances: this.identifyAlliances(participants),
      conflicts: this.identifyConflicts(participants),
      communicationStyles: this.analyzeCommunicationStyles(participants)
    };

    this.groupDynamicsCache.set(participantHash, dynamics);
    return dynamics;
  }

  // Calculate social ranking within the group
  private calculateSocialRanking(participants: TavernCharacterData[]): GroupDynamics['socialRanking'] {
    return participants.map(character => {
      let rank = character.socialStanding.rank;
      let influence = character.socialStanding.influence;
      let respect = 50; // Base respect

      // Adjust based on character class
      if (character.characterClass === 'Noble') {
        rank += 20;
        influence += 15;
        respect += 20;
      } else if (character.characterClass === 'Scholar') {
        influence += 10;
        respect += 15;
      } else if (character.characterClass === 'Soldier') {
        respect += 10;
      }

      // Adjust based on age and experience
      if (character.age > 50) {
        respect += 10;
        influence += 5;
      }

      return {
        characterId: character.id,
        rank: Math.min(100, rank),
        influence: Math.min(100, influence),
        respect: Math.min(100, respect)
      };
    }).sort((a, b) => b.rank - a.rank);
  }

  // Identify alliances between characters
  private identifyAlliances(participants: TavernCharacterData[]): GroupDynamics['alliances'] {
    const alliances: GroupDynamics['alliances'] = [];

    // Check for racial/cultural alliances
    const raceGroups = new Map<string, string[]>();
    participants.forEach(char => {
      if (!raceGroups.has(char.race)) {
        raceGroups.set(char.race, []);
      }
      raceGroups.get(char.race)!.push(char.id);
    });

    raceGroups.forEach((members, race) => {
      if (members.length > 1) {
        alliances.push({
          members,
          strength: 60,
          type: 'cultural',
          formed: new Date()
        } as any);
      }
    });

    // Check for class-based alliances
    const classGroups = new Map<string, string[]>();
    participants.forEach(char => {
      if (!classGroups.has(char.characterClass)) {
        classGroups.set(char.characterClass, []);
      }
      classGroups.get(char.characterClass)!.push(char.id);
    });

    classGroups.forEach((members, characterClass) => {
      if (members.length > 1) {
        alliances.push({
          members,
          strength: 40,
          type: 'professional',
          formed: new Date()
        } as any);
      }
    });

    return alliances;
  }

  // Identify potential conflicts
  private identifyConflicts(participants: TavernCharacterData[]): GroupDynamics['conflicts'] {
    const conflicts: GroupDynamics['conflicts'] = [];

    // Check for racial tensions
    const racialTensions = [
      { races: ['Empire', 'Bretonnia'], severity: 30, type: 'political' },
      { races: ['Dwarf', 'Elf'], severity: 40, type: 'cultural' },
      { races: ['Empire', 'Border Princes'], severity: 25, type: 'ideological' }
    ];

    racialTensions.forEach(tension => {
      const participants1 = participants.filter(p => p.race === tension.races[0]);
      const participants2 = participants.filter(p => p.race === tension.races[1]);

      if (participants1.length > 0 && participants2.length > 0) {
        conflicts.push({
          participants: [...participants1.map(p => p.id), ...participants2.map(p => p.id)],
          severity: tension.severity,
          type: tension.type as any,
          origin: `Historical tensions between ${tension.races[0]} and ${tension.races[1]}`
        });
      }
    });

    return conflicts;
  }

  // Analyze communication styles
  private analyzeCommunicationStyles(participants: TavernCharacterData[]): GroupDynamics['communicationStyles'] {
    const styles: GroupDynamics['communicationStyles'] = {};

    participants.forEach(character => {
      let talkativeLevel = 50;
      let interruptionTendency = 30;
      let listeningSkill = 50;
      let empathy = 50;

      // Adjust based on personality traits
      if (character.personalityTraits.includes('Talkative')) talkativeLevel += 30;
      if (character.personalityTraits.includes('Quiet')) talkativeLevel -= 30;
      if (character.personalityTraits.includes('Aggressive')) interruptionTendency += 25;
      if (character.personalityTraits.includes('Patient')) listeningSkill += 20;
      if (character.personalityTraits.includes('Empathetic')) empathy += 25;

      // Adjust based on character class
      if (character.characterClass === 'Scholar') {
        listeningSkill += 15;
        talkativeLevel += 10;
      } else if (character.characterClass === 'Soldier') {
        interruptionTendency += 15;
        talkativeLevel -= 10;
      } else if (character.characterClass === 'Noble') {
        talkativeLevel += 20;
        empathy -= 10;
      }

      styles[character.id] = {
        talkativeLevel: Math.max(0, Math.min(100, talkativeLevel)),
        interruptionTendency: Math.max(0, Math.min(100, interruptionTendency)),
        listeningSkill: Math.max(0, Math.min(100, listeningSkill)),
        empathy: Math.max(0, Math.min(100, empathy))
      };
    });

    return styles;
  }

  // Determine speaking order based on social dynamics
  private determineSpeakingOrder(participants: TavernCharacterData[], dynamics: GroupDynamics): string[] {
    // Sort by social ranking, but add some randomness
    const ranked = dynamics.socialRanking.slice().sort((a, b) => {
      const rankDiff = b.rank - a.rank;
      const randomFactor = (Math.random() - 0.5) * 20; // ±10 points of randomness
      return rankDiff + randomFactor;
    });

    return ranked.map(r => r.characterId);
  }

  // Calculate dominance hierarchy
  private calculateDominanceHierarchy(participants: TavernCharacterData[]): Record<string, number> {
    const hierarchy: Record<string, number> = {};

    participants.forEach(character => {
      let dominance = character.socialStanding.rank;
      
      // Adjust based on personality
      if (character.personalityTraits.includes('Dominant')) dominance += 20;
      if (character.personalityTraits.includes('Submissive')) dominance -= 20;
      if (character.personalityTraits.includes('Confident')) dominance += 15;
      if (character.personalityTraits.includes('Shy')) dominance -= 15;

      hierarchy[character.id] = Math.max(0, Math.min(100, dominance));
    });

    return hierarchy;
  }

  // Identify social tensions
  private identifySocialTensions(participants: TavernCharacterData[]): GroupConversation['socialTensions'] {
    const tensions: GroupConversation['socialTensions'] = [];

    // Check all pairs of participants
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const char1 = participants[i];
        const char2 = participants[j];
        
        let tension = 0;
        let reason = '';

        // Racial tensions
        if (char1.race !== char2.race) {
          tension += 10;
          reason = 'Cultural differences';
        }

        // Class tensions
        if (char1.background?.socialClass !== char2.background?.socialClass) {
          const classTension = Math.abs(
            (char1.socialStanding.rank || 0) - (char2.socialStanding.rank || 0)
          );
          tension += classTension / 5;
          reason = reason ? `${reason}, Social class differences` : 'Social class differences';
        }

        // Personality conflicts
        const conflictingTraits = [
          ['Aggressive', 'Peaceful'],
          ['Dominant', 'Submissive'],
          ['Talkative', 'Quiet']
        ];

        conflictingTraits.forEach(([trait1, trait2]) => {
          if (char1.personalityTraits.includes(trait1) && char2.personalityTraits.includes(trait2) ||
              char1.personalityTraits.includes(trait2) && char2.personalityTraits.includes(trait1)) {
            tension += 15;
            reason = reason ? `${reason}, Personality conflicts` : 'Personality conflicts';
          }
        });

        if (tension > 20) {
          tensions.push({
            character1: char1.id,
            character2: char2.id,
            tension: Math.min(100, tension),
            reason
          });
        }
      }
    }

    return tensions;
  }

  // Helper methods for response generation
  private determineInitialMood(participants: TavernCharacterData[], topic: string): GroupConversation['conversationMood'] {
    // Analyze participant moods and topic to determine overall mood
    const moods = participants.map(p => p.currentMood);
    
    if (moods.includes('Angry')) return 'tense';
    if (moods.filter(m => m === 'Happy').length > participants.length / 2) return 'friendly';
    if (topic.includes('business') || topic.includes('formal')) return 'formal';
    
    return 'casual';
  }

  private findSharedExperiences(participants: TavernCharacterData[]): string[] {
    // Find common experiences based on character backgrounds
    const experiences: string[] = [];
    
    // Check for common regions
    const regions = participants.map(p => p.background?.birthplace).filter(Boolean);
    const commonRegions = regions.filter((region, index) => regions.indexOf(region) !== index);
    commonRegions.forEach(region => experiences.push(`Shared origins in ${region}`));
    
    return experiences;
  }

  private generateOpeningMessage(initiator: string, topic: string, participants: TavernCharacterData[]): Omit<GroupMessage, 'id' | 'timestamp' | 'reactions'> {
    const initiatorChar = participants.find(p => p.id === initiator);
    const otherParticipants = participants.filter(p => p.id !== initiator);
    
    let content = '';
    if (otherParticipants.length === 1) {
      content = `${otherParticipants[0].name}, I wanted to discuss ${topic} with you.`;
    } else {
      const names = otherParticipants.map(p => p.name).join(', ');
      content = `${names}, I thought we should talk about ${topic}.`;
    }

    return {
      speakerId: initiator,
      content,
      type: 'speech',
      emotionalTone: 'neutral',
      volume: 'normal',
      addressedTo: otherParticipants.map(p => p.id)
    };
  }

  private generateCharacterReaction(
    characterId: string,
    message: GroupMessage,
    conversation: GroupConversation
  ): GroupMessage['reactions'][string] {
    // Generate reaction based on character personality and message content
    const reactionTypes = ['agreement', 'disagreement', 'surprise', 'amusement', 'concern', 'indifference'] as const;
    const type = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
    
    return {
      type,
      intensity: Math.floor(Math.random() * 100),
      verbalResponse: this.generateVerbalReaction(type),
      physicalResponse: this.generatePhysicalReaction(type)
    };
  }

  private generateVerbalReaction(type: string): string {
    const reactions: Record<string, string[]> = {
      agreement: ['Indeed!', 'Quite right!', 'I agree completely.', 'Exactly my thoughts.'],
      disagreement: ['I beg to differ.', 'That\'s not quite right.', 'I see it differently.', 'Nonsense!'],
      surprise: ['Really?', 'You don\'t say!', 'How unexpected!', 'Well, I never!'],
      amusement: ['*chuckles*', 'How amusing!', 'That\'s quite funny!', '*laughs*'],
      concern: ['That\'s troubling.', 'I\'m worried about that.', 'This concerns me.', 'How unfortunate.'],
      indifference: ['Hmm.', 'I see.', 'If you say so.', '*shrugs*']
    };

    const options = reactions[type] || ['*nods*'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private generatePhysicalReaction(type: string): string {
    const reactions: Record<string, string[]> = {
      agreement: ['*nods vigorously*', '*leans forward*', '*smiles*'],
      disagreement: ['*shakes head*', '*frowns*', '*crosses arms*'],
      surprise: ['*raises eyebrows*', '*leans back*', '*eyes widen*'],
      amusement: ['*grins*', '*chuckles*', '*eyes twinkle*'],
      concern: ['*furrows brow*', '*looks worried*', '*shifts uncomfortably*'],
      indifference: ['*shrugs*', '*looks away*', '*examines fingernails*']
    };

    const options = reactions[type] || ['*remains still*'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private updateConversationMood(conversation: GroupConversation, message: GroupMessage): void {
    // Update mood based on message content and reactions
    const positiveReactions = Object.values(message.reactions).filter(r => 
      ['agreement', 'amusement'].includes(r.type)
    ).length;
    
    const negativeReactions = Object.values(message.reactions).filter(r => 
      ['disagreement', 'concern'].includes(r.type)
    ).length;

    if (negativeReactions > positiveReactions) {
      if (conversation.conversationMood === 'friendly') conversation.conversationMood = 'casual';
      else if (conversation.conversationMood === 'casual') conversation.conversationMood = 'tense';
    } else if (positiveReactions > negativeReactions) {
      if (conversation.conversationMood === 'tense') conversation.conversationMood = 'casual';
      else if (conversation.conversationMood === 'casual') conversation.conversationMood = 'friendly';
    }
  }

  private processInterruptions(conversation: GroupConversation, message: GroupMessage): void {
    // Check if any character wants to interrupt based on the message
    conversation.participants.forEach(participantId => {
      if (participantId !== message.speakerId) {
        const interruptionChance = this.calculateInterruptionChance(participantId, message, conversation);
        
        if (Math.random() < interruptionChance) {
          conversation.interruptionQueue.push({
            characterId: participantId,
            urgency: Math.floor(Math.random() * 100),
            reason: 'Strong reaction to statement',
            intendedMessage: 'I must interject here...'
          });
        }
      }
    });
  }

  private calculateInterruptionChance(characterId: string, message: GroupMessage, conversation: GroupConversation): number {
    // Base chance is low
    let chance = 0.1;

    // Increase if character has high interruption tendency
    const dynamics = this.groupDynamicsCache.get(conversation.participants.sort().join('-'));
    if (dynamics) {
      const style = dynamics.communicationStyles[characterId];
      if (style) {
        chance += style.interruptionTendency / 1000; // Convert to 0-0.1 range
      }
    }

    // Increase if message is addressed to them
    if (message.addressedTo?.includes(characterId)) {
      chance += 0.2;
    }

    // Increase if conversation mood is heated
    if (conversation.conversationMood === 'heated' || conversation.conversationMood === 'tense') {
      chance += 0.15;
    }

    return Math.min(0.5, chance); // Cap at 50%
  }

  private analyzeGroupContext(conversation: GroupConversation, characterId: string): any {
    return {
      dominanceLevel: conversation.dominanceHierarchy[characterId] || 50,
      tensions: conversation.socialTensions.filter(t => 
        t.character1 === characterId || t.character2 === characterId
      ),
      mood: conversation.conversationMood,
      participantCount: conversation.participants.length
    };
  }

  private determineResponseType(character: TavernCharacterData, context: any, lastMessage: GroupMessage): GroupMessage['type'] {
    if (context.tensions.length > 0 && Math.random() < 0.3) return 'interruption';
    if (character.personalityTraits.includes('Dramatic') && Math.random() < 0.2) return 'action';
    return 'speech';
  }

  private generateResponseContent(
    character: TavernCharacterData,
    conversation: GroupConversation,
    context: any,
    responseType: string,
    memory: ConversationMemory
  ): string {
    // Generate contextual response based on character and group dynamics
    const responses = [
      `As a ${character.characterClass}, I believe...`,
      `In my experience...`,
      `That reminds me of...`,
      `I must say...`,
      `From my perspective...`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private determineAddressees(character: TavernCharacterData, conversation: GroupConversation, lastMessage: GroupMessage): string[] {
    // Determine who the character is responding to
    if (lastMessage.addressedTo?.includes(character.id)) {
      return [lastMessage.speakerId];
    }
    
    // Address the group
    return conversation.participants.filter(id => id !== character.id);
  }

  private determineEmotionalTone(character: TavernCharacterData, context: any): string {
    const tones = ['friendly', 'neutral', 'serious', 'playful', 'concerned'];
    return tones[Math.floor(Math.random() * tones.length)];
  }

  private determineVolume(character: TavernCharacterData, mood: string): GroupMessage['volume'] {
    if (mood === 'heated') return 'loud';
    if (character.personalityTraits.includes('Quiet')) return 'whisper';
    return 'normal';
  }

  // Public getters
  getGroupConversation(conversationId: string): GroupConversation | undefined {
    return this.activeGroupConversations.get(conversationId);
  }

  getAllGroupConversations(): Map<string, GroupConversation> {
    return new Map(this.activeGroupConversations);
  }

  endGroupConversation(conversationId: string): void {
    this.activeGroupConversations.delete(conversationId);
  }
}
