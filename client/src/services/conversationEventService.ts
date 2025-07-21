import type { 
  TavernCharacterData, 
  ConversationContext,
  CulturalEvent,
  Region 
} from '../types/warhammer.types';

// Real-time Conversation Events
export interface ConversationEvent {
  id: string;
  type: 'character_arrival' | 'character_departure' | 'news_arrival' | 'cultural_moment' | 
        'faction_tension' | 'tavern_incident' | 'weather_change' | 'mysterious_stranger';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: {
    conversationInterruption: boolean;
    moodChange?: string;
    atmosphereChange?: number;
    newDialogueOptions?: string[];
    characterReactions?: Record<string, string>;
  };
  duration: number; // minutes
  triggerConditions?: {
    timeOfDay?: string;
    activeCharacters?: string[];
    tavernReputation?: number;
    activeEvents?: string[];
  };
}

export class ConversationEventManager {
  private static readonly EVENT_TEMPLATES: ConversationEvent[] = [
    // Character Arrival Events
    {
      id: 'noble-arrival',
      type: 'character_arrival',
      priority: 'high',
      description: 'A well-dressed noble enters the tavern, causing a stir among the patrons',
      impact: {
        conversationInterruption: true,
        atmosphereChange: 10,
        newDialogueOptions: ['Approach the noble', 'Observe from distance', 'Continue conversation quietly'],
        characterReactions: {
          'peasant': 'bows respectfully',
          'noble': 'nods in acknowledgment',
          'merchant': 'eyes the potential customer',
          'soldier': 'stands at attention'
        }
      },
      duration: 15,
      triggerConditions: {
        tavernReputation: 60
      }
    },
    {
      id: 'dwarf-merchant-arrival',
      type: 'character_arrival',
      priority: 'medium',
      description: 'A dwarf merchant arrives with a heavily laden pack, drawing curious glances',
      impact: {
        conversationInterruption: false,
        atmosphereChange: 5,
        newDialogueOptions: ['Ask about goods', 'Inquire about dwarf holds', 'Offer to buy a drink'],
        characterReactions: {
          'dwarf': 'greets with clan salute',
          'merchant': 'shows professional interest',
          'default': 'watches with curiosity'
        }
      },
      duration: 30
    },

    // News Arrival Events
    {
      id: 'urgent-messenger',
      type: 'news_arrival',
      priority: 'critical',
      description: 'A breathless messenger bursts through the door with urgent news from the capital',
      impact: {
        conversationInterruption: true,
        moodChange: 'tense',
        atmosphereChange: -5,
        newDialogueOptions: ['Listen to the news', 'Question the messenger', 'Prepare for trouble'],
        characterReactions: {
          'soldier': 'immediately alert',
          'noble': 'demands to hear the news first',
          'scholar': 'takes notes frantically',
          'default': 'stops talking to listen'
        }
      },
      duration: 10,
      triggerConditions: {
        timeOfDay: 'evening'
      }
    },
    {
      id: 'trade-news',
      type: 'news_arrival',
      priority: 'medium',
      description: 'A merchant shares news of disrupted trade routes and changing prices',
      impact: {
        conversationInterruption: false,
        newDialogueOptions: ['Ask about specific routes', 'Inquire about prices', 'Discuss implications'],
        characterReactions: {
          'merchant': 'shows keen interest',
          'innkeeper': 'worries about supply costs',
          'default': 'listens with concern'
        }
      },
      duration: 20
    },

    // Cultural Moment Events
    {
      id: 'cultural-song',
      type: 'cultural_moment',
      priority: 'low',
      description: 'A traveling minstrel begins singing a traditional song from their homeland',
      impact: {
        conversationInterruption: false,
        moodChange: 'nostalgic',
        atmosphereChange: 8,
        newDialogueOptions: ['Join in the song', 'Request a specific tune', 'Share your own culture'],
        characterReactions: {
          'elf': 'listens with ancient wisdom',
          'dwarf': 'taps foot to the rhythm',
          'bretonnian': 'appreciates the artistry',
          'default': 'enjoys the music'
        }
      },
      duration: 25
    },
    {
      id: 'cultural-toast',
      type: 'cultural_moment',
      priority: 'medium',
      description: 'Someone calls for a traditional toast to honor their ancestors',
      impact: {
        conversationInterruption: true,
        moodChange: 'respectful',
        atmosphereChange: 5,
        newDialogueOptions: ['Join the toast', 'Share your own tradition', 'Ask about the custom'],
        characterReactions: {
          'dwarf': 'raises mug with pride',
          'empire': 'toasts to Sigmar',
          'bretonnian': 'honors the Lady',
          'default': 'participates respectfully'
        }
      },
      duration: 5
    },

    // Faction Tension Events
    {
      id: 'empire-bretonnian-tension',
      type: 'faction_tension',
      priority: 'high',
      description: 'Tension flares between Empire and Bretonnian patrons over recent political events',
      impact: {
        conversationInterruption: true,
        moodChange: 'tense',
        atmosphereChange: -10,
        newDialogueOptions: ['Try to mediate', 'Take a side', 'Stay neutral', 'Leave the area'],
        characterReactions: {
          'empire': 'defends Imperial policies',
          'bretonnian': 'maintains chivalric honor',
          'dwarf': 'grumbles about human politics',
          'default': 'watches nervously'
        }
      },
      duration: 20,
      triggerConditions: {
        activeCharacters: ['empire', 'bretonnian']
      }
    },

    // Tavern Incident Events
    {
      id: 'spilled-drink',
      type: 'tavern_incident',
      priority: 'low',
      description: 'Someone accidentally spills their drink, causing a minor commotion',
      impact: {
        conversationInterruption: false,
        newDialogueOptions: ['Help clean up', 'Offer to buy another drink', 'Make light of the situation'],
        characterReactions: {
          'innkeeper': 'rushes to clean up',
          'drunk': 'laughs loudly',
          'noble': 'shows disdain',
          'default': 'offers assistance'
        }
      },
      duration: 5
    },
    {
      id: 'bar-fight-brewing',
      type: 'tavern_incident',
      priority: 'critical',
      description: 'Voices are raised and hands move to weapons - a fight is about to break out!',
      impact: {
        conversationInterruption: true,
        moodChange: 'aggressive',
        atmosphereChange: -15,
        newDialogueOptions: ['Try to calm things down', 'Prepare for combat', 'Get to safety', 'Call for the watch'],
        characterReactions: {
          'soldier': 'moves to intervene',
          'bouncer': 'steps forward menacingly',
          'scholar': 'seeks cover',
          'rogue': 'looks for opportunity',
          'default': 'backs away cautiously'
        }
      },
      duration: 10
    },

    // Weather Change Events
    {
      id: 'sudden-storm',
      type: 'weather_change',
      priority: 'medium',
      description: 'A sudden storm begins outside, with thunder and heavy rain',
      impact: {
        conversationInterruption: false,
        moodChange: 'cozy',
        atmosphereChange: 5,
        newDialogueOptions: ['Comment on the weather', 'Share storm stories', 'Offer shelter to travelers'],
        characterReactions: {
          'ranger': 'reads the weather signs',
          'sailor': 'tells storm stories',
          'farmer': 'worries about crops',
          'default': 'draws closer to the fire'
        }
      },
      duration: 45
    },

    // Mysterious Stranger Events
    {
      id: 'hooded-figure',
      type: 'mysterious_stranger',
      priority: 'high',
      description: 'A mysterious hooded figure enters and takes a seat in the darkest corner',
      impact: {
        conversationInterruption: false,
        moodChange: 'mysterious',
        atmosphereChange: -3,
        newDialogueOptions: ['Approach the stranger', 'Watch from afar', 'Ask others about them'],
        characterReactions: {
          'rogue': 'recognizes a kindred spirit',
          'guard': 'becomes suspicious',
          'scholar': 'shows curiosity',
          'default': 'glances nervously'
        }
      },
      duration: 60
    }
  ];

