// Core Warhammer Fantasy Tavern Types
export type SceneType = 
  | 'Quiet Evening' 
  | 'Busy Market Day' 
  | 'Storm Night' 
  | 'Festival Celebration' 
  | 'Mysterious Gathering';

export type CharacterRace = 
  | 'Empire' 
  | 'Dwarf' 
  | 'Elf' 
  | 'Halfling' 
  | 'Bretonnian' 
  | 'Tilean' 
  | 'Norse';

export type CharacterClass =
  | 'Soldier' | 'Scholar' | 'Blacksmith' | 'Ranger' | 'Merchant'
  | 'Warrior' | 'Mage' | 'Scout' | 'Rogue' | 'Innkeeper'
  | 'Burglar' | 'Cook' | 'Knight' | 'Berserker'
  | 'Witch Hunter' | 'Wizard' | 'Technomancer' | 'Cyber-Knight'
  | 'Digital Alchemist' | 'Quantum Scribe' | 'Nano-Smith' | 'Bio-Engineer';

// Enhanced Character Customization Types
export type WeaponType =
  | 'Sword' | 'Axe' | 'Mace' | 'Bow' | 'Crossbow' | 'Staff' | 'Dagger'
  | 'Plasma Blade' | 'Laser Rifle' | 'Nano-Sword' | 'Quantum Staff'
  | 'Bio-Weapon' | 'Neural Disruptor' | 'Cyber-Hammer' | 'Digital Bow';

export type ArmorType =
  | 'Leather' | 'Chain Mail' | 'Plate' | 'Robes' | 'Light Armor'
  | 'Power Armor' | 'Nano-Mesh' | 'Bio-Suit' | 'Quantum Shield'
  | 'Cyber-Plate' | 'Digital Cloak' | 'Neural Interface Suit';

export type CyberneticType =
  | 'Neural Implant' | 'Cyber Eye' | 'Mechanical Arm' | 'Data Port'
  | 'Memory Enhancer' | 'Reflex Booster' | 'Bio-Scanner' | 'Quantum Processor'
  | 'Nano-Blood' | 'Digital Soul' | 'Techno-Heart' | 'Cyber-Brain';

export type TechnologyType =
  | 'Alchemy Kit' | 'Scrying Crystal' | 'Enchanted Tools' | 'Healing Potions'
  | 'Quantum Computer' | 'Nano-Fabricator' | 'Bio-Lab' | 'Neural Network'
  | 'Holographic Projector' | 'Time Dilator' | 'Matter Compiler' | 'AI Assistant';

// Enhanced Character Background System
export interface CharacterBackground {
  socialClass: 'peasant' | 'burgher' | 'noble' | 'clergy' | 'outlaw';
  birthplace: string;
  family: {
    status: 'unknown' | 'poor' | 'middle' | 'wealthy' | 'noble';
    reputation: string;
    livingMembers: number;
    notableAncestors?: string[];
  };
  education: 'none' | 'basic' | 'guild' | 'university' | 'temple' | 'military';
  careerPath: Array<{
    career: string;
    duration: number; // years
    achievements: string[];
    connections: string[];
  }>;
  militaryService?: {
    unit: string;
    rank: string;
    campaigns: string[];
    decorations: string[];
    discharge: 'honorable' | 'medical' | 'disciplinary' | 'desertion';
  };
  guildMembership?: {
    guild: string;
    rank: 'apprentice' | 'journeyman' | 'master' | 'grandmaster';
    specialization: string;
    standing: number; // 1-10
  };
  criminalRecord?: {
    crimes: string[];
    convictions: number;
    timeServed: number; // months
    currentStatus: 'clean' | 'wanted' | 'pardoned' | 'fugitive';
  };
}

// Faction System
export interface FactionStanding {
  factionId: string;
  name: string;
  standing: number; // -100 to 100
  rank?: string;
  privileges: string[];
  obligations: string[];
  lastInteraction: Date;
}

