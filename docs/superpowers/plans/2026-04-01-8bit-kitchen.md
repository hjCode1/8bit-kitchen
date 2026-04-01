# 8bit Kitchen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Stardew Valley-styled pixel art web app for managing fridge ingredients and generating AI-powered recipe suggestions.

**Architecture:** Single-page React app with tab-based navigation (Fridge / Recipe Suggestions / Recipe Detail). Supabase for persistent storage with public RLS policies. Google Gemini for recipe generation. PIN code for access control. All client-side, no backend server.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4 (@tailwindcss/vite), Supabase (PostgreSQL), Google Gemini (@google/genai), Press Start 2P font

**Spec:** `docs/superpowers/specs/2026-04-01-8bit-kitchen-design.md`

---

## File Structure

```
8bit-kitchen/
├── index.html                    # Vite entry HTML
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite + React + Tailwind plugins
├── tsconfig.json                 # TypeScript config (references)
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.node.json            # Node-specific TS config
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
│
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Root component, providers, PIN gate, tab routing
    ├── index.css                 # Tailwind import + custom pixel theme + font-face
    ├── vite-env.d.ts             # Vite env type declarations
    │
    ├── types/
    │   └── index.ts              # All shared TypeScript interfaces
    │
    ├── lib/
    │   ├── supabase.ts           # Supabase client init
    │   ├── gemini.ts             # Gemini client, prompt builder, response parser
    │   ├── rateLimiter.ts        # localStorage-based rate limiter
    │   └── pinAuth.ts            # PIN hashing and verification logic
    │
    ├── services/
    │   ├── ingredientService.ts  # Supabase CRUD for ingredients
    │   └── recipeService.ts      # Supabase save/fetch for recipe_history
    │
    ├── context/
    │   ├── FridgeContext.tsx      # Ingredient state + dispatch
    │   └── RecipeContext.tsx      # Recipe generation state + dispatch
    │
    ├── hooks/
    │   ├── useFridge.ts          # Convenience hook for FridgeContext
    │   ├── useRecipes.ts         # Convenience hook for RecipeContext + Gemini
    │   └── useRateLimit.ts       # Rate limit state and cooldown timer
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx        # Pixel art title bar
    │   │   └── TabNav.tsx        # Tab switching buttons
    │   │
    │   ├── auth/
    │   │   ├── PinEntry.tsx      # 4-digit PIN input screen
    │   │   └── PinSetup.tsx      # First-time PIN creation
    │   │
    │   ├── fridge/
    │   │   ├── FridgeView.tsx    # Fridge tab orchestrator
    │   │   ├── CategoryFilter.tsx # Category filter buttons
    │   │   ├── IngredientGrid.tsx # Inventory-style grid container
    │   │   ├── IngredientSlot.tsx # Single grid cell
    │   │   └── AddIngredientModal.tsx # Add ingredient form modal
    │   │
    │   ├── recipe/
    │   │   ├── RecipeSuggestionView.tsx # Recipe tab orchestrator
    │   │   ├── IngredientChips.tsx      # Current ingredients as chips
    │   │   ├── GenerateButton.tsx       # Generate with cooldown
    │   │   ├── RecipeCardList.tsx       # Recipe cards grid
    │   │   └── RecipeCard.tsx           # Single recipe card
    │   │
    │   ├── detail/
    │   │   ├── RecipeDetailView.tsx     # Detail tab orchestrator
    │   │   ├── RecipeHeader.tsx         # Title, time, difficulty
    │   │   ├── IngredientChecklist.tsx  # Required ingredients with match
    │   │   └── StepList.tsx            # Numbered cooking steps
    │   │
    │   └── ui/
    │       ├── PixelButton.tsx   # Reusable pixel-style button
    │       ├── PixelCard.tsx     # Reusable pixel-style card
    │       ├── PixelModal.tsx    # Reusable pixel-style modal overlay
    │       ├── PixelInput.tsx    # Reusable pixel-style text input
    │       └── PixelSelect.tsx   # Reusable pixel-style dropdown
    │
    └── data/
        ├── categories.ts         # Category definitions with emojis/colors
        └── ingredientPresets.ts  # Common Korean ingredients per category
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `.gitignore`, `.env.example`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

- [ ] **Step 1: Initialize Vite project**

```bash
cd /Users/tooning/Documents/GitHub/8bit-kitchen
npm create vite@latest . -- --template react-ts
```

Select "Ignore files and continue" if prompted about existing files.

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @google/genai
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Vite with Tailwind**

Replace `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

- [ ] **Step 4: Set up pixel theme in index.css**

Replace `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --font-pixel: "Press Start 2P", cursive;

  --color-pixel-bg: #F5E6C8;
  --color-pixel-panel: #D4A574;
  --color-pixel-border: #8B5E3C;
  --color-pixel-green: #6B8E23;
  --color-pixel-red: #CD5C5C;
  --color-pixel-blue: #5B8DBE;
  --color-pixel-gold: #DAA520;
  --color-pixel-text: #3E2723;
  --color-pixel-light: #FFF8E7;

  --shadow-pixel: 4px 4px 0px 0px #8B5E3C;
  --shadow-pixel-sm: 2px 2px 0px 0px #8B5E3C;
}

@font-face {
  font-family: "Press Start 2P";
  src: url("https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

* {
  border-radius: 0 !important;
  image-rendering: pixelated;
}

body {
  font-family: "Press Start 2P", cursive;
  background-color: #F5E6C8;
  color: #3E2723;
  margin: 0;
}
```

- [ ] **Step 5: Set up App.tsx placeholder**

Replace `src/App.tsx`:

```tsx
function App() {
  return (
    <div className="min-h-screen bg-pixel-bg p-4">
      <h1 className="font-pixel text-lg text-pixel-text text-center py-8">
        8 B I T &nbsp; K I T C H E N
      </h1>
    </div>
  )
}

export default App
```

- [ ] **Step 6: Create .env.example**

Create `.env.example`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Add `.env` to `.gitignore` (it should already be there from the Vite template, but verify).

- [ ] **Step 7: Verify dev server**

```bash
npm run dev
```

Expected: Browser opens showing "8 B I T  K I T C H E N" in pixel font on a warm parchment background. No errors in console.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind v4 project with pixel theme"
```

---

## Task 2: TypeScript Types & Data Constants

**Files:**
- Create: `src/types/index.ts`, `src/data/categories.ts`, `src/data/ingredientPresets.ts`

- [ ] **Step 1: Create shared types**

Create `src/types/index.ts`:

```typescript
export type IngredientCategory =
  | '채소'
  | '과일'
  | '육류'
  | '해산물'
  | '유제품'
  | '양념'
  | '곡물'
  | '기타';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: string | null;
  emoji: string | null;
  created_at: string;
}

export interface RecipeStep {
  order: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients_used: string[];
  steps: RecipeStep[];
  cook_time: string | null;
  difficulty: '쉬움' | '보통' | '어려움' | null;
  servings: string | null;
  created_at: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients_used: string[];
  steps: RecipeStep[];
  cook_time: string;
  difficulty: '쉬움' | '보통' | '어려움';
  servings: string;
}

export type TabType = 'fridge' | 'recipes' | 'detail';

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: Ingredient;
        Insert: Omit<Ingredient, 'id' | 'created_at'>;
        Update: Partial<Omit<Ingredient, 'id' | 'created_at'>>;
      };
      recipe_history: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'created_at'>;
        Update: Partial<Omit<Recipe, 'id' | 'created_at'>>;
      };
      app_config: {
        Row: { key: string; value: string };
        Insert: { key: string; value: string };
        Update: { key?: string; value?: string };
      };
    };
  };
}
```

- [ ] **Step 2: Create category definitions**

Create `src/data/categories.ts`:

```typescript
import type { IngredientCategory } from '../types';

