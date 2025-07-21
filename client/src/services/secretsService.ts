import type { 
  CharacterSecret, 
  CharacterBackground, 
  CharacterRace, 
  CharacterClass 
} from '../types/warhammer.types';

// Character Secrets System
export class SecretsManager {
  private static readonly SECRET_TEMPLATES: Record<CharacterSecret['category'], Array<{
    content: string;
    severity: CharacterSecret['severity'];
    discoveryDifficulty: number;
    consequences: CharacterSecret['consequences'];
    clues: CharacterSecret['clues'];
  }>> = {
    'identity': [
      {
        content: 'Is actually of noble birth but hiding their true identity',
        severity: 'major',
        discoveryDifficulty: 8,
        consequences: {
          personal: ['Identity crisis', 'Family pressure'],
          social: ['Social upheaval', 'Changed relationships'],
          legal: ['Inheritance claims', 'Legal obligations'],
          financial: ['Access to family wealth', 'Debt responsibilities']
        },
        clues: [
          { type: 'behavioral', description: 'Unconsciously uses formal speech patterns', obviousness: 3 },
          { type: 'physical', description: 'Bears a hidden family signet ring', obviousness: 6 },
          { type: 'circumstantial', description: 'Knows too much about noble customs', obviousness: 4 }
        ]
      },
      {
        content: 'Is a wanted criminal using a false identity',
        severity: 'devastating',
        discoveryDifficulty: 9,
        consequences: {
          personal: ['Constant fear of discovery', 'Guilt over past crimes'],
          social: ['Loss of all relationships', 'Social ostracism'],
          legal: ['Arrest warrant', 'Trial and punishment'],
          financial: ['Confiscation of assets', 'Inability to work legally']
        },
        clues: [
          { type: 'behavioral', description: 'Nervous around authority figures', obviousness: 4 },
          { type: 'physical', description: 'Tries to hide distinctive scars', obviousness: 5 },
          { type: 'verbal', description: 'Slips up with details about their past', obviousness: 6 }
        ]
      }
    ],
    'past': [
      {
        content: 'Accidentally caused the death of a close friend',
        severity: 'major',
        discoveryDifficulty: 7,
        consequences: {
          personal: ['Overwhelming guilt', 'Self-destructive behavior'],
          social: ['Loss of mutual friends', 'Reputation damage'],
          legal: ['Potential manslaughter charges'],
          financial: ['Compensation to victim\'s family']
        },
        clues: [
          { type: 'behavioral', description: 'Becomes withdrawn when topic is mentioned', obviousness: 5 },
          { type: 'verbal', description: 'Avoids talking about certain time periods', obviousness: 4 },
          { type: 'circumstantial', description: 'Has unexplained knowledge of the incident', obviousness: 7 }
        ]
      },
      {
        content: 'Was dishonorably discharged from military service',
        severity: 'moderate',
        discoveryDifficulty: 6,
        consequences: {
          personal: ['Shame and dishonor', 'Loss of military identity'],
          social: ['Rejection by veteran communities', 'Damaged reputation'],
          legal: ['Barred from military service', 'Loss of veteran benefits'],
          financial: ['No military pension', 'Difficulty finding employment']
        },
        clues: [
          { type: 'behavioral', description: 'Uncomfortable around military personnel', obviousness: 4 },
          { type: 'verbal', description: 'Vague about military service details', obviousness: 5 },
          { type: 'physical', description: 'Missing expected military decorations', obviousness: 6 }
        ]
      }
    ],
    'affiliation': [
      {
        content: 'Is secretly a member of a Chaos cult',
        severity: 'devastating',
        discoveryDifficulty: 10,
        consequences: {
          personal: ['Corruption of soul', 'Loss of humanity'],
          social: ['Complete social rejection', 'Hunted by authorities'],
          legal: ['Death sentence', 'Torture and interrogation'],
          financial: ['Complete loss of assets', 'Bounty on head']
        },
        clues: [
          { type: 'behavioral', description: 'Strange rituals performed in private', obviousness: 8 },
          { type: 'physical', description: 'Hidden chaos symbols or mutations', obviousness: 9 },
          { type: 'verbal', description: 'Knowledge of forbidden lore', obviousness: 7 }
        ]
      },
      {
        content: 'Works as a spy for a foreign power',
        severity: 'major',
        discoveryDifficulty: 8,
        consequences: {
          personal: ['Constant stress', 'Divided loyalties'],
          social: ['Branded as traitor', 'Loss of trust'],
          legal: ['Treason charges', 'Execution'],
          financial: ['Confiscation of assets', 'Loss of income']
        },
        clues: [
          { type: 'behavioral', description: 'Asks too many questions about military matters', obviousness: 5 },
          { type: 'circumstantial', description: 'Has unexplained wealth', obviousness: 6 },
          { type: 'verbal', description: 'Slips into foreign accent when stressed', obviousness: 4 }
        ]
      }
    ],
    'knowledge': [
      {
        content: 'Knows the location of a hidden treasure',
        severity: 'moderate',
        discoveryDifficulty: 5,
        consequences: {
          personal: ['Target for thieves and murderers', 'Constant paranoia'],
          social: ['False friends seeking treasure', 'Isolation for safety'],
          legal: ['Claims on treasure by authorities', 'Tax obligations'],
          financial: ['Potential great wealth', 'Costs of treasure hunting']
        },
        clues: [
          { type: 'behavioral', description: 'Protective of certain maps or documents', obviousness: 4 },
          { type: 'verbal', description: 'References to specific locations', obviousness: 3 },
          { type: 'circumstantial', description: 'Interest in archaeological expeditions', obviousness: 2 }
        ]
      },
      {
        content: 'Witnessed a high-profile murder',
        severity: 'major',
        discoveryDifficulty: 7,
        consequences: {
          personal: ['Fear for personal safety', 'Trauma from witnessing violence'],
          social: ['Pressure to testify', 'Threats from criminals'],
          legal: ['Subpoena to testify', 'Witness protection needs'],
          financial: ['Loss of income due to hiding', 'Protection costs']
        },
        clues: [
          { type: 'behavioral', description: 'Nervous around certain people or places', obviousness: 5 },
          { type: 'verbal', description: 'Knows details not publicly available', obviousness: 8 },
          { type: 'circumstantial', description: 'Was in the area at the time', obviousness: 6 }
        ]
      }
    ],
    'possession': [
      {
        content: 'Owns a stolen magical artifact',
        severity: 'major',
        discoveryDifficulty: 6,
        consequences: {
          personal: ['Magical corruption', 'Addiction to artifact\'s power'],
          social: ['Hunted by original owners', 'Feared by superstitious'],
          legal: ['Theft charges', 'Illegal possession of magical items'],
          financial: ['Valuable but unsellable', 'Costs of hiding it']
        },
        clues: [
          { type: 'physical', description: 'Unusual magical aura around them', obviousness: 7 },
          { type: 'behavioral', description: 'Protective of certain possessions', obviousness: 4 },
          { type: 'circumstantial', description: 'Unexplained magical abilities', obviousness: 8 }
        ]
      },
      {
        content: 'Has compromising documents about powerful people',
        severity: 'moderate',
        discoveryDifficulty: 5,
        consequences: {
          personal: ['Target for assassination', 'Blackmail opportunities'],
          social: ['Dangerous enemies', 'Potential powerful allies'],
          legal: ['Possession of stolen documents', 'Blackmail charges'],
          financial: ['Blackmail income', 'Protection costs']
        },
        clues: [
          { type: 'behavioral', description: 'Confident around powerful people', obviousness: 3 },
          { type: 'verbal', description: 'Hints at knowing secrets', obviousness: 4 },
          { type: 'circumstantial', description: 'Unexplained influence or wealth', obviousness: 5 }
        ]
      }
    ],
    'relationship': [
      {
        content: 'Is having an affair with a married noble',
        severity: 'moderate',
        discoveryDifficulty: 4,
        consequences: {
          personal: ['Emotional turmoil', 'Guilt and shame'],
          social: ['Scandal and gossip', 'Loss of reputation'],
          legal: ['Adultery charges', 'Duel challenges'],
          financial: ['Blackmail vulnerability', 'Loss of patronage']
        },
        clues: [
          { type: 'behavioral', description: 'Secretive about whereabouts', obviousness: 3 },
          { type: 'physical', description: 'Expensive gifts from unknown source', obviousness: 5 },
          { type: 'verbal', description: 'Knowledge of noble\'s private affairs', obviousness: 6 }
        ]
      },
      {
        content: 'Is the illegitimate child of a powerful figure',
        severity: 'major',
        discoveryDifficulty: 8,
        consequences: {
          personal: ['Identity crisis', 'Desire for recognition'],
          social: ['Potential social elevation', 'Family conflicts'],
          legal: ['Inheritance claims', 'Legitimacy disputes'],
          financial: ['Potential inheritance', 'Legal costs']
        },
        clues: [
          { type: 'physical', description: 'Strong resemblance to the powerful figure', obviousness: 7 },
          { type: 'circumstantial', description: 'Mysterious financial support', obviousness: 5 },
          { type: 'behavioral', description: 'Interest in the powerful figure\'s affairs', obviousness: 4 }
        ]
      }
    ]
  };

