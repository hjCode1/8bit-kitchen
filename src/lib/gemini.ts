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
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error('Empty response from Gemini');

  try {
    return parseRecipeResponse(text);
  } catch {
    const retryResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt + '\n\n반드시 유효한 JSON 배열만 응답하세요. 마크다운이나 다른 텍스트를 포함하지 마세요.',
    });

    const retryText = retryResponse.text;
    if (!retryText) throw new Error('Empty retry response from Gemini');
    return parseRecipeResponse(retryText);
  }
}
