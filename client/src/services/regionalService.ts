import type { Region, RegionalStyle, CulturalEvent } from '../types/warhammer.types';

// Regional Styles and Cultural Systems
export class RegionalStyleManager {
  private static readonly REGIONAL_STYLES: Record<Region, RegionalStyle> = {
    'Empire': {
      region: 'Empire',
      architecture: 'Imperial Gothic with timber framing and stone foundations',
      foodSpecialties: [
        'Reikland Sausages', 'Sauerkraut', 'Black Bread', 'Roasted Pork',
        'Middenland Cheese', 'Pickled Vegetables', 'Hearty Stews'
      ],
      drinkSpecialties: [
        'Empire Ale', 'Reikland Wine', 'Schnapps', 'Mulled Wine',
        'Bugmans Ale', 'Ostland Beer', 'Stirland Cider'
      ],
      decorations: [
        'Imperial Eagles', 'Heraldic Banners', 'Crossed Hammers',
        'Religious Icons', 'Provincial Coats of Arms', 'Hunting Trophies'
      ],
      music: [
        'Folk Songs', 'Military Marches', 'Drinking Songs',
        'Religious Hymns', 'Harvest Songs', 'Tavern Ballads'
      ],
      customs: [
        'Toasting the Emperor', 'Evening Prayers to Sigmar',
        'Sharing News from the Road', 'Respecting Veterans',
        'Hospitality to Travelers', 'Guild Solidarity'
      ],
      festivals: [
        {
          name: 'Sigmartag',
          date: 'Spring Equinox',
          description: 'Celebration of Sigmar\'s ascension to godhood',
          effects: ['Increased Pilgrims', 'Religious Ceremonies', 'Charity Events']
        },
        {
          name: 'Geheimnistag',
          date: 'New Year\'s Eve',
          description: 'Night of Mysteries when the veil is thin',
          effects: ['Supernatural Events', 'Fortune Telling', 'Protective Rituals']
        },
        {
          name: 'Harvest Festival',
          date: 'Autumn',
          description: 'Celebration of the year\'s harvest',
          effects: ['Abundant Food', 'Lower Prices', 'Rural Visitors']
        }
      ]
    },
    'Bretonnia': {
      region: 'Bretonnia',
      architecture: 'Gothic stone castles with soaring spires and stained glass',
      foodSpecialties: [
        'Roasted Fowl', 'Fine Pastries', 'Aged Cheeses', 'Delicate Soups',
        'Courtly Confections', 'Herb-crusted Lamb', 'Noble Game'
      ],
      drinkSpecialties: [
        'Bretonnian Wine', 'Champagne', 'Brandy', 'Mead',
        'Couronne Vintage', 'Noble Spirits', 'Blessed Water'
      ],
      decorations: [
        'Fleur-de-Lys', 'Chivalric Tapestries', 'Noble Portraits',
        'Grail Symbols', 'Heraldic Shields', 'Religious Relics'
      ],
      music: [
        'Courtly Ballads', 'Chivalric Epics', 'Troubadour Songs',
        'Sacred Hymns', 'Noble Dances', 'Romantic Serenades'
      ],
      customs: [
        'Chivalric Honor', 'Courtly Etiquette', 'Noble Deference',
        'Protection of the Innocent', 'Questing Traditions', 'Lady\'s Blessing'
      ],
      festivals: [
        {
          name: 'Grail Day',
          date: 'Midsummer',
          description: 'Celebration of the Lady of the Lake',
          effects: ['Questing Knights', 'Religious Pilgrims', 'Noble Ceremonies']
        },
        {
          name: 'Tournament Season',
          date: 'Spring',
          description: 'Season of knightly tournaments and contests',
          effects: ['Knight Visitors', 'Increased Prestige', 'Combat Displays']
        }
      ]
    },
    'Kislev': {
      region: 'Kislev',
      architecture: 'Onion-domed buildings with thick walls and small windows',
      foodSpecialties: [
        'Borscht', 'Cabbage Rolls', 'Smoked Fish', 'Dark Bread',
        'Pickled Everything', 'Hearty Porridge', 'Bear Meat'
      ],
      drinkSpecialties: [
        'Vodka', 'Kvas', 'Strong Beer', 'Honey Mead',
        'Ice Wine', 'Fermented Mare\'s Milk', 'Warming Spirits'
      ],
      decorations: [
        'Bear Pelts', 'Ice Sculptures', 'Orthodox Icons',
        'Winged Lancer Banners', 'Frost Patterns', 'Tribal Totems'
      ],
      music: [
        'Folk Dances', 'War Chants', 'Melancholy Ballads',
        'Drinking Songs', 'Religious Chants', 'Tribal Rhythms'
      ],
      customs: [
        'Hospitality in Winter', 'Respect for Elders', 'Ancestor Veneration',
        'Sharing Warmth', 'Storytelling Traditions', 'Bear Cult Rituals'
      ],
      festivals: [
        {
          name: 'Winter\'s End',
          date: 'Late Winter',
          description: 'Celebration of surviving another harsh winter',
          effects: ['Community Bonding', 'Shared Resources', 'Spring Preparation']
        }
      ]
    },
    'Tilea': {
      region: 'Tilea',
      architecture: 'Renaissance palazzos with marble columns and frescoes',
      foodSpecialties: [
        'Pasta', 'Olive Oil Dishes', 'Fresh Seafood', 'Wine Sauces',
        'Artisan Breads', 'Aged Cheeses', 'Exotic Spices'
      ],
      drinkSpecialties: [
        'Tilean Wine', 'Grappa', 'Limoncello', 'Espresso',
        'Vintage Reds', 'Sparkling Whites', 'Herbal Liqueurs'
      ],
      decorations: [
        'Renaissance Art', 'Merchant Banners', 'City-State Emblems',
        'Classical Sculptures', 'Silk Tapestries', 'Gold Ornaments'
      ],
      music: [
        'Opera', 'Classical Compositions', 'Merchant Songs',
        'Love Ballads', 'City Anthems', 'Artistic Performances'
      ],
      customs: [
        'Artistic Appreciation', 'Merchant Networking', 'City Pride',
        'Cultural Refinement', 'Competitive Commerce', 'Patron Support'
      ],
      festivals: [
        {
          name: 'Merchant\'s Fair',
          date: 'Summer',
          description: 'Grand trading festival with exotic goods',
          effects: ['Rare Items', 'Price Fluctuations', 'Cultural Exchange']
        }
      ]
    },
    'Estalia': {
      region: 'Estalia',
      architecture: 'Moorish influences with courtyards and intricate tilework',
      foodSpecialties: [
        'Paella', 'Tapas', 'Spiced Meats', 'Citrus Fruits',
        'Seafood Stews', 'Saffron Dishes', 'Honey Pastries'
      ],
      drinkSpecialties: [
        'Sherry', 'Sangria', 'Strong Coffee', 'Fruit Wines',
        'Brandy', 'Herbal Teas', 'Spiced Spirits'
      ],
      decorations: [
        'Moorish Patterns', 'Religious Icons', 'Conquistador Banners',
        'Ceramic Tiles', 'Wrought Iron', 'Colorful Fabrics'
      ],
      music: [
        'Flamenco', 'Guitar Music', 'Religious Chants',
        'Folk Dances', 'Passionate Ballads', 'Festive Rhythms'
      ],
      customs: [
        'Religious Devotion', 'Family Honor', 'Passionate Expression',
        'Hospitality', 'Siesta Tradition', 'Celebration of Life'
      ],
      festivals: [
        {
          name: 'Day of the Dead',
          date: 'Autumn',
          description: 'Remembrance of ancestors and departed souls',
          effects: ['Spiritual Activities', 'Family Gatherings', 'Memorial Services']
        }
      ]
    },
    'Dwarf Holds': {
      region: 'Dwarf Holds',
      architecture: 'Massive stone halls carved into mountains with intricate stonework',
      foodSpecialties: [
        'Roasted Meats', 'Mushroom Dishes', 'Stone Bread', 'Preserved Foods',
        'Underground Fungi', 'Salted Fish', 'Hearty Broths'
      ],
      drinkSpecialties: [
        'Dwarf Ale', 'Strong Beer', 'Fermented Mushroom Brew',
        'Stone Spirits', 'Aged Whiskey', 'Clan Ales', 'Ceremonial Mead'
      ],
      decorations: [
        'Clan Banners', 'Runic Inscriptions', 'Ancestral Portraits',
        'Weapon Displays', 'Gem Inlays', 'Stone Carvings', 'Gold Ornaments'
      ],
      music: [
        'Clan Songs', 'Work Chants', 'Drinking Ballads',
        'Ancestral Hymns', 'Forge Rhythms', 'Battle Songs'
      ],
      customs: [
        'Clan Honor', 'Grudge Keeping', 'Craft Excellence',
        'Ancestor Respect', 'Oath Binding', 'Hospitality to Guests'
      ],
      festivals: [
        {
          name: 'Ancestor Day',
          date: 'Winter Solstice',
          description: 'Honoring the ancestors and clan history',
          effects: ['Clan Gatherings', 'Story Telling', 'Ritual Drinking']
        },
        {
          name: 'Forge Festival',
          date: 'Spring',
          description: 'Celebration of craftsmanship and creation',
          effects: ['Craft Competitions', 'Master Demonstrations', 'Trade Opportunities']
        }
      ]
    },
    'Elf Enclaves': {
      region: 'Elf Enclaves',
      architecture: 'Elegant spires and organic curves blending with nature',
      foodSpecialties: [
        'Delicate Pastries', 'Exotic Fruits', 'Herbal Preparations',
        'Refined Cuisine', 'Magical Infusions', 'Ancient Recipes', 'Natural Harmony'
      ],
      drinkSpecialties: [
        'Elven Wine', 'Moonwine', 'Herbal Teas', 'Magical Elixirs',
        'Starlight Mead', 'Ancient Vintages', 'Mystical Brews'
      ],
      decorations: [
        'Living Art', 'Crystal Formations', 'Flowing Fabrics',
        'Natural Elements', 'Magical Lights', 'Ancient Symbols', 'Artistic Masterpieces'
      ],
      music: [
        'Ethereal Melodies', 'Ancient Songs', 'Nature Harmonies',
        'Magical Compositions', 'Timeless Ballads', 'Mystical Chants'
      ],
      customs: [
        'Artistic Perfection', 'Natural Harmony', 'Ancient Wisdom',
        'Magical Respect', 'Timeless Patience', 'Elegant Discourse'
      ],
      festivals: [
        {
          name: 'Starlight Festival',
          date: 'Summer Solstice',
          description: 'Celebration of magic and natural beauty',
          effects: ['Magical Displays', 'Artistic Performances', 'Mystical Experiences']
        }
      ]
    },
    'Border Princes': {
      region: 'Border Princes',
      architecture: 'Eclectic mix of styles from various cultures and periods',
      foodSpecialties: [
        'Mixed Cuisine', 'Survival Rations', 'Foraged Foods',
        'Mercenary Meals', 'Frontier Cooking', 'Improvised Dishes'
      ],
      drinkSpecialties: [
        'Rough Spirits', 'Mixed Ales', 'Frontier Brew',
        'Smuggled Goods', 'Local Moonshine', 'Mercenary Grog'
      ],
      decorations: [
        'Mercenary Banners', 'Trophies of War', 'Mixed Heraldry',
        'Frontier Artifacts', 'Survival Gear', 'Cultural Mixing'
      ],
      music: [
        'Mercenary Songs', 'Frontier Ballads', 'Mixed Traditions',
        'Survival Chants', 'Freedom Songs', 'Rebel Anthems'
      ],
      customs: [
        'Self-Reliance', 'Mercenary Code', 'Frontier Justice',
        'Cultural Tolerance', 'Survival First', 'Freedom Above All'
      ],
      festivals: [
        {
          name: 'Freedom Day',
          date: 'Variable',
          description: 'Celebration of independence and self-determination',
          effects: ['Mercenary Gatherings', 'Trade Opportunities', 'Cultural Exchange']
        }
      ]
    },
    'Norsca': {
      region: 'Norsca',
      architecture: 'Longhouses and stone halls built to withstand harsh weather',
      foodSpecialties: [
        'Smoked Fish', 'Seal Meat', 'Fermented Shark', 'Hardy Vegetables',
        'Preserved Meats', 'Sea Salt', 'Survival Foods'
      ],
      drinkSpecialties: [
        'Mead', 'Strong Ale', 'Fermented Fish Brew', 'Warming Spirits',
        'Ice Wine', 'Ritual Drinks', 'Battle Brew'
      ],
      decorations: [
        'Runic Carvings', 'Animal Pelts', 'Weapon Racks',
        'Tribal Totems', 'Sea Trophies', 'Warrior Honors'
      ],
      music: [
        'War Chants', 'Sea Shanties', 'Tribal Drums',
        'Battle Songs', 'Ancestor Calls', 'Storm Rhythms'
      ],
      customs: [
        'Warrior Honor', 'Tribal Loyalty', 'Strength Respect',
        'Sea Traditions', 'Ancestor Worship', 'Battle Glory'
      ],
      festivals: [
        {
          name: 'Storm Season',
          date: 'Winter',
          description: 'Celebration of surviving the harsh winter storms',
          effects: ['Warrior Gatherings', 'Strength Contests', 'Tribal Bonding']
        }
      ]
    }
  };