  static generateRandomEvent(
    context: ConversationContext,
    activeCharacters: TavernCharacterData[]
  ): ConversationEvent | null {
    // Filter events based on current conditions
    const availableEvents = this.EVENT_TEMPLATES.filter(event => 
      this.meetsConditions(event, context, activeCharacters)
    );

    if (availableEvents.length === 0) return null;

    // Weight events by priority and context
    const weightedEvents = this.weightEventsByContext(availableEvents, context);
    
    return this.selectWeightedEvent(weightedEvents);
  }

  private static meetsConditions(
    event: ConversationEvent,
    context: ConversationContext,
    activeCharacters: TavernCharacterData[]
  ): boolean {
    if (!event.triggerConditions) return true;

    const conditions = event.triggerConditions;

    // Check time of day
    if (conditions.timeOfDay) {
      const currentTime = this.getCurrentTimeOfDay();
      if (currentTime !== conditions.timeOfDay) return false;
    }

    // Check tavern reputation
    if (conditions.tavernReputation) {
      if (context.tavernReputation.overall < conditions.tavernReputation) return false;
    }

    // Check active characters
    if (conditions.activeCharacters) {
      const activeRaces = activeCharacters.map(c => c.race.toLowerCase());
      const hasRequiredCharacters = conditions.activeCharacters.some(required => 
        activeRaces.includes(required.toLowerCase())
      );
      if (!hasRequiredCharacters) return false;
    }

    // Check active events
    if (conditions.activeEvents) {
      const activeEventIds = Array.from(context.activeEvents.keys());
      const hasRequiredEvents = conditions.activeEvents.some(required => 
        activeEventIds.includes(required)
      );
      if (!hasRequiredEvents) return false;
    }

    return true;
  }

