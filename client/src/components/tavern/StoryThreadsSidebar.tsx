import { useState } from 'react';
import { Scroll, X, Plus, Clock, Users, ChevronRight } from 'lucide-react';
import { useTavernStore } from '../../stores/tavernStore';

export function StoryThreadsSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { setStoryThreadsVisible, getCharacterById } = useTavernStore();

  const mockStoryThreads = [
    {
      id: 'threat-north',
      title: 'Zagrożenie z Północy',
      description: 'Dziwne bestie pojawiają się na północnych granicach. Mieszkańcy mówią o strasznych wycach w nocy.',
      status: 'active' as const,
      participants: ['marcus-steiner', 'wilhelm-scribe'],
      scenes: ['Storm Night', 'Mysterious Gathering'] as any,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      progressMarkers: [
        {
          description: 'Pierwszy raport o bestii',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          involvedCharacters: ['marcus-steiner']
        },
        {
          description: 'Badanie starożytnych manuskryptów',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          involvedCharacters: ['wilhelm-scribe']
        }
      ]
    },
    {
      id: 'missing-merchant',
      title: 'Zaginiony Kupiec',
      description: 'Lorenzo nie wrócił z ostatniej podróży handlowej. Jego towar był cenny i budzi podejrzenia.',
      status: 'active' as const,
      participants: ['greta-ironforge'],
      scenes: ['Busy Market Day'] as any,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      progressMarkers: [
        {
          description: 'Ostatnie widzenia w tawernie',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          involvedCharacters: ['greta-ironforge']
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-800 text-green-200';
      case 'completed': return 'bg-blue-800 text-blue-200';
      case 'paused': return 'bg-yellow-800 text-yellow-200';
      default: return 'bg-gray-800 text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktywny';
      case 'completed': return 'Zakończony';
      case 'paused': return 'Wstrzymany';
      default: return 'Nieznany';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} dni temu`;
    if (diffHours > 0) return `${diffHours} godz. temu`;
    return 'Właśnie teraz';
  };

  return (
    <div className="h-full bg-charcoal bg-opacity-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gold border-opacity-30">
        <div className="flex items-center justify-between">
          <h2 className="font-cinzel text-lg text-gold flex items-center gap-2">
            <Scroll size={20} />
            Wątki Fabularne
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gold hover:text-yellow-400 transition-colors"
              title={isExpanded ? "Zwiń" : "Rozwiń"}
            >
              <ChevronRight 
                size={16} 
                className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              />
            </button>
            <button
              onClick={() => setStoryThreadsVisible(false)}
              className="text-gold hover:text-yellow-400 transition-colors md:hidden"
              title="Zamknij"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <p className="font-crimson text-sm text-parchment opacity-80 mt-2">
            Śledź rozwój opowieści i intrygujących wątków
          </p>
        )}
      </div>

      {isExpanded && (
        <>
          {/* Story threads list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockStoryThreads.map((thread) => (
              <div 
                key={thread.id}
                className="glass-morphism p-4 rounded-lg hover:border-gold hover:border-opacity-50 transition-all duration-300 cursor-pointer"
              >
                {/* Thread header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-cinzel text-base text-gold leading-tight">
                    {thread.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-crimson ${getStatusColor(thread.status)}`}>
                    {getStatusLabel(thread.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="font-crimson text-sm text-parchment leading-relaxed mb-3">
                  {thread.description}
                </p>

                {/* Participants */}
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-gold" />
                  <div className="flex flex-wrap gap-1">
                    {thread.participants.map((participantId) => {
                      const character = getCharacterById(participantId);
                      return (
                        <span 
                          key={participantId}
                          className="bg-wood bg-opacity-50 text-parchment px-2 py-1 rounded-full text-xs font-crimson"
                        >
                          {character?.name || 'Nieznana Postać'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Latest progress */}
                {thread.progressMarkers.length > 0 && (
                  <div className="border-t border-gold border-opacity-20 pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={12} className="text-gold" />
                      <span className="font-crimson text-xs text-gold">
                        Ostatnia aktualizacja: {formatTimeAgo(thread.updatedAt)}
                      </span>
                    </div>
                    <p className="font-crimson text-xs text-parchment opacity-80">
                      {thread.progressMarkers[thread.progressMarkers.length - 1].description}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {mockStoryThreads.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl text-gold opacity-50 mb-3">📜</div>
                <p className="font-crimson text-parchment opacity-80 text-sm">
                  Brak aktywnych wątków fabularnych.
                  Rozpocznij rozmowy, aby utworzyć nowe historie!
                </p>
              </div>
            )}
          </div>

          {/* Add new thread button */}
          <div className="p-4 border-t border-gold border-opacity-30">
            <button className="w-full bg-gold text-charcoal py-2 px-3 rounded-lg font-crimson text-sm font-semibold hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center gap-2">
              <Plus size={16} />
              Nowy Wątek
            </button>
            
            <p className="text-xs text-parchment opacity-60 font-crimson text-center mt-2">
              Wątki powstają automatycznie podczas rozmów
            </p>
          </div>
        </>
      )}
    </div>
  );
}