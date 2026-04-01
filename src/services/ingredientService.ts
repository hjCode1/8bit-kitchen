import { supabase } from '../lib/supabase';
import type { Ingredient } from '../types';

export async function fetchIngredients(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Ingredient[];
}

export async function addIngredient(
  ingredient: Omit<Ingredient, 'id' | 'created_at'>
): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .insert(ingredient as Record<string, unknown>)
    .select()
    .single();

  if (error) throw error;
  return data as Ingredient;
}

export async function removeIngredient(id: string): Promise<void> {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
