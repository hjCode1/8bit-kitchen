interface IngredientChecklistProps {
  requiredIngredients: string[];
  fridgeIngredientNames: string[];
}

export default function IngredientChecklist({ requiredIngredients, fridgeIngredientNames }: IngredientChecklistProps) {
  return (
    <div className="bg-pixel-light border-4 border-pixel-border p-4 mb-4">
      <h3 className="font-pixel text-[9px] text-pixel-text mb-3">📋 필요한 재료</h3>
      <ul className="space-y-1">
        {requiredIngredients.map((name) => {
          const inFridge = fridgeIngredientNames.some(
            (fn) => fn.includes(name) || name.includes(fn)
          );
          return (
            <li key={name} className="flex items-center gap-2">
              <span className={`font-pixel text-[8px] ${inFridge ? 'text-pixel-green' : 'text-pixel-red'}`}>
                {inFridge ? '✅' : '❌'}
              </span>
              <span className={`font-pixel text-[8px] ${inFridge ? 'text-pixel-text' : 'text-pixel-text/50'}`}>
                {name}
              </span>
              {inFridge && (
                <span className="font-pixel text-[6px] text-pixel-green">(보유)</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
