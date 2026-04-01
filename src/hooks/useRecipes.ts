import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { generateRecipes } from '../lib/gemini';
import { recordRequest } from '../lib/rateLimiter';
import { saveRecipe } from '../services/recipeService';
import type { Recipe } from '../types';

export function useRecipes() {
  const { state, dispatch } = useContext(RecipeContext);

  const generate = async (ingredientNames: string[]) => {
    dispatch({ type: 'SET_GENERATING', payload: true });

    try {
      const generated = await generateRecipes(ingredientNames);
      recordRequest();

      const saved: Recipe[] = [];
      for (const recipe of generated) {
        try {
          const record = await saveRecipe(recipe);
          saved.push(record);
        } catch {
          saved.push({
            ...recipe,
            id: crypto.randomUUID(),
            description: recipe.description,
            created_at: new Date().toISOString(),
          });
        }
      }

      dispatch({ type: 'SET_RECIPES', payload: saved });
    } catch (err) {
      const message = err instanceof Error && err.message.includes('429')
        ? '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
        : '레시피를 불러올 수 없습니다. 다시 시도해주세요.';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const selectRecipe = (recipe: Recipe) => {
    dispatch({ type: 'SELECT_RECIPE', payload: recipe });
  };

  return {
    recipes: state.recipes,
    selectedRecipe: state.selectedRecipe,
    isGenerating: state.isGenerating,
    error: state.error,
    generate,
    selectRecipe,
  };
}
