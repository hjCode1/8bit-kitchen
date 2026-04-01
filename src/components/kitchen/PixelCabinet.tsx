export default function PixelCabinet() {
  return (
    <div className="flex" style={{ boxShadow: '3px 3px 0 #6B4423' }}>
      {/* Left door */}
      <div className="bg-[#C49A6C] border-4 border-[#8B5E3C] flex items-center justify-end pr-1" style={{ width: '4em', height: '3.5em' }}>
        <div className="w-1.5 h-1.5 bg-[#6B4423]" />
      </div>
      {/* Right door */}
      <div className="bg-[#C49A6C] border-4 border-l-0 border-[#8B5E3C] flex items-center pl-1" style={{ width: '4em', height: '3.5em' }}>
        <div className="w-1.5 h-1.5 bg-[#6B4423]" />
      </div>
    </div>
  );
}