  static getRegionalStyle(region: Region): RegionalStyle {
    return this.REGIONAL_STYLES[region];
  }

  static getAllRegions(): Region[] {
    return Object.keys(this.REGIONAL_STYLES) as Region[];
  }

  static getRegionalFoodMenu(region: Region): Array<{ name: string; price: number; description: string }> {
    const style = this.REGIONAL_STYLES[region];
    return style.foodSpecialties.map(food => ({
      name: food,
      price: Math.floor(Math.random() * 20) + 5, // 5-25 gold
      description: `Traditional ${region} cuisine featuring ${food.toLowerCase()}`
    }));
  }

  static getRegionalDrinkMenu(region: Region): Array<{ name: string; price: number; description: string }> {
    const style = this.REGIONAL_STYLES[region];
    return style.drinkSpecialties.map(drink => ({
      name: drink,
      price: Math.floor(Math.random() * 15) + 3, // 3-18 gold
      description: `Authentic ${region} beverage - ${drink.toLowerCase()}`
    }));
  }

  static generateCulturalConflict(region1: Region, region2: Region): string {
    const conflicts = [
      `Tension between ${region1} and ${region2} over trade routes`,
      `Cultural misunderstanding between ${region1} customs and ${region2} traditions`,
      `Historical grievances between ${region1} and ${region2} resurface`,
      `Religious differences cause friction between ${region1} and ${region2} visitors`,
      `Economic competition creates rivalry between ${region1} and ${region2} merchants`
    ];
    
    return conflicts[Math.floor(Math.random() * conflicts.length)];
  }
}

