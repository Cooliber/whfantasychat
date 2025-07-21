import type { TavernCharacterData, CharacterRace, CharacterClass } from '../types/warhammer.types';

// Voice and Personality Types
export interface VoiceProfile {
  characterId: string;
  
  // Speech patterns
  formalityLevel: number; // 0-100 (0 = very casual, 100 = extremely formal)
  verbosity: number; // 0-100 (0 = terse, 100 = very wordy)
  eloquence: number; // 0-100 (0 = simple speech, 100 = sophisticated)
  
  // Linguistic characteristics
  vocabulary: 'simple' | 'common' | 'educated' | 'scholarly' | 'archaic';
  accent: string;
  speechTempo: 'slow' | 'measured' | 'normal' | 'quick' | 'rapid';
  
  // Cultural speech patterns
  culturalPhrases: string[];
  honorifics: string[];
  curses: string[];
  greetings: string[];
  farewells: string[];
  
  // Personality-driven speech
  catchphrases: string[];
  speechTics: string[];
  emotionalExpressions: Record<string, string[]>;
  
  // Social class indicators
  classMarkers: string[];
  professionalJargon: string[];
}

export interface SpeechPattern {
  pattern: string;
  replacement: string;
  conditions?: {
    emotion?: string;
    formality?: number;
    relationship?: string;
  };
}

// Voice and Personality Manager
export class VoicePersonalityManager {
  private voiceProfiles: Map<string, VoiceProfile> = new Map();
  
