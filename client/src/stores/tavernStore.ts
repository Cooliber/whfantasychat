import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  TavernCharacterData,
  ConversationData,
  StoryThreadData,
  GossipData,
  TavernSceneData,
  SceneType,
  TavernState,
  CharacterRace,
  CharacterClass
} from '../types/warhammer.types';
import { CharacterBackgroundGenerator, FactionStandingGenerator } from '../services/characterService';
import { SkillsManager } from '../services/skillsService';
import { SocialStandingManager, MotivationManager } from '../services/socialService';
import { SecretsManager } from '../services/secretsService';
import {
  InventoryManager,
  StaffManager,
  UpgradeManager,
  FinancialManager,
  SatisfactionManager,
  TavernReputationManager
} from '../services/tavernManagementService';
import { RegionalStyleManager, CulturalEventManager, RegionalNewsManager } from '../services/regionalService';
import { QuestManager, AdventureChainManager, FactionMissionManager, MysteriousStrangerManager } from '../services/questService';
import { ConversationManager, ActiveConversation } from '../services/conversationManager';
import { ConversationContext } from '../services/conversationService';

interface TavernStore extends TavernState {
  // Scene management
  setCurrentScene: (scene: SceneType) => void;
  getAllScenes: () => TavernSceneData[];
  getSceneByType: (type: SceneType) => TavernSceneData | undefined;
  
  // Character management
  characters: Map<string, TavernCharacterData>;
  addCharacter: (character: TavernCharacterData) => void;
  updateCharacter: (id: string, updates: Partial<TavernCharacterData>) => void;
  getCharacterById: (id: string) => TavernCharacterData | undefined;
  getActiveCharacters: () => TavernCharacterData[];

  // Enhanced Character Features
  generateEnhancedCharacter: (id: string, name: string, race: CharacterRace, characterClass: CharacterClass) => TavernCharacterData;
  improveCharacterSkill: (characterId: string, skillName: string, experience: number) => void;
  addCharacterExperience: (characterId: string, experience: number) => void;
  updateCharacterReputation: (characterId: string, region: string, change: number) => void;
  discoverCharacterSecret: (characterId: string, secretId: string, investigatorSkill: number) => boolean;
  addCharacterRumor: (characterId: string, rumor: string, veracity: boolean, impact: 'positive' | 'negative' | 'neutral') => void;

  // Tavern Management Features
  purchaseInventoryItem: (item: Omit<TavernInventoryItem, 'id'>) => void;
  consumeInventoryItem: (itemId: string, quantity: number) => boolean;
  hireStaff: (staff: Omit<TavernStaff, 'id'>) => void;
  fireStaff: (staffId: string) => void;
  trainStaff: (staffId: string, training: number) => void;
  installUpgrade: (upgradeId: string) => boolean;
  updateDailyFinances: () => void;
  updateCustomerSatisfaction: (factors: any) => void;
  updateTavernReputation: (change: number, region?: Region, faction?: string) => void;
  addTavernTrait: (trait: string) => void;
  addTavernRumor: (rumor: string) => void;

  // Regional and Cultural Features
  changeRegion: (region: Region) => void;
  startCulturalEvent: (eventId: string) => void;
  endCulturalEvent: (eventId: string) => void;
  generateDailyNews: () => void;
  getRegionalMenu: () => { food: any[]; drinks: any[] };
  createCulturalConflict: (region1: Region, region2: Region) => void;

  // Quest and Adventure System
  generateRandomQuest: () => void;
  acceptQuest: (questId: string) => void;
  completeQuest: (questId: string, success: boolean) => void;
  startAdventureChain: () => void;
  advanceAdventureChain: (chainId: string) => void;
  getAvailableFactionMissions: (faction: string) => FactionMission[];
  acceptFactionMission: (missionId: string) => void;
  completeFactionMission: (missionId: string, success: boolean) => void;
  triggerMysteriousStranger: () => void;

  // Enhanced Conversation System
  conversationManager: ConversationManager | null;
  initializeConversationSystem: () => void;
  startConversation: (targetCharacterId: string, additionalParticipants?: string[]) => ActiveConversation;
  getDialogueOptions: (conversationId: string, targetCharacterId: string) => any[];
  processDialogueChoice: (conversationId: string, optionId: string, targetCharacterId: string) => any;
  endConversation: (conversationId: string) => any;
  getActiveConversations: () => Map<string, ActiveConversation>;
  updateConversationContext: () => void;

  // Legacy Conversation management (for compatibility)
  activeConversation: ConversationData | null;
  setActiveConversation: (conversation: ConversationData | null) => void;
  addConversation: (conversation: ConversationData) => void;
  getConversationHistory: () => ConversationData[];
  
  // Story thread management
  addStoryThread: (thread: StoryThreadData) => void;
  updateStoryThread: (id: string, updates: Partial<StoryThreadData>) => void;
  getActiveStoryThreads: () => StoryThreadData[];
  
  // Gossip management
  addGossip: (gossip: GossipData) => void;
  getGossipByCategory: (category: string) => GossipData[];
  getRecentGossip: () => GossipData[];
  
  // Relationship management
  updateRelationship: (char1: string, char2: string, change: number) => void;
  getRelationship: (char1: string, char2: string) => number;
  
  // UI state
  isDialogueModalOpen: boolean;
  selectedCharacter: TavernCharacterData | null;
  isStoryThreadsVisible: boolean;
  isGossipPanelVisible: boolean;
  
