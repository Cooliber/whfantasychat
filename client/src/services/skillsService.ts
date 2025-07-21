import type { CharacterSkill, CharacterClass, CharacterRace } from '../types/warhammer.types';

// Enhanced Skills System
export class SkillsManager {
  private static readonly SKILL_DEFINITIONS: Record<string, Omit<CharacterSkill, 'level' | 'experience'>> = {
    // Combat Skills
    'Weapon Skill': {
      name: 'Weapon Skill',
      category: 'combat',
      specializations: ['Swords', 'Axes', 'Maces', 'Polearms', 'Fencing'],
      teachable: true
    },
    'Ballistic Skill': {
      name: 'Ballistic Skill',
      category: 'combat',
      specializations: ['Bows', 'Crossbows', 'Firearms', 'Throwing'],
      teachable: true
    },
    'Dodge': {
      name: 'Dodge',
      category: 'combat',
      specializations: ['Acrobatic', 'Defensive', 'Evasive'],
      teachable: true
    },

    // Academic Skills
    'Academic Knowledge': {
      name: 'Academic Knowledge',
      category: 'academic',
      specializations: ['History', 'Law', 'Magic', 'Philosophy', 'Theology', 'Engineering'],
      teachable: true,
      prerequisites: ['Read/Write']
    },
    'Magical Sense': {
      name: 'Magical Sense',
      category: 'academic',
      specializations: ['Detect Magic', 'Identify Spell', 'Sense Chaos'],
      teachable: false
    },
    'Research': {
      name: 'Research',
      category: 'academic',
      specializations: ['Library', 'Field', 'Experimental'],
      teachable: true,
      prerequisites: ['Read/Write', 'Academic Knowledge']
    },

    // Trade Skills
    'Trade': {
      name: 'Trade',
      category: 'trade',
      specializations: ['Smith', 'Carpenter', 'Cook', 'Brewer', 'Tailor', 'Jeweler'],
      teachable: true
    },
    'Craft': {
      name: 'Craft',
      category: 'trade',
      specializations: ['Weaponsmith', 'Armorer', 'Clockwork', 'Alchemy'],
      teachable: true
    },

    // Social Skills
    'Charm': {
      name: 'Charm',
      category: 'social',
      specializations: ['Seduction', 'Persuasion', 'Flattery'],
      teachable: true
    },
    'Command': {
      name: 'Command',
      category: 'social',
      specializations: ['Military', 'Naval', 'Inspirational'],
      teachable: true
    },
    'Gossip': {
      name: 'Gossip',
      category: 'social',
      specializations: ['Court', 'Street', 'Tavern', 'Guild'],
      teachable: true
    },
    'Haggle': {
      name: 'Haggle',
      category: 'social',
      specializations: ['Merchant', 'Black Market', 'Services'],
      teachable: true
    },
    'Intimidate': {
      name: 'Intimidate',
      category: 'social',
      specializations: ['Physical', 'Social', 'Psychological'],
      teachable: true
    },

    // Basic Skills
    'Animal Care': {
      name: 'Animal Care',
      category: 'basic',
      specializations: ['Horses', 'Dogs', 'Livestock', 'Exotic'],
      teachable: true
    },
    'Climb': {
      name: 'Climb',
      category: 'basic',
      specializations: ['Urban', 'Natural', 'Technical'],
      teachable: true
    },
    'Concealment': {
      name: 'Concealment',
      category: 'basic',
      specializations: ['Urban', 'Rural', 'Underground'],
      teachable: true
    },
    'Drive': {
      name: 'Drive',
      category: 'basic',
      specializations: ['Cart', 'Carriage', 'Wagon'],
      teachable: true
    },
    'Gamble': {
      name: 'Gamble',
      category: 'basic',
      specializations: ['Cards', 'Dice', 'Sports Betting'],
      teachable: true
    },
    'Outdoor Survival': {
      name: 'Outdoor Survival',
      category: 'basic',
      specializations: ['Forest', 'Mountain', 'Desert', 'Swamp'],
      teachable: true
    },
    'Perception': {
      name: 'Perception',
      category: 'basic',
      specializations: ['Search', 'Listen', 'Spot'],
      teachable: true
    },
    'Row': {
      name: 'Row',
      category: 'basic',
      specializations: ['River', 'Sea', 'Racing'],
      teachable: true
    },
    'Scale Sheer Surface': {
      name: 'Scale Sheer Surface',
      category: 'basic',
      specializations: ['Stone', 'Wood', 'Ice'],
      teachable: true
    },
    'Search': {
      name: 'Search',
      category: 'basic',
      specializations: ['Hidden Objects', 'Secret Doors', 'Traps'],
      teachable: true
    },
    'Silent Move': {
      name: 'Silent Move',
      category: 'basic',
      specializations: ['Urban', 'Rural', 'Indoor'],
      teachable: true
    },
    'Swim': {
      name: 'Swim',
      category: 'basic',
      specializations: ['River', 'Sea', 'Underwater'],
      teachable: true
    },

    // Advanced Skills
    'Evaluate': {
      name: 'Evaluate',
      category: 'advanced',
      specializations: ['Art', 'Gems', 'Weapons', 'Books'],
      teachable: true
    },
    'Heal': {
      name: 'Heal',
      category: 'advanced',
      specializations: ['Surgery', 'Herbalism', 'Battlefield'],
      teachable: true
    },
    'Hypnotism': {
      name: 'Hypnotism',
      category: 'advanced',
      specializations: ['Therapeutic', 'Interrogation', 'Entertainment'],
      teachable: true,
      prerequisites: ['Charm']
    },
    'Lock Picking': {
      name: 'Lock Picking',
      category: 'advanced',
      specializations: ['Simple', 'Complex', 'Magical'],
      teachable: true
    },
    'Navigation': {
      name: 'Navigation',
      category: 'advanced',
      specializations: ['Land', 'Sea', 'Underground'],
      teachable: true
    },
    'Pick Pocket': {
      name: 'Pick Pocket',
      category: 'advanced',
      specializations: ['Crowds', 'Distraction', 'Sleight of Hand'],
      teachable: true
    },
    'Prepare Poison': {
      name: 'Prepare Poison',
      category: 'advanced',
      specializations: ['Lethal', 'Sleep', 'Paralysis'],
      teachable: true,
      prerequisites: ['Trade (Apothecary)']
    },
    'Read/Write': {
      name: 'Read/Write',
      category: 'advanced',
      specializations: ['Reikspiel', 'Classical', 'Eltharin', 'Khazalid'],
      teachable: true
    },
    'Ride': {
      name: 'Ride',
      category: 'advanced',
      specializations: ['Horse', 'Pegasus', 'Griffon'],
      teachable: true
    },
    'Secret Language': {
      name: 'Secret Language',
      category: 'advanced',
      specializations: ['Thieves Cant', 'Guild Tongue', 'Battle Tongue'],
      teachable: true
    },
    'Set Trap': {
      name: 'Set Trap',
      category: 'advanced',
      specializations: ['Hunting', 'Security', 'Combat'],
      teachable: true
    },
    'Shadowing': {
      name: 'Shadowing',
      category: 'advanced',
      specializations: ['Urban', 'Crowd', 'Wilderness'],
      teachable: true,
      prerequisites: ['Concealment', 'Silent Move']
    },
    'Sleight of Hand': {
      name: 'Sleight of Hand',
      category: 'advanced',
      specializations: ['Palming', 'Card Tricks', 'Misdirection'],
      teachable: true
    },
    'Speak Language': {
      name: 'Speak Language',
      category: 'advanced',
      specializations: ['Bretonnian', 'Tilean', 'Estalian', 'Norse', 'Eltharin', 'Khazalid'],
      teachable: true
    },
    'Torture': {
      name: 'Torture',
      category: 'advanced',
      specializations: ['Physical', 'Psychological', 'Interrogation'],
      teachable: true
    },
    'Ventriloquism': {
      name: 'Ventriloquism',
      category: 'advanced',
      specializations: ['Entertainment', 'Deception', 'Distraction'],
      teachable: true
    }
  };

