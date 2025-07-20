import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Clock, User } from 'lucide-react';
import { useTavernStore, useActiveConversation } from '../../stores/tavernStore';
import { ConversationMessage } from '../../types/warhammer.types';

export function ConversationArea() {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = useActiveConversation();
  const { getConversationHistory, getCharacterById } = useTavernStore();
  
  const conversationHistory = getConversationHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      const message: ConversationMessage = {
        id: `msg-${Date.now()}`,
        characterId: 'player',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'dialogue'
      };

      // Add message to active conversation
      const updatedConversation = {
        ...activeConversation,
        messages: [...activeConversation.messages, message]
      };

      // This would normally trigger AI responses from characters
      // For now, just add the player message
      setNewMessage('');
    }
  };

  const getCharacterName = (characterId: string) => {
    if (characterId === 'player') return 'Ty';
    const character = getCharacterById(characterId);
    return character?.name || 'Nieznana Postać';
  };

  const getCharacterAvatar = (characterId: string) => {
    if (characterId === 'player') return '🧙‍♂️';
    const character = getCharacterById(characterId);
    
    // Simple avatar mapping based on character race/class
    if (character?.race === 'Empire') return '⚔️';
    if (character?.race === 'Dwarf') return '🔨';
    if (character?.race === 'Elf') return '🏹';
    if (character?.characterClass === 'Scholar') return '📚';
    if (character?.characterClass === 'Blacksmith') return '🔥';
    return '👤';
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!activeConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <MessageSquare size={64} className="text-gold mb-4 opacity-50" />
        <h3 className="font-cinzel text-2xl text-gold mb-3">
          Brak Aktywnej Rozmowy
        </h3>
        <p className="font-crimson text-parchment opacity-80 mb-6 max-w-md">
          Wybierz postać z panelu po prawej stronie lub poczekaj, aż ktoś rozpocznie rozmowę. 
          Postacie automatycznie rozpoczynają konwersacje co kilka minut.
        </p>
        
        {/* Recent conversations preview */}
        {conversationHistory.length > 0 && (
          <div className="w-full max-w-2xl mt-8">
            <h4 className="font-cinzel text-lg text-gold mb-4">
              Ostatnie Rozmowy
            </h4>
            <div className="space-y-3">
              {conversationHistory.slice(-3).map((conversation) => (
                <div 
                  key={conversation.id}
                  className="glass-morphism p-4 rounded-lg cursor-pointer hover:border-gold hover:border-opacity-50 transition-all duration-300"
                  onClick={() => useTavernStore.getState().setActiveConversation(conversation)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gold" />
                      <span className="font-crimson text-sm text-gold">
                        {formatTimestamp(conversation.timestamp)}
                      </span>
                    </div>
                    <span className="font-crimson text-sm text-parchment opacity-60">
                      {conversation.sceneContext}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-parchment opacity-60" />
                    <span className="font-crimson text-sm text-parchment">
                      {conversation.participants.map(getCharacterName).join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col glass-morphism rounded-lg">
      {/* Conversation header */}
      <div className="p-4 border-b border-gold border-opacity-30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-xl text-gold">
              Rozmowa w {activeConversation.sceneContext}
            </h3>
            <p className="font-crimson text-sm text-parchment opacity-80">
              Uczestnicy: {activeConversation.participants.map(getCharacterName).join(', ')}
            </p>
          </div>
          <div className="text-right">
            <div className="font-crimson text-sm text-gold">
              {formatTimestamp(activeConversation.timestamp)}
            </div>
            <div className={`font-crimson text-xs px-2 py-1 rounded-full ${
              activeConversation.emotionalTone === 'positive' ? 'bg-green-800 text-green-200' :
              activeConversation.emotionalTone === 'negative' ? 'bg-red-800 text-red-200' :
              'bg-gray-700 text-gray-300'
            }`}>
              {activeConversation.emotionalTone === 'positive' ? 'Pozytywny' :
               activeConversation.emotionalTone === 'negative' ? 'Negatywny' : 'Neutralny'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeConversation.messages.map((message) => (
          <div 
            key={message.id}
            className={`flex gap-3 ${
              message.characterId === 'player' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
              message.characterId === 'player' 
                ? 'bg-gold text-charcoal' 
                : 'bg-wood text-parchment'
            }`}>
              {getCharacterAvatar(message.characterId)}
            </div>
            
            {/* Message bubble */}
            <div className={`max-w-xs lg:max-w-md ${
              message.characterId === 'player' ? 'items-end' : 'items-start'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-crimson text-sm text-gold">
                  {getCharacterName(message.characterId)}
                </span>
                <span className="font-crimson text-xs text-parchment opacity-60">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              
              <div className={`p-3 rounded-lg ${
                message.characterId === 'player'
                  ? 'bg-gold text-charcoal rounded-br-none'
                  : 'bg-wood text-parchment rounded-bl-none'
              }`}>
                <p className="font-crimson leading-relaxed">
                  {message.content}
                </p>
                {message.type === 'gossip' && (
                  <div className="mt-2 pt-2 border-t border-current border-opacity-30">
                    <span className="text-xs opacity-80">💬 Plotka</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gold border-opacity-30">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Napisz swoją odpowiedź..."
            className="flex-1 px-4 py-3 bg-charcoal bg-opacity-50 border border-gold border-opacity-30 rounded-lg text-parchment placeholder-gray-400 focus:border-gold focus:outline-none font-crimson"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gold text-charcoal px-6 py-3 rounded-lg font-crimson font-semibold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
            Wyślij
          </button>
        </div>
        
        {/* Quick responses */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => setNewMessage('Opowiedz mi więcej...')}
            className="bg-wood text-parchment px-3 py-1 rounded-full text-sm font-crimson hover:bg-opacity-80 transition-colors"
          >
            Opowiedz więcej
          </button>
          <button 
            onClick={() => setNewMessage('Ciekawe, co myślisz o tym?')}
            className="bg-wood text-parchment px-3 py-1 rounded-full text-sm font-crimson hover:bg-opacity-80 transition-colors"
          >
            Twoje zdanie?
          </button>
          <button 
            onClick={() => setNewMessage('Słyszałem plotki...')}
            className="bg-wood text-parchment px-3 py-1 rounded-full text-sm font-crimson hover:bg-opacity-80 transition-colors"
          >
            Plotki
          </button>
        </div>
      </div>
    </div>
  );
}