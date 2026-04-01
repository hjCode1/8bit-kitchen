import type { TabType } from '../../types';

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasSelectedRecipe: boolean;
}

const TABS: { key: TabType; label: string; emoji: string }[] = [
  { key: 'fridge', label: '냉장고', emoji: '🧊' },
  { key: 'recipes', label: '레시피 추천', emoji: '🍳' },
  { key: 'detail', label: '레시피 상세', emoji: '📖' },
];

export default function TabNav({ activeTab, onTabChange, hasSelectedRecipe }: TabNavProps) {
  return (
    <nav className="flex border-b-4 border-pixel-border bg-pixel-bg">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const isDisabled = tab.key === 'detail' && !hasSelectedRecipe;

        return (
          <button
            key={tab.key}
            onClick={() => !isDisabled && onTabChange(tab.key)}
            disabled={isDisabled}
            className={`
              text-[16px] px-3 py-2 cursor-pointer border-r-4 border-pixel-border last:border-r-0
              ${isActive ? 'bg-pixel-light text-pixel-text border-b-4 border-b-pixel-light -mb-[4px]' : 'bg-pixel-panel text-pixel-text/70 hover:bg-pixel-panel/80'}
              ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}
            `}
          >
            {tab.emoji} {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