  static generateStartingSkills(race: CharacterRace, characterClass: CharacterClass): Map<string, CharacterSkill> {
    const skills = new Map<string, CharacterSkill>();
    
    // Add racial skills
    const racialSkills = this.getRacialSkills(race);
    racialSkills.forEach(skillName => {
      const skillDef = this.SKILL_DEFINITIONS[skillName];
      if (skillDef) {
        skills.set(skillName, {
          ...skillDef,
          level: 30 + Math.floor(Math.random() * 21), // 30-50
          experience: 0
        });
      }
    });

    // Add class skills
    const classSkills = this.getClassSkills(characterClass);
    classSkills.forEach(skillName => {
      const skillDef = this.SKILL_DEFINITIONS[skillName];
      if (skillDef) {
        const existingSkill = skills.get(skillName);
        if (existingSkill) {
          // Boost existing skill
          existingSkill.level += 10;
        } else {
          skills.set(skillName, {
            ...skillDef,
            level: 25 + Math.floor(Math.random() * 16), // 25-40
            experience: 0
          });
        }
      }
    });

    // Add some random basic skills
    const basicSkillNames = Object.keys(this.SKILL_DEFINITIONS).filter(
      name => this.SKILL_DEFINITIONS[name].category === 'basic'
    );
    
    const randomBasicCount = Math.floor(Math.random() * 4) + 2; // 2-5 random basic skills
    for (let i = 0; i < randomBasicCount; i++) {
      const randomSkill = basicSkillNames[Math.floor(Math.random() * basicSkillNames.length)];
      if (!skills.has(randomSkill)) {
        const skillDef = this.SKILL_DEFINITIONS[randomSkill];
        skills.set(randomSkill, {
          ...skillDef,
          level: 15 + Math.floor(Math.random() * 16), // 15-30
          experience: 0
        });
      }
    }

    return skills;
  }

