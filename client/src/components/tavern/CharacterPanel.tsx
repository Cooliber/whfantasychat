import { useState } from 'react';
import { Users, MessageCircle, Crown, Scroll } from 'lucide-react';
import { TavernCharacterData } from '../../types/warhammer.types';
import { useTavernStore } from '../../stores/tavernStore';

// Character image mapping with high-quality Pixabay images
const getCharacterImage = (characterId: string, race: string, characterClass: string): string => {
  const imageMap: Record<string, string> = {
    // Empire characters
    'wilhelm-scribe': 'https://cdn.pixabay.com/photo/2023/05/15/23/47/ai-generated-7996238_1280.jpg',
    'marcus-steiner': 'https://cdn.pixabay.com/photo/2024/10/15/00/32/ai-generated-9121027_1280.png',

    // Dwarf characters
    'greta-ironforge': 'https://cdn.pixabay.com/photo/2024/09/22/13/55/ai-generated-9066159_1280.jpg',
    'balin-goldseeker': 'https://cdn.pixabay.com/photo/2024/05/15/15/31/dwarfs-8763898_1280.png',

    // Elf characters
    'aelindra-moonwhisper': 'https://cdn.pixabay.com/photo/2024/05/04/10/28/ai-generated-8738759_1280.png',

    // Merchant characters
    'lorenzo-goldhand': 'https://cdn.pixabay.com/photo/2024/05/28/11/24/fancy-8793669_1280.png',
  };

  // Return specific image if available, otherwise fallback based on race/class
  if (imageMap[characterId]) {
    return imageMap[characterId];
  }

  // Fallback images based on race and class
  const raceClassMap: Record<string, string> = {
    'empire-warrior': 'https://cdn.pixabay.com/photo/2022/09/05/09/15/medieval-fantasy-7433716_1280.jpg',
    'empire-scholar': 'https://cdn.pixabay.com/photo/2023/05/15/23/47/ai-generated-7996238_1280.jpg',
    'empire-soldier': 'https://cdn.pixabay.com/photo/2024/10/15/00/32/ai-generated-9121027_1280.png',
    'dwarf-warrior': 'https://cdn.pixabay.com/photo/2024/09/22/13/55/ai-generated-9066159_1280.jpg',
    'dwarf-blacksmith': 'https://cdn.pixabay.com/photo/2024/09/22/13/55/ai-generated-9066159_1280.jpg',
    'dwarf-merchant': 'https://cdn.pixabay.com/photo/2024/05/15/15/31/dwarfs-8763898_1280.png',
    'elf-ranger': 'https://cdn.pixabay.com/photo/2024/05/04/10/28/ai-generated-8738759_1280.png',
    'elf-mage': 'https://cdn.pixabay.com/photo/2024/05/04/10/28/ai-generated-8738759_1280.png',
    'elf-wizard': 'https://cdn.pixabay.com/photo/2024/05/04/10/28/ai-generated-8738759_1280.png',
    'human-merchant': 'https://cdn.pixabay.com/photo/2024/05/28/11/24/fancy-8793669_1280.png',
    'bretonnian-knight': 'https://cdn.pixabay.com/photo/2022/09/05/09/15/medieval-fantasy-7433716_1280.jpg',
    'tilean-merchant': 'https://cdn.pixabay.com/photo/2024/05/28/11/24/fancy-8793669_1280.png',
  };

  const key = `${race.toLowerCase()}-${characterClass.toLowerCase()}`;
  return raceClassMap[key] || 'https://cdn.pixabay.com/photo/2016/06/13/13/26/gothic-1454219_1280.jpg';
};

interface CharacterPanelProps {
  characters: TavernCharacterData[];
}

