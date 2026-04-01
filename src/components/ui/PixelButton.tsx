import type { ButtonHTMLAttributes } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
}

const VARIANT_STYLES = {
  primary: 'bg-pixel-gold text-pixel-text border-pixel-border',
  secondary: 'bg-pixel-panel text-pixel-text border-pixel-border',
  danger: 'bg-pixel-red text-pixel-light border-pixel-border',
};

export default function PixelButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: PixelButtonProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-[15px]' : 'px-4 py-2 text-[18px]';

  return (
    <button
      className={`
        ${sizeClass} border-4 ${VARIANT_STYLES[variant]}
        shadow-pixel cursor-pointer select-none
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-pixel
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