export interface CategoryInfo {
  name: IngredientCategory;
  emoji: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { name: '채소', emoji: '🥬', color: 'bg-pixel-green' },
  { name: '과일', emoji: '🍎', color: 'bg-pixel-red' },
  { name: '육류', emoji: '🥩', color: 'bg-pixel-red' },
  { name: '해산물', emoji: '🐟', color: 'bg-pixel-blue' },
  { name: '유제품', emoji: '🧀', color: 'bg-pixel-light' },
  { name: '양념', emoji: '🧂', color: 'bg-pixel-gold' },
  { name: '곡물', emoji: '🌾', color: 'bg-pixel-gold' },
  { name: '기타', emoji: '📦', color: 'bg-pixel-panel' },
];
```

- [ ] **Step 3: Create ingredient presets**

Create `src/data/ingredientPresets.ts`:

```typescript
import type { IngredientCategory } from '../types';

export interface PresetIngredient {
  name: string;
  emoji: string;
}

export const INGREDIENT_PRESETS: Record<IngredientCategory, PresetIngredient[]> = {
  '채소': [
    { name: '당근', emoji: '🥕' },
    { name: '감자', emoji: '🥔' },
    { name: '양파', emoji: '🧅' },
    { name: '배추', emoji: '🥬' },
    { name: '시금치', emoji: '🥬' },
    { name: '대파', emoji: '🧅' },
    { name: '마늘', emoji: '🧄' },
    { name: '고추', emoji: '🌶️' },
    { name: '브로콜리', emoji: '🥦' },
    { name: '무', emoji: '🥬' },
    { name: '호박', emoji: '🎃' },
    { name: '버섯', emoji: '🍄' },
    { name: '콩나물', emoji: '🌱' },
    { name: '오이', emoji: '🥒' },
    { name: '토마토', emoji: '🍅' },
    { name: '상추', emoji: '🥬' },
  ],
  '과일': [
    { name: '사과', emoji: '🍎' },
    { name: '바나나', emoji: '🍌' },
    { name: '딸기', emoji: '🍓' },
    { name: '포도', emoji: '🍇' },
    { name: '귤', emoji: '🍊' },
    { name: '수박', emoji: '🍉' },
    { name: '레몬', emoji: '🍋' },
    { name: '배', emoji: '🍐' },
  ],
  '육류': [
    { name: '돼지고기', emoji: '🥩' },
    { name: '소고기', emoji: '🥩' },
    { name: '닭고기', emoji: '🍗' },
    { name: '삼겹살', emoji: '🥓' },
    { name: '목살', emoji: '🥩' },
    { name: '닭가슴살', emoji: '🍗' },
    { name: '다진고기', emoji: '🥩' },
    { name: '소시지', emoji: '🌭' },
    { name: '베이컨', emoji: '🥓' },
    { name: '햄', emoji: '🍖' },
  ],
  '해산물': [
    { name: '새우', emoji: '🦐' },
    { name: '오징어', emoji: '🦑' },
    { name: '조개', emoji: '🐚' },
    { name: '연어', emoji: '🐟' },
    { name: '고등어', emoji: '🐟' },
    { name: '참치캔', emoji: '🐟' },
    { name: '멸치', emoji: '🐟' },
    { name: '김', emoji: '🟢' },
    { name: '미역', emoji: '🟢' },
  ],
  '유제품': [
    { name: '우유', emoji: '🥛' },
    { name: '치즈', emoji: '🧀' },
    { name: '버터', emoji: '🧈' },
    { name: '달걀', emoji: '🥚' },
    { name: '요거트', emoji: '🥛' },
    { name: '생크림', emoji: '🥛' },
  ],
  '양념': [
    { name: '간장', emoji: '🫗' },
    { name: '고추장', emoji: '🫗' },
    { name: '된장', emoji: '🫗' },
    { name: '소금', emoji: '🧂' },
    { name: '설탕', emoji: '🧂' },
    { name: '식초', emoji: '🫗' },
    { name: '참기름', emoji: '🫗' },
    { name: '고춧가루', emoji: '🌶️' },
    { name: '후추', emoji: '🧂' },
    { name: '올리브오일', emoji: '🫒' },
    { name: '굴소스', emoji: '🫗' },
    { name: '맛술', emoji: '🍶' },
  ],
  '곡물': [
    { name: '쌀', emoji: '🍚' },
    { name: '면 (라면)', emoji: '🍜' },
    { name: '파스타면', emoji: '🍝' },
    { name: '식빵', emoji: '🍞' },
    { name: '떡', emoji: '🍡' },
    { name: '밀가루', emoji: '🌾' },
    { name: '당면', emoji: '🍜' },
  ],
  '기타': [
    { name: '두부', emoji: '🧈' },
    { name: '어묵', emoji: '🍢' },
    { name: '김치', emoji: '🥬' },
    { name: '만두', emoji: '🥟' },
    { name: '카레가루', emoji: '🍛' },
    { name: '케첩', emoji: '🍅' },
    { name: '마요네즈', emoji: '🥚' },
  ],
};
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/types/ src/data/
git commit -m "feat: add TypeScript types and ingredient preset data"
```

---

## Task 3: Pixel UI Components

**Files:**
- Create: `src/components/ui/PixelButton.tsx`, `src/components/ui/PixelCard.tsx`, `src/components/ui/PixelModal.tsx`, `src/components/ui/PixelInput.tsx`, `src/components/ui/PixelSelect.tsx`

- [ ] **Step 1: Create PixelButton**

Create `src/components/ui/PixelButton.tsx`:

```tsx
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
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-[8px]' : 'px-4 py-2 text-[10px]';

  return (
    <button
      className={`
        font-pixel ${sizeClass} border-4 ${VARIANT_STYLES[variant]}
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
```

- [ ] **Step 2: Create PixelCard**

Create `src/components/ui/PixelCard.tsx`:

```tsx
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
```

- [ ] **Step 3: Create PixelModal**

Create `src/components/ui/PixelModal.tsx`:

```tsx
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
          <h2 className="font-pixel text-[10px] text-pixel-text">{title}</h2>
          <button
            onClick={onClose}
            className="font-pixel text-[10px] text-pixel-red cursor-pointer hover:opacity-70"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create PixelInput**

Create `src/components/ui/PixelInput.tsx`:

```tsx
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
```

- [ ] **Step 5: Create PixelSelect**

Create `src/components/ui/PixelSelect.tsx`:

```tsx
import type { SelectHTMLAttributes } from 'react';

interface PixelSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function PixelSelect({ label, options, className = '', ...props }: PixelSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-pixel text-[8px] text-pixel-text">{label}</label>
      )}
      <select
        className={`
          font-pixel text-[10px] bg-pixel-light border-4 border-pixel-border
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
```

- [ ] **Step 6: Verify by importing in App.tsx**

Temporarily update `src/App.tsx`:

```tsx
import PixelButton from './components/ui/PixelButton';
import PixelCard from './components/ui/PixelCard';

function App() {
  return (
    <div className="min-h-screen bg-pixel-bg p-4">
      <h1 className="font-pixel text-lg text-pixel-text text-center py-8">
        8 B I T &nbsp; K I T C H E N
      </h1>
      <div className="flex gap-4 justify-center mb-4">
        <PixelButton>Primary</PixelButton>
        <PixelButton variant="secondary">Secondary</PixelButton>
        <PixelButton variant="danger">Danger</PixelButton>
      </div>
      <div className="max-w-sm mx-auto">
        <PixelCard>
          <p className="font-pixel text-[10px]">This is a pixel card!</p>
        </PixelCard>
      </div>
    </div>
  );
}

export default App;
```

Run: `npm run dev` and verify pixel buttons and card render with correct styles. Buttons should have 4px borders, drop shadows, and the press effect on click.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add pixel-style UI components (Button, Card, Modal, Input, Select)"
```

---

## Task 4: Layout & Tab Navigation

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/TabNav.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Header**

Create `src/components/layout/Header.tsx`:

```tsx
export default function Header() {
  return (
    <header className="bg-pixel-panel border-b-4 border-pixel-border px-4 py-3">
      <h1 className="font-pixel text-sm text-pixel-text text-center tracking-widest">
        8 B I T &nbsp; K I T C H E N
      </h1>
    </header>
  );
}
```

- [ ] **Step 2: Create TabNav**

Create `src/components/layout/TabNav.tsx`:

```tsx
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
              font-pixel text-[8px] px-3 py-2 cursor-pointer border-r-4 border-pixel-border last:border-r-0
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
```

- [ ] **Step 3: Update App.tsx with layout and tab switching**

Replace `src/App.tsx`:

```tsx
import { useState } from 'react';
import type { TabType } from './types';
import Header from './components/layout/Header';
import TabNav from './components/layout/TabNav';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('fridge');

  return (
    <div className="min-h-screen bg-pixel-bg">
      <div className="max-w-2xl mx-auto border-x-4 border-pixel-border min-h-screen flex flex-col">
        <Header />
        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasSelectedRecipe={false}
        />
        <main className="flex-1 p-4">
          {activeTab === 'fridge' && (
            <p className="font-pixel text-[10px] text-center py-8">냉장고 탭 (구현 예정)</p>
          )}
          {activeTab === 'recipes' && (
            <p className="font-pixel text-[10px] text-center py-8">레시피 추천 탭 (구현 예정)</p>
          )}
          {activeTab === 'detail' && (
            <p className="font-pixel text-[10px] text-center py-8">레시피 상세 탭 (구현 예정)</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 4: Verify tab switching**

Run: `npm run dev`
Expected: Header displays title. Three tabs below header. Clicking tabs switches content. "레시피 상세" tab is disabled (grayed out). Active tab has lighter background.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/ src/App.tsx
git commit -m "feat: add Header, TabNav, and tab switching layout"
```

---

## Task 5: Supabase Client & Services

**Files:**
- Create: `src/lib/supabase.ts`, `src/services/ingredientService.ts`, `src/services/recipeService.ts`
- Modify: `src/vite-env.d.ts`

- [ ] **Step 1: Add env type declarations**

Replace `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 2: Create Supabase client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 3: Create ingredient service**

Create `src/services/ingredientService.ts`:

```typescript
import { supabase } from '../lib/supabase';
import type { Ingredient } from '../types';

export async function fetchIngredients(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addIngredient(
  ingredient: Omit<Ingredient, 'id' | 'created_at'>
): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .insert(ingredient)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeIngredient(id: string): Promise<void> {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
```

- [ ] **Step 4: Create recipe service**

Create `src/services/recipeService.ts`:

```typescript
import { supabase } from '../lib/supabase';
import type { Recipe, GeneratedRecipe } from '../types';

export async function saveRecipe(recipe: GeneratedRecipe): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipe_history')
    .insert({
      title: recipe.title,
      description: recipe.description,
      ingredients_used: recipe.ingredients_used,
      steps: recipe.steps,
      cook_time: recipe.cook_time,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchRecipeHistory(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipe_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabase.ts src/services/ src/vite-env.d.ts
git commit -m "feat: add Supabase client and ingredient/recipe services"
```

---

## Task 6: PIN Authentication

**Files:**
- Create: `src/lib/pinAuth.ts`, `src/components/auth/PinEntry.tsx`, `src/components/auth/PinSetup.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create PIN auth utilities**

Create `src/lib/pinAuth.ts`:

```typescript
import { supabase } from './supabase';

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function isPinSet(): Promise<boolean> {
  const { data } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'pin_hash')
    .single();
  return !!data;
}

export async function setupPin(pin: string): Promise<void> {
  const hash = await hashPin(pin);
  const { error } = await supabase
    .from('app_config')
    .upsert({ key: 'pin_hash', value: hash });
  if (error) throw error;
}

export async function verifyPin(pin: string): Promise<boolean> {
  const hash = await hashPin(pin);
  const { data } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'pin_hash')
    .single();
  return data?.value === hash;
}
```

- [ ] **Step 2: Create PinEntry component**

Create `src/components/auth/PinEntry.tsx`:

```tsx
import { useState, useRef } from 'react';
import { verifyPin } from '../../lib/pinAuth';
import PixelButton from '../ui/PixelButton';

interface PinEntryProps {
  onSuccess: () => void;
}

export default function PinEntry({ onSuccess }: PinEntryProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (locked) return;

    const pinStr = pin.join('');
    if (pinStr.length !== 4) return;

    const valid = await verifyPin(pinStr);
    if (valid) {
      sessionStorage.setItem('8bit-kitchen-auth', 'true');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin(['', '', '', '']);
      inputRefs.current[0]?.focus();

      if (newAttempts >= 3) {
        setLocked(true);
        setError('3회 실패! 30초 후 다시 시도하세요.');
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setError('');
        }, 30000);
      } else {
        setError(`PIN이 틀렸습니다. (${newAttempts}/3)`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
      <div className="bg-pixel-light border-4 border-pixel-border shadow-pixel p-8 text-center">
        <h1 className="font-pixel text-sm text-pixel-text mb-2">8 B I T</h1>
        <h2 className="font-pixel text-xs text-pixel-text mb-6">K I T C H E N</h2>
        <p className="font-pixel text-[8px] text-pixel-text mb-4">PIN을 입력하세요</p>

        <div className="flex gap-2 justify-center mb-4">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={locked}
              className="w-12 h-12 text-center font-pixel text-lg bg-pixel-bg border-4 border-pixel-border outline-none focus:border-pixel-gold"
            />
          ))}
        </div>

        {error && (
          <p className="font-pixel text-[8px] text-pixel-red mb-3">{error}</p>
        )}

        <PixelButton onClick={handleSubmit} disabled={locked || pin.join('').length !== 4}>
          입장하기
        </PixelButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create PinSetup component**

Create `src/components/auth/PinSetup.tsx`:

```tsx
import { useState, useRef } from 'react';
import { setupPin } from '../../lib/pinAuth';
import PixelButton from '../ui/PixelButton';

interface PinSetupProps {
  onComplete: () => void;
}

export default function PinSetup({ onComplete }: PinSetupProps) {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState(['', '', '', '']);
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const pinStr = pin.join('');
    if (pinStr.length !== 4) return;

    if (step === 'create') {
      setFirstPin(pinStr);
      setPin(['', '', '', '']);
      setStep('confirm');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      if (pinStr !== firstPin) {
        setError('PIN이 일치하지 않습니다. 다시 입력하세요.');
        setPin(['', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      await setupPin(pinStr);
      sessionStorage.setItem('8bit-kitchen-auth', 'true');
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
      <div className="bg-pixel-light border-4 border-pixel-border shadow-pixel p-8 text-center">
        <h1 className="font-pixel text-sm text-pixel-text mb-2">8 B I T</h1>
        <h2 className="font-pixel text-xs text-pixel-text mb-6">K I T C H E N</h2>
        <p className="font-pixel text-[8px] text-pixel-text mb-1">
          {step === 'create' ? '새 PIN을 설정하세요' : 'PIN을 다시 입력하세요'}
        </p>
        <p className="font-pixel text-[8px] text-pixel-text/50 mb-4">
          (숫자 4자리)
        </p>

        <div className="flex gap-2 justify-center mb-4">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 text-center font-pixel text-lg bg-pixel-bg border-4 border-pixel-border outline-none focus:border-pixel-gold"
            />
          ))}
        </div>

        {error && (
          <p className="font-pixel text-[8px] text-pixel-red mb-3">{error}</p>
        )}

        <PixelButton onClick={handleSubmit} disabled={pin.join('').length !== 4}>
          {step === 'create' ? '다음' : '설정 완료'}
        </PixelButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Integrate PIN gate into App.tsx**

Replace `src/App.tsx`:

```tsx
import { useState, useEffect } from 'react';
import type { TabType, Recipe } from './types';
import { isPinSet } from './lib/pinAuth';
import Header from './components/layout/Header';
import TabNav from './components/layout/TabNav';
import PinEntry from './components/auth/PinEntry';
import PinSetup from './components/auth/PinSetup';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('fridge');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [authState, setAuthState] = useState<'loading' | 'needSetup' | 'needPin' | 'authenticated'>('loading');

  useEffect(() => {
    const checkAuth = async () => {
      if (sessionStorage.getItem('8bit-kitchen-auth') === 'true') {
        setAuthState('authenticated');
        return;
      }

      const pinExists = await isPinSet();
      setAuthState(pinExists ? 'needPin' : 'needSetup');
    };
    checkAuth();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
        <p className="font-pixel text-[10px] text-pixel-text">로딩 중...</p>
      </div>
    );
  }

  if (authState === 'needSetup') {
    return <PinSetup onComplete={() => setAuthState('authenticated')} />;
  }

  if (authState === 'needPin') {
    return <PinEntry onSuccess={() => setAuthState('authenticated')} />;
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveTab('detail');
  };

  return (
    <div className="min-h-screen bg-pixel-bg">
      <div className="max-w-2xl mx-auto border-x-4 border-pixel-border min-h-screen flex flex-col">
        <Header />
        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasSelectedRecipe={!!selectedRecipe}
        />
        <main className="flex-1 p-4">
          {activeTab === 'fridge' && (
            <p className="font-pixel text-[10px] text-center py-8">냉장고 탭 (구현 예정)</p>
          )}
          {activeTab === 'recipes' && (
            <p className="font-pixel text-[10px] text-center py-8">레시피 추천 탭 (구현 예정)</p>
          )}
          {activeTab === 'detail' && selectedRecipe && (
            <p className="font-pixel text-[10px] text-center py-8">레시피 상세 탭 (구현 예정)</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 5: Verify PIN flow**

This requires Supabase tables to be created first. For now, verify TypeScript compiles:

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/pinAuth.ts src/components/auth/ src/App.tsx
git commit -m "feat: add PIN code authentication (setup and entry)"
```

---

## Task 7: Fridge Context & Hook

**Files:**
- Create: `src/context/FridgeContext.tsx`, `src/hooks/useFridge.ts`

- [ ] **Step 1: Create FridgeContext**

Create `src/context/FridgeContext.tsx`:

```tsx
import { createContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react';
import type { Ingredient, IngredientCategory } from '../types';
import { fetchIngredients, addIngredient as addIngredientApi, removeIngredient as removeIngredientApi } from '../services/ingredientService';

interface FridgeState {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: IngredientCategory | '전체';
}

type FridgeAction =
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CATEGORY'; payload: IngredientCategory | '전체' };

const initialState: FridgeState = {
  ingredients: [],
  isLoading: true,
  error: null,
  selectedCategory: '전체',
};

function fridgeReducer(state: FridgeState, action: FridgeAction): FridgeState {
  switch (action.type) {
    case 'SET_INGREDIENTS':
      return { ...state, ingredients: action.payload, isLoading: false };
    case 'ADD_INGREDIENT':
      return { ...state, ingredients: [action.payload, ...state.ingredients] };
    case 'REMOVE_INGREDIENT':
      return { ...state, ingredients: state.ingredients.filter((i) => i.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
  }
}

export const FridgeContext = createContext<{
  state: FridgeState;
  dispatch: Dispatch<FridgeAction>;
}>({ state: initialState, dispatch: () => {} });

export function FridgeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fridgeReducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchIngredients();
        dispatch({ type: 'SET_INGREDIENTS', payload: data });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: '재료를 불러오는데 실패했습니다.' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    load();
  }, []);

  return (
    <FridgeContext.Provider value={{ state, dispatch }}>
      {children}
    </FridgeContext.Provider>
  );
}
```

- [ ] **Step 2: Create useFridge hook**

Create `src/hooks/useFridge.ts`:

```typescript
import { useContext } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import { addIngredient as addIngredientApi, removeIngredient as removeIngredientApi } from '../services/ingredientService';
import type { Ingredient, IngredientCategory } from '../types';

export function useFridge() {
  const { state, dispatch } = useContext(FridgeContext);

  const addIngredient = async (data: Omit<Ingredient, 'id' | 'created_at'>) => {
    // Optimistic: create a temp ingredient for immediate UI update
    const tempId = crypto.randomUUID();
    const tempIngredient: Ingredient = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_INGREDIENT', payload: tempIngredient });

    try {
      const saved = await addIngredientApi(data);
      // Replace temp with real
      dispatch({ type: 'REMOVE_INGREDIENT', payload: tempId });
      dispatch({ type: 'ADD_INGREDIENT', payload: saved });
    } catch {
      // Rollback
      dispatch({ type: 'REMOVE_INGREDIENT', payload: tempId });
      dispatch({ type: 'SET_ERROR', payload: '재료 추가에 실패했습니다.' });
    }
  };

  const removeIngredient = async (id: string) => {
    const existing = state.ingredients.find((i) => i.id === id);
    dispatch({ type: 'REMOVE_INGREDIENT', payload: id });

    try {
      await removeIngredientApi(id);
    } catch {
      // Rollback
      if (existing) {
        dispatch({ type: 'ADD_INGREDIENT', payload: existing });
      }
      dispatch({ type: 'SET_ERROR', payload: '재료 삭제에 실패했습니다.' });
    }
  };

  const setCategory = (category: IngredientCategory | '전체') => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const filteredIngredients =
    state.selectedCategory === '전체'
      ? state.ingredients
      : state.ingredients.filter((i) => i.category === state.selectedCategory);

  return {
    ingredients: state.ingredients,
    filteredIngredients,
    isLoading: state.isLoading,
    error: state.error,
    selectedCategory: state.selectedCategory,
    addIngredient,
    removeIngredient,
    setCategory,
  };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/context/FridgeContext.tsx src/hooks/useFridge.ts
git commit -m "feat: add FridgeContext and useFridge hook with optimistic updates"
```

---

## Task 8: Fridge UI Components

**Files:**
- Create: `src/components/fridge/FridgeView.tsx`, `src/components/fridge/CategoryFilter.tsx`, `src/components/fridge/IngredientGrid.tsx`, `src/components/fridge/IngredientSlot.tsx`, `src/components/fridge/AddIngredientModal.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create CategoryFilter**

Create `src/components/fridge/CategoryFilter.tsx`:

```tsx
import type { IngredientCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface CategoryFilterProps {
  selected: IngredientCategory | '전체';
  onSelect: (category: IngredientCategory | '전체') => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 mb-4">
      <button
        onClick={() => onSelect('전체')}
        className={`
          font-pixel text-[8px] px-2 py-1 border-2 border-pixel-border cursor-pointer
          ${selected === '전체' ? 'bg-pixel-gold text-pixel-text' : 'bg-pixel-light text-pixel-text/70'}
        `}
      >
        전체
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`
            font-pixel text-[8px] px-2 py-1 border-2 border-pixel-border cursor-pointer
            ${selected === cat.name ? 'bg-pixel-gold text-pixel-text' : 'bg-pixel-light text-pixel-text/70'}
          `}
        >
          {cat.emoji} {cat.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create IngredientSlot**

Create `src/components/fridge/IngredientSlot.tsx`:

```tsx
import { useState } from 'react';
import type { Ingredient } from '../../types';

interface IngredientSlotProps {
  ingredient?: Ingredient;
  onRemove?: (id: string) => void;
}

export default function IngredientSlot({ ingredient, onRemove }: IngredientSlotProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!ingredient) {
    return (
      <div className="w-full aspect-square border-2 border-dashed border-pixel-border/30 flex items-center justify-center">
        <span className="text-pixel-border/20 text-lg">+</span>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="w-full aspect-square border-2 border-pixel-red bg-pixel-red/10 flex flex-col items-center justify-center gap-1 p-1">
        <p className="font-pixel text-[6px] text-pixel-red text-center">삭제?</p>
        <div className="flex gap-1">
          <button
            onClick={() => onRemove?.(ingredient.id)}
            className="font-pixel text-[6px] bg-pixel-red text-pixel-light px-1 cursor-pointer border border-pixel-border"
          >
            예
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="font-pixel text-[6px] bg-pixel-light text-pixel-text px-1 cursor-pointer border border-pixel-border"
          >
            아니오
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setShowConfirm(true)}
      className="w-full aspect-square border-2 border-pixel-border bg-pixel-light flex flex-col items-center justify-center cursor-pointer hover:bg-pixel-panel/30 p-1"
    >
      <span className="text-xl leading-none">{ingredient.emoji || '📦'}</span>
      <span className="font-pixel text-[6px] text-pixel-text mt-1 text-center leading-tight truncate w-full">
        {ingredient.name}
      </span>
      {ingredient.quantity && (
        <span className="font-pixel text-[5px] text-pixel-text/60 mt-0.5">
          {ingredient.quantity}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create IngredientGrid**

Create `src/components/fridge/IngredientGrid.tsx`:

```tsx
import type { Ingredient } from '../../types';
import IngredientSlot from './IngredientSlot';

interface IngredientGridProps {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
}

const GRID_SIZE = 30; // 6x5

export default function IngredientGrid({ ingredients, onRemove }: IngredientGridProps) {
  const slots = Array.from({ length: GRID_SIZE }, (_, i) => ingredients[i] || undefined);

  return (
    <div className="grid grid-cols-6 gap-1 bg-pixel-panel/30 border-4 border-pixel-border p-2">
      {slots.map((ingredient, i) => (
        <IngredientSlot key={ingredient?.id || `empty-${i}`} ingredient={ingredient} onRemove={onRemove} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create AddIngredientModal**

Create `src/components/fridge/AddIngredientModal.tsx`:

```tsx
import { useState } from 'react';
import type { IngredientCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { INGREDIENT_PRESETS } from '../../data/ingredientPresets';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';
import PixelInput from '../ui/PixelInput';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; category: IngredientCategory; quantity: string | null; emoji: string | null }) => void;
}

export default function AddIngredientModal({ isOpen, onClose, onAdd }: AddIngredientModalProps) {
  const [category, setCategory] = useState<IngredientCategory>('채소');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [quantity, setQuantity] = useState('');

  const presets = INGREDIENT_PRESETS[category];
  const isCustom = selectedPreset === '__custom__';

  const handleAdd = () => {
    const preset = presets.find((p) => p.name === selectedPreset);
    const name = isCustom ? customName.trim() : selectedPreset;
    if (!name) return;

    onAdd({
      name,
      category,
      quantity: quantity.trim() || null,
      emoji: isCustom ? null : preset?.emoji || null,
    });

    // Reset
    setSelectedPreset(null);
    setCustomName('');
    setQuantity('');
    onClose();
  };

  const handleClose = () => {
    setSelectedPreset(null);
    setCustomName('');
    setQuantity('');
    onClose();
  };

  return (
    <PixelModal isOpen={isOpen} onClose={handleClose} title="재료 추가">
      {/* Category selection */}
      <div className="mb-3">
        <p className="font-pixel text-[8px] text-pixel-text mb-1">카테고리</p>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { setCategory(cat.name); setSelectedPreset(null); }}
              className={`
                font-pixel text-[7px] px-2 py-1 border-2 border-pixel-border cursor-pointer
                ${category === cat.name ? 'bg-pixel-gold' : 'bg-pixel-light'}
              `}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preset selection */}
      <div className="mb-3">
        <p className="font-pixel text-[8px] text-pixel-text mb-1">재료 선택</p>
        <div className="max-h-32 overflow-y-auto border-2 border-pixel-border bg-pixel-bg p-1">
          <div className="flex flex-wrap gap-1">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset.name)}
                className={`
                  font-pixel text-[7px] px-2 py-1 border border-pixel-border cursor-pointer
                  ${selectedPreset === preset.name ? 'bg-pixel-gold' : 'bg-pixel-light'}
                `}
              >
                {preset.emoji} {preset.name}
              </button>
            ))}
            <button
              onClick={() => setSelectedPreset('__custom__')}
              className={`
                font-pixel text-[7px] px-2 py-1 border border-pixel-border cursor-pointer
                ${isCustom ? 'bg-pixel-gold' : 'bg-pixel-light'}
              `}
            >
              ✏️ 직접 입력
            </button>
          </div>
        </div>
      </div>

      {/* Custom name input */}
      {isCustom && (
        <div className="mb-3">
          <PixelInput
            label="재료명"
            placeholder="재료 이름을 입력하세요"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </div>
      )}

      {/* Quantity input */}
      <div className="mb-4">
        <PixelInput
          label="수량 (선택)"
          placeholder="예: 2개, 500g"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-2">
        <PixelButton variant="secondary" onClick={handleClose}>취소</PixelButton>
        <PixelButton
          onClick={handleAdd}
          disabled={isCustom ? !customName.trim() : !selectedPreset}
        >
          추가
        </PixelButton>
      </div>
    </PixelModal>
  );
}
```

- [ ] **Step 5: Create FridgeView**

Create `src/components/fridge/FridgeView.tsx`:

```tsx
import { useState } from 'react';
import { useFridge } from '../../hooks/useFridge';
import CategoryFilter from './CategoryFilter';
import IngredientGrid from './IngredientGrid';
import AddIngredientModal from './AddIngredientModal';
import PixelButton from '../ui/PixelButton';

