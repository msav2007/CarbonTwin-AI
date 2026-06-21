/**
 * @file Core domain types for the CarbonTwin carbon engine.
 *
 * These types model the full lifecycle of a carbon footprint calculation:
 * from raw per-category emission breakdowns, through recommended actions
 * and twin profile generation, to future simulation results.
 *
 * All numeric emission values are in kilograms of CO₂-equivalent (kg CO₂e)
 * unless the field name explicitly states otherwise.
 */

/**
 * Annual CO₂ emissions broken down by the five lifestyle categories
 * tracked by CarbonTwin. All values are in kilograms per year.
 */
export interface CategoryBreakdown {
  /** Annual kg CO₂ from personal transport (car, transit, cycling, walking). */
  transport: number;
  /** Annual kg CO₂ from dietary choices (meat-heavy → vegan). */
  food: number;
  /** Annual kg CO₂ from home energy use, adjusted for household size. */
  home: number;
  /** Annual kg CO₂ from air travel frequency. */
  travel: number;
  /** Annual kg CO₂ from consumer goods and shopping behaviour. */
  shopping: number;
}

/** Union type of the five tracked emission category keys. */
export type CategoryKey = keyof CategoryBreakdown;

/**
 * Effort level for a recommended carbon reduction action.
 * Used to help users filter and prioritise actions by commitment level.
 */
export type ActionDifficulty = "Easy" | "Medium" | "Focused";

/**
 * Visual and semantic tone for a coaching insight card.
 * Controls the card's icon, colour scheme, and screen-reader label.
 */
export type CoachingTone = "encouraging" | "warning" | "opportunity";

/**
 * The two trajectory modes available in the future simulation engine.
 * - `steady`: gradual adoption with a 3-year ramp; 62% action capture rate.
 * - `ambitious`: faster adoption with a 2-year ramp; 84% action capture rate.
 */
export type SimulationMode = "steady" | "ambitious";

/**
 * A single personalised carbon reduction action surfaced to the user
 * after onboarding. Actions are ranked by `annualSavingsKg` descending
 * so the highest-impact change is always presented first.
 */
export interface RecommendedAction {
  /** Unique identifier for this action (e.g. `"switch-to-transit"`). */
  id: string;
  /** The emission category this action primarily addresses. */
  category: CategoryKey;
  /** Short display title shown on action cards (≤ 60 characters). */
  title: string;
  /** One-sentence explanation of why this action matters for this specific user. */
  description: string;
  /** Estimated annual CO₂ saving in kg if the user fully adopts this action. */
  annualSavingsKg: number;
  /** How much effort and commitment this action requires. */
  difficulty: ActionDifficulty;
  /** Human-readable time horizon (e.g. `"This month"`, `"Next 3 months"`). */
  timelineLabel: string;
  /** The single most actionable first step the user can take today. */
  firstStep: string;
  /** Personalised rationale explaining why this action applies to this user's profile. */
  reason: string;
  /** Measurable outcome the user can track to know they have succeeded. */
  successMetric: string;
}

/**
 * The user's Carbon Twin — an AI persona derived deterministically from
 * their onboarding answers. The twin `name` is produced by hashing the
 * user's lifestyle choices, so identical inputs always generate the same twin.
 */
export interface TwinProfile {
  /** Deterministically generated twin name (e.g. `"Terra-Sage"`). */
  name: string;
  /** The user's own first name, extracted from their onboarding display name. */
  ownerName: string;
  /** Short personality descriptor for this twin's dominant emission category. */
  personality: string;
  /** One-line archetype label (e.g. `"The Mobility Maven"`). */
  archetype: string;
  /** Up to 3 sustainability trait labels derived from the user's habits. */
  traits: string[];
  /** Narrative summary of the user's footprint and one key recommendation. */
  summary: string;
  /**
   * Short alphanumeric code used to select a visual avatar variant
   * (e.g. `"CT-42"`). Derived from the same hash as `name`.
   */
  avatarCode: string;
  /** The emission category with the highest annual kg for this user. */
  dominantCategory: CategoryKey;
  /** One-sentence signal statement describing the dominant category in context. */
  signal: string;
}

/**
 * A narrative assessment of the user's carbon strengths and improvement areas,
 * displayed on the Dashboard Coach page alongside AI coaching insights.
 */
export interface CarbonProfile {
  /** Short headline summarising the user's overall carbon identity. */
  headline: string;
  /** 2–3 sentence narrative placing their footprint in global context. */
  summary: string;
  /** One-sentence description of the most impactful area to address next. */
  topChallenge: string;
  /** One-sentence description of the strongest sustainable habit the user already has. */
  strongestHabit: string;
  /** Coaching mode label derived from the user's stated motivation. */
  coachMode: string;
  /** Contextual sentence about the user's household energy-sharing situation. */
  householdContext: string;
}

/**
 * A single insight card displayed on the Dashboard Coach page.
 * Each card has a tone, a headline, body text, and an optional call-to-action.
 */
