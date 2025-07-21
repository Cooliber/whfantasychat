import type { 
  QuestHook, 
  AdventureChain, 
  FactionMission,
  Region 
} from '../types/warhammer.types';

// Quest Generation and Management
export class QuestManager {
  private static readonly QUEST_TEMPLATES: Omit<QuestHook, 'id' | 'giver'>[] = [
    // Delivery Quests
    {
      title: 'Urgent Message Delivery',
      description: 'Deliver an important message to a contact in the next town before sunset.',
      type: 'delivery',
      difficulty: 'easy',
      reward: { gold: 25, reputation: 5 },
      requirements: { level: 1 },
      timeLimit: 1,
      consequences: {
        success: ['Reputation boost with sender', 'Potential future work'],
        failure: ['Loss of trust', 'Missed opportunity'],
        ignored: ['Message becomes irrelevant', 'Sender finds alternative']
      }
    },
    {
      title: 'Precious Cargo Transport',
      description: 'Safely transport valuable goods through dangerous territory.',
      type: 'delivery',
      difficulty: 'medium',
      reward: { gold: 100, items: ['Quality Weapon'], reputation: 10 },
      requirements: { level: 3, skills: ['Combat'] },
      timeLimit: 3,
      consequences: {
        success: ['Merchant guild favor', 'Access to rare goods'],
        failure: ['Financial loss', 'Damaged reputation'],
        ignored: ['Goods spoil or are stolen', 'Merchant seeks other couriers']
      }
    },

    // Escort Quests
    {
      title: 'Noble Escort',
      description: 'Escort a minor noble safely to their destination.',
      type: 'escort',
      difficulty: 'medium',
      reward: { gold: 75, reputation: 15 },
      requirements: { level: 2, reputation: 25 },
      timeLimit: 2,
      consequences: {
        success: ['Noble patronage', 'Court connections'],
        failure: ['Noble displeasure', 'Loss of social standing'],
        ignored: ['Noble travels alone', 'Potential danger to noble']
      }
    },
    {
      title: 'Merchant Caravan Guard',
      description: 'Protect a merchant caravan from bandits and monsters.',
      type: 'escort',
      difficulty: 'hard',
      reward: { gold: 150, items: ['Combat Equipment'], reputation: 20 },
      requirements: { level: 4, skills: ['Combat', 'Survival'] },
      timeLimit: 5,
      consequences: {
        success: ['Merchant guild membership', 'Trade route access'],
        failure: ['Caravan losses', 'Injured merchants'],
        ignored: ['Caravan attacked', 'Trade route disrupted']
      }
    },

    // Investigation Quests
    {
      title: 'Missing Person Investigation',
      description: 'Investigate the disappearance of a local citizen.',
      type: 'investigation',
      difficulty: 'medium',
      reward: { gold: 60, information: ['Local Secrets'], reputation: 10 },
      requirements: { level: 2, skills: ['Investigation'] },
      timeLimit: 7,
      consequences: {
        success: ['Family gratitude', 'Local hero status'],
        failure: ['Case goes cold', 'Family despair'],
        ignored: ['Trail goes cold', 'Other investigators take over']
      }
    },
    {
      title: 'Corruption Investigation',
      description: 'Investigate suspected corruption in local government.',
      type: 'investigation',
      difficulty: 'hard',
      reward: { gold: 200, reputation: 25, information: ['Political Secrets'] },
      requirements: { level: 5, skills: ['Investigation', 'Social'], reputation: 40 },
      timeLimit: 14,
      consequences: {
        success: ['Political reform', 'Powerful allies'],
        failure: ['Cover-up successful', 'Investigator targeted'],
        ignored: ['Corruption continues', 'Citizens suffer']
      }
    },

    // Combat Quests
    {
      title: 'Bandit Elimination',
      description: 'Clear out a bandit camp threatening local trade routes.',
      type: 'combat',
      difficulty: 'medium',
      reward: { gold: 80, items: ['Bandit Loot'], reputation: 15 },
      requirements: { level: 3, skills: ['Combat'] },
      timeLimit: 5,
      consequences: {
        success: ['Safe trade routes', 'Merchant gratitude'],
        failure: ['Bandits remain active', 'Trade disruption continues'],
        ignored: ['Bandit raids increase', 'Economic damage']
      }
    },
    {
      title: 'Monster Hunt',
      description: 'Hunt down a dangerous creature terrorizing the countryside.',
      type: 'combat',
      difficulty: 'hard',
      reward: { gold: 250, items: ['Monster Trophy', 'Rare Materials'], reputation: 30 },
      requirements: { level: 6, skills: ['Combat', 'Survival'] },
      timeLimit: 10,
      consequences: {
        success: ['Hero status', 'Monster expertise'],
        failure: ['Monster remains free', 'Continued terror'],
        ignored: ['Monster attacks increase', 'Area abandoned']
      }
    },

    // Diplomatic Quests
    {
      title: 'Peace Negotiation',
      description: 'Mediate a dispute between two feuding parties.',
      type: 'diplomatic',
      difficulty: 'medium',
      reward: { gold: 90, reputation: 20 },
      requirements: { level: 3, skills: ['Social', 'Negotiation'] },
      timeLimit: 7,
      consequences: {
        success: ['Lasting peace', 'Diplomatic reputation'],
        failure: ['Conflict escalates', 'Mediator blamed'],
        ignored: ['Violence erupts', 'Long-term feud']
      }
    },

    // Mystery Quests
    {
      title: 'Ancient Artifact Recovery',
      description: 'Locate and retrieve a lost artifact of historical significance.',
      type: 'mystery',
      difficulty: 'legendary',
      reward: { gold: 500, items: ['Ancient Artifact'], reputation: 50, information: ['Ancient Knowledge'] },
      requirements: { level: 8, skills: ['Investigation', 'Academic Knowledge'], reputation: 60 },
      timeLimit: 21,
      consequences: {
        success: ['Historical discovery', 'Scholar recognition'],
        failure: ['Artifact remains lost', 'Historical gap continues'],
        ignored: ['Others seek artifact', 'Opportunity lost']
      }
    }
  ];

