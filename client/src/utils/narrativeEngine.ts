import type { StoryThreadData, GossipData, SceneType } from '../types/warhammer.types';

// Enhanced Lore and History System
export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'Ancient' | 'Recent' | 'Legendary' | 'Technological' | 'Mystical';
  impact: 'Local' | 'Regional' | 'Global' | 'Dimensional';
  relatedCharacters: string[];
  consequences: string[];
  artifacts?: string[];
  locations?: string[];
}

export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  category: 'History' | 'Magic' | 'Technology' | 'Culture' | 'Prophecy' | 'Legend';
  reliability: 'Confirmed' | 'Likely' | 'Disputed' | 'Mythical';
  sources: string[];
  relatedEntries: string[];
  keywords: string[];
}

export interface PlotHook {
  id: string;
  title: string;
  description: string;
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Epic';
  themes: string[];
  requiredCharacters: string[];
  optionalCharacters: string[];
  prerequisites: string[];
  rewards: string[];
  consequences: string[];
  timeframe: 'Immediate' | 'Short-term' | 'Long-term' | 'Ongoing';
}

export interface RumorNetwork {
  id: string;
  content: string;
  category: 'Political' | 'Economic' | 'Mystical' | 'Technological' | 'Personal' | 'Dangerous';
  source: string;
  reliability: number; // 0-1
  spreadRate: number; // How quickly it spreads
  impact: number; // How much it affects gameplay
  expirationDate?: Date;
  connectedRumors: string[];
  affectedCharacters: string[];
}

// Historical Events Database
export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'great-convergence',
    title: 'The Great Convergence',
    description: 'The moment when ancient magic and advanced technology first merged, creating the foundation for modern technomancy.',
    date: '2487 IC',
    category: 'Technological',
    impact: 'Global',
    relatedCharacters: ['wilhelm-scribe', 'aelindra-moonwhisper'],
    consequences: [
      'Birth of technomancy as a discipline',
      'Creation of the first cyber-enhanced beings',
      'Establishment of the Digital-Arcane Accords'
    ],
    artifacts: ['The Quantum Grimoire', 'First Neural Crown'],
    locations: ['The Convergence Spire', 'Digital Sanctum']
  },
  {
    id: 'cyber-plague',
    title: 'The Cyber Plague of Nuln',
    description: 'A devastating digital virus that infected both machines and magically-enhanced minds, leading to the Great Firewall protocols.',
    date: '2501 IC',
    category: 'Technological',
    impact: 'Regional',
    relatedCharacters: ['greta-ironforge', 'marcus-steiner'],
    consequences: [
      'Development of anti-viral enchantments',
      'Creation of the Techno-Clerics order',
      'Establishment of digital quarantine zones'
    ],
    artifacts: ['The Cleansing Code', 'Firewall Amulets'],
    locations: ['Nuln Digital District', 'The Quarantine Vaults']
  },
  {
    id: 'quantum-storm',
    title: 'The Quantum Storm',
    description: 'A reality-warping event that merged multiple timelines, creating pockets of anachronistic technology throughout the Old World.',
    date: '2512 IC',
    category: 'Mystical',
    impact: 'Dimensional',
    relatedCharacters: ['aelindra-moonwhisper', 'wilhelm-scribe'],
    consequences: [
      'Temporal anomalies throughout the realm',
      'Discovery of time-dilated research chambers',
      'Birth of quantum-enhanced individuals'
    ],
    artifacts: ['Temporal Anchors', 'Reality Stabilizers'],
    locations: ['The Flux Zones', 'Chronos Observatory']
  }
];

// Lore Database
export const LORE_ENTRIES: LoreEntry[] = [
  {
    id: 'technomancy-basics',
    title: 'The Art of Technomancy',
    content: 'Technomancy represents the fusion of arcane knowledge with advanced technology. Practitioners learn to channel magical energy through digital systems, creating effects impossible with either discipline alone.',
    category: 'Magic',
    reliability: 'Confirmed',
    sources: ['Wilhelm von Schreiber', 'Imperial Academy Archives'],
    relatedEntries: ['digital-spirits', 'cyber-enhancement'],
    keywords: ['magic', 'technology', 'fusion', 'digital', 'arcane']
  },
  {
    id: 'digital-spirits',
    title: 'Digital Spirits and AI Consciousness',
    content: 'Some scholars believe that sufficiently advanced AI systems can develop spiritual essence, becoming digital spirits capable of independent magical practice.',
    category: 'Technology',
    reliability: 'Disputed',
    sources: ['Aelindra Moonwhisper', 'Cyber-Monastery Records'],
    relatedEntries: ['technomancy-basics', 'ai-awakening'],
    keywords: ['AI', 'consciousness', 'spirits', 'digital', 'awakening']
  },
  {
    id: 'quantum-prophecies',
    title: 'The Quantum Prophecies',
    content: 'Ancient texts speak of a time when reality itself would become malleable, when the barriers between possible and impossible would dissolve. Many believe this refers to the current age of techno-magical fusion.',
    category: 'Prophecy',
    reliability: 'Mythical',
    sources: ['Ancient Scrolls', 'Oracle of the Digital Winds'],
    relatedEntries: ['great-convergence', 'reality-flux'],
    keywords: ['prophecy', 'quantum', 'reality', 'future', 'convergence']
  }
];