// Character Progression System
export interface CharacterProgression {
  level: number;
  experience: number;
  skillPoints: number;
  availableAdvances: string[];
  completedAdvances: string[];
  careerProgress: {
    currentCareer: string;
    advancesInCareer: number;
    canAdvanceCareer: boolean;
    availableCareerExits: string[];
  };
}

// Reputation System
export interface CharacterReputation {
  overall: number; // 1-100
  byRegion: Record<Region, number>;
  byFaction: Record<string, number>;
  bySocialClass: Record<string, number>;
  traits: Array<{
    trait: string;
    strength: number; // 1-10
    source: string;
  }>;
  rumors: Array<{
    content: string;
    veracity: boolean;
    spread: number; // how widely known
    impact: 'positive' | 'negative' | 'neutral';
  }>;
}

// Enhanced Skills System
export interface CharacterSkill {
  name: string;
  category: 'basic' | 'advanced' | 'academic' | 'trade' | 'combat' | 'social';
  level: number; // 1-100
  specializations: string[];
  experience: number;
  teachable: boolean;
  prerequisites?: string[];
}

// Social Standing System
export interface SocialStanding {
  title?: string;
  rank: number; // 1-10 within social class
  privileges: string[];
  obligations: string[];
  socialConnections: Array<{
    name: string;
    relationship: string;
    influence: number; // 1-10
  }>;
  courtlyKnowledge: number; // 1-100
  etiquetteSkill: number; // 1-100
}

// Character Motivations
export interface CharacterMotivation {
  primary: string;
  secondary: string[];
  shortTermGoals: Array<{
    goal: string;
    priority: number; // 1-10
    deadline?: Date;
    progress: number; // 0-100%
  }>;
  longTermAmbitions: Array<{
    ambition: string;
    feasibility: number; // 1-10
    timeframe: string;
    obstacles: string[];
  }>;
  fears: string[];
  desires: string[];
  moralCode?: {
    principles: string[];
    flexibility: number; // 1-10, how willing to compromise
  };
}

// Character Secrets System
export interface CharacterSecret {
  id: string;
  category: 'identity' | 'past' | 'affiliation' | 'knowledge' | 'possession' | 'relationship';
  severity: 'minor' | 'moderate' | 'major' | 'devastating';
  content: string;
  discoveryDifficulty: number; // 1-10
  consequences: {
    personal: string[];
    social: string[];
    legal: string[];
    financial: string[];
  };
  whoKnows: string[]; // character IDs
  clues: Array<{
    type: 'behavioral' | 'physical' | 'verbal' | 'circumstantial';
    description: string;
    obviousness: number; // 1-10
  }>;
}

export interface TavernCharacterData {
  id: string;
  name: string;
  race: CharacterRace;
  characterClass: CharacterClass;
  age: number;
  backstory: string;
  personalityTraits: string[];
  conversationPreferences: {
    topics: string[];
    avoidanceTopics: string[];
    initiationLikelihood: number;
    responseStyle: 'formal' | 'casual' | 'mysterious' | 'friendly' | 'gruff';
  };
  currentMood: string;
  relationshipModifiers: Record<string, number>;
  skills: string[];
  equipment: string[];
  secrets: string[];
  goals: string[];

  // Enhanced Character Features
  background: CharacterBackground;
  factionStandings: Map<string, FactionStanding>;
  progression: CharacterProgression;
  reputation: CharacterReputation;
  enhancedSkills: Map<string, CharacterSkill>;
  socialStanding: SocialStanding;
  motivations: CharacterMotivation;
  characterSecrets: Map<string, CharacterSecret>;

  // Enhanced Customization Options
  appearance?: {
    height: string;
    build: 'Slim' | 'Average' | 'Muscular' | 'Heavy' | 'Cybernetic';
    eyeColor: string;
    hairColor: string;
    distinguishingMarks: string[];
    cyberneticVisibility: 'Hidden' | 'Subtle' | 'Obvious' | 'Dominant';
  };

  weapons?: WeaponType[];
  armor?: ArmorType[];
  cybernetics?: CyberneticType[];
  technology?: TechnologyType[];

  // Advanced Character Stats
  attributes?: {
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    techAffinity: number;
    magicResistance: number;
  };

