import type { HTMLAttributes } from 'react';

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function PixelCard({
  hover = false,
  className = '',
  children,
  ...props
}: PixelCardProps) {
  return (
    <div
      className={`
        bg-pixel-light border-4 border-pixel-border shadow-pixel-sm p-3
        ${hover ? 'cursor-pointer hover:bg-pixel-panel hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