// Cultural Events Manager
export class CulturalEventManager {
  private static readonly EVENT_TEMPLATES: CulturalEvent[] = [
    {
      id: 'empire-harvest-festival',
      name: 'Empire Harvest Festival',
      region: 'Empire',
      type: 'festival',
      duration: 3,
      effects: {
        customerFlow: 50,
        priceModifier: 0.8,
        specialRequests: ['Harvest Foods', 'Seasonal Ales', 'Folk Music'],
        atmosphere: 'Festive and Abundant'
      },
      requirements: ['Autumn Season']
    },
    {
      id: 'bretonnian-tournament',
      name: 'Bretonnian Tournament',
      region: 'Bretonnia',
      type: 'ceremony',
      duration: 5,
      effects: {
        customerFlow: 75,
        priceModifier: 1.5,
        specialRequests: ['Fine Wines', 'Noble Cuisine', 'Chivalric Entertainment'],
        atmosphere: 'Noble and Prestigious'
      },
      requirements: ['Spring Season', 'High Reputation']
    },
    {
      id: 'dwarf-clan-gathering',
      name: 'Dwarf Clan Gathering',
      region: 'Dwarf Holds',
      type: 'celebration',
      duration: 7,
      effects: {
        customerFlow: 40,
        priceModifier: 1.2,
        specialRequests: ['Strong Ales', 'Hearty Meals', 'Clan Stories'],
        atmosphere: 'Boisterous and Traditional'
      },
      requirements: ['Dwarf Reputation > 60']
    },
    {
      id: 'elf-starlight-ceremony',
      name: 'Elf Starlight Ceremony',
      region: 'Elf Enclaves',
      type: 'ceremony',
      duration: 1,
      effects: {
        customerFlow: 20,
        priceModifier: 2.0,
        specialRequests: ['Elven Wine', 'Delicate Cuisine', 'Mystical Atmosphere'],
        atmosphere: 'Ethereal and Mystical'
      },
      requirements: ['Summer Solstice', 'Elf Reputation > 70']
    },
    {
      id: 'tilean-merchant-fair',
      name: 'Tilean Merchant Fair',
      region: 'Tilea',
      type: 'celebration',
      duration: 4,
      effects: {
        customerFlow: 60,
        priceModifier: 1.3,
        specialRequests: ['Exotic Foods', 'Fine Wines', 'Cultural Performances'],
        atmosphere: 'Cosmopolitan and Wealthy'
      },
      requirements: ['Merchant Connections']
    }
  ];

