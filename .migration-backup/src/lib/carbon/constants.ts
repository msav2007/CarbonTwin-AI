import type { OnboardingData } from "@/types";
import type { CategoryBreakdown, CategoryKey } from "@/lib/carbon/types";

export const TRANSPORT_KG: Record<OnboardingData["transport"], number> = {
  car: 3200,
  mixed: 2100,
  transit: 900,
  bike: 200,
  walk: 80,
};

export const DIET_KG: Record<OnboardingData["diet"], number> = {
  "meat-heavy": 2800,
  balanced: 1800,
  vegetarian: 1200,
  vegan: 800,
};

export const HOME_KG: Record<OnboardingData["homeEnergy"], number> = {
  low: 600,
  medium: 1400,
  high: 2800,
};

export const HOUSEHOLD_HOME_MULTIPLIER: Record<
  OnboardingData["household"],
  number
> = {
  solo: 1,
  couple: 0.74,
  family: 0.58,
};

export const TRAVEL_KG: Record<OnboardingData["travel"], number> = {
  rare: 300,
  occasional: 1200,
  frequent: 3500,
};

export const SHOPPING_KG: Record<OnboardingData["shopping"], number> = {
  minimal: 400,
  moderate: 1000,
  frequent: 2200,
};

export const AVERAGE_ANNUAL_KG = 4200;
export const DAILY_BUDGET_KG = Math.round((AVERAGE_ANNUAL_KG / 365) * 10) / 10;
export const TOTAL_ONBOARDING_SIGNALS = 8;
export const SIMULATION_HORIZONS = [1, 5, 10] as const;

export const DEFAULT_BREAKDOWN: CategoryBreakdown = {
  transport: 1500,
  food: 1600,
  home: 1300,
  travel: 1200,
  shopping: 1000,
};

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  transport: "transport",
  food: "food",
  home: "home energy",
  travel: "travel",
  shopping: "shopping",
};

export const CATEGORY_TITLES: Record<CategoryKey, string> = {
  transport: "Transport",
  food: "Food",
  home: "Home Energy",
  travel: "Travel",
  shopping: "Shopping",
};

export const MOTIVATION_LABELS: Record<OnboardingData["motivation"], string> = {
  "shrink-footprint": "Shrink my footprint",
  "lower-bills": "Lower bills",
  "travel-smarter": "Travel smarter",
  "consume-less": "Consume less",
};

export const MOTIVATION_FRAMES: Record<
  OnboardingData["motivation"],
  string
> = {
  "shrink-footprint": "cutting the biggest carbon sources first",
  "lower-bills": "finding climate wins that also reduce waste and bills",
  "travel-smarter": "making travel feel intentional instead of automatic",
  "consume-less": "building a lighter, lower-consumption routine",
};

export const HOUSEHOLD_LABELS: Record<OnboardingData["household"], string> = {
  solo: "Solo household",
  couple: "Shared by two",
  family: "Family or shared home",
};

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
