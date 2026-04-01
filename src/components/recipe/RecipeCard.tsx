import type { Recipe } from '../../types';
import PixelCard from '../ui/PixelCard';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const DIFFICULTY_STARS: Record<string, string> = {
  '쉬움': '⭐',
  '보통': '⭐⭐',
  '어려움': '⭐⭐⭐',
};

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <PixelCard hover onClick={onClick}>
      <h3 className="font-pixel text-[9px] text-pixel-text mb-2 leading-relaxed">
        {recipe.title}
      </h3>
      {recipe.description && (
        <p className="font-pixel text-[7px] text-pixel-text/70 mb-2 leading-relaxed">
          {recipe.description}
        </p>
      )}
      <div className="flex flex-wrap gap-2 font-pixel text-[7px] text-pixel-text/60">
        {recipe.difficulty && (
          <span>{DIFFICULTY_STARS[recipe.difficulty] || '⭐'} {recipe.difficulty}</span>
        )}
        {recipe.cook_time && <span>⏱ {recipe.cook_time}</span>}
        {recipe.servings && <span>🍽 {recipe.servings}</span>}
      </div>
    </PixelCard>
  );
}