export default function FridgeView() {
  const { filteredIngredients, isLoading, error, selectedCategory, addIngredient, removeIngredient, setCategory } = useFridge();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <p className="font-pixel text-[10px] text-center py-8">재료를 불러오는 중...</p>;
  }

  return (
    <div>
      {error && (
        <p className="font-pixel text-[8px] text-pixel-red text-center mb-2">{error}</p>
      )}

      <CategoryFilter selected={selectedCategory} onSelect={setCategory} />
      <IngredientGrid ingredients={filteredIngredients} onRemove={removeIngredient} />

      <div className="mt-4 text-center">
        <PixelButton onClick={() => setIsModalOpen(true)}>
          + 재료 추가하기
        </PixelButton>
      </div>

      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addIngredient}
      />
    </div>
  );
}
```

- [ ] **Step 6: Wire FridgeView into App.tsx**

Update `src/App.tsx` - add FridgeProvider and FridgeView:

Replace the import section at the top:

```tsx
import { useState, useEffect } from 'react';
import type { TabType, Recipe } from './types';
import { isPinSet } from './lib/pinAuth';
import { FridgeProvider } from './context/FridgeContext';
import Header from './components/layout/Header';
import TabNav from './components/layout/TabNav';
import PinEntry from './components/auth/PinEntry';
import PinSetup from './components/auth/PinSetup';
import FridgeView from './components/fridge/FridgeView';
```

Replace the `return` block for the authenticated state (the last return statement):

```tsx
  return (
    <FridgeProvider>
      <div className="min-h-screen bg-pixel-bg">
        <div className="max-w-2xl mx-auto border-x-4 border-pixel-border min-h-screen flex flex-col">
          <Header />
          <TabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasSelectedRecipe={!!selectedRecipe}
          />
          <main className="flex-1 p-4">
            {activeTab === 'fridge' && <FridgeView />}
            {activeTab === 'recipes' && (
              <p className="font-pixel text-[10px] text-center py-8">레시피 추천 탭 (구현 예정)</p>
            )}
            {activeTab === 'detail' && selectedRecipe && (
              <p className="font-pixel text-[10px] text-center py-8">레시피 상세 탭 (구현 예정)</p>
            )}
          </main>
        </div>
      </div>
    </FridgeProvider>
  );
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/fridge/ src/App.tsx
git commit -m "feat: add Fridge UI (grid, category filter, add modal, slots)"
```

---

## Task 9: Gemini Integration & Rate Limiter

**Files:**
- Create: `src/lib/gemini.ts`, `src/lib/rateLimiter.ts`, `src/hooks/useRateLimit.ts`

- [ ] **Step 1: Create rate limiter**

Create `src/lib/rateLimiter.ts`:

```typescript
const RATE_LIMIT_KEY = '8bit-kitchen-rate-limit';
const COOLDOWN_MS = 60_000;

