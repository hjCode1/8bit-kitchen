import { useState } from 'react';

interface PixelFridgeProps {
  onOpen: () => void;
}

export default function PixelFridge({ onOpen }: PixelFridgeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
      onOpen();
    }, 250);
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      style={{
        width: '6em',
        height: '10em',
        boxShadow: '6px 6px 0 #3A5560',
        transform: isOpening ? 'scaleX(0.95)' : undefined,
        transition: 'transform 0.2s ease',
      }}
    >
      {/* Freezer (top) */}
      <div
        className="relative bg-[#8EB0C0] border-4 border-[#4A6670] border-b-2"
        style={{ height: '35%' }}
      >
        {/* Handle */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 bg-[#4A6670]" style={{ height: '1.5em' }} />
      </div>
      {/* Main fridge (bottom) */}
      <div
        className="relative bg-[#A8C4D4] border-4 border-t-2 border-[#4A6670]"
        style={{ height: '65%' }}
      >
        {/* Handle */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 bg-[#4A6670]" style={{ height: '2em' }} />
      </div>
      {/* Hover glow overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 0 4px rgba(218,165,32,0.6)' }} />
    </div>
  );
}