  setDialogueModalOpen: (open: boolean) => void;
  setSelectedCharacter: (character: TavernCharacterData | null) => void;
  setStoryThreadsVisible: (visible: boolean) => void;
  setGossipPanelVisible: (visible: boolean) => void;
  
  // Actions
  initiateConversation: (characterIds: string[]) => void;
  triggerSceneTransition: (newScene: SceneType) => void;
  processPlayerChoice: (choice: { id: string; content: string; consequences: string[] }) => void;
}

// Default scenes data
const defaultScenes: TavernSceneData[] = [
  {
    id: 'quiet-evening',
    name: 'Cichy Wieczór',
    description: 'Spokojny wieczór w tawernie. Płomyki świec migocą w ciemności, a tylko nieliczni goście siedzą przy drewnianych stołach, popijając piwo i prowadząc ciche rozmowy. Atmosfera sprzyja głębokim rozmowom i dzieleniu się sekretami.',
    atmosphere: 'Spokojny, intymny, tajemniczy',
    activeCharacters: ['wilhelm-scribe', 'aelindra-moonwhisper'],
    availableActions: [
      { id: 'read-ancient-tome', label: 'Czytaj starożytne księgi', description: 'Przeglądaj tajemnicze manuskrypty przy świetle świec' },
      { id: 'meditate', label: 'Medytuj', description: 'Osiągnij wewnętrzny spokój w ciszy wieczoru' },
      { id: 'share-secret', label: 'Podziel się tajemnicą', description: 'Zaufaj komuś swoje sekrety' }
    ],
    isActive: true
  },
  {
    id: 'busy-market',
    name: 'Dzień Targowy',
    description: 'Tawerna tętni życiem w dzień targowy. Kupcy, rzemieślnicy i podróżnicy wypełniają każdy kąt, głośno dyskutując o handlu, polityce i wydarzeniach z dalekich krain. Powietrze wypełnione jest dźwiękiem monet i zapachem świeżego piwa.',
    atmosphere: 'Energiczny, hałaśliwy, handlowy',
    activeCharacters: ['marcus-steiner', 'greta-ironforge', 'balin-goldseeker'],
    availableActions: [
      { id: 'negotiate-trade', label: 'Negocjuj handel', description: 'Wynegocjuj lepsze ceny za towary' },
      { id: 'gather-market-news', label: 'Zbieraj wieści targowe', description: 'Dowiedz się o najnowszych wydarzeniach handlowych' },
      { id: 'display-wares', label: 'Wystawiaj towary', description: 'Pokaż swoje rzemiosło innym' }
    ],
    isActive: false
  },
  {
    id: 'storm-night',
    name: 'Noc Burzy',
    description: 'Dzika burza szaleje na zewnątrz, a błyskawice oświetlają okna tawerny. Goście schronili się przed żywiołem, tworząc ciepłą, solidarną atmosferę. To idealny czas na opowieści o przygodach i legendarne toasty.',
    atmosphere: 'Dramatyczny, solidarny, przygodowy',
    activeCharacters: ['erik-bloodaxe', 'silvyr-swiftarrow', 'sir-gaston'],
    availableActions: [
      { id: 'tell-heroic-tale', label: 'Opowiadaj heroiczne historie', description: 'Dziel się opowieściami o wielkich czynach' },
      { id: 'weather-storm', label: 'Przeczekaj burzę', description: 'Znajdź schronienie i pocieszenie w towarzystwie' },
      { id: 'challenge-duel', label: 'Wyzwij na pojedynek', description: 'Sprawdź swoje umiejętności przeciwko innemu wojownikowi' }
    ],
    isActive: false
  },
  {
    id: 'festival-celebration',
    name: 'Świętowanie Festiwalu',
    description: 'Tawerna jest ozdobiona kolorowymi wstążkami i świeczkami z okazji lokalnego festiwalu. Muzyka, śmiech i śpiew wypełniają powietrze, a wszyscy świętują w radosnej atmosferze. To czas na zabawę, taniec i nowe znajomości.',
    atmosphere: 'Radosny, świąteczny, towarzyski',
    activeCharacters: ['rosie-greenhill', 'merry-goodbarrel', 'pip-lightfingers'],
    availableActions: [
      { id: 'join-festivities', label: 'Dołącz do zabawy', description: 'Uczestniczaj w świętowaniu z innymi gośćmi' },
      { id: 'share-feast', label: 'Dziel się ucztą', description: 'Delektuj się świątecznymi potrawami' },
      { id: 'perform-entertainment', label: 'Daj występ', description: 'Zabawiaj innych swoimi talentami' }
    ],
    isActive: false
  },
  {
    id: 'mysterious-gathering',
    name: 'Tajemnicze Zgromadzenie',
    description: 'W tawernie panuje napięta atmosfera. Enigmatyczne postacie siedzą w ciemnych kątach, szepczą o tajemniczych sprawach. Powietrze jest gęste od niedopowiedzeń i ukrytych intencji. Niektórzy goście wyglądają, jakby ukrywali mroczne sekrety.',
    atmosphere: 'Tajemniczy, napięty, intryga',
    activeCharacters: ['malekith-exile', 'victor-saltzpyre', 'sienna-fuegonasus'],
    availableActions: [
      { id: 'investigate-mystery', label: 'Bada tajemnicę', description: 'Próbuj rozwikłać ukryte intrygi' },
      { id: 'eavesdrop', label: 'Podsłuchuj', description: 'Ostrożnie przysłuchuj się prywatnym rozmowom' },
      { id: 'reveal-secret', label: 'Ujawnij sekret', description: 'Podziel się ważną informacją' }
    ],
    isActive: false
  }
];

