import { useState } from 'react';
import { Menu, X, Crown, Scroll, Users, MessageCircle } from 'lucide-react';
import { useTavernStore, useCurrentScene } from '../../stores/tavernStore';
import { SceneType } from '../../types/warhammer.types';

export function TavernNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentScene = useCurrentScene();
  const { triggerSceneTransition, setStoryThreadsVisible, setGossipPanelVisible } = useTavernStore();

  const sceneOptions: { label: string; value: SceneType }[] = [
    { label: 'Cichy Wieczór', value: 'Quiet Evening' },
    { label: 'Dzień Targowy', value: 'Busy Market Day' },
    { label: 'Noc Burzy', value: 'Storm Night' },
    { label: 'Świętowanie Festiwalu', value: 'Festival Celebration' },
    { label: 'Tajemnicze Zgromadzenie', value: 'Mysterious Gathering' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-gold border-opacity-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and title */}
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
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Scene selector */}
            <div className="relative">
              <select
                value={currentScene}
                onChange={(e) => triggerSceneTransition(e.target.value as SceneType)}
                className="bg-charcoal bg-opacity-70 border border-gold border-opacity-30 rounded-lg px-4 py-2 text-parchment font-crimson focus:border-gold focus:outline-none"
              >
                {sceneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={() => setStoryThreadsVisible(true)}
              className="flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson"
            >
              <Scroll size={20} />
              Wątki Fabularne
            </button>
            
            <button
              onClick={() => setGossipPanelVisible(true)}
              className="flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson"
            >
              <MessageCircle size={20} />
              Plotki
            </button>
            
            <button className="flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson">
              <Users size={20} />
              Postacie
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gold text-xl"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-charcoal bg-opacity-95 rounded-lg mt-2 p-4 border border-gold border-opacity-20">
            <div className="flex flex-col space-y-4">
              {/* Mobile scene selector */}
              <div>
                <label className="text-gold font-crimson text-sm mb-2 block">
                  Zmień Scenę:
                </label>
                <select
                  value={currentScene}
                  onChange={(e) => {
                    triggerSceneTransition(e.target.value as SceneType);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-charcoal bg-opacity-70 border border-gold border-opacity-30 rounded-lg px-4 py-2 text-parchment font-crimson focus:border-gold focus:outline-none"
                >
                  {sceneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => {
                  setStoryThreadsVisible(true);
                  setIsMenuOpen(false);
                }}
                className="text-left flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson"
              >
                <Scroll size={20} />
                Wątki Fabularne
              </button>
              
              <button
                onClick={() => {
                  setGossipPanelVisible(true);
                  setIsMenuOpen(false);
                }}
                className="text-left flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson"
              >
                <MessageCircle size={20} />
                Plotki
              </button>
              
              <button className="text-left flex items-center gap-2 text-parchment hover:text-gold transition-colors duration-300 font-crimson">
                <Users size={20} />
                Postacie
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}