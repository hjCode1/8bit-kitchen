# 8bit Kitchen - Design Spec

## Context

냉장고에 있는 식재료를 관리(추가/삭제)하고, 현재 재료로 만들 수 있는 레시피를 AI가 추천해주는 웹 앱.
UI는 스타듀밸리 스타일의 도트(픽셀) 게임 느낌으로 구현한다.
2명이 사용할 개인 프로젝트이며, 공개 배포되므로 PIN 코드로 최소한의 접근 제어를 둔다.

---

## Tech Stack

| 구분 | 기술 |
|------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 + 커스텀 픽셀 테마 |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini API (gemini-2.0-flash, 무료 티어) |
| Font | Press Start 2P (Google Fonts) |

---

## 핵심 기능

### 1. PIN 코드 인증
- 앱 진입 시 4자리 숫자 PIN 입력 화면 표시
- Supabase `app_config` 테이블에 PIN 해시값 저장 (Web Crypto API의 SHA-256 사용, 클라이언트에서 해싱)
- 인증 성공 시 `sessionStorage`에 상태 저장 (탭 닫으면 만료)
- 3회 연속 실패 시 30초 대기
- 최초 사용 시 PIN 설정 화면 표시

### 2. 냉장고 관리
- 인벤토리 스타일 그리드 (6x5 = 30칸)에 재료 표시
- 8개 카테고리 필터: 채소, 과일, 육류, 해산물, 유제품, 양념, 곡물, 기타
- 재료 추가: 모달에서 카테고리 선택 > 프리셋 목록에서 선택 또는 직접 입력 > 수량 입력
- 재료 삭제: 재료 클릭 > 삭제 확인
- 낙관적 업데이트: UI 먼저 변경 후 Supabase 동기화

### 3. 레시피 추천
- 현재 냉장고 재료를 칩으로 표시
- "요리 추천 받기!" 버튼으로 Gemini에 레시피 3개 요청
- 한국어 프롬프트로 JSON 형식 응답 요구
- 레이트 리미터: localStorage 기반, 요청 간 1분 쿨다운
- 생성된 레시피는 `recipe_history` 테이블에 저장

### 4. 레시피 상세
- 레시피 카드 클릭 시 상세 탭으로 전환
- 요리 이름, 난이도, 소요시간, 인분 표시
- 필요 재료 체크리스트 (냉장고 보유 여부 표시)
- 단계별 조리법 표시 (체크 가능)

---

## UI 디자인

### 테마 (스타듀밸리 스타일)
```
배경색: #F5E6C8 (따뜻한 파치먼트)
패널색: #D4A574 (갈색 패널)
테두리: #8B5E3C (어두운 갈색, 4px solid)
텍스트: #3E2723 (짙은 갈색)
밝은색: #FFF8E7 (크림색)
강조색: #DAA520 (골드)
초록색: #6B8E23 (올리브 그린)
빨간색: #CD5C5C (따뜻한 레드)
파란색: #5B8DBE (차분한 블루)
```

### 공통 UI 규칙
- border-radius 없음 (모든 요소 각진 형태)
- 4px 테두리 + 오프셋 드롭 쉐도우 (`4px 4px 0px 0px #8B5E3C`)
- 버튼 클릭: 2px 아래/오른쪽 이동 + 그림자 제거
- 폰트: Press Start 2P (작은 크기 사용, text-xs ~ text-sm)
- 이미지: `image-rendering: pixelated`

### 화면 구성 (단일 페이지, 탭 전환)

```
+============================================+
|  8 B I T   K I T C H E N                  |  <- Header
+============================================+
| [냉장고]  [레시피 추천]  [레시피 상세]       |  <- TabNav
+--------------------------------------------+
|                                            |
|              Main Content                  |
|                                            |
+============================================+
```

#### 냉장고 탭
- 상단: 카테고리 필터 버튼 행
- 중앙: 6x5 인벤토리 그리드 (빈 칸은 점선 테두리)
- 각 칸: 이모지 + 이름 + 수량
- 하단: "+ 재료 추가하기" 버튼

#### 레시피 추천 탭
- 상단: 현재 재료 칩 목록
- 중앙: "요리 추천 받기!" 버튼 (쿨다운 시 타이머 표시)
- 하단: 레시피 카드 2열 그리드 (이름, 난이도, 시간, 인분)

#### 레시피 상세 탭
- 상단: 요리명, 난이도 별, 소요시간, 인분
- 중단: 필요 재료 체크리스트 (보유 재료 하이라이트)
- 하단: 번호가 매겨진 조리 단계 카드

---

## 데이터 모델

### Supabase Tables

**`app_config`**
| Column | Type | Description |
|--------|------|-------------|
| key | text (PK) | 설정 키 |
| value | text | 설정 값 |

- `pin_hash` 키에 SHA-256 해시값 저장

**`ingredients`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | gen_random_uuid() |
| name | text (NOT NULL) | 재료명 (한국어) |
| category | text (NOT NULL) | 카테고리 (8종 중 하나) |
| quantity | text | 수량 (예: "2개", "500g") |
| emoji | text | 이모지 표현 |
| created_at | timestamptz | 추가 시각 |

