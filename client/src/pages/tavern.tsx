import { useState, useEffect } from 'react';
import { useTavernStore, useCurrentScene, useActiveCharacters } from '../stores/tavernStore';
import { TavernNavigation } from '../components/tavern/TavernNavigation';
import { SceneDisplay } from '../components/tavern/SceneDisplay';
import { ConversationArea } from '../components/tavern/ConversationArea';
import { CharacterPanel } from '../components/tavern/CharacterPanel';
import { StoryThreadsSidebar } from '../components/tavern/StoryThreadsSidebar';
import { GossipPanel } from '../components/tavern/GossipPanel';
import { DialogueModal } from '../components/tavern/DialogueModal';
import { SceneTransitionModal } from '../components/tavern/SceneTransitionModal';
import { WARHAMMER_CHARACTERS } from '../types/warhammer.types';

export default function TavernPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const currentScene = useCurrentScene();
  const activeCharacters = useActiveCharacters();
  const {
    addCharacter,
    isDialogueModalOpen,
    isStoryThreadsVisible,
    isGossipPanelVisible,
    setStoryThreadsVisible,
    setGossipPanelVisible
  } = useTavernStore();

  // Initialize characters on mount
  useEffect(() => {
    if (!isInitialized) {
      WARHAMMER_CHARACTERS.forEach(character => {
        addCharacter(character);
      });
      setIsInitialized(true);
    }
  }, [isInitialized, addCharacter]);

  // Auto-start conversations every 2-5 minutes
  useEffect(() => {
    if (!isInitialized) return;

    const startRandomConversation = () => {
      const state = useTavernStore.getState();
      const currentActiveChars = Array.from(state.activeCharacters)
        .map(id => state.characters.get(id))
        .filter(Boolean);

      if (currentActiveChars.length >= 2 && !state.isDialogueModalOpen) {
        const randomCharacters = currentActiveChars
          .filter(char => Math.random() < char.conversationPreferences.initiationLikelihood)
          .slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 characters

        if (randomCharacters.length >= 2) {
          state.initiateConversation(randomCharacters.map(c => c.id));
        }
      }
    };

    // Random interval between 2-5 minutes for demo (shortened for testing)
    const interval = setInterval(startRandomConversation, 30000); // 30 seconds for demo
    
    return () => clearInterval(interval);
  }, [isInitialized]);

  return (
    <div className="min-h-screen bg-charcoal text-parchment">
      <TavernNavigation />
      
      <main className="flex h-screen pt-20">
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Scene display */}
          <SceneDisplay scene={currentScene} />
          
          {/* Conversation area */}
          <div className="flex-1 p-6">
            <ConversationArea />
          </div>
        </div>

        {/* Character panel */}
        <div className="w-80 border-l border-gold border-opacity-30">
          <CharacterPanel characters={activeCharacters} />
        </div>

        {/* Story threads sidebar */}
        {isStoryThreadsVisible && (
          <div className="w-64 border-l border-gold border-opacity-30">
            <StoryThreadsSidebar />
          </div>
        )}
      </main>

      {/* Floating panels */}
      {isGossipPanelVisible && (
        <div className="fixed bottom-6 right-6 w-80">
          <GossipPanel />
        </div>
      )}

      {/* Modals */}
      {isDialogueModalOpen && <DialogueModal />}
      
      {/* Scene transition modal */}
      <SceneTransitionModal />

      {/* Sidebar toggles for mobile */}
      <div className="fixed left-4 top-24 flex flex-col gap-2 md:hidden">
        <button
          onClick={() => setStoryThreadsVisible(!isStoryThreadsVisible)}
          className="bg-wood text-parchment p-3 rounded-lg shadow-lg"
        >
          📜
        </button>
        <button
          onClick={() => setGossipPanelVisible(!isGossipPanelVisible)}
          className="bg-wood text-parchment p-3 rounded-lg shadow-lg"
        >
          💬
        </button>
      </div>
    </div>
  );
}