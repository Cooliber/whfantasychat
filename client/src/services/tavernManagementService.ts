import type { 
  TavernInventoryItem, 
  TavernStaff, 
  TavernUpgrade, 
  TavernFinances,
  CustomerSatisfaction,
  TavernReputation,
  Region 
} from '../types/warhammer.types';

// Tavern Inventory Management
export class InventoryManager {
  private static readonly ITEM_TEMPLATES: Record<TavernInventoryItem['type'], Array<Omit<TavernInventoryItem, 'id' | 'quantity'>>> = {
    'food': [
      { name: 'Fresh Bread', type: 'food', cost: 2, quality: 'common', origin: 'Local Bakery', rarity: 2 },
      { name: 'Roasted Chicken', type: 'food', cost: 8, quality: 'good', origin: 'Local Farm', rarity: 3 },
      { name: 'Venison Steak', type: 'food', cost: 15, quality: 'excellent', origin: 'Forest Hunt', rarity: 6 },
      { name: 'Exotic Spices', type: 'food', cost: 25, quality: 'excellent', origin: 'Araby', effects: ['Enhanced Flavor', 'Increased Satisfaction'], rarity: 8 },
      { name: 'Dragon Pepper', type: 'food', cost: 50, quality: 'legendary', origin: 'Cathay', effects: ['Fire Resistance', 'Legendary Taste'], rarity: 10 }
    ],
    'drink': [
      { name: 'Common Ale', type: 'drink', cost: 3, quality: 'common', origin: 'Local Brewery', rarity: 1 },
      { name: 'Dwarf Ale', type: 'drink', cost: 8, quality: 'good', origin: 'Karak Kadrin', effects: ['Increased Stamina'], rarity: 4 },
      { name: 'Bretonnian Wine', type: 'drink', cost: 20, quality: 'excellent', origin: 'Bretonnia', effects: ['Refined Taste', 'Social Bonus'], rarity: 7 },
      { name: 'Elven Moonwine', type: 'drink', cost: 100, quality: 'legendary', origin: 'Ulthuan', effects: ['Magical Clarity', 'Enhanced Perception'], rarity: 9 },
      { name: 'Bugmans XXXXXX', type: 'drink', cost: 200, quality: 'legendary', origin: 'Bugmans Brewery', effects: ['Legendary Satisfaction', 'Dwarf Approval'], rarity: 10 }
    ],
    'supply': [
      { name: 'Firewood', type: 'supply', cost: 1, quality: 'common', origin: 'Local Forest', rarity: 1 },
      { name: 'Candles', type: 'supply', cost: 2, quality: 'common', origin: 'Local Chandler', rarity: 2 },
      { name: 'Quality Linens', type: 'supply', cost: 10, quality: 'good', origin: 'Marienburg', rarity: 4 },
      { name: 'Magical Lighting', type: 'supply', cost: 50, quality: 'excellent', origin: 'College of Light', effects: ['Never Dims', 'Warm Atmosphere'], rarity: 8 }
    ],
    'equipment': [
      { name: 'Basic Furniture', type: 'equipment', cost: 20, quality: 'common', origin: 'Local Carpenter', rarity: 2 },
      { name: 'Quality Tables', type: 'equipment', cost: 50, quality: 'good', origin: 'Master Craftsman', rarity: 4 },
      { name: 'Dwarven Ironwork', type: 'equipment', cost: 150, quality: 'excellent', origin: 'Dwarf Hold', effects: ['Durability', 'Prestige'], rarity: 7 },
      { name: 'Elven Artistry', type: 'equipment', cost: 300, quality: 'legendary', origin: 'Elf Enclave', effects: ['Beauty', 'Magical Aura'], rarity: 9 }
    ],
    'rare': [
      { name: 'Ancient Tome', type: 'rare', cost: 500, quality: 'legendary', origin: 'Forgotten Library', effects: ['Knowledge Bonus', 'Scholar Attraction'], rarity: 10 },
      { name: 'Blessed Relic', type: 'rare', cost: 1000, quality: 'legendary', origin: 'Temple of Sigmar', effects: ['Divine Protection', 'Pilgrim Attraction'], rarity: 10 },
      { name: 'Chaos Artifact', type: 'rare', cost: 2000, quality: 'legendary', origin: 'Unknown', effects: ['Dark Power', 'Dangerous Attraction'], rarity: 10 }
    ]
  };