  static generateRandomQuest(region: Region, tavernReputation: number): QuestHook {
    // Filter quests based on tavern reputation and region
    const availableQuests = this.QUEST_TEMPLATES.filter(quest => {
      const reputationReq = quest.requirements.reputation || 0;
      return tavernReputation >= reputationReq;
    });

    if (availableQuests.length === 0) {
      // Fallback to simplest quest
      availableQuests.push(this.QUEST_TEMPLATES[0]);
    }

    const template = availableQuests[Math.floor(Math.random() * availableQuests.length)];
    
    return {
      ...template,
      id: `quest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      giver: this.generateQuestGiver(template.type, region),
      location: this.generateQuestLocation(region)
    };
  }

  private static generateQuestGiver(questType: QuestHook['type'], region: Region): string {
    const giversByType: Record<QuestHook['type'], string[]> = {
      'delivery': ['Local Merchant', 'Town Clerk', 'Worried Parent', 'Guild Representative'],
      'escort': ['Noble Lady', 'Merchant Prince', 'Traveling Scholar', 'Diplomatic Envoy'],
      'investigation': ['Town Watch Captain', 'Concerned Citizen', 'Private Investigator', 'Magistrate'],
      'combat': ['Village Elder', 'Militia Captain', 'Bounty Hunter', 'Royal Guard'],
      'diplomatic': ['Local Lord', 'Guild Mediator', 'Peace Envoy', 'Tribal Chief'],
      'mystery': ['Ancient Scholar', 'Mysterious Stranger', 'Collector', 'Historical Society']
    };

    const givers = giversByType[questType];
    const baseGiver = givers[Math.floor(Math.random() * givers.length)];
    
    // Add regional flavor
    const regionalPrefixes: Record<Region, string[]> = {
      'Empire': ['Imperial', 'Reikland', 'Sigmarite'],
      'Bretonnia': ['Bretonnian', 'Chivalrous', 'Noble'],
      'Dwarf Holds': ['Dwarf', 'Clan', 'Master'],
      'Elf Enclaves': ['Elven', 'High', 'Ancient'],
      'Kislev': ['Kislevite', 'Ice', 'Bear'],
      'Tilea': ['Tilean', 'Merchant', 'Renaissance'],
      'Estalia': ['Estalian', 'Conquistador', 'Inquisition'],
      'Border Princes': ['Mercenary', 'Independent', 'Frontier'],
      'Norsca': ['Norse', 'Viking', 'Tribal']
    };

    const prefixes = regionalPrefixes[region] || ['Local'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    return `${prefix} ${baseGiver}`;
  }

  private static generateQuestLocation(region: Region): string {
    const locations: Record<Region, string[]> = {
      'Empire': ['Altdorf', 'Nuln', 'Middenheim', 'Talabheim', 'Reikland Village'],
      'Bretonnia': ['Couronne', 'Lyonesse', 'Bastonne', 'Bordeleaux', 'Grail Chapel'],
      'Dwarf Holds': ['Karaz-a-Karak', 'Zhufbar', 'Karak Kadrin', 'Barak Varr', 'Ancient Mine'],
      'Elf Enclaves': ['Athel Loren', 'Laurelorn Forest', 'Elven Outpost', 'Sacred Grove'],
      'Kislev': ['Kislev City', 'Praag', 'Erengrad', 'Ice Palace', 'Frozen Wasteland'],
      'Tilea': ['Miragliano', 'Remas', 'Verezzo', 'Merchant Quarter', 'Renaissance Palace'],
      'Estalia': ['Magritta', 'Bilbali', 'Cathedral City', 'Conquistador Fort'],
      'Border Princes': ['Mercenary Stronghold', 'Independent Settlement', 'Frontier Town'],
      'Norsca': ['Longhouse', 'Coastal Village', 'Warrior Camp', 'Sacred Site']
    };

    const regionLocations = locations[region] || ['Nearby Settlement'];
    return regionLocations[Math.floor(Math.random() * regionLocations.length)];
  }

  static calculateQuestDifficulty(quest: QuestHook, playerLevel: number, playerSkills: string[]): {
    successChance: number;
    riskLevel: number;
    recommendedPreparation: string[];
  } {
    let successChance = 50; // Base 50% chance
    let riskLevel = 5; // Base risk level

    // Adjust for player level
    const levelDiff = playerLevel - (quest.requirements.level || 1);
    successChance += levelDiff * 10;

    // Adjust for required skills
    if (quest.requirements.skills) {
      const hasRequiredSkills = quest.requirements.skills.every(skill => 
        playerSkills.includes(skill)
      );
      if (hasRequiredSkills) {
        successChance += 20;
      } else {
        successChance -= 30;
      }
    }

    // Adjust for quest difficulty
    const difficultyModifiers = {
      'easy': { success: 20, risk: -2 },
      'medium': { success: 0, risk: 0 },
      'hard': { success: -20, risk: 3 },
      'legendary': { success: -40, risk: 5 }
    };

    const modifier = difficultyModifiers[quest.difficulty];
    successChance += modifier.success;
    riskLevel += modifier.risk;

    // Clamp values
    successChance = Math.max(5, Math.min(95, successChance));
    riskLevel = Math.max(1, Math.min(10, riskLevel));

    // Generate preparation recommendations
    const recommendedPreparation = this.generatePreparationAdvice(quest, successChance);

    return { successChance, riskLevel, recommendedPreparation };
  }

  private static generatePreparationAdvice(quest: QuestHook, successChance: number): string[] {
    const advice = [];

    if (successChance < 30) {
      advice.push('Consider gaining more experience before attempting');
    }

    if (quest.requirements.skills) {
      quest.requirements.skills.forEach(skill => {
        advice.push(`Improve ${skill} skill`);
      });
    }

    switch (quest.type) {
      case 'combat':
        advice.push('Bring weapons and armor', 'Consider hiring backup');
        break;
      case 'investigation':
        advice.push('Gather information first', 'Bring investigation tools');
        break;
      case 'diplomatic':
        advice.push('Research the parties involved', 'Prepare negotiation strategies');
        break;
      case 'delivery':
        advice.push('Plan the safest route', 'Prepare for weather delays');
        break;
      case 'escort':
        advice.push('Scout the route ahead', 'Arrange for emergency supplies');
        break;
    }

    if (quest.timeLimit && quest.timeLimit <= 3) {
      advice.push('Time is critical - act quickly');
    }

    return advice.slice(0, 4); // Limit to 4 pieces of advice
  }

  static completeQuest(quest: QuestHook, success: boolean): {
    rewards: QuestHook['reward'];
    consequences: string[];
    experience: number;
  } {
    const consequences = success ? quest.consequences.success : quest.consequences.failure;
    const experience = this.calculateExperience(quest, success);
    
    return {
      rewards: success ? quest.reward : { gold: 0 },
      consequences,
      experience
    };
  }

  private static calculateExperience(quest: QuestHook, success: boolean): number {
    const baseExp = {
      'easy': 25,
      'medium': 50,
      'hard': 100,
      'legendary': 200
    };

    let experience = baseExp[quest.difficulty];
    
    if (!success) {
      experience = Math.floor(experience * 0.3); // 30% exp for failure
    }

    return experience;
  }
}

// Adventure Chain Manager
export class AdventureChainManager {
  private static readonly ADVENTURE_CHAINS: Omit<AdventureChain, 'id' | 'currentStep' | 'completed'>[] = [
    {
      name: 'The Lost Heir',
      description: 'A multi-part adventure involving the search for a missing noble heir',
      quests: ['find-clues', 'investigate-kidnapping', 'rescue-heir', 'expose-conspiracy'],
      overallReward: {
        gold: 1000,
        items: ['Noble Patronage', 'Hereditary Weapon', 'Land Grant'],
        reputation: 100,
        unlocks: ['Noble Court Access', 'Political Influence', 'Royal Connections']
      }
    },
    {
      name: 'The Chaos Cult',
      description: 'Uncover and destroy a dangerous Chaos cult operating in the region',
      quests: ['strange-disappearances', 'cult-investigation', 'infiltrate-cult', 'final-confrontation'],
      overallReward: {
        gold: 800,
        items: ['Blessed Weapon', 'Chaos Ward', 'Witch Hunter Badge'],
        reputation: 150,
        unlocks: ['Witch Hunter Contacts', 'Chaos Knowledge', 'Temple Favor']
      }
    },
    {
      name: 'The Ancient Treasure',
      description: 'Follow ancient clues to discover a legendary treasure hoard',
      quests: ['decipher-map', 'gather-artifacts', 'navigate-dungeon', 'claim-treasure'],
      overallReward: {
        gold: 2000,
        items: ['Ancient Artifacts', 'Magical Items', 'Historical Documents'],
        reputation: 75,
        unlocks: ['Scholar Recognition', 'Museum Connections', 'Archaeological Expertise']
      }
    },
    {
      name: 'The Trade War',
      description: 'Navigate the complex politics of a trade war between merchant guilds',
      quests: ['gather-intelligence', 'diplomatic-mission', 'sabotage-operation', 'peace-negotiation'],
      overallReward: {
        gold: 1200,
        items: ['Guild Membership', 'Trade Licenses', 'Merchant Contacts'],
        reputation: 80,
        unlocks: ['Guild Leadership', 'Trade Route Control', 'Economic Influence']
      }
    }
  ];

  static generateAdventureChain(): AdventureChain {
    const template = this.ADVENTURE_CHAINS[Math.floor(Math.random() * this.ADVENTURE_CHAINS.length)];

    return {
      ...template,
      id: `chain-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      currentStep: 0,
      completed: false
    };
  }

