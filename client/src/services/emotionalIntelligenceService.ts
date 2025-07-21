import type { TavernCharacterData } from '../types/warhammer.types';
import type { ConversationMemory } from './conversationMemoryService';

// Emotional Intelligence Types
export interface EmotionalState {
  characterId: string;
  
  // Primary emotions (0-100 intensity)
  primaryEmotions: {
    happiness: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  
  // Secondary emotions (0-100 intensity)
  secondaryEmotions: {
    love: number;
    hate: number;
    trust: number;
    suspicion: number;
    pride: number;
    shame: number;
    nostalgia: number;
    anticipation: number;
    jealousy: number;
    gratitude: number;
  };
  
  // Current dominant emotion
  dominantEmotion: string;
  emotionalIntensity: number; // 0-100
  
  // Emotional stability and volatility
  emotionalStability: number; // 0-100 (higher = more stable)
  emotionalVolatility: number; // 0-100 (higher = more volatile)
  
  // Emotional recovery rate
  recoveryRate: number; // How quickly emotions return to baseline
  
  // Last emotional update
  lastUpdate: Date;
}

export interface RelationshipDynamics {
  characterId: string;
  playerId: string;
  
  // Relationship types and intensities
  friendship: number; // 0-100
  romance: number; // 0-100
  rivalry: number; // 0-100
  mentorship: number; // 0-100
  
  // Relationship status
  relationshipStatus: 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'best_friend' |
                     'romantic_interest' | 'lover' | 'rival' | 'enemy' | 'mentor' | 'student';
  
  // Trust and respect levels
  trustLevel: number; // 0-100
  respectLevel: number; // 0-100
  
  // Emotional bonds
  emotionalBonds: Array<{
    type: 'shared_secret' | 'shared_experience' | 'mutual_support' | 'conflict_resolution' | 'betrayal';
    strength: number; // 0-100
    dateFormed: Date;
    description: string;
  }>;
  
  // Grudges and grievances
  grudges: Array<{
    cause: string;
    severity: number; // 0-100
    dateOccurred: Date;
    forgiveness: number; // 0-100 (how much they've forgiven)
    resolution?: string;
  }>;
  
  // Romantic progression (if applicable)
  romanticProgression?: {
    stage: 'attraction' | 'interest' | 'courtship' | 'commitment' | 'marriage';
    compatibility: number; // 0-100
    obstacles: string[];
    milestones: Array<{
      type: string;
      date: Date;
      description: string;
    }>;
  };
}

export interface EmotionalTrigger {
  id: string;
  triggerType: 'topic' | 'action' | 'person' | 'situation' | 'memory';
  trigger: string;
  emotionalResponse: {
    emotion: string;
    intensity: number;
    duration: number; // minutes
  };
  personalRelevance: number; // 0-100
  traumaLevel: number; // 0-100
  healingProgress: number; // 0-100
}

// Emotional Intelligence Manager
export class EmotionalIntelligenceManager {
  private emotionalStates: Map<string, EmotionalState> = new Map();
  private relationshipDynamics: Map<string, RelationshipDynamics> = new Map();
  private emotionalTriggers: Map<string, EmotionalTrigger[]> = new Map();

  // Initialize emotional state for a character
  initializeEmotionalState(character: TavernCharacterData): EmotionalState {
    const emotionalState: EmotionalState = {
      characterId: character.id,
      primaryEmotions: this.generateBaseEmotions(character),
      secondaryEmotions: this.generateSecondaryEmotions(character),
      dominantEmotion: this.determineDominantEmotion(character),
      emotionalIntensity: this.calculateEmotionalIntensity(character),
      emotionalStability: this.calculateEmotionalStability(character),
      emotionalVolatility: this.calculateEmotionalVolatility(character),
      recoveryRate: this.calculateRecoveryRate(character),
      lastUpdate: new Date()
    };

    this.emotionalStates.set(character.id, emotionalState);
    return emotionalState;
  }

  // Initialize relationship dynamics
  initializeRelationshipDynamics(characterId: string, playerId: string): RelationshipDynamics {
    const dynamics: RelationshipDynamics = {
      characterId,
      playerId,
      friendship: 10, // Start with minimal friendship
      romance: 0,
      rivalry: 0,
      mentorship: 0,
      relationshipStatus: 'stranger',
      trustLevel: 50, // Neutral starting trust
      respectLevel: 50, // Neutral starting respect
      emotionalBonds: [],
      grudges: []
    };

    const key = `${characterId}-${playerId}`;
    this.relationshipDynamics.set(key, dynamics);
    return dynamics;
  }

