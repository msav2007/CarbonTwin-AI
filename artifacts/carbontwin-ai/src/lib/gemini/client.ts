import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not set");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getTextModel() {
  return getGeminiClient().getGenerativeModel({ model: "gemini-1.5-flash" });
}

export function getVisionModel() {
  return getGeminiClient().getGenerativeModel({ model: "gemini-1.5-flash" });
}
