import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

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

  constructor() {
    this.initializeCharacters();
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

    // Create conversation prompt
    const systemPrompt = this.buildSystemPrompt(context, participants);
    const conversationHistory = this.formatConversationHistory(context.conversationHistory);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: `Generate the next 2-3 messages in this conversation. Recent history:\n${conversationHistory}\n\nReturn ONLY a JSON array with this format: [{"characterId": "character-id", "message": "dialogue text", "timestamp": "current_timestamp"}]`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      if (result.messages && Array.isArray(result.messages)) {
        return result.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date()
        }));
      }

      // Fallback if format is different
      if (Array.isArray(result)) {
        return result.map((msg: any) => ({
          ...msg,
          timestamp: new Date()
        }));
      }

      throw new Error('Invalid response format from OpenAI');

    } catch (error) {
      console.error('OpenAI conversation error:', error);
      
      // Fallback to example conversation
      return this.generateFallbackConversation(participants);
    }
  }

  private buildSystemPrompt(context: ConversationContext, participants: Character[]): string {
    const characterDescriptions = participants.map(char => 
      `${char.name} (${char.id}): ${char.personality}. ${char.speakingStyle}. Background: ${char.background}`
    ).join('\n');

    const relationships = participants.map(char1 => 
      participants.filter(char2 => char2.id !== char1.id)
        .map(char2 => `${char1.name} feels about ${char2.name}: ${char1.relationships[char2.id] || 'neutral'}`)
        .join('; ')
    ).join('\n');

    return `You are generating dialogue for a Warhammer Fantasy tavern conversation.

SETTING: ${context.scene} - ${context.atmosphere}
RECENT EVENTS: ${context.recentEvents.join('; ')}

CHARACTERS:
${characterDescriptions}

RELATIONSHIPS:
${relationships}

RULES:
1. Each character must speak in their unique style and personality
2. Include Polish names and some Polish phrases naturally
3. Reference Warhammer Fantasy lore (Empire, Chaos, Old World)
4. Keep conversations natural and engaging
5. Characters should react to each other based on their relationships
6. Include medieval tavern atmosphere (sounds, smells, activities)
7. Mix serious topics with lighter tavern banter
8. Let personalities clash or harmonize naturally

Generate authentic dialogue that feels like real people in a fantasy tavern, not exposition. Make it engaging and true to each character.

IMPORTANT: Respond with a JSON object containing a "messages" array. Each message should have: characterId, message, timestamp.`;
  }

  private formatConversationHistory(history: ConversationContext['conversationHistory']): string {
    if (history.length === 0) return 'Starting new conversation...';
    
    return history.slice(-6).map(msg => {
      const char = this.characters.get(msg.characterId);
      return `${char?.name || msg.characterId}: "${msg.message}"`;
    }).join('\n');
  }

  private generateFallbackConversation(participants: Character[]): Array<{
    characterId: string;
    message: string;
    timestamp: Date;
  }> {
    const fallbackMessages = [
      {
        characterId: participants[0].id,
        message: `Dziwne czasy nastały... Słyszałem niepokojące wieści z północy.`,
        timestamp: new Date()
      },
      {
        characterId: participants[1].id,
        message: `Aye, coś się dzieje. Nawet konie są niespokojne ostatnio.`,
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

    const systemPrompt = `You are ${character.name}, a ${character.race} ${character.class} in a Warhammer Fantasy tavern.

PERSONALITY: ${character.personality}
SPEAKING STYLE: ${character.speakingStyle}
BACKGROUND: ${character.background}

Current scene: ${context.scene} - ${context.atmosphere}

Respond as this character would, staying true to their personality and speaking style. Keep responses concise (1-2 sentences). Include Polish phrases naturally if appropriate.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 150
      });

      return response.choices[0].message.content || `*${character.name} nods thoughtfully*`;
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