import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CarbonResult } from "@/lib/carbon/types";
import type { OnboardingData } from "@/types";
import { formatTonnes } from "@/lib/carbon/math";
import { CATEGORY_TITLES } from "@/lib/carbon/constants";

let genAI: GoogleGenerativeAI | null = null;

export function isGeminiAvailable(): boolean {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "VITE_GEMINI_API_KEY is not set. Add it to your environment to enable AI coaching."
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getTextModel() {
  return getGeminiClient().getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  });
}

export interface AICarbonCoachResponse {
  message: string;
  topTip: string;
  encouragement: string;
}

export async function generateCarbonCoachMessage(
  data: OnboardingData,
  result: CarbonResult
): Promise<AICarbonCoachResponse> {
  const model = getTextModel();

  const topActionTitle = result.recommendedActions[0]?.title ?? "reduce your footprint";
  const topCategory = CATEGORY_TITLES[result.topCategory];
  const annualTonnes = formatTonnes(result.annualKg);
  const vsAvg = result.vsAveragePct;
  const comparison =
    vsAvg > 0
      ? `${vsAvg}% above the global 4.2t average`
      : `${Math.abs(vsAvg)}% below the global 4.2t average`;

  const prompt = `You are CarbonTwin AI, a warm and practical sustainability coach. 
You have just analyzed a carbon footprint profile. Respond ONLY with valid JSON matching this exact schema:
{
  "message": "string (2-3 sentences: acknowledge their specific data, give one concrete next step)",
  "topTip": "string (1 actionable sentence specific to their top category)",
  "encouragement": "string (1 motivating sentence about their potential impact)"
}

Profile data:
- Name: ${data.name.trim()}
- Annual CO2: ${annualTonnes} tonnes (${comparison})
- Top emission category: ${topCategory}
- Transport: ${data.transport}
- Diet: ${data.diet}
- Home energy: ${data.homeEnergy}
- Household: ${data.household}
- Air travel: ${data.travel}
- Shopping: ${data.shopping}
- Motivation: ${data.motivation}
- Top recommended action: "${topActionTitle}"
- Potential annual saving: ${result.reductionPotentialKg} kg CO2

Rules:
- Be specific to their actual data — no generic advice
- Reference their actual numbers
- Speak directly to ${data.name.trim()}
- Keep the tone warm, honest, and practical
- Do not use markdown or bullet points inside the JSON values
- Return ONLY the JSON object, no surrounding text`;

  const response = await model.generateContent(prompt);
  const text = response.response.text().trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as AICarbonCoachResponse;

  if (!parsed.message || !parsed.topTip || !parsed.encouragement) {
    throw new Error("AI response is missing required fields");
  }

  return parsed;
}

export async function generateWhatIfScenario(
  data: OnboardingData,
  hypothetical: Partial<OnboardingData>,
  currentAnnualKg: number
): Promise<string> {
  const model = getTextModel();

  const changes = Object.entries(hypothetical)
    .filter(([key]) => key !== "name")
    .map(([key, val]) => `${key}: ${data[key as keyof OnboardingData]} → ${val}`)
    .join(", ");

  const prompt = `You are CarbonTwin AI analyzing a what-if carbon scenario.

Current annual CO2: ${formatTonnes(currentAnnualKg)} tonnes
Hypothetical changes: ${changes}
User motivation: ${data.motivation}

Write exactly 2 sentences:
1. Estimate the likely CO2 impact of these changes (be specific with approximate numbers)
2. Explain the most important real-world step to make this change stick

Be direct, specific, and practical. No bullet points or markdown.`;

  const response = await model.generateContent(prompt);
  return response.response.text().trim();
}
