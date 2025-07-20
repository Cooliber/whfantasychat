import { OpenRouterEngine } from "./openrouter";

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  personality: string;
  background: string;
  speakingStyle: string;
  relationships: Record<string, string>;
  secrets: string[];
  goals: string[];
}

interface ConversationContext {
  scene: string;
  atmosphere: string;
  recentEvents: string[];
  participantIds: string[];
  conversationHistory: Array<{
    characterId: string;
    message: string;
    timestamp: Date;
  }>;
}

export class ConversationEngine {
  private characters: Map<string, Character> = new Map();
  private openRouter: OpenRouterEngine;

  constructor() {
    this.initializeCharacters();
    
    // Initialize OpenRouter with environment variables
    this.openRouter = new OpenRouterEngine({
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseURL: "https://openrouter.ai/api/v1"
    });
  }

  private initializeCharacters() {
    const characters: Character[] = [
      {
        id: 'wilhelm-scribe',
        name: 'Wilhelm von Schreiber',
        race: 'Empire',
        class: 'Scholar',
        personality: 'Intellectual, cautious, curious about ancient mysteries, speaks formally',
        background: 'Former university professor who discovered dangerous knowledge in forbidden texts',
        speakingStyle: 'Formal, uses archaic terms, often quotes ancient texts, speaks slowly and thoughtfully',
        relationships: {
          'greta-ironforge': 'Respectful academic friendship',
          'aelindra-moonwhisper': 'Fascinated by her magical knowledge',
          'marcus-steiner': 'Relies on his reports from the field'
        },
        secrets: ['Knows the location of a lost grimoire', 'Has deciphered prophecies about coming darkness'],
        goals: ['Prevent ancient evil from awakening', 'Preserve knowledge for future generations']
      },
      {
        id: 'greta-ironforge',
        name: 'Greta Żelazna Kuźnia',
        race: 'Dwarf',
        class: 'Blacksmith',
        personality: 'Practical, direct, loyal, has a dry sense of humor',
        background: 'Master blacksmith whose family has served the town for generations',
        speakingStyle: 'Blunt, uses smithing metaphors, speaks with confidence, occasional grumbling',
        relationships: {
          'wilhelm-scribe': 'Values his wisdom despite his bookishness',
          'balin-goldseeker': 'Clan rivalry but mutual respect',
          'aelindra-moonwhisper': 'Suspicious of magic but respects her skills'
        },
        secrets: ['Forged weapons with mysterious runes', 'Knows about hidden dwarven passages'],
        goals: ['Protect the town with her craft', 'Uphold family honor']
      },
      {
        id: 'aelindra-moonwhisper',
        name: 'Aelindra Szept Księżyca',
        race: 'Elf',
        class: 'Mage',
        personality: 'Mysterious, wise, speaks in riddles, connected to nature',
        background: 'Ancient elf who has witnessed the rise and fall of empires',
        speakingStyle: 'Poetic, uses nature metaphors, speaks softly but with authority',
        relationships: {
          'wilhelm-scribe': 'Sees potential in his scholarly pursuits',
          'greta-ironforge': 'Amused by dwarven stubbornness',
          'rosie-greenhill': 'Shares knowledge of herbs and natural remedies'
        },
        secrets: ['Knows the true names of forest spirits', 'Guards an ancient elven artifact'],
        goals: ['Maintain balance between civilized and natural worlds', 'Guide worthy mortals']
      },
      {
        id: 'marcus-steiner',
        name: 'Marcus Steiner',
        race: 'Empire',
        class: 'Scout',
        personality: 'Alert, pragmatic, worldly, somewhat paranoid',
        background: 'Former soldier turned scout who patrols the dangerous borderlands',
        speakingStyle: 'Military terminology, short sentences, practical observations',
        relationships: {
          'wilhelm-scribe': 'Reports findings to for analysis',
          'greta-ironforge': 'Appreciates quality weapons',
          'lorenzo-goldhand': 'Suspicious of the merchant\'s activities'
        },
        secrets: ['Has seen signs of Chaos cult activity', 'Knows hidden paths through dangerous territory'],
        goals: ['Protect the town from external threats', 'Uncover the truth about strange occurrences']
      },
      {
        id: 'lorenzo-goldhand',
        name: 'Lorenzo Złota Ręka',
        race: 'Tilean',
        class: 'Merchant',
        personality: 'Charming, ambitious, secretive, always calculating profit',
        background: 'Wealthy merchant with connections across the Old World',
        speakingStyle: 'Smooth, persuasive, uses trade terminology, speaks multiple languages',
        relationships: {
          'balin-goldseeker': 'Business partnership with hidden tensions',
          'merry-goodbarrel': 'Supplies exotic ingredients',
          'marcus-steiner': 'Aware of the scout\'s suspicions'
        },
        secrets: ['Smuggles rare artifacts', 'Has debts to dangerous people'],
        goals: ['Expand trading empire', 'Pay off mysterious debts']
      },
      {
        id: 'balin-goldseeker',
        name: 'Balin Poszukiwacz Złota',
        race: 'Dwarf',
        class: 'Merchant',
        personality: 'Shrewd, traditional, clan-focused, distrusts outsiders',
        background: 'Represents dwarven merchant interests in human lands',
        speakingStyle: 'Gruff, uses dwarven curses, business-focused, clan references',
        relationships: {
          'greta-ironforge': 'Clan politics create tension',
          'lorenzo-goldhand': 'Uneasy business alliance',
          'thorek-ironbeard': 'Trusted clan brother'
        },
        secrets: ['Controls access to rare dwarven goods', 'Knows location of abandoned mine'],
        goals: ['Increase clan wealth and influence', 'Establish dwarven trading post']
      }
    ];

    characters.forEach(char => this.characters.set(char.id, char));
  }

