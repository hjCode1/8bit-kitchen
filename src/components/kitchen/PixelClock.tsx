import { useState, useEffect } from 'react';

export default function PixelClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const hourDeg = (hours * 30) + (minutes * 0.5);
  const minDeg = minutes * 6;

  return (
    <div
      className="relative bg-[#F5E6C8] border-4 border-[#8B5E3C] flex items-center justify-center"
      style={{ width: '3em', height: '3em' }}
    >
      {/* Hour hand */}
      <div
        className="absolute bg-[#8B5E3C] origin-bottom"
        style={{
          width: '3px',
          height: '0.8em',
          bottom: '50%',
          left: 'calc(50% - 1.5px)',
          transform: `rotate(${hourDeg}deg)`,
        }}
      />
      {/* Minute hand */}
      <div
        className="absolute bg-[#8B5E3C] origin-bottom"
        style={{
          width: '2px',
          height: '1.1em',
          bottom: '50%',
          left: 'calc(50% - 1px)',
          transform: `rotate(${minDeg}deg)`,
        }}
      />
      {/* Center dot */}
      <div className="absolute w-1.5 h-1.5 bg-[#8B5E3C]" />
    </div>
  );
}
