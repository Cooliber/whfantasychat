import type { 
  SocialStanding, 
  CharacterMotivation, 
  CharacterSecret,
  CharacterBackground,
  CharacterRace,
  CharacterClass 
} from '../types/warhammer.types';

// Social Standing System
export class SocialStandingManager {
  private static readonly TITLES_BY_CLASS: Record<string, Record<number, string>> = {
    'noble': {
      1: 'Minor Noble',
      3: 'Baron/Baroness',
      5: 'Count/Countess',
      7: 'Duke/Duchess',
      9: 'Prince/Princess',
      10: 'King/Queen'
    },
    'burgher': {
      1: 'Apprentice',
      3: 'Journeyman',
      5: 'Master Craftsman',
      7: 'Guild Leader',
      9: 'Merchant Prince',
      10: 'Trade Magnate'
    },
    'clergy': {
      1: 'Initiate',
      3: 'Priest',
      5: 'High Priest',
      7: 'Arch Lector',
      9: 'Grand Theogonist',
      10: 'Divine Avatar'
    },
    'peasant': {
      1: 'Serf',
      3: 'Freeman',
      5: 'Village Elder',
      7: 'Landowner',
      9: 'Rural Noble',
      10: 'Folk Hero'
    }
  };

  static generateSocialStanding(background: CharacterBackground, race: CharacterRace): SocialStanding {
    const baseRank = this.calculateBaseRank(background);
    const title = this.determineTitle(background.socialClass, baseRank);
    
    return {
      title,
      rank: baseRank,
      privileges: this.generatePrivileges(background.socialClass, baseRank),
      obligations: this.generateObligations(background.socialClass, baseRank),
      socialConnections: this.generateSocialConnections(background, baseRank),
      courtlyKnowledge: this.calculateCourtlyKnowledge(background),
      etiquetteSkill: this.calculateEtiquetteSkill(background, race)
    };
  }

  private static calculateBaseRank(background: CharacterBackground): number {
    let rank = 1;

    // Base rank by social class
    switch (background.socialClass) {
      case 'noble': rank = 5; break;
      case 'burgher': rank = 3; break;
      case 'clergy': rank = 3; break;
      case 'peasant': rank = 1; break;
      case 'outlaw': rank = 1; break;
    }

    // Modifiers
    if (background.education === 'university') rank += 1;
    if (background.militaryService?.rank === 'Captain') rank += 2;
    if (background.militaryService?.rank === 'Lieutenant') rank += 1;
    if (background.guildMembership?.rank === 'master') rank += 1;
    if (background.guildMembership?.rank === 'grandmaster') rank += 2;
    if (background.family.status === 'noble') rank += 2;
    if (background.family.status === 'wealthy') rank += 1;

    return Math.max(1, Math.min(10, rank));
  }

  private static determineTitle(socialClass: string, rank: number): string | undefined {
    const titles = this.TITLES_BY_CLASS[socialClass];
    if (!titles) return undefined;

    // Find the highest title the character qualifies for
    const availableTitles = Object.keys(titles)
      .map(Number)
      .filter(requiredRank => rank >= requiredRank)
      .sort((a, b) => b - a);

    return availableTitles.length > 0 ? titles[availableTitles[0]] : undefined;
  }

  private static generatePrivileges(socialClass: string, rank: number): string[] {
    const basePrivileges: Record<string, string[]> = {
      'noble': ['Tax Exemption', 'Legal Immunity', 'Land Ownership', 'Command Authority'],
      'burgher': ['Guild Protection', 'Trade Rights', 'Property Rights', 'Legal Representation'],
      'clergy': ['Religious Authority', 'Sanctuary Rights', 'Tax Exemption', 'Healing Services'],
      'peasant': ['Basic Rights', 'Village Protection'],
      'outlaw': []
    };

    const privileges = [...(basePrivileges[socialClass] || [])];
    
    // Add rank-based privileges
    if (rank >= 5) privileges.push('Court Access');
    if (rank >= 7) privileges.push('Political Influence');
    if (rank >= 9) privileges.push('Royal Audience');

    return privileges;
  }

  private static generateObligations(socialClass: string, rank: number): string[] {
    const baseObligations: Record<string, string[]> = {
      'noble': ['Military Service', 'Tax Collection', 'Justice Administration', 'Feudal Duties'],
      'burgher': ['Guild Dues', 'Trade Regulations', 'City Taxes', 'Civic Duties'],
      'clergy': ['Religious Duties', 'Charity Work', 'Spiritual Guidance', 'Temple Maintenance'],
      'peasant': ['Labor Service', 'Crop Tithes', 'Military Levy'],
      'outlaw': []
    };

    const obligations = [...(baseObligations[socialClass] || [])];
    
    // Add rank-based obligations
    if (rank >= 5) obligations.push('Court Attendance');
    if (rank >= 7) obligations.push('Political Responsibilities');
    if (rank >= 9) obligations.push('State Duties');

    return obligations;
  }