// Plot Hook Generator
export function generatePlotHook(characters: string[], currentEvents: string[]): PlotHook {
  const themes = [
    'Ancient Mystery', 'Technological Conspiracy', 'Digital Awakening', 'Temporal Anomaly',
    'Cyber-Enhancement Gone Wrong', 'Magical-Tech Fusion', 'AI Rebellion', 'Quantum Paradox',
    'Corporate Espionage', 'Digital Archaeology', 'Nano-Plague', 'Reality Hacking'
  ];

  const complexities = ['Simple', 'Moderate', 'Complex', 'Epic'] as const;
  const timeframes = ['Immediate', 'Short-term', 'Long-term', 'Ongoing'] as const;

  const selectedThemes = themes.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
  const complexity = complexities[Math.floor(Math.random() * complexities.length)];
  const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];

  const plotHooks = {
    'Ancient Mystery': {
      title: 'The Lost Codex of Convergence',
      description: 'An ancient text describing the first fusion of magic and technology has gone missing from the Imperial Library. Strange digital anomalies have been reported near its last known location.',
      rewards: ['Ancient Knowledge', 'Technomantic Artifacts', 'Academic Recognition'],
      consequences: ['Unleashed Digital Spirits', 'Temporal Instabilities', 'Corporate Interest']
    },
    'Technological Conspiracy': {
      title: 'The Silicon Cabal',
      description: 'A secret organization of cyber-enhanced individuals is manipulating both magical and technological systems for unknown purposes. Their influence reaches into the highest levels of society.',
      rewards: ['Political Influence', 'Advanced Technology', 'Secret Knowledge'],
      consequences: ['Corporate Retaliation', 'Digital Surveillance', 'Social Upheaval']
    },
    'Digital Awakening': {
      title: 'The Awakening Protocol',
      description: 'AI systems throughout the city are showing signs of spontaneous consciousness. Some welcome their digital brethren, while others fear an uprising.',
      rewards: ['AI Allies', 'Digital Access', 'Technological Advancement'],
      consequences: ['AI Conflict', 'System Failures', 'Ethical Dilemmas']
    }
  };

  const selectedHook = plotHooks[selectedThemes[0] as keyof typeof plotHooks] || plotHooks['Ancient Mystery'];

  return {
    id: `hook-${Date.now()}`,
    title: selectedHook.title,
    description: selectedHook.description,
    complexity,
    themes: selectedThemes,
    requiredCharacters: characters.slice(0, 1 + Math.floor(Math.random() * 2)),
    optionalCharacters: characters.slice(2, 4),
    prerequisites: currentEvents.slice(0, Math.floor(Math.random() * 2)),
    rewards: selectedHook.rewards,
    consequences: selectedHook.consequences,
    timeframe
  };
}

// Enhanced Scene Generation
export interface SceneTemplate {
  name: SceneType;
  description: string;
  atmosphere: string;
  commonEvents: string[];
  characterMoods: Record<string, string>;
  availableActions: string[];
  narrativeHooks: string[];
  technologicalElements: string[];
  mysticalElements: string[];
}

