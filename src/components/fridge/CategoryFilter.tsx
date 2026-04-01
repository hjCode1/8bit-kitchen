import type { IngredientCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface CategoryFilterProps {
  selected: IngredientCategory | '전체';
  onSelect: (category: IngredientCategory | '전체') => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 mb-4">
      <button
        onClick={() => onSelect('전체')}
        className={`
          font-pixel text-[8px] px-2 py-1 border-2 border-pixel-border cursor-pointer
          ${selected === '전체' ? 'bg-pixel-gold text-pixel-text' : 'bg-pixel-light text-pixel-text/70'}
        `}
      >
        전체
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`
            font-pixel text-[8px] px-2 py-1 border-2 border-pixel-border cursor-pointer
            ${selected === cat.name ? 'bg-pixel-gold text-pixel-text' : 'bg-pixel-light text-pixel-text/70'}
          `}
        >
          {cat.emoji} {cat.name}
        </button>
      ))}
    </div>
  );
}
