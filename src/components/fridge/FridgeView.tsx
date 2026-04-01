import { useState } from 'react';
import { useFridge } from '../../hooks/useFridge';
import CategoryFilter from './CategoryFilter';
import IngredientGrid from './IngredientGrid';
import AddIngredientModal from './AddIngredientModal';
import PixelButton from '../ui/PixelButton';

export default function FridgeView() {
  const { filteredIngredients, isLoading, error, selectedCategory, addIngredient, removeIngredient, setCategory } = useFridge();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <p className="font-pixel text-[10px] text-center py-8">재료를 불러오는 중...</p>;
  }

  return (
    <div>
      {error && (
        <p className="font-pixel text-[8px] text-pixel-red text-center mb-2">{error}</p>
      )}

      <CategoryFilter selected={selectedCategory} onSelect={setCategory} />
      <IngredientGrid ingredients={filteredIngredients} onRemove={removeIngredient} />

      <div className="mt-4 text-center">
        <PixelButton onClick={() => setIsModalOpen(true)}>
          + 재료 추가하기
        </PixelButton>
      </div>

      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addIngredient}
      />
    </div>
  );
}