export function CharacterPanel({ characters }: CharacterPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'active' | 'all'>('active');
  const { 
    characters: allCharacters, 
    initiateConversation, 
    setSelectedCharacter,
    getRelationship 
  } = useTavernStore();

  const displayCharacters = selectedTab === 'active' 
    ? characters 
    : Array.from(allCharacters.values()).slice(0, 6); // Show first 6 characters for demo

  const getRaceIcon = (race: string) => {
    switch (race) {
      case 'Empire': return '⚔️';
      case 'Dwarf': return '🔨';
      case 'Elf': return '🏹';
      case 'Halfling': return '🌾';
      case 'Bretonnian': return '🛡️';
      case 'Tilean': return '💰';
      case 'Norse': return '⚡';
      default: return '👤';
    }
  };

  const getClassColor = (characterClass: string) => {
    switch (characterClass) {
      case 'Soldier': return 'bg-red-800 text-red-200';
      case 'Scholar': return 'bg-blue-800 text-blue-200';
      case 'Blacksmith': return 'bg-orange-800 text-orange-200';
      case 'Ranger': return 'bg-green-800 text-green-200';
      case 'Merchant': return 'bg-yellow-800 text-yellow-200';
      case 'Warrior': return 'bg-red-900 text-red-200';
      case 'Mage': return 'bg-purple-800 text-purple-200';
      case 'Scout': return 'bg-green-700 text-green-200';
      case 'Rogue': return 'bg-gray-800 text-gray-200';
      case 'Innkeeper': return 'bg-brown-800 text-amber-200';
      case 'Burglar': return 'bg-gray-700 text-gray-300';
      case 'Cook': return 'bg-orange-700 text-orange-200';
      case 'Knight': return 'bg-blue-900 text-blue-200';
      case 'Berserker': return 'bg-red-700 text-red-300';
      case 'Witch Hunter': return 'bg-black text-white';
      case 'Wizard': return 'bg-purple-900 text-purple-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  const getMoodIndicator = (character: TavernCharacterData) => {
    const relationship = getRelationship('player', character.id);
    if (relationship > 50) return { emoji: '😊', label: 'Przyjazny', color: 'text-green-400' };
    if (relationship > 0) return { emoji: '🙂', label: 'Neutralny', color: 'text-yellow-400' };
    if (relationship > -50) return { emoji: '😐', label: 'Obojętny', color: 'text-gray-400' };
    return { emoji: '😠', label: 'Wrogi', color: 'text-red-400' };
  };

  return (
    <div className="h-full flex flex-col bg-charcoal bg-opacity-50">
      {/* Header */}
      <div className="p-4 border-b border-gold border-opacity-30">
        <h2 className="font-cinzel text-xl text-gold mb-4 flex items-center gap-2">
          <Users size={24} />
          Postacie w Tawernie
        </h2>
        
        {/* Tab selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-3 py-2 rounded-lg font-crimson text-sm transition-colors ${
              selectedTab === 'active'
                ? 'bg-gold text-charcoal'
                : 'bg-wood text-parchment hover:bg-opacity-80'
            }`}
          >
            Aktywne ({characters.length})
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-2 rounded-lg font-crimson text-sm transition-colors ${
              selectedTab === 'all'
                ? 'bg-gold text-charcoal'
                : 'bg-wood text-parchment hover:bg-opacity-80'
            }`}
          >
            Wszystkie
          </button>
        </div>
      </div>

      {/* Characters list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayCharacters.map((character) => {
          const mood = getMoodIndicator(character);
          const characterImage = getCharacterImage(character.id, character.race, character.characterClass);

          return (
            <div
              key={character.id}
              className="glass-morphism p-4 rounded-lg hover:border-gold hover:border-opacity-50 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedCharacter(character)}
            >
              {/* Character Portrait Background */}
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${characterImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

              {/* Character Content */}
              <div className="relative z-10">
                {/* Character header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={characterImage}
                        alt={character.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gold border-opacity-50"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'block';
                        }}
                      />
                      <div className="w-12 h-12 rounded-full bg-wood flex items-center justify-center text-2xl hidden">
                        {getRaceIcon(character.race)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-cinzel text-lg text-gold leading-tight">
                        {character.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-crimson ${getClassColor(character.characterClass)}`}>
                          {character.characterClass}
                        </span>
                        <span className="text-xs text-parchment opacity-60 font-crimson">
                          {character.race}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mood indicator */}
                  <div className="text-right">
                    <div className="text-xl">{mood.emoji}</div>
                    <div className={`text-xs font-crimson ${mood.color}`}>
                      {mood.label}
                    </div>
                  </div>
                </div>

                {/* Character description */}
                <p className="font-crimson text-sm text-parchment leading-relaxed mb-3 line-clamp-3">
                  {character.backstory.substring(0, 120)}...
                </p>

                {/* Personality traits */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {character.personalityTraits.slice(0, 3).map((trait, index) => (
                    <span
                      key={index}
                      className="bg-wood bg-opacity-50 text-parchment px-2 py-1 rounded-full text-xs font-crimson"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      initiateConversation([character.id]);
                    }}
                    className="flex-1 bg-gold text-charcoal py-2 px-3 rounded-lg font-crimson text-sm font-semibold hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center gap-1"
                  >
                    <MessageCircle size={14} />
                    Rozmowa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCharacter(character);
                    }}
                    className="bg-wood text-parchment py-2 px-3 rounded-lg font-crimson text-sm hover:bg-opacity-80 transition-colors duration-300"
                    title="Zobacz szczegóły"
                  >
                    <Scroll size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {displayCharacters.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl text-gold opacity-50 mb-3">👥</div>
            <p className="font-crimson text-parchment opacity-80">
              {selectedTab === 'active' 
                ? 'Brak aktywnych postaci w tej scenie' 
                : 'Ładowanie postaci...'}
            </p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="p-4 border-t border-gold border-opacity-30">
        <div className="space-y-2">
          <button
            onClick={() => {
              const activeCharacterIds = characters.map(c => c.id);
              if (activeCharacterIds.length >= 2) {
                initiateConversation(activeCharacterIds.slice(0, 3));
              }
            }}
            disabled={characters.length < 2}
            className="w-full bg-wood text-parchment py-2 px-3 rounded-lg font-crimson text-sm font-semibold hover:bg-opacity-80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Crown size={16} />
            Rozpocznij Rozmowę Grupową
          </button>
          
          <p className="text-xs text-parchment opacity-60 font-crimson text-center">
            Postacie automatycznie rozpoczynają rozmowy co 2-5 minut
          </p>
        </div>
      </div>
    </div>
  );
}