  // Racial speech patterns
  private static readonly RACIAL_SPEECH_PATTERNS: Record<CharacterRace, {
    vocabulary: VoiceProfile['vocabulary'];
    accent: string;
    culturalPhrases: string[];
    honorifics: string[];
    curses: string[];
    greetings: string[];
    farewells: string[];
    speechPatterns: SpeechPattern[];
  }> = {
    'Empire': {
      vocabulary: 'common',
      accent: 'Imperial',
      culturalPhrases: [
        'By Sigmar\'s hammer!', 'Praise be to the Emperor!', 'For the Empire!',
        'As sure as Sigmar watches over us', 'By the twin-tailed comet'
      ],
      honorifics: ['Sir', 'Madam', 'Your Lordship', 'Your Ladyship', 'Captain', 'Herr', 'Frau'],
      curses: ['Sigmar\'s blood!', 'Damn and blast!', 'By Ranald\'s bones!', 'Morr take you!'],
      greetings: ['Good day to you', 'Well met', 'Hail and well met', 'Greetings, friend'],
      farewells: ['Sigmar protect you', 'Safe travels', 'Until we meet again', 'Fare thee well'],
      speechPatterns: [
        { pattern: 'I think', replacement: 'I reckon' },
        { pattern: 'very', replacement: 'right' },
        { pattern: 'yes', replacement: 'aye' }
      ]
    },
    'Bretonnia': {
      vocabulary: 'educated',
      accent: 'Bretonnian',
      culturalPhrases: [
        'By the Lady\'s grace!', 'For the honour of Bretonnia!', 'In the Lady\'s name',
        'As chivalry demands', 'By my sacred oath'
      ],
      honorifics: ['Mon Seigneur', 'Ma Dame', 'Sir Knight', 'Your Grace', 'Noble Lord', 'Fair Lady'],
      curses: ['Sacré bleu!', 'By the Lady\'s tears!', 'Curse this dishonour!'],
      greetings: ['I bid you good day', 'Well met, noble friend', 'Greetings and honour to you'],
      farewells: ['May the Lady watch over you', 'Honour guide your path', 'Adieu, mon ami'],
      speechPatterns: [
        { pattern: 'the', replacement: 'ze', conditions: { formality: 30 } },
        { pattern: 'this', replacement: 'zis', conditions: { formality: 30 } },
        { pattern: 'with', replacement: 'wiz', conditions: { formality: 30 } }
      ]
    },
    'Dwarf': {
      vocabulary: 'common',
      accent: 'Khazalid-influenced',
      culturalPhrases: [
        'By my beard!', 'Khazad ai-mênu!', 'Baruk Khazâd!', 'By the ancestors!',
        'That\'s going in the book!', 'A grudge worth settling'
      ],
      honorifics: ['Thane', 'King', 'Longbeard', 'Master', 'Clan Leader'],
      curses: ['Dammaz kron!', 'Khazukan kazakit-ha!', 'Bloody grobi!', 'Wazzok!'],
      greetings: ['Well met, kinsman', 'Hail and well met', 'Good to see you, beardling'],
      farewells: ['May your beard grow ever longer', 'Safe paths, kinsman', 'Khazad dûm!'],
      speechPatterns: [
        { pattern: 'going', replacement: 'goin\'' },
        { pattern: 'nothing', replacement: 'nowt' },
        { pattern: 'something', replacement: 'summat' },
        { pattern: 'very', replacement: 'right' }
      ]
    },
    'Elf': {
      vocabulary: 'scholarly',
      accent: 'Eltharin-influenced',
      culturalPhrases: [
        'By Isha\'s tears', 'As the winds of magic flow', 'In the name of Asuryan',
        'By the eternal flame', 'As ancient as the world-roots'
      ],
      honorifics: ['Lord', 'Lady', 'Prince', 'Princess', 'Mage', 'Loremaster'],
      curses: ['Khaine\'s blood!', 'By the dark gods!', 'Curse this mortal realm!'],
      greetings: ['Well met, young one', 'Greetings, child of the younger races', 'Peace be upon you'],
      farewells: ['May the winds guide you', 'Until the stars align again', 'Farewell, brief flame'],
      speechPatterns: [
        { pattern: 'I am', replacement: 'I find myself' },
        { pattern: 'quickly', replacement: 'with all due haste' },
        { pattern: 'old', replacement: 'ancient' }
      ]
    },
    'Halfling': {
      vocabulary: 'simple',
      accent: 'Mootland',
      culturalPhrases: [
        'Well, I never!', 'Bless my buttons!', 'By my pantry!', 'As sure as second breakfast',
        'That\'s a fine kettle of fish'
      ],
      honorifics: ['Master', 'Missus', 'Elder', 'Mayor'],
      curses: ['Drat and bother!', 'Oh, fiddlesticks!', 'Well, I\'ll be jiggered!'],
      greetings: ['Good morning!', 'Lovely day, isn\'t it?', 'Well, hello there!'],
      farewells: ['Safe travels!', 'Mind how you go!', 'Come back soon!'],
      speechPatterns: [
        { pattern: 'very', replacement: 'mighty' },
        { pattern: 'excellent', replacement: 'right fine' },
        { pattern: 'indeed', replacement: 'that it is' }
      ]
    },
    'Tilean': {
      vocabulary: 'educated',
      accent: 'Tilean',
      culturalPhrases: [
        'Madonna mia!', 'By all the gods!', 'As sure as gold glitters',
        'Business is business', 'Art is life'
      ],
      honorifics: ['Signore', 'Signora', 'Maestro', 'Dottore', 'Principe'],
      curses: ['Maledizione!', 'Dio mio!', 'Basta!'],
      greetings: ['Buongiorno!', 'Salve, amico!', 'How do you do?'],
      farewells: ['Arrivederci!', 'Ciao, bello!', 'Until we meet again!'],
      speechPatterns: [
        { pattern: 'the', replacement: 'ze' },
        { pattern: 'this', replacement: 'zis' },
        { pattern: 'yes', replacement: 'si, si' }
      ]
    },
    'Estalia': {
      vocabulary: 'common',
      accent: 'Estalian',
      culturalPhrases: [
        '¡Por Dios!', 'By the saints!', 'As God wills it', 'Honor above all',
        'Faith conquers all'
      ],
      honorifics: ['Don', 'Doña', 'Señor', 'Señora', 'Padre', 'Capitán'],
      curses: ['¡Maldición!', '¡Diablos!', 'By all the saints!'],
      greetings: ['¡Buenos días!', '¡Hola, amigo!', 'Peace be with you'],
      farewells: ['¡Vaya con Dios!', '¡Adiós!', 'May God protect you'],
      speechPatterns: [
        { pattern: 'yes', replacement: 'sí, sí' },
        { pattern: 'the', replacement: 'ze' },
        { pattern: 'very', replacement: 'muy' }
      ]
    },
    'Border Princes': {
      vocabulary: 'common',
      accent: 'Mixed',
      culturalPhrases: [
        'By my sword!', 'Freedom above all!', 'No king but steel',
        'Live free or die', 'Every man for himself'
      ],
      honorifics: ['Boss', 'Chief', 'Captain', 'Leader'],
      curses: ['Damn it all!', 'Bloody hell!', 'To the abyss with it!'],
      greetings: ['Well met, stranger', 'What brings you here?', 'Hail, traveler'],
      farewells: ['Watch your back', 'Safe roads', 'Until next time'],
      speechPatterns: [
        { pattern: 'going to', replacement: 'gonna' },
        { pattern: 'want to', replacement: 'wanna' },
        { pattern: 'have to', replacement: 'gotta' }
      ]
    },
    'Norsca': {
      vocabulary: 'simple',
      accent: 'Norse',
      culturalPhrases: [
        'By Thor\'s hammer!', 'For glory!', 'Death before dishonor!',
        'The strong survive', 'Blood and thunder!'
      ],
      honorifics: ['Jarl', 'King', 'Warrior', 'Berserker', 'Skald'],
      curses: ['By Odin\'s beard!', 'Thor\'s blood!', 'Curse the gods!'],
      greetings: ['Hail, warrior!', 'Well met in battle!', 'Greetings, friend!'],
      farewells: ['Die well!', 'May you feast in Valhalla!', 'Until Ragnarok!'],
      speechPatterns: [
        { pattern: 'the', replacement: 'ze' },
        { pattern: 'with', replacement: 'vith' },
        { pattern: 'what', replacement: 'vhat' }
      ]
    }
  };

