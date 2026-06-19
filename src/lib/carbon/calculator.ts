import type { OnboardingData } from "@/types";

export interface CategoryBreakdown {
  transport: number;
  food: number;
  home: number;
  travel: number;
  shopping: number;
}

export type CategoryKey = keyof CategoryBreakdown;

export interface RecommendedAction {
  id: string;
  category: CategoryKey;
  title: string;
  description: string;
  annualSavingsKg: number;
  difficulty: "Easy" | "Medium" | "Focused";
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

const TRANSPORT_KG: Record<OnboardingData["transport"], number> = {
  car: 3200,
  mixed: 2100,
  transit: 900,
  bike: 200,
  walk: 80,
};

const DIET_KG: Record<OnboardingData["diet"], number> = {
  "meat-heavy": 2800,
  balanced: 1800,
  vegetarian: 1200,
  vegan: 800,
};

const HOME_KG: Record<OnboardingData["homeEnergy"], number> = {
  low: 600,
  medium: 1400,
  high: 2800,
};

const HOUSEHOLD_HOME_MULTIPLIER: Record<OnboardingData["household"], number> = {
  solo: 1,
  couple: 0.74,
  family: 0.58,
};

const TRAVEL_KG: Record<OnboardingData["travel"], number> = {
  rare: 300,
  occasional: 1200,
  frequent: 3500,
};

const SHOPPING_KG: Record<OnboardingData["shopping"], number> = {
  minimal: 400,
  moderate: 1000,
  frequent: 2200,
};

const AVG_ANNUAL_KG = 4200;
const DAILY_BUDGET_KG = Math.round((AVG_ANNUAL_KG / 365) * 10) / 10;

const DEFAULT_BREAKDOWN: CategoryBreakdown = {
  transport: 1500,
  food: 1600,
  home: 1300,
  travel: 1200,
  shopping: 1000,
};

const NAME_PREFIXES = [
  "Eco",
  "Nova",
  "Aero",
  "Terra",
  "Luma",
  "Cyan",
  "Pulse",
  "Flux",
];

const NAME_SUFFIXES = [
  "Alex",
  "River",
  "Sage",
  "Kai",
  "Morgan",
  "Quinn",
  "Reed",
  "Sky",
];

const PERSONALITIES: Record<CategoryKey, { personality: string; archetype: string }> =
  {
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

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  transport: "transport",
  food: "food",
  home: "home energy",
  travel: "travel",
  shopping: "shopping",
};

function sumBreakdown(breakdown: CategoryBreakdown): number {
  return Object.values(breakdown).reduce((total, kg) => total + kg, 0);
}

function homeEnergyKg(
  homeEnergy: OnboardingData["homeEnergy"],
  household: OnboardingData["household"]
): number {
  return Math.round(HOME_KG[homeEnergy] * HOUSEHOLD_HOME_MULTIPLIER[household]);
}

function hashChoices(data: OnboardingData): number {
  const str = `${data.name}${data.transport}${data.diet}${data.homeEnergy}${data.household}${data.travel}${data.shopping}${data.motivation}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
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

function buildActionLibrary(
  data: OnboardingData,
  topCategory: CategoryKey
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (data.transport === "car") {
    actions.push({
      id: "car-to-transit",
      category: "transport",
      title: "Swap two weekly car trips",
      description: "Move two repeat trips to transit, carpooling, biking, or walking.",
      annualSavingsKg: 520,
      difficulty: "Medium",
    });
  } else if (data.transport === "mixed") {
    actions.push({
      id: "optimize-mixed-commute",
      category: "transport",
      title: "Lock in a low-carbon commute day",
      description: "Choose one weekday where transit, cycling, or walking is the default.",
      annualSavingsKg: 260,
      difficulty: "Easy",
    });
  } else {
    actions.push({
      id: "protect-low-carbon-mobility",
      category: "transport",
      title: "Protect your mobility advantage",
      description: "Keep short trips car-free and batch errands when a vehicle is needed.",
      annualSavingsKg: 120,
      difficulty: "Easy",
    });
  }

  if (data.diet === "meat-heavy") {
    actions.push({
      id: "reduce-red-meat",
      category: "food",
      title: "Shift two meat-heavy meals",
      description: "Replace two weekly red-meat meals with plant-forward alternatives.",
      annualSavingsKg: 430,
      difficulty: "Easy",
    });
  } else if (data.diet === "balanced") {
    actions.push({
      id: "plant-forward-week",
      category: "food",
      title: "Make weekdays plant-forward",
      description: "Keep animal products for fewer meals and make staples plant-based.",
      annualSavingsKg: 260,
      difficulty: "Medium",
    });
  } else {
    actions.push({
      id: "seasonal-food",
      category: "food",
      title: "Tune your low-impact plate",
      description: "Favor seasonal, local, lower-packaging foods to compound gains.",
      annualSavingsKg: 110,
      difficulty: "Easy",
    });
  }

  if (data.homeEnergy === "high") {
    actions.push({
      id: "home-energy-tune",
      category: "home",
      title: "Run a home energy tune-up",
      description: "Adjust thermostat bands, seal leaks, and schedule always-on devices.",
      annualSavingsKg: 520,
      difficulty: "Focused",
    });
  } else if (data.homeEnergy === "medium") {
    actions.push({
      id: "smart-energy-routine",
      category: "home",
      title: "Automate your energy routine",
      description: "Use timers and smart plugs for cooling, heating, chargers, and standby loads.",
      annualSavingsKg: 260,
      difficulty: "Easy",
    });
  } else {
    actions.push({
      id: "renewable-next",
      category: "home",
      title: "Explore renewable supply",
      description: "Your usage is lean; renewable electricity is the next meaningful lever.",
      annualSavingsKg: 160,
      difficulty: "Medium",
    });
  }

  if (data.travel === "frequent") {
    actions.push({
      id: "one-less-flight",
      category: "travel",
      title: "Replace one flight this year",
      description: "Swap one short-haul flight for rail, remote attendance, or a longer combined trip.",
      annualSavingsKg: 700,
      difficulty: "Focused",
    });
  } else if (data.travel === "occasional") {
    actions.push({
      id: "bundle-travel",
      category: "travel",
      title: "Bundle your next trip",
      description: "Combine nearby travel goals into one itinerary instead of separate flights.",
      annualSavingsKg: 330,
      difficulty: "Medium",
    });
  } else {
    actions.push({
      id: "keep-travel-rare",
      category: "travel",
      title: "Keep rare travel intentional",
      description: "When you do travel, choose longer stays and lower-carbon local transport.",
      annualSavingsKg: 120,
      difficulty: "Easy",
    });
  }

  if (data.shopping === "frequent") {
    actions.push({
      id: "pause-purchases",
      category: "shopping",
      title: "Add a 30-day purchase pause",
      description: "Delay non-essential purchases, batch deliveries, and repair before replacing.",
      annualSavingsKg: 420,
      difficulty: "Medium",
    });
  } else if (data.shopping === "moderate") {
    actions.push({
      id: "buy-less-better",
      category: "shopping",
      title: "Buy less, choose longer life",
      description: "Shift one recurring category toward secondhand, refillable, or durable options.",
      annualSavingsKg: 220,
      difficulty: "Easy",
    });
  } else {
    actions.push({
      id: "maintain-minimal-shopping",
      category: "shopping",
      title: "Keep your consumption baseline",
      description: "Track replacement cycles so minimal buying stays easy over time.",
      annualSavingsKg: 90,
      difficulty: "Easy",
    });
  }

  const motivationBonus: Record<
    OnboardingData["motivation"],
    RecommendedAction
  > = {
    "shrink-footprint": {
      id: "focus-biggest-lever",
      category: topCategory,
      title: `Attack your biggest lever: ${CATEGORY_LABELS[topCategory]}`,
      description: "Start with the category driving the largest share of your twin's footprint.",
      annualSavingsKg: 300,
      difficulty: "Medium",
    },
    "lower-bills": {
      id: "bill-saving-stack",
      category: "home",
      title: "Stack bill-saving automations",
      description: "Schedule HVAC, water heating, chargers, and standby devices around real use.",
      annualSavingsKg: 300,
      difficulty: "Easy",
    },
    "travel-smarter": {
      id: "travel-budget",
      category: "travel",
      title: "Create a travel carbon budget",
      description: "Pre-plan annual trips so one high-impact journey does not surprise the footprint.",
      annualSavingsKg: 280,
      difficulty: "Medium",
    },
    "consume-less": {
      id: "consumption-budget",
      category: "shopping",
      title: "Set a monthly buying budget",
      description: "Use a simple purchase cap for discretionary items and delivery orders.",
      annualSavingsKg: 250,
      difficulty: "Easy",
    },
  };

  actions.push(motivationBonus[data.motivation]);

  return actions
    .sort((a, b) => b.annualSavingsKg - a.annualSavingsKg)
    .slice(0, 4);
}

function generateTwin(
  data: OnboardingData,
  breakdown: CategoryBreakdown,
  actions: RecommendedAction[]
): TwinProfile {
  const hash = hashChoices(data);
  const prefix = NAME_PREFIXES[hash % NAME_PREFIXES.length];
  const suffix = NAME_SUFFIXES[(hash >> 3) % NAME_SUFFIXES.length];
  const dominant = getDominantCategory(breakdown);
  const persona = PERSONALITIES[dominant];
  const ownerName = data.name.trim().split(/\s+/)[0] || "Explorer";

  const traits: string[] = [];
  if (data.transport === "bike" || data.transport === "walk") {
    traits.push("Low-carbon commuter");
  }
  if (data.transport === "car") traits.push("Mobility optimizer");
  if (data.diet === "vegan" || data.diet === "vegetarian") {
    traits.push("Plant-forward");
  }
  if (data.homeEnergy === "low") traits.push("Energy minimalist");
  if (data.household !== "solo") traits.push("Shared-energy home");
  if (data.travel === "rare") traits.push("Intentional traveler");
  if (data.shopping === "minimal") traits.push("Mindful spender");
  if (traits.length === 0) traits.push("Carbon curious");
  if (traits.length < 3) traits.push("Future optimizer");

  const annual = sumBreakdown(breakdown);
  const score = calculateCarbonScore(annual);
  const vsAvg = Math.round(((annual - AVG_ANNUAL_KG) / AVG_ANNUAL_KG) * 100);
  const summary = buildSummary(data, annual, score, vsAvg, dominant, actions[0]);

  return {
    name: `${prefix}-${suffix}`,
    ownerName,
    personality: persona.personality,
    archetype: persona.archetype,
    traits: traits.slice(0, 3),
    summary,
    avatarCode: `CT-${String((hash % 90) + 10)}`,
    dominantCategory: dominant,
    signal: `${CATEGORY_LABELS[dominant]} is the strongest signal in ${ownerName}'s profile`,
  };
}

