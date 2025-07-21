import type { 
  TavernCharacterData, 
  CharacterBackground, 
  FactionStanding, 
  CharacterProgression,
  CharacterReputation,
  CharacterSkill,
  SocialStanding,
  CharacterMotivation,
  CharacterSecret,
  CharacterRace,
  CharacterClass,
  Region
} from '../types/warhammer.types';

// Character Background Generation
export class CharacterBackgroundGenerator {
  private static empireProvinces = [
    'Reikland', 'Middenland', 'Nordland', 'Ostland', 'Hochland', 
    'Talabecland', 'Stirland', 'Averland', 'Wissenland', 'Ostermark'
  ];

  private static careers = [
    'Soldier', 'Scholar', 'Merchant', 'Artisan', 'Noble', 'Priest',
    'Scout', 'Entertainer', 'Criminal', 'Servant', 'Farmer', 'Hunter'
  ];

  private static guilds = [
    'Merchants Guild', 'Smiths Guild', 'Carpenters Guild', 'Masons Guild',
    'Scribes Guild', 'Physicians Guild', 'Brewers Guild', 'Bakers Guild'
  ];

  static generateBackground(race: CharacterRace, characterClass: CharacterClass): CharacterBackground {
    const socialClass = this.determineSocialClass(race, characterClass);
    const birthplace = this.generateBirthplace(race);
    
    return {
      socialClass,
      birthplace,
      family: this.generateFamily(socialClass),
      education: this.generateEducation(socialClass, characterClass),
      careerPath: this.generateCareerPath(characterClass),
      militaryService: Math.random() > 0.6 ? this.generateMilitaryService() : undefined,
      guildMembership: Math.random() > 0.5 ? this.generateGuildMembership() : undefined,
      criminalRecord: Math.random() > 0.8 ? this.generateCriminalRecord() : undefined
    };
  }

  private static determineSocialClass(race: CharacterRace, characterClass: CharacterClass): CharacterBackground['socialClass'] {
    if (characterClass === 'Knight' || characterClass === 'Wizard') return 'noble';
    if (characterClass === 'Scholar' || characterClass === 'Merchant') return 'burgher';
    if (race === 'Dwarf' && characterClass === 'Blacksmith') return 'burgher';
    return Math.random() > 0.7 ? 'burgher' : 'peasant';
  }

  private static generateBirthplace(race: CharacterRace): string {
    switch (race) {
      case 'Empire':
        return this.empireProvinces[Math.floor(Math.random() * this.empireProvinces.length)];
      case 'Dwarf':
        return ['Karaz-a-Karak', 'Zhufbar', 'Karak Kadrin', 'Barak Varr'][Math.floor(Math.random() * 4)];
      case 'Elf':
        return ['Ulthuan', 'Athel Loren', 'Laurelorn Forest'][Math.floor(Math.random() * 3)];
      case 'Bretonnian':
        return ['Couronne', 'Lyonesse', 'Bastonne', 'Bordeleaux'][Math.floor(Math.random() * 4)];
      default:
        return 'Unknown';
    }
  }