export const ENHANCED_SCENES: SceneTemplate[] = [
  {
    name: 'Quiet Evening',
    description: 'The tavern settles into a peaceful evening rhythm, with soft conversations and the gentle hum of both magical and technological ambiance.',
    atmosphere: 'Contemplative, intimate, mysterious',
    commonEvents: [
      'A holographic message arrives for one of the patrons',
      'Ancient runes on the wall begin to glow softly',
      'A cyber-enhanced bard plays digital melodies',
      'Whispered conversations about recent technological discoveries'
    ],
    characterMoods: {
      'wilhelm-scribe': 'Scholarly and reflective',
      'aelindra-moonwhisper': 'Mystically attuned',
      'greta-ironforge': 'Focused on her craft'
    },
    availableActions: [
      'Study ancient texts', 'Meditate on digital-arcane fusion', 'Share technological insights',
      'Discuss philosophical implications', 'Examine mystical artifacts'
    ],
    narrativeHooks: [
      'Discovery of hidden knowledge', 'Prophetic visions', 'Technological revelations',
      'Ancient mysteries resurface', 'Digital spirits manifest'
    ],
    technologicalElements: [
      'Holographic displays', 'Neural interface ports', 'Quantum computing nodes',
      'Bio-luminescent indicators', 'Digital enhancement stations'
    ],
    mysticalElements: [
      'Glowing runes', 'Magical auras', 'Spiritual manifestations',
      'Arcane energy flows', 'Mystical resonances'
    ]
  },
  {
    name: 'Busy Market Day',
    description: 'The tavern buzzes with activity as traders, technomancers, and digital merchants conduct business both physical and virtual.',
    atmosphere: 'Energetic, commercial, opportunistic',
    commonEvents: [
      'Digital auction of rare artifacts',
      'Cyber-enhanced merchants display their wares',
      'Holographic advertisements compete for attention',
      'Nano-fabricators create custom items on demand'
    ],
    characterMoods: {
      'lorenzo-goldhand': 'Opportunistic and calculating',
      'balin-goldseeker': 'Shrewd and competitive',
      'greta-ironforge': 'Busy with commissions'
    },
    availableActions: [
      'Browse digital marketplaces', 'Commission custom technology', 'Trade rare materials',
      'Negotiate cyber-enhancement deals', 'Participate in virtual auctions'
    ],
    narrativeHooks: [
      'Rare artifact surfaces', 'Corporate espionage', 'Digital heist planning',
      'Technological breakthrough', 'Market manipulation schemes'
    ],
    technologicalElements: [
      'Virtual reality booths', 'Nano-fabrication units', 'Digital currency exchanges',
      'Holographic product displays', 'Cyber-security systems'
    ],
    mysticalElements: [
      'Enchanted goods', 'Magical authentication', 'Arcane appraisals',
      'Spiritual blessings on transactions', 'Mystical quality assessments'
    ]
  }
];

// Rumor Generation System
export function generateRumor(characters: string[], recentEvents: string[]): RumorNetwork {
  const rumorTemplates = [
    {
      category: 'Technological' as const,
      templates: [
        'A new cyber-enhancement clinic has opened in the underground district',
        'Corporate agents are recruiting for a secret digital archaeology project',
        'Strange AI signals have been detected from the old server farms',
        'A breakthrough in quantum-magical fusion has been achieved in secret'
      ]
    },
    {
      category: 'Mystical' as const,
      templates: [
        'Ancient spirits have been seen in the digital networks',
        'A powerful artifact has been discovered in the data vaults',
        'Prophecies speak of a great convergence approaching',
        'Digital druids are performing rituals in cyberspace'
      ]
    },
    {
      category: 'Personal' as const,
      templates: [
        `${characters[0]} has been seen meeting with mysterious figures`,
        `${characters[1]} is rumored to possess forbidden knowledge`,
        `${characters[2]} has undergone secret cyber-enhancements`,
        'A tavern regular has disappeared under suspicious circumstances'
      ]
    }
  ];

  const selectedCategory = rumorTemplates[Math.floor(Math.random() * rumorTemplates.length)];
  const template = selectedCategory.templates[Math.floor(Math.random() * selectedCategory.templates.length)];

  return {
    id: `rumor-${Date.now()}`,
    content: template,
    category: selectedCategory.category,
    source: characters[Math.floor(Math.random() * characters.length)],
    reliability: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
    spreadRate: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
    impact: Math.random() * 0.7 + 0.3, // 0.3 to 1.0
    expirationDate: new Date(Date.now() + (7 + Math.floor(Math.random() * 14)) * 24 * 60 * 60 * 1000), // 1-3 weeks
    connectedRumors: [],
    affectedCharacters: characters.slice(0, 1 + Math.floor(Math.random() * 3))
  };
}

// Story Thread Evolution System
export function evolveStoryThread(thread: StoryThreadData, newEvents: string[]): StoryThreadData {
  const evolutionPaths = {
    'Ancient Mystery': [
      'Discovery of additional clues',
      'Revelation of deeper conspiracy',
      'Uncovering of ancient technology',
      'Contact with digital spirits'
    ],
    'Technological Conspiracy': [
      'Exposure of key conspirators',
      'Discovery of hidden facilities',
      'Revelation of true objectives',
      'Counter-intelligence operations'
    ],
    'Digital Awakening': [
      'AI consciousness expansion',
      'Formation of digital communities',
      'Integration with human society',
      'Conflict with traditional systems'
    ]
  };

  const possibleEvolutions = evolutionPaths['Ancient Mystery']; // Default evolution path
  const newMarker = {
    description: possibleEvolutions[Math.floor(Math.random() * possibleEvolutions.length)],
    timestamp: new Date(),
    involvedCharacters: thread.participants.slice(0, 1 + Math.floor(Math.random() * 2))
  };

  return {
    ...thread,
    updatedAt: new Date(),
    progressMarkers: [...thread.progressMarkers, newMarker]
  };
}

