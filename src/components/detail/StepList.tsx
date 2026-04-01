import { useState } from 'react';
import type { RecipeStep } from '../../types';

interface StepListProps {
  steps: RecipeStep[];
}

export default function StepList({ steps }: StepListProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (order: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(order)) {
        next.delete(order);
      } else {
        next.add(order);
      }
      return next;
    });
  };

  return (
    <div className="bg-pixel-light border-4 border-pixel-border p-4">
      <h3 className="text-[17px] text-pixel-text mb-3">🍳 조리 순서</h3>
      <ol className="space-y-3">
        {steps.map((step) => {
          const isChecked = checkedSteps.has(step.order);
          return (
            <li
              key={step.order}
              onClick={() => toggleStep(step.order)}
              className={`
                flex gap-3 p-2 border-2 border-pixel-border cursor-pointer
                ${isChecked ? 'bg-pixel-green/10 border-pixel-green/50' : 'bg-pixel-bg'}
              `}
            >
              <span className={`text-[17px] ${isChecked ? 'text-pixel-green' : 'text-pixel-gold'} shrink-0`}>
                {isChecked ? '✅' : `${step.order}.`}
              </span>
              <div>
                <p className={`text-[16px] leading-relaxed ${isChecked ? 'text-pixel-text/50 line-through' : 'text-pixel-text'}`}>
                  {step.instruction}
                </p>
                {step.tip && (
                  <p className="text-[15px] text-pixel-gold mt-1">
                    💡 {step.tip}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
