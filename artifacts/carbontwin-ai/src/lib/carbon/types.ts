export interface CategoryBreakdown {
  transport: number;
  food: number;
  home: number;
  travel: number;
  shopping: number;
}

export type CategoryKey = keyof CategoryBreakdown;

export type ActionDifficulty = "Easy" | "Medium" | "Focused";
export type CoachingTone = "encouraging" | "warning" | "opportunity";
export type SimulationMode = "steady" | "ambitious";

export interface RecommendedAction {
  id: string;
  category: CategoryKey;
  title: string;
  description: string;
  annualSavingsKg: number;
  difficulty: ActionDifficulty;
  timelineLabel: string;
  firstStep: string;
  reason: string;
  successMetric: string;
}

export interface TwinProfile {
  name: string;
  ownerName: string;
  personality: string;
  archetype: string;
  traits: string[];
  summary: string;
  avatarCode: string;
  dominantCategory: CategoryKey;
  signal: string;
}

export interface CarbonProfile {
  headline: string;
  summary: string;
  topChallenge: string;
  strongestHabit: string;
  coachMode: string;
  householdContext: string;
}

export interface CoachingInsight {
  id: string;
  tone: CoachingTone;
  title: string;
  description: string;
  cta: string;
}

export interface SimulationYearResult {
  years: number;
  baselineAnnualKg: number;
  plannedAnnualKg: number;
  annualReductionKg: number;
  totalAvoidedKg: number;
  scoreIfMaintained: number;
  narrative: string;
}

export interface FutureSimulation {
  mode: SimulationMode;
  summary: string;
  outlook: SimulationYearResult[];
}

export interface CarbonResult {
  annualKg: number;
  monthlyKg: number;
  dailyKg: number;
  dailyBudgetKg: number;
  targetAnnualKg: number;
  targetScore: number;
  carbonScore: number;
  breakdown: CategoryBreakdown;
  breakdownPct: CategoryBreakdown;
  twin: TwinProfile;
  profile: CarbonProfile;
  coach: CoachingInsight[];
  simulations: Record<SimulationMode, FutureSimulation>;
  vsAveragePct: number;
  topCategory: CategoryKey;
  recommendedActions: RecommendedAction[];
  reductionPotentialKg: number;
}

export interface PartialCarbonEstimate {
  annualKg: number;
  monthlyKg: number;
  dailyKg: number;
  carbonScore: number;
  confidence: number;
  completedSignals: number;
  totalSignals: number;
  breakdown: CategoryBreakdown;
  selected: Record<CategoryKey, boolean>;
}
