import type { TavernCharacterData } from '../types/warhammer.types';

// Conversation Minigame Types
export interface ConversationMinigame {
  id: string;
  type: 'persuasion' | 'information_trading' | 'drinking_contest' | 'storytelling' | 'riddle_contest' | 'haggling';
  characterId: string;
  playerId: string;
  
  // Game state
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  currentRound: number;
  totalRounds: number;
  
  // Scoring
  playerScore: number;
  characterScore: number;
  
  // Game-specific data
  gameData: any;
  
  // Stakes and rewards
  stakes: {
    playerStake: any;
    characterStake: any;
  };
  rewards: {
    winner: any;
    loser: any;
  };
  
  // Timing
  startTime: Date;
  timeLimit?: number; // seconds per round
  lastAction: Date;
}

export interface PersuasionGame extends ConversationMinigame {
  type: 'persuasion';
  gameData: {
    objective: string; // What player is trying to persuade
    characterResistance: number; // 0-100
    playerArguments: Array<{
      argument: string;
      effectiveness: number;
      used: boolean;
    }>;
    characterCounters: Array<{
      counter: string;
      strength: number;
    }>;
    emotionalState: {
      trust: number;
      suspicion: number;
      interest: number;
    };
  };
}

export interface InformationTradingGame extends ConversationMinigame {
  type: 'information_trading';
  gameData: {
    playerInformation: Array<{
      info: string;
      value: number;
      rarity: number;
      characterInterest: number;
    }>;
    characterInformation: Array<{
      info: string;
      value: number;
      rarity: number;
      playerInterest: number;
    }>;
    tradingHistory: Array<{
      round: number;
      playerOffer: string;
      characterOffer: string;
      accepted: boolean;
    }>;
    trustLevel: number;
  };
}

export interface DrinkingContestGame extends ConversationMinigame {
  type: 'drinking_contest';
  gameData: {
    drinkType: string;
    playerTolerance: number;
    characterTolerance: number;
    playerIntoxication: number;
    characterIntoxication: number;
    conversationEffects: {
      playerSpeechClarity: number; // 0-100
      characterSpeechClarity: number; // 0-100
      inhibitionLevel: number; // Lower = more secrets revealed
    };
    drinkingRounds: Array<{
      round: number;
      playerDrink: boolean;
      characterDrink: boolean;
      playerReaction: string;
      characterReaction: string;
    }>;
  };
}

export interface StorytellingGame extends ConversationMinigame {
  type: 'storytelling';
  gameData: {
    theme: string;
    playerStory: {
      elements: string[];
      creativity: number;
      authenticity: number;
      entertainment: number;
    };
    characterStory: {
      elements: string[];
      creativity: number;
      authenticity: number;
      entertainment: number;
    };
    audienceReactions: Array<{
      character: string;
      reaction: 'engaged' | 'bored' | 'impressed' | 'skeptical';
      score: number;
    }>;
    storyPrompts: string[];
  };
}

// Conversation Minigames Manager
export class ConversationMinigamesManager {
  private activeMinigames: Map<string, ConversationMinigame> = new Map();
  
