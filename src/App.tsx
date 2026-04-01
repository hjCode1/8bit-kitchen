import { useState, useEffect } from 'react';
import type { ModalView, Recipe } from './types';
import { isPinSet } from './lib/pinAuth';
import { FridgeProvider } from './context/FridgeContext';
import { RecipeProvider } from './context/RecipeContext';
import Header from './components/layout/Header';
import PinEntry from './components/auth/PinEntry';
import PinSetup from './components/auth/PinSetup';
import KitchenScene from './components/kitchen/KitchenScene';
import KitchenModal from './components/kitchen/KitchenModal';
import FridgeView from './components/fridge/FridgeView';
import RecipeSuggestionView from './components/recipe/RecipeSuggestionView';
import RecipeDetailView from './components/detail/RecipeDetailView';

function App() {
  const [activeModal, setActiveModal] = useState<ModalView>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [authState, setAuthState] = useState<'loading' | 'needSetup' | 'needPin' | 'authenticated'>('loading');

  useEffect(() => {
    const checkAuth = async () => {
      if (sessionStorage.getItem('8bit-kitchen-auth') === 'true') {
        setAuthState('authenticated');
        return;
      }

      const pinExists = await isPinSet();
      setAuthState(pinExists ? 'needPin' : 'needSetup');
    };
    checkAuth();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
        <p className="text-[18px] text-pixel-text">로딩 중...</p>
      </div>
    );
  }

  if (authState === 'needSetup') {
    return <PinSetup onComplete={() => setAuthState('authenticated')} />;
  }

  if (authState === 'needPin') {
    return <PinEntry onSuccess={() => setAuthState('authenticated')} />;
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveModal('detail');
  };

  return (
    <FridgeProvider>
      <RecipeProvider>
        <div className="min-h-screen bg-pixel-bg">
          <div className="max-w-2xl mx-auto border-x-4 border-pixel-border min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <KitchenScene
                onOpenFridge={() => setActiveModal('fridge')}
                onOpenCounter={() => setActiveModal('recipes')}
              />
            </main>
          </div>
        </div>

        <KitchenModal
          isOpen={activeModal === 'fridge'}
          title="🧊 냉장고"
          onClose={() => setActiveModal(null)}
        >
          <FridgeView />
        </KitchenModal>

        <KitchenModal
          isOpen={activeModal === 'recipes'}
          title="🍳 레시피 추천"
          onClose={() => setActiveModal(null)}
        >
          <RecipeSuggestionView onSelectRecipe={handleSelectRecipe} />
        </KitchenModal>

        <KitchenModal
          isOpen={activeModal === 'detail'}
          title="📖 레시피 상세"
          onClose={() => setActiveModal('recipes')}
        >
          {selectedRecipe && <RecipeDetailView recipe={selectedRecipe} />}
        </KitchenModal>
      </RecipeProvider>
    </FridgeProvider>
  );
}

export default App;
