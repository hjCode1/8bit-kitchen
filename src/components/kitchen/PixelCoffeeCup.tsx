export default function PixelCoffeeCup() {
  return (
    <div className="relative" style={{ width: '1.8em', height: '2.2em' }}>
      {/* Steam particles */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0.5">
        <div
          className="w-1 h-1 bg-[#D4A574]"
          style={{ animation: 'steam 2s ease-out infinite' }}
        />
        <div
          className="w-1 h-1 bg-[#D4A574]"
          style={{ animation: 'steam 2s ease-out 0.4s infinite' }}
        />
        <div
          className="w-1 h-1 bg-[#D4A574]"
          style={{ animation: 'steam 2s ease-out 0.8s infinite' }}
        />
      </div>
      {/* Cup */}
      <div className="absolute bottom-0 w-full">
        {/* Coffee surface */}
        <div className="w-full h-1 bg-[#6B4423]" />
        {/* Cup body */}
        <div className="w-full bg-[#F0F0F0] border-3 border-[#8B5E3C]" style={{ height: '1.5em' }}>
          {/* Handle */}
          <div
            className="absolute -right-1.5 top-1/2 -translate-y-1/2 border-3 border-[#8B5E3C] border-l-0"
            style={{ width: '0.6em', height: '0.8em' }}
          />
        </div>
      </div>
    </div>
  );
}