  static getAvailableEvents(region: Region, season: string, reputation: number): CulturalEvent[] {
    return this.EVENT_TEMPLATES.filter(event => {
      if (event.region !== region) return false;

      if (event.requirements) {
        return event.requirements.every(req => {
          if (req.includes('Season')) return req.toLowerCase().includes(season.toLowerCase());
          if (req.includes('Reputation')) {
            const match = req.match(/(\w+) Reputation > (\d+)/);
            if (match) return reputation > parseInt(match[2]);
          }
          return true; // Other requirements assumed to be met
        });
      }

      return true;
    });
  }

  static generateRandomEvent(region: Region): CulturalEvent | null {
    const regionEvents = this.EVENT_TEMPLATES.filter(e => e.region === region);
    if (regionEvents.length === 0) return null;

    return regionEvents[Math.floor(Math.random() * regionEvents.length)];
  }

  static calculateEventImpact(event: CulturalEvent, baseSatisfaction: number): {
    customerIncrease: number;
    priceMultiplier: number;
    satisfactionBonus: number;
  } {
    return {
      customerIncrease: event.effects.customerFlow || 0,
      priceMultiplier: event.effects.priceModifier || 1.0,
      satisfactionBonus: Math.floor(baseSatisfaction * 0.1) // 10% bonus to satisfaction
    };
  }
}

