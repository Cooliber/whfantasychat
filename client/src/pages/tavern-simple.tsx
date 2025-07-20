import { useState, useEffect } from 'react';
import { Crown, Users, MessageCircle, Scroll } from 'lucide-react';

export default function SimpleTavern() {
  const [currentScene, setCurrentScene] = useState('Cichy Wieczór');
  const [activeModal, setActiveModal] = useState<string | null>(null);

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

  const characters = [
    {
      id: 'wilhelm',
      name: 'Wilhelm von Schreiber',
      race: 'Empire',
      class: 'Scholar',
      description: 'Starzec Wilhelm to uczony ze Starego Świata, który poświęcił życie badaniu starożytnych manuskryptów.',
      avatar: '📚'
    },
    {
      id: 'greta',
      name: 'Greta Żelazna Kuźnia',
      race: 'Dwarf',
      class: 'Blacksmith',
      description: 'Greta jest najlepszą kowalką w okolicy. Jej młot kuje nie tylko broń, ale także narzędzia.',
      avatar: '🔨'
    },
    {
      id: 'aelindra',
      name: 'Aelindra Szept Księżyca',
      race: 'Elf',
      class: 'Mage',
      description: 'Tajemnicza elfka, która przybyła z dalekich lasów. Włada magią natury.',
      avatar: '🏹'
    }
  ];

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
                <span className="font-crimson text-sm text-parchment opacity-80">
                  {currentScene}
                </span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <select
                value={currentScene}
                onChange={(e) => setCurrentScene(e.target.value)}
                className="bg-charcoal bg-opacity-70 border border-gold border-opacity-30 rounded-lg px-4 py-2 text-parchment font-crimson focus:border-gold focus:outline-none"
              >
                {scenes.map((scene) => (
                  <option key={scene.name} value={scene.name}>
                    {scene.name}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={() => setActiveModal('stories')}
                className="flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson"
              >
                <Scroll size={20} />
                Wątki Fabularne
              </button>
              
              <button 
                onClick={() => setActiveModal('gossip')}
                className="flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson"
              >
                <MessageCircle size={20} />
                Plotki
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 flex">
        {/* Scene Display */}
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

          {/* Conversation Area */}
          <div className="p-6">
            <div className="glass-morphism rounded-lg p-6">
              <div className="text-center py-8">
                <MessageCircle size={64} className="text-gold mb-4 opacity-50 mx-auto" />
                <h3 className="font-cinzel text-2xl text-gold mb-3">
                  Witaj w Tawernie!
                </h3>
                <p className="font-crimson text-parchment opacity-80 mb-6 max-w-md mx-auto">
                  To jest demonstracja aplikacji Warhammer Fantasy Tavern. 
                  Wybierz postać z panelu po prawej stronie, aby rozpocząć rozmowę.
                </p>
                <button
                  onClick={() => setActiveModal('demo')}
                  className="bg-gold text-charcoal px-6 py-3 rounded-lg font-crimson font-semibold hover:bg-yellow-400 transition-colors duration-300"
                >
                  Rozpocznij Rozmowę Demo
                </button>
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
                Postacie w Tawernie
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {characters.map((character) => (
                <div 
                  key={character.id}
                  className="glass-morphism p-4 rounded-lg hover:border-gold hover:border-opacity-50 transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveModal(`character-${character.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{character.avatar}</div>
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

                  <p className="font-crimson text-sm text-parchment leading-relaxed mb-3">
                    {character.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal(`conversation-${character.id}`);
                    }}
                    className="w-full bg-gold text-charcoal py-2 px-3 rounded-lg font-crimson text-sm font-semibold hover:bg-yellow-400 transition-colors duration-300"
                  >
                    Rozpocznij Rozmowę
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border-2 border-gold border-opacity-50 rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-cinzel text-2xl text-gold">
                {activeModal.startsWith('character-') ? 'Szczegóły Postaci' :
                 activeModal.startsWith('conversation-') ? 'Rozmowa' :
                 activeModal === 'demo' ? 'Demo Rozmowy' :
                 activeModal === 'stories' ? 'Wątki Fabularne' :
                 activeModal === 'gossip' ? 'Plotki' : 'Modal'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gold hover:text-yellow-400 transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="font-crimson text-parchment">
              {activeModal === 'demo' && (
                <div>
                  <p className="mb-4">
                    Witaj w demonstracji Warhammer Fantasy Tavern! Ta aplikacja symuluje immersyjne środowisko tawerny 
                    z AI-powered postaciami, rozmowami w czasie rzeczywistym i śledzeniem relacji między postaciami.
                  </p>
                  <div className="bg-wood bg-opacity-30 rounded-lg p-4 mb-4">
                    <h3 className="font-cinzel text-lg text-gold mb-2">Funkcje Aplikacji:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• 17 unikalnych postaci AI z różnymi osobowościami</li>
                      <li>• Automatyczne rozmowy co 2-5 minut</li>
                      <li>• System relacji między postaciami</li>
                      <li>• Dynamiczne wątki fabularne</li>
                      <li>• Sieć plotek i informacji</li>
                      <li>• 5 różnych scen z własnymi atmosferami</li>
                    </ul>
                  </div>
                  <p className="text-sm opacity-80">
                    Kliknij na którąkolwiek postać, aby rozpocząć rozmowę lub zmień scenę, 
                    aby zobaczyć różne atmosfery tawerny.
                  </p>
                </div>
              )}
              
              {activeModal.startsWith('conversation-') && (
                <div>
                  <p className="mb-4">
                    Tutaj rozpocząłbyś rozmowę z wybraną postacią. W pełnej wersji aplikacji, 
                    AI postaci odpowiadałyby na podstawie swojej osobowości i kontekstu sceny.
                  </p>
                  <div className="bg-wood bg-opacity-30 rounded-lg p-4">
                    <p className="text-sm">
                      💡 Demo: Rozmowy byłyby obsługiwane przez OpenAI API, 
                      z każdą postacią mającą unikalny profil i styl odpowiedzi.
                    </p>
                  </div>
                </div>
              )}
              
              {activeModal === 'stories' && (
                <div>
                  <h3 className="font-cinzel text-lg text-gold mb-3">Aktywne Wątki Fabularne</h3>
                  <div className="space-y-3">
                    <div className="glass-morphism p-3 rounded-lg">
                      <h4 className="text-gold font-semibold">Zagrożenie z Północy</h4>
                      <p className="text-sm opacity-80 mt-1">
                        Dziwne bestie pojawiają się na północnych granicach. 
                        Marcus i Wilhelm badają sprawę.
                      </p>
                    </div>
                    <div className="glass-morphism p-3 rounded-lg">
                      <h4 className="text-gold font-semibold">Zaginiony Kupiec</h4>
                      <p className="text-sm opacity-80 mt-1">
                        Lorenzo nie wrócił z ostatniej podróży handlowej. 
                        Greta prowadzi śledztwo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeModal === 'gossip' && (
                <div>
                  <h3 className="font-cinzel text-lg text-gold mb-3">Najnowsze Plotki</h3>
                  <div className="space-y-3">
                    <div className="glass-morphism p-3 rounded-lg">
                      <p className="text-sm">
                        💬 "Marcus widział dziwne ślady na północy od miasta..."
                      </p>
                      <div className="text-xs opacity-60 mt-1">30 minut temu</div>
                    </div>
                    <div className="glass-morphism p-3 rounded-lg">
                      <p className="text-sm">
                        🤫 "Lorenzo miał przy sobie zbyt dużo złota..."
                      </p>
                      <div className="text-xs opacity-60 mt-1">2 godziny temu</div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeModal.startsWith('character-') && (
                <div>
                  {(() => {
                    const characterId = activeModal.split('-')[1];
                    const character = characters.find(c => c.id === characterId);
                    return character ? (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-4xl">{character.avatar}</div>
                          <div>
                            <h3 className="font-cinzel text-xl text-gold">{character.name}</h3>
                            <p className="text-sm opacity-80">{character.race} {character.class}</p>
                          </div>
                        </div>
                        <p className="mb-4">{character.description}</p>
                        <div className="bg-wood bg-opacity-30 rounded-lg p-4">
                          <p className="text-sm">
                            W pełnej aplikacji tutaj znajdowałyby się szczegółowe informacje o postaci, 
                            jej umiejętnościach, sekretach i celach.
                          </p>
                        </div>
                      </div>
                    ) : <p>Postać nie znaleziona</p>;
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}