  static generateRandomInventory(): Map<string, TavernInventoryItem> {
    const inventory = new Map<string, TavernInventoryItem>();
    
    // Add basic items
    Object.entries(this.ITEM_TEMPLATES).forEach(([type, templates]) => {
      const itemCount = type === 'rare' ? 1 : Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < itemCount; i++) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        const item: TavernInventoryItem = {
          ...template,
          id: `${type}-${Date.now()}-${i}`,
          quantity: Math.floor(Math.random() * 20) + 5
        };
        
        inventory.set(item.id, item);
      }
    });
    
    return inventory;
  }

  static calculateInventoryValue(inventory: Map<string, TavernInventoryItem>): number {
    return Array.from(inventory.values()).reduce((total, item) => {
      return total + (item.cost * item.quantity);
    }, 0);
  }

  static getItemsByType(inventory: Map<string, TavernInventoryItem>, type: TavernInventoryItem['type']): TavernInventoryItem[] {
    return Array.from(inventory.values()).filter(item => item.type === type);
  }

  static consumeItem(inventory: Map<string, TavernInventoryItem>, itemId: string, quantity: number): boolean {
    const item = inventory.get(itemId);
    if (!item || item.quantity < quantity) return false;
    
    item.quantity -= quantity;
    if (item.quantity <= 0) {
      inventory.delete(itemId);
    }
    
    return true;
  }

  static addItem(inventory: Map<string, TavernInventoryItem>, item: TavernInventoryItem): void {
    const existing = Array.from(inventory.values()).find(i => 
      i.name === item.name && i.quality === item.quality && i.origin === item.origin
    );
    
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      inventory.set(item.id, item);
    }
  }
}

// Staff Management
export class StaffManager {
  private static readonly STAFF_TEMPLATES: Record<TavernStaff['role'], Array<Omit<TavernStaff, 'id'>>> = {
    'bartender': [
      { name: 'Hans the Steady', role: 'bartender', skill: 7, wage: 15, loyalty: 8, backstory: 'Former soldier turned bartender', specialties: ['Ale Knowledge', 'Customer Relations'] },
      { name: 'Greta Goldhand', role: 'bartender', skill: 9, wage: 25, loyalty: 6, backstory: 'Merchant\'s daughter with business sense', specialties: ['Wine Expertise', 'Upselling'] }
    ],
    'cook': [
      { name: 'Old Martha', role: 'cook', skill: 8, wage: 20, loyalty: 9, backstory: 'Village cook with secret recipes', specialties: ['Hearty Meals', 'Local Cuisine'] },
      { name: 'Pierre the Fancy', role: 'cook', skill: 6, wage: 30, loyalty: 4, backstory: 'Bretonnian chef with attitude', specialties: ['Fine Dining', 'Exotic Dishes'] }
    ],
    'server': [
      { name: 'Quick Jenny', role: 'server', skill: 6, wage: 8, loyalty: 7, backstory: 'Local girl needing work', specialties: ['Speed', 'Memory'] },
      { name: 'Charming Tom', role: 'server', skill: 8, wage: 12, loyalty: 5, backstory: 'Former actor with silver tongue', specialties: ['Entertainment', 'Persuasion'] }
    ],
    'bouncer': [
      { name: 'Big Klaus', role: 'bouncer', skill: 9, wage: 18, loyalty: 8, backstory: 'Retired city guard', specialties: ['Intimidation', 'Crowd Control'] },
      { name: 'Silent Sven', role: 'bouncer', skill: 7, wage: 15, loyalty: 9, backstory: 'Mysterious warrior', specialties: ['Stealth', 'Non-lethal Takedowns'] }
    ],
    'entertainer': [
      { name: 'Melody the Minstrel', role: 'entertainer', skill: 8, wage: 20, loyalty: 6, backstory: 'Traveling musician', specialties: ['Songs', 'Stories'] },
      { name: 'Jester Jack', role: 'entertainer', skill: 6, wage: 15, loyalty: 7, backstory: 'Former court jester', specialties: ['Comedy', 'Acrobatics'] }
    ],
    'cleaner': [
      { name: 'Tidy Tilda', role: 'cleaner', skill: 7, wage: 6, loyalty: 9, backstory: 'Hardworking widow', specialties: ['Thoroughness', 'Discretion'] },
      { name: 'Young Pete', role: 'cleaner', skill: 4, wage: 4, loyalty: 8, backstory: 'Eager apprentice', specialties: ['Enthusiasm', 'Learning'] }
    ]
  };

