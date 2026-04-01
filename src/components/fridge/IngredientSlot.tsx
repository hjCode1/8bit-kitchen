import { useState } from 'react';
import type { Ingredient } from '../../types';

interface IngredientSlotProps {
  ingredient?: Ingredient;
  onRemove?: (id: string) => void;
}

export default function IngredientSlot({ ingredient, onRemove }: IngredientSlotProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!ingredient) {
    return (
      <div className="w-full h-24 border-2 border-dashed border-pixel-border/30 flex items-center justify-center">
        <span className="text-pixel-border/20 text-2xl">+</span>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="w-full h-24 border-2 border-pixel-red bg-pixel-red/10 flex flex-col items-center justify-center gap-1 p-1">
        <p className="text-[15px] text-pixel-red text-center">삭제?</p>
        <div className="flex gap-1">
          <button
            onClick={() => onRemove?.(ingredient.id)}
            className="text-[15px] bg-pixel-red text-pixel-light px-1 cursor-pointer border border-pixel-border"
          >
            예
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-[15px] bg-pixel-light text-pixel-text px-1 cursor-pointer border border-pixel-border"
          >
            아니오
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setShowConfirm(true)}
      className="w-full h-24 border-2 border-pixel-border bg-pixel-light flex flex-col items-center justify-center cursor-pointer hover:bg-pixel-panel/30 p-1 overflow-hidden"
    >
      <span className="text-2xl leading-none">{ingredient.emoji || '📦'}</span>
      <span className="text-[13px] text-pixel-text mt-1 text-center leading-tight truncate w-full">
        {ingredient.name}
      </span>
      {ingredient.quantity && (
        <span className="text-[11px] text-pixel-text/60 mt-0.5 truncate w-full text-center">
          {ingredient.quantity}
        </span>
      )}
    </div>
  );
}