// Initialize enhanced characters
const initializeEnhancedCharacters = (): Map<string, TavernCharacterData> => {
  const characters = new Map<string, TavernCharacterData>();

  // Create enhanced versions of default characters
  const characterData = [
    { id: 'wilhelm-scribe', name: 'Wilhelm von Schreiber', race: 'Empire' as CharacterRace, class: 'Scholar' as CharacterClass },
    { id: 'aelindra-moonwhisper', name: 'Aelindra Moonwhisper', race: 'Elf' as CharacterRace, class: 'Mage' as CharacterClass },
    { id: 'thorek-ironbeard', name: 'Thorek Ironbeard', race: 'Dwarf' as CharacterRace, class: 'Blacksmith' as CharacterClass },
    { id: 'marcus-steelheart', name: 'Marcus Steelheart', race: 'Empire' as CharacterRace, class: 'Soldier' as CharacterClass },
    { id: 'elena-brightblade', name: 'Elena Brightblade', race: 'Bretonnian' as CharacterRace, class: 'Knight' as CharacterClass }
  ];

  characterData.forEach(({ id, name, race, class: characterClass }) => {
    const background = CharacterBackgroundGenerator.generateBackground(race, characterClass);
    const factionStandings = FactionStandingGenerator.generateFactionStandings(race, background);
    const enhancedSkills = SkillsManager.generateStartingSkills(race, characterClass);
    const socialStanding = SocialStandingManager.generateSocialStanding(background, race);
    const motivations = MotivationManager.generateMotivations(background, characterClass);
    const characterSecrets = SecretsManager.generateSecrets(background, race, characterClass);

    const character: TavernCharacterData = {
      id,
      name,
      race,
      characterClass,
      age: Math.floor(Math.random() * 50) + 18,
      backstory: `${name} hails from ${background.birthplace} and has lived a life shaped by ${background.socialClass} origins.`,
      personalityTraits: ['Determined', 'Observant', 'Cautious', 'Ambitious'],
      conversationPreferences: {
        topics: ['Local News', 'Trade', 'Politics'],
        avoidanceTopics: ['Personal History'],
        initiationLikelihood: 0.6,
        responseStyle: 'friendly'
      },
      currentMood: 'Neutral',
      relationshipModifiers: {},
      skills: Array.from(enhancedSkills.keys()),
      equipment: ['Basic Clothing', 'Belt Pouch', 'Personal Effects'],
      secrets: Array.from(characterSecrets.keys()),
      goals: motivations.shortTermGoals.map(g => g.goal),

      // Enhanced features
      background,
      factionStandings,
      progression: {
        level: 1,
        experience: 0,
        skillPoints: 0,
        availableAdvances: [],
        completedAdvances: [],
        careerProgress: {
          currentCareer: characterClass,
          advancesInCareer: 0,
          canAdvanceCareer: false,
          availableCareerExits: []
        }
      },
      reputation: {
        overall: 50,
        byRegion: {} as any,
        byFaction: {},
        bySocialClass: {},
        traits: [],
        rumors: []
      },
      enhancedSkills,
      socialStanding,
      motivations,
      characterSecrets,

      // Legacy fields for compatibility
      appearance: {
        height: 'Average',
        build: 'Average',
        eyeColor: 'Brown',
        hairColor: 'Brown',
        distinguishingMarks: [],
        cyberneticVisibility: 'Hidden'
      },
      weapons: [],
      armor: [],
      cybernetics: [],
      technology: [],
      attributes: {
        strength: 30,
        dexterity: 30,
        intelligence: 30,
        charisma: 30,
        techAffinity: 10,
        magicResistance: 10
      }
    };

    characters.set(id, character);
  });

  return characters;
};

