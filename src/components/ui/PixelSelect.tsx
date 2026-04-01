import type { SelectHTMLAttributes } from 'react';

interface PixelSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function PixelSelect({ label, options, className = '', ...props }: PixelSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-pixel text-[16px] text-pixel-text">{label}</label>
      )}
      <select
        className={`
          font-pixel text-[18px] bg-pixel-light border-4 border-pixel-border
          px-3 py-2 text-pixel-text outline-none cursor-pointer
          focus:border-pixel-gold
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
