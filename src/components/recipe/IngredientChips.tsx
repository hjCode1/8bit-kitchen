import type { Ingredient } from '../../types';

interface IngredientChipsProps {
  ingredients: Ingredient[];
}

export default function IngredientChips({ ingredients }: IngredientChipsProps) {
  if (ingredients.length === 0) {
    return (
      <p className="text-[16px] text-pixel-text/50 text-center py-2">
        냉장고에 재료를 먼저 추가해주세요!
      </p>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-[16px] text-pixel-text mb-2">냉장고 재료:</p>
      <div className="flex flex-wrap gap-1">
        {ingredients.map((ing) => (
          <span
            key={ing.id}
            className="text-[15px] bg-pixel-light border-2 border-pixel-border px-2 py-1"
          >
            {ing.emoji || '📦'} {ing.name}
          </span>
        ))}
      </div>
    </div>
  );
}
