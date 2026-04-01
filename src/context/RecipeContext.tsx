import { createContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { Recipe } from '../types';

interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isGenerating: boolean;
  error: string | null;
}

type RecipeAction =
  | { type: 'SET_RECIPES'; payload: Recipe[] }
  | { type: 'SELECT_RECIPE'; payload: Recipe }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_RECIPES' };

const initialState: RecipeState = {
  recipes: [],
  selectedRecipe: null,
  isGenerating: false,
  error: null,
};

function recipeReducer(state: RecipeState, action: RecipeAction): RecipeState {
  switch (action.type) {
    case 'SET_RECIPES':
      return { ...state, recipes: action.payload, isGenerating: false, error: null };
    case 'SELECT_RECIPE':
      return { ...state, selectedRecipe: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isGenerating: false };
    case 'CLEAR_RECIPES':
      return { ...state, recipes: [], selectedRecipe: null };
  }
}

export const RecipeContext = createContext<{
  state: RecipeState;
  dispatch: Dispatch<RecipeAction>;
}>({ state: initialState, dispatch: () => {} });

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
}
