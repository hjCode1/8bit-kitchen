# 8bit Kitchen

픽셀아트 주방에서 냉장고 속 재료를 관리하고, AI가 레시피를 추천해주는 웹 앱입니다.

## 주요 기능

- **인터랙티브 픽셀아트 주방** - CSS로 구현된 주방 씬에서 가구를 클릭하여 기능에 접근
- **냉장고 재료 관리** - 카테고리별 식재료 추가/삭제, 인벤토리 스타일 그리드
- **AI 레시피 추천** - 냉장고 재료 기반으로 Google Gemini가 레시피 3개 생성
- **레시피 상세** - 단계별 조리법, 필요 재료 체크리스트
- **PIN 코드 보호** - 4자리 PIN으로 간단한 접근 제어

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini API (gemini-2.5-flash) |
| Font | Press Start 2P |

## 시작하기

### 1. 설치

```bash
git clone https://github.com/hjCode1/8bit-kitchen.git
cd 8bit-kitchen
npm install
```

### 2. Supabase 테이블 생성

Supabase 대시보드 > SQL Editor에서 `supabase-setup.sql` 내용을 실행 (1회만)

### 3. 실행

```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── components/
│   ├── kitchen/     # 픽셀아트 주방 씬 (KitchenScene, PixelFridge 등)
│   ├── fridge/      # 냉장고 관리 UI (재료 그리드, 추가 모달 등)
│   ├── recipe/      # 레시피 추천 UI (생성 버튼, 카드 목록 등)
│   ├── detail/      # 레시피 상세 UI (조리 순서, 재료 체크리스트)
│   ├── auth/        # PIN 인증 (설정, 입력)
│   ├── layout/      # 헤더
│   └── ui/          # 공통 UI (PixelButton, PixelModal 등)
├── context/         # React Context (Fridge, Recipe)
├── hooks/           # Custom Hooks (useFridge, useRecipes 등)
├── services/        # Supabase CRUD 서비스
├── lib/             # 외부 연동 (Supabase, Gemini, PIN, Rate Limiter)
├── data/            # 카테고리, 재료 프리셋 데이터
└── types/           # TypeScript 타입 정의
```
