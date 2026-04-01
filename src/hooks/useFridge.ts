import { useContext } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import { addIngredient as addIngredientApi, removeIngredient as removeIngredientApi } from '../services/ingredientService';
import type { Ingredient, IngredientCategory } from '../types';

export function useFridge() {
  const { state, dispatch } = useContext(FridgeContext);

  const addIngredient = async (data: Omit<Ingredient, 'id' | 'created_at'>) => {
    const tempId = crypto.randomUUID();
    const tempIngredient: Ingredient = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_INGREDIENT', payload: tempIngredient });

    try {
      const saved = await addIngredientApi(data);
      dispatch({ type: 'REMOVE_INGREDIENT', payload: tempId });
      dispatch({ type: 'ADD_INGREDIENT', payload: saved });
    } catch {
      dispatch({ type: 'REMOVE_INGREDIENT', payload: tempId });
      dispatch({ type: 'SET_ERROR', payload: '재료 추가에 실패했습니다.' });
    }
  };

  const removeIngredient = async (id: string) => {
    const existing = state.ingredients.find((i) => i.id === id);
    dispatch({ type: 'REMOVE_INGREDIENT', payload: id });

    try {
      await removeIngredientApi(id);
    } catch {
      if (existing) {
        dispatch({ type: 'ADD_INGREDIENT', payload: existing });
      }
      dispatch({ type: 'SET_ERROR', payload: '재료 삭제에 실패했습니다.' });
    }
  };

  const setCategory = (category: IngredientCategory | '전체') => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const filteredIngredients =
    state.selectedCategory === '전체'
      ? state.ingredients
      : state.ingredients.filter((i) => i.category === state.selectedCategory);

  return {
    ingredients: state.ingredients,
    filteredIngredients,
    isLoading: state.isLoading,
    error: state.error,
    selectedCategory: state.selectedCategory,
    addIngredient,
    removeIngredient,
    setCategory,
  };
}