export interface CoachingInsight {
  /** Unique identifier for this card (e.g. `"today"`, `"top-action"`, `"motivation"`). */
  id: string;
  /** Visual tone controlling the card's colour scheme and icon. */
  tone: CoachingTone;
  /** Short card headline (displayed in bold at the top of the card). */
  title: string;
  /** 1–2 sentence body text containing the actual coaching content. */
  description: string;
  /** Call-to-action button label (empty string when no action is applicable). */
  cta: string;
}

/**
 * The projected carbon outcome for a single time horizon (1, 5, or 10 years)
 * under a given simulation mode. Combines a business-as-usual baseline trajectory
 * with the user's planned reduction trajectory.
 */
export interface SimulationYearResult {
  /** Number of years into the future this result represents (always 1, 5, or 10). */
  years: number;
  /** Projected annual kg CO₂ if the user makes no changes (business-as-usual baseline). */
  baselineAnnualKg: number;
  /** Projected annual kg CO₂ if the user adopts their top recommended actions. */
  plannedAnnualKg: number;
  /** Annual CO₂ reduction vs. the baseline trajectory for this year. */
  annualReductionKg: number;
  /** Total cumulative CO₂ avoided across all years up to this horizon. */
  totalAvoidedKg: number;
  /** Carbon Score the user would achieve if they maintain the planned trajectory to this year. */
  scoreIfMaintained: number;
  /** Human-readable narrative describing the key drivers of this horizon's projection. */
  narrative: string;
}

/**
 * A complete future simulation for one {@link SimulationMode},
 * covering 1-, 5-, and 10-year outlook projections.
 */
export interface FutureSimulation {
  /** The simulation mode these projections were calculated under. */
  mode: SimulationMode;
  /** Plain-text explanation of what this mode assumes about user behaviour. */
  summary: string;
  /**
   * Year-by-year projection results in ascending order.
   * One entry per value in {@link SIMULATION_HORIZONS} (i.e. [1, 5, 10]).
   */
  outlook: SimulationYearResult[];
}

/**
 * The complete result of a full carbon footprint calculation.
 * Produced by `calculateCarbonResult` from complete {@link OnboardingData}.
 *
 * This is the primary data structure passed to the Twin Reveal screen,
 * stored in the Zustand persist store, and consumed by all dashboard pages.
 */
export interface CarbonResult {
  /** Total annual CO₂ emissions in kg. */
  annualKg: number;
  /** Monthly CO₂ equivalent in kg (annualKg ÷ 12, rounded to nearest integer). */
  monthlyKg: number;
  /** Daily CO₂ equivalent in kg (annualKg ÷ 365, one decimal place). */
  dailyKg: number;
  /** The 1.5°C-aligned daily CO₂ budget per person in kg (≈ 11.5 kg/day). */
  dailyBudgetKg: number;
  /** Projected annual kg CO₂ after adopting all recommended actions. */
  targetAnnualKg: number;
  /** Carbon Score the user would achieve after adopting all recommended actions. */
  targetScore: number;
  /** Current Carbon Score (0–100; higher = lower emissions). */
  carbonScore: number;
  /** Per-category annual CO₂ in kg. */
  breakdown: CategoryBreakdown;
  /** Per-category share of total emissions as integer percentages (values sum to ≈ 100). */
  breakdownPct: CategoryBreakdown;
  /** The user's generated Carbon Twin persona. */
  twin: TwinProfile;
  /** Narrative carbon profile with strengths and improvement areas. */
  profile: CarbonProfile;
  /** Coaching insight cards for the Dashboard Coach page. */
  coach: CoachingInsight[];
  /** Future reduction simulations keyed by mode. */
  simulations: Record<SimulationMode, FutureSimulation>;
  /** Percentage above/below the 4.2t global average (negative = below average). */
  vsAveragePct: number;
  /** The emission category with the highest annual kg. */
  topCategory: CategoryKey;
  /** Ranked list of personalised reduction actions, highest-impact first. */
  recommendedActions: RecommendedAction[];
  /** Maximum achievable annual CO₂ reduction if the user adopts all recommended actions. */
  reductionPotentialKg: number;
}

/**
 * A real-time carbon estimate built from partially-completed onboarding data.
 * Used to power the live footprint preview widget during the onboarding wizard.
 *
 * For missing fields, category-level defaults are substituted so the estimate
 * remains visually meaningful at every step of the form. The `selected` map
 * distinguishes confirmed values from defaults so the UI can style them differently.
 */
export interface PartialCarbonEstimate {
  /** Current best-estimate annual CO₂ in kg (may include defaults for missing fields). */
  annualKg: number;
  /** Monthly CO₂ equivalent in kg. */
  monthlyKg: number;
  /** Daily CO₂ equivalent in kg. */
  dailyKg: number;
  /** Carbon Score derived from the current estimate. */
  carbonScore: number;
  /** Confidence percentage (0–100) based on how many of the 8 signals have been provided. */
  confidence: number;
  /** Number of the 8 onboarding signals that have been provided. */
  completedSignals: number;
  /** Total number of onboarding signals (always 8). */
  totalSignals: number;
  /** Per-category breakdown, mixing confirmed user values with category defaults. */
  breakdown: CategoryBreakdown;
  /**
   * Boolean map indicating which categories have been explicitly answered by the user.
   * `true` = user-provided value; `false` = default substitution.
   */
  selected: Record<CategoryKey, boolean>;
}
