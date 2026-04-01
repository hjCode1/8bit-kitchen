import { supabase } from '../lib/supabase';
import type { Ingredient } from '../types';

export async function fetchIngredients(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addIngredient(
  ingredient: Omit<Ingredient, 'id' | 'created_at'>
): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .insert(ingredient)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeIngredient(id: string): Promise<void> {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
