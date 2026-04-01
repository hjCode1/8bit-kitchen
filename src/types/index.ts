export type IngredientCategory =
  | '채소'
  | '과일'
  | '육류'
  | '해산물'
  | '유제품'
  | '양념'
  | '곡물'
  | '기타';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: string | null;
  emoji: string | null;
  created_at: string;
}

export interface RecipeStep {
  order: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients_used: string[];
  steps: RecipeStep[];
  cook_time: string | null;
  difficulty: '쉬움' | '보통' | '어려움' | null;
  servings: string | null;
  created_at: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients_used: string[];
  steps: RecipeStep[];
  cook_time: string;
  difficulty: '쉬움' | '보통' | '어려움';
  servings: string;
}

export type TabType = 'fridge' | 'recipes' | 'detail';

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: Ingredient;
        Insert: Omit<Ingredient, 'id' | 'created_at'>;
        Update: Partial<Omit<Ingredient, 'id' | 'created_at'>>;
      };
      recipe_history: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'created_at'>;
        Update: Partial<Omit<Recipe, 'id' | 'created_at'>>;
      };
      app_config: {
        Row: { key: string; value: string };
        Insert: { key: string; value: string };
        Update: { key?: string; value?: string };
      };
    };
  };
}
