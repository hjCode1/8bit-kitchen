import { useFridge } from '../../hooks/useFridge';
import type { Recipe } from '../../types';
import RecipeHeader from './RecipeHeader';
import IngredientChecklist from './IngredientChecklist';
import StepList from './StepList';

interface RecipeDetailViewProps {
  recipe: Recipe;
}

export default function RecipeDetailView({ recipe }: RecipeDetailViewProps) {
  const { ingredients } = useFridge();
  const fridgeNames = ingredients.map((i) => i.name);

  return (
    <div>
      <RecipeHeader recipe={recipe} />
      <IngredientChecklist
        requiredIngredients={recipe.ingredients_used}
        fridgeIngredientNames={fridgeNames}
      />
      <StepList steps={recipe.steps} />
    </div>
  );
}
