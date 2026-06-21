import type { OnboardingData } from "@/types";
import {
  AVERAGE_ANNUAL_KG,
  DAILY_BUDGET_KG,
  DEFAULT_BREAKDOWN,
  DIET_KG,
  HOME_KG,
  HOUSEHOLD_HOME_MULTIPLIER,
  SHOPPING_KG,
  TOTAL_ONBOARDING_SIGNALS,
  TRANSPORT_KG,
  TRAVEL_KG,
} from "@/lib/carbon/constants";
import {
  buildCarbonProfile,
  buildCoachingInsights,
  buildRecommendedActions,
  buildTwinProfile,
} from "@/lib/carbon/assistant";
import { buildFutureSimulations } from "@/lib/carbon/simulation";
import { calculateCarbonScore, formatTonnes, sumBreakdown } from "@/lib/carbon/math";
import type {
  CarbonResult,
  CategoryBreakdown,
  CategoryKey,
  PartialCarbonEstimate,
} from "@/lib/carbon/types";

function homeEnergyKg(
  homeEnergy: OnboardingData["homeEnergy"],
  household: OnboardingData["household"]
): number {
  return Math.round(HOME_KG[homeEnergy] * HOUSEHOLD_HOME_MULTIPLIER[household]);
}

function getDominantCategory(breakdown: CategoryBreakdown): CategoryKey {
  const entries = Object.entries(breakdown) as [CategoryKey, number][];
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

function calculateBreakdown(data: OnboardingData): CategoryBreakdown {
  return {
    transport: TRANSPORT_KG[data.transport],
    food: DIET_KG[data.diet],
    home: homeEnergyKg(data.homeEnergy, data.household),
    travel: TRAVEL_KG[data.travel],
    shopping: SHOPPING_KG[data.shopping],
  };
}

function breakdownPercentages(breakdown: CategoryBreakdown): CategoryBreakdown {
  const annualKg = sumBreakdown(breakdown);

  return {
    transport: Math.round((breakdown.transport / annualKg) * 100),
    food: Math.round((breakdown.food / annualKg) * 100),
    home: Math.round((breakdown.home / annualKg) * 100),
    travel: Math.round((breakdown.travel / annualKg) * 100),
    shopping: Math.round((breakdown.shopping / annualKg) * 100),
  };
}

/**
 * Calculates a live carbon estimate from partially-completed onboarding data.
 * Used to power the real-time footprint preview during the wizard.
 *
 * For missing fields, category-level defaults are substituted so the estimate
 * remains meaningful at any stage of the form. The `confidence` field (0–100)
 * indicates how many of the 8 onboarding signals have been provided.
 *
 * @param data - Partial onboarding answers (any subset of fields may be present)
 * @returns A live footprint estimate with per-category breakdown and confidence score
 */
export function calculatePartialCarbonEstimate(
  data: Partial<OnboardingData>
): PartialCarbonEstimate {
  const breakdown: CategoryBreakdown = {
    transport: data.transport
      ? TRANSPORT_KG[data.transport]
      : DEFAULT_BREAKDOWN.transport,
    food: data.diet ? DIET_KG[data.diet] : DEFAULT_BREAKDOWN.food,
    home:
      data.homeEnergy && data.household
        ? homeEnergyKg(data.homeEnergy, data.household)
        : data.homeEnergy
          ? HOME_KG[data.homeEnergy]
          : DEFAULT_BREAKDOWN.home,
    travel: data.travel ? TRAVEL_KG[data.travel] : DEFAULT_BREAKDOWN.travel,
    shopping: data.shopping ? SHOPPING_KG[data.shopping] : DEFAULT_BREAKDOWN.shopping,
  };

  const selected: Record<CategoryKey, boolean> = {
    transport: Boolean(data.transport),
    food: Boolean(data.diet),
    home: Boolean(data.homeEnergy && data.household),
    travel: Boolean(data.travel),
    shopping: Boolean(data.shopping),
  };

  const completedSignals = [
    data.name?.trim(),
    data.transport,
    data.diet,
    data.homeEnergy,
    data.household,
    data.travel,
    data.shopping,
    data.motivation,
  ].filter(Boolean).length;

  const annualKg = sumBreakdown(breakdown);

  return {
    annualKg,
    monthlyKg: Math.round(annualKg / 12),
    dailyKg: Math.round((annualKg / 365) * 10) / 10,
    carbonScore: calculateCarbonScore(annualKg),
    confidence: Math.round((completedSignals / TOTAL_ONBOARDING_SIGNALS) * 100),
    completedSignals,
    totalSignals: TOTAL_ONBOARDING_SIGNALS,
    breakdown,
    selected,
  };
}

/**
 * Performs the full carbon footprint calculation from complete onboarding data.
 *
 * Computes annual emissions, Carbon Score, category breakdown, recommended
 * actions, reduction potential, future simulations, and the user's Carbon Twin
 * profile in a single deterministic pass — all client-side with no API calls.
 *
 * @param data - Fully-completed onboarding data (all 8 signals required)
 * @returns A complete {@link CarbonResult} ready to display on the reveal screen
 *   and dashboard
 */
export function calculateCarbonResult(data: OnboardingData): CarbonResult {
  const breakdown = calculateBreakdown(data);
  const annualKg = sumBreakdown(breakdown);
  const monthlyKg = Math.round(annualKg / 12);
  const dailyKg = Math.round((annualKg / 365) * 10) / 10;
  const carbonScore = calculateCarbonScore(annualKg);
  const topCategory = getDominantCategory(breakdown);
  const recommendedActions = buildRecommendedActions(data, topCategory);
  const reductionPotentialKg = recommendedActions.reduce(
    (total, action) => total + action.annualSavingsKg,
    0
  );
  const targetAnnualKg = Math.max(0, annualKg - reductionPotentialKg);
  const targetScore = calculateCarbonScore(targetAnnualKg);
  const vsAveragePct = Math.round(
    ((annualKg - AVERAGE_ANNUAL_KG) / AVERAGE_ANNUAL_KG) * 100
  );
  const twin = buildTwinProfile(data, breakdown, recommendedActions);
  const profile = buildCarbonProfile(data, breakdown);
  const coach = buildCoachingInsights(
    data,
    annualKg,
    dailyKg,
    DAILY_BUDGET_KG,
    topCategory,
    recommendedActions[0]
  );

  return {
    annualKg,
    monthlyKg,
    dailyKg,
    dailyBudgetKg: DAILY_BUDGET_KG,
    targetAnnualKg,
    targetScore,
    carbonScore,
    breakdown,
    breakdownPct: breakdownPercentages(breakdown),
    twin,
    profile,
    coach,
    simulations: buildFutureSimulations(
      data,
      annualKg,
      reductionPotentialKg,
      topCategory,
      recommendedActions
    ),
    vsAveragePct,
    topCategory,
    recommendedActions,
    reductionPotentialKg,
  };
}

/**
 * Type guard that checks whether all 8 required onboarding signals are present
 * and non-empty. Returns `true` only when the data object qualifies as a
 * complete {@link OnboardingData} record.
 *
 * @param data - Partial or complete onboarding data to validate
 * @returns `true` if `data` is a fully-typed `OnboardingData`; `false` otherwise
 *
 * @example
 * if (isOnboardingComplete(store.data)) {
 *   const result = calculateCarbonResult(store.data); // fully typed
 * }
 */
export function isOnboardingComplete(
  data: Partial<OnboardingData>
): data is OnboardingData {
  return Boolean(
    data.name?.trim() &&
      data.transport &&
      data.diet &&
      data.homeEnergy &&
      data.household &&
      data.shopping &&
      data.travel &&
      data.motivation
  );
}

export { calculateCarbonScore, formatTonnes };