  // Social class speech patterns
  private static readonly CLASS_SPEECH_PATTERNS: Record<string, {
    formalityLevel: number;
    verbosity: number;
    eloquence: number;
    vocabulary: VoiceProfile['vocabulary'];
    classMarkers: string[];
    speechPatterns: SpeechPattern[];
  }> = {
    'noble': {
      formalityLevel: 85,
      verbosity: 75,
      eloquence: 90,
      vocabulary: 'scholarly',
      classMarkers: [
        'One finds that...', 'It is my considered opinion...', 'I dare say...',
        'If I may be so bold...', 'One simply must...'
      ],
      speechPatterns: [
        { pattern: 'I want', replacement: 'I should very much like' },
        { pattern: 'I think', replacement: 'I am of the opinion' },
        { pattern: 'good', replacement: 'most excellent' }
      ]
    },
    'burgher': {
      formalityLevel: 60,
      verbosity: 55,
      eloquence: 65,
      vocabulary: 'educated',
      classMarkers: [
        'In my experience...', 'As any reasonable person knows...',
        'Business is business...', 'Mark my words...'
      ],
      speechPatterns: [
        { pattern: 'I think', replacement: 'I believe' },
        { pattern: 'very', replacement: 'quite' },
        { pattern: 'good', replacement: 'fine' }
      ]
    },
    'peasant': {
      formalityLevel: 25,
      verbosity: 35,
      eloquence: 30,
      vocabulary: 'simple',
      classMarkers: [
        'Well, I reckon...', 'Seems to me...', 'Plain as day...',
        'Any fool can see...', 'That\'s the way of it...'
      ],
      speechPatterns: [
        { pattern: 'going', replacement: 'goin\'' },
        { pattern: 'nothing', replacement: 'nothin\'' },
        { pattern: 'something', replacement: 'somethin\'' },
        { pattern: 'very', replacement: 'mighty' }
      ]
    },
    'clergy': {
      formalityLevel: 80,
      verbosity: 70,
      eloquence: 85,
      vocabulary: 'scholarly',
      classMarkers: [
        'The gods will it...', 'By divine providence...', 'In the name of the holy...',
        'As scripture teaches...', 'May the gods grant...'
      ],
      speechPatterns: [
        { pattern: 'I hope', replacement: 'I pray' },
        { pattern: 'good luck', replacement: 'divine blessing' },
        { pattern: 'goodbye', replacement: 'go in peace' }
      ]
    },
    'outlaw': {
      formalityLevel: 15,
      verbosity: 40,
      eloquence: 25,
      vocabulary: 'common',
      classMarkers: [
        'Listen here...', 'I ain\'t sayin\' but...', 'Word on the street...',
        'Keep this quiet...', 'Between you and me...'
      ],
      speechPatterns: [
        { pattern: 'going to', replacement: 'gonna' },
        { pattern: 'want to', replacement: 'wanna' },
        { pattern: 'have to', replacement: 'gotta' },
        { pattern: 'police', replacement: 'the watch' }
      ]
    }
  };

