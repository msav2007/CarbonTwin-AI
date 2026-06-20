import type { CategoryBreakdown } from "@/lib/carbon/types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function sumBreakdown(breakdown: CategoryBreakdown): number {
  return Object.values(breakdown).reduce((total, kg) => total + kg, 0);
}

export function calculateCarbonScore(annualKg: number): number {
  const score = Math.round(100 - annualKg / 100);
  return clamp(score, 0, 100);
}

export function formatTonnes(kg: number): string {
  return (kg / 1000).toFixed(1);
}