  private static getRacialSkills(race: CharacterRace): string[] {
    const racialSkills: Record<CharacterRace, string[]> = {
      'Empire': ['Gossip', 'Haggle', 'Speak Language'],
      'Dwarf': ['Trade', 'Evaluate', 'Consume Alcohol'],
      'Elf': ['Perception', 'Magical Sense', 'Academic Knowledge'],
      'Halfling': ['Cook', 'Gossip', 'Outdoor Survival'],
      'Bretonnian': ['Animal Care', 'Ride', 'Command'],
      'Tilean': ['Haggle', 'Evaluate', 'Sleight of Hand'],
      'Norse': ['Outdoor Survival', 'Intimidate', 'Row']
    };

    return racialSkills[race] || [];
  }

  private static getClassSkills(characterClass: CharacterClass): string[] {
    const classSkills: Record<string, string[]> = {
      'Soldier': ['Weapon Skill', 'Dodge', 'Command', 'Intimidate'],
      'Scholar': ['Academic Knowledge', 'Research', 'Read/Write', 'Evaluate'],
      'Merchant': ['Haggle', 'Evaluate', 'Charm', 'Drive'],
      'Blacksmith': ['Trade', 'Craft', 'Evaluate', 'Heal'],
      'Ranger': ['Ballistic Skill', 'Outdoor Survival', 'Navigation', 'Track'],
      'Mage': ['Magical Sense', 'Academic Knowledge', 'Research', 'Channeling'],
      'Rogue': ['Silent Move', 'Concealment', 'Pick Pocket', 'Lock Picking'],
      'Innkeeper': ['Gossip', 'Haggle', 'Cook', 'Charm'],
      'Knight': ['Weapon Skill', 'Ride', 'Command', 'Animal Care'],
      'Priest': ['Academic Knowledge', 'Heal', 'Command', 'Read/Write']
    };

    return classSkills[characterClass] || [];
  }

  static improveSkill(skill: CharacterSkill, experienceGained: number): CharacterSkill {
    const newExperience = skill.experience + experienceGained;
    const experienceNeeded = skill.level * 2; // Simple progression formula
    
    if (newExperience >= experienceNeeded && skill.level < 100) {
      return {
        ...skill,
        level: skill.level + 1,
        experience: newExperience - experienceNeeded
      };
    }
    
    return {
      ...skill,
      experience: newExperience
    };
  }

  static canLearnSkill(skillName: string, currentSkills: Map<string, CharacterSkill>): boolean {
    const skillDef = this.SKILL_DEFINITIONS[skillName];
    if (!skillDef || !skillDef.teachable) return false;

    if (skillDef.prerequisites) {
      return skillDef.prerequisites.every(prereq => currentSkills.has(prereq));
    }

    return true;
  }

  static getSkillDefinition(skillName: string): Omit<CharacterSkill, 'level' | 'experience'> | undefined {
    return this.SKILL_DEFINITIONS[skillName];
  }

  static getAllSkillNames(): string[] {
    return Object.keys(this.SKILL_DEFINITIONS);
  }

  static getSkillsByCategory(category: CharacterSkill['category']): string[] {
    return Object.keys(this.SKILL_DEFINITIONS).filter(
      name => this.SKILL_DEFINITIONS[name].category === category
    );
  }
}