  // Generate voice profile for character
  generateVoiceProfile(character: TavernCharacterData): VoiceProfile {
    const racialPattern = VoicePersonalityManager.RACIAL_SPEECH_PATTERNS[character.race];
    const classPattern = VoicePersonalityManager.CLASS_SPEECH_PATTERNS[character.background?.socialClass || 'peasant'];

    const profile: VoiceProfile = {
      characterId: character.id,
      formalityLevel: this.calculateFormality(character, classPattern.formalityLevel),
      verbosity: this.calculateVerbosity(character, classPattern.verbosity),
      eloquence: this.calculateEloquence(character, classPattern.eloquence),
      vocabulary: this.determineVocabulary(character, racialPattern.vocabulary, classPattern.vocabulary),
      accent: racialPattern.accent,
      speechTempo: this.determineSpeechTempo(character),
      culturalPhrases: racialPattern.culturalPhrases,
      honorifics: racialPattern.honorifics,
      curses: racialPattern.curses,
      greetings: racialPattern.greetings,
      farewells: racialPattern.farewells,
      catchphrases: this.generateCatchphrases(character),
      speechTics: this.generateSpeechTics(character),
      emotionalExpressions: this.generateEmotionalExpressions(character),
      classMarkers: classPattern.classMarkers,
      professionalJargon: this.generateProfessionalJargon(character)
    };

    this.voiceProfiles.set(character.id, profile);
    return profile;
  }