  static advanceChain(chain: AdventureChain): AdventureChain {
    if (chain.currentStep < chain.quests.length - 1) {
      return {
        ...chain,
        currentStep: chain.currentStep + 1
      };
    } else {
      return {
        ...chain,
        completed: true
      };
    }
  }

  static getCurrentQuest(chain: AdventureChain): string | null {
    if (chain.completed || chain.currentStep >= chain.quests.length) {
      return null;
    }
    return chain.quests[chain.currentStep];
  }

  static getChainProgress(chain: AdventureChain): {
    current: number;
    total: number;
    percentage: number;
  } {
    return {
      current: chain.currentStep + (chain.completed ? 1 : 0),
      total: chain.quests.length,
      percentage: Math.round(((chain.currentStep + (chain.completed ? 1 : 0)) / chain.quests.length) * 100)
    };
  }
}

// Faction Mission Manager
export class FactionMissionManager {
  private static readonly FACTION_MISSIONS: Omit<FactionMission, 'id'>[] = [
    // Empire Missions
    {
      faction: 'Empire',
      title: 'Imperial Intelligence',
      description: 'Gather intelligence on enemy troop movements near the border',
      secretLevel: 'confidential',
      reward: { gold: 200, factionStanding: 25 },
      risks: ['Discovery by enemy agents', 'Diplomatic incident'],
      timeLimit: 14,
      requirements: { factionStanding: 30, skills: ['Stealth', 'Investigation'] }
    },
    {
      faction: 'Empire',
      title: 'Chaos Cult Infiltration',
      description: 'Infiltrate a suspected Chaos cult and report their activities',
      secretLevel: 'secret',
      reward: { gold: 500, factionStanding: 50, specialPrivileges: ['Witch Hunter Support'] },
      risks: ['Corruption exposure', 'Death if discovered', 'Soul corruption'],
      timeLimit: 21,
      requirements: { factionStanding: 50, discretion: true }
    },

    // Dwarf Missions
    {
      faction: 'Dwarf Holds',
      title: 'Grudge Settlement',
      description: 'Help settle an ancient grudge between two dwarf clans',
      secretLevel: 'public',
      reward: { gold: 300, factionStanding: 40 },
      risks: ['Clan warfare escalation', 'Personal vendetta'],
      timeLimit: 30,
      requirements: { factionStanding: 40, skills: ['Negotiation'] }
    },
    {
      faction: 'Dwarf Holds',
      title: 'Skaven Tunnel Investigation',
      description: 'Investigate reports of Skaven tunnels near the hold',
      secretLevel: 'confidential',
      reward: { gold: 400, factionStanding: 35, specialPrivileges: ['Underground Maps'] },
      risks: ['Skaven ambush', 'Tunnel collapse', 'Disease exposure'],
      timeLimit: 10,
      requirements: { factionStanding: 25, skills: ['Combat', 'Survival'] }
    },

    // Elf Missions
    {
      faction: 'Elf Enclaves',
      title: 'Ancient Artifact Recovery',
      description: 'Retrieve a stolen elven artifact from human thieves',
      secretLevel: 'secret',
      reward: { gold: 600, factionStanding: 60, specialPrivileges: ['Elven Magic Knowledge'] },
      risks: ['Magical backlash', 'Diplomatic incident', 'Artifact corruption'],
      timeLimit: 7,
      requirements: { factionStanding: 60, skills: ['Stealth', 'Magic'] }
    },

    // Bretonnian Missions
    {
      faction: 'Bretonnia',
      title: 'Chivalric Quest',
      description: 'Undertake a quest to prove your chivalric virtues',
      secretLevel: 'public',
      reward: { gold: 250, factionStanding: 45, specialPrivileges: ['Knightly Recognition'] },
      risks: ['Failure of honor', 'Dangerous quest conditions'],
      timeLimit: 21,
      requirements: { factionStanding: 35, skills: ['Combat', 'Honor'] }
    },

    // Merchant Guild Missions
    {
      faction: 'Merchant Guilds',
      title: 'Trade Route Protection',
      description: 'Establish security for a new trade route through dangerous territory',
      secretLevel: 'confidential',
      reward: { gold: 350, factionStanding: 30, specialPrivileges: ['Trade Discounts'] },
      risks: ['Bandit attacks', 'Route failure', 'Economic loss'],
      timeLimit: 14,
      requirements: { factionStanding: 20, skills: ['Combat', 'Leadership'] }
    },
    {
      faction: 'Merchant Guilds',
      title: 'Corporate Espionage',
      description: 'Gather intelligence on a rival merchant house\'s operations',
      secretLevel: 'top_secret',
      reward: { gold: 800, factionStanding: 40, specialPrivileges: ['Market Intelligence'] },
      risks: ['Discovery and scandal', 'Legal prosecution', 'Guild war'],
      timeLimit: 28,
      requirements: { factionStanding: 50, discretion: true, skills: ['Stealth', 'Social'] }
    }
  ];

