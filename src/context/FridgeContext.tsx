import { createContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react';
import type { Ingredient, IngredientCategory } from '../types';
import { fetchIngredients } from '../services/ingredientService';

interface FridgeState {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: IngredientCategory | '전체';
}

type FridgeAction =
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CATEGORY'; payload: IngredientCategory | '전체' };

const initialState: FridgeState = {
  ingredients: [],
  isLoading: true,
  error: null,
  selectedCategory: '전체',
};

function fridgeReducer(state: FridgeState, action: FridgeAction): FridgeState {
  switch (action.type) {
    case 'SET_INGREDIENTS':
      return { ...state, ingredients: action.payload, isLoading: false };
    case 'ADD_INGREDIENT':
      return { ...state, ingredients: [action.payload, ...state.ingredients] };
    case 'REMOVE_INGREDIENT':
      return { ...state, ingredients: state.ingredients.filter((i) => i.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
  }
}

export const FridgeContext = createContext<{
  state: FridgeState;
  dispatch: Dispatch<FridgeAction>;
}>({ state: initialState, dispatch: () => {} });

export function FridgeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fridgeReducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchIngredients();
        dispatch({ type: 'SET_INGREDIENTS', payload: data });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: '재료를 불러오는데 실패했습니다.' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    load();
  }, []);

  return (
    <FridgeContext.Provider value={{ state, dispatch }}>
      {children}
    </FridgeContext.Provider>
  );
}
