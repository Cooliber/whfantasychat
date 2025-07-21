import React, { useState, useEffect, useRef } from 'react';
import { useTavernStore } from '../stores/tavernStore';
import { DialogueOption } from '../services/conversationService';
import { ConversationEvent } from '../services/conversationEventService';

interface EnhancedConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedConversationModal: React.FC<EnhancedConversationModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    activeConversation,
    selectedCharacter,
    characters,
    getDialogueOptions,
    processDialogueChoice,
    endConversation,
    conversationManager
  } = useTavernStore();

  const [availableOptions, setAvailableOptions] = useState<DialogueOption[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationEvents, setConversationEvents] = useState<ConversationEvent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const character = selectedCharacter ? characters.get(selectedCharacter) : null;

  useEffect(() => {
    if (activeConversation && selectedCharacter) {
      const options = getDialogueOptions(activeConversation.id, selectedCharacter);
      setAvailableOptions(options);
    }
  }, [activeConversation, selectedCharacter, getDialogueOptions]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  useEffect(() => {
    // Monitor for conversation events
    if (conversationManager && activeConversation) {
      const activeConversations = conversationManager.getActiveConversations();
      const currentConversation = activeConversations.get(activeConversation.id);
      
      if (currentConversation) {
        setConversationEvents(currentConversation.interruptionEvents);
      }
    }
  }, [conversationManager, activeConversation]);

  const handleOptionSelect = async (option: DialogueOption) => {
    if (!activeConversation || !selectedCharacter || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const response = processDialogueChoice(
        activeConversation.id,
        option.id,
        selectedCharacter
      );

      if (response) {
        // Update available options based on response
        if (response.conversationEnded) {
          handleEndConversation();
        } else {
          const newOptions = getDialogueOptions(activeConversation.id, selectedCharacter);
          setAvailableOptions(newOptions);
        }
      }
    } catch (error) {
      console.error('Error processing dialogue choice:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndConversation = () => {
    if (activeConversation) {
      const summary = endConversation(activeConversation.id);
      console.log('Conversation ended:', summary);
    }
    onClose();
  };

  const getCharacterName = (characterId: string): string => {
    if (characterId === 'player') return 'You';
    if (characterId === 'system') return 'System';
    const char = characters.get(characterId);
    return char?.name || 'Unknown';
  };

  const getMessageStyle = (type: string, characterId: string) => {
    const baseStyle = "p-3 rounded-lg max-w-[80%] ";
    
    if (type === 'system') {
      return baseStyle + "bg-amber-100 text-amber-800 italic text-center mx-auto";
    }
    
    if (characterId === 'player') {
      return baseStyle + "bg-blue-600 text-white ml-auto";
    }
    
    return baseStyle + "bg-gray-200 text-gray-800 mr-auto";
  };

  const getOptionStyle = (option: DialogueOption) => {
    const baseStyle = "p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ";
    
    switch (option.type) {
      case 'quest':
        return baseStyle + "border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400";
      case 'trade':
        return baseStyle + "border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400";
      case 'secret':
        return baseStyle + "border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-400";
      case 'information':
        return baseStyle + "border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400";
      case 'cultural':
        return baseStyle + "border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400";
      case 'faction':
        return baseStyle + "border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-400";
      default:
        return baseStyle + "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400";
    }
  };

  const getOptionTypeIcon = (type: string) => {
    switch (type) {
      case 'quest': return '⚔️';
      case 'trade': return '💰';
      case 'secret': return '🤫';
      case 'information': return '📰';
      case 'cultural': return '🏛️';
      case 'faction': return '⚡';
      default: return '💬';
    }
  };

  if (!isOpen || !activeConversation || !character) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-parchment rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-wood text-parchment p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center text-gold font-bold">
              {character.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{character.name}</h2>
              <p className="text-sm opacity-80">
                {character.race} {character.characterClass} • Mood: {character.currentMood}
              </p>
            </div>
          </div>
          <button
            onClick={handleEndConversation}
            className="text-parchment hover:text-gold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Conversation Events Banner */}
        {conversationEvents.length > 0 && (
          <div className="bg-amber-100 border-l-4 border-amber-500 p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-amber-500">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  Recent tavern events: {conversationEvents[conversationEvents.length - 1].description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.characterId === 'player' ? 'justify-end' : 
                message.type === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              <div className={getMessageStyle(message.type, message.characterId)}>
                {message.type !== 'system' && message.characterId !== 'player' && (
                  <div className="text-xs font-semibold mb-1 text-gray-600">
                    {getCharacterName(message.characterId)}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Dialogue Options */}
        <div className="border-t border-wood p-4 bg-gray-50">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                disabled={isProcessing}
                className={`w-full text-left ${getOptionStyle(option)} ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-lg">{getOptionTypeIcon(option.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium">{option.text}</div>
                    {option.requirements && (
                      <div className="text-xs text-gray-500 mt-1">
                        Requirements: {Object.entries(option.requirements).map(([key, value]) => 
                          `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
                        ).join(' • ')}
                      </div>
                    )}
                  </div>
                  <div className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                    {option.type}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {isProcessing && (
            <div className="text-center text-gray-500 mt-2">
              <span className="animate-pulse">Processing response...</span>
            </div>
          )}
          
          {availableOptions.length === 0 && !isProcessing && (
            <div className="text-center text-gray-500">
              <p>No dialogue options available.</p>
              <button
                onClick={handleEndConversation}
                className="mt-2 px-4 py-2 bg-wood text-parchment rounded hover:bg-opacity-80 transition-colors"
              >
                End Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