  async generateConversation(context: ConversationContext): Promise<Array<{
    characterId: string;
    message: string;
    timestamp: Date;
  }>> {
    const participants = context.participantIds
      .map(id => this.characters.get(id))
      .filter(Boolean) as Character[];

    if (participants.length < 2) {
      throw new Error('Need at least 2 characters for conversation');
    }

    try {
      // Use the existing OpenRouter conversation generation
      const openRouterParticipants = participants.map(char => ({
        id: char.id,
        name: char.name,
        personality: char.personality,
        speakingStyle: char.speakingStyle
      }));

      const openRouterContext = {
        scene: context.scene,
        atmosphere: context.atmosphere,
        theme: context.recentEvents.join('; ') || 'ogólne rozmowy tawerny'
      };

      const messages = await this.openRouter.generateConversation(
        openRouterParticipants,
        openRouterContext
      );

      return messages;

    } catch (error) {
      console.error('OpenRouter conversation error:', error);
      
      // Fallback to example conversation
      return this.generateFallbackConversation(participants);
    }
  }

  private generateFallbackConversation(participants: Character[]): Array<{
    characterId: string;
    message: string;
    timestamp: Date;
  }> {
    const fallbackMessages = [
      {
        characterId: participants[0].id,
        message: `Dziwne czasy nastały... Słyszałem niepokojące wieści z północy. Coś się szykuje.`,
        timestamp: new Date()
      },
      {
        characterId: participants[1].id,
        message: `Tak, czuję to w powietrzu. Nawet zwierzęta są niespokojne ostatnio. To nie jest dobry znak.`,
        timestamp: new Date(Date.now() + 3000)
      }
    ];

    return fallbackMessages.slice(0, participants.length);
  }

  async generateCharacterResponse(
    characterId: string, 
    prompt: string, 
    context: ConversationContext
  ): Promise<string> {
    const character = this.characters.get(characterId);
    if (!character) throw new Error(`Character ${characterId} not found`);

    const systemPrompt = `Jesteś ${character.name}, ${character.race} ${character.class} w tawernie Warhammer Fantasy.

OSOBOWOŚĆ: ${character.personality}
STYL MÓWIENIA: ${character.speakingStyle}
TŁO: ${character.background}

Obecna scena: ${context.scene} - ${context.atmosphere}

Odpowiadaj jak ta postać, pozostając wiernym jej osobowości i stylowi mówienia. Odpowiadaj ZAWSZE PO POLSKU. Utrzymuj odpowiedzi zwięzłe (1-2 zdania). Używaj naturalnie polskich wyrażeń średniowiecznych.

Gracz mówi: "${prompt}"

Odpowiedz jako ${character.name}:`;

    try {
      const response = await this.openRouter.generateResponse(systemPrompt, "meta-llama/llama-3.1-70b-instruct:free");
      return response || `*${character.name} nods thoughtfully*`;
    } catch (error) {
      console.error('Character response error:', error);
      return `*${character.name} looks around the tavern thoughtfully*`;
    }
  }

  getCharacter(id: string): Character | undefined {
    return this.characters.get(id);
  }

  getAllCharacters(): Character[] {
    return Array.from(this.characters.values());
  }
}

export const conversationEngine = new ConversationEngine();
