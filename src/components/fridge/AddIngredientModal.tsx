import { useState } from 'react';
import type { IngredientCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { INGREDIENT_PRESETS } from '../../data/ingredientPresets';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';
import PixelInput from '../ui/PixelInput';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; category: IngredientCategory; quantity: string | null; emoji: string | null }) => void;
}

export default function AddIngredientModal({ isOpen, onClose, onAdd }: AddIngredientModalProps) {
  const [category, setCategory] = useState<IngredientCategory>('채소');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [quantity, setQuantity] = useState('');

  const presets = INGREDIENT_PRESETS[category];
  const isCustom = selectedPreset === '__custom__';

  const handleAdd = () => {
    const preset = presets.find((p) => p.name === selectedPreset);
    const name = isCustom ? customName.trim() : selectedPreset;
    if (!name) return;

    onAdd({
      name,
      category,
      quantity: quantity.trim() || null,
      emoji: isCustom ? null : preset?.emoji || null,
    });

    setSelectedPreset(null);
    setCustomName('');
    setQuantity('');
    onClose();
  };

  const handleClose = () => {
    setSelectedPreset(null);
    setCustomName('');
    setQuantity('');
    onClose();
  };

  return (
    <PixelModal isOpen={isOpen} onClose={handleClose} title="재료 추가">
      <div className="mb-3">
        <p className="font-pixel text-[8px] text-pixel-text mb-1">카테고리</p>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { setCategory(cat.name); setSelectedPreset(null); }}
              className={`
                font-pixel text-[7px] px-2 py-1 border-2 border-pixel-border cursor-pointer
                ${category === cat.name ? 'bg-pixel-gold' : 'bg-pixel-light'}
              `}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="font-pixel text-[8px] text-pixel-text mb-1">재료 선택</p>
        <div className="max-h-32 overflow-y-auto border-2 border-pixel-border bg-pixel-bg p-1">
          <div className="flex flex-wrap gap-1">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset.name)}
                className={`
                  font-pixel text-[7px] px-2 py-1 border border-pixel-border cursor-pointer
                  ${selectedPreset === preset.name ? 'bg-pixel-gold' : 'bg-pixel-light'}
                `}
              >
                {preset.emoji} {preset.name}
              </button>
            ))}
            <button
              onClick={() => setSelectedPreset('__custom__')}
              className={`
                font-pixel text-[7px] px-2 py-1 border border-pixel-border cursor-pointer
                ${isCustom ? 'bg-pixel-gold' : 'bg-pixel-light'}
              `}
            >
              ✏️ 직접 입력
            </button>
          </div>
        </div>
      </div>

      {isCustom && (
        <div className="mb-3">
          <PixelInput
            label="재료명"
            placeholder="재료 이름을 입력하세요"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </div>
      )}

      <div className="mb-4">
        <PixelInput
          label="수량 (선택)"
          placeholder="예: 2개, 500g"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <PixelButton variant="secondary" onClick={handleClose}>취소</PixelButton>
        <PixelButton
          onClick={handleAdd}
          disabled={isCustom ? !customName.trim() : !selectedPreset}
        >
          추가
        </PixelButton>
      </div>
    </PixelModal>
  );
}
