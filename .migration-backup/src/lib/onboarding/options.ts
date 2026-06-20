import type { OnboardingData } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  Car,
  Train,
  Bike,
  Footprints,
  Shuffle,
  Beef,
  Salad,
  Leaf,
  Sprout,
  Zap,
  Home,
  Building2,
  User,
  Users,
  Target,
  Plane,
  MapPin,
  Globe,
  ShoppingBag,
  Package,
  ShoppingCart,
} from "lucide-react";

export interface OnboardingOption<T extends string = string> {
  value: T;
  label: string;
  description: string;
  icon: LucideIcon;
  impact: "low" | "medium" | "high";
  badge?: string;
}

export const TRANSPORT_OPTIONS: OnboardingOption<OnboardingData["transport"]>[] =
  [
    {
      value: "car",
      label: "Mostly driving",
      description: "Car is my primary mode of transport",
      icon: Car,
      impact: "high",
    },
    {
      value: "mixed",
      label: "Mixed modes",
      description: "Car, transit, and walking combined",
      icon: Shuffle,
      impact: "medium",
    },
    {
      value: "transit",
      label: "Public transit",
      description: "Bus, train, or metro most days",
      icon: Train,
      impact: "medium",
    },
    {
      value: "bike",
      label: "Cycling",
      description: "Bike or e-bike for most trips",
      icon: Bike,
      impact: "low",
    },
    {
      value: "walk",
      label: "Walking",
      description: "Walkable lifestyle, minimal vehicles",
      icon: Footprints,
      impact: "low",
    },
  ];

export const FOOD_OPTIONS: OnboardingOption<OnboardingData["diet"]>[] = [
  {
    value: "meat-heavy",
    label: "Meat-heavy",
    description: "Meat in most meals",
    icon: Beef,
    impact: "high",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Mix of meat, fish, and plants",
    icon: Salad,
    impact: "medium",
  },
  {
    value: "vegetarian",
    label: "Vegetarian",
    description: "No meat, some dairy",
    icon: Leaf,
    impact: "low",
  },
  {
    value: "vegan",
    label: "Vegan",
    description: "Fully plant-based diet",
    icon: Sprout,
    impact: "low",
  },
];

export const ENERGY_OPTIONS: OnboardingOption<OnboardingData["homeEnergy"]>[] = [
  {
    value: "low",
    label: "Low usage",
    description: "Small space, mindful consumption",
    icon: Zap,
    impact: "low",
  },
  {
    value: "medium",
    label: "Average",
    description: "Typical apartment or home",
    icon: Home,
    impact: "medium",
  },
  {
    value: "high",
    label: "High usage",
    description: "Large home, AC, always-on devices",
    icon: Building2,
    impact: "high",
  },
];

export const HOUSEHOLD_OPTIONS: OnboardingOption<OnboardingData["household"]>[] =
  [
    {
      value: "solo",
      label: "Solo home",
      description: "One-person household or private studio",
      icon: User,
      impact: "high",
      badge: "More per person",
    },
    {
      value: "couple",
      label: "Shared by two",
      description: "Two people sharing core home energy",
      icon: Users,
      impact: "medium",
      badge: "Shared load",
    },
    {
      value: "family",
      label: "Family / shared home",
      description: "Three or more people sharing utilities",
      icon: Home,
      impact: "low",
      badge: "Lower per person",
    },
  ];

export const TRAVEL_OPTIONS: OnboardingOption<OnboardingData["travel"]>[] = [
  {
    value: "rare",
    label: "Rarely",
    description: "0–1 flights per year",
    icon: MapPin,
    impact: "low",
  },
  {
    value: "occasional",
    label: "Occasionally",
    description: "2–4 trips per year",
    icon: Plane,
    impact: "medium",
  },
  {
    value: "frequent",
    label: "Frequently",
    description: "5+ flights per year",
    icon: Globe,
    impact: "high",
  },
];

export const SHOPPING_OPTIONS: OnboardingOption<OnboardingData["shopping"]>[] =
  [
    {
      value: "minimal",
      label: "Minimal",
      description: "Buy only essentials",
      icon: Package,
      impact: "low",
    },
    {
      value: "moderate",
      label: "Moderate",
      description: "Regular but considered purchases",
      icon: ShoppingBag,
      impact: "medium",
    },
    {
      value: "frequent",
      label: "Frequent",
      description: "Regular online orders & upgrades",
      icon: ShoppingCart,
      impact: "high",
    },
  ];

export const MOTIVATION_OPTIONS: OnboardingOption<OnboardingData["motivation"]>[] =
  [
    {
      value: "shrink-footprint",
      label: "Shrink my footprint",
      description: "Prioritize the highest-carbon decisions first",
      icon: Target,
      impact: "low",
      badge: "Climate",
    },
    {
      value: "lower-bills",
      label: "Lower bills",
      description: "Find actions that cut energy and money waste",
      icon: Zap,
      impact: "medium",
      badge: "Savings",
    },
    {
      value: "travel-smarter",
      label: "Travel smarter",
      description: "Balance trips with better routes and offsets",
      icon: Plane,
      impact: "medium",
      badge: "Mobility",
    },
    {
      value: "consume-less",
      label: "Consume less",
      description: "Reduce purchases, packaging, and delivery impact",
      icon: ShoppingBag,
      impact: "low",
      badge: "Lifestyle",
    },
  ];

export const STEP_META = [
  { id: 1, title: "Transport", subtitle: "How do you get around?" },
  { id: 2, title: "Food", subtitle: "What's on your plate?" },
  { id: 3, title: "Home Energy", subtitle: "How much power do you use?" },
  {
    id: 4,
    title: "Travel & Shopping",
    subtitle: "Flights and consumption habits",
  },
  { id: 5, title: "Calibrate Twin", subtitle: "Name and confirm your profile" },
] as const;

export const IMPACT_COLORS = {
  low: "border-border bg-primary/10 text-primary",
  medium: "border-amber-400/30 bg-amber-500/5 text-amber-500",
  high: "border-red-400/30 bg-red-500/5 text-red-300",
} as const;

export function getOptionLabel(
  field: keyof OnboardingData,
  value: string
): string {
  const maps: Record<string, OnboardingOption[]> = {
    transport: TRANSPORT_OPTIONS,
    diet: FOOD_OPTIONS,
    homeEnergy: ENERGY_OPTIONS,
    household: HOUSEHOLD_OPTIONS,
    travel: TRAVEL_OPTIONS,
    shopping: SHOPPING_OPTIONS,
    motivation: MOTIVATION_OPTIONS,
  };
  return maps[field]?.find((o) => o.value === value)?.label ?? value;
}