  static generateRandomStaff(): Map<string, TavernStaff> {
    const staff = new Map<string, TavernStaff>();
    
    // Add one staff member of each type
    Object.entries(this.STAFF_TEMPLATES).forEach(([role, templates]) => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const staffMember: TavernStaff = {
        ...template,
        id: `${role}-${Date.now()}`
      };
      
      staff.set(staffMember.id, staffMember);
    });
    
    return staff;
  }

  static calculateDailyWages(staff: Map<string, TavernStaff>): number {
    return Array.from(staff.values()).reduce((total, member) => total + member.wage, 0);
  }

  static getStaffByRole(staff: Map<string, TavernStaff>, role: TavernStaff['role']): TavernStaff[] {
    return Array.from(staff.values()).filter(member => member.role === role);
  }

  static calculateStaffEfficiency(staff: Map<string, TavernStaff>): number {
    const totalSkill = Array.from(staff.values()).reduce((total, member) => total + member.skill, 0);
    const totalLoyalty = Array.from(staff.values()).reduce((total, member) => total + member.loyalty, 0);
    const staffCount = staff.size;
    
    if (staffCount === 0) return 0;
    
    return Math.round(((totalSkill + totalLoyalty) / (staffCount * 2)) * 10);
  }

  static improveStaffSkill(staff: TavernStaff, training: number): TavernStaff {
    return {
      ...staff,
      skill: Math.min(10, staff.skill + training),
      loyalty: Math.max(1, staff.loyalty + (training > 0 ? 1 : -1))
    };
  }
}

// Tavern Upgrades
export class UpgradeManager {
  private static readonly UPGRADE_TEMPLATES: TavernUpgrade[] = [
    {
      id: 'private-rooms',
      name: 'Private Rooms',
      description: 'Add private rooms for wealthy guests',
      cost: 500,
      type: 'room',
      effects: { customerSatisfaction: 15, income: 50, capacity: 10 },
      requirements: ['Basic Furniture'],
      installed: false
    },
    {
      id: 'quality-furniture',
      name: 'Quality Furniture',
      description: 'Replace basic furniture with quality pieces',
      cost: 200,
      type: 'furniture',
      effects: { customerSatisfaction: 10, reputation: 5 },
      installed: false
    },
    {
      id: 'entertainment-stage',
      name: 'Entertainment Stage',
      description: 'Build a stage for performers',
      cost: 300,
      type: 'entertainment',
      effects: { customerSatisfaction: 20, income: 30 },
      requirements: ['Entertainer Staff'],
      installed: false
    },
    {
      id: 'security-system',
      name: 'Security System',
      description: 'Install locks, guards, and safety measures',
      cost: 400,
      type: 'security',
      effects: { reputation: 10, customerSatisfaction: 5 },
      requirements: ['Bouncer Staff'],
      installed: false
    },
    {
      id: 'kitchen-upgrade',
      name: 'Kitchen Upgrade',
      description: 'Improve cooking facilities and equipment',
      cost: 350,
      type: 'service',
      effects: { customerSatisfaction: 15, income: 25 },
      requirements: ['Cook Staff'],
      installed: false
    }
  ];

  static getAvailableUpgrades(): TavernUpgrade[] {
    return this.UPGRADE_TEMPLATES.map(template => ({ ...template }));
  }

  static calculateUpgradeEffects(upgrades: Map<string, TavernUpgrade>): {
    customerSatisfaction: number;
    reputation: number;
    capacity: number;
    income: number;
  } {
    const effects = { customerSatisfaction: 0, reputation: 0, capacity: 0, income: 0 };
    
    Array.from(upgrades.values()).forEach(upgrade => {
      if (upgrade.installed) {
        effects.customerSatisfaction += upgrade.effects.customerSatisfaction || 0;
        effects.reputation += upgrade.effects.reputation || 0;
        effects.capacity += upgrade.effects.capacity || 0;
        effects.income += upgrade.effects.income || 0;
      }
    });
    
    return effects;
  }

