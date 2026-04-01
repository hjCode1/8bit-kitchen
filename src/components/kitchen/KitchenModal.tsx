import type { ReactNode } from 'react';

interface KitchenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function KitchenModal({ isOpen, onClose, title, children }: KitchenModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-pixel-bg border-4 border-pixel-border w-full max-w-2xl max-h-[85vh] flex flex-col"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* 타이틀바 */}
        <div className="flex items-center justify-between px-4 py-3 border-b-4 border-pixel-border bg-pixel-panel shrink-0">
          <h2 className="text-[18px] text-pixel-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-[18px] text-pixel-red cursor-pointer hover:opacity-70 px-2"
          >
            X
          </button>
        </div>
        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
