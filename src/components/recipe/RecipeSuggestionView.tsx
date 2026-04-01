import { useFridge } from '../../hooks/useFridge';
import { useRecipes } from '../../hooks/useRecipes';
import IngredientChips from './IngredientChips';
import GenerateButton from './GenerateButton';
import RecipeCardList from './RecipeCardList';
import type { Recipe } from '../../types';

interface RecipeSuggestionViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeSuggestionView({ onSelectRecipe }: RecipeSuggestionViewProps) {
  const { ingredients } = useFridge();
  const { recipes, isGenerating, error, generate, selectRecipe } = useRecipes();

  const handleGenerate = () => {
    const names = ingredients.map((i) => i.name);
    generate(names);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    selectRecipe(recipe);
    onSelectRecipe(recipe);
  };

  return (
    <div>
      <IngredientChips ingredients={ingredients} />

      <GenerateButton
        onClick={handleGenerate}
        disabled={ingredients.length === 0}
        isGenerating={isGenerating}
      />

      {isGenerating && (
        <p className="text-[18px] text-center text-pixel-text animate-pulse">
          🔥 맛있는 레시피를 찾고 있어요...
        </p>
      )}

      {error && (
        <p className="text-[16px] text-pixel-red text-center mb-4">{error}</p>
      )}

      <RecipeCardList recipes={recipes} onSelectRecipe={handleSelectRecipe} />
    </div>
  );
}
