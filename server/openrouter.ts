import OpenAI from "openai";

interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
}

export class OpenRouterEngine {
  private client: OpenAI;

  constructor(config: OpenRouterConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || "https://openrouter.ai/api/v1",
    });
  }

  async generateResponse(prompt: string, model: string = "meta-llama/llama-3.1-8b-instruct:free"): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || "Nie mogę odpowiedzieć w tym momencie.";
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to generate response via OpenRouter');
    }
  }

  async generateConversation(
    participants: Array<{ id: string; name: string; personality: string; speakingStyle: string }>,
    context: { scene: string; atmosphere: string; theme: string }
  ): Promise<Array<{ characterId: string; message: string; timestamp: Date }>> {
    const systemPrompt = `Jesteś mistrzem gry w świecie Warhammer Fantasy. Generuj autentyczne rozmowy między postaciami w tawernie.

UCZESTNICY:
${participants.map(p => `${p.name}: ${p.personality} - ${p.speakingStyle}`).join('\n')}

KONTEKST:
Scena: ${context.scene}
Atmosfera: ${context.atmosphere}
Temat: ${context.theme}

ZASADY:
1. Każda postać MUSI mówić po polsku w swoim unikalnym stylu
2. Używaj średniowiecznych polskich wyrażeń
3. Odwołuj się do mitologii Warhammer Fantasy
4. Generuj 2-3 wiadomości
5. Każda wiadomość to naturalna reakcja na poprzednią

Odpowiedz w formacie JSON: {"messages": [{"characterId": "id", "message": "tekst po polsku", "timestamp": "timestamp"}]}`;

    try {
      const response = await this.generateResponse(systemPrompt, "meta-llama/llama-3.1-70b-instruct:free");
      const parsed = JSON.parse(response);
      
      if (parsed.messages && Array.isArray(parsed.messages)) {
        return parsed.messages.map((msg: any) => ({
          characterId: msg.characterId,
          message: msg.message,
          timestamp: new Date()
        }));
      }
      
      // Fallback
      return [
        {
          characterId: participants[0].id,
          message: `${participants[0].name}: Dziwne czasy nastały w naszych ziemiach...`,
          timestamp: new Date()
        }
      ];
    } catch (error) {
      console.error('OpenRouter conversation error:', error);
      
      // Fallback conversation
      return [
        {
          characterId: participants[0].id,
          message: `Słyszałem niepokojące wieści z północy. Coś się dzieje w Starym Świecie.`,
          timestamp: new Date()
        },
        {
          characterId: participants[1]?.id || participants[0].id,
          message: `Tak, czuję to w powietrzu. Magia się zmienia, bestie stają się śmielsze.`,
          timestamp: new Date(Date.now() + 3000)
        }
      ];
    }
  }
}