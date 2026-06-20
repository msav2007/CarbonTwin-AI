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