  // Background Enhancement
  origin?: {
    birthplace: string;
    socialClass: 'Noble' | 'Merchant' | 'Artisan' | 'Peasant' | 'Outcast' | 'Cyber-Enhanced';
    education: string;
    formativeEvent: string;
  };

  // Narrative Hooks
  questHooks?: string[];
  rumors?: string[];
  connections?: {
    characterId: string;
    relationship: string;
    sharedHistory: string;
  }[];
}

export interface ConversationMessage {
  id: string;
  characterId: string;
  content: string;
  timestamp: Date;
  type: 'dialogue' | 'action' | 'gossip' | 'whisper';
  emotionalTone?: 'positive' | 'negative' | 'neutral';
  audienceRestriction?: string[];
}

export interface ConversationData {
  id: string;
  timestamp: Date;
  sceneContext: SceneType;
  participants: string[];
  messages: ConversationMessage[];
  topicTags: string[];
  emotionalTone: 'positive' | 'negative' | 'neutral';
  plotRelevanceScore: number;
  storyThreadIds: string[];
  gossipGenerated: string[];
  playerChoices: {
    id: string;
    prompt: string;
    options: {
      text: string;
      consequences: string[];
    }[];
  }[];
}

export interface StoryThreadData {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  participants: string[];
  scenes: SceneType[];
  createdAt: Date;
  updatedAt: Date;
  progressMarkers: {
    description: string;
    timestamp: Date;
    involvedCharacters: string[];
  }[];
}

export interface GossipData {
  id: string;
  content: string;
  category: 'rumor' | 'secret' | 'news' | 'prophecy';
  source: string;
  targets: string[];
  veracity: boolean;
  spreadCount: number;
  createdAt: Date;
}

export interface TavernSceneData {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  activeCharacters: string[];
  availableActions: {
    id: string;
    label: string;
    description: string;
  }[];
  isActive: boolean;
}

// Enhanced Tavern Management Types
export interface TavernInventoryItem {
  id: string;
  name: string;
  type: 'food' | 'drink' | 'supply' | 'equipment' | 'rare';
  quantity: number;
  cost: number;
  quality: 'poor' | 'common' | 'good' | 'excellent' | 'legendary';
  origin: string; // Region where it comes from
  effects?: string[]; // Special effects or benefits
  rarity: number; // 1-10 scale
}

export interface TavernStaff {
  id: string;
  name: string;
  role: 'bartender' | 'cook' | 'server' | 'bouncer' | 'entertainer' | 'cleaner';
  skill: number; // 1-10
  wage: number;
  loyalty: number; // 1-10
  backstory: string;
  specialties: string[];
}

export interface TavernUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'room' | 'furniture' | 'service' | 'security' | 'entertainment';
  effects: {
    customerSatisfaction?: number;
    reputation?: number;
    capacity?: number;
    income?: number;
  };
  requirements?: string[];
  installed: boolean;
}

export interface TavernFinances {
  gold: number;
  dailyIncome: number;
  dailyExpenses: number;
  weeklyProfit: number;
  monthlyProfit: number;
  debts: Array<{
    creditor: string;
    amount: number;
    dueDate: Date;
    interest: number;
  }>;
}

export interface CustomerSatisfaction {
  overall: number; // 1-10
  food: number;
  drink: number;
  service: number;
  atmosphere: number;
  entertainment: number;
  cleanliness: number;
}

export interface TavernReputation {
  overall: number; // 1-100
  byRegion: Record<string, number>;
  byFaction: Record<string, number>;
  traits: string[]; // 'welcoming', 'dangerous', 'mysterious', etc.
  rumors: string[];
}

// Regional and Cultural Types
export type Region =
  | 'Empire' | 'Bretonnia' | 'Kislev' | 'Tilea' | 'Estalia'
  | 'Dwarf Holds' | 'Elf Enclaves' | 'Border Princes' | 'Norsca';

export interface RegionalStyle {
  region: Region;
  architecture: string;
  foodSpecialties: string[];
  drinkSpecialties: string[];
  decorations: string[];
  music: string[];
  customs: string[];
  festivals: Array<{
    name: string;
    date: string;
    description: string;
    effects: string[];
  }>;
}

