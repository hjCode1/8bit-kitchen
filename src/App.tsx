import { useState, useEffect } from 'react';
import type { TabType, Recipe } from './types';
import { isPinSet } from './lib/pinAuth';
import { FridgeProvider } from './context/FridgeContext';
import { RecipeProvider } from './context/RecipeContext';
import Header from './components/layout/Header';
import TabNav from './components/layout/TabNav';
import PinEntry from './components/auth/PinEntry';
import PinSetup from './components/auth/PinSetup';
import FridgeView from './components/fridge/FridgeView';
import RecipeSuggestionView from './components/recipe/RecipeSuggestionView';
import RecipeDetailView from './components/detail/RecipeDetailView';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('fridge');
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
    setActiveTab('detail');
  };

  return (
    <FridgeProvider>
      <RecipeProvider>
        <div className="min-h-screen bg-pixel-bg">
          <div className="max-w-2xl mx-auto border-x-4 border-pixel-border min-h-screen flex flex-col">
            <Header />
            <TabNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              hasSelectedRecipe={!!selectedRecipe}
            />
            <main className="flex-1 p-4">
              {activeTab === 'fridge' && <FridgeView />}
              {activeTab === 'recipes' && (
                <RecipeSuggestionView onSelectRecipe={handleSelectRecipe} />
              )}
              {activeTab === 'detail' && selectedRecipe && (
                <RecipeDetailView recipe={selectedRecipe} />
              )}
            </main>
          </div>
        </div>
      </RecipeProvider>
    </FridgeProvider>
  );
}

export default App;
