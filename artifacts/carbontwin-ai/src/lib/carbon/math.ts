import type { CategoryBreakdown } from "@/lib/carbon/types";

/** Number of kilograms per metric tonne of CO₂. */
const KG_PER_TONNE = 1000;

/**
 * Divisor used when mapping annual kg to a 0–100 Carbon Score.
 * Every 100 kg of annual emissions reduces the score by 1 point.
 */
const SCORE_SCALE_DIVISOR = 100;

/**
 * Clamps a numeric value to a [min, max] range (inclusive).
 *
 * @param value - The number to clamp
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 * @returns The clamped value: `min` if below range, `max` if above, otherwise `value`
 *
 * @example
 * clamp(150, 0, 100) // → 100
 * clamp(-5, 0, 100)  // → 0
 * clamp(42, 0, 100)  // → 42
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Sums all category emission values in a breakdown into a single annual kg total.
 *
 * @param breakdown - Per-category CO₂ emissions in kilograms per year
 * @returns Total annual CO₂ emissions in kilograms
 */
export function sumBreakdown(breakdown: CategoryBreakdown): number {
  return Object.values(breakdown).reduce((total, kg) => total + kg, 0);
}

/**
 * Converts annual CO₂ emissions in kg to a Carbon Score on a 0–100 scale.
 * Higher scores indicate lower emissions (closer to the 1.5°C global target).
 * The score is clamped to [0, 100] so extreme values remain valid.
 *
 * Formula: `clamp(100 - annualKg / 100, 0, 100)`
 *
 * @param annualKg - Annual CO₂ emissions in kilograms (must be ≥ 0)
 * @returns Carbon Score between 0 (highest emitter) and 100 (lowest emitter)
 *
 * @example
 * calculateCarbonScore(4200) // → 58  (global average)
 * calculateCarbonScore(0)    // → 100 (zero emissions)
 * calculateCarbonScore(15000) // → 0  (heavy emitter, clamped)
 */
export function calculateCarbonScore(annualKg: number): number {
  const score = Math.round(SCORE_SCALE_DIVISOR - annualKg / SCORE_SCALE_DIVISOR);
  return clamp(score, 0, 100);
}

/**
 * Formats kilograms of CO₂ as a human-readable tonnes string with one decimal place.
 * The caller is responsible for appending the unit suffix (e.g. `"t CO₂"`).
 *
 * @param kg - CO₂ mass in kilograms
 * @returns String representation in tonnes, e.g. `"4.2"` for 4,200 kg
 *
 * @example
 * formatTonnes(4200)  // → "4.2"
 * formatTonnes(1000)  // → "1.0"
 * formatTonnes(500)   // → "0.5"
 */
export function formatTonnes(kg: number): string {
  return (kg / KG_PER_TONNE).toFixed(1);
}