  private static generateSocialConnections(background: CharacterBackground, rank: number): Array<{
    name: string;
    relationship: string;
    influence: number;
  }> {
    const connections = [];
    const connectionCount = Math.min(rank + 2, 8);

    const possibleConnections = [
      { name: 'Lord Aldric von Reikland', relationship: 'Noble Patron', influence: 8 },
      { name: 'Guildmaster Heinrich', relationship: 'Professional Contact', influence: 6 },
      { name: 'Captain Marcus Steiner', relationship: 'Military Contact', influence: 5 },
      { name: 'High Priest Sigmund', relationship: 'Religious Contact', influence: 7 },
      { name: 'Merchant Prince Valdric', relationship: 'Business Partner', influence: 6 },
      { name: 'Scholar Elara Brightmoon', relationship: 'Academic Contact', influence: 4 },
      { name: 'Spymaster Shadows', relationship: 'Information Broker', influence: 9 },
      { name: 'Innkeeper Brunhilde', relationship: 'Local Contact', influence: 3 }
    ];

    // Select random connections based on rank
    const shuffled = possibleConnections.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, connectionCount);
  }

  private static calculateCourtlyKnowledge(background: CharacterBackground): number {
    let knowledge = 10; // Base knowledge

    if (background.socialClass === 'noble') knowledge += 40;
    if (background.socialClass === 'burgher') knowledge += 20;
    if (background.socialClass === 'clergy') knowledge += 25;
    if (background.education === 'university') knowledge += 20;
    if (background.family.status === 'noble') knowledge += 15;

    return Math.max(0, Math.min(100, knowledge));
  }

  private static calculateEtiquetteSkill(background: CharacterBackground, race: CharacterRace): number {
    let skill = 15; // Base skill

    if (background.socialClass === 'noble') skill += 35;
    if (background.socialClass === 'burgher') skill += 15;
    if (background.socialClass === 'clergy') skill += 20;
    if (race === 'Elf') skill += 20;
    if (race === 'Bretonnian') skill += 15;
    if (background.education === 'university') skill += 10;

    return Math.max(0, Math.min(100, skill));
  }
}

// Character Motivation System
export class MotivationManager {
  private static readonly PRIMARY_MOTIVATIONS = [
    'Wealth Accumulation', 'Power Seeking', 'Knowledge Pursuit', 'Revenge',
    'Family Honor', 'Religious Devotion', 'Adventure', 'Justice',
    'Love', 'Survival', 'Fame', 'Redemption'
  ];

  private static readonly SECONDARY_MOTIVATIONS = [
    'Social Climbing', 'Skill Mastery', 'Friendship', 'Security',
    'Freedom', 'Duty', 'Curiosity', 'Competition', 'Comfort', 'Recognition'
  ];

  static generateMotivations(background: CharacterBackground, characterClass: CharacterClass): CharacterMotivation {
    const primary = this.selectPrimaryMotivation(background, characterClass);
    const secondary = this.selectSecondaryMotivations(primary);
    
    return {
      primary,
      secondary,
      shortTermGoals: this.generateShortTermGoals(primary, background),
      longTermAmbitions: this.generateLongTermAmbitions(primary, background),
      fears: this.generateFears(background),
      desires: this.generateDesires(primary),
      moralCode: this.generateMoralCode(background)
    };
  }

  private static selectPrimaryMotivation(background: CharacterBackground, characterClass: CharacterClass): string {
    // Weight motivations based on background and class
    const weights: Record<string, number> = {};
    
    this.PRIMARY_MOTIVATIONS.forEach(motivation => {
      weights[motivation] = 1; // Base weight
    });

    // Background-based weights
    if (background.socialClass === 'noble') {
      weights['Power Seeking'] += 3;
      weights['Family Honor'] += 2;
    }
    if (background.socialClass === 'peasant') {
      weights['Wealth Accumulation'] += 2;
      weights['Survival'] += 2;
    }
    if (background.criminalRecord) {
      weights['Redemption'] += 2;
      weights['Revenge'] += 1;
    }

    // Class-based weights
    if (characterClass === 'Scholar') weights['Knowledge Pursuit'] += 3;
    if (characterClass === 'Merchant') weights['Wealth Accumulation'] += 3;
    if (characterClass === 'Soldier') weights['Duty'] = (weights['Duty'] || 0) + 2;
    if (characterClass === 'Priest') weights['Religious Devotion'] += 3;

    return this.weightedRandomSelect(weights);
  }

