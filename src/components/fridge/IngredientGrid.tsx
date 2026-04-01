import type { Ingredient } from '../../types';
import IngredientSlot from './IngredientSlot';

interface IngredientGridProps {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
}

const GRID_SIZE = 30;

export default function IngredientGrid({ ingredients, onRemove }: IngredientGridProps) {
  const slots = Array.from({ length: GRID_SIZE }, (_, i) => ingredients[i] || undefined);

  return (
    <div className="grid grid-cols-6 gap-1 bg-pixel-panel/30 border-4 border-pixel-border p-2">
      {slots.map((ingredient, i) => (
        <IngredientSlot key={ingredient?.id || `empty-${i}`} ingredient={ingredient} onRemove={onRemove} />
      ))}
    </div>
  );
}