  // Start a persuasion contest
  startPersuasionGame(
    character: TavernCharacterData,
    playerId: string,
    objective: string,
    stakes: any
  ): PersuasionGame {
    const gameId = `persuasion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const game: PersuasionGame = {
      id: gameId,
      type: 'persuasion',
      characterId: character.id,
      playerId,
      status: 'not_started',
      currentRound: 0,
      totalRounds: 5,
      playerScore: 0,
      characterScore: 0,
      stakes,
      rewards: this.calculatePersuasionRewards(stakes),
      startTime: new Date(),
      timeLimit: 60,
      lastAction: new Date(),
      gameData: {
        objective,
        characterResistance: this.calculateCharacterResistance(character, objective),
        playerArguments: this.generatePlayerArguments(objective),
        characterCounters: this.generateCharacterCounters(character, objective),
        emotionalState: {
          trust: 50,
          suspicion: 30,
          interest: 40
        }
      }
    };

    this.activeMinigames.set(gameId, game);
    return game;
  }

  // Process persuasion attempt
  processPersuasionAttempt(
    gameId: string,
    argumentIndex: number,
    delivery: 'aggressive' | 'diplomatic' | 'emotional' | 'logical'
  ): {
    success: boolean;
    effectiveness: number;
    characterResponse: string;
    gameStatus: string;
    nextRoundData?: any;
  } {
    const game = this.activeMinigames.get(gameId) as PersuasionGame;
    if (!game || game.type !== 'persuasion') {
      throw new Error('Invalid persuasion game');
    }

    const argument = game.gameData.playerArguments[argumentIndex];
    if (!argument || argument.used) {
      throw new Error('Invalid or already used argument');
    }

    // Mark argument as used
    argument.used = true;
    game.currentRound++;

    // Calculate effectiveness based on argument, delivery, and character
    const effectiveness = this.calculatePersuasionEffectiveness(
      argument,
      delivery,
      game.gameData.characterResistance,
      game.gameData.emotionalState
    );

    // Update emotional state
    this.updatePersuasionEmotionalState(game.gameData.emotionalState, delivery, effectiveness);

    // Update scores
    game.playerScore += effectiveness;
    
    // Generate character counter
    const characterCounter = this.selectCharacterCounter(game.gameData.characterCounters, effectiveness);
    game.characterScore += characterCounter.strength;

    // Check win conditions
    const gameResult = this.checkPersuasionWinConditions(game);
    
    return {
      success: effectiveness > 60,
      effectiveness,
      characterResponse: this.generatePersuasionResponse(characterCounter, effectiveness, game.gameData.emotionalState),
      gameStatus: gameResult.status,
      nextRoundData: gameResult.status === 'in_progress' ? this.getNextPersuasionRound(game) : undefined
    };
  }

  // Start information trading game
  startInformationTradingGame(
    character: TavernCharacterData,
    playerId: string,
    playerInfo: string[],
    stakes: any
  ): InformationTradingGame {
    const gameId = `info-trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const game: InformationTradingGame = {
      id: gameId,
      type: 'information_trading',
      characterId: character.id,
      playerId,
      status: 'not_started',
      currentRound: 0,
      totalRounds: 3,
      playerScore: 0,
      characterScore: 0,
      stakes,
      rewards: this.calculateTradingRewards(stakes),
      startTime: new Date(),
      lastAction: new Date(),
      gameData: {
        playerInformation: this.evaluatePlayerInformation(playerInfo, character),
        characterInformation: this.generateCharacterInformation(character),
        tradingHistory: [],
        trustLevel: 50
      }
    };

    this.activeMinigames.set(gameId, game);
    return game;
  }

  // Process information trade
  processInformationTrade(
    gameId: string,
    playerOfferIndex: number,
    requestedInfoIndex: number
  ): {
    accepted: boolean;
    characterResponse: string;
    tradedInformation?: string;
    gameStatus: string;
    nextRoundData?: any;
  } {
    const game = this.activeMinigames.get(gameId) as InformationTradingGame;
    if (!game || game.type !== 'information_trading') {
      throw new Error('Invalid information trading game');
    }

    const playerOffer = game.gameData.playerInformation[playerOfferIndex];
    const requestedInfo = game.gameData.characterInformation[requestedInfoIndex];

    if (!playerOffer || !requestedInfo) {
      throw new Error('Invalid information indices');
    }

    // Calculate trade fairness
    const tradeFairness = this.calculateTradeFairness(playerOffer, requestedInfo);
    const trustModifier = game.gameData.trustLevel / 100;
    const acceptanceChance = tradeFairness * trustModifier;

    const accepted = Math.random() < acceptanceChance;

    // Update game state
    game.currentRound++;
    game.gameData.tradingHistory.push({
      round: game.currentRound,
      playerOffer: playerOffer.info,
      characterOffer: requestedInfo.info,
      accepted
    });

    if (accepted) {
      game.playerScore += requestedInfo.value;
      game.characterScore += playerOffer.value;
      game.gameData.trustLevel += 10;
    } else {
      game.gameData.trustLevel -= 5;
    }

    // Check win conditions
    const gameResult = this.checkTradingWinConditions(game);

    return {
      accepted,
      characterResponse: this.generateTradingResponse(accepted, tradeFairness, game.gameData.trustLevel),
      tradedInformation: accepted ? requestedInfo.info : undefined,
      gameStatus: gameResult.status,
      nextRoundData: gameResult.status === 'in_progress' ? this.getNextTradingRound(game) : undefined
    };
  }