export function canMakeRequest(): boolean {
  const lastRequest = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastRequest) return true;
  return Date.now() - parseInt(lastRequest) > COOLDOWN_MS;
}

export function recordRequest(): void {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}

export function getCooldownRemaining(): number {
  const lastRequest = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastRequest) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - parseInt(lastRequest)));
}
```

- [ ] **Step 2: Create Gemini client**

Create `src/lib/gemini.ts`:

```typescript
import { GoogleGenAI } from '@google/genai';
import type { GeneratedRecipe } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

function buildRecipePrompt(ingredients: string[]): string {
  return `당신은 한국 가정 요리 전문 셰프입니다.
다음 재료들로 만들 수 있는 레시피 3가지를 추천해주세요.
재료에 없는 기본 양념(소금, 후추, 식용유 등)은 사용해도 됩니다.

현재 냉장고 재료: ${ingredients.join(', ')}

반드시 아래 JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요:
[
  {
    "title": "요리 이름",
    "description": "한 줄 설명",
    "ingredients_used": ["사용한 재료1", "사용한 재료2"],
    "steps": [
      { "order": 1, "instruction": "조리 단계 설명", "tip": "팁 (선택사항, 없으면 생략)" }
    ],
    "cook_time": "소요 시간 (예: 30분)",
    "difficulty": "쉬움",
    "servings": "2인분"
  }
]

difficulty는 반드시 "쉬움", "보통", "어려움" 중 하나를 사용하세요.`;
}

