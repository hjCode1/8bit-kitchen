import type { Recipe } from '../../types';

interface RecipeHeaderProps {
  recipe: Recipe;
}

const DIFFICULTY_STARS: Record<string, string> = {
  '쉬움': '⭐',
  '보통': '⭐⭐',
  '어려움': '⭐⭐⭐',
};

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div className="bg-pixel-light border-4 border-pixel-border p-4 mb-4">
      <h2 className="font-pixel text-[20px] text-pixel-text mb-3 leading-relaxed">
        {recipe.title}
      </h2>
      {recipe.description && (
        <p className="font-pixel text-[16px] text-pixel-text/70 mb-3 leading-relaxed">
          {recipe.description}
        </p>
      )}
      <div className="flex flex-wrap gap-3 font-pixel text-[16px] text-pixel-text/60">
        {recipe.difficulty && <span>{DIFFICULTY_STARS[recipe.difficulty]} {recipe.difficulty}</span>}
        {recipe.cook_time && <span>⏱ {recipe.cook_time}</span>}
        {recipe.servings && <span>🍽 {recipe.servings}</span>}
      </div>
    </div>
  );
}
