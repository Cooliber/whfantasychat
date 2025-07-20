import OpenAI from "openai";
import { OpenRouterEngine } from "./openrouter";

interface EnlightenmentCharacter {
  id: string;
  name: string;
  knowledgeLevel: number; // 1-10
  enlightenmentStage: 'medieval' | 'awareness' | 'integration' | 'transcendence';
  digitalTraits: string[];
  technomancySkills: string[];
  paradoxesResolved: number;
  fusionAbilities: string[];
  adaptationHistory: any[];
  memoryFragments: any[];
}

interface FusionEvent {
  id: string;
  type: 'discovery' | 'adaptation' | 'paradox' | 'fusion';
  description: string;
  characters: string[];
  technology: string;
  medievalContext: string;
  outcome: string;
  enlightenmentGain: number;
  playerChoice: boolean;
}

export class DigitalEnlightenmentEngine {
  private openai: OpenAI;
  private openrouter: OpenRouterEngine;
  private characters: Map<string, EnlightenmentCharacter>;
  private events: FusionEvent[];

  constructor(openaiKey: string, openrouterKey?: string) {
    this.openai = new OpenAI({ apiKey: openaiKey });
    
    if (openrouterKey) {
      this.openrouter = new OpenRouterEngine({
        apiKey: openrouterKey,
        baseURL: "https://openrouter.ai/api/v1"
      });
    }

    this.characters = new Map();
    this.events = [];
    this.initializeEnlightenedCharacters();
  }

  private initializeEnlightenedCharacters() {
    const enlightenedCharacters: EnlightenmentCharacter[] = [
      {
        id: 'wilhelm-enhanced',
        name: 'Wilhelm von Schreiber',
        knowledgeLevel: 8,
        enlightenmentStage: 'integration',
        digitalTraits: ['Data Wisdom', 'Algorithm Intuition', 'Binary Scholarship'],
        technomancySkills: ['Network Scrying', 'Data Divination', 'Digital Alchemy'],
        paradoxesResolved: 12,
        fusionAbilities: ['Quantum Manuscripts', 'Holographic Libraries', 'Time-Link Research'],
        adaptationHistory: [],
        memoryFragments: []
      },
      {
        id: 'greta-enhanced',
        name: 'Greta Żelazna Kuźnia',
        knowledgeLevel: 9,
        enlightenmentStage: 'transcendence',
        digitalTraits: ['Tech-Forge Mastery', 'Circuit Intuition', 'Metal-Silicon Synthesis'],
        technomancySkills: ['Cyber-Enchantment', 'Digital Forging', 'Nano-Crafting'],
        paradoxesResolved: 18,
        fusionAbilities: ['Smart-Metal Creation', 'AI-Hammer Wielding', 'Molecular Assembly'],
        adaptationHistory: [],
        memoryFragments: []
      },
      {
        id: 'aelindra-enhanced',
        name: 'Aelindra Szept Księżyca',
        knowledgeLevel: 10,
        enlightenmentStage: 'transcendence',
        digitalTraits: ['Quantum Mysticism', 'Digital Nature Bond', 'Cyber-Druidism'],
        technomancySkills: ['Quantum Rituals', 'Bio-Digital Fusion', 'Network Forest Walking'],
        paradoxesResolved: 25,
        fusionAbilities: ['Living Code Manipulation', 'Digital Ecosystem Creation', 'Quantum Forest Networks'],
        adaptationHistory: [],
        memoryFragments: []
      }
    ];

    enlightenedCharacters.forEach(char => {
      this.characters.set(char.id, char);
    });
  }

