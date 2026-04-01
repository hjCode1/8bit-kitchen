import { supabase } from '../lib/supabase';
import type { Recipe, GeneratedRecipe } from '../types';

export async function saveRecipe(recipe: GeneratedRecipe): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipe_history')
    .insert({
      title: recipe.title,
      description: recipe.description,
      ingredients_used: recipe.ingredients_used,
      steps: recipe.steps,
      cook_time: recipe.cook_time,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchRecipeHistory(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipe_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}
