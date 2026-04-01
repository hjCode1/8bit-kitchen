import type { ReactNode } from 'react';

interface PixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function PixelModal({ isOpen, onClose, title, children }: PixelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-pixel-bg border-4 border-pixel-border shadow-pixel p-4 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4 pb-2 border-b-4 border-pixel-border">
          <h2 className="font-pixel text-[18px] text-pixel-text">{title}</h2>
          <button
            onClick={onClose}
            className="font-pixel text-[18px] text-pixel-red cursor-pointer hover:opacity-70"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