  private static generateFamily(socialClass: CharacterBackground['socialClass']) {
    const statusMap = {
      'peasant': ['poor', 'poor', 'middle'],
      'burgher': ['middle', 'middle', 'wealthy'],
      'noble': ['wealthy', 'wealthy', 'noble'],
      'clergy': ['poor', 'middle', 'wealthy'],
      'outlaw': ['poor', 'unknown', 'middle']
    };

    const possibleStatuses = statusMap[socialClass];
    const status = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)] as any;

    return {
      status,
      reputation: this.generateFamilyReputation(status),
      livingMembers: Math.floor(Math.random() * 8) + 1,
      notableAncestors: status === 'noble' ? this.generateNotableAncestors() : undefined
    };
  }

  private static generateFamilyReputation(status: string): string {
    const reputations = {
      'poor': ['Hardworking', 'Honest', 'Struggling', 'Desperate'],
      'middle': ['Respectable', 'Reliable', 'Ambitious', 'Traditional'],
      'wealthy': ['Influential', 'Generous', 'Shrewd', 'Connected'],
      'noble': ['Ancient', 'Honorable', 'Powerful', 'Prestigious']
    };
    
    const options = reputations[status as keyof typeof reputations] || ['Unknown'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private static generateNotableAncestors(): string[] {
    const ancestors = [
      'Hero of the Battle of Blackfire Pass',
      'Court Wizard to Emperor Magnus',
      'Defender of Altdorf during the Siege',
      'Explorer of the Southlands',
      'Diplomat to the Dwarf Kings'
    ];
    
    const count = Math.floor(Math.random() * 3) + 1;
    return ancestors.slice(0, count);
  }

  private static generateEducation(socialClass: CharacterBackground['socialClass'], characterClass: CharacterClass): CharacterBackground['education'] {
    if (characterClass === 'Scholar' || characterClass === 'Wizard') return 'university';
    if (characterClass === 'Priest') return 'temple';
    if (characterClass === 'Soldier') return 'military';
    if (socialClass === 'noble') return Math.random() > 0.5 ? 'university' : 'guild';
    if (socialClass === 'burgher') return 'guild';
    return Math.random() > 0.7 ? 'basic' : 'none';
  }

  private static generateCareerPath(characterClass: CharacterClass) {
    const baseCareers = this.careers.filter(c => c !== characterClass);
    const pathLength = Math.floor(Math.random() * 3) + 1;
    
    return Array.from({ length: pathLength }, (_, i) => ({
      career: i === pathLength - 1 ? characterClass : baseCareers[Math.floor(Math.random() * baseCareers.length)],
      duration: Math.floor(Math.random() * 10) + 1,
      achievements: this.generateAchievements(),
      connections: this.generateConnections()
    }));
  }

  private static generateAchievements(): string[] {
    const achievements = [
      'Completed apprenticeship with distinction',
      'Saved employer from financial ruin',
      'Discovered new trade route',
      'Defended workshop from raiders',
      'Trained several successful apprentices'
    ];
    
    const count = Math.floor(Math.random() * 3);
    return achievements.slice(0, count);
  }

  private static generateConnections(): string[] {
    const connections = [
      'Guild Master Heinrich',
      'Captain of the City Watch',
      'Merchant Prince Valdric',
      'Temple High Priest',
      'Noble House Steward'
    ];
    
    const count = Math.floor(Math.random() * 2) + 1;
    return connections.slice(0, count);
  }

  private static generateMilitaryService() {
    const units = [
      'Reikland State Troops', 'Middenland Rangers', 'Imperial Engineers',
      'Greatswords Regiment', 'Pistoliers Company', 'Artillery Corps'
    ];
    
    const ranks = ['Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain'];
    const campaigns = [
      'Border Skirmishes', 'Orc Invasion', 'Chaos Incursion', 
      'Beastmen Hunt', 'Bandit Suppression', 'Trade Route Protection'
    ];

    return {
      unit: units[Math.floor(Math.random() * units.length)],
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      campaigns: campaigns.slice(0, Math.floor(Math.random() * 3) + 1),
      decorations: Math.random() > 0.7 ? ['Medal of Valor'] : [],
      discharge: ['honorable', 'medical', 'disciplinary'][Math.floor(Math.random() * 3)] as any
    };
  }

  private static generateGuildMembership() {
    const ranks = ['apprentice', 'journeyman', 'master', 'grandmaster'];
    const specializations = [
      'Fine Metalwork', 'Weapon Crafting', 'Jewelry', 'Architectural Design',
      'Rare Books', 'Herbal Medicine', 'Exotic Brewing', 'Ceremonial Items'
    ];

    return {
      guild: this.guilds[Math.floor(Math.random() * this.guilds.length)],
      rank: ranks[Math.floor(Math.random() * ranks.length)] as any,
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      standing: Math.floor(Math.random() * 10) + 1
    };
  }

  private static generateCriminalRecord() {
    const crimes = [
      'Theft', 'Smuggling', 'Fraud', 'Assault', 'Poaching', 
      'Tax Evasion', 'Disturbing the Peace', 'Illegal Gambling'
    ];

    return {
      crimes: crimes.slice(0, Math.floor(Math.random() * 3) + 1),
      convictions: Math.floor(Math.random() * 3),
      timeServed: Math.floor(Math.random() * 24),
      currentStatus: ['clean', 'wanted', 'pardoned'][Math.floor(Math.random() * 3)] as any
    };
  }
}

// Faction Standing Generator
export class FactionStandingGenerator {
  private static factions = [
    { id: 'empire', name: 'The Empire', baseStanding: 0 },
    { id: 'dwarfs', name: 'Dwarf Holds', baseStanding: 0 },
    { id: 'elves', name: 'Elf Enclaves', baseStanding: -10 },
    { id: 'bretonnia', name: 'Bretonnia', baseStanding: -5 },
    { id: 'merchants', name: 'Merchant Guilds', baseStanding: 10 },
    { id: 'templars', name: 'Templar Orders', baseStanding: 5 },
    { id: 'wizards', name: 'Colleges of Magic', baseStanding: -5 }
  ];

  static generateFactionStandings(race: CharacterRace, background: CharacterBackground): Map<string, FactionStanding> {
    const standings = new Map<string, FactionStanding>();
    
    this.factions.forEach(faction => {
      const baseStanding = this.calculateBaseStanding(faction, race, background);
      const standing: FactionStanding = {
        factionId: faction.id,
        name: faction.name,
        standing: baseStanding + (Math.floor(Math.random() * 21) - 10), // ±10 variation
        privileges: this.generatePrivileges(baseStanding),
        obligations: this.generateObligations(baseStanding),
        lastInteraction: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
      };
      
      standings.set(faction.id, standing);
    });
    
    return standings;
  }

  private static calculateBaseStanding(faction: any, race: CharacterRace, background: CharacterBackground): number {
    let base = faction.baseStanding;
    
    // Race modifiers
    if (faction.id === 'empire' && race === 'Empire') base += 20;
    if (faction.id === 'dwarfs' && race === 'Dwarf') base += 30;
    if (faction.id === 'elves' && race === 'Elf') base += 25;
    if (faction.id === 'bretonnia' && race === 'Bretonnian') base += 25;
    
    // Background modifiers
    if (background.socialClass === 'noble') base += 10;
    if (background.militaryService?.discharge === 'honorable') base += 15;
    if (background.criminalRecord) base -= 20;
    
    return Math.max(-100, Math.min(100, base));
  }

  private static generatePrivileges(standing: number): string[] {
    const allPrivileges = [
      'Trade Discounts', 'Safe Passage', 'Information Access', 
      'Legal Protection', 'Diplomatic Immunity', 'Resource Access'
    ];
    
    const count = Math.max(0, Math.floor(standing / 25));
    return allPrivileges.slice(0, count);
  }

  private static generateObligations(standing: number): string[] {
    const allObligations = [
      'Regular Reports', 'Military Service', 'Tax Payments',
      'Loyalty Oaths', 'Information Sharing', 'Resource Contributions'
    ];

    const count = Math.max(0, Math.floor(standing / 30));
    return allObligations.slice(0, count);
  }
}

// Character Progression System
export class CharacterProgressionManager {
  static initializeProgression(characterClass: CharacterClass): CharacterProgression {
    return {
      level: 1,
      experience: 0,
      skillPoints: 0,
      availableAdvances: this.getStartingAdvances(characterClass),
      completedAdvances: [],
      careerProgress: {
        currentCareer: characterClass,
        advancesInCareer: 0,
        canAdvanceCareer: false,
        availableCareerExits: this.getCareerExits(characterClass)
      }
    };
  }

  private static getStartingAdvances(characterClass: CharacterClass): string[] {
    const advancesByClass: Record<string, string[]> = {
      'Soldier': ['Weapon Skill', 'Toughness', 'Strength', 'Leadership'],
      'Scholar': ['Intelligence', 'Fellowship', 'Academic Knowledge', 'Research'],
      'Merchant': ['Fellowship', 'Intelligence', 'Evaluate', 'Haggle'],
      'Blacksmith': ['Strength', 'Toughness', 'Trade (Smith)', 'Craft'],
      'Ranger': ['Ballistic Skill', 'Agility', 'Outdoor Survival', 'Track'],
      'Mage': ['Intelligence', 'Willpower', 'Magical Sense', 'Channeling']
    };

    return advancesByClass[characterClass] || ['Basic Skills'];
  }

  private static getCareerExits(characterClass: CharacterClass): string[] {
    const exitsByClass: Record<string, string[]> = {
      'Soldier': ['Sergeant', 'Veteran', 'Mercenary', 'Bodyguard'],
      'Scholar': ['Wizard', 'Scribe', 'Tutor', 'Investigator'],
      'Merchant': ['Trader', 'Fence', 'Smuggler', 'Guild Master'],
      'Blacksmith': ['Weaponsmith', 'Armorer', 'Engineer', 'Artisan'],
      'Ranger': ['Scout', 'Hunter', 'Guide', 'Bounty Hunter'],
      'Mage': ['Battle Wizard', 'Scholar', 'Court Wizard', 'Hedge Wizard']
    };

    return exitsByClass[characterClass] || [];
  }

  static addExperience(progression: CharacterProgression, amount: number): CharacterProgression {
    const newExp = progression.experience + amount;
    const newLevel = Math.floor(newExp / 100) + 1;
    const skillPointsGained = (newLevel - progression.level) * 5;

    return {
      ...progression,
      experience: newExp,
      level: newLevel,
      skillPoints: progression.skillPoints + skillPointsGained,
      canAdvanceCareer: progression.careerProgress.advancesInCareer >= 8
    };
  }
}

// Reputation System Manager
export class ReputationManager {
  static initializeReputation(race: CharacterRace, background: CharacterBackground): CharacterReputation {
    const baseReputation = this.calculateBaseReputation(race, background);

    return {
      overall: baseReputation,
      byRegion: this.generateRegionalReputation(race, baseReputation),
      byFaction: {},
      bySocialClass: this.generateSocialClassReputation(background, baseReputation),
      traits: this.generateInitialTraits(background),
      rumors: []
    };
  }

  private static calculateBaseReputation(race: CharacterRace, background: CharacterBackground): number {
    let base = 50; // Neutral starting point

    // Social class modifiers
    switch (background.socialClass) {
      case 'noble': base += 20; break;
      case 'burgher': base += 10; break;
      case 'clergy': base += 15; break;
      case 'outlaw': base -= 30; break;
    }

    // Military service modifier
    if (background.militaryService?.discharge === 'honorable') base += 10;
    if (background.militaryService?.discharge === 'disciplinary') base -= 15;

    // Criminal record modifier
    if (background.criminalRecord) base -= 20;

    return Math.max(1, Math.min(100, base));
  }

  private static generateRegionalReputation(race: CharacterRace, baseRep: number): Record<Region, number> {
    const regions: Region[] = ['Empire', 'Bretonnia', 'Kislev', 'Tilea', 'Estalia', 'Dwarf Holds', 'Elf Enclaves', 'Border Princes', 'Norsca'];
    const reputation: Record<Region, number> = {} as Record<Region, number>;

    regions.forEach(region => {
      let regionRep = baseRep;

      // Race-based regional modifiers
      if (race === 'Empire' && region === 'Empire') regionRep += 15;
      if (race === 'Dwarf' && region === 'Dwarf Holds') regionRep += 20;
      if (race === 'Elf' && region === 'Elf Enclaves') regionRep += 20;
      if (race === 'Bretonnian' && region === 'Bretonnia') regionRep += 15;

      // Add some random variation
      regionRep += Math.floor(Math.random() * 21) - 10; // ±10

      reputation[region] = Math.max(1, Math.min(100, regionRep));
    });

    return reputation;
  }

  private static generateSocialClassReputation(background: CharacterBackground, baseRep: number): Record<string, number> {
    const classes = ['peasant', 'burgher', 'noble', 'clergy', 'outlaw'];
    const reputation: Record<string, number> = {};

    classes.forEach(socialClass => {
      let classRep = baseRep;

      // Same class bonus
      if (socialClass === background.socialClass) classRep += 15;

      // Class-specific modifiers
      if (background.socialClass === 'noble' && socialClass === 'peasant') classRep -= 10;
      if (background.socialClass === 'outlaw' && socialClass !== 'outlaw') classRep -= 20;

      reputation[socialClass] = Math.max(1, Math.min(100, classRep));
    });

    return reputation;
  }

  private static generateInitialTraits(background: CharacterBackground): Array<{ trait: string; strength: number; source: string }> {
    const traits = [];

    // Traits based on social class
    switch (background.socialClass) {
      case 'noble':
        traits.push({ trait: 'Well-Connected', strength: 8, source: 'Noble Birth' });
        traits.push({ trait: 'Educated', strength: 7, source: 'Noble Education' });
        break;
      case 'burgher':
        traits.push({ trait: 'Reliable', strength: 6, source: 'Middle Class Values' });
        traits.push({ trait: 'Ambitious', strength: 5, source: 'Social Mobility' });
        break;
      case 'peasant':
        traits.push({ trait: 'Hardworking', strength: 7, source: 'Peasant Background' });
        traits.push({ trait: 'Humble', strength: 6, source: 'Simple Origins' });
        break;
    }

    // Traits based on military service
    if (background.militaryService) {
      traits.push({ trait: 'Disciplined', strength: 6, source: 'Military Service' });
      if (background.militaryService.discharge === 'honorable') {
        traits.push({ trait: 'Trustworthy', strength: 7, source: 'Honorable Discharge' });
      }
    }

    // Traits based on guild membership
    if (background.guildMembership) {
      traits.push({ trait: 'Skilled Craftsman', strength: 6, source: 'Guild Training' });
    }

    return traits;
  }

  static addRumor(reputation: CharacterReputation, content: string, veracity: boolean, impact: 'positive' | 'negative' | 'neutral'): CharacterReputation {
    const newRumor = {
      content,
      veracity,
      spread: 1,
      impact
    };

    return {
      ...reputation,
      rumors: [...reputation.rumors, newRumor]
    };
  }
}