**`recipe_history`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | gen_random_uuid() |
| title | text (NOT NULL) | 레시피 제목 |
| description | text | 간단 설명 |
| ingredients_used | jsonb | 사용 재료 배열 |
| steps | jsonb | 조리 단계 배열 |
| cook_time | text | 소요 시간 |
| difficulty | text | 쉬움/보통/어려움 |
| servings | text | 인분 |
| created_at | timestamptz | 생성 시각 |

**RLS 정책**: 모든 테이블에 `FOR ALL USING (true) WITH CHECK (true)` - PIN은 앱 레벨 보호이며, DB 레벨은 anon key로 접근

### TypeScript Types

```typescript
type IngredientCategory = '채소' | '과일' | '육류' | '해산물' | '유제품' | '양념' | '곡물' | '기타';

interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: string | null;
  emoji: string | null;
  created_at: string;
}

interface RecipeStep {
  order: number;
  instruction: string;
  tip?: string;
}

interface Recipe {
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
```

---

## 상태 관리

React Context + useReducer (외부 라이브러리 없음)

- **FridgeContext**: ingredients[], isLoading, error, selectedCategory
- **RecipeContext**: recipes[], selectedRecipe, isGenerating, error, rateLimitedUntil
- **탭 전환**: App에서 `useState<'fridge' | 'recipes' | 'detail'>` 관리
- **PIN 인증**: App에서 `useState<boolean>` (sessionStorage와 동기화)

---

## API 연동

### Supabase
- `src/lib/supabase.ts`: 클라이언트 초기화 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- `src/services/ingredientService.ts`: fetchIngredients, addIngredient, removeIngredient
- `src/services/recipeService.ts`: saveRecipe, fetchRecipeHistory

### Gemini
- `src/lib/gemini.ts`: @google/genai SDK 사용
- 클라이언트 사이드 직접 호출 (무료 키, 보안 리스크 수용)
- 모델: `gemini-2.0-flash`
- 프롬프트: 한국어로 재료 목록 전달, JSON 배열 형식 레시피 3개 요청
- 응답 파싱: markdown code fence 제거 후 JSON.parse
- 레이트 리미터: localStorage 기반 1분 쿨다운

### 에러 처리
- **429 (Rate Limit)**: 쿨다운 타이머 표시, 버튼 비활성화
- **네트워크 에러**: "연결 실패" 토스트 + 재시도 허용
- **JSON 파싱 실패**: 1회 재시도 후 실패 시 에러 메시지

---

## 폴더 구조

```
8bit-kitchen/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── public/
│   └── fonts/
│       └── PressStart2P-Regular.ttf
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── lib/
    │   ├── supabase.ts
    │   ├── gemini.ts
    │   └── rateLimiter.ts
    ├── services/
    │   ├── ingredientService.ts
    │   └── recipeService.ts
    ├── context/
    │   ├── FridgeContext.tsx
    │   └── RecipeContext.tsx
    ├── hooks/
    │   ├── useFridge.ts
    │   ├── useRecipes.ts
    │   └── useRateLimit.ts
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   ├── TabNav.tsx
    │   │   └── Footer.tsx
    │   ├── auth/
    │   │   ├── PinEntry.tsx
    │   │   └── PinSetup.tsx
    │   ├── fridge/
    │   │   ├── FridgeView.tsx
    │   │   ├── CategoryFilter.tsx
    │   │   ├── IngredientGrid.tsx
    │   │   ├── IngredientSlot.tsx
    │   │   ├── AddIngredientModal.tsx
    │   │   └── FridgeSummary.tsx
    │   ├── recipe/
    │   │   ├── RecipeSuggestionView.tsx
    │   │   ├── IngredientChips.tsx
    │   │   ├── GenerateButton.tsx
    │   │   ├── RecipeCardList.tsx
    │   │   ├── RecipeCard.tsx
    │   │   └── LoadingAnimation.tsx
    │   ├── detail/
    │   │   ├── RecipeDetailView.tsx
    │   │   ├── RecipeHeader.tsx
    │   │   ├── IngredientChecklist.tsx
    │   │   ├── StepList.tsx
    │   │   └── StepCard.tsx
    │   └── ui/
    │       ├── PixelButton.tsx
    │       ├── PixelCard.tsx
    │       ├── PixelModal.tsx
    │       ├── PixelInput.tsx
    │       ├── PixelSelect.tsx
    │       ├── PixelBadge.tsx
    │       ├── PixelToast.tsx
    │       └── PixelSpinner.tsx
    └── data/
        ├── categories.ts
        └── ingredientPresets.ts
```

---

## 검증 계획

1. **빌드 확인**: `npm run dev`로 개발 서버 실행, 에러 없이 화면 렌더링
2. **PIN 인증**: PIN 설정 > 새 탭에서 PIN 입력 > 성공/실패 확인
3. **재료 CRUD**: 재료 추가 > Supabase 대시보드에서 데이터 확인 > 재료 삭제 > 확인
4. **레시피 생성**: 재료 3개 이상 추가 > "요리 추천 받기" > 레시피 3개 카드 표시 확인
5. **레시피 상세**: 카드 클릭 > 상세 탭 전환 > 단계별 조리법 표시 확인
6. **레이트 리밋**: 연속 요청 시 쿨다운 타이머 표시 확인
7. **에러 처리**: 네트워크 끊고 요청 > 에러 메시지 표시 확인
8. **픽셀 UI**: 전체적으로 스타듀밸리 느낌의 도트 스타일 일관성 확인
