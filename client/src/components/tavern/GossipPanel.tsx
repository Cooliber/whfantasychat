import { useState } from 'react';
import { MessageCircle, X, Ear, Clock, User, TrendingUp } from 'lucide-react';
import { useTavernStore } from '../../stores/tavernStore';

export function GossipPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { setGossipPanelVisible, getCharacterById } = useTavernStore();

  // Mock gossip data for demonstration
  const mockGossip = [
    {
      id: 'gossip-1',
      content: 'Marcus mówi, że widział dziwne ślady na północy od miasta. Nie są to ślady zwykłych zwierząt...',
      category: 'rumor',
      source: 'marcus-steiner',
      targets: ['wilhelm-scribe'],
      veracity: true,
      spreadCount: 3,
      createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: 'gossip-2', 
      content: 'Lorenzo miał przy sobie dużo złota podczas ostatniej wizyty. Zbyt dużo jak na zwykłego kupca...',
      category: 'secret',
      source: 'greta-ironforge',
      targets: ['balin-goldseeker'],
      veracity: false,
      spreadCount: 1,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 'gossip-3',
      content: 'W kitchenie brakuje najlepszych składników. Ktoś kradnie zapasy na święta!',
      category: 'news',
      source: 'merry-goodbarrel',
      targets: ['rosie-greenhill'],
      veracity: true,
      spreadCount: 5,
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
    },
    {
      id: 'gossip-4',
      content: 'Wilhelm znalazł starożytną księgę o magicznych rytuałach. Mówi, że może przywracać zmarłych...',
      category: 'prophecy',
      source: 'wilhelm-scribe',
      targets: ['aelindra-moonwhisper'],
      veracity: false,
      spreadCount: 2,
      createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    }
  ];

  const categories = [
    { id: 'all', label: 'Wszystkie', icon: '💬' },
    { id: 'rumor', label: 'Plotki', icon: '🗣️' },
    { id: 'secret', label: 'Sekrety', icon: '🤫' },
    { id: 'news', label: 'Wieści', icon: '📰' },
    { id: 'prophecy', label: 'Przepowiednie', icon: '🔮' }
  ];

  const filteredGossip = selectedCategory === 'all' 
    ? mockGossip 
    : mockGossip.filter(g => g.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rumor': return 'bg-yellow-800 text-yellow-200';
      case 'secret': return 'bg-purple-800 text-purple-200';
      case 'news': return 'bg-blue-800 text-blue-200';
      case 'prophecy': return 'bg-green-800 text-green-200';
      default: return 'bg-gray-800 text-gray-200';
    }
  };

  const getVeracityIndicator = (veracity: boolean) => {
    return veracity 
      ? { icon: '✓', label: 'Prawdziwe', color: 'text-green-400' }
      : { icon: '?', label: 'Niepewne', color: 'text-yellow-400' };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours > 0) return `${diffHours} godz. temu`;
    if (diffMinutes > 0) return `${diffMinutes} min. temu`;
    return 'Właśnie teraz';
  };

  return (
    <div className="bg-charcoal bg-opacity-90 backdrop-blur-sm rounded-lg border border-gold border-opacity-30 shadow-2xl max-h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gold border-opacity-30">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-lg text-gold flex items-center gap-2">
            <MessageCircle size={20} />
            Sieć Plotek
          </h3>
          <button
            onClick={() => setGossipPanelVisible(false)}
            className="text-gold hover:text-yellow-400 transition-colors"
            title="Zamknij"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Category filters */}
        <div className="flex gap-1 mt-3 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-xs font-crimson whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gold text-charcoal'
                  : 'bg-wood bg-opacity-50 text-parchment hover:bg-opacity-70'
              }`}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gossip list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredGossip.map((gossip) => {
          const source = getCharacterById(gossip.source);
          const veracity = getVeracityIndicator(gossip.veracity);
          
          return (
            <div 
              key={gossip.id}
              className="glass-morphism p-3 rounded-lg hover:border-gold hover:border-opacity-50 transition-all duration-300"
            >
              {/* Gossip header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-crimson ${getCategoryColor(gossip.category)}`}>
                    {categories.find(c => c.id === gossip.category)?.icon}
                  </span>
                  <div className="flex items-center gap-1">
                    <User size={12} className="text-gold" />
                    <span className="font-crimson text-xs text-gold">
                      {source?.name || 'Nieznane źródło'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 ${veracity.color}`}>
                    <span className="text-xs">{veracity.icon}</span>
                    <span className="font-crimson text-xs">{veracity.label}</span>
                  </div>
                </div>
              </div>

              {/* Gossip content */}
              <p className="font-crimson text-sm text-parchment leading-relaxed mb-2">
                "{gossip.content}"
              </p>

              {/* Gossip footer */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-parchment opacity-60">
                    <Clock size={10} />
                    <span className="font-crimson">{formatTimeAgo(gossip.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-parchment opacity-60">
                    <TrendingUp size={10} />
                    <span className="font-crimson">Rozprzestrzeniło się {gossip.spreadCount}x</span>
                  </div>
                </div>
                <button 
                  className="bg-wood bg-opacity-50 text-parchment px-2 py-1 rounded-full font-crimson hover:bg-opacity-70 transition-colors"
                  title="Przekaż dalej"
                >
                  <Ear size={10} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredGossip.length === 0 && (
          <div className="text-center py-6">
            <div className="text-3xl text-gold opacity-50 mb-2">🤐</div>
            <p className="font-crimson text-parchment opacity-80 text-sm">
              {selectedCategory === 'all' 
                ? 'Brak plotek w tawernie... na razie' 
                : `Brak plotek w kategorii "${categories.find(c => c.id === selectedCategory)?.label}"`}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gold border-opacity-30">
        <p className="text-xs text-parchment opacity-60 font-crimson text-center">
          Plotki rozprzestrzeniają się automatycznie podczas rozmów
        </p>
      </div>
    </div>
  );
}