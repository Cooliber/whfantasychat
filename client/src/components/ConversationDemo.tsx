import React, { useState, useEffect } from 'react';
import { useTavernStore } from '../stores/tavernStore';
import { EnhancedConversationModal } from './EnhancedConversationModal';

export const ConversationDemo: React.FC = () => {
  const {
    characters,
    initializeConversationSystem,
    startConversation,
    conversationManager,
    isDialogueModalOpen,
    selectedCharacter,
    currentRegion,
    reputation,
    customerSatisfaction,
    activeEvents
  } = useTavernStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');

  useEffect(() => {
    if (!conversationManager && !isInitialized) {
      initializeConversationSystem();
      setIsInitialized(true);
    }
  }, [conversationManager, initializeConversationSystem, isInitialized]);

  const handleStartConversation = (characterId: string) => {
    try {
      startConversation(characterId);
      setSelectedCharacterId(characterId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const getCharacterStatusColor = (character: any) => {
    const mood = character.currentMood?.toLowerCase() || 'neutral';
    switch (mood) {
      case 'happy': return 'bg-green-100 border-green-300';
      case 'sad': return 'bg-blue-100 border-blue-300';
      case 'angry': return 'bg-red-100 border-red-300';
      case 'excited': return 'bg-yellow-100 border-yellow-300';
      case 'suspicious': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getCharacterDescription = (character: any) => {
    const background = character.background;
    const socialClass = background?.socialClass || 'unknown';
    const birthplace = background?.birthplace || 'unknown lands';
    
    return `A ${socialClass} from ${birthplace}, currently in ${character.currentMood?.toLowerCase() || 'neutral'} spirits.`;
  };

  const getAvailableCharacters = () => {
    return Array.from(characters.values()).slice(0, 5); // Show first 5 characters
  };

  return (
    <div className="p-6 bg-parchment min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">
            🏰 Warhammer Fantasy Tavern
          </h1>
          <h2 className="text-2xl text-wood mb-4">
            Enhanced Conversation System Demo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience dynamic, AI-powered conversations with authentic Warhammer Fantasy characters. 
            Each interaction is contextually aware and influenced by character backgrounds, current events, 
            and your relationship history.
          </p>
        </div>

        {/* Tavern Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-wood">
            <h3 className="font-semibold text-charcoal mb-2">📍 Current Region</h3>
            <p className="text-lg font-bold text-wood">{currentRegion}</p>
            <p className="text-sm text-gray-600">Regional customs and culture influence conversations</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-gold">
            <h3 className="font-semibold text-charcoal mb-2">⭐ Tavern Reputation</h3>
            <p className="text-lg font-bold text-gold">{reputation.overall}/100</p>
            <p className="text-sm text-gray-600">Higher reputation unlocks more dialogue options</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-forest">
            <h3 className="font-semibold text-charcoal mb-2">😊 Customer Satisfaction</h3>
            <p className="text-lg font-bold text-forest">{customerSatisfaction.overall}/100</p>
            <p className="text-sm text-gray-600">Atmosphere affects character moods and responses</p>
          </div>
        </div>

        {/* Active Events */}
        {activeEvents.size > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-amber-800 mb-2">🎭 Active Tavern Events</h3>
            <div className="space-y-2">
              {Array.from(activeEvents.values()).map((event) => (
                <div key={event.id} className="flex items-center space-x-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-amber-700">{event.name}</span>
                  <span className="text-sm text-amber-600">({event.type})</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-amber-600 mt-2">
              Events can interrupt conversations and create new dialogue opportunities!
            </p>
          </div>
        )}

        {/* Character Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-charcoal mb-4">
            💬 Choose a Character to Converse With
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAvailableCharacters().map((character) => (
              <div
                key={character.id}
                className={`rounded-lg p-4 border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${getCharacterStatusColor(character)}`}
                onClick={() => handleStartConversation(character.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center text-gold font-bold text-lg">
                    {character.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal">{character.name}</h4>
                    <p className="text-sm text-gray-600">
                      {character.race} {character.characterClass}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {getCharacterDescription(character)}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {character.personalityTraits.slice(0, 3).map((trait: string) => (
                    <span
                      key={trait}
                      className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                
                <div className="text-xs text-gray-600">
                  <p>💼 Skills: {character.skills.slice(0, 3).join(', ')}</p>
                  <p>🎯 Goals: {character.goals.slice(0, 1).join(', ') || 'Mysterious'}</p>
                  <p>🤐 Secrets: {character.characterSecrets.size} hidden</p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white border-opacity-50">
                  <button className="w-full bg-wood text-parchment py-2 rounded hover:bg-opacity-80 transition-colors font-medium">
                    Start Conversation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Features */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h3 className="text-2xl font-bold text-charcoal mb-4">
            🎯 Conversation System Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-wood mb-2">🎭 Dynamic Interactions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AI-powered responses based on character personality</li>
                <li>• Contextual dialogue that adapts to current events</li>
                <li>• Relationship tracking affects future conversations</li>
                <li>• Cultural authenticity with Warhammer Fantasy lore</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-wood mb-2">⚡ Real-time Events</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Random tavern events can interrupt conversations</li>
                <li>• Character arrivals and departures</li>
                <li>• News and rumors spread through the tavern</li>
                <li>• Weather and cultural moments affect atmosphere</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-wood mb-2">🗣️ Dialogue Types</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 💬 Social: Build relationships and trust</li>
                <li>• 📰 Information: Gather news and rumors</li>
                <li>• ⚔️ Quest: Discover opportunities and missions</li>
                <li>• 💰 Trade: Negotiate deals and commerce</li>
                <li>• 🤫 Secret: Investigate hidden information</li>
                <li>• 🏛️ Cultural: Learn about different races and regions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-wood mb-2">📈 Meaningful Consequences</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Relationship changes persist across sessions</li>
                <li>• Unlock new quests through relationship building</li>
                <li>• Discover character secrets and hidden agendas</li>
                <li>• Influence tavern reputation and atmosphere</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-forest text-parchment rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">🎮 How to Experience the Demo</h3>
          <p className="mb-4">
            Click on any character above to start a conversation. Each character has unique:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-parchment text-forest px-3 py-1 rounded">Personality Traits</span>
            <span className="bg-parchment text-forest px-3 py-1 rounded">Cultural Background</span>
            <span className="bg-parchment text-forest px-3 py-1 rounded">Hidden Secrets</span>
            <span className="bg-parchment text-forest px-3 py-1 rounded">Personal Goals</span>
            <span className="bg-parchment text-forest px-3 py-1 rounded">Faction Relationships</span>
          </div>
          <p className="mt-4 text-sm opacity-90">
            Try different dialogue approaches to see how characters respond based on their personalities and your relationship with them!
          </p>
        </div>
      </div>

      {/* Enhanced Conversation Modal */}
      <EnhancedConversationModal
        isOpen={isDialogueModalOpen}
        onClose={() => {
          // Modal will handle conversation ending
        }}
      />
    </div>
  );
};
