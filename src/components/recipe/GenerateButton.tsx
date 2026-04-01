import { useRateLimit } from '../../hooks/useRateLimit';
import PixelButton from '../ui/PixelButton';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isGenerating: boolean;
}

export default function GenerateButton({ onClick, disabled, isGenerating }: GenerateButtonProps) {
  const { canRequest, cooldownSeconds } = useRateLimit();

  const isDisabled = disabled || !canRequest || isGenerating;

  return (
    <div className="text-center my-6">
      <PixelButton
        onClick={() => { onClick(); }}
        disabled={isDisabled}
        size="md"
      >
        {isGenerating
          ? '요리 중...'
          : !canRequest
            ? `${cooldownSeconds}초 후 가능`
            : '🍳 요리 추천 받기!'}
      </PixelButton>
    </div>
  );
}
