import type { Recipe } from '../../types';
import RecipeCard from './RecipeCard';

interface RecipeCardListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeCardList({ recipes, onSelectRecipe }: RecipeCardListProps) {
  if (recipes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onSelectRecipe(recipe)}
        />
      ))}
    </div>
  );
}