  // Start drinking contest
  startDrinkingContest(
    character: TavernCharacterData,
    playerId: string,
    drinkType: string,
    stakes: any
  ): DrinkingContestGame {
    const gameId = `drinking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const game: DrinkingContestGame = {
      id: gameId,
      type: 'drinking_contest',
      characterId: character.id,
      playerId,
      status: 'not_started',
      currentRound: 0,
      totalRounds: 10,
      playerScore: 0,
      characterScore: 0,
      stakes,
      rewards: this.calculateDrinkingRewards(stakes),
      startTime: new Date(),
      lastAction: new Date(),
      gameData: {
        drinkType,
        playerTolerance: this.calculatePlayerTolerance(),
        characterTolerance: this.calculateCharacterTolerance(character),
        playerIntoxication: 0,
        characterIntoxication: 0,
        conversationEffects: {
          playerSpeechClarity: 100,
          characterSpeechClarity: 100,
          inhibitionLevel: 100
        },
        drinkingRounds: []
      }
    };

    this.activeMinigames.set(gameId, game);
    return game;
  }

  // Process drinking round
  processDrinkingRound(
    gameId: string,
    playerDrinks: boolean
  ): {
    playerReaction: string;
    characterReaction: string;
    conversationEffects: any;
    secretsRevealed: string[];
    gameStatus: string;
    nextRoundData?: any;
  } {
    const game = this.activeMinigames.get(gameId) as DrinkingContestGame;
    if (!game || game.type !== 'drinking_contest') {
      throw new Error('Invalid drinking contest game');
    }

    game.currentRound++;

    // Character decides whether to drink
    const characterDrinks = this.characterDrinkingDecision(game);

    // Update intoxication levels
    if (playerDrinks) {
      game.gameData.playerIntoxication += this.calculateIntoxicationIncrease(game.gameData.drinkType);
    }
    if (characterDrinks) {
      game.gameData.characterIntoxication += this.calculateIntoxicationIncrease(game.gameData.drinkType);
    }

    // Update conversation effects
    this.updateDrinkingConversationEffects(game);

    // Generate reactions
    const playerReaction = this.generateDrinkingReaction(playerDrinks, game.gameData.playerIntoxication);
    const characterReaction = this.generateDrinkingReaction(characterDrinks, game.gameData.characterIntoxication);

    // Check for secrets revealed due to lowered inhibitions
    const secretsRevealed = this.checkForSecretsRevealed(game);

    // Record round
    game.gameData.drinkingRounds.push({
      round: game.currentRound,
      playerDrink: playerDrinks,
      characterDrink: characterDrinks,
      playerReaction,
      characterReaction
    });

    // Update scores
    if (playerDrinks) game.playerScore += 10;
    if (characterDrinks) game.characterScore += 10;

    // Check win conditions
    const gameResult = this.checkDrinkingWinConditions(game);

    return {
      playerReaction,
      characterReaction,
      conversationEffects: game.gameData.conversationEffects,
      secretsRevealed,
      gameStatus: gameResult.status,
      nextRoundData: gameResult.status === 'in_progress' ? this.getNextDrinkingRound(game) : undefined
    };
  }

  // Start storytelling contest
  startStorytellingContest(
    character: TavernCharacterData,
    playerId: string,
    theme: string,
    audience: string[],
    stakes: any
  ): StorytellingGame {
    const gameId = `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const game: StorytellingGame = {
      id: gameId,
      type: 'storytelling',
      characterId: character.id,
      playerId,
      status: 'not_started',
      currentRound: 0,
      totalRounds: 3,
      playerScore: 0,
      characterScore: 0,
      stakes,
      rewards: this.calculateStorytellingRewards(stakes),
      startTime: new Date(),
      timeLimit: 120,
      lastAction: new Date(),
      gameData: {
        theme,
        playerStory: {
          elements: [],
          creativity: 0,
          authenticity: 0,
          entertainment: 0
        },
        characterStory: {
          elements: [],
          creativity: 0,
          authenticity: 0,
          entertainment: 0
        },
        audienceReactions: audience.map(charId => ({
          character: charId,
          reaction: 'engaged' as const,
          score: 0
        })),
        storyPrompts: this.generateStoryPrompts(theme)
      }
    };

    this.activeMinigames.set(gameId, game);
    return game;
  }