export interface CulturalEvent {
  id: string;
  name: string;
  region: Region;
  type: 'festival' | 'ceremony' | 'celebration' | 'mourning' | 'political';
  duration: number; // days
  effects: {
    customerFlow?: number;
    priceModifier?: number;
    specialRequests?: string[];
    atmosphere?: string;
  };
  requirements?: string[];
}

// Quest and Adventure System Types
export interface QuestHook {
  id: string;
  title: string;
  description: string;
  type: 'delivery' | 'escort' | 'investigation' | 'combat' | 'diplomatic' | 'mystery';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  reward: {
    gold: number;
    items?: string[];
    reputation?: number;
    information?: string[];
  };
  requirements: {
    level?: number;
    skills?: string[];
    reputation?: number;
    faction?: string;
  };
  timeLimit?: number; // days
  consequences: {
    success: string[];
    failure: string[];
    ignored: string[];
  };
  giver: string; // character ID
  location?: string;
}

export interface AdventureChain {
  id: string;
  name: string;
  description: string;
  quests: string[]; // quest IDs in order
  overallReward: {
    gold: number;
    items: string[];
    reputation: number;
    unlocks: string[]; // new features, areas, or characters
  };
  currentStep: number;
  completed: boolean;
}

export interface FactionMission {
  id: string;
  faction: string;
  title: string;
  description: string;
  secretLevel: 'public' | 'confidential' | 'secret' | 'top_secret';
  reward: {
    gold: number;
    factionStanding: number;
    specialPrivileges?: string[];
  };
  risks: string[];
  timeLimit: number;
  requirements: {
    factionStanding: number;
    skills?: string[];
    discretion?: boolean;
  };
}

// Economic and Trading Types
export interface TradingRoute {
  id: string;
  name: string;
  origin: Region;
  destination: Region;
  goods: string[];
  profitMargin: number; // percentage
  riskLevel: number; // 1-10
  travelTime: number; // days
  requirements: {
    capital: number;
    connections?: string[];
    reputation?: number;
  };
  currentStatus: 'active' | 'disrupted' | 'closed' | 'dangerous';
}

export interface MarketFluctuation {
  itemType: string;
  region: Region;
  priceModifier: number; // multiplier
  reason: string;
  duration: number; // days remaining
  severity: 'minor' | 'moderate' | 'major' | 'extreme';
}

export interface MerchantRelationship {
  merchantId: string;
  name: string;
  region: Region;
  specialties: string[];
  trustLevel: number; // 1-10
  discountRate: number; // percentage
  exclusiveDeals: string[];
  lastTrade: Date;
  totalTradeValue: number;
}

export interface EconomicEvent {
  id: string;
  name: string;
  description: string;
  type: 'boom' | 'recession' | 'shortage' | 'surplus' | 'embargo' | 'war_economy';
  affectedRegions: Region[];
  affectedGoods: string[];
  priceModifiers: Record<string, number>;
  duration: number; // days
  probability: number; // chance of occurring
}

export interface TavernState {
  currentScene: SceneType;
  activeCharacters: Set<string>;
  availableActions: string[];
  conversationQueue: ConversationData[];
  storyThreads: Map<string, StoryThreadData>;
  gossipNetwork: Map<string, GossipData>;
  relationshipMatrix: Map<string, Map<string, number>>;
  sceneTransitionCooldown: number;

  // Enhanced Tavern Management State
  inventory: Map<string, TavernInventoryItem>;
  staff: Map<string, TavernStaff>;
  upgrades: Map<string, TavernUpgrade>;
  finances: TavernFinances;
  customerSatisfaction: CustomerSatisfaction;
  reputation: TavernReputation;

  // Regional and Cultural State
  currentRegion: Region;
  regionalStyle: RegionalStyle;
  activeEvents: Map<string, CulturalEvent>;