  // Process emotional response to dialogue
  processEmotionalResponse(
    characterId: string,
    dialogueType: string,
    playerAction: string,
    conversationContext: any
  ): {
    emotionalChange: Record<string, number>;
    newDominantEmotion: string;
    relationshipImpact: number;
    emotionalReaction: string;
  } {
    const emotionalState = this.emotionalStates.get(characterId);
    if (!emotionalState) {
      throw new Error(`No emotional state found for character ${characterId}`);
    }

    // Calculate emotional response based on action and character personality
    const emotionalResponse = this.calculateEmotionalResponse(
      emotionalState,
      dialogueType,
      playerAction,
      conversationContext
    );

    // Update emotional state
    this.updateEmotionalState(characterId, emotionalResponse.emotionalChange);

    // Update relationship dynamics
    const relationshipImpact = this.updateRelationshipDynamics(
      characterId,
      'player', // TODO: Get actual player ID
      emotionalResponse
    );

    return {
      emotionalChange: emotionalResponse.emotionalChange,
      newDominantEmotion: this.determineDominantEmotionFromState(emotionalState),
      relationshipImpact,
      emotionalReaction: this.generateEmotionalReaction(emotionalState, emotionalResponse)
    };
  }

  // Calculate emotional response to player actions
  private calculateEmotionalResponse(
    emotionalState: EmotionalState,
    dialogueType: string,
    playerAction: string,
    context: any
  ): {
    emotionalChange: Record<string, number>;
    intensity: number;
    duration: number;
  } {
    const emotionalChange: Record<string, number> = {};
    let intensity = 10; // Base intensity
    let duration = 5; // Base duration in minutes

    // Response based on dialogue type
    switch (dialogueType) {
      case 'social':
        emotionalChange.happiness = 5;
        emotionalChange.trust = 3;
        break;
      case 'quest':
        emotionalChange.anticipation = 8;
        emotionalChange.trust = 5;
        intensity = 15;
        break;
      case 'trade':
        emotionalChange.trust = 2;
        emotionalChange.suspicion = -2;
        break;
      case 'secret':
        if (playerAction.includes('probe') || playerAction.includes('investigate')) {
          emotionalChange.suspicion = 15;
          emotionalChange.fear = 10;
          emotionalChange.trust = -10;
          intensity = 25;
        }
        break;
      case 'cultural':
        emotionalChange.happiness = 8;
        emotionalChange.pride = 10;
        emotionalChange.gratitude = 5;
        break;
      case 'faction':
        emotionalChange.pride = 5;
        emotionalChange.suspicion = 3;
        break;
    }

    // Adjust based on current emotional state
    if (emotionalState.emotionalVolatility > 70) {
      intensity *= 1.5; // More volatile characters react more strongly
    }
    if (emotionalState.emotionalStability < 30) {
      duration *= 2; // Less stable characters take longer to recover
    }

    return { emotionalChange, intensity, duration };
  }

  // Update emotional state
  private updateEmotionalState(characterId: string, emotionalChange: Record<string, number>): void {
    const state = this.emotionalStates.get(characterId);
    if (!state) return;

    // Apply emotional changes
    Object.entries(emotionalChange).forEach(([emotion, change]) => {
      if (emotion in state.primaryEmotions) {
        state.primaryEmotions[emotion as keyof typeof state.primaryEmotions] = 
          Math.max(0, Math.min(100, 
            state.primaryEmotions[emotion as keyof typeof state.primaryEmotions] + change
          ));
      } else if (emotion in state.secondaryEmotions) {
        state.secondaryEmotions[emotion as keyof typeof state.secondaryEmotions] = 
          Math.max(0, Math.min(100, 
            state.secondaryEmotions[emotion as keyof typeof state.secondaryEmotions] + change
          ));
      }
    });

    // Update dominant emotion and intensity
    state.dominantEmotion = this.determineDominantEmotionFromState(state);
    state.emotionalIntensity = this.calculateCurrentIntensity(state);
    state.lastUpdate = new Date();
  }