  // Helper methods for game mechanics
  private calculateCharacterResistance(character: TavernCharacterData, objective: string): number {
    let resistance = 50; // Base resistance
    
    if (character.personalityTraits.includes('Stubborn')) resistance += 20;
    if (character.personalityTraits.includes('Suspicious')) resistance += 15;
    if (character.personalityTraits.includes('Trusting')) resistance -= 15;
    
    // Adjust based on objective difficulty
    if (objective.includes('secret') || objective.includes('personal')) resistance += 25;
    if (objective.includes('money') || objective.includes('valuable')) resistance += 20;
    
    return Math.max(10, Math.min(90, resistance));
  }

  private generatePlayerArguments(objective: string): PersuasionGame['gameData']['playerArguments'] {
    const baseArguments = [
      { argument: 'Appeal to mutual benefit', effectiveness: 70, used: false },
      { argument: 'Logical reasoning', effectiveness: 60, used: false },
      { argument: 'Emotional appeal', effectiveness: 65, used: false },
      { argument: 'Appeal to honor/duty', effectiveness: 75, used: false },
      { argument: 'Offer compensation', effectiveness: 80, used: false }
    ];

    // Customize based on objective
    if (objective.includes('information')) {
      baseArguments.push({ argument: 'Promise reciprocal information', effectiveness: 85, used: false });
    }
    if (objective.includes('help')) {
      baseArguments.push({ argument: 'Appeal to compassion', effectiveness: 70, used: false });
    }

    return baseArguments;
  }

  private generateCharacterCounters(character: TavernCharacterData, objective: string): PersuasionGame['gameData']['characterCounters'] {
    return [
      { counter: 'Questions your motives', strength: 60 },
      { counter: 'Cites personal policy', strength: 50 },
      { counter: 'Demands more information', strength: 55 },
      { counter: 'Suggests alternative', strength: 65 },
      { counter: 'Expresses skepticism', strength: 70 }
    ];
  }

  private calculatePersuasionEffectiveness(
    argument: any,
    delivery: string,
    resistance: number,
    emotionalState: any
  ): number {
    let effectiveness = argument.effectiveness;
    
    // Adjust for delivery style
    const deliveryModifiers = {
      aggressive: -10,
      diplomatic: 15,
      emotional: 10,
      logical: 5
    };
    effectiveness += deliveryModifiers[delivery] || 0;
    
    // Adjust for character resistance
    effectiveness -= resistance / 2;
    
    // Adjust for emotional state
    effectiveness += (emotionalState.trust - emotionalState.suspicion) / 5;
    
    return Math.max(0, Math.min(100, effectiveness));
  }

  private updatePersuasionEmotionalState(emotionalState: any, delivery: string, effectiveness: number): void {
    if (effectiveness > 70) {
      emotionalState.trust += 10;
      emotionalState.interest += 5;
    } else if (effectiveness < 30) {
      emotionalState.suspicion += 10;
      emotionalState.trust -= 5;
    }

    if (delivery === 'aggressive') {
      emotionalState.suspicion += 5;
    } else if (delivery === 'diplomatic') {
      emotionalState.trust += 5;
    }

    // Clamp values
    Object.keys(emotionalState).forEach(key => {
      emotionalState[key] = Math.max(0, Math.min(100, emotionalState[key]));
    });
  }

  private selectCharacterCounter(counters: any[], playerEffectiveness: number): any {
    // Select counter based on player effectiveness
    if (playerEffectiveness > 70) {
      return counters.find(c => c.strength > 60) || counters[0];
    } else {
      return counters[Math.floor(Math.random() * counters.length)];
    }
  }

  private generatePersuasionResponse(counter: any, effectiveness: number, emotionalState: any): string {
    if (effectiveness > 70) {
      return "You make a compelling point... I'm beginning to see your perspective.";
    } else if (effectiveness > 40) {
      return `${counter.counter}, but I appreciate your honesty.`;
    } else {
      return `${counter.counter}. I'm not convinced by your argument.`;
    }
  }