  static getAvailableMissions(faction: string, factionStanding: number): FactionMission[] {
    return this.FACTION_MISSIONS
      .filter(mission => mission.faction === faction)
      .filter(mission => factionStanding >= mission.requirements.factionStanding)
      .map(template => ({
        ...template,
        id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
  }

  static calculateMissionRisk(mission: FactionMission, playerSkills: string[]): {
    riskLevel: number;
    successChance: number;
    consequences: string[];
  } {
    let riskLevel = 5; // Base risk
    let successChance = 60; // Base success chance

    // Adjust for secret level
    const secretLevelRisk = {
      'public': 0,
      'confidential': 2,
      'secret': 4,
      'top_secret': 6
    };
    riskLevel += secretLevelRisk[mission.secretLevel];

    // Adjust for required skills
    if (mission.requirements.skills) {
      const hasRequiredSkills = mission.requirements.skills.every(skill =>
        playerSkills.includes(skill)
      );
      if (hasRequiredSkills) {
        successChance += 25;
        riskLevel -= 2;
      } else {
        successChance -= 30;
        riskLevel += 3;
      }
    }

    // Discretion requirement increases risk
    if (mission.requirements.discretion) {
      riskLevel += 2;
      successChance -= 10;
    }

    // Clamp values
    riskLevel = Math.max(1, Math.min(10, riskLevel));
    successChance = Math.max(10, Math.min(90, successChance));

    return {
      riskLevel,
      successChance,
      consequences: mission.risks
    };
  }

  static completeMission(mission: FactionMission, success: boolean): {
    rewards: FactionMission['reward'];
    consequences: string[];
    standingChange: number;
  } {
    const standingChange = success ? mission.reward.factionStanding : -Math.floor(mission.reward.factionStanding / 2);

    const consequences = success
      ? [`Mission completed successfully`, `Gained favor with ${mission.faction}`]
      : [`Mission failed`, `Lost standing with ${mission.faction}`, ...mission.risks.slice(0, 2)];

    return {
      rewards: success ? mission.reward : { gold: 0, factionStanding: standingChange },
      consequences,
      standingChange
    };
  }
}

// Mysterious Stranger Encounter Manager
export class MysteriousStrangerManager {
  private static readonly STRANGER_ENCOUNTERS = [
    {
      name: 'The Hooded Figure',
      description: 'A mysterious figure in a dark hood approaches with an unusual request',
      offers: [
        { type: 'information', content: 'Secret knowledge about local politics', price: 50 },
        { type: 'item', content: 'Strange magical trinket', price: 100 },
        { type: 'quest', content: 'Cryptic mission with unknown rewards', price: 0 }
      ],
      risks: ['Information may be false', 'Item may be cursed', 'Quest may be dangerous'],
      trustworthiness: 0.6
    },
    {
      name: 'The Ancient Scholar',
      description: 'An elderly scholar with vast knowledge seeks assistance',
      offers: [
        { type: 'knowledge', content: 'Ancient historical secrets', price: 75 },
        { type: 'training', content: 'Skill improvement opportunity', price: 150 },
        { type: 'artifact', content: 'Ancient relic of power', price: 300 }
      ],
      risks: ['Knowledge may be forbidden', 'Training may be dangerous', 'Artifact may attract attention'],
      trustworthiness: 0.8
    },
    {
      name: 'The Traveling Merchant',
      description: 'A well-dressed merchant offers rare and exotic goods',
      offers: [
        { type: 'rare_item', content: 'Exotic weapon from distant lands', price: 200 },
        { type: 'rare_item', content: 'Magical potion of unknown effects', price: 120 },
        { type: 'service', content: 'Access to exclusive trade network', price: 250 }
      ],
      risks: ['Items may be stolen', 'Potions may have side effects', 'Network may be illegal'],
      trustworthiness: 0.7
    },
    {
      name: 'The Desperate Noble',
      description: 'A noble in disguise seeks help with a personal matter',
      offers: [
        { type: 'reward', content: 'Generous payment for discretion', price: 0 },
        { type: 'favor', content: 'Future political favor', price: 0 },
        { type: 'connection', content: 'Introduction to high society', price: 0 }
      ],
      risks: ['Political entanglement', 'Scandal involvement', 'Noble revenge if failed'],
      trustworthiness: 0.5
    }
  ];

  static generateRandomEncounter(): {
    stranger: typeof this.STRANGER_ENCOUNTERS[0];
    availableOffers: typeof this.STRANGER_ENCOUNTERS[0]['offers'];
  } {
    const stranger = this.STRANGER_ENCOUNTERS[Math.floor(Math.random() * this.STRANGER_ENCOUNTERS.length)];

    // Randomly select 1-3 offers
    const offerCount = Math.floor(Math.random() * 3) + 1;
    const availableOffers = stranger.offers
      .sort(() => 0.5 - Math.random())
      .slice(0, offerCount);

    return { stranger, availableOffers };
  }

  static evaluateOffer(stranger: any, offer: any, playerGold: number): {
    canAfford: boolean;
    riskAssessment: string;
    recommendation: string;
  } {
    const canAfford = playerGold >= offer.price;

    let riskAssessment = 'Low Risk';
    if (stranger.trustworthiness < 0.4) riskAssessment = 'High Risk';
    else if (stranger.trustworthiness < 0.7) riskAssessment = 'Medium Risk';

    let recommendation = 'Consider carefully';
    if (stranger.trustworthiness > 0.8 && canAfford) recommendation = 'Likely worthwhile';
    if (stranger.trustworthiness < 0.4) recommendation = 'Proceed with extreme caution';
    if (!canAfford) recommendation = 'Cannot afford - seek other opportunities';

    return { canAfford, riskAssessment, recommendation };
  }
}