  // Update relationship dynamics
  private updateRelationshipDynamics(
    characterId: string,
    playerId: string,
    emotionalResponse: any
  ): number {
    const key = `${characterId}-${playerId}`;
    let dynamics = this.relationshipDynamics.get(key);
    
    if (!dynamics) {
      dynamics = this.initializeRelationshipDynamics(characterId, playerId);
    }

    let relationshipImpact = 0;

    // Update based on emotional response
    if (emotionalResponse.emotionalChange.trust > 0) {
      dynamics.trustLevel += emotionalResponse.emotionalChange.trust;
      dynamics.friendship += Math.floor(emotionalResponse.emotionalChange.trust / 2);
      relationshipImpact += emotionalResponse.emotionalChange.trust;
    }

    if (emotionalResponse.emotionalChange.suspicion > 0) {
      dynamics.trustLevel -= emotionalResponse.emotionalChange.suspicion;
      dynamics.rivalry += Math.floor(emotionalResponse.emotionalChange.suspicion / 3);
      relationshipImpact -= emotionalResponse.emotionalChange.suspicion;
    }

    if (emotionalResponse.emotionalChange.happiness > 0) {
      dynamics.friendship += Math.floor(emotionalResponse.emotionalChange.happiness / 3);
      relationshipImpact += Math.floor(emotionalResponse.emotionalChange.happiness / 2);
    }

    // Clamp values
    dynamics.trustLevel = Math.max(0, Math.min(100, dynamics.trustLevel));
    dynamics.respectLevel = Math.max(0, Math.min(100, dynamics.respectLevel));
    dynamics.friendship = Math.max(0, Math.min(100, dynamics.friendship));
    dynamics.romance = Math.max(0, Math.min(100, dynamics.romance));
    dynamics.rivalry = Math.max(0, Math.min(100, dynamics.rivalry));
    dynamics.mentorship = Math.max(0, Math.min(100, dynamics.mentorship));

    // Update relationship status
    dynamics.relationshipStatus = this.determineRelationshipStatus(dynamics);

    this.relationshipDynamics.set(key, dynamics);
    return relationshipImpact;
  }

  // Generate emotional reaction text
  private generateEmotionalReaction(
    emotionalState: EmotionalState,
    emotionalResponse: any
  ): string {
    const reactions: Record<string, string[]> = {
      happiness: [
        "*smiles warmly*", "*eyes light up*", "*chuckles softly*", "*grins broadly*"
      ],
      sadness: [
        "*looks downcast*", "*sighs heavily*", "*eyes grow misty*", "*shoulders slump*"
      ],
      anger: [
        "*frowns deeply*", "*clenches jaw*", "*eyes flash with anger*", "*voice hardens*"
      ],
      fear: [
        "*glances around nervously*", "*voice wavers*", "*takes a step back*", "*eyes widen*"
      ],
      surprise: [
        "*raises eyebrows*", "*blinks in surprise*", "*mouth opens slightly*", "*leans forward*"
      ],
      trust: [
        "*nods approvingly*", "*relaxes visibly*", "*leans in closer*", "*speaks more openly*"
      ],
      suspicion: [
        "*narrows eyes*", "*crosses arms*", "*leans back*", "*studies you carefully*"
      ],
      pride: [
        "*straightens up*", "*chin lifts*", "*speaks with conviction*", "*chest swells*"
      ]
    };

    // Find the strongest emotional change
    let strongestEmotion = 'happiness';
    let strongestChange = 0;

    Object.entries(emotionalResponse.emotionalChange).forEach(([emotion, change]) => {
      if (Math.abs(change) > Math.abs(strongestChange)) {
        strongestEmotion = emotion;
        strongestChange = change;
      }
    });

    const emotionReactions = reactions[strongestEmotion] || reactions.happiness;
    return emotionReactions[Math.floor(Math.random() * emotionReactions.length)];
  }

  // Helper methods for character initialization
  private generateBaseEmotions(character: TavernCharacterData): EmotionalState['primaryEmotions'] {
    const baseEmotions = {
      happiness: 50,
      sadness: 20,
      anger: 15,
      fear: 10,
      surprise: 5,
      disgust: 5
    };

    // Adjust based on character traits
    if (character.personalityTraits.includes('Cheerful')) {
      baseEmotions.happiness += 20;
      baseEmotions.sadness -= 10;
    }
    if (character.personalityTraits.includes('Melancholic')) {
      baseEmotions.sadness += 20;
      baseEmotions.happiness -= 10;
    }
    if (character.personalityTraits.includes('Aggressive')) {
      baseEmotions.anger += 15;
    }
    if (character.personalityTraits.includes('Cautious')) {
      baseEmotions.fear += 10;
    }

    // Clamp values
    Object.keys(baseEmotions).forEach(key => {
      baseEmotions[key as keyof typeof baseEmotions] = Math.max(0, Math.min(100, 
        baseEmotions[key as keyof typeof baseEmotions]
      ));
    });

    return baseEmotions;
  }

