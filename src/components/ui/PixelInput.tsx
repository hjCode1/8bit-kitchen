import type { InputHTMLAttributes } from 'react';

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function PixelInput({ label, className = '', ...props }: PixelInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-pixel text-[8px] text-pixel-text">{label}</label>
      )}
      <input
        className={`
          font-pixel text-[10px] bg-pixel-light border-4 border-pixel-border
          px-3 py-2 text-pixel-text outline-none
          focus:border-pixel-gold
          placeholder:text-pixel-border/50
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