  private checkPersuasionWinConditions(game: PersuasionGame): { status: string } {
    if (game.currentRound >= game.totalRounds) {
      game.status = game.playerScore > game.characterScore ? 'completed' : 'failed';
    } else if (game.playerScore >= 300) {
      game.status = 'completed';
    } else if (game.gameData.emotionalState.suspicion >= 80) {
      game.status = 'failed';
    } else {
      game.status = 'in_progress';
    }
    
    return { status: game.status };
  }

  private getNextPersuasionRound(game: PersuasionGame): any {
    return {
      availableArguments: game.gameData.playerArguments.filter(a => !a.used),
      emotionalState: game.gameData.emotionalState,
      roundsRemaining: game.totalRounds - game.currentRound
    };
  }

  // Additional helper methods for other minigames...
  private evaluatePlayerInformation(playerInfo: string[], character: TavernCharacterData): InformationTradingGame['gameData']['playerInformation'] {
    return playerInfo.map(info => ({
      info,
      value: Math.floor(Math.random() * 50) + 25,
      rarity: Math.floor(Math.random() * 10) + 1,
      characterInterest: Math.floor(Math.random() * 100)
    }));
  }

  private generateCharacterInformation(character: TavernCharacterData): InformationTradingGame['gameData']['characterInformation'] {
    const infoTypes = [
      'Local gossip about recent events',
      'Trade route information',
      'Political developments',
      'Personal anecdotes',
      'Professional insights'
    ];

    return infoTypes.map(info => ({
      info,
      value: Math.floor(Math.random() * 50) + 25,
      rarity: Math.floor(Math.random() * 10) + 1,
      playerInterest: Math.floor(Math.random() * 100)
    }));
  }

  private calculateTradeFairness(playerOffer: any, requestedInfo: any): number {
    const valueDifference = Math.abs(playerOffer.value - requestedInfo.value);
    const rarityDifference = Math.abs(playerOffer.rarity - requestedInfo.rarity);
    
    const fairness = 100 - (valueDifference + rarityDifference * 5);
    return Math.max(0, Math.min(100, fairness)) / 100;
  }

  private generateTradingResponse(accepted: boolean, fairness: number, trustLevel: number): string {
    if (accepted) {
      return fairness > 0.8 ? 
        "That's a fair trade. I accept your offer." :
        "I suppose that's acceptable. Very well.";
    } else {
      return fairness < 0.3 ?
        "That's hardly a fair exchange. I'll need something better." :
        "I'm not quite ready to part with that information yet.";
    }
  }

  private checkTradingWinConditions(game: InformationTradingGame): { status: string } {
    if (game.currentRound >= game.totalRounds) {
      game.status = game.playerScore > game.characterScore ? 'completed' : 'failed';
    } else if (game.gameData.trustLevel <= 0) {
      game.status = 'failed';
    } else {
      game.status = 'in_progress';
    }
    
    return { status: game.status };
  }

  private getNextTradingRound(game: InformationTradingGame): any {
    return {
      availablePlayerInfo: game.gameData.playerInformation,
      availableCharacterInfo: game.gameData.characterInformation,
      trustLevel: game.gameData.trustLevel,
      roundsRemaining: game.totalRounds - game.currentRound
    };
  }

  // Drinking contest helpers
  private calculatePlayerTolerance(): number {
    return Math.floor(Math.random() * 50) + 50; // 50-100
  }

  private calculateCharacterTolerance(character: TavernCharacterData): number {
    let tolerance = 50;
    
    if (character.race === 'Dwarf') tolerance += 30;
    if (character.race === 'Halfling') tolerance -= 20;
    if (character.characterClass === 'Soldier') tolerance += 15;
    if (character.personalityTraits.includes('Hardy')) tolerance += 20;
    
    return Math.max(20, Math.min(100, tolerance));
  }

  private characterDrinkingDecision(game: DrinkingContestGame): boolean {
    const tolerance = game.gameData.characterTolerance;
    const currentIntoxication = game.gameData.characterIntoxication;
    
    // Character is more likely to drink if they have high tolerance and low intoxication
    const drinkChance = (tolerance - currentIntoxication) / 100;
    return Math.random() < drinkChance;
  }