function parseRecipeResponse(text: string): GeneratedRecipe[] {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error('Response is not an array');
  }

  return parsed.map((r: GeneratedRecipe) => ({
    title: r.title,
    description: r.description,
    ingredients_used: r.ingredients_used,
    steps: r.steps.map((s, i) => ({
      order: s.order || i + 1,
      instruction: s.instruction,
      ...(s.tip ? { tip: s.tip } : {}),
    })),
    cook_time: r.cook_time,
    difficulty: r.difficulty,
    servings: r.servings,
  }));
}

export async function generateRecipes(ingredients: string[]): Promise<GeneratedRecipe[]> {
  const prompt = buildRecipePrompt(ingredients);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error('Empty response from Gemini');

  try {
    return parseRecipeResponse(text);
  } catch {
    // Retry once with stricter prompt
    const retryResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt + '\n\n반드시 유효한 JSON 배열만 응답하세요. 마크다운이나 다른 텍스트를 포함하지 마세요.',
    });

    const retryText = retryResponse.text;
    if (!retryText) throw new Error('Empty retry response from Gemini');
    return parseRecipeResponse(retryText);
  }
}
```

- [ ] **Step 3: Create useRateLimit hook**

Create `src/hooks/useRateLimit.ts`:

```typescript
import { useState, useEffect } from 'react';
import { canMakeRequest, getCooldownRemaining } from '../lib/rateLimiter';

