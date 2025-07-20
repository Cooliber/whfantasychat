import { useState, useEffect, useRef } from 'react';
import { Crown, Users, MessageCircle, Scroll, Send, Wifi, WifiOff } from 'lucide-react';

interface ConversationMessage {
  characterId: string;
  message: string;
  timestamp: Date;
}

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  personality: string;
  background: string;
  speakingStyle: string;
}

export default function LiveTavern() {
  const [currentScene, setCurrentScene] = useState('Cichy Wieczór');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  const scenes = [
    {
      name: 'Cichy Wieczór',
      description: 'Spokojny wieczór w tawernie. Płomyki świec migocą w ciemności, a tylko nieliczni goście siedzą przy drewnianych stołach.',
      atmosphere: 'Spokojny, intymny, tajemniczy',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600'
    },
    {
      name: 'Dzień Targowy', 
      description: 'Tawerna tętni życiem w dzień targowy. Kupcy, rzemieślnicy i podróżnicy wypełniają każdy kąt.',
      atmosphere: 'Energiczny, hałaśliwy, handlowy',
      image: 'https://images.unsplash.com/photo-1595846519845-68e85c0c9788?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600'
    },
    {
      name: 'Noc Burzy',
      description: 'Dzika burza szaleje na zewnątrz, a błyskawice oświetlają okna tawerny.',
      atmosphere: 'Dramatyczny, solidarny, przygodowy', 
      image: 'https://images.unsplash.com/photo-1500740516770-92bd004b996e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600'
    }
  ];

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to tavern WebSocket');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      ws.onclose = () => {
        console.log('Disconnected from tavern WebSocket');
        setWsConnected(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Load characters from API
  useEffect(() => {
    fetch('/api/tavern/characters')
      .then(res => res.json())
      .then(data => {
        if (data.characters) {
          setCharacters(data.characters);
          setSelectedCharacter(data.characters[0]?.id || '');
        }
      })
      .catch(err => console.error('Failed to load characters:', err));
  }, []);

  // Auto-scroll conversations
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversations]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'welcome':
        console.log('Welcome to tavern:', data.message);
        break;
        
      case 'auto-conversation':
        const newMessages = data.messages.map((msg: any) => ({
          characterId: msg.characterId,
          message: msg.message,
          timestamp: new Date(msg.timestamp)
        }));
        setConversations(prev => [...prev, ...newMessages]);
        break;
        
      case 'conversation-started':
        const startedMessages = data.messages.map((msg: any) => ({
          characterId: msg.characterId,
          message: msg.message,
          timestamp: new Date(msg.timestamp)
        }));
        setConversations(prev => [...prev, ...startedMessages]);
        break;
        
      case 'character-response':
        const responseMessage = {
          characterId: data.characterId,
          message: data.response,
          timestamp: new Date(data.timestamp)
        };
        setConversations(prev => [...prev, responseMessage]);
        break;
    }
  };

  const sendSceneChange = (scene: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'scene-change',
        scene: scene
      }));
    }
    setCurrentScene(scene);
  };

  const sendUserMessage = () => {
    if (!userMessage.trim() || !selectedCharacter || !wsRef.current) return;

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send-message',
        characterId: selectedCharacter,
        prompt: userMessage
      }));

      // Add user message to conversation
      setConversations(prev => [...prev, {
        characterId: 'player',
        message: userMessage,
        timestamp: new Date()
      }]);

      setUserMessage('');
    }
  };

  const startConversation = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const randomCharacters = characters
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + Math.floor(Math.random() * 2));

    wsRef.current.send(JSON.stringify({
      type: 'start-conversation',
      participantIds: randomCharacters.map(c => c.id),
      recentEvents: ['Player joined the conversation'],
      conversationHistory: conversations.slice(-5)
    }));
  };

  const getCharacterById = (id: string) => {
    return characters.find(c => c.id === id);
  };

  const getCharacterAvatar = (characterId: string) => {
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

  const currentSceneData = scenes.find(s => s.name === currentScene) || scenes[0];

  return (
    <div className="min-h-screen bg-charcoal text-parchment">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-gold border-opacity-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Crown className="text-gold text-3xl" />
              <div className="flex flex-col">
                <span className="font-cinzel text-2xl font-bold text-gold">
                  Warhammer Fantasy Tavern
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-crimson text-sm text-parchment opacity-80">
                    {currentScene}
                  </span>
                  {wsConnected ? (
                    <div className="flex items-center gap-1 text-green-400">
                      <Wifi size={16} />
                      <span className="text-xs">Live</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-400">
                      <WifiOff size={16} />
                      <span className="text-xs">Offline</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <select
                value={currentScene}
                onChange={(e) => sendSceneChange(e.target.value)}
                className="bg-charcoal bg-opacity-70 border border-gold border-opacity-30 rounded-lg px-4 py-2 text-parchment font-crimson focus:border-gold focus:outline-none"
              >
                {scenes.map((scene) => (
                  <option key={scene.name} value={scene.name}>
                    {scene.name}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={startConversation}
                disabled={!wsConnected}
                className="flex items-center gap-2 bg-gold text-charcoal px-4 py-2 rounded-lg font-crimson font-semibold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50"
              >
                <MessageCircle size={20} />
                Rozpocznij Rozmowę AI
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 flex">
        {/* Scene and Conversation Area */}
        <div className="flex-1">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={currentSceneData.image}
              alt={`Scena: ${currentSceneData.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent"></div>
            <div className="absolute inset-0 flex items-end p-6">
              <div className="max-w-4xl">
                <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-gold mb-3">
                  {currentSceneData.name}
                </h1>
                <p className="font-crimson text-lg text-parchment leading-relaxed mb-4">
                  {currentSceneData.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-gold font-crimson text-sm">Atmosfera:</span>
                  <span className="bg-wood text-parchment px-3 py-1 rounded-full text-sm font-crimson">
                    {currentSceneData.atmosphere}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Conversation Area */}
          <div className="p-6">
            <div className="glass-morphism rounded-lg">
              <div className="p-4 border-b border-gold border-opacity-30">
                <div className="flex justify-between items-center">
                  <h2 className="font-cinzel text-xl text-gold flex items-center gap-2">
                    <MessageCircle size={24} />
                    Żywe Rozmowy w Tawernie
                    {wsConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveModal('scenes')}
                      className="text-sm bg-wood text-parchment px-3 py-1 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                      <Scroll size={16} className="inline mr-1" />
                      Sceny
                    </button>
                    <button
                      onClick={() => setActiveModal('stories')}
                      className="text-sm bg-wood text-parchment px-3 py-1 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                      <Scroll size={16} className="inline mr-1" />
                      Wątki
                    </button>
                    <button
                      onClick={() => setActiveModal('gossip')}
                      className="text-sm bg-wood text-parchment px-3 py-1 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                      <MessageCircle size={16} className="inline mr-1" />
                      Plotki
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversation Display */}
              <div 
                ref={conversationRef}
                className="h-96 overflow-y-auto p-4 space-y-4"
              >
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle size={48} className="text-gold mb-4 opacity-50 mx-auto" />
                    <p className="font-crimson text-parchment opacity-80">
                      {wsConnected 
                        ? "Rozmowy AI pojawią się tutaj automatycznie co 45 sekund..." 
                        : "Łączenie z tawerną..."}
                    </p>
                  </div>
                ) : (
                  conversations.map((msg, index) => {
                    const character = getCharacterById(msg.characterId);
                    const isPlayer = msg.characterId === 'player';
                    
                    return (
                      <div 
                        key={index}
                        className={`flex items-start gap-3 ${isPlayer ? 'justify-end' : ''}`}
                      >
                        {!isPlayer && (
                          <div className="text-2xl">{getCharacterAvatar(msg.characterId)}</div>
                        )}
                        <div className={`glass-morphism rounded-lg p-3 max-w-md ${isPlayer ? 'bg-gold bg-opacity-20' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-cinzel text-sm text-gold">
                              {isPlayer ? 'Ty' : character?.name || msg.characterId}
                            </span>
                            <span className="text-xs text-parchment opacity-60">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="font-crimson text-sm text-parchment">
                            {msg.message}
                          </p>
                        </div>
                        {isPlayer && (
                          <div className="text-2xl">{getCharacterAvatar(msg.characterId)}</div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* User Input */}
              <div className="p-4 border-t border-gold border-opacity-30">
                <div className="flex gap-3">
                  <select
                    value={selectedCharacter}
                    onChange={(e) => setSelectedCharacter(e.target.value)}
                    className="bg-charcoal border border-gold border-opacity-30 rounded-lg px-3 py-2 text-parchment font-crimson text-sm focus:border-gold focus:outline-none"
                  >
                    {characters.map((char) => (
                      <option key={char.id} value={char.id}>
                        Rozmawiaj z {char.name}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendUserMessage()}
                      placeholder="Napisz wiadomość do postaci..."
                      className="flex-1 bg-charcoal border border-gold border-opacity-30 rounded-lg px-4 py-2 text-parchment font-crimson text-sm focus:border-gold focus:outline-none"
                      disabled={!wsConnected}
                    />
                    <button
                      onClick={sendUserMessage}
                      disabled={!wsConnected || !userMessage.trim()}
                      className="bg-gold text-charcoal px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Character Panel */}
        <div className="w-80 border-l border-gold border-opacity-30">
          <div className="h-full bg-charcoal bg-opacity-50">
            <div className="p-4 border-b border-gold border-opacity-30">
              <h2 className="font-cinzel text-xl text-gold mb-4 flex items-center gap-2">
                <Users size={24} />
                Postacie AI ({characters.length})
              </h2>
            </div>

            <div className="p-4 space-y-3 max-h-screen overflow-y-auto">
              {characters.map((character) => (
                <div 
                  key={character.id}
                  className="glass-morphism p-4 rounded-lg hover:border-gold hover:border-opacity-50 transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveModal(`character-${character.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCharacterAvatar(character.id)}</div>
                      <div>
                        <h3 className="font-cinzel text-lg text-gold leading-tight">
                          {character.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-wood text-parchment px-2 py-1 rounded-full text-xs font-crimson">
                            {character.class}
                          </span>
                          <span className="text-xs text-parchment opacity-60 font-crimson">
                            {character.race}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="font-crimson text-sm text-parchment leading-relaxed line-clamp-3 mb-3">
                    {character.background}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCharacter(character.id);
                    }}
                    className="w-full bg-gold text-charcoal py-2 px-3 rounded-lg font-crimson text-sm font-semibold hover:bg-yellow-400 transition-colors duration-300"
                  >
                    Wybierz do Rozmowy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border-2 border-gold border-opacity-50 rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-cinzel text-2xl text-gold">
                {activeModal === 'scenes' ? 'Sceny Tawerny' :
                 activeModal === 'stories' ? 'Wątki Fabularne' :
                 activeModal === 'gossip' ? 'Plotki i Pogłoski' :
                 'Szczegóły Postaci'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gold hover:text-yellow-400 transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="font-crimson text-parchment">
              {activeModal === 'scenes' && (
                <div className="space-y-4">
                  <p className="mb-4">Wybierz scenę, aby zmienić atmosferę tawerny i wpłynąć na rozmowy AI:</p>
                  {scenes.map((scene) => (
                    <div key={scene.name} className="glass-morphism p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-cinzel text-lg text-gold">{scene.name}</h3>
                        <button
                          onClick={() => {
                            sendSceneChange(scene.name);
                            setActiveModal(null);
                          }}
                          className="bg-gold text-charcoal px-3 py-1 rounded text-sm hover:bg-yellow-400"
                        >
                          Wybierz
                        </button>
                      </div>
                      <p className="text-sm mb-2">{scene.description}</p>
                      <span className="text-xs bg-wood px-2 py-1 rounded-full">{scene.atmosphere}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'stories' && (
                <div className="space-y-4">
                  <p className="mb-4">Aktualne wątki fabularne rozwijające się w tawernie:</p>
                  
                  <div className="glass-morphism p-4 rounded-lg">
                    <h3 className="font-cinzel text-lg text-gold mb-2">Zagrożenie z Północy</h3>
                    <p className="text-sm mb-3">
                      Dziwne bestie pojawiają się na północnych granicach. Mieszkańcy mówią o strasznych wyciach w nocy. 
                      Marcus Steiner przyniósł niepokojące raporty, a Wilhelm von Schreiber bada starożytne manuskrypty 
                      szukając odpowiedzi.
                    </p>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-wood px-2 py-1 rounded-full">Aktywny</span>
                      <span className="text-xs bg-red-800 px-2 py-1 rounded-full">Wysokie Zagrożenie</span>
                    </div>
                    <div className="text-xs text-gold">
                      Uczestnicy: Marcus Steiner, Wilhelm von Schreiber
                    </div>
                  </div>

                  <div className="glass-morphism p-4 rounded-lg">
                    <h3 className="font-cinzel text-lg text-gold mb-2">Zaginiony Kupiec</h3>
                    <p className="text-sm mb-3">
                      Lorenzo Złota Ręka nie wrócił z ostatniej podróży handlowej. Jego towar był cenny i budzi podejrzenia. 
                      Greta Ironforge prowadzi nieoficjalne śledztwo.
                    </p>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-wood px-2 py-1 rounded-full">Aktywny</span>
                      <span className="text-xs bg-yellow-800 px-2 py-1 rounded-full">Tajemnica</span>
                    </div>
                    <div className="text-xs text-gold">
                      Uczestnicy: Greta Ironforge, Balin Goldseeker
                    </div>
                  </div>

                  <div className="glass-morphism p-4 rounded-lg">
                    <h3 className="font-cinzel text-lg text-gold mb-2">Starożytne Sekrety</h3>
                    <p className="text-sm mb-3">
                      Aelindra Moonwhisper odkryła niepokojące znaki w lesie. Natura sama ostrzega przed nadchodzącym zagrożeniem. 
                      Czy to ma związek z północnymi bestiami?
                    </p>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-wood px-2 py-1 rounded-full">Nowy</span>
                      <span className="text-xs bg-purple-800 px-2 py-1 rounded-full">Magia</span>
                    </div>
                    <div className="text-xs text-gold">
                      Uczestnicy: Aelindra Moonwhisper
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'gossip' && (
                <div className="space-y-4">
                  <p className="mb-4">Najświeższe plotki krążące po tawernie:</p>
                  
                  <div className="glass-morphism p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gold text-sm font-semibold">🗨️ Plotka</span>
                      <span className="text-xs opacity-60">30 minut temu</span>
                    </div>
                    <p className="text-sm">
                      "Marcus widział dziwne ślady na północy od miasta. Nie są to ślady zwykłych zwierząt... 
                      Coś większego i bardziej inteligentnego."
                    </p>
                    <div className="text-xs mt-2 opacity-80">
                      Źródło: Marcus Steiner → Wilhelm von Schreiber
                    </div>
                  </div>

                  <div className="glass-morphism p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gold text-sm font-semibold">🤫 Sekret</span>
                      <span className="text-xs opacity-60">2 godziny temu</span>
                    </div>
                    <p className="text-sm">
                      "Lorenzo miał przy sobie dużo złota podczas ostatniej wizyty. Zbyt dużo jak na zwykłego kupca. 
                      Skąd ma tyle bogactw?"
                    </p>
                    <div className="text-xs mt-2 opacity-80">
                      Źródło: Greta Ironforge → Balin Goldseeker
                    </div>
                  </div>

                  <div className="glass-morphism p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gold text-sm font-semibold">📰 Wiadomości</span>
                      <span className="text-xs opacity-60">4 godziny temu</span>
                    </div>
                    <p className="text-sm">
                      "Aelindra spędza dużo czasu w lesie ostatnio. Mówi coś o 'znakach natury' i 'starożytnych ostrzeżeniach'. 
                      Czy elfy wiedzą coś, czego my nie wiemy?"
                    </p>
                    <div className="text-xs mt-2 opacity-80">
                      Źródło: Mieszkańcy tawerny
                    </div>
                  </div>

                  <div className="glass-morphism p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gold text-sm font-semibold">⚔️ Konflikt</span>
                      <span className="text-xs opacity-60">6 godzin temu</span>
                    </div>
                    <p className="text-sm">
                      "Między Gretą a Balinem rośnie napięcie. Polityka klanów karłów zaczyna wpływać na local business. 
                      Ktoś będzie musiał to rozwiązać."
                    </p>
                    <div className="text-xs mt-2 opacity-80">
                      Obserwacje: Stali bywalcy tawerny
                    </div>
                  </div>
                </div>
              )}

              {activeModal && activeModal.startsWith('character-') && (
                (() => {
                  const characterId = activeModal.split('-')[1];
                  const character = characters.find(c => c.id === characterId);
                  return character ? (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl">{getCharacterAvatar(character.id)}</div>
                        <div>
                          <h3 className="font-cinzel text-xl text-gold">{character.name}</h3>
                          <p className="text-sm opacity-80">{character.race} {character.class}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-gold font-semibold mb-2">Historia</h4>
                          <p className="text-sm">{character.background}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-gold font-semibold mb-2">Osobowość</h4>
                          <p className="text-sm">{character.personality}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-gold font-semibold mb-2">Styl Mówienia</h4>
                          <p className="text-sm">{character.speakingStyle}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gold border-opacity-30">
                        <button
                          onClick={() => {
                            setSelectedCharacter(character.id);
                            setActiveModal(null);
                          }}
                          className="w-full bg-gold text-charcoal py-3 px-4 rounded-lg font-crimson font-semibold hover:bg-yellow-400 transition-colors duration-300"
                        >
                          Rozpocznij Rozmowę z {character.name}
                        </button>
                      </div>
                    </div>
                  ) : <p>Postać nie znaleziona</p>;
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}