  // Apply voice profile to text
  applyVoiceProfile(
    characterId: string,
    text: string,
    context: {
      emotion?: string;
      formality?: number;
      relationship?: string;
    } = {}
  ): string {
    const profile = this.voiceProfiles.get(characterId);
    if (!profile) return text;

    let processedText = text;

    // Apply racial speech patterns
    const racialPatterns = VoicePersonalityManager.RACIAL_SPEECH_PATTERNS[
      Object.keys(VoicePersonalityManager.RACIAL_SPEECH_PATTERNS).find(race => 
        VoicePersonalityManager.RACIAL_SPEECH_PATTERNS[race as CharacterRace].accent === profile.accent
      ) as CharacterRace
    ];

    if (racialPatterns) {
      racialPatterns.speechPatterns.forEach(pattern => {
        if (this.shouldApplyPattern(pattern, context, profile)) {
          processedText = processedText.replace(
            new RegExp(`\\b${pattern.pattern}\\b`, 'gi'),
            pattern.replacement
          );
        }
      });
    }

    // Apply class speech patterns
    const classPatterns = Object.values(VoicePersonalityManager.CLASS_SPEECH_PATTERNS).find(
      classPattern => classPattern.classMarkers === profile.classMarkers
    );

    if (classPatterns) {
      classPatterns.speechPatterns.forEach(pattern => {
        if (this.shouldApplyPattern(pattern, context, profile)) {
          processedText = processedText.replace(
            new RegExp(`\\b${pattern.pattern}\\b`, 'gi'),
            pattern.replacement
          );
        }
      });
    }

    // Add emotional expressions
    if (context.emotion && profile.emotionalExpressions[context.emotion]) {
      const expressions = profile.emotionalExpressions[context.emotion];
      const expression = expressions[Math.floor(Math.random() * expressions.length)];
      processedText = `${expression} ${processedText}`;
    }

    // Add cultural phrases occasionally
    if (Math.random() < 0.1 && profile.culturalPhrases.length > 0) {
      const phrase = profile.culturalPhrases[Math.floor(Math.random() * profile.culturalPhrases.length)];
      processedText = `${phrase} ${processedText}`;
    }

    // Add speech tics occasionally
    if (Math.random() < 0.05 && profile.speechTics.length > 0) {
      const tic = profile.speechTics[Math.floor(Math.random() * profile.speechTics.length)];
      processedText = `${processedText} ${tic}`;
    }

    return processedText;
  }

  // Helper methods
  private calculateFormality(character: TavernCharacterData, baseFormality: number): number {
    let formality = baseFormality;
    
    if (character.personalityTraits.includes('Formal')) formality += 15;
    if (character.personalityTraits.includes('Casual')) formality -= 15;
    if (character.age > 50) formality += 10;
    if (character.age < 25) formality -= 10;
    
    return Math.max(0, Math.min(100, formality));
  }

  private calculateVerbosity(character: TavernCharacterData, baseVerbosity: number): number {
    let verbosity = baseVerbosity;
    
    if (character.personalityTraits.includes('Talkative')) verbosity += 20;
    if (character.personalityTraits.includes('Quiet')) verbosity -= 20;
    if (character.characterClass === 'Scholar') verbosity += 15;
    
    return Math.max(0, Math.min(100, verbosity));
  }

  private calculateEloquence(character: TavernCharacterData, baseEloquence: number): number {
    let eloquence = baseEloquence;
    
    if (character.skills.includes('Academic Knowledge')) eloquence += 15;
    if (character.skills.includes('Charm')) eloquence += 10;
    if (character.background?.education === 'university') eloquence += 20;
    
    return Math.max(0, Math.min(100, eloquence));
  }

  private determineVocabulary(
    character: TavernCharacterData,
    racialVocab: VoiceProfile['vocabulary'],
    classVocab: VoiceProfile['vocabulary']
  ): VoiceProfile['vocabulary'] {
    const vocabLevels = ['simple', 'common', 'educated', 'scholarly', 'archaic'];
    const racialIndex = vocabLevels.indexOf(racialVocab);
    const classIndex = vocabLevels.indexOf(classVocab);
    
    // Take the higher of the two
    const finalIndex = Math.max(racialIndex, classIndex);
    return vocabLevels[finalIndex] as VoiceProfile['vocabulary'];
  }

  private determineSpeechTempo(character: TavernCharacterData): VoiceProfile['speechTempo'] {
    if (character.personalityTraits.includes('Energetic')) return 'quick';
    if (character.personalityTraits.includes('Contemplative')) return 'slow';
    if (character.age > 60) return 'measured';
    if (character.age < 20) return 'rapid';
    return 'normal';
  }

