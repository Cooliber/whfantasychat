import React from 'react';

interface CharacterAvatarProps {
  characterId: string;
  name: string;
  race?: string;
  characterClass?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  className?: string;
}

// Character image mapping with high-quality Pixabay images
const getCharacterImage = (characterId: string, race?: string, characterClass?: string): string => {
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
    
    // Player
    'player': 'https://cdn.pixabay.com/photo/2016/06/13/13/26/gothic-1454219_1280.jpg',
  };

  // Return specific image if available
  if (imageMap[characterId]) {
    return imageMap[characterId];
  }

  // Fallback images based on race and class
  if (race && characterClass) {
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
    if (raceClassMap[key]) {
      return raceClassMap[key];
    }
  }

  // Default fallback
  return 'https://cdn.pixabay.com/photo/2016/06/13/13/26/gothic-1454219_1280.jpg';
};

const getCharacterEmoji = (characterId: string): string => {
  const avatars: Record<string, string> = {
    'wilhelm-scribe': '📚',
    'greta-ironforge': '🔨',
    'aelindra-moonwhisper': '🌙',
    'marcus-steiner': '🗡️',
    'lorenzo-goldhand': '💰',
    'balin-goldseeker': '⛏️',
    'player': '👤'
  };
  return avatars[characterId] || '❓';
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'w-8 h-8 text-sm';
    case 'md':
      return 'w-12 h-12 text-lg';
    case 'lg':
      return 'w-16 h-16 text-xl';
    case 'xl':
      return 'w-20 h-20 text-2xl';
    default:
      return 'w-12 h-12 text-lg';
  }
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  name,
  race,
  characterClass,
  size = 'md',
  showBorder = true,
  className = ''
}) => {
  const characterImage = getCharacterImage(characterId, race, characterClass);
  const sizeClasses = getSizeClasses(size);
  const borderClasses = showBorder ? 'border-2 border-gold border-opacity-50' : '';

  return (
    <div className={`relative ${sizeClasses} ${className}`}>
      <img 
        src={characterImage}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover ${borderClasses}`}
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling!.style.display = 'flex';
        }}
      />
      <div 
        className={`${sizeClasses} rounded-full bg-wood flex items-center justify-center ${borderClasses} hidden`}
        title={name}
      >
        {getCharacterEmoji(characterId)}
      </div>
    </div>
  );
};

export default CharacterAvatar;