  private generateSecondaryEmotions(character: TavernCharacterData): EmotionalState['secondaryEmotions'] {
    return {
      love: 10,
      hate: 5,
      trust: character.personalityTraits.includes('Trusting') ? 70 : 40,
      suspicion: character.personalityTraits.includes('Suspicious') ? 60 : 20,
      pride: character.socialStanding.rank * 10,
      shame: 10,
      nostalgia: Math.floor(character.age / 2),
      anticipation: 30,
      jealousy: 15,
      gratitude: 25
    };
  }

  private determineDominantEmotion(character: TavernCharacterData): string {
    if (character.currentMood === 'Happy') return 'happiness';
    if (character.currentMood === 'Sad') return 'sadness';
    if (character.currentMood === 'Angry') return 'anger';
    return 'happiness'; // Default
  }

  private determineDominantEmotionFromState(state: EmotionalState): string {
    const allEmotions = { ...state.primaryEmotions, ...state.secondaryEmotions };
    let dominantEmotion = 'happiness';
    let highestValue = 0;

    Object.entries(allEmotions).forEach(([emotion, value]) => {
      if (value > highestValue) {
        dominantEmotion = emotion;
        highestValue = value;
      }
    });

    return dominantEmotion;
  }

  private calculateEmotionalIntensity(character: TavernCharacterData): number {
    return Math.floor(Math.random() * 30) + 40; // 40-70 base intensity
  }

  private calculateEmotionalStability(character: TavernCharacterData): number {
    let stability = 60; // Base stability
    
    if (character.personalityTraits.includes('Stable')) stability += 20;
    if (character.personalityTraits.includes('Volatile')) stability -= 20;
    if (character.age > 40) stability += 10; // Older characters more stable
    
    return Math.max(10, Math.min(100, stability));
  }

  private calculateEmotionalVolatility(character: TavernCharacterData): number {
    let volatility = 30; // Base volatility
    
    if (character.personalityTraits.includes('Volatile')) volatility += 30;
    if (character.personalityTraits.includes('Passionate')) volatility += 20;
    if (character.age < 25) volatility += 15; // Younger characters more volatile
    
    return Math.max(0, Math.min(100, volatility));
  }

  private calculateRecoveryRate(character: TavernCharacterData): number {
    let recovery = 50; // Base recovery rate
    
    if (character.personalityTraits.includes('Resilient')) recovery += 20;
    if (character.personalityTraits.includes('Forgiving')) recovery += 15;
    
    return Math.max(10, Math.min(100, recovery));
  }

  private calculateCurrentIntensity(state: EmotionalState): number {
    const allEmotions = { ...state.primaryEmotions, ...state.secondaryEmotions };
    const totalIntensity = Object.values(allEmotions).reduce((sum, value) => sum + value, 0);
    return Math.min(100, totalIntensity / Object.keys(allEmotions).length);
  }

  private determineRelationshipStatus(dynamics: RelationshipDynamics): RelationshipDynamics['relationshipStatus'] {
    if (dynamics.romance > 70) return 'lover';
    if (dynamics.romance > 40) return 'romantic_interest';
    if (dynamics.rivalry > 60) return 'enemy';
    if (dynamics.rivalry > 30) return 'rival';
    if (dynamics.friendship > 80) return 'best_friend';
    if (dynamics.friendship > 60) return 'close_friend';
    if (dynamics.friendship > 30) return 'friend';
    if (dynamics.friendship > 10) return 'acquaintance';
    return 'stranger';
  }

  // Public getters
  getEmotionalState(characterId: string): EmotionalState | undefined {
    return this.emotionalStates.get(characterId);
  }

  getRelationshipDynamics(characterId: string, playerId: string): RelationshipDynamics | undefined {
    return this.relationshipDynamics.get(`${characterId}-${playerId}`);
  }

  // Emotional recovery over time
  processEmotionalRecovery(characterId: string, minutesPassed: number): void {
    const state = this.emotionalStates.get(characterId);
    if (!state) return;

    const recoveryAmount = (state.recoveryRate / 100) * minutesPassed;

    // Move emotions toward baseline
    Object.keys(state.primaryEmotions).forEach(emotion => {
      const current = state.primaryEmotions[emotion as keyof typeof state.primaryEmotions];
      const baseline = 30; // Baseline for most emotions
      const difference = current - baseline;
      
      if (Math.abs(difference) > 1) {
        const recovery = Math.sign(difference) * Math.min(Math.abs(difference), recoveryAmount);
        state.primaryEmotions[emotion as keyof typeof state.primaryEmotions] = current - recovery;
      }
    });

    state.lastUpdate = new Date();
  }
}