function buildSummary(
  data: OnboardingData,
  annualKg: number,
  score: number,
  vsAvg: number,
  dominant: CategoryKey,
  topAction?: RecommendedAction
): string {
  const tonnes = formatTonnes(annualKg);
  const comparison =
    vsAvg > 0
      ? `${vsAvg}% above the global average`
      : vsAvg < 0
        ? `${Math.abs(vsAvg)}% below the global average`
        : "right at the global average";

  const motivation: Record<OnboardingData["motivation"], string> = {
    "shrink-footprint": "cutting the biggest carbon sources first",
    "lower-bills": "finding climate wins that also reduce waste and bills",
    "travel-smarter": "making travel feel intentional instead of automatic",
    "consume-less": "building a lighter, lower-consumption routine",
  };

  const actionLine = topAction
    ? `Your first move is "${topAction.title}", worth about ${topAction.annualSavingsKg} kg CO2 per year.`
    : "Your first move is to keep tracking the categories with the highest signal.";

  return `I mapped ${data.name.trim()}'s lifestyle into ${tonnes} tonnes of annual CO2, ${comparison}. With a Carbon Score of ${score}/100, the biggest lever is ${CATEGORY_LABELS[dominant]}. Since your goal is ${motivation[data.motivation]}, I will prioritize practical nudges over guilt. ${actionLine}`;
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

export function calculateCarbonScore(annualKg: number): number {
  const score = Math.round(100 - annualKg / 100);
  return Math.max(0, Math.min(100, score));
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
    confidence: Math.round((completedSignals / 8) * 100),
    completedSignals,
    totalSignals: 8,
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
  const recommendedActions = buildActionLibrary(data, topCategory);
  const reductionPotentialKg = recommendedActions.reduce(
    (total, action) => total + action.annualSavingsKg,
    0
  );
  const targetAnnualKg = Math.max(0, annualKg - reductionPotentialKg);
  const targetScore = calculateCarbonScore(targetAnnualKg);
  const vsAveragePct = Math.round(
    ((annualKg - AVG_ANNUAL_KG) / AVG_ANNUAL_KG) * 100
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
    twin: generateTwin(data, breakdown, recommendedActions),
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

export function formatTonnes(kg: number): string {
  return (kg / 1000).toFixed(1);
}
