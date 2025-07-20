import type { 
  TavernCharacterData, 
  CharacterRace, 
  CharacterClass, 
  WeaponType, 
  ArmorType, 
  CyberneticType, 
  TechnologyType 
} from '../types/warhammer.types';

// Character Generation Templates and Data
export const RACE_TEMPLATES = {
  Empire: {
    baseAttributes: { strength: 3, dexterity: 3, intelligence: 4, charisma: 3, techAffinity: 3, magicResistance: 2 },
    commonClasses: ['Soldier', 'Scholar', 'Merchant', 'Witch Hunter', 'Technomancer'],
    preferredWeapons: ['Sword', 'Crossbow', 'Plasma Blade', 'Laser Rifle'],
    culturalTraits: ['Disciplined', 'Ambitious', 'Pragmatic', 'Innovative']
  },
  Dwarf: {
    baseAttributes: { strength: 4, dexterity: 2, intelligence: 3, charisma: 2, techAffinity: 4, magicResistance: 4 },
    commonClasses: ['Blacksmith', 'Warrior', 'Merchant', 'Nano-Smith', 'Cyber-Knight'],
    preferredWeapons: ['Axe', 'Mace', 'Cyber-Hammer', 'Nano-Sword'],
    culturalTraits: ['Stubborn', 'Loyal', 'Crafty', 'Traditional']
  },
  Elf: {
    baseAttributes: { strength: 2, dexterity: 4, intelligence: 4, charisma: 4, techAffinity: 2, magicResistance: 3 },
    commonClasses: ['Mage', 'Ranger', 'Scout', 'Digital Alchemist', 'Bio-Engineer'],
    preferredWeapons: ['Bow', 'Staff', 'Digital Bow', 'Quantum Staff'],
    culturalTraits: ['Graceful', 'Wise', 'Mysterious', 'Nature-bound']
  },
  Halfling: {
    baseAttributes: { strength: 2, dexterity: 4, intelligence: 3, charisma: 4, techAffinity: 2, magicResistance: 2 },
    commonClasses: ['Rogue', 'Cook', 'Innkeeper', 'Burglar', 'Bio-Engineer'],
    preferredWeapons: ['Dagger', 'Bow', 'Bio-Weapon', 'Neural Disruptor'],
    culturalTraits: ['Cheerful', 'Curious', 'Peaceful', 'Resourceful']
  },
  Bretonnian: {
    baseAttributes: { strength: 4, dexterity: 3, intelligence: 2, charisma: 4, techAffinity: 1, magicResistance: 3 },
    commonClasses: ['Knight', 'Warrior', 'Cyber-Knight', 'Soldier'],
    preferredWeapons: ['Sword', 'Mace', 'Plasma Blade', 'Cyber-Hammer'],
    culturalTraits: ['Honorable', 'Proud', 'Chivalrous', 'Traditional']
  },
  Tilean: {
    baseAttributes: { strength: 3, dexterity: 3, intelligence: 4, charisma: 4, techAffinity: 3, magicResistance: 2 },
    commonClasses: ['Merchant', 'Scholar', 'Rogue', 'Technomancer', 'Digital Alchemist'],
    preferredWeapons: ['Crossbow', 'Dagger', 'Laser Rifle', 'Neural Disruptor'],
    culturalTraits: ['Cunning', 'Artistic', 'Mercantile', 'Sophisticated']
  },
  Norse: {
    baseAttributes: { strength: 4, dexterity: 3, intelligence: 2, charisma: 3, techAffinity: 2, magicResistance: 4 },
    commonClasses: ['Berserker', 'Warrior', 'Ranger', 'Cyber-Knight'],
    preferredWeapons: ['Axe', 'Sword', 'Cyber-Hammer', 'Plasma Blade'],
    culturalTraits: ['Fierce', 'Independent', 'Superstitious', 'Hardy']
  }
};

