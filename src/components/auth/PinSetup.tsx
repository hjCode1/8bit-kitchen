import { useState, useRef } from 'react';
import { setupPin } from '../../lib/pinAuth';
import PixelButton from '../ui/PixelButton';

interface PinSetupProps {
  onComplete: () => void;
}

export default function PinSetup({ onComplete }: PinSetupProps) {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState(['', '', '', '']);
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const pinStr = pin.join('');
    if (pinStr.length !== 4) return;

    if (step === 'create') {
      setFirstPin(pinStr);
      setPin(['', '', '', '']);
      setStep('confirm');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      if (pinStr !== firstPin) {
        setError('PIN이 일치하지 않습니다. 다시 입력하세요.');
        setPin(['', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      await setupPin(pinStr);
      sessionStorage.setItem('8bit-kitchen-auth', 'true');
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
      <div className="bg-pixel-light border-4 border-pixel-border shadow-pixel p-8 text-center">
        <h1 className="font-pixel text-lg text-pixel-text mb-2">8 B I T</h1>
        <h2 className="font-pixel text-base text-pixel-text mb-6">K I T C H E N</h2>
        <p className="font-pixel text-[16px] text-pixel-text mb-1">
          {step === 'create' ? '새 PIN을 설정하세요' : 'PIN을 다시 입력하세요'}
        </p>
        <p className="font-pixel text-[16px] text-pixel-text/50 mb-4">
          (숫자 4자리)
        </p>

        <div className="flex gap-2 justify-center mb-4">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 text-center font-pixel text-2xl bg-pixel-bg border-4 border-pixel-border outline-none focus:border-pixel-gold"
            />
          ))}
        </div>

        {error && (
          <p className="font-pixel text-[16px] text-pixel-red mb-3">{error}</p>
        )}

        <PixelButton onClick={handleSubmit} disabled={pin.join('').length !== 4}>
          {step === 'create' ? '다음' : '설정 완료'}
        </PixelButton>
      </div>
    </div>
  );
}