  static generateSecrets(
    background: CharacterBackground, 
    race: CharacterRace, 
    characterClass: CharacterClass
  ): Map<string, CharacterSecret> {
    const secrets = new Map<string, CharacterSecret>();
    
    // Determine number of secrets based on background complexity
    const secretCount = this.determineSecretCount(background);
    
    // Generate secrets with weighted probability
    const categories = this.getWeightedCategories(background, characterClass);
    
    for (let i = 0; i < secretCount; i++) {
      const category = this.selectWeightedCategory(categories);
      const template = this.selectSecretTemplate(category);
      
      if (template) {
        const secret: CharacterSecret = {
          id: `secret-${Date.now()}-${i}`,
          category,
          ...template
        };
        
        secrets.set(secret.id, secret);
      }
    }
    
    return secrets;
  }

  private static determineSecretCount(background: CharacterBackground): number {
    let baseCount = 1; // Everyone has at least one secret
    
    // Factors that increase secret count
    if (background.socialClass === 'noble') baseCount += 1;
    if (background.socialClass === 'outlaw') baseCount += 2;
    if (background.criminalRecord) baseCount += 1;
    if (background.militaryService) baseCount += 1;
    if (background.careerPath.length > 2) baseCount += 1;
    
    // Random variation
    baseCount += Math.floor(Math.random() * 2); // 0-1 additional
    
    return Math.min(baseCount, 4); // Cap at 4 secrets
  }

