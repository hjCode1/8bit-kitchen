import { useState } from 'react';

interface PixelCounterProps {
  onOpen: () => void;
}

export default function PixelCounter({ onOpen }: PixelCounterProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    if (isActive) return;
    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
      onOpen();
    }, 400);
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      style={{
        width: '10em',
        height: '6em',
        boxShadow: '4px 4px 0 #6B4423',
      }}
    >
      {/* Steam on click */}
      {isActive && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#D4A574]" style={{ animation: 'steam 0.5s ease-out forwards' }} />
          <div className="w-1.5 h-1.5 bg-[#D4A574]" style={{ animation: 'steam 0.5s ease-out 0.1s forwards' }} />
          <div className="w-1.5 h-1.5 bg-[#D4A574]" style={{ animation: 'steam 0.5s ease-out 0.2s forwards' }} />
        </div>
      )}

      {/* Counter top surface */}
      <div className="relative bg-[#D4A574] border-4 border-[#6B4423] border-b-2 flex items-center justify-center" style={{ height: '40%' }}>
        {/* Faucet */}
        <div className="absolute" style={{ top: '-1.2em', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="w-0.5 bg-[#A0A0A0] border border-[#707070]" style={{ height: '1.2em' }} />
          <div className="w-3 h-0.5 bg-[#A0A0A0] border border-[#707070] -ml-1" />
        </div>
        {/* Sink */}
        <div className="bg-[#8A8A8A] border-2 border-[#5A5A5A]" style={{ width: '3em', height: '1em' }} />
      </div>

      {/* Cabinet doors */}
      <div className="flex" style={{ height: '60%' }}>
        <div className="flex-1 bg-[#B07840] border-4 border-t-2 border-[#6B4423] flex items-center justify-end pr-1">
          <div className="w-1.5 h-1.5 bg-[#6B4423]" />
        </div>
        <div className="flex-1 bg-[#B07840] border-4 border-t-2 border-l-0 border-[#6B4423] flex items-center pl-1">
          <div className="w-1.5 h-1.5 bg-[#6B4423]" />
        </div>
      </div>

      {/* Hover glow overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 0 4px rgba(218,165,32,0.6)' }} />
    </div>
  );
}