  // Quest and Adventure State
  availableQuests: Map<string, QuestHook>;
  activeQuests: Map<string, QuestHook>;
  completedQuests: Set<string>;
  adventureChains: Map<string, AdventureChain>;
  factionMissions: Map<string, FactionMission>;

  // Economic State
  tradingRoutes: Map<string, TradingRoute>;
  marketFluctuations: Map<string, MarketFluctuation>;
  merchantRelationships: Map<string, MerchantRelationship>;
  activeEconomicEvents: Map<string, EconomicEvent>;
}

// Default character data
export const WARHAMMER_CHARACTERS: TavernCharacterData[] = [
  {
    id: 'wilhelm-scribe',
    name: 'Wilhelm von Schreiber',
    race: 'Empire',
    characterClass: 'Scholar',
    age: 45,
    backstory: 'Starzec Wilhelm to uczony ze Starego Świata, który poświęcił życie badaniu starożytnych manuskryptów i zaginionych sekretów historii. Jego biblioteka w tawernie to skarb wiedzy o dawnych czasach.',
    personalityTraits: ['Mądry', 'Spokojny', 'Ciekawski', 'Przenikliwy'],
    conversationPreferences: {
      topics: ['Historia', 'Magia', 'Starożytne sekrety', 'Książki'],
      avoidanceTopics: ['Wojny', 'Polityka'],
      initiationLikelihood: 0.7,
      responseStyle: 'formal'
    },
    currentMood: 'Zamyślony',
    relationshipModifiers: {},
    skills: ['Czytanie', 'Pisanie', 'Znajomość historii', 'Rozszyfrowywanie'],
    equipment: ['Księga zaklęć', 'Pióro', 'Okulary'],
    secrets: ['Zna lokalizację zaginionej biblioteki', 'Ma przepowiednie o przyszłości'],
    goals: ['Znaleźć zaginioną księgę', 'Zapisać historię tawerny']
  },
  {
    id: 'greta-ironforge',
    name: 'Greta Żelazna Kuźnia',
    race: 'Dwarf',
    characterClass: 'Blacksmith',
    age: 89,
    backstory: 'Greta jest najlepszą kowalką w okolicy. Jej młot kuje nie tylko broń, ale także narzędzia i ozdoby. Potrafi rozpoznać każdy metal po zapachu.',
    personalityTraits: ['Uparta', 'Pracowita', 'Solidna', 'Bezpośrednia'],
    conversationPreferences: {
      topics: ['Kowalstwo', 'Metale', 'Rzemiosło', 'Handel'],
      avoidanceTopics: ['Elfy', 'Magiczna nonsens'],
      initiationLikelihood: 0.5,
      responseStyle: 'gruff'
    },
    currentMood: 'Skoncentrowana',
    relationshipModifiers: {},
    skills: ['Kowalstwo', 'Ocena metali', 'Naprawa', 'Targowanie'],
    equipment: ['Młot kowalski', 'Fartuch', 'Szczypce'],
    secrets: ['Ma receptę na magiczny stop', 'Ukrywa prawdziwe bogactwo'],
    goals: ['Stworzyć mistrzowską broń', 'Znaleźć rzadkie metale']
  },
  {
    id: 'aelindra-moonwhisper',
    name: 'Aelindra Szept Księżyca',
    race: 'Elf',
    characterClass: 'Mage',
    age: 156,
    backstory: 'Tajemnicza elfka, która przybyła z dalekich lasów. Włada magią natury i potrafi czytać znaki w gwiazdach. Jej obecność w tawernie to zagadka.',
    personalityTraits: ['Enigmatyczna', 'Gracją', 'Intuicyjna', 'Delikatna'],
    conversationPreferences: {
      topics: ['Magia', 'Natura', 'Gwiazdy', 'Duchowość'],
      avoidanceTopics: ['Metalurgia', 'Hałas'],
      initiationLikelihood: 0.3,
      responseStyle: 'mysterious'
    },
    currentMood: 'Medytacyjny',
    relationshipModifiers: {},
    skills: ['Magia natury', 'Leczenie', 'Przepowiadanie', 'Znajomość roślin'],
    equipment: ['Różdżka z wilgotnego dębu', 'Kryształy', 'Zioła'],
    secrets: ['Ma wizje przyszłości', 'Ukrywa swoje prawdziwe pochodzenie'],
    goals: ['Znaleźć zaginioną magiczną reliktę', 'Ochronić równowagę natury']
  },
  {
    id: 'marcus-steiner',
    name: 'Marcus Kamienisty',
    race: 'Empire',
    characterClass: 'Soldier',
    age: 32,
    backstory: 'Weteran wojny przeciwko orkom, Marcus służył w armii Imperium przez 12 lat. Teraz pracuje jako najemnik i ochroniarz, ale preferuje spokojny wieczór przy kuflu piwa.',
    personalityTraits: ['Odważny', 'Lojalny', 'Praktyczny', 'Opiekuńczy'],
    conversationPreferences: {
      topics: ['Wojna', 'Ochrona', 'Strategia', 'Opowieści bojowe'],
      avoidanceTopics: ['Magia', 'Polityka dworska'],
      initiationLikelihood: 0.6,
      responseStyle: 'casual'
    },
    currentMood: 'Czujny',
    relationshipModifiers: {},
    skills: ['Walka mieczem', 'Taktyka', 'Pierwsza pomoc', 'Dowodzenie'],
    equipment: ['Miecz', 'Tarcza', 'Zbroja skórzana'],
    secrets: ['Widział dziwne stworzenia na północy', 'Ma długi u pewnego szlachcica'],
    goals: ['Znaleźć spokojną pracę', 'Ostrzec przed zagrożeniem']
  },
  {
    id: 'rosie-greenhill',
    name: 'Rosie Zielone Wzgórze',
    race: 'Halfling',
    characterClass: 'Innkeeper',
    age: 45,
    backstory: 'Właścicielka tawerny, Rosie jest sercem tego miejsca. Zna każdego gościa z imienia i pamięta ich ulubione potrawy. Jej ciepłość sprawia, że wszyscy czują się jak w domu.',
    personalityTraits: ['Życzliwa', 'Gościnność', 'Spostrzegawcza', 'Praktyczna'],
    conversationPreferences: {
      topics: ['Jedzenie', 'Plotki', 'Goście', 'Życie codzienne'],
      avoidanceTopics: ['Polityka', 'Wojny'],
      initiationLikelihood: 0.8,
      responseStyle: 'friendly'
    },
    currentMood: 'Wesoła',
    relationshipModifiers: {},
    skills: ['Gotowanie', 'Zarządzanie', 'Plotkowanie', 'Mediacja'],
    equipment: ['Fartuch', 'Łyżka', 'Książka przepisów'],
    secrets: ['Wie o wszystkich romans w mieście', 'Ma tajny przepis na najlepsze piwo'],
    goals: ['Utrzymać harmonię w tawernie', 'Poznać historie wszystkich gości']
  },
  {
    id: 'balin-goldseeker',
    name: 'Balin Poszukiwacz Złota',
    race: 'Dwarf',
    characterClass: 'Merchant',
    age: 67,
    backstory: 'Zamożny kupiec krasnoludzki, który handluje klejnotami i metalami szlachetnymi. Jego oko do interesów jest legendarne, ale równie legendarna jest jego skąpość.',
    personalityTraits: ['Chciwy', 'Sprytny', 'Przebiegły', 'Pracowity'],
    conversationPreferences: {
      topics: ['Handel', 'Złoto', 'Klejnoty', 'Zyski'],
      avoidanceTopics: ['Magiczne rytuały', 'Bezinteresowna pomoc'],
      initiationLikelihood: 0.4,
      responseStyle: 'casual'
    },
    currentMood: 'Kalkulujący',
    relationshipModifiers: {},
    skills: ['Handel', 'Ocena wartości', 'Negocjacje', 'Matematyka'],
    equipment: ['Waga', 'Soczewka', 'Sakiewka z monetami'],
    secrets: ['Ma mapę do skarbu', 'Wie o długach innych postaci'],
    goals: ['Znaleźć najcenniejszy klejnot', 'Zyskać monopol na handel']
  }
];