export const useTavernStore = create<TavernStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentScene: 'Quiet Evening',
    activeCharacters: new Set(['wilhelm-scribe', 'aelindra-moonwhisper']),
    availableActions: ['read-ancient-tome', 'meditate', 'share-secret'],
    conversationQueue: [],
    storyThreads: new Map(),
    gossipNetwork: new Map(),
    relationshipMatrix: new Map(),
    sceneTransitionCooldown: 0,

    characters: initializeEnhancedCharacters(),
    activeConversation: null,

    // Enhanced Tavern Management State
    inventory: InventoryManager.generateRandomInventory(),
    staff: StaffManager.generateRandomStaff(),
    upgrades: new Map(UpgradeManager.getAvailableUpgrades().map(u => [u.id, u])),
    finances: FinancialManager.initializeFinances(),
    customerSatisfaction: SatisfactionManager.initializeSatisfaction(),
    reputation: TavernReputationManager.initializeReputation(),

    // Regional and Cultural State
    currentRegion: 'Empire' as Region,
    regionalStyle: {
      region: 'Empire' as Region,
      architecture: 'Imperial Gothic',
      foodSpecialties: ['Sausages', 'Sauerkraut', 'Rye Bread'],
      drinkSpecialties: ['Empire Ale', 'Reikland Wine'],
      decorations: ['Imperial Eagles', 'Heraldic Banners'],
      music: ['Folk Songs', 'Military Marches'],
      customs: ['Toasting the Emperor', 'Evening Prayers'],
      festivals: [
        { name: 'Sigmartag', date: 'Spring', description: 'Celebration of Sigmar', effects: ['Increased Pilgrims'] }
      ]
    },
    activeEvents: new Map(),

    // Quest and Adventure State
    availableQuests: new Map(),
    activeQuests: new Map(),
    completedQuests: new Set(),
    adventureChains: new Map(),
    factionMissions: new Map(),

    // Economic State
    tradingRoutes: new Map(),
    marketFluctuations: new Map(),
    merchantRelationships: new Map(),
    activeEconomicEvents: new Map(),

    // Enhanced Conversation System
    conversationManager: null,

    // UI state
    isDialogueModalOpen: false,
    selectedCharacter: null,
    isStoryThreadsVisible: true,
    isGossipPanelVisible: true,
    
    // Scene management
    setCurrentScene: (scene: SceneType) => {
      set((state) => {
        const sceneData = defaultScenes.find(s => s.name === scene);
        if (sceneData) {
          return {
            ...state,
            currentScene: scene,
            activeCharacters: new Set(sceneData.activeCharacters),
            availableActions: sceneData.availableActions.map(a => a.id)
          };
        }
        return state;
      });
    },
    
    getAllScenes: () => defaultScenes,
    
    getSceneByType: (type: SceneType) => {
      return defaultScenes.find(scene => scene.name === type);
    },
    
    // Character management
    addCharacter: (character: TavernCharacterData) => {
      set((state) => {
        const newCharacters = new Map(state.characters);
        newCharacters.set(character.id, character);
        return { ...state, characters: newCharacters };
      });
    },
    
    updateCharacter: (id: string, updates: Partial<TavernCharacterData>) => {
      set((state) => {
        const newCharacters = new Map(state.characters);
        const existing = newCharacters.get(id);
        if (existing) {
          newCharacters.set(id, { ...existing, ...updates });
        }
        return { ...state, characters: newCharacters };
      });
    },
    
    getCharacterById: (id: string) => {
      return get().characters.get(id);
    },
    
    getActiveCharacters: () => {
      const state = get();
      return Array.from(state.activeCharacters)
        .map(id => state.characters.get(id))
        .filter(Boolean) as TavernCharacterData[];
    },

    // Enhanced Character Features Implementation
    generateEnhancedCharacter: (id: string, name: string, race: CharacterRace, characterClass: CharacterClass) => {
      // Generate comprehensive character background
      const background = CharacterBackgroundGenerator.generateBackground(race, characterClass);
      const factionStandings = FactionStandingGenerator.generateFactionStandings(race, background);
      const enhancedSkills = SkillsManager.generateStartingSkills(race, characterClass);
      const socialStanding = SocialStandingManager.generateSocialStanding(background, race);
      const motivations = MotivationManager.generateMotivations(background, characterClass);
      const characterSecrets = SecretsManager.generateSecrets(background, race, characterClass);

      const enhancedCharacter: TavernCharacterData = {
        id,
        name,
        race,
        characterClass,
        age: Math.floor(Math.random() * 50) + 18, // 18-67 years old
        backstory: `${name} hails from ${background.birthplace} and has lived a life shaped by ${background.socialClass} origins.`,
        personalityTraits: ['Determined', 'Observant', 'Cautious', 'Ambitious'],
        conversationPreferences: {
          topics: ['Local News', 'Trade', 'Politics'],
          avoidanceTopics: ['Personal History'],
          initiationLikelihood: 0.6,
          responseStyle: 'friendly'
        },
        currentMood: 'Neutral',
        relationshipModifiers: {},
        skills: Array.from(enhancedSkills.keys()),
        equipment: ['Basic Clothing', 'Belt Pouch', 'Personal Effects'],
        secrets: Array.from(characterSecrets.keys()),
        goals: motivations.shortTermGoals.map(g => g.goal),

        // Enhanced features
        background,
        factionStandings,
        progression: {
          level: 1,
          experience: 0,
          skillPoints: 0,
          availableAdvances: [],
          completedAdvances: [],
          careerProgress: {
            currentCareer: characterClass,
            advancesInCareer: 0,
            canAdvanceCareer: false,
            availableCareerExits: []
          }
        },
        reputation: {
          overall: 50,
          byRegion: {} as any,
          byFaction: {},
          bySocialClass: {},
          traits: [],
          rumors: []
        },
        enhancedSkills,
        socialStanding,
        motivations,
        characterSecrets,

        // Legacy fields for compatibility
        appearance: {
          height: 'Average',
          build: 'Average',
          eyeColor: 'Brown',
          hairColor: 'Brown',
          distinguishingMarks: [],
          cyberneticVisibility: 'Hidden'
        },
        weapons: [],
        armor: [],
        cybernetics: [],
        technology: [],
        attributes: {
          strength: 30,
          dexterity: 30,
          intelligence: 30,
          charisma: 30,
          techAffinity: 10,
          magicResistance: 10
        }
      };

      return enhancedCharacter;
    },

    improveCharacterSkill: (characterId: string, skillName: string, experience: number) => {
      set((state) => {
        const character = state.characters.get(characterId);
        if (!character) return state;

        const skill = character.enhancedSkills.get(skillName);
        if (!skill) return state;

        const improvedSkill = SkillsManager.improveSkill(skill, experience);
        character.enhancedSkills.set(skillName, improvedSkill);

        const newCharacters = new Map(state.characters);
        newCharacters.set(characterId, { ...character });

        return { ...state, characters: newCharacters };
      });
    },

    addCharacterExperience: (characterId: string, experience: number) => {
      set((state) => {
        const character = state.characters.get(characterId);
        if (!character) return state;

        const newProgression = {
          ...character.progression,
          experience: character.progression.experience + experience,
          level: Math.floor((character.progression.experience + experience) / 100) + 1
        };

        const newCharacters = new Map(state.characters);
        newCharacters.set(characterId, {
          ...character,
          progression: newProgression
        });

        return { ...state, characters: newCharacters };
      });
    },

    updateCharacterReputation: (characterId: string, region: string, change: number) => {
      set((state) => {
        const character = state.characters.get(characterId);
        if (!character) return state;

        const newReputation = {
          ...character.reputation,
          overall: Math.max(1, Math.min(100, character.reputation.overall + change)),
          byRegion: {
            ...character.reputation.byRegion,
            [region]: Math.max(1, Math.min(100, (character.reputation.byRegion[region as any] || 50) + change))
          }
        };

        const newCharacters = new Map(state.characters);
        newCharacters.set(characterId, {
          ...character,
          reputation: newReputation
        });

        return { ...state, characters: newCharacters };
      });
    },

    discoverCharacterSecret: (characterId: string, secretId: string, investigatorSkill: number) => {
      const character = get().characters.get(characterId);
      if (!character) return false;

      const secret = character.characterSecrets.get(secretId);
      if (!secret) return false;

      return SecretsManager.discoverSecret(secret, investigatorSkill);
    },

    addCharacterRumor: (characterId: string, rumor: string, veracity: boolean, impact: 'positive' | 'negative' | 'neutral') => {
      set((state) => {
        const character = state.characters.get(characterId);
        if (!character) return state;

        const newRumor = {
          content: rumor,
          veracity,
          spread: 1,
          impact
        };

        const newReputation = {
          ...character.reputation,
          rumors: [...character.reputation.rumors, newRumor]
        };

        const newCharacters = new Map(state.characters);
        newCharacters.set(characterId, {
          ...character,
          reputation: newReputation
        });

        return { ...state, characters: newCharacters };
      });
    },

    // Tavern Management Features Implementation
    purchaseInventoryItem: (item: Omit<TavernInventoryItem, 'id'>) => {
      set((state) => {
        const newItem: TavernInventoryItem = {
          ...item,
          id: `item-${Date.now()}`
        };

        const newInventory = new Map(state.inventory);
        InventoryManager.addItem(newInventory, newItem);

        const newFinances = {
          ...state.finances,
          gold: state.finances.gold - (item.cost * item.quantity)
        };

        return {
          ...state,
          inventory: newInventory,
          finances: newFinances
        };
      });
    },

    consumeInventoryItem: (itemId: string, quantity: number) => {
      const state = get();
      const success = InventoryManager.consumeItem(state.inventory, itemId, quantity);

      if (success) {
        set((state) => ({
          ...state,
          inventory: new Map(state.inventory)
        }));
      }

      return success;
    },

    hireStaff: (staff: Omit<TavernStaff, 'id'>) => {
      set((state) => {
        const newStaff: TavernStaff = {
          ...staff,
          id: `staff-${Date.now()}`
        };

        const newStaffMap = new Map(state.staff);
        newStaffMap.set(newStaff.id, newStaff);

        return { ...state, staff: newStaffMap };
      });
    },

    fireStaff: (staffId: string) => {
      set((state) => {
        const newStaffMap = new Map(state.staff);
        newStaffMap.delete(staffId);

        return { ...state, staff: newStaffMap };
      });
    },

    trainStaff: (staffId: string, training: number) => {
      set((state) => {
        const staffMember = state.staff.get(staffId);
        if (!staffMember) return state;

        const improvedStaff = StaffManager.improveStaffSkill(staffMember, training);
        const newStaffMap = new Map(state.staff);
        newStaffMap.set(staffId, improvedStaff);

        return { ...state, staff: newStaffMap };
      });
    },

    installUpgrade: (upgradeId: string) => {
      const state = get();
      const upgrade = state.upgrades.get(upgradeId);

      if (!upgrade || upgrade.installed) return false;
      if (state.finances.gold < upgrade.cost) return false;
      if (!UpgradeManager.canInstallUpgrade(upgrade, state.upgrades, state.staff)) return false;

      set((state) => {
        const newUpgrades = new Map(state.upgrades);
        newUpgrades.set(upgradeId, { ...upgrade, installed: true });

        const newFinances = {
          ...state.finances,
          gold: state.finances.gold - upgrade.cost
        };

        return {
          ...state,
          upgrades: newUpgrades,
          finances: newFinances
        };
      });

      return true;
    },

    updateDailyFinances: () => {
      set((state) => {
        const customerCount = Math.floor(Math.random() * 50) + 20; // 20-70 customers
        const averageSpending = 15; // Average spending per customer
        const upgradeEffects = UpgradeManager.calculateUpgradeEffects(state.upgrades);
        const staffEfficiency = StaffManager.calculateStaffEfficiency(state.staff);

        const dailyIncome = FinancialManager.calculateDailyIncome(
          customerCount,
          averageSpending,
          upgradeEffects.income,
          staffEfficiency
        );

        const dailyExpenses = FinancialManager.calculateDailyExpenses(
          state.staff,
          state.inventory,
          state.upgrades
        );

        const newFinances = FinancialManager.updateFinances(
          state.finances,
          dailyIncome,
          dailyExpenses
        );

        return { ...state, finances: newFinances };
      });
    },

    updateCustomerSatisfaction: (factors: any) => {
      set((state) => {
        const newSatisfaction = SatisfactionManager.updateSatisfaction(
          state.customerSatisfaction,
          factors
        );

        return { ...state, customerSatisfaction: newSatisfaction };
      });
    },

    updateTavernReputation: (change: number, region?: Region, faction?: string) => {
      set((state) => {
        const newReputation = TavernReputationManager.updateReputation(
          state.reputation,
          change,
          region,
          faction
        );

        return { ...state, reputation: newReputation };
      });
    },

    addTavernTrait: (trait: string) => {
      set((state) => {
        const newReputation = TavernReputationManager.addTrait(state.reputation, trait);
        return { ...state, reputation: newReputation };
      });
    },

    addTavernRumor: (rumor: string) => {
      set((state) => {
        const newReputation = TavernReputationManager.addRumor(state.reputation, rumor);
        return { ...state, reputation: newReputation };
      });
    },

    // Regional and Cultural Features Implementation
    changeRegion: (region: Region) => {
      set((state) => {
        const newRegionalStyle = RegionalStyleManager.getRegionalStyle(region);

        return {
          ...state,
          currentRegion: region,
          regionalStyle: newRegionalStyle,
          // Clear active events when changing regions
          activeEvents: new Map()
        };
      });
    },

    startCulturalEvent: (eventId: string) => {
      set((state) => {
        const availableEvents = CulturalEventManager.getAvailableEvents(
          state.currentRegion,
          'Spring', // TODO: Add season tracking
          state.reputation.overall
        );

        const event = availableEvents.find(e => e.id === eventId);
        if (!event) return state;

        const newActiveEvents = new Map(state.activeEvents);
        newActiveEvents.set(eventId, event);

        // Apply event effects to customer satisfaction
        const eventImpact = CulturalEventManager.calculateEventImpact(event, state.customerSatisfaction.overall);
        const newSatisfaction = SatisfactionManager.updateSatisfaction(
          state.customerSatisfaction,
          { atmosphereRating: eventImpact.satisfactionBonus }
        );

        return {
          ...state,
          activeEvents: newActiveEvents,
          customerSatisfaction: newSatisfaction
        };
      });
    },

    endCulturalEvent: (eventId: string) => {
      set((state) => {
        const newActiveEvents = new Map(state.activeEvents);
        newActiveEvents.delete(eventId);

        return {
          ...state,
          activeEvents: newActiveEvents
        };
      });
    },

    generateDailyNews: () => {
      set((state) => {
        const regionalNews = RegionalNewsManager.generateDailyNews(state.currentRegion, 3);
        const crossRegionalNews = RegionalNewsManager.generateCrossRegionalNews();
        const allNews = [...regionalNews, ...crossRegionalNews];

        // Apply news impacts
        let economicImpact = 0;
        let socialImpact = 0;
        let securityImpact = 0;

        allNews.forEach(news => {
          const impact = RegionalNewsManager.getNewsImpact(news);
          economicImpact += impact.economicImpact;
          socialImpact += impact.socialImpact;
          securityImpact += impact.securityImpact;
        });

        // Update tavern based on news impacts
        const newSatisfaction = SatisfactionManager.updateSatisfaction(
          state.customerSatisfaction,
          {
            atmosphereRating: socialImpact,
            serviceSpeed: securityImpact > -10 ? 0 : -5 // Security issues affect service
          }
        );

        const newReputation = TavernReputationManager.updateReputation(
          state.reputation,
          Math.floor(socialImpact / 2), // Social impact affects reputation
          state.currentRegion
        );

        // Add news as rumors
        const newsRumors = allNews.slice(0, 2); // Add first 2 news items as rumors
        const updatedReputation = newsRumors.reduce((rep, news) =>
          TavernReputationManager.addRumor(rep, news), newReputation
        );

        return {
          ...state,
          customerSatisfaction: newSatisfaction,
          reputation: updatedReputation
        };
      });
    },

    getRegionalMenu: () => {
      const state = get();
      const food = RegionalStyleManager.getRegionalFoodMenu(state.currentRegion);
      const drinks = RegionalStyleManager.getRegionalDrinkMenu(state.currentRegion);

      return { food, drinks };
    },

    createCulturalConflict: (region1: Region, region2: Region) => {
      set((state) => {
        const conflict = RegionalStyleManager.generateCulturalConflict(region1, region2);

        // Add conflict as a rumor and reduce satisfaction
        const newReputation = TavernReputationManager.addRumor(state.reputation, conflict);
        const newSatisfaction = SatisfactionManager.updateSatisfaction(
          state.customerSatisfaction,
          { atmosphereRating: -10 } // Conflicts reduce atmosphere
        );

        return {
          ...state,
          reputation: newReputation,
          customerSatisfaction: newSatisfaction
        };
      });
    },

    // Enhanced Conversation System Implementation
    initializeConversationSystem: () => {
      const state = get();

      const conversationContext: ConversationContext = {
        currentScene: state.currentScene,
        activeEvents: state.activeEvents,
        tavernReputation: state.reputation,
        customerSatisfaction: state.customerSatisfaction,
        currentRegion: state.currentRegion,
        recentNews: Array.from(state.gossipNetwork.values()).map(g => g.content).slice(0, 5),
        activeRumors: state.reputation.rumors,
        playerReputation: 50 // TODO: Get actual player reputation
      };

      const conversationManager = new ConversationManager(conversationContext);

      set((state) => ({
        ...state,
        conversationManager
      }));
    },

    startConversation: (targetCharacterId: string, additionalParticipants: string[] = []) => {
      const state = get();

      if (!state.conversationManager) {
        get().initializeConversationSystem();
      }

      const targetCharacter = state.characters.get(targetCharacterId);
      if (!targetCharacter) {
        throw new Error('Target character not found');
      }

      const additionalCharacters = additionalParticipants
        .map(id => state.characters.get(id))
        .filter(Boolean) as TavernCharacterData[];

      const playerCharacter = {
        id: 'player',
        name: 'Player', // TODO: Get actual player name
        reputation: 50 // TODO: Get actual player reputation
      };

      const conversation = state.conversationManager!.startConversation(
        playerCharacter,
        targetCharacter,
        additionalCharacters
      );

      // Update UI state
      set((state) => ({
        ...state,
        activeConversation: {
          id: conversation.id,
          characterId: targetCharacterId,
          messages: conversation.conversationHistory.map(h => ({
            id: `msg-${h.timestamp.getTime()}`,
            characterId: h.speakerId,
            content: h.text,
            timestamp: h.timestamp,
            type: h.type as any
          })),
          availableResponses: []
        },
        isDialogueModalOpen: true,
        selectedCharacter: targetCharacterId
      }));

      return conversation;
    },

    getDialogueOptions: (conversationId: string, targetCharacterId: string) => {
      const state = get();

      if (!state.conversationManager) return [];

      const targetCharacter = state.characters.get(targetCharacterId);
      if (!targetCharacter) return [];

      const playerCharacter = {
        reputation: 50, // TODO: Get actual player reputation
        skills: ['Investigation', 'Social'] // TODO: Get actual player skills
      };

      return state.conversationManager.getDialogueOptions(
        conversationId,
        playerCharacter,
        targetCharacter
      );
    },

    processDialogueChoice: (conversationId: string, optionId: string, targetCharacterId: string) => {
      const state = get();

      if (!state.conversationManager) return null;

      const targetCharacter = state.characters.get(targetCharacterId);
      if (!targetCharacter) return null;

      // Get the selected option (this would need to be stored or passed differently in a real implementation)
      const dialogueOptions = get().getDialogueOptions(conversationId, targetCharacterId);
      const selectedOption = dialogueOptions.find(opt => opt.id === optionId);

      if (!selectedOption) return null;

      const playerCharacter = {
        id: 'player',
        name: 'Player',
        reputation: 50
      };

      const response = state.conversationManager.processDialogueChoice(
        conversationId,
        selectedOption,
        playerCharacter,
        targetCharacter
      );

      // Update conversation state in the store
      const activeConversations = state.conversationManager.getActiveConversations();
      const updatedConversation = activeConversations.get(conversationId);

      if (updatedConversation && state.activeConversation) {
        set((state) => ({
          ...state,
          activeConversation: {
            ...state.activeConversation!,
            messages: updatedConversation.conversationHistory.map(h => ({
              id: `msg-${h.timestamp.getTime()}`,
              characterId: h.speakerId,
              content: h.text,
              timestamp: h.timestamp,
              type: h.type as any
            }))
          }
        }));
      }

      // Apply consequences to character relationships and tavern state
      if (response.relationshipImpact !== 0) {
        get().updateCharacterReputation(targetCharacterId, 'local', response.relationshipImpact);
      }

      // Update tavern atmosphere based on conversation
      if (response.emotion === 'happy' || response.emotion === 'excited') {
        get().updateCustomerSatisfaction({ atmosphereRating: 2 });
      } else if (response.emotion === 'angry' || response.emotion === 'suspicious') {
        get().updateCustomerSatisfaction({ atmosphereRating: -3 });
      }

      return response;
    },

    endConversation: (conversationId: string) => {
      const state = get();

      if (!state.conversationManager) return null;

      const summary = state.conversationManager.endConversation(conversationId);

      // Update UI state
      set((state) => ({
        ...state,
        activeConversation: null,
        isDialogueModalOpen: false,
        selectedCharacter: null
      }));

      // Apply final relationship changes
      Object.entries(summary.relationshipChanges).forEach(([characterId, change]) => {
        get().updateCharacterReputation(characterId, 'local', change);
      });

      // Add discovered information to gossip network
      summary.informationGathered.forEach(info => {
        const gossipId = `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        get().addGossip(gossipId, {
          id: gossipId,
          content: info,
          source: 'conversation',
          reliability: 0.8,
          spreadRadius: 2,
          timestamp: new Date(),
          relatedCharacters: [],
          tags: ['information']
        });
      });

      return summary;
    },

    getActiveConversations: () => {
      const state = get();
      return state.conversationManager?.getActiveConversations() || new Map();
    },

    updateConversationContext: () => {
      const state = get();

      if (!state.conversationManager) return;

      const updatedContext: Partial<ConversationContext> = {
        currentScene: state.currentScene,
        activeEvents: state.activeEvents,
        tavernReputation: state.reputation,
        customerSatisfaction: state.customerSatisfaction,
        currentRegion: state.currentRegion,
        recentNews: Array.from(state.gossipNetwork.values()).map(g => g.content).slice(0, 5),
        activeRumors: state.reputation.rumors
      };

      state.conversationManager.updateGlobalContext(updatedContext);
    },

    // Legacy Conversation management (for compatibility)
    setActiveConversation: (conversation: ConversationData | null) => {
      set({ activeConversation: conversation });
    },
    
    addConversation: (conversation: ConversationData) => {
      set((state) => ({
        conversationQueue: [...state.conversationQueue, conversation]
      }));
    },
    
    getConversationHistory: () => {
      return get().conversationQueue;
    },
    
    // Story thread management
    addStoryThread: (thread: StoryThreadData) => {
      set((state) => {
        const newThreads = new Map(state.storyThreads);
        newThreads.set(thread.id, thread);
        return { ...state, storyThreads: newThreads };
      });
    },
    
    updateStoryThread: (id: string, updates: Partial<StoryThreadData>) => {
      set((state) => {
        const newThreads = new Map(state.storyThreads);
        const existing = newThreads.get(id);
        if (existing) {
          newThreads.set(id, { ...existing, ...updates });
        }
        return { ...state, storyThreads: newThreads };
      });
    },
    
    getActiveStoryThreads: () => {
      return Array.from(get().storyThreads.values())
        .filter(thread => thread.status === 'active');
    },
    
    // Gossip management
    addGossip: (gossip: GossipData) => {
      set((state) => {
        const newGossip = new Map(state.gossipNetwork);
        newGossip.set(gossip.id, gossip);
        return { ...state, gossipNetwork: newGossip };
      });
    },
    
    getGossipByCategory: (category: string) => {
      return Array.from(get().gossipNetwork.values())
        .filter(gossip => gossip.category === category);
    },
    
    getRecentGossip: () => {
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      return Array.from(get().gossipNetwork.values())
        .filter(gossip => gossip.createdAt > hourAgo)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    
    // Relationship management
    updateRelationship: (char1: string, char2: string, change: number) => {
      set((state) => {
        const newMatrix = new Map(state.relationshipMatrix);
        if (!newMatrix.has(char1)) {
          newMatrix.set(char1, new Map());
        }
        const char1Relations = newMatrix.get(char1)!;
        const currentValue = char1Relations.get(char2) || 0;
        char1Relations.set(char2, Math.max(-100, Math.min(100, currentValue + change)));
        return { ...state, relationshipMatrix: newMatrix };
      });
    },
    
    getRelationship: (char1: string, char2: string) => {
      const matrix = get().relationshipMatrix;
      return matrix.get(char1)?.get(char2) || 0;
    },
    
    // UI actions
    setDialogueModalOpen: (open: boolean) => set({ isDialogueModalOpen: open }),
    setSelectedCharacter: (character: TavernCharacterData | null) => set({ selectedCharacter: character }),
    setStoryThreadsVisible: (visible: boolean) => set({ isStoryThreadsVisible: visible }),
    setGossipPanelVisible: (visible: boolean) => set({ isGossipPanelVisible: visible }),
    
    // Complex actions
    initiateConversation: (characterIds: string[]) => {
      const { characters } = get();
      const participants = characterIds
        .map(id => characters.get(id))
        .filter(Boolean) as TavernCharacterData[];
      
      if (participants.length > 0) {
        const conversation: ConversationData = {
          id: `conv-${Date.now()}`,
          timestamp: new Date(),
          sceneContext: get().currentScene,
          participants: characterIds,
          messages: [],
          topicTags: [],
          emotionalTone: 'neutral',
          plotRelevanceScore: 0,
          storyThreadIds: [],
          gossipGenerated: [],
          playerChoices: []
        };
        
        set((state) => ({
          activeConversation: conversation,
          conversationQueue: [...state.conversationQueue, conversation],
          isDialogueModalOpen: true
        }));
      }
    },
    
    triggerSceneTransition: (newScene: SceneType) => {
      const { sceneTransitionCooldown } = get();
      if (sceneTransitionCooldown <= 0) {
        get().setCurrentScene(newScene);
        set({ sceneTransitionCooldown: 5 }); // 5 minute cooldown
        
        // Start cooldown timer
        setTimeout(() => {
          set((state) => ({
            sceneTransitionCooldown: Math.max(0, state.sceneTransitionCooldown - 1)
          }));
        }, 60000);
      }
    },
    
    processPlayerChoice: (choice: { id: string; content: string; consequences: string[] }) => {
      // Process relationship effects and story consequences
      choice.consequences.forEach(consequence => {
        // Parse and apply consequences
        console.log('Processing consequence:', consequence);
      });
    }
  }))
);

// Selector hooks for performance optimization  
export const useCurrentScene = () => useTavernStore(state => state.currentScene);
export const useActiveCharacters = () => useTavernStore(state => {
  return Array.from(state.activeCharacters)
    .map(id => state.characters.get(id))
    .filter(Boolean) as TavernCharacterData[];
});
export const useActiveConversation = () => useTavernStore(state => state.activeConversation);
export const useStoryThreads = () => useTavernStore(state => 
  Array.from(state.storyThreads.values()).filter(thread => thread.status === 'active')
);
export const useRecentGossip = () => useTavernStore(state => {
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  return Array.from(state.gossipNetwork.values())
    .filter(gossip => gossip.createdAt > hourAgo)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});