  private static selectSecondaryMotivations(primary: string): string[] {
    const available = this.SECONDARY_MOTIVATIONS.filter(m => m !== primary);
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 secondary motivations
    
    return available.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private static generateShortTermGoals(primary: string, background: CharacterBackground) {
    const goalsByMotivation: Record<string, string[]> = {
      'Wealth Accumulation': ['Save 100 gold coins', 'Find profitable trade route', 'Invest in business'],
      'Power Seeking': ['Gain political influence', 'Build network of allies', 'Acquire position of authority'],
      'Knowledge Pursuit': ['Research ancient texts', 'Learn new skill', 'Discover hidden truth'],
      'Revenge': ['Track down enemy', 'Gather evidence', 'Plan confrontation'],
      'Family Honor': ['Restore family reputation', 'Avenge family wrong', 'Achieve recognition']
    };

    const possibleGoals = goalsByMotivation[primary] || ['Survive another day', 'Help others', 'Find purpose'];
    const goalCount = Math.floor(Math.random() * 3) + 1;
    
    return possibleGoals.slice(0, goalCount).map(goal => ({
      goal,
      priority: Math.floor(Math.random() * 10) + 1,
      deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within 90 days
      progress: Math.floor(Math.random() * 30) // 0-30% initial progress
    }));
  }

  private static generateLongTermAmbitions(primary: string, background: CharacterBackground) {
    const ambitionsByMotivation: Record<string, string[]> = {
      'Wealth Accumulation': ['Become merchant prince', 'Own trading empire', 'Retire in luxury'],
      'Power Seeking': ['Rule a province', 'Become court advisor', 'Lead a faction'],
      'Knowledge Pursuit': ['Master all schools of magic', 'Write definitive history', 'Unlock ancient secrets'],
      'Revenge': ['Destroy enemy completely', 'Expose corruption', 'Bring justice to wrongdoers']
    };

    const possibleAmbitions = ambitionsByMotivation[primary] || ['Live peacefully', 'Help community', 'Find happiness'];
    const ambitionCount = Math.floor(Math.random() * 2) + 1;
    
    return possibleAmbitions.slice(0, ambitionCount).map(ambition => ({
      ambition,
      feasibility: Math.floor(Math.random() * 10) + 1,
      timeframe: ['5-10 years', '10-20 years', 'Lifetime'][Math.floor(Math.random() * 3)],
      obstacles: this.generateObstacles(ambition)
    }));
  }

  private static generateObstacles(ambition: string): string[] {
    const commonObstacles = [
      'Lack of resources', 'Political opposition', 'Personal limitations',
      'Competing interests', 'Legal barriers', 'Social prejudice'
    ];
    
    const count = Math.floor(Math.random() * 3) + 1;
    return commonObstacles.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private static generateFears(background: CharacterBackground): string[] {
    const commonFears = [
      'Death', 'Poverty', 'Betrayal', 'Failure', 'Loneliness',
      'Loss of status', 'Physical pain', 'Magical corruption'
    ];

    // Add background-specific fears
    if (background.criminalRecord) commonFears.push('Arrest', 'Exposure');
    if (background.socialClass === 'noble') commonFears.push('Scandal', 'Loss of title');
    if (background.militaryService) commonFears.push('War memories', 'Combat');

    const count = Math.floor(Math.random() * 4) + 2;
    return commonFears.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private static generateDesires(primary: string): string[] {
    const commonDesires = [
      'Comfort', 'Recognition', 'Love', 'Adventure', 'Peace',
      'Excitement', 'Respect', 'Freedom', 'Security', 'Knowledge'
    ];

    const count = Math.floor(Math.random() * 4) + 2;
    return commonDesires.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private static generateMoralCode(background: CharacterBackground) {
    const principles = [
      'Honor above all', 'Protect the innocent', 'Keep your word',
      'Respect authority', 'Help those in need', 'Seek truth',
      'Defend the weak', 'Loyalty to friends', 'Justice for all'
    ];

    // Background influences on moral flexibility
    let flexibility = 5; // Base flexibility
    if (background.socialClass === 'outlaw') flexibility += 3;
    if (background.criminalRecord) flexibility += 2;
    if (background.socialClass === 'noble') flexibility -= 1;
    if (background.socialClass === 'clergy') flexibility -= 2;

    const principleCount = Math.floor(Math.random() * 4) + 3;
    
    return {
      principles: principles.sort(() => 0.5 - Math.random()).slice(0, principleCount),
      flexibility: Math.max(1, Math.min(10, flexibility))
    };
  }

  private static weightedRandomSelect(weights: Record<string, number>): string {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [item, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) return item;
    }
    
    return Object.keys(weights)[0]; // Fallback
  }
}
