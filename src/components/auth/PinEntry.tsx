import { useState, useRef } from 'react';
import { verifyPin } from '../../lib/pinAuth';
import PixelButton from '../ui/PixelButton';

interface PinEntryProps {
  onSuccess: () => void;
}

export default function PinEntry({ onSuccess }: PinEntryProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
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
    if (locked) return;

    const pinStr = pin.join('');
    if (pinStr.length !== 4) return;

    const valid = await verifyPin(pinStr);
    if (valid) {
      sessionStorage.setItem('8bit-kitchen-auth', 'true');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin(['', '', '', '']);
      inputRefs.current[0]?.focus();

      if (newAttempts >= 3) {
        setLocked(true);
        setError('3회 실패! 30초 후 다시 시도하세요.');
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setError('');
        }, 30000);
      } else {
        setError(`PIN이 틀렸습니다. (${newAttempts}/3)`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
      <div className="bg-pixel-light border-4 border-pixel-border shadow-pixel p-8 text-center">
        <h1 className="font-pixel text-lg text-pixel-text mb-2">8 B I T</h1>
        <h2 className="font-pixel text-base text-pixel-text mb-6">K I T C H E N</h2>
        <p className="font-pixel text-[16px] text-pixel-text mb-4">PIN을 입력하세요</p>

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
              disabled={locked}
              className="w-12 h-12 text-center font-pixel text-2xl bg-pixel-bg border-4 border-pixel-border outline-none focus:border-pixel-gold"
            />
          ))}
        </div>

        {error && (
          <p className="font-pixel text-[16px] text-pixel-red mb-3">{error}</p>
        )}

        <PixelButton onClick={handleSubmit} disabled={locked || pin.join('').length !== 4}>
          입장하기
        </PixelButton>
      </div>
    </div>
  );
}