  static canInstallUpgrade(upgrade: TavernUpgrade, installedUpgrades: Map<string, TavernUpgrade>, staff: Map<string, TavernStaff>): boolean {
    if (upgrade.installed) return false;
    
    if (upgrade.requirements) {
      return upgrade.requirements.every(requirement => {
        // Check if requirement is another upgrade
        const requiredUpgrade = Array.from(installedUpgrades.values()).find(u => u.name === requirement);
        if (requiredUpgrade) return requiredUpgrade.installed;
        
        // Check if requirement is staff
        if (requirement.includes('Staff')) {
          const role = requirement.replace(' Staff', '').toLowerCase() as TavernStaff['role'];
          return Array.from(staff.values()).some(s => s.role === role);
        }
        
        return true;
      });
    }
    
    return true;
  }
}

// Financial Management
export class FinancialManager {
  static initializeFinances(): TavernFinances {
    return {
      gold: 500, // Starting capital
      dailyIncome: 0,
      dailyExpenses: 0,
      weeklyProfit: 0,
      monthlyProfit: 0,
      debts: []
    };
  }

  static calculateDailyIncome(
    customerCount: number,
    averageSpending: number,
    upgradeBonus: number,
    staffEfficiency: number
  ): number {
    const baseIncome = customerCount * averageSpending;
    const efficiencyMultiplier = 1 + (staffEfficiency / 100);
    const upgradeMultiplier = 1 + (upgradeBonus / 100);

    return Math.round(baseIncome * efficiencyMultiplier * upgradeMultiplier);
  }

  static calculateDailyExpenses(
    staff: Map<string, TavernStaff>,
    inventory: Map<string, TavernInventoryItem>,
    upgrades: Map<string, TavernUpgrade>
  ): number {
    const staffWages = StaffManager.calculateDailyWages(staff);
    const supplyCosts = this.calculateSupplyCosts(inventory);
    const maintenanceCosts = this.calculateMaintenanceCosts(upgrades);

    return staffWages + supplyCosts + maintenanceCosts;
  }

  private static calculateSupplyCosts(inventory: Map<string, TavernInventoryItem>): number {
    // Estimate daily supply consumption costs
    const supplies = InventoryManager.getItemsByType(inventory, 'supply');
    return supplies.reduce((total, item) => total + (item.cost * 0.1), 0); // 10% of supply value per day
  }

  private static calculateMaintenanceCosts(upgrades: Map<string, TavernUpgrade>): number {
    // Calculate maintenance costs for installed upgrades
    return Array.from(upgrades.values())
      .filter(upgrade => upgrade.installed)
      .reduce((total, upgrade) => total + (upgrade.cost * 0.01), 0); // 1% of upgrade cost per day
  }

  static updateFinances(
    finances: TavernFinances,
    dailyIncome: number,
    dailyExpenses: number
  ): TavernFinances {
    const dailyProfit = dailyIncome - dailyExpenses;

    return {
      ...finances,
      gold: finances.gold + dailyProfit,
      dailyIncome,
      dailyExpenses,
      weeklyProfit: finances.weeklyProfit + dailyProfit,
      monthlyProfit: finances.monthlyProfit + dailyProfit
    };
  }

  static addDebt(
    finances: TavernFinances,
    creditor: string,
    amount: number,
    daysUntilDue: number,
    interestRate: number
  ): TavernFinances {
    const debt = {
      creditor,
      amount,
      dueDate: new Date(Date.now() + daysUntilDue * 24 * 60 * 60 * 1000),
      interest: interestRate
    };

    return {
      ...finances,
      debts: [...finances.debts, debt]
    };
  }

  static payDebt(finances: TavernFinances, debtIndex: number): TavernFinances {
    const debt = finances.debts[debtIndex];
    if (!debt || finances.gold < debt.amount) return finances;

    const newDebts = [...finances.debts];
    newDebts.splice(debtIndex, 1);

    return {
      ...finances,
      gold: finances.gold - debt.amount,
      debts: newDebts
    };
  }
}

