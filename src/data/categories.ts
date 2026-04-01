import type { IngredientCategory } from '../types';

export interface CategoryInfo {
  name: IngredientCategory;
  emoji: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { name: '채소', emoji: '🥬', color: 'bg-pixel-green' },
  { name: '과일', emoji: '🍎', color: 'bg-pixel-red' },
  { name: '육류', emoji: '🥩', color: 'bg-pixel-red' },
  { name: '해산물', emoji: '🐟', color: 'bg-pixel-blue' },
  { name: '유제품', emoji: '🧀', color: 'bg-pixel-light' },
  { name: '양념', emoji: '🧂', color: 'bg-pixel-gold' },
  { name: '곡물', emoji: '🌾', color: 'bg-pixel-gold' },
  { name: '기타', emoji: '📦', color: 'bg-pixel-panel' },
];