export function useRateLimit() {
  const [cooldown, setCooldown] = useState(getCooldownRemaining());

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      const remaining = getCooldownRemaining();
      setCooldown(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return {
    canRequest: canMakeRequest(),
    cooldownSeconds: Math.ceil(cooldown / 1000),
    refresh: () => setCooldown(getCooldownRemaining()),
  };
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gemini.ts src/lib/rateLimiter.ts src/hooks/useRateLimit.ts
git commit -m "feat: add Gemini client, rate limiter, and useRateLimit hook"
```

---

## Task 10: Recipe Context & Hook

**Files:**
- Create: `src/context/RecipeContext.tsx`, `src/hooks/useRecipes.ts`

- [ ] **Step 1: Create RecipeContext**

Create `src/context/RecipeContext.tsx`:

```tsx
import { createContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { Recipe } from '../types';

interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isGenerating: boolean;
  error: string | null;
}

type RecipeAction =
  | { type: 'SET_RECIPES'; payload: Recipe[] }
  | { type: 'SELECT_RECIPE'; payload: Recipe }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_RECIPES' };

const initialState: RecipeState = {
  recipes: [],
  selectedRecipe: null,
  isGenerating: false,
  error: null,
};

function recipeReducer(state: RecipeState, action: RecipeAction): RecipeState {
  switch (action.type) {
    case 'SET_RECIPES':
      return { ...state, recipes: action.payload, isGenerating: false, error: null };
    case 'SELECT_RECIPE':
      return { ...state, selectedRecipe: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isGenerating: false };
    case 'CLEAR_RECIPES':
      return { ...state, recipes: [], selectedRecipe: null };
  }
}

export const RecipeContext = createContext<{
  state: RecipeState;
  dispatch: Dispatch<RecipeAction>;
}>({ state: initialState, dispatch: () => {} });

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
}
```

- [ ] **Step 2: Create useRecipes hook**

Create `src/hooks/useRecipes.ts`:

```typescript
import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { generateRecipes } from '../lib/gemini';
import { recordRequest } from '../lib/rateLimiter';
import { saveRecipe } from '../services/recipeService';
import type { Recipe } from '../types';

export function useRecipes() {
  const { state, dispatch } = useContext(RecipeContext);

  const generate = async (ingredientNames: string[]) => {
    dispatch({ type: 'SET_GENERATING', payload: true });

    try {
      const generated = await generateRecipes(ingredientNames);
      recordRequest();

      // Save to Supabase and get back records with IDs
      const saved: Recipe[] = [];
      for (const recipe of generated) {
        try {
          const record = await saveRecipe(recipe);
          saved.push(record);
        } catch {
          // If save fails, create a local-only record
          saved.push({
            ...recipe,
            id: crypto.randomUUID(),
            description: recipe.description,
            created_at: new Date().toISOString(),
          });
        }
      }

      dispatch({ type: 'SET_RECIPES', payload: saved });
    } catch (err) {
      const message = err instanceof Error && err.message.includes('429')
        ? '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
        : '레시피를 불러올 수 없습니다. 다시 시도해주세요.';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const selectRecipe = (recipe: Recipe) => {
    dispatch({ type: 'SELECT_RECIPE', payload: recipe });
  };

  return {
    recipes: state.recipes,
    selectedRecipe: state.selectedRecipe,
    isGenerating: state.isGenerating,
    error: state.error,
    generate,
    selectRecipe,
  };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/context/RecipeContext.tsx src/hooks/useRecipes.ts
git commit -m "feat: add RecipeContext and useRecipes hook with Gemini integration"
```

---

## Task 11: Recipe Suggestion UI

**Files:**
- Create: `src/components/recipe/RecipeSuggestionView.tsx`, `src/components/recipe/IngredientChips.tsx`, `src/components/recipe/GenerateButton.tsx`, `src/components/recipe/RecipeCardList.tsx`, `src/components/recipe/RecipeCard.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create IngredientChips**

Create `src/components/recipe/IngredientChips.tsx`:

```tsx
import type { Ingredient } from '../../types';

interface IngredientChipsProps {
  ingredients: Ingredient[];
}

export default function IngredientChips({ ingredients }: IngredientChipsProps) {
  if (ingredients.length === 0) {
    return (
      <p className="font-pixel text-[8px] text-pixel-text/50 text-center py-2">
        냉장고에 재료를 먼저 추가해주세요!
      </p>
    );
  }

  return (
    <div className="mb-4">
      <p className="font-pixel text-[8px] text-pixel-text mb-2">냉장고 재료:</p>
      <div className="flex flex-wrap gap-1">
        {ingredients.map((ing) => (
          <span
            key={ing.id}
            className="font-pixel text-[7px] bg-pixel-light border-2 border-pixel-border px-2 py-1"
          >
            {ing.emoji || '📦'} {ing.name}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create GenerateButton**

Create `src/components/recipe/GenerateButton.tsx`:

```tsx
import { useRateLimit } from '../../hooks/useRateLimit';
import PixelButton from '../ui/PixelButton';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isGenerating: boolean;
}

export default function GenerateButton({ onClick, disabled, isGenerating }: GenerateButtonProps) {
  const { canRequest, cooldownSeconds } = useRateLimit();

  const isDisabled = disabled || !canRequest || isGenerating;

  return (
    <div className="text-center my-6">
      <PixelButton
        onClick={() => { onClick(); }}
        disabled={isDisabled}
        size="md"
      >
        {isGenerating
          ? '요리 중...'
          : !canRequest
            ? `${cooldownSeconds}초 후 가능`
            : '🍳 요리 추천 받기!'}
      </PixelButton>
    </div>
  );
}
```

- [ ] **Step 3: Create RecipeCard**

Create `src/components/recipe/RecipeCard.tsx`:

```tsx
import type { Recipe } from '../../types';
import PixelCard from '../ui/PixelCard';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const DIFFICULTY_STARS: Record<string, string> = {
  '쉬움': '⭐',
  '보통': '⭐⭐',
  '어려움': '⭐⭐⭐',
};

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <PixelCard hover onClick={onClick}>
      <h3 className="font-pixel text-[9px] text-pixel-text mb-2 leading-relaxed">
        {recipe.title}
      </h3>
      {recipe.description && (
        <p className="font-pixel text-[7px] text-pixel-text/70 mb-2 leading-relaxed">
          {recipe.description}
        </p>
      )}
      <div className="flex flex-wrap gap-2 font-pixel text-[7px] text-pixel-text/60">
        {recipe.difficulty && (
          <span>{DIFFICULTY_STARS[recipe.difficulty] || '⭐'} {recipe.difficulty}</span>
        )}
        {recipe.cook_time && <span>⏱ {recipe.cook_time}</span>}
        {recipe.servings && <span>🍽 {recipe.servings}</span>}
      </div>
    </PixelCard>
  );
}
```

- [ ] **Step 4: Create RecipeCardList**

Create `src/components/recipe/RecipeCardList.tsx`:

```tsx
import type { Recipe } from '../../types';
import RecipeCard from './RecipeCard';

interface RecipeCardListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeCardList({ recipes, onSelectRecipe }: RecipeCardListProps) {
  if (recipes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onSelectRecipe(recipe)}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create RecipeSuggestionView**

Create `src/components/recipe/RecipeSuggestionView.tsx`:

```tsx
import { useFridge } from '../../hooks/useFridge';
import { useRecipes } from '../../hooks/useRecipes';
import IngredientChips from './IngredientChips';
import GenerateButton from './GenerateButton';
import RecipeCardList from './RecipeCardList';
import type { Recipe } from '../../types';

interface RecipeSuggestionViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeSuggestionView({ onSelectRecipe }: RecipeSuggestionViewProps) {
  const { ingredients } = useFridge();
  const { recipes, isGenerating, error, generate, selectRecipe } = useRecipes();

  const handleGenerate = () => {
    const names = ingredients.map((i) => i.name);
    generate(names);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    selectRecipe(recipe);
    onSelectRecipe(recipe);
  };

  return (
    <div>
      <IngredientChips ingredients={ingredients} />

      <GenerateButton
        onClick={handleGenerate}
        disabled={ingredients.length === 0}
        isGenerating={isGenerating}
      />

      {isGenerating && (
        <p className="font-pixel text-[10px] text-center text-pixel-text animate-pulse">
          🔥 맛있는 레시피를 찾고 있어요...
        </p>
      )}

      {error && (
        <p className="font-pixel text-[8px] text-pixel-red text-center mb-4">{error}</p>
      )}

      <RecipeCardList recipes={recipes} onSelectRecipe={handleSelectRecipe} />
    </div>
  );
}
```

- [ ] **Step 6: Update App.tsx with RecipeProvider and recipe views**

Update `src/App.tsx` - add RecipeProvider and wire up recipe components.

Replace imports:

```tsx
import { useState, useEffect } from 'react';
import type { TabType, Recipe } from './types';
import { isPinSet } from './lib/pinAuth';
import { FridgeProvider } from './context/FridgeContext';
import { RecipeProvider } from './context/RecipeContext';
import Header from './components/layout/Header';
import TabNav from './components/layout/TabNav';
import PinEntry from './components/auth/PinEntry';
import PinSetup from './components/auth/PinSetup';
import FridgeView from './components/fridge/FridgeView';
import RecipeSuggestionView from './components/recipe/RecipeSuggestionView';
```

Replace the authenticated return block:

```tsx
  return (
    <FridgeProvider>
      <RecipeProvider>
        <div className="min-h-screen bg-pixel-bg">
          <div className="max-w-2xl mx-auto border-x-4 border-pixel-border min-h-screen flex flex-col">
            <Header />
            <TabNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              hasSelectedRecipe={!!selectedRecipe}
            />
            <main className="flex-1 p-4">
              {activeTab === 'fridge' && <FridgeView />}
              {activeTab === 'recipes' && (
                <RecipeSuggestionView onSelectRecipe={handleSelectRecipe} />
              )}
              {activeTab === 'detail' && selectedRecipe && (
                <p className="font-pixel text-[10px] text-center py-8">레시피 상세 탭 (구현 예정)</p>
              )}
            </main>
          </div>
        </div>
      </RecipeProvider>
    </FridgeProvider>
  );
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/recipe/ src/App.tsx
git commit -m "feat: add Recipe Suggestion UI (chips, generate button, recipe cards)"
```

---

## Task 12: Recipe Detail UI

**Files:**
- Create: `src/components/detail/RecipeDetailView.tsx`, `src/components/detail/RecipeHeader.tsx`, `src/components/detail/IngredientChecklist.tsx`, `src/components/detail/StepList.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create RecipeHeader**

Create `src/components/detail/RecipeHeader.tsx`:

```tsx
import type { Recipe } from '../../types';

interface RecipeHeaderProps {
  recipe: Recipe;
}

const DIFFICULTY_STARS: Record<string, string> = {
  '쉬움': '⭐',
  '보통': '⭐⭐',
  '어려움': '⭐⭐⭐',
};

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div className="bg-pixel-light border-4 border-pixel-border p-4 mb-4">
      <h2 className="font-pixel text-[11px] text-pixel-text mb-3 leading-relaxed">
        {recipe.title}
      </h2>
      {recipe.description && (
        <p className="font-pixel text-[8px] text-pixel-text/70 mb-3 leading-relaxed">
          {recipe.description}
        </p>
      )}
      <div className="flex flex-wrap gap-3 font-pixel text-[8px] text-pixel-text/60">
        {recipe.difficulty && <span>{DIFFICULTY_STARS[recipe.difficulty]} {recipe.difficulty}</span>}
        {recipe.cook_time && <span>⏱ {recipe.cook_time}</span>}
        {recipe.servings && <span>🍽 {recipe.servings}</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create IngredientChecklist**

Create `src/components/detail/IngredientChecklist.tsx`:

```tsx
interface IngredientChecklistProps {
  requiredIngredients: string[];
  fridgeIngredientNames: string[];
}

export default function IngredientChecklist({ requiredIngredients, fridgeIngredientNames }: IngredientChecklistProps) {
  return (
    <div className="bg-pixel-light border-4 border-pixel-border p-4 mb-4">
      <h3 className="font-pixel text-[9px] text-pixel-text mb-3">📋 필요한 재료</h3>
      <ul className="space-y-1">
        {requiredIngredients.map((name) => {
          const inFridge = fridgeIngredientNames.some(
            (fn) => fn.includes(name) || name.includes(fn)
          );
          return (
            <li key={name} className="flex items-center gap-2">
              <span className={`font-pixel text-[8px] ${inFridge ? 'text-pixel-green' : 'text-pixel-red'}`}>
                {inFridge ? '✅' : '❌'}
              </span>
              <span className={`font-pixel text-[8px] ${inFridge ? 'text-pixel-text' : 'text-pixel-text/50'}`}>
                {name}
              </span>
              {inFridge && (
                <span className="font-pixel text-[6px] text-pixel-green">(보유)</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Create StepList**

Create `src/components/detail/StepList.tsx`:

```tsx
import { useState } from 'react';
import type { RecipeStep } from '../../types';

interface StepListProps {
  steps: RecipeStep[];
}

export default function StepList({ steps }: StepListProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (order: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(order)) {
        next.delete(order);
      } else {
        next.add(order);
      }
      return next;
    });
  };

  return (
    <div className="bg-pixel-light border-4 border-pixel-border p-4">
      <h3 className="font-pixel text-[9px] text-pixel-text mb-3">🍳 조리 순서</h3>
      <ol className="space-y-3">
        {steps.map((step) => {
          const isChecked = checkedSteps.has(step.order);
          return (
            <li
              key={step.order}
              onClick={() => toggleStep(step.order)}
              className={`
                flex gap-3 p-2 border-2 border-pixel-border cursor-pointer
                ${isChecked ? 'bg-pixel-green/10 border-pixel-green/50' : 'bg-pixel-bg'}
              `}
            >
              <span className={`font-pixel text-[9px] ${isChecked ? 'text-pixel-green' : 'text-pixel-gold'} shrink-0`}>
                {isChecked ? '✅' : `${step.order}.`}
              </span>
              <div>
                <p className={`font-pixel text-[8px] leading-relaxed ${isChecked ? 'text-pixel-text/50 line-through' : 'text-pixel-text'}`}>
                  {step.instruction}
                </p>
                {step.tip && (
                  <p className="font-pixel text-[7px] text-pixel-gold mt-1">
                    💡 {step.tip}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
```

- [ ] **Step 4: Create RecipeDetailView**

Create `src/components/detail/RecipeDetailView.tsx`:

```tsx
import { useFridge } from '../../hooks/useFridge';
import type { Recipe } from '../../types';
import RecipeHeader from './RecipeHeader';
import IngredientChecklist from './IngredientChecklist';
import StepList from './StepList';

interface RecipeDetailViewProps {
  recipe: Recipe;
}

export default function RecipeDetailView({ recipe }: RecipeDetailViewProps) {
  const { ingredients } = useFridge();
  const fridgeNames = ingredients.map((i) => i.name);

  return (
    <div>
      <RecipeHeader recipe={recipe} />
      <IngredientChecklist
        requiredIngredients={recipe.ingredients_used}
        fridgeIngredientNames={fridgeNames}
      />
      <StepList steps={recipe.steps} />
    </div>
  );
}
```

- [ ] **Step 5: Wire RecipeDetailView into App.tsx**

Add import at top of `src/App.tsx`:

```tsx
import RecipeDetailView from './components/detail/RecipeDetailView';
```

Replace the detail tab placeholder:

```tsx
{activeTab === 'detail' && selectedRecipe && (
  <RecipeDetailView recipe={selectedRecipe} />
)}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/detail/ src/App.tsx
git commit -m "feat: add Recipe Detail UI (header, ingredient checklist, step list)"
```

---

## Task 13: Supabase Tables Setup & Final Integration Test

**Files:**
- Create: `supabase-setup.sql` (reference file for Supabase dashboard)

- [ ] **Step 1: Create SQL setup script**

Create `supabase-setup.sql` at project root:

```sql
-- Run this in Supabase SQL Editor

-- App config table (for PIN storage)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON app_config FOR ALL USING (true) WITH CHECK (true);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT,
  emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON ingredients FOR ALL USING (true) WITH CHECK (true);

-- Recipe history table
CREATE TABLE IF NOT EXISTS recipe_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  ingredients_used JSONB NOT NULL DEFAULT '[]',
  steps JSONB NOT NULL DEFAULT '[]',
  cook_time TEXT,
  difficulty TEXT,
  servings TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recipe_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON recipe_history FOR ALL USING (true) WITH CHECK (true);
```

- [ ] **Step 2: Set up .env file**

Create `.env` with your actual Supabase and Gemini credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
VITE_GEMINI_API_KEY=your-actual-gemini-api-key
```

- [ ] **Step 3: Run the SQL in Supabase**

Go to Supabase dashboard > SQL Editor > paste and run the contents of `supabase-setup.sql`.

- [ ] **Step 4: Run full build check**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Run dev server and full end-to-end test**

```bash
npm run dev
```

Test the full flow:
1. First visit: PIN setup screen appears > set a 4-digit PIN > enter app
2. New tab: PIN entry screen > enter PIN > enter app
3. Wrong PIN 3x: lockout for 30 seconds
4. Fridge tab: Add ingredients via modal > see them in grid > click to remove
5. Category filter: filter by category > only matching items shown
6. Recipe tab: See ingredient chips > click "요리 추천 받기!" > wait for Gemini response > see 3 recipe cards
7. Rate limit: Click generate again > see cooldown timer
8. Recipe detail: Click a recipe card > tab switches to detail > see header, ingredient checklist (with fridge match), step list (clickable checkboxes)

- [ ] **Step 6: Commit setup script**

```bash
git add supabase-setup.sql
git commit -m "feat: add Supabase table setup SQL script"
```

---

## Task 14: Polish & Final Touches

**Files:**
- Modify: `src/index.css`, `src/components/layout/Header.tsx`, `src/App.tsx`

- [ ] **Step 1: Add scrollbar styling and smooth transitions**

Add to `src/index.css` (after the existing content):

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #F5E6C8;
}

::-webkit-scrollbar-thumb {
  background: #8B5E3C;
}

::-webkit-scrollbar-thumb:hover {
  background: #6B4423;
}
```

- [ ] **Step 2: Add pixel art decoration to Header**

Update `src/components/layout/Header.tsx`:

```tsx
export default function Header() {
  return (
    <header className="bg-pixel-panel border-b-4 border-pixel-border px-4 py-3">
      <div className="flex items-center justify-center gap-3">
        <span className="text-xl">🎮</span>
        <h1 className="font-pixel text-sm text-pixel-text tracking-widest">
          8 B I T &nbsp; K I T C H E N
        </h1>
        <span className="text-xl">🍳</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify everything still works**

```bash
npm run build && npm run dev
```

Expected: Clean build, no errors, all features working.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: add UI polish (scrollbar styling, header decoration)"
```
