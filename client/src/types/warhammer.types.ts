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
  | 'Witch Hunter' | 'Wizard';

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

export interface TavernState {
  currentScene: SceneType;
  activeCharacters: Set<string>;
  availableActions: string[];
  conversationQueue: ConversationData[];
  storyThreads: Map<string, StoryThreadData>;
  gossipNetwork: Map<string, GossipData>;
  relationshipMatrix: Map<string, Map<string, number>>;
  sceneTransitionCooldown: number;
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