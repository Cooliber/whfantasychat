import React, { useState, useEffect } from 'react';
import { useTavernStore } from '../stores/tavernStore';
import type { TavernCharacterData } from '../types/warhammer.types';

interface EnhancedConversationState {
  selectedCharacter: TavernCharacterData | null;
  conversationActive: boolean;
  currentResponse: string;
  availableOptions: any[];
  memoryReferences: string[];
  emotionalState: any;
  voiceProfile: any;
  questOpportunities: any[];
  minigameOptions: any[];
  relationshipLevel: number;
  trustLevel: number;
  conversationHistory: Array<{
    speaker: 'player' | 'character';
    message: string;
    timestamp: Date;
    emotionalTone?: string;
  }>;
}

export const EnhancedConversationDemo: React.FC = () => {
  const { characters, conversationEngine } = useTavernStore();
  const [state, setState] = useState<EnhancedConversationState>({
    selectedCharacter: null,
    conversationActive: false,
    currentResponse: '',
    availableOptions: [],
    memoryReferences: [],
    emotionalState: null,
    voiceProfile: null,
    questOpportunities: [],
    minigameOptions: [],
    relationshipLevel: 0,
    trustLevel: 50,
    conversationHistory: []
  });

  const [playerInput, setPlayerInput] = useState('');
  const [selectedDialogueType, setSelectedDialogueType] = useState('social');

  const characterArray = Array.from(characters.values());

  const startEnhancedConversation = async (character: TavernCharacterData) => {
    if (!conversationEngine) return;

    try {
      const context = {
        currentScene: 'tavern_main_hall',
        activeEvents: new Map(),
        tavernReputation: { overall: 75, cleanliness: 80, service: 70, atmosphere: 85, safety: 75 },
        customerSatisfaction: { overall: 78, food: 75, drinks: 80, entertainment: 85, service: 70 },
        currentRegion: character.background?.birthplace || 'Empire',
        recentNews: ['Trade routes disrupted', 'Festival approaching', 'Weather improving'],
        activeRumors: ['Mysterious stranger in town', 'Hidden treasure nearby'],
        playerReputation: 65
      };

      const result = await conversationEngine.startEnhancedConversation(
        character,
        'Player',
        context as any
      );

      setState(prev => ({
        ...prev,
        selectedCharacter: character,
        conversationActive: true,
        currentResponse: result.response.response,
        availableOptions: result.availableOptions,
        memoryReferences: result.memoryReferences,
        emotionalState: result.emotionalState,
        voiceProfile: result.voiceProfile,
        questOpportunities: result.questOpportunities,
        minigameOptions: result.minigameOptions,
        relationshipLevel: 45,
        trustLevel: 50,
        conversationHistory: [{
          speaker: 'character',
          message: result.response.response,
          timestamp: new Date(),
          emotionalTone: result.emotionalState?.dominantEmotion
        }]
      }));
    } catch (error) {
      console.error('Error starting enhanced conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!playerInput.trim() || !state.selectedCharacter || !conversationEngine) return;

    try {
      // Add player message to history
      setState(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, {
          speaker: 'player',
          message: playerInput,
          timestamp: new Date()
        }]
      }));

      const context = {
        currentScene: 'tavern_main_hall',
        activeEvents: new Map(),
        tavernReputation: { overall: 75, cleanliness: 80, service: 70, atmosphere: 85, safety: 75 },
        customerSatisfaction: { overall: 78, food: 75, drinks: 80, entertainment: 85, service: 70 },
        currentRegion: state.selectedCharacter.background?.birthplace || 'Empire',
        recentNews: ['Trade routes disrupted', 'Festival approaching', 'Weather improving'],
        activeRumors: ['Mysterious stranger in town', 'Hidden treasure nearby'],
        playerReputation: 65
      };

      const result = await conversationEngine.processEnhancedConversationTurn(
        state.selectedCharacter,
        'Player',
        playerInput,
        selectedDialogueType,
        context as any
      );

      // Update state with response
      setState(prev => ({
        ...prev,
        currentResponse: result.response.response,
        availableOptions: result.nextOptions,
        relationshipLevel: Math.max(0, Math.min(100, prev.relationshipLevel + result.relationshipChange)),
        conversationHistory: [...prev.conversationHistory, {
          speaker: 'character',
          message: result.response.response,
          timestamp: new Date(),
          emotionalTone: result.emotionalResponse?.newDominantEmotion
        }],
        questOpportunities: result.questsGenerated.length > 0 ? result.questsGenerated : prev.questOpportunities
      }));

      setPlayerInput('');
    } catch (error) {
      console.error('Error processing conversation turn:', error);
    }
  };

  const startMinigame = (minigame: any) => {
    alert(`Starting ${minigame.title}! This would launch the ${minigame.type} minigame.`);
  };

  const acceptQuest = (quest: any) => {
    alert(`Quest accepted: ${quest.title}! This would add the quest to your journal.`);
  };

  return (
    <div className="bg-parchment min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">
            🎭 Enhanced Conversation System Demo
          </h1>
          <p className="text-gray-600">
            Experience the full power of the advanced Warhammer Fantasy conversation system with memory, emotions, voice profiles, and dynamic content generation.
          </p>
        </div>

        {!state.conversationActive ? (
          /* Character Selection */
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Choose a Character to Converse With</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characterArray.slice(0, 6).map((character) => (
                <div
                  key={character.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => startEnhancedConversation(character)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center text-gold font-bold text-lg">
                      {character.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">{character.name}</h3>
                      <p className="text-sm text-gray-600">{character.characterClass} from {character.race}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Traits:</strong> {character.personalityTraits.slice(0, 2).join(', ')}</p>
                    <p><strong>Mood:</strong> {character.currentMood}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Conversation Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Conversation Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Character Info Panel */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center text-gold font-bold text-lg">
                      {state.selectedCharacter?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">{state.selectedCharacter?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {state.selectedCharacter?.characterClass} • {state.selectedCharacter?.race}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Relationship: {state.relationshipLevel}%</div>
                    <div className="text-sm text-gray-600">Trust: {state.trustLevel}%</div>
                    {state.emotionalState && (
                      <div className="text-sm text-gray-600">
                        Mood: {state.emotionalState.dominantEmotion}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversation History */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="font-semibold text-charcoal mb-4">Conversation</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {state.conversationHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.speaker === 'player' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.speaker === 'player'
                            ? 'bg-wood text-parchment'
                            : 'bg-gray-100 text-charcoal'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        {message.emotionalTone && (
                          <p className="text-xs opacity-75 mt-1">
                            Emotion: {message.emotionalTone}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex space-x-2 mb-3">
                  <select
                    value={selectedDialogueType}
                    onChange={(e) => setSelectedDialogueType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="social">Social</option>
                    <option value="information">Information</option>
                    <option value="quest">Quest</option>
                    <option value="trade">Trade</option>
                    <option value="secret">Secret</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={playerInput}
                    onChange={(e) => setPlayerInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-wood focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-wood text-parchment rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Memory References */}
              {state.memoryReferences.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-charcoal mb-3">💭 Memory References</h3>
                  <div className="space-y-2">
                    {state.memoryReferences.map((reference, index) => (
                      <div key={index} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                        {reference}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Profile */}
              {state.voiceProfile && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-charcoal mb-3">🎭 Voice Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div>Formality: {state.voiceProfile.formalityLevel}%</div>
                    <div>Verbosity: {state.voiceProfile.verbosity}%</div>
                    <div>Accent: {state.voiceProfile.accent}</div>
                    <div>Vocabulary: {state.voiceProfile.vocabulary}</div>
                  </div>
                </div>
              )}

              {/* Quest Opportunities */}
              {state.questOpportunities.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-charcoal mb-3">⚔️ Quest Opportunities</h3>
                  <div className="space-y-3">
                    {state.questOpportunities.map((quest, index) => (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium text-charcoal">{quest.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                        <button
                          onClick={() => acceptQuest(quest)}
                          className="text-sm bg-forest text-parchment px-3 py-1 rounded hover:bg-opacity-90"
                        >
                          Accept Quest
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minigame Options */}
              {state.minigameOptions.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-charcoal mb-3">🎲 Conversation Minigames</h3>
                  <div className="space-y-3">
                    {state.minigameOptions.map((minigame, index) => (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium text-charcoal">{minigame.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{minigame.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Difficulty: {minigame.difficulty}</span>
                          <button
                            onClick={() => startMinigame(minigame)}
                            className="text-sm bg-gold text-charcoal px-3 py-1 rounded hover:bg-opacity-90"
                          >
                            Start Game
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Dialogue Options */}
              {state.availableOptions.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-charcoal mb-3">💬 Dialogue Options</h3>
                  <div className="space-y-2">
                    {state.availableOptions.slice(0, 4).map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setPlayerInput(option.text)}
                        className="w-full text-left text-sm bg-gray-50 hover:bg-gray-100 p-2 rounded transition-colors"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <button
                  onClick={() => setState(prev => ({ ...prev, conversationActive: false, selectedCharacter: null }))}
                  className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  End Conversation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
