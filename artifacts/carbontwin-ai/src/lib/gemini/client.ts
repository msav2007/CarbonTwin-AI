/**
 * @file Google Gemini AI client for CarbonTwin's optional AI enrichment features.
 *
 * This module provides a lazy-initialised singleton client and two async functions
 * that call the Gemini 1.5 Flash model with structured prompt engineering.
 *
 * **Graceful degradation:** all callers should check `isGeminiAvailable()` before
 * invoking these functions and fall back to rule-based output when it returns `false`.
 * Neither function is called during the core carbon calculation pipeline — they are
 * purely optional enrichment layers.
 *
 * **API key security:** the key is embedded in the Vite bundle at build time via
 * `import.meta.env.VITE_GEMINI_API_KEY`. Treat it as a low-privilege,
 * rate-limited client key. See `SECURITY.md` for the full threat model.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CarbonResult } from "@/lib/carbon/types";
import type { OnboardingData } from "@/types";
import { formatTonnes } from "@/lib/carbon/math";
import { CATEGORY_TITLES } from "@/lib/carbon/constants";

/** Lazy-initialised singleton to avoid creating the client on module load. */
let genAI: GoogleGenerativeAI | null = null;

/**
 * Returns `true` when the `VITE_GEMINI_API_KEY` environment variable is present.
 * Use this as a feature flag before rendering AI-dependent UI elements.
 *
 * @returns `true` if Gemini AI features are available; `false` otherwise
 */
export function isGeminiAvailable(): boolean {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

/**
 * Returns (or lazily initialises) the shared `GoogleGenerativeAI` client.
 *
 * Throws an explicit `Error` when `VITE_GEMINI_API_KEY` is missing, so callers
 * receive a clear message rather than an obscure SDK failure.
 *
 * @returns The initialised `GoogleGenerativeAI` client
 * @throws {Error} When `VITE_GEMINI_API_KEY` is not set in the environment
 */
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

/**
 * Returns a configured `GenerativeModel` instance set to Gemini 1.5 Flash.
 *
 * Model configuration:
 * - `temperature: 0.7` — balanced creativity vs. consistency
 * - `topP: 0.9` — nucleus sampling for natural-sounding output
 * - `maxOutputTokens: 1024` — sufficient for structured JSON responses
 *
 * @returns A `GenerativeModel` ready to call `generateContent` on
 */
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

/**
 * The structured JSON response expected from the Gemini coaching prompt.
 * All three fields are required; the caller validates their presence before returning.
 */
export interface AICarbonCoachResponse {
  /** 2–3 sentence coaching message referencing the user's specific data and a next step. */
  message: string;
  /** 1 actionable sentence targeting the user's top emission category. */
  topTip: string;
  /** 1 motivating sentence about the user's potential impact if they act. */
  encouragement: string;
}

/**
 * Calls Gemini 1.5 Flash to generate a personalised carbon coaching response
 * for the Dashboard Coach page.
 *
 * The prompt instructs Gemini to return structured JSON matching
 * {@link AICarbonCoachResponse}. The response is extracted via regex,
 * parsed, and validated before being returned — invalid or incomplete
 * responses throw an `Error` so the caller can fall back gracefully.
 *
 * @param data - Complete onboarding data (used to personalise the prompt)
 * @param result - The user's complete carbon calculation result
 * @returns A validated {@link AICarbonCoachResponse} from the Gemini model
 * @throws {Error} When the API response does not contain valid, complete JSON
 */
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

/**
 * Calls Gemini 1.5 Flash to generate a 2-sentence what-if narrative
 * for the Dashboard What-If page.
 *
 * The prompt asks for:
 * 1. A specific CO₂ impact estimate for the hypothetical changes
 * 2. The most important real-world step to make those changes stick
 *
 * The response is returned as plain text (no JSON parsing required).
 *
 * @param data - The user's current (real) onboarding data
 * @param hypothetical - The lifestyle changes the user is modelling (partial override)
 * @param currentAnnualKg - The user's current annual CO₂ baseline in kg
 * @returns A 2-sentence narrative string from Gemini
 */
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
