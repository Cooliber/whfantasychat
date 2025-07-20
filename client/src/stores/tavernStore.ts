import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  TavernCharacterData, 
  ConversationData, 
  StoryThreadData, 
  GossipData, 
  TavernSceneData,
  SceneType,
  TavernState
} from '../types/warhammer.types';

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
  
  // Conversation management
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
    
    characters: new Map(),
    activeConversation: null,
    
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
    
    // Conversation management
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