// Customer Satisfaction Management
export class SatisfactionManager {
  static initializeSatisfaction(): CustomerSatisfaction {
    return {
      overall: 50,
      food: 50,
      drink: 50,
      service: 50,
      atmosphere: 50,
      entertainment: 50,
      cleanliness: 50
    };
  }

  static updateSatisfaction(
    satisfaction: CustomerSatisfaction,
    factors: {
      foodQuality?: number;
      drinkQuality?: number;
      serviceSpeed?: number;
      atmosphereRating?: number;
      entertainmentValue?: number;
      cleanlinessLevel?: number;
    }
  ): CustomerSatisfaction {
    const updated = { ...satisfaction };

    if (factors.foodQuality !== undefined) {
      updated.food = this.adjustSatisfaction(updated.food, factors.foodQuality);
    }
    if (factors.drinkQuality !== undefined) {
      updated.drink = this.adjustSatisfaction(updated.drink, factors.drinkQuality);
    }
    if (factors.serviceSpeed !== undefined) {
      updated.service = this.adjustSatisfaction(updated.service, factors.serviceSpeed);
    }
    if (factors.atmosphereRating !== undefined) {
      updated.atmosphere = this.adjustSatisfaction(updated.atmosphere, factors.atmosphereRating);
    }
    if (factors.entertainmentValue !== undefined) {
      updated.entertainment = this.adjustSatisfaction(updated.entertainment, factors.entertainmentValue);
    }
    if (factors.cleanlinessLevel !== undefined) {
      updated.cleanliness = this.adjustSatisfaction(updated.cleanliness, factors.cleanlinessLevel);
    }

    // Calculate overall satisfaction
    updated.overall = Math.round(
      (updated.food + updated.drink + updated.service +
       updated.atmosphere + updated.entertainment + updated.cleanliness) / 6
    );

    return updated;
  }

  private static adjustSatisfaction(current: number, change: number): number {
    return Math.max(0, Math.min(100, current + change));
  }

  static getSatisfactionLevel(score: number): string {
    if (score >= 90) return 'Exceptional';
    if (score >= 75) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 25) return 'Poor';
    return 'Terrible';
  }
}

// Reputation Management
export class TavernReputationManager {
  static initializeReputation(): TavernReputation {
    return {
      overall: 50,
      byRegion: {},
      byFaction: {},
      traits: ['New Establishment'],
      rumors: []
    };
  }

  static updateReputation(
    reputation: TavernReputation,
    change: number,
    region?: Region,
    faction?: string
  ): TavernReputation {
    const updated = { ...reputation };

    // Update overall reputation
    updated.overall = Math.max(0, Math.min(100, updated.overall + change));

    // Update regional reputation if specified
    if (region) {
      updated.byRegion = {
        ...updated.byRegion,
        [region]: Math.max(0, Math.min(100, (updated.byRegion[region] || 50) + change))
      };
    }

    // Update faction reputation if specified
    if (faction) {
      updated.byFaction = {
        ...updated.byFaction,
        [faction]: Math.max(0, Math.min(100, (updated.byFaction[faction] || 50) + change))
      };
    }

    return updated;
  }

  static addTrait(reputation: TavernReputation, trait: string): TavernReputation {
    if (reputation.traits.includes(trait)) return reputation;

    return {
      ...reputation,
      traits: [...reputation.traits, trait]
    };
  }

  static removeTrait(reputation: TavernReputation, trait: string): TavernReputation {
    return {
      ...reputation,
      traits: reputation.traits.filter(t => t !== trait)
    };
  }

  static addRumor(reputation: TavernReputation, rumor: string): TavernReputation {
    return {
      ...reputation,
      rumors: [...reputation.rumors, rumor]
    };
  }

  static getReputationLevel(score: number): string {
    if (score >= 90) return 'Legendary';
    if (score >= 75) return 'Renowned';
    if (score >= 60) return 'Well-Known';
    if (score >= 40) return 'Average';
    if (score >= 25) return 'Poor';
    return 'Notorious';
  }
}