// Regional News System
export class RegionalNewsManager {
  private static readonly NEWS_TEMPLATES: Record<Region, string[]> = {
    'Empire': [
      'Emperor Karl Franz announces new trade agreements with Dwarf Holds',
      'Chaos cultists discovered in Altdorf, Witch Hunters investigating',
      'Harvest yields exceed expectations across Reikland provinces',
      'New regiment of State Troops deployed to northern borders',
      'Merchant guild disputes cause delays in trade routes',
      'Sigmarite temple construction begins in Nuln',
      'Orc raids reported near Stirland border settlements'
    ],
    'Bretonnia': [
      'Grail Knight sighted near Couronne, pilgrims flock to region',
      'Duke of Lyonesse announces grand tournament for spring',
      'Peasant uprising quelled in Bordeleaux countryside',
      'New Bretonnian wine vintage declared exceptional by nobles',
      'Questing Knights depart for mysterious southern lands',
      'Lady of the Lake\'s blessing reported at sacred grove',
      'Diplomatic mission to Empire discusses trade relations'
    ],
    'Dwarf Holds': [
      'New vein of precious metals discovered in Karak Kadrin',
      'Grudge settled between Clan Ironbeard and Clan Goldaxe',
      'Master Engineer unveils new siege engine design',
      'Trade caravan from Barak Varr arrives with exotic goods',
      'Skaven tunnels discovered and sealed near Zhufbar',
      'Ancestral weapon recovered from ancient battlefield',
      'Clan gathering planned for next season\'s ceremonies'
    ],
    'Elf Enclaves': [
      'High Elf delegation arrives from Ulthuan with rare gifts',
      'Ancient magical artifact discovered in Athel Loren',
      'Wood Elf rangers report strange disturbances in forest',
      'Elven scholars complete translation of ancient texts',
      'Mystical phenomenon observed during recent full moon',
      'Diplomatic tensions ease between High and Wood Elves',
      'Rare magical components become available for trade'
    ],
    'Kislev': [
      'Ice Queen\'s forces repel Chaos incursion from north',
      'Harsh winter claims many lives in remote settlements',
      'Bear cavalry regiment achieves victory against raiders',
      'Ancient Kislevite traditions revived in major cities',
      'Trade routes to Empire disrupted by severe weather',
      'Ungol tribes unite against common Chaos threat',
      'Vodka shortage causes unrest in major settlements'
    ],
    'Tilea': [
      'Merchant Prince of Miragliano announces new trade venture',
      'City-state conflicts escalate over territorial disputes',
      'Renaissance art movement gains popularity among nobles',
      'Tilean mercenary companies seek new contracts abroad',
      'Exotic spices arrive from distant Cathay trade routes',
      'Banking houses establish new credit agreements',
      'Cultural festival celebrates artistic achievements'
    ],
    'Estalia': [
      'Conquistadors return with tales of distant lands',
      'Religious fervor sweeps through major cathedral cities',
      'Moorish architectural influences spark cultural debate',
      'Flamenco performances gain popularity in taverns',
      'Spice trade brings wealth to coastal settlements',
      'Inquisition investigates reports of heretical activities',
      'New world crops introduced to local agriculture'
    ],
    'Border Princes': [
      'Mercenary company establishes new stronghold',
      'Bandit raids increase along major trade routes',
      'Independent settlement declares sovereignty',
      'Refugee influx strains local resources',
      'Treasure hunters seek ancient ruins in badlands',
      'Diplomatic immunity granted to traveling merchants',
      'Frontier justice prevails in lawless territories'
    ],
    'Norsca': [
      'Viking longships spotted off southern coasts',
      'Tribal warfare erupts over hunting territories',
      'Chaos champion emerges from northern wastes',
      'Harsh winter forces southern migration',
      'Sea monsters reported by fishing vessels',
      'Ancient burial mounds disturbed by treasure seekers',
      'Warrior bands seek glory in foreign lands'
    ]
  };

