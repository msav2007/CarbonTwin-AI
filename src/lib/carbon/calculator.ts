import type { OnboardingData } from "@/types";

const FOOTPRINT_FACTORS = {
  transport: { car: 2.4, transit: 0.8, bike: 0.1, walk: 0, mixed: 1.2 },
  diet: { "meat-heavy": 2.5, balanced: 1.5, vegetarian: 1.0, vegan: 0.7 },
  homeEnergy: { low: 0.8, medium: 1.5, high: 2.5 },
  shopping: { minimal: 0.5, moderate: 1.0, frequent: 1.8 },
  travel: { rare: 0.3, occasional: 1.0, frequent: 2.5 },
} as const;

export function calculateAnnualFootprint(data: Partial<OnboardingData>): number {
  const baseKg = 3000;
  let multiplier = 1;

  if (data.transport) multiplier *= FOOTPRINT_FACTORS.transport[data.transport];
  if (data.diet) multiplier *= FOOTPRINT_FACTORS.diet[data.diet];
  if (data.homeEnergy) multiplier *= FOOTPRINT_FACTORS.homeEnergy[data.homeEnergy];
  if (data.shopping) multiplier *= FOOTPRINT_FACTORS.shopping[data.shopping];
  if (data.travel) multiplier *= FOOTPRINT_FACTORS.travel[data.travel];

  return Math.round(baseKg * multiplier);
}

export function calculateDailyBudget(annualKg: number): number {
  return Math.round((annualKg / 365) * 10) / 10;
}