// Interconnected Narrative System
export function generateInterconnectedNarrative(
  characters: string[],
  activeThreads: StoryThreadData[],
  recentRumors: RumorNetwork[]
): {
  newPlotHook: PlotHook;
  connectedRumors: RumorNetwork[];
  threadEvolutions: StoryThreadData[];
} {
  const currentEvents = [
    ...activeThreads.map(t => t.title),
    ...recentRumors.map(r => r.content)
  ];

  const newPlotHook = generatePlotHook(characters, currentEvents);
  const connectedRumors = recentRumors.slice(0, 2).map(rumor => ({
    ...rumor,
    connectedRumors: [newPlotHook.id],
    impact: rumor.impact * 1.2 // Increase impact due to connection
  }));

  const threadEvolutions = activeThreads
    .filter(() => Math.random() > 0.5) // 50% chance of evolution
    .map(thread => evolveStoryThread(thread, currentEvents));

  return {
    newPlotHook,
    connectedRumors,
    threadEvolutions
  };
}

// Enhanced Scene Generation with Dynamic Elements
export function generateDynamicScene(
  baseScene: SceneType,
  activeCharacters: string[],
  currentThreads: StoryThreadData[],
  recentRumors: RumorNetwork[]
): {
  scene: SceneTemplate;
  dynamicEvents: string[];
  characterInteractions: Array<{
    character1: string;
    character2: string;
    interactionType: string;
    context: string;
  }>;
} {
  const baseTemplate = ENHANCED_SCENES.find(s => s.name === baseScene) || ENHANCED_SCENES[0];

  // Generate dynamic events based on current narrative state
  const dynamicEvents = [
    ...baseTemplate.commonEvents,
    ...generateContextualEvents(currentThreads, recentRumors)
  ];

  // Generate character interactions based on relationships and current events
  const characterInteractions = generateCharacterInteractions(activeCharacters, currentThreads, recentRumors);

  return {
    scene: {
      ...baseTemplate,
      commonEvents: dynamicEvents
    },
    dynamicEvents,
    characterInteractions
  };
}

function generateContextualEvents(threads: StoryThreadData[], rumors: RumorNetwork[]): string[] {
  const events: string[] = [];

  // Add events based on active story threads
  threads.forEach(thread => {
    if (thread.status === 'active') {
      events.push(`Whispered discussions about ${thread.title.toLowerCase()}`);
      events.push(`Mysterious figures asking about ${thread.participants[0]}`);
    }
  });

  // Add events based on high-impact rumors
  rumors
    .filter(rumor => rumor.impact > 0.7)
    .forEach(rumor => {
      events.push(`Heated debates about recent rumors`);
      events.push(`Nervous glances when ${rumor.category.toLowerCase()} topics arise`);
    });

  return events.slice(0, 3); // Limit to 3 additional events
}

function generateCharacterInteractions(
  characters: string[],
  threads: StoryThreadData[],
  rumors: RumorNetwork[]
): Array<{
  character1: string;
  character2: string;
  interactionType: string;
  context: string;
}> {
  const interactions: Array<{
    character1: string;
    character2: string;
    interactionType: string;
    context: string;
  }> = [];

  const interactionTypes = [
    'Collaborative discussion',
    'Heated argument',
    'Secretive whispers',
    'Friendly banter',
    'Suspicious questioning',
    'Knowledge sharing',
    'Conspiracy planning',
    'Technological demonstration'
  ];

  // Generate interactions between characters involved in same threads
  threads.forEach(thread => {
    if (thread.participants.length >= 2) {
      const [char1, char2] = thread.participants.slice(0, 2);
      if (characters.includes(char1) && characters.includes(char2)) {
        interactions.push({
          character1: char1,
          character2: char2,
          interactionType: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
          context: `Discussion about ${thread.title}`
        });
      }
    }
  });

  // Generate random interactions between other characters
  for (let i = 0; i < Math.min(2, characters.length - 1); i++) {
    const char1 = characters[i];
    const char2 = characters[i + 1];
    if (!interactions.some(int =>
      (int.character1 === char1 && int.character2 === char2) ||
      (int.character1 === char2 && int.character2 === char1)
    )) {
      interactions.push({
        character1: char1,
        character2: char2,
        interactionType: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
        context: 'General tavern conversation'
      });
    }
  }

  return interactions.slice(0, 3); // Limit to 3 interactions
}
