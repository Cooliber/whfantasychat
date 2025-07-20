import { useState, useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useTavernStore, useCurrentScene } from '../../stores/tavernStore';
import { SceneType } from '../../types/warhammer.types';

export function SceneTransitionModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [pendingScene, setPendingScene] = useState<SceneType | null>(null);
  const currentScene = useCurrentScene();
  const { sceneTransitionCooldown, setCurrentScene } = useTavernStore();

  // Auto scene transitions every 10-15 minutes
  useEffect(() => {
    const triggerRandomTransition = () => {
      if (sceneTransitionCooldown <= 0) {
        const scenes: SceneType[] = [
          'Quiet Evening',
          'Busy Market Day', 
          'Storm Night',
          'Festival Celebration',
          'Mysterious Gathering'
        ];
        
        const availableScenes = scenes.filter(scene => scene !== currentScene);
        const randomScene = availableScenes[Math.floor(Math.random() * availableScenes.length)];
        
        if (randomScene) {
          setPendingScene(randomScene);
          setCountdown(10); // 10 second countdown
          setIsVisible(true);
        }
      }
    };

    // Random interval between 10-15 minutes
    const minInterval = 10 * 60 * 1000; // 10 minutes
    const maxInterval = 15 * 60 * 1000; // 15 minutes
    const randomInterval = minInterval + Math.random() * (maxInterval - minInterval);

    const interval = setInterval(triggerRandomTransition, randomInterval);
    
    return () => clearInterval(interval);
  }, [currentScene, sceneTransitionCooldown]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && isVisible) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isVisible && pendingScene) {
      // Auto-accept transition
      setCurrentScene(pendingScene);
      handleClose();
    }
  }, [countdown, isVisible, pendingScene, setCurrentScene]);

  const handleAccept = () => {
    if (pendingScene) {
      setCurrentScene(pendingScene);
    }
    handleClose();
  };

  const handleReject = () => {
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setPendingScene(null);
    setCountdown(0);
  };

  const getSceneDescription = (scene: SceneType) => {
    switch (scene) {
      case 'Quiet Evening':
        return 'Wieczór się kończy, większość gości rozeszła się do domów. Atmosfera staje się spokojniejsza i bardziej intymna.';
      case 'Busy Market Day':
        return 'Nadchodzi ożywiony dzień targowy! Kupcy i podróżnicy napływają do tawerny z nowymi towarami i opowieściami.';
      case 'Storm Night':
        return 'Nadciąga gwałtowna burza! Wszyscy szukają schronienia w tawernie, tworząc dramatyczną atmosferę.';
      case 'Festival Celebration':
        return 'Rozpoczyna się lokalne święto! Tawerna ozdobiona jest kolorowymi wstążkami, a wszyscy świętują.';
      case 'Mysterious Gathering':
        return 'Tajemnicze postacie zaczynają się pojawiać. W powietrzu unosi się napięcie i niedopowiedzenia.';
      default:
        return 'Scena się zmienia...';
    }
  };

  const getSceneEmoji = (scene: SceneType) => {
    switch (scene) {
      case 'Quiet Evening': return '🌙';
      case 'Busy Market Day': return '🏪';
      case 'Storm Night': return '⛈️';
      case 'Festival Celebration': return '🎉';
      case 'Mysterious Gathering': return '🔮';
      default: return '✨';
    }
  };

  if (!isVisible || !pendingScene) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-charcoal border-2 border-gold border-opacity-50 rounded-lg max-w-md w-full p-6 text-center">
        {/* Transition icon */}
        <div className="text-6xl mb-4">
          {getSceneEmoji(pendingScene)}
        </div>
        
        {/* Title */}
        <h2 className="font-cinzel text-2xl text-gold mb-3">
          Zmiana Sceny
        </h2>
        
        {/* Description */}
        <p className="font-crimson text-parchment mb-6 leading-relaxed">
          {getSceneDescription(pendingScene)}
        </p>
        
        {/* Scene transition preview */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="font-crimson text-sm text-gold bg-wood bg-opacity-30 px-3 py-1 rounded-full">
            {currentScene}
          </span>
          <ArrowRight size={20} className="text-gold" />
          <span className="font-crimson text-sm text-gold bg-gold bg-opacity-20 px-3 py-1 rounded-full">
            {pendingScene}
          </span>
        </div>
        
        {/* Countdown */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock size={16} className="text-gold" />
          <span className="font-crimson text-gold">
            Automatyczne przejście za {countdown} sekund
          </span>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="flex-1 bg-wood text-parchment py-3 px-4 rounded-lg font-crimson font-semibold hover:bg-opacity-80 transition-colors duration-300"
          >
            Zostań w obecnej scenie
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-gold text-charcoal py-3 px-4 rounded-lg font-crimson font-semibold hover:bg-yellow-400 transition-colors duration-300"
          >
            Przejdź teraz
          </button>
        </div>
        
        {/* Info */}
        <p className="font-crimson text-xs text-parchment opacity-60 mt-4">
          Sceny zmieniają się automatycznie co 10-15 minut
        </p>
      </div>
    </div>
  );
}