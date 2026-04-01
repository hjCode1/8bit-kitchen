export default function PixelOven() {
  return (
    <div className="relative" style={{ width: '5em', height: '7em' }}>
      {/* Main body */}
      <div className="w-full h-full bg-[#F0E0C0] border-4 border-[#8B6914] flex flex-col items-center">
        {/* Burners */}
        <div className="flex gap-2 mt-1">
          <div className="w-3 h-3 bg-[#333] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#666]" />
          </div>
          <div className="w-3 h-3 bg-[#333] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#666]" />
          </div>
        </div>
        {/* Oven window */}
        <div className="relative w-4/5 mt-1 bg-[#1A1A1A] border-2 border-[#8B6914]" style={{ height: '2.5em' }}>
          <div
            className="absolute inset-1 bg-[#FF6600]"
            style={{ animation: 'ovenGlow 3s ease-in-out infinite' }}
          />
        </div>
        {/* Handle */}
        <div className="w-3/5 h-1 bg-[#8B6914] mt-1" />
        {/* Knobs */}
        <div className="flex gap-1 mt-1">
          <div className="w-2 h-2 bg-[#333]" />
          <div className="w-2 h-2 bg-[#333]" />
          <div className="w-2 h-2 bg-[#333]" />
        </div>
      </div>
    </div>
  );
}
