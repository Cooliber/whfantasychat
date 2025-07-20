import { useState } from 'react';
import { X, Send, Users, Clock } from 'lucide-react';
import { useTavernStore, useActiveConversation } from '../../stores/tavernStore';

export function DialogueModal() {
  const [playerResponse, setPlayerResponse] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const activeConversation = useActiveConversation();
  const { setActiveConversation, setDialogueModalOpen, getCharacterById } = useTavernStore();

  if (!activeConversation) return null;

  const participants = activeConversation.participants
    .map(id => getCharacterById(id))
    .filter(Boolean);

  const handleCloseModal = () => {
    setDialogueModalOpen(false);
    setActiveConversation(null);
  };

  const handleSendResponse = async () => {
    if (!playerResponse.trim()) return;

    setIsGeneratingResponse(true);
    
    // Simulate AI response generation
    setTimeout(() => {
      setPlayerResponse('');
      setIsGeneratingResponse(false);
      // Here would be the actual AI integration
    }, 2000);
  };

  const getCharacterAvatar = (characterId: string) => {
    const character = getCharacterById(characterId);
    if (!character) return '👤';
    
    switch (character.race) {
      case 'Empire': return '⚔️';
      case 'Dwarf': return '🔨';
      case 'Elf': return '🏹';
      case 'Halfling': return '🌾';
      default: return '👤';
    }
  };

  const mockConversationFlow = [
    {
      character: participants[0],
      message: "Słyszałeś o dziwnych wydarzeniach na północy? Ludzie mówią o bestii, która wykrada zwierzęta w nocy.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      character: participants[1],
      message: "Sprawdzałem stare manuskrypty. Istnieją wzmianki o podobnych stworzeniach z czasów Burzy Chaosu.",
      timestamp: new Date(Date.now() - 3 * 60 * 1000)
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-charcoal border-2 border-gold border-opacity-50 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="p-6 border-b border-gold border-opacity-30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-cinzel text-2xl text-gold mb-2">
                Rozmowa w {activeConversation.sceneContext}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gold" />
                  <span className="font-crimson text-parchment">
                    {participants.map(p => p?.name).join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" />
                  <span className="font-crimson text-parchment">
                    {activeConversation.timestamp.toLocaleTimeString('pl-PL')}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="text-gold hover:text-yellow-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Conversation content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {mockConversationFlow.map((turn, index) => (
              <div key={index} className="flex gap-4">
                {/* Character avatar */}
                <div className="w-12 h-12 bg-wood rounded-full flex items-center justify-center text-xl">
                  {getCharacterAvatar(turn.character?.id || '')}
                </div>
                
                {/* Message content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-cinzel text-lg text-gold">
                      {turn.character?.name}
                    </span>
                    <span className="font-crimson text-sm text-parchment opacity-60">
                      {turn.timestamp.toLocaleTimeString('pl-PL')}
                    </span>
                  </div>
                  
                  <div className="bg-wood bg-opacity-30 rounded-lg p-4">
                    <p className="font-crimson text-parchment leading-relaxed">
                      "{turn.message}"
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Player turn indicator */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-xl">
                🧙‍♂️
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-cinzel text-lg text-gold">Twoja kolej</span>
                </div>
                <p className="font-crimson text-parchment opacity-80 text-sm">
                  Co odpowiesz? Twoja reakcja może wpłynąć na relacje i rozwój historii.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Response options */}
        <div className="p-6 border-t border-gold border-opacity-30">
          {/* Quick response buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setPlayerResponse('To brzmi niepokojąco. Czy możemy sprawdzić te manuskrypty razem?')}
              className="bg-wood text-parchment px-4 py-2 rounded-lg font-crimson text-sm hover:bg-opacity-80 transition-colors"
            >
              🤝 Współpracuj
            </button>
            <button
              onClick={() => setPlayerResponse('Słyszałem podobne historie. Może powinienem zgłosić to strażnikom?')}
              className="bg-wood text-parchment px-4 py-2 rounded-lg font-crimson text-sm hover:bg-opacity-80 transition-colors"
            >
              ⚖️ Działaj oficjalnie
            </button>
            <button
              onClick={() => setPlayerResponse('To może być tylko plotka. Nie ma co się martwić każdym dziwnym dźwiękiem.')}
              className="bg-wood text-parchment px-4 py-2 rounded-lg font-crimson text-sm hover:bg-opacity-80 transition-colors"
            >
              🤷‍♂️ Bagatelizuj
            </button>
            <button
              onClick={() => setPlayerResponse('Mam doświadczenie z takimi sprawami. Może pójdę tam sam i sprawdzę.')}
              className="bg-wood text-parchment px-4 py-2 rounded-lg font-crimson text-sm hover:bg-opacity-80 transition-colors"
            >
              ⚔️ Działaj śmiało
            </button>
          </div>

          {/* Custom response input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={playerResponse}
              onChange={(e) => setPlayerResponse(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendResponse()}
              placeholder="Lub napisz własną odpowiedź..."
              className="flex-1 px-4 py-3 bg-charcoal bg-opacity-50 border border-gold border-opacity-30 rounded-lg text-parchment placeholder-gray-400 focus:border-gold focus:outline-none font-crimson"
              disabled={isGeneratingResponse}
            />
            <button
              onClick={handleSendResponse}
              disabled={!playerResponse.trim() || isGeneratingResponse}
              className="bg-gold text-charcoal px-6 py-3 rounded-lg font-crimson font-semibold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGeneratingResponse ? (
                <>⏳ Generowanie...</>
              ) : (
                <>
                  <Send size={18} />
                  Odpowiedz
                </>
              )}
            </button>
          </div>

          {/* Conversation effects preview */}
          <div className="mt-4 p-3 bg-wood bg-opacity-20 rounded-lg">
            <p className="font-crimson text-xs text-parchment opacity-80">
              💡 Podpowiedź: Twoja odpowiedź wpłynie na relacje z postaciami i może utworzyć nowe wątki fabularne. 
              Współpraca może poprawić relacje, podczas gdy ignorowanie problemu może je pogorszyć.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}