  static generateDailyNews(region: Region, count: number = 3): string[] {
    const regionNews = this.NEWS_TEMPLATES[region] || [];
    const shuffled = [...regionNews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  static generateCrossRegionalNews(): string[] {
    const crossRegionalNews = [
      'Trade disputes arise between Empire and Bretonnian merchants',
      'Diplomatic envoy travels between Dwarf Holds and Empire',
      'Elven ambassadors seek audience with human nobility',
      'Chaos incursions threaten multiple northern regions',
      'Weather patterns affect trade routes across continents',
      'Plague outbreak spreads along major trade networks',
      'Religious pilgrimage draws visitors from many lands'
    ];

    return crossRegionalNews.sort(() => 0.5 - Math.random()).slice(0, 2);
  }

  static getNewsImpact(news: string): {
    economicImpact: number;
    socialImpact: number;
    securityImpact: number;
  } {
    let economicImpact = 0;
    let socialImpact = 0;
    let securityImpact = 0;

    // Analyze news content for impact
    if (news.includes('trade') || news.includes('merchant') || news.includes('economic')) {
      economicImpact = Math.floor(Math.random() * 21) - 10; // -10 to +10
    }

    if (news.includes('festival') || news.includes('celebration') || news.includes('cultural')) {
      socialImpact = Math.floor(Math.random() * 16) + 5; // +5 to +20
    }

    if (news.includes('raid') || news.includes('chaos') || news.includes('war') || news.includes('bandit')) {
      securityImpact = Math.floor(Math.random() * 21) - 15; // -15 to +5
    }

    return { economicImpact, socialImpact, securityImpact };
  }
}