  private calculateIntoxicationIncrease(drinkType: string): number {
    const drinkStrengths = {
      'ale': 10,
      'wine': 15,
      'spirits': 25,
      'dwarven_ale': 20,
      'elven_wine': 12
    };
    
    return drinkStrengths[drinkType as keyof typeof drinkStrengths] || 10;
  }

  private updateDrinkingConversationEffects(game: DrinkingContestGame): void {
    const effects = game.gameData.conversationEffects;
    
    effects.playerSpeechClarity = Math.max(0, 100 - game.gameData.playerIntoxication);
    effects.characterSpeechClarity = Math.max(0, 100 - game.gameData.characterIntoxication);
    effects.inhibitionLevel = Math.max(0, 100 - (game.gameData.playerIntoxication + game.gameData.characterIntoxication) / 2);
  }

  private generateDrinkingReaction(drank: boolean, intoxication: number): string {
    if (!drank) return "*declines the drink*";
    
    if (intoxication < 30) return "*drinks confidently*";
    if (intoxication < 60) return "*drinks with slight hesitation*";
    if (intoxication < 80) return "*drinks unsteadily*";
    return "*struggles to drink*";
  }

  private checkForSecretsRevealed(game: DrinkingContestGame): string[] {
    const secrets: string[] = [];
    
    if (game.gameData.conversationEffects.inhibitionLevel < 30) {
      secrets.push("A personal secret slips out due to lowered inhibitions");
    }
    if (game.gameData.conversationEffects.inhibitionLevel < 50 && Math.random() < 0.3) {
      secrets.push("Professional information revealed");
    }
    
    return secrets;
  }

  private checkDrinkingWinConditions(game: DrinkingContestGame): { status: string } {
    if (game.gameData.playerIntoxication >= 100) {
      game.status = 'failed';
    } else if (game.gameData.characterIntoxication >= 100) {
      game.status = 'completed';
    } else if (game.currentRound >= game.totalRounds) {
      game.status = game.playerScore > game.characterScore ? 'completed' : 'failed';
    } else {
      game.status = 'in_progress';
    }
    
    return { status: game.status };
  }

  private getNextDrinkingRound(game: DrinkingContestGame): any {
    return {
      playerIntoxication: game.gameData.playerIntoxication,
      characterIntoxication: game.gameData.characterIntoxication,
      conversationEffects: game.gameData.conversationEffects,
      roundsRemaining: game.totalRounds - game.currentRound
    };
  }

  // Storytelling helpers
  private generateStoryPrompts(theme: string): string[] {
    const prompts = [
      `Begin your ${theme} story with an unexpected character`,
      `Include a moment of great danger in your tale`,
      `Weave in a lesson learned from experience`,
      `Add a touch of humor to lighten the mood`,
      `End with a surprising twist`
    ];
    
    return prompts;
  }

  // Reward calculation methods
  private calculatePersuasionRewards(stakes: any): any {
    return {
      winner: { ...stakes.playerStake, bonus: 'Increased reputation' },
      loser: { penalty: 'Slight reputation loss' }
    };
  }

  private calculateTradingRewards(stakes: any): any {
    return {
      winner: { information: 'Valuable secrets', reputation: 'Information broker status' },
      loser: { penalty: 'Information disadvantage' }
    };
  }

  private calculateDrinkingRewards(stakes: any): any {
    return {
      winner: { reputation: 'Drinking champion', secrets: 'Information from loose tongues' },
      loser: { penalty: 'Hangover and embarrassment' }
    };
  }

  private calculateStorytellingRewards(stakes: any): any {
    return {
      winner: { reputation: 'Master storyteller', audience: 'Increased popularity' },
      loser: { penalty: 'Boring reputation' }
    };
  }

  // Public getters
  getMinigame(gameId: string): ConversationMinigame | undefined {
    return this.activeMinigames.get(gameId);
  }

  getAllActiveMinigames(): Map<string, ConversationMinigame> {
    return new Map(this.activeMinigames);
  }

  endMinigame(gameId: string): void {
    this.activeMinigames.delete(gameId);
  }
}