export const BACKSTORY_TEMPLATES = {
  Noble: [
    'Born into wealth but lost everything in a political scandal',
    'Heir to a great house who chose adventure over comfort',
    'Former court advisor who discovered dangerous secrets',
    'Cyber-enhanced noble seeking to bridge old and new worlds'
  ],
  Merchant: [
    'Successful trader who lost a fortune to pirates',
    'Traveling merchant with connections across the Old World',
    'Former guild master seeking new opportunities',
    'Tech-savvy trader dealing in both ancient and futuristic goods'
  ],
  Artisan: [
    'Master craftsperson whose techniques are legendary',
    'Apprentice who discovered a revolutionary new method',
    'Guild member who broke tradition to innovate',
    'Nano-enhanced artisan creating impossible works'
  ],
  Peasant: [
    'Simple farmer who discovered hidden talents',
    'Village hero who saved their community',
    'Refugee seeking a new life in the city',
    'Cyber-augmented worker transcending their origins'
  ],
  Outcast: [
    'Exiled for crimes they may not have committed',
    'Survivor of a destroyed community',
    'Former cultist seeking redemption',
    'Digital consciousness seeking physical form'
  ]
};

export const PERSONALITY_TRAITS = [
  // Traditional traits
  'Brave', 'Cautious', 'Curious', 'Loyal', 'Ambitious', 'Humble', 'Proud', 'Wise',
  'Stubborn', 'Generous', 'Greedy', 'Honest', 'Deceptive', 'Cheerful', 'Grim',
  'Passionate', 'Calm', 'Impulsive', 'Patient', 'Aggressive', 'Peaceful',
  
  // Tech-enhanced traits
  'Data-Driven', 'Algorithmically Precise', 'Quantum-Intuitive', 'Cyber-Empathetic',
  'Digitally Paranoid', 'Nano-Enhanced', 'Bio-Integrated', 'Technologically Curious',
  'Artificially Intelligent', 'Quantum-Entangled', 'Neural-Networked', 'Cyber-Spiritual'
];

export const EQUIPMENT_SETS = {
  Warrior: {
    weapons: ['Sword', 'Plasma Blade'] as WeaponType[],
    armor: ['Plate', 'Power Armor'] as ArmorType[],
    technology: ['Healing Potions', 'AI Assistant'] as TechnologyType[]
  },
  Scholar: {
    weapons: ['Staff', 'Quantum Staff'] as WeaponType[],
    armor: ['Robes', 'Digital Cloak'] as ArmorType[],
    technology: ['Scrying Crystal', 'Quantum Computer'] as TechnologyType[]
  },
  Rogue: {
    weapons: ['Dagger', 'Neural Disruptor'] as WeaponType[],
    armor: ['Leather', 'Nano-Mesh'] as ArmorType[],
    technology: ['Alchemy Kit', 'Holographic Projector'] as TechnologyType[]
  },
  Technomancer: {
    weapons: ['Laser Rifle', 'Digital Bow'] as WeaponType[],
    armor: ['Neural Interface Suit', 'Bio-Suit'] as ArmorType[],
    technology: ['Nano-Fabricator', 'Neural Network'] as TechnologyType[],
    cybernetics: ['Neural Implant', 'Quantum Processor'] as CyberneticType[]
  }
};

// Character Generation Functions
export function generateRandomCharacter(): Partial<TavernCharacterData> {
  const races: CharacterRace[] = ['Empire', 'Dwarf', 'Elf', 'Halfling', 'Bretonnian', 'Tilean', 'Norse'];
  const race = races[Math.floor(Math.random() * races.length)];
  const template = RACE_TEMPLATES[race];
  
  const characterClass = template.commonClasses[Math.floor(Math.random() * template.commonClasses.length)] as CharacterClass;
  const age = generateAge(race);
  
  return {
    race,
    characterClass,
    age,
    personalityTraits: generatePersonalityTraits(),
    attributes: generateAttributes(template.baseAttributes),
    appearance: generateAppearance(),
    weapons: [template.preferredWeapons[Math.floor(Math.random() * template.preferredWeapons.length)] as WeaponType],
    armor: generateArmorSet(characterClass),
    technology: generateTechnologySet(characterClass),
    cybernetics: generateCybernetics(characterClass),
    origin: generateOrigin(),
    backstory: generateBackstory(race, characterClass),
    skills: generateSkills(characterClass),
    equipment: generateBasicEquipment(characterClass),
    secrets: generateSecrets(),
    goals: generateGoals(characterClass)
  };
}

