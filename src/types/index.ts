export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface OnboardingData {
  name: string;
  transport: "car" | "transit" | "bike" | "walk" | "mixed";
  diet: "meat-heavy" | "balanced" | "vegetarian" | "vegan";
  homeEnergy: "low" | "medium" | "high";
  household: "solo" | "couple" | "family";
  shopping: "minimal" | "moderate" | "frequent";
  travel: "rare" | "occasional" | "frequent";
  motivation:
    | "shrink-footprint"
    | "lower-bills"
    | "travel-smarter"
    | "consume-less";
}

export interface CarbonTwin {
  id: string;
  user_id: string;
  name: string;
  avatar_description: string;
  personality: string;
  annual_footprint_kg: number;
  daily_budget_kg: number;
  traits: string[];
  created_at: string;
}

export interface ReceiptAnalysis {
  id: string;
  user_id: string;
  image_url: string;
  items: ReceiptItem[];
  total_carbon_kg: number;
  summary: string;
  created_at: string;
}

export interface ReceiptItem {
  name: string;
  category: string;
  carbon_kg: number;
}

export interface SimulationResult {
  years: number;
  projected_footprint_kg: number;
  narrative: string;
  milestones: string[];
}

export interface TimeMachineScenario {
  id: string;
  name: string;
  changes: Partial<OnboardingData>;
  projected_footprint_kg: number;
  savings_kg: number;
  narrative: string;
}

export interface CarbonBudget {
  daily_limit_kg: number;
  daily_used_kg: number;
  monthly_limit_kg: number;
  monthly_used_kg: number;
  percentage: number;
}

export const MVP_FEATURES = [
  {
    id: "twin",
    title: "Carbon Twin Generation",
    description:
      "AI creates a personalized digital twin that mirrors your lifestyle and carbon footprint.",
    icon: "Sparkles",
  },
  {
    id: "simulator",
    title: "Future Simulator",
    description:
      "Project your carbon trajectory 1, 5, or 10 years into the future with AI narratives.",
    icon: "TrendingUp",
  },
  {
    id: "time-machine",
    title: "What-If Time Machine",
    description:
      "Rewind and fast-forward lifestyle choices to see instant carbon impact comparisons.",
    icon: "Clock",
  },
  {
    id: "receipts",
    title: "AI Receipt Analysis",
    description:
      "Snap a receipt photo - Gemini Vision breaks down every item's carbon cost.",
    icon: "ScanLine",
  },
  {
    id: "speaks",
    title: "Twin Speaks",
    description:
      "Your carbon twin narrates insights, tips, and encouragement in real time.",
    icon: "MessageCircle",
  },
  {
    id: "budget",
    title: "Carbon Budget Meter",
    description:
      "Track daily and monthly carbon allowance like a financial budget.",
    icon: "Gauge",
  },
] as const;