  private static getWeightedCategories(
    background: CharacterBackground, 
    characterClass: CharacterClass
  ): Record<CharacterSecret['category'], number> {
    const weights: Record<CharacterSecret['category'], number> = {
      'identity': 1,
      'past': 2,
      'affiliation': 1,
      'knowledge': 1,
      'possession': 1,
      'relationship': 2
    };
    
    // Adjust weights based on background
    if (background.socialClass === 'noble') {
      weights.identity += 2;
      weights.relationship += 2;
    }
    
    if (background.socialClass === 'outlaw') {
      weights.identity += 3;
      weights.past += 2;
      weights.affiliation += 1;
    }
    
    if (background.criminalRecord) {
      weights.past += 3;
      weights.identity += 1;
    }
    
    if (background.militaryService) {
      weights.past += 1;
      weights.affiliation += 1;
    }
    
    // Adjust weights based on class
    if (characterClass === 'Scholar') {
      weights.knowledge += 2;
      weights.possession += 1;
    }
    
    if (characterClass === 'Merchant') {
      weights.possession += 2;
      weights.relationship += 1;
    }
    
    if (characterClass === 'Mage') {
      weights.affiliation += 2;
      weights.knowledge += 2;
      weights.possession += 1;
    }
    
    return weights;
  }

  private static selectWeightedCategory(weights: Record<CharacterSecret['category'], number>): CharacterSecret['category'] {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [category, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) return category as CharacterSecret['category'];
    }
    
    return 'past'; // Fallback
  }

  private static selectSecretTemplate(category: CharacterSecret['category']) {
    const templates = this.SECRET_TEMPLATES[category];
    if (!templates || templates.length === 0) return null;
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  static discoverSecret(secret: CharacterSecret, investigationSkill: number): boolean {
    // Simple discovery mechanic based on skill vs difficulty
    const roll = Math.floor(Math.random() * 100) + 1;
    const modifiedSkill = investigationSkill + (10 - secret.discoveryDifficulty) * 5;
    
    return roll <= modifiedSkill;
  }

  static getSecretClues(secret: CharacterSecret, observationSkill: number): CharacterSecret['clues'] {
    // Return clues that are obvious enough to be noticed
    const threshold = Math.max(1, 10 - Math.floor(observationSkill / 10));
    
    return secret.clues.filter(clue => clue.obviousness <= threshold);
  }

  static revealSecret(secret: CharacterSecret): string {
    return `Secret Revealed: ${secret.content}`;
  }

  static getSecretsByCategory(secrets: Map<string, CharacterSecret>, category: CharacterSecret['category']): CharacterSecret[] {
    return Array.from(secrets.values()).filter(secret => secret.category === category);
  }

  static getSecretsBySeverity(secrets: Map<string, CharacterSecret>, severity: CharacterSecret['severity']): CharacterSecret[] {
    return Array.from(secrets.values()).filter(secret => secret.severity === severity);
  }
}
