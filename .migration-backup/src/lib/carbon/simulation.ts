import type { OnboardingData } from "@/types";
import {
  CATEGORY_LABELS,
  MOTIVATION_FRAMES,
  SIMULATION_HORIZONS,
} from "@/lib/carbon/constants";
import { calculateCarbonScore, clamp, formatTonnes } from "@/lib/carbon/math";
import type {
  CategoryKey,
  FutureSimulation,
  RecommendedAction,
  SimulationMode,
  SimulationYearResult,
} from "@/lib/carbon/types";

const BASELINE_TRAVEL_RATE: Record<OnboardingData["travel"], number> = {
  rare: -0.004,
  occasional: 0.006,
  frequent: 0.015,
};

const BASELINE_SHOPPING_RATE: Record<OnboardingData["shopping"], number> = {
  minimal: -0.004,
  moderate: 0.003,
  frequent: 0.011,
};

const BASELINE_HOME_RATE: Record<OnboardingData["homeEnergy"], number> = {
  low: -0.002,
  medium: 0.002,
  high: 0.007,
};

const BASELINE_TRANSPORT_RATE: Record<OnboardingData["transport"], number> = {
  walk: -0.003,
  bike: -0.002,
  transit: 0,
  mixed: 0.004,
  car: 0.009,
};

const MODE_SETTINGS: Record<
  SimulationMode,
  {
    capture: number;
    rampYears: number;
    maintenanceLift: number;
    floorFactor: number;
    summary: string;
  }
> = {
  steady: {
    capture: 0.62,
    rampYears: 3,
    maintenanceLift: 0.015,
    floorFactor: 0.58,
    summary:
      "Steady mode assumes you adopt the top recommendations gradually and protect them once they become routine.",
  },
  ambitious: {
    capture: 0.84,
    rampYears: 2,
    maintenanceLift: 0.022,
    floorFactor: 0.5,
    summary:
      "Ambitious mode assumes you commit early to the top actions and reinforce them with stronger follow-through each year.",
  },
};

function baselineAnnualRate(data: OnboardingData): number {
  return clamp(
    1 +
      BASELINE_TRAVEL_RATE[data.travel] +
      BASELINE_SHOPPING_RATE[data.shopping] +
      BASELINE_HOME_RATE[data.homeEnergy] +
      BASELINE_TRANSPORT_RATE[data.transport],
    0.985,
    1.045
  );
}

function simulateHorizon(
  data: OnboardingData,
  annualKg: number,
  reductionPotentialKg: number,
  topCategory: CategoryKey,
  topAction: RecommendedAction,
  mode: SimulationMode,
  years: number
): SimulationYearResult {
  const settings = MODE_SETTINGS[mode];
  const baselineRate = baselineAnnualRate(data);
  const baselineAnnualKg = Math.round(annualKg * Math.pow(baselineRate, years));
  const adoptionProgress = Math.min(years / settings.rampYears, 1);
  const capturedReduction = reductionPotentialKg * settings.capture * adoptionProgress;
  const maintenanceBonus = annualKg * settings.maintenanceLift * years;
  const floorKg = annualKg * settings.floorFactor;
  const plannedAnnualKg = Math.round(
    Math.max(floorKg, baselineAnnualKg - capturedReduction - maintenanceBonus)
  );
  const annualReductionKg = Math.max(0, baselineAnnualKg - plannedAnnualKg);
  const totalAvoidedKg = annualReductionKg * years;

  return {
    years,
    baselineAnnualKg,
    plannedAnnualKg,
    annualReductionKg,
    totalAvoidedKg,
    scoreIfMaintained: calculateCarbonScore(plannedAnnualKg),
    narrative: `Over ${years} year${years === 1 ? "" : "s"}, a ${mode} pace focused on ${CATEGORY_LABELS[topCategory]} can move you from ${formatTonnes(
      baselineAnnualKg
    )}t toward ${formatTonnes(plannedAnnualKg)}t if you keep "${topAction.title}" alive inside your routine.`,
  };
}

export function buildFutureSimulations(
  data: OnboardingData,
  annualKg: number,
  reductionPotentialKg: number,
  topCategory: CategoryKey,
  recommendedActions: RecommendedAction[]
): Record<SimulationMode, FutureSimulation> {
  const topAction = recommendedActions[0];

  return {
    steady: {
      mode: "steady",
      summary: `${MODE_SETTINGS.steady.summary} This fits people focused on ${MOTIVATION_FRAMES[data.motivation]}.`,
      outlook: SIMULATION_HORIZONS.map((years) =>
        simulateHorizon(
          data,
          annualKg,
          reductionPotentialKg,
          topCategory,
          topAction,
          "steady",
          years
        )
      ),
    },
    ambitious: {
      mode: "ambitious",
      summary: `${MODE_SETTINGS.ambitious.summary} This works best when you want faster progress in ${CATEGORY_LABELS[topCategory]}.`,
      outlook: SIMULATION_HORIZONS.map((years) =>
        simulateHorizon(
          data,
          annualKg,
          reductionPotentialKg,
          topCategory,
          topAction,
          "ambitious",
          years
        )
      ),
    },
  };
}