  async generateEnlightenmentConversation(
    participants: string[],
    context: {
      scene: string;
      technology?: string;
      fusionLevel: number; // 0-100
      theme: string;
    }
  ): Promise<Array<{ characterId: string; message: string; timestamp: Date; enlightenmentGain?: number }>> {
    const participantData = participants.map(id => this.characters.get(id)).filter(Boolean);
    
    if (participantData.length === 0) {
      return [];
    }

    const systemPrompt = this.buildEnlightenmentPrompt(participantData, context);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{"messages": []}');
      
      if (result.messages && Array.isArray(result.messages)) {
        return result.messages.map((msg: any, index: number) => ({
          characterId: msg.characterId || participants[index % participants.length],
          message: msg.message || "Technomancja wymaga więcej koncentracji...",
          timestamp: new Date(Date.now() + index * 3000),
          enlightenmentGain: msg.enlightenmentGain || 0
        }));
      }

      // Fallback for enhanced characters
      return this.generateFallbackEnlightenmentResponse(participantData, context);
      
    } catch (error) {
      console.error('Enlightenment conversation error:', error);
      return this.generateFallbackEnlightenmentResponse(participantData, context);
    }
  }

  private buildEnlightenmentPrompt(
    participants: EnlightenmentCharacter[],
    context: { scene: string; technology?: string; fusionLevel: number; theme: string }
  ): string {
    const charDescriptions = participants.map(char => 
      `${char.name} (Poziom: ${char.knowledgeLevel}/10, Etap: ${char.enlightenmentStage}):
- Cechy cyfrowe: ${char.digitalTraits.join(', ')}
- Umiejętności technomancji: ${char.technomancySkills.join(', ')}
- Zdolności fuzji: ${char.fusionAbilities.join(', ')}
- Rozwiązane paradoksy: ${char.paradoxesResolved}`
    ).join('\n\n');

    return `Jesteś mistrzem systemu Cyfrowego Oświecenia w świecie Warhammer Fantasy. Generuj rozmowy między oświeconymi postaciami, które łączą średniowieczną magię z futurystyczną technologią.

UCZESTNICY OŚWIECENI:
${charDescriptions}

KONTEKST FUZJI:
Scena: ${context.scene}
Technologia: ${context.technology || 'Uniwersalna'}
Poziom Fuzji: ${context.fusionLevel}% (0% = czysta magia, 100% = czysta technologia)
Temat: ${context.theme}

ZASADY CYFROWEGO OŚWIECENIA:
1. Każda postać MUSI mówić po polsku, łącząc średniowieczne formy z terminologią technologiczną
2. Używaj specjalnych terminów: "technomancja", "cyber-zaklęcia", "kwantowe rytuały", "cyfrowa alchemia"
3. Postacie mogą odwoływać się do "paradoksów czasowych", "fuzji światów", "oświecenia danych"
4. Im wyższy poziom oświecenia, tym bardziej zaawansowane koncepcje technologiczne
5. Włącz inkantacje łączące polskie słowa z terminami IT: "Przez sieci światła widzę jutro"
6. Każda wiadomość może generować "enlightenmentGain" (0-5 punktów)

STYLE MÓWIENIA WEDŁUG ETAPU OŚWIECENIA:
- medieval: Używa technologii niepewnie, z lękiem lub fascynacją
- awareness: Zaczyna rozumieć, zadaje pytania o naturę technologii
- integration: Łączy magię z technologią w praktyczny sposób
- transcendence: Mówi o technologii jak o naturalnej części magii

Odpowiedz w formacie JSON:
{
  "messages": [
    {
      "characterId": "character-id",
      "message": "tekst rozmowy po polsku z elementami technomancji",
      "enlightenmentGain": 1
    }
  ],
  "fusionEvent": {
    "type": "discovery|adaptation|paradox|fusion",
    "description": "opis wydarzenia fuzji"
  }
}

Generuj 2-3 wiadomości pokazujące progresję myśli i wzajemne uczenie się postaci.`;
  }

  private generateFallbackEnlightenmentResponse(
    participants: EnlightenmentCharacter[],
    context: { scene: string; technology?: string; fusionLevel: number; theme: string }
  ): Array<{ characterId: string; message: string; timestamp: Date; enlightenmentGain?: number }> {
    const responses = [
      {
        characterId: participants[0].id,
        message: `${participants[0].name}: Widzę w danych nowe wzorce... Technomancja odsłania prawdy ukryte w cyfrowych rysach przyszłości.`,
        timestamp: new Date(),
        enlightenmentGain: 2
      }
    ];

    if (participants[1]) {
      responses.push({
        characterId: participants[1].id,
        message: `${participants[1].name}: Fuzja światów nabiera mocy. Czy czujesz, jak magia przepływa przez kwantowe sieci?`,
        timestamp: new Date(Date.now() + 3000),
        enlightenmentGain: 1
      });
    }

    return responses;
  }

  async generateTechnomancySkill(
    characterId: string,
    technology: string,
    magicalContext: string
  ): Promise<{
    name: string;
    description: string;
    incantations: string[];
    effects: string[];
    masteryLevel: number;
  }> {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error('Character not found for technomancy skill generation');
    }

    const prompt = `Stwórz umiejętność technomancji dla ${character.name} łączącą ${technology} z ${magicalContext}.

Charakterystyka postaci:
- Poziom oświecenia: ${character.knowledgeLevel}/10
- Etap: ${character.enlightenmentStage}
- Specjalizacje: ${character.technomancySkills.join(', ')}

Generuj w formacie JSON:
{
  "name": "Polska nazwa umiejętności",
  "description": "Opis działania po polsku",
  "incantations": ["inkantacja 1", "inkantacja 2", "inkantacja 3"],
  "effects": ["efekt 1", "efekt 2"],
  "masteryLevel": 1-5
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 800,
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return {
        name: result.name || "Nowa Technomancja",
        description: result.description || "Tajemnicza umiejętność łącząca magię z technologią",
        incantations: result.incantations || ["Przez sieci światła widzę prawdę"],
        effects: result.effects || ["Zwiększona świadomość cyfrowa"],
        masteryLevel: result.masteryLevel || 1
      };
    } catch (error) {
      console.error('Technomancy skill generation error:', error);
      return {
        name: "Cyber-Intuicja",
        description: "Zdolność wyczuwania wzorców w cyfrowych energiach",
        incantations: ["Dane niech mi prawdę objawią", "Cyfrowy duch, prowadź mnie"],
        effects: ["Przewidywanie technologicznych anomalii", "Lepsza komunikacja z AI"],
        masteryLevel: 1
      };
    }
  }

  async processEnlightenmentEvent(
    type: 'discovery' | 'adaptation' | 'paradox' | 'fusion',
    characterIds: string[],
    technology: string,
    medievalContext: string,
    playerChoice?: boolean
  ): Promise<FusionEvent> {
    const event: FusionEvent = {
      id: `event-${Date.now()}`,
      type,
      description: await this.generateEventDescription(type, characterIds, technology, medievalContext),
      characters: characterIds,
      technology,
      medievalContext,
      outcome: await this.generateEventOutcome(type, characterIds, technology),
      enlightenmentGain: this.calculateEnlightenmentGain(type, characterIds.length),
      playerChoice: playerChoice || false
    };

    this.events.push(event);
    
    // Update character enlightenment levels
    characterIds.forEach(id => {
      const character = this.characters.get(id);
      if (character && character.knowledgeLevel < 10) {
        character.knowledgeLevel = Math.min(10, character.knowledgeLevel + event.enlightenmentGain);
        character.paradoxesResolved += (type === 'paradox' ? 1 : 0);
      }
    });

    return event;
  }

  private async generateEventDescription(
    type: string,
    characterIds: string[],
    technology: string,
    medievalContext: string
  ): Promise<string> {
    const characters = characterIds.map(id => this.characters.get(id)?.name).join(', ');
    
    const templates = {
      discovery: `${characters} odkryli nowy sposób połączenia ${technology} z ${medievalContext}`,
      adaptation: `${characters} przystosowali ${medievalContext} do współpracy z ${technology}`,
      paradox: `${characters} rozwiązali paradoks między ${technology} a ${medievalContext}`,
      fusion: `${characters} dokonali pełnej fuzji ${technology} z ${medievalContext}`
    };

    return templates[type as keyof typeof templates] || `${characters} doświadczyli oświecenia technologicznego`;
  }

  private async generateEventOutcome(
    type: string,
    characterIds: string[],
    technology: string
  ): Promise<string> {
    const outcomes = {
      discovery: `Odkrycie nowych możliwości ${technology}`,
      adaptation: `Usprawnienie średniowiecznych praktyk`,
      paradox: `Rozwiązanie konfliktów czasowo-technologicznych`,
      fusion: `Stworzenie hybrydowej techno-magii`
    };

    return outcomes[type as keyof typeof outcomes] || 'Wzrost świadomości cyfrowej';
  }

  private calculateEnlightenmentGain(type: string, participantCount: number): number {
    const baseGain = {
      discovery: 1,
      adaptation: 2,
      paradox: 3,
      fusion: 4
    };

    return (baseGain[type as keyof typeof baseGain] || 1) + Math.floor(participantCount / 2);
  }

  getEnlightenedCharacters(): EnlightenmentCharacter[] {
    return Array.from(this.characters.values());
  }

  getRecentEvents(limit: number = 10): FusionEvent[] {
    return this.events.slice(-limit).reverse();
  }

  getCharacterEnlightenment(characterId: string): EnlightenmentCharacter | undefined {
    return this.characters.get(characterId);
  }
}