  private static weightEventsByContext(
    events: ConversationEvent[],
    context: ConversationContext
  ): Array<{ event: ConversationEvent; weight: number }> {
    return events.map(event => {
      let weight = 1;

      // Weight by priority
      switch (event.priority) {
        case 'critical': weight *= 4; break;
        case 'high': weight *= 3; break;
        case 'medium': weight *= 2; break;
        case 'low': weight *= 1; break;
      }

      // Weight by tavern atmosphere
      if (context.customerSatisfaction.overall > 70 && event.impact.atmosphereChange! > 0) {
        weight *= 1.5;
      }
      if (context.customerSatisfaction.overall < 30 && event.impact.atmosphereChange! < 0) {
        weight *= 0.5; // Avoid making bad situations worse
      }

      // Weight by active events
      if (context.activeEvents.size > 0 && event.type === 'cultural_moment') {
        weight *= 2; // Cultural events are more likely during festivals
      }

      return { event, weight };
    });
  }

  private static selectWeightedEvent(
    weightedEvents: Array<{ event: ConversationEvent; weight: number }>
  ): ConversationEvent {
    const totalWeight = weightedEvents.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedEvents) {
      random -= item.weight;
      if (random <= 0) return item.event;
    }

    return weightedEvents[0].event; // Fallback
  }

  static processEventImpact(
    event: ConversationEvent,
    activeCharacters: TavernCharacterData[],
    context: ConversationContext
  ): {
    updatedContext: ConversationContext;
    characterReactions: Array<{ characterId: string; reaction: string }>;
    newDialogueOptions: string[];
  } {
    // Update context based on event impact
    const updatedContext = { ...context };
    
    if (event.impact.atmosphereChange) {
      updatedContext.customerSatisfaction = {
        ...context.customerSatisfaction,
        atmosphere: Math.max(0, Math.min(100, 
          context.customerSatisfaction.atmosphere + event.impact.atmosphereChange
        ))
      };
    }

    // Generate character reactions
    const characterReactions = activeCharacters.map(character => {
      const reactionKey = character.characterClass.toLowerCase();
      const reaction = event.impact.characterReactions?.[reactionKey] || 
                      event.impact.characterReactions?.['default'] || 
                      'observes the situation';
      
      return {
        characterId: character.id,
        reaction: `${character.name} ${reaction}`
      };
    });

    return {
      updatedContext,
      characterReactions,
      newDialogueOptions: event.impact.newDialogueOptions || []
    };
  }

  static shouldTriggerEvent(
    conversationDuration: number,
    lastEventTime: number,
    tavernActivity: number
  ): boolean {
    // Base chance increases with time since last event
    const timeSinceLastEvent = conversationDuration - lastEventTime;
    let baseChance = Math.min(0.3, timeSinceLastEvent / 100); // Max 30% chance

    // Adjust for tavern activity level
    baseChance *= (tavernActivity / 100);

    // Random events are more likely during peak hours
    const currentHour = new Date().getHours();
    if (currentHour >= 18 && currentHour <= 22) { // Evening peak
      baseChance *= 1.5;
    }

    return Math.random() < baseChance;
  }

  private static getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  static getEventDescription(event: ConversationEvent, context: ConversationContext): string {
    // Add contextual details to event description
    let description = event.description;
    
    if (event.type === 'character_arrival' && context.activeEvents.size > 0) {
      const eventName = Array.from(context.activeEvents.values())[0].name;
      description += ` They seem to be here for the ${eventName}.`;
    }
    
    if (event.type === 'weather_change' && context.currentRegion) {
      description += ` The ${context.currentRegion} weather can be quite unpredictable.`;
    }
    
    return description;
  }
}
