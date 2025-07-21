import { useTavernStore } from '../../stores/tavernStore';
import { SceneType } from '../../types/warhammer.types';

interface SceneDisplayProps {
  scene: SceneType;
}

export function SceneDisplay({ scene }: SceneDisplayProps) {
  const { getSceneByType, triggerSceneTransition } = useTavernStore();
  const sceneData = getSceneByType(scene);

  if (!sceneData) {
    return (
      <div className="h-48 bg-charcoal flex items-center justify-center">
        <p className="text-parchment font-crimson">Ładowanie sceny...</p>
      </div>
    );
  }

  const getSceneImage = (sceneName: string) => {
    switch (sceneName) {
      case 'Cichy Wieczór':
        return 'https://cdn.pixabay.com/photo/2025/06/07/04/59/medieval-tavern-9645918_1280.png';
      case 'Dzień Targowy':
        return 'https://cdn.pixabay.com/photo/2019/02/19/23/14/fairy-4008036_1280.png';
      case 'Noc Burzy':
        return 'https://cdn.pixabay.com/photo/2025/07/13/07/30/ai-generated-9711734_1280.png';
      case 'Świętowanie Festiwalu':
        return 'https://cdn.pixabay.com/photo/2019/02/19/23/14/fairy-4008036_1280.png';
      case 'Tajemnicze Zgromadzenie':
        return 'https://cdn.pixabay.com/photo/2025/06/07/04/59/medieval-tavern-9645918_1280.png';
      default:
        return 'https://cdn.pixabay.com/photo/2025/06/07/04/59/medieval-tavern-9645918_1280.png';
    }
  };

  return (
    <div className="relative h-48 overflow-hidden">
      {/* Background image */}
      <img 
        src={getSceneImage(sceneData.name)} 
        alt={`Scena: ${sceneData.name}`}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent"></div>
      
      {/* Scene content */}
      <div className="absolute inset-0 flex items-end p-6">
        <div className="max-w-4xl">
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-gold mb-3">
            {sceneData.name}
          </h1>
          <p className="font-crimson text-lg text-parchment leading-relaxed mb-4">
            {sceneData.description}
          </p>
          
          {/* Atmosphere and available actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-gold font-crimson text-sm">Atmosfera:</span>
              <span className="bg-wood text-parchment px-3 py-1 rounded-full text-sm font-crimson">
                {sceneData.atmosphere}
              </span>
            </div>
            
            {/* Available actions */}
            <div className="flex flex-wrap gap-2">
              {sceneData.availableActions.slice(0, 3).map((action) => (
                <button
                  key={action.id}
                  className="bg-gold text-charcoal px-3 py-1 rounded-full text-sm font-crimson font-semibold hover:bg-yellow-400 transition-colors duration-300"
                  title={action.description}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scene navigation arrows */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        <button
          onClick={() => {
            const scenes = ['Cichy Wieczór', 'Dzień Targowy', 'Noc Burzy', 'Świętowanie Festiwalu', 'Tajemnicze Zgromadzenie'];
            const currentIndex = scenes.indexOf(sceneData.name);
            const nextIndex = (currentIndex + 1) % scenes.length;
            triggerSceneTransition(scenes[nextIndex] as SceneType);
          }}
          className="bg-charcoal bg-opacity-70 text-gold p-2 rounded-full hover:bg-opacity-90 transition-all duration-300"
          title="Następna scena"
        >
          ▶
        </button>
        <button
          onClick={() => {
            const scenes = ['Cichy Wieczór', 'Dzień Targowy', 'Noc Burzy', 'Świętowanie Festiwalu', 'Tajemnicze Zgromadzenie'];
            const currentIndex = scenes.indexOf(sceneData.name);
            const prevIndex = (currentIndex - 1 + scenes.length) % scenes.length;
            triggerSceneTransition(scenes[prevIndex] as SceneType);
          }}
          className="bg-charcoal bg-opacity-70 text-gold p-2 rounded-full hover:bg-opacity-90 transition-all duration-300"
          title="Poprzednia scena"
        >
          ◀
        </button>
      </div>
    </div>
  );
}