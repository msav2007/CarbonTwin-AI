/**
 * @file Emission factor constants and domain label maps for the CarbonTwin carbon engine.
 *
 * Emission factors are sourced from peer-reviewed lifecycle assessment research:
 * - Transport: per-km emission factors × estimated annual distance by mode
 * - Food: Poore & Nemecek (2018) dietary lifecycle assessments
 * - Home energy: IEA (2023) grid carbon intensity, normalised to UK/EU averages
 * - Air travel: IPCC aviation radiative forcing factors
 * - Shopping: consumer goods embodied carbon meta-analyses
 *
 * All emission values are annual kilograms of CO₂-equivalent (kg CO₂e).
 */

import type { OnboardingData } from "@/types";
import type { CategoryBreakdown, CategoryKey } from "@/lib/carbon/types";

/**
 * Annual kg CO₂ by primary transport mode.
 * Assumes average annual distance per mode based on national travel survey data.
 */
export const TRANSPORT_KG: Record<OnboardingData["transport"], number> = {
  car: 3200,
  mixed: 2100,
  transit: 900,
  bike: 200,
  walk: 80,
};

/**
 * Annual kg CO₂ by dietary pattern.
 * Source: Poore & Nemecek (2018) — "Reducing food's environmental impacts
 * through producers and consumers", Science 360(6392).
 */
export const DIET_KG: Record<OnboardingData["diet"], number> = {
  "meat-heavy": 2800,
  balanced: 1800,
  vegetarian: 1200,
  vegan: 800,
};

/**
 * Annual kg CO₂ for a single-person home at each energy usage level.
 * Actual household cost is multiplied by {@link HOUSEHOLD_HOME_MULTIPLIER}.
 * Source: IEA (2023) residential energy consumption, average grid intensity.
 */
export const HOME_KG: Record<OnboardingData["homeEnergy"], number> = {
  low: 600,
  medium: 1400,
  high: 2800,
};

/**
 * Per-household-size multiplier applied to {@link HOME_KG}.
 * Reflects shared energy costs when multiple people occupy the same home.
 * Values are per-person fractions of single-occupancy cost.
 */
export const HOUSEHOLD_HOME_MULTIPLIER: Record<
  OnboardingData["household"],
  number
> = {
  solo: 1,
  couple: 0.74,
  family: 0.58,
};

/**
 * Annual kg CO₂ by air travel frequency.
 * Source: IPCC aviation radiative forcing factors including non-CO₂ effects.
 */
export const TRAVEL_KG: Record<OnboardingData["travel"], number> = {
  rare: 300,
  occasional: 1200,
  frequent: 3500,
};

/**
 * Annual kg CO₂ by consumer goods shopping intensity.
 * Source: consumer goods embodied carbon meta-analyses (lifecycle basis).
 */
export const SHOPPING_KG: Record<OnboardingData["shopping"], number> = {
  minimal: 400,
  moderate: 1000,
  frequent: 2200,
};

/**
 * Global average annual CO₂ footprint per person in kg (≈ 4.2 tonnes).
 * This is the 1.5°C-aligned target from the Paris Agreement (2050 pathway).
 */
export const AVERAGE_ANNUAL_KG = 4200;

/**
 * 1.5°C-aligned daily CO₂ budget per person in kg.
 * Derived as `AVERAGE_ANNUAL_KG / 365`, rounded to one decimal place.
 */
export const DAILY_BUDGET_KG = Math.round((AVERAGE_ANNUAL_KG / 365) * 10) / 10;

/** Total number of lifestyle signals collected during onboarding (always 8). */
export const TOTAL_ONBOARDING_SIGNALS = 8;

/**
 * The three time horizons (in years) used by the future simulation engine.
 * Projections are always computed for 1, 5, and 10 years.
 */
export const SIMULATION_HORIZONS = [1, 5, 10] as const;

/**
 * Default per-category breakdown used when a category has not yet been
 * answered during onboarding. Values represent approximately average
 * global emissions per category so the live preview starts at a realistic total.
 */
export const DEFAULT_BREAKDOWN: CategoryBreakdown = {
  transport: 1500,
  food: 1600,
  home: 1300,
  travel: 1200,
  shopping: 1000,
};

/**
 * Lowercase display labels for each emission category.
 * Used in prose coaching messages and narrative text.
 */
export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  transport: "transport",
  food: "food",
  home: "home energy",
  travel: "travel",
  shopping: "shopping",
};

/**
 * Title-case display labels for each emission category.
 * Used in headings, chart legends, and structured UI elements.
 */
export const CATEGORY_TITLES: Record<CategoryKey, string> = {
  transport: "Transport",
  food: "Food",
  home: "Home Energy",
  travel: "Travel",
  shopping: "Shopping",
};

/**
 * Short human-readable label for each motivation option.
 * Used in the onboarding wizard option cards.
 */
export const MOTIVATION_LABELS: Record<OnboardingData["motivation"], string> = {
  "shrink-footprint": "Shrink my footprint",
  "lower-bills": "Lower bills",
  "travel-smarter": "Travel smarter",
  "consume-less": "Consume less",
};

/**
 * Coaching frame string for each motivation.
 * Inserted into coaching messages to personalise the tone and framing.
 * Example: "cutting the biggest carbon sources first".
 */
export const MOTIVATION_FRAMES: Record<
  OnboardingData["motivation"],
  string
> = {
  "shrink-footprint": "cutting the biggest carbon sources first",
  "lower-bills": "finding climate wins that also reduce waste and bills",
  "travel-smarter": "making travel feel intentional instead of automatic",
  "consume-less": "building a lighter, lower-consumption routine",
};

/**
 * Human-readable label for each household size.
 * Used in the Carbon Profile's `householdContext` field.
 */
export const HOUSEHOLD_LABELS: Record<OnboardingData["household"], string> = {
  solo: "Solo household",
  couple: "Shared by two",
  family: "Family or shared home",
};

/**
 * Twin name prefix pool. Prefixes are selected by hashing the user's choices
 * modulo the array length, ensuring deterministic selection.
 */
export const NAME_PREFIXES = [
  "Eco",
  "Nova",
  "Aero",
  "Terra",
  "Luma",
  "Cyan",
  "Pulse",
  "Flux",
];

/**
 * Twin name suffix pool. Suffixes are selected from a different bit range of
 * the same hash to maximise name variety while maintaining determinism.
 */
export const NAME_SUFFIXES = [
  "Alex",
  "River",
  "Sage",
  "Kai",
  "Morgan",
  "Quinn",
  "Reed",
  "Sky",
];

/**
 * Personality and archetype descriptors keyed by dominant emission category.
 * Used to generate the Carbon Twin's persona on the reveal screen.
 */
export const PERSONALITIES: Record<
  CategoryKey,
  { personality: string; archetype: string }
> = {
  transport: {
    personality: "The Mobility Maven",
    archetype: "Always calculating the carbon cost of every mile",
  },
  food: {
    personality: "The Plate Philosopher",
    archetype: "Sees every meal as a climate signal",
  },
  home: {
    personality: "The Energy Architect",
    archetype: "Obsessed with watts, warmth, cooling, and waste",
  },
  travel: {
    personality: "The Horizon Balancer",
    archetype: "Keeps wanderlust and footprint awareness in conversation",
  },
  shopping: {
    personality: "The Conscious Consumer",
    archetype: "Questions every purchase before it ships",
  },
};
