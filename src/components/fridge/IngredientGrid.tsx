import type { Ingredient } from '../../types';
import IngredientSlot from './IngredientSlot';

interface IngredientGridProps {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
}

const MIN_SLOTS = 12;

export default function IngredientGrid({ ingredients, onRemove }: IngredientGridProps) {
  const totalSlots = Math.max(MIN_SLOTS, ingredients.length + 6);
  const slots = Array.from({ length: totalSlots }, (_, i) => ingredients[i] || undefined);

  return (
    <div className="max-h-[60vh] overflow-y-auto border-4 border-pixel-border">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 bg-pixel-panel/30 p-2">
        {slots.map((ingredient, i) => (
          <IngredientSlot key={ingredient?.id || `empty-${i}`} ingredient={ingredient} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}