  private generateCatchphrases(character: TavernCharacterData): string[] {
    const phrases = [];
    
    if (character.characterClass === 'Soldier') {
      phrases.push('That\'s an order!', 'Stand fast!', 'Hold the line!');
    } else if (character.characterClass === 'Scholar') {
      phrases.push('Fascinating!', 'Most intriguing...', 'As the texts say...');
    } else if (character.characterClass === 'Merchant') {
      phrases.push('That\'s good business!', 'A fair deal!', 'Profit and prosperity!');
    }
    
    return phrases;
  }

  private generateSpeechTics(character: TavernCharacterData): string[] {
    const tics = [];
    
    if (character.personalityTraits.includes('Nervous')) {
      tics.push('you know?', 'if you catch my meaning', 'so to speak');
    }
    if (character.personalityTraits.includes('Confident')) {
      tics.push('mark my words', 'trust me on this', 'without a doubt');
    }
    
    return tics;
  }

  private generateEmotionalExpressions(character: TavernCharacterData): Record<string, string[]> {
    return {
      happiness: ['*chuckles warmly*', '*grins broadly*', '*eyes sparkle*'],
      sadness: ['*sighs deeply*', '*looks downcast*', '*voice wavers*'],
      anger: ['*scowls*', '*voice hardens*', '*clenches fist*'],
      fear: ['*glances nervously*', '*voice trembles*', '*takes a step back*'],
      surprise: ['*eyes widen*', '*gasps*', '*leans forward*']
    };
  }

  private generateProfessionalJargon(character: TavernCharacterData): string[] {
    const jargon: Record<string, string[]> = {
      'Soldier': ['tactical advantage', 'flanking maneuver', 'hold position', 'advance in formation'],
      'Scholar': ['empirical evidence', 'theoretical framework', 'scholarly discourse', 'academic rigor'],
      'Merchant': ['market conditions', 'profit margins', 'supply and demand', 'trade routes'],
      'Blacksmith': ['temper the steel', 'forge quality', 'hammer and anvil', 'quench and cool'],
      'Priest': ['divine providence', 'sacred duty', 'blessed sacrament', 'holy scripture']
    };
    
    return jargon[character.characterClass] || [];
  }

  private shouldApplyPattern(
    pattern: SpeechPattern,
    context: any,
    profile: VoiceProfile
  ): boolean {
    if (!pattern.conditions) return true;
    
    if (pattern.conditions.emotion && context.emotion !== pattern.conditions.emotion) {
      return false;
    }
    
    if (pattern.conditions.formality && profile.formalityLevel < pattern.conditions.formality) {
      return false;
    }
    
    if (pattern.conditions.relationship && context.relationship !== pattern.conditions.relationship) {
      return false;
    }
    
    return true;
  }

  // Public getters
  getVoiceProfile(characterId: string): VoiceProfile | undefined {
    return this.voiceProfiles.get(characterId);
  }

  // Generate greeting based on voice profile
  generateGreeting(characterId: string, timeOfDay: string, relationship: string): string {
    const profile = this.voiceProfiles.get(characterId);
    if (!profile) return 'Hello there!';

    let greeting = profile.greetings[Math.floor(Math.random() * profile.greetings.length)];
    
    // Adjust for time of day
    if (timeOfDay === 'morning') {
      greeting = greeting.replace('Good day', 'Good morning');
    } else if (timeOfDay === 'evening') {
      greeting = greeting.replace('Good day', 'Good evening');
    }
    
    // Add honorific for formal relationships
    if (profile.formalityLevel > 70 && relationship === 'stranger') {
      const honorific = profile.honorifics[Math.floor(Math.random() * profile.honorifics.length)];
      greeting = `${greeting}, ${honorific}`;
    }
    
    return greeting;
  }

  // Generate farewell based on voice profile
  generateFarewell(characterId: string, relationship: string): string {
    const profile = this.voiceProfiles.get(characterId);
    if (!profile) return 'Goodbye!';

    return profile.farewells[Math.floor(Math.random() * profile.farewells.length)];
  }
}