function generateAge(race: CharacterRace): number {
  const ageRanges = {
    Empire: [18, 70],
    Dwarf: [40, 200],
    Elf: [100, 500],
    Halfling: [20, 80],
    Bretonnian: [18, 65],
    Tilean: [18, 70],
    Norse: [16, 60]
  };
  
  const [min, max] = ageRanges[race];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePersonalityTraits(): string[] {
  const numTraits = 3 + Math.floor(Math.random() * 3); // 3-5 traits
  const shuffled = [...PERSONALITY_TRAITS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numTraits);
}

function generateAttributes(base: any) {
  return {
    strength: base.strength + Math.floor(Math.random() * 3),
    dexterity: base.dexterity + Math.floor(Math.random() * 3),
    intelligence: base.intelligence + Math.floor(Math.random() * 3),
    charisma: base.charisma + Math.floor(Math.random() * 3),
    techAffinity: base.techAffinity + Math.floor(Math.random() * 3),
    magicResistance: base.magicResistance + Math.floor(Math.random() * 3)
  };
}

function generateAppearance() {
  const builds = ['Slim', 'Average', 'Muscular', 'Heavy', 'Cybernetic'] as const;
  const eyeColors = ['Brown', 'Blue', 'Green', 'Gray', 'Hazel', 'Cyber-Blue', 'Digital-Gold'];
  const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Cyber-Silver'];
  const cyberVisibility = ['Hidden', 'Subtle', 'Obvious', 'Dominant'] as const;
  
  return {
    height: `${150 + Math.floor(Math.random() * 50)}cm`,
    build: builds[Math.floor(Math.random() * builds.length)],
    eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
    hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
    distinguishingMarks: generateDistinguishingMarks(),
    cyberneticVisibility: cyberVisibility[Math.floor(Math.random() * cyberVisibility.length)]
  };
}

function generateDistinguishingMarks(): string[] {
  const marks = [
    'Scar across left cheek', 'Tattoo of ancient runes', 'Missing finger',
    'Cyber-eye implant', 'Neural interface ports', 'Bio-luminescent markings',
    'Quantum tattoos that shift color', 'Nano-enhanced skin texture'
  ];
  
  const numMarks = Math.floor(Math.random() * 3);
  return marks.sort(() => Math.random() - 0.5).slice(0, numMarks);
}

function generateArmorSet(characterClass: CharacterClass): ArmorType[] {
  const equipmentSet = EQUIPMENT_SETS[characterClass as keyof typeof EQUIPMENT_SETS];
  if (equipmentSet?.armor) {
    return [equipmentSet.armor[Math.floor(Math.random() * equipmentSet.armor.length)]];
  }
  
  const defaultArmor: ArmorType[] = ['Leather', 'Chain Mail', 'Light Armor'];
  return [defaultArmor[Math.floor(Math.random() * defaultArmor.length)]];
}

function generateTechnologySet(characterClass: CharacterClass): TechnologyType[] {
  const equipmentSet = EQUIPMENT_SETS[characterClass as keyof typeof EQUIPMENT_SETS];
  if (equipmentSet?.technology) {
    return equipmentSet.technology.slice(0, 1 + Math.floor(Math.random() * 2));
  }
  
  const defaultTech: TechnologyType[] = ['Alchemy Kit', 'Healing Potions'];
  return [defaultTech[Math.floor(Math.random() * defaultTech.length)]];
}

function generateCybernetics(characterClass: CharacterClass): CyberneticType[] {
  const equipmentSet = EQUIPMENT_SETS[characterClass as keyof typeof EQUIPMENT_SETS];
  if (equipmentSet?.cybernetics && Math.random() > 0.5) {
    return equipmentSet.cybernetics.slice(0, 1 + Math.floor(Math.random() * 2));
  }
  
  // 30% chance of having cybernetics for non-tech classes
  if (Math.random() > 0.7) {
    const basicCybernetics: CyberneticType[] = ['Neural Implant', 'Cyber Eye', 'Data Port'];
    return [basicCybernetics[Math.floor(Math.random() * basicCybernetics.length)]];
  }
  
  return [];
}

function generateOrigin() {
  const birthplaces = [
    'Altdorf', 'Nuln', 'Middenheim', 'Karaz-a-Karak', 'Lothern',
    'Cyber-City Alpha', 'Neo-Marienburg', 'Digital Realm'
  ];
  const socialClasses = ['Noble', 'Merchant', 'Artisan', 'Peasant', 'Outcast', 'Cyber-Enhanced'] as const;
  const educations = [
    'University trained', 'Guild apprenticeship', 'Self-taught', 'Military academy',
    'Cyber-enhanced learning', 'Neural download', 'Quantum education'
  ];
  
  return {
    birthplace: birthplaces[Math.floor(Math.random() * birthplaces.length)],
    socialClass: socialClasses[Math.floor(Math.random() * socialClasses.length)],
    education: educations[Math.floor(Math.random() * educations.length)],
    formativeEvent: generateFormativeEvent()
  };
}

function generateFormativeEvent(): string {
  const events = [
    'Witnessed a great battle', 'Lost family to plague', 'Discovered hidden treasure',
    'Saved by a stranger', 'Betrayed by a friend', 'Found ancient artifact',
    'Cyber-enhancement surgery', 'Digital consciousness awakening', 'Quantum entanglement event',
    'Neural network integration', 'Bio-technological fusion', 'Time dilation experience'
  ];
  
  return events[Math.floor(Math.random() * events.length)];
}

function generateBackstory(race: CharacterRace, characterClass: CharacterClass): string {
  const template = RACE_TEMPLATES[race];
  const socialClasses = ['Noble', 'Merchant', 'Artisan', 'Peasant', 'Outcast'] as const;
  const socialClass = socialClasses[Math.floor(Math.random() * socialClasses.length)];
  
  const backstories = BACKSTORY_TEMPLATES[socialClass];
  const baseBackstory = backstories[Math.floor(Math.random() * backstories.length)];
  
  return `${baseBackstory} Now working as a ${characterClass.toLowerCase()}, they bring ${template.culturalTraits[Math.floor(Math.random() * template.culturalTraits.length)].toLowerCase()} determination to their endeavors.`;
}

function generateSkills(characterClass: CharacterClass): string[] {
  const skillSets = {
    Soldier: ['Combat', 'Tactics', 'Leadership', 'Weapon Maintenance'],
    Scholar: ['Research', 'Ancient Languages', 'History', 'Analysis'],
    Blacksmith: ['Metalworking', 'Tool Crafting', 'Material Assessment', 'Repair'],
    Mage: ['Spellcasting', 'Ritual Magic', 'Arcane Knowledge', 'Meditation'],
    Technomancer: ['Programming', 'Cyber-Enhancement', 'Digital Magic', 'AI Communication'],
    'Nano-Smith': ['Molecular Assembly', 'Nano-Engineering', 'Material Science', 'Precision Crafting']
  };
  
  const classSkills = skillSets[characterClass as keyof typeof skillSets] || ['General Knowledge', 'Survival', 'Communication'];
  return classSkills.slice(0, 3 + Math.floor(Math.random() * 2));
}

function generateBasicEquipment(characterClass: CharacterClass): string[] {
  const equipmentSets = {
    Soldier: ['Sword', 'Shield', 'Armor', 'Rations'],
    Scholar: ['Books', 'Writing Materials', 'Magnifying Glass', 'Scrolls'],
    Blacksmith: ['Hammer', 'Anvil', 'Tongs', 'Bellows'],
    Mage: ['Spellbook', 'Component Pouch', 'Crystal Focus', 'Robes'],
    Technomancer: ['Neural Interface', 'Quantum Device', 'Data Crystals', 'Cyber-Tools']
  };
  
  const classEquipment = equipmentSets[characterClass as keyof typeof equipmentSets] || ['Basic Supplies', 'Clothing', 'Personal Items'];
  return classEquipment;
}

function generateSecrets(): string[] {
  const secrets = [
    'Knows the location of hidden treasure', 'Has a secret identity', 'Witnessed a crime',
    'Possesses forbidden knowledge', 'Has cyber-enhanced memories', 'Connected to AI network',
    'Carries digital consciousness backup', 'Has quantum-entangled twin'
  ];
  
  const numSecrets = 1 + Math.floor(Math.random() * 2);
  return secrets.sort(() => Math.random() - 0.5).slice(0, numSecrets);
}

function generateGoals(characterClass: CharacterClass): string[] {
  const goalSets = {
    Soldier: ['Protect the innocent', 'Serve with honor', 'Master combat skills'],
    Scholar: ['Discover ancient knowledge', 'Write the definitive history', 'Solve great mysteries'],
    Blacksmith: ['Create a masterwork', 'Perfect the craft', 'Train worthy apprentices'],
    Mage: ['Master powerful spells', 'Understand the nature of magic', 'Protect magical balance'],
    Technomancer: ['Bridge magic and technology', 'Achieve digital transcendence', 'Create perfect fusion']
  };
  
  const classGoals = goalSets[characterClass as keyof typeof goalSets] || ['Find purpose', 'Help others', 'Achieve greatness'];
  return classGoals.slice(0, 2 + Math.floor(Math.random() * 2));
}
