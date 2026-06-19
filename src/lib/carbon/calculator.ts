import type { OnboardingData } from "@/types";

export interface CategoryBreakdown {
  transport: number;
  food: number;
  home: number;
  travel: number;
  shopping: number;
}

export interface TwinProfile {
  name: string;
  personality: string;
  archetype: string;
  traits: string[];
  summary: string;
  avatarEmoji: string;
}

export interface CarbonResult {
  annualKg: number;
  monthlyKg: number;
  dailyKg: number;
  carbonScore: number;
  breakdown: CategoryBreakdown;
  breakdownPct: CategoryBreakdown;
  twin: TwinProfile;
  vsAveragePct: number;
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

const PERSONALITIES: Record<string, { personality: string; archetype: string }> =
  {
    transport: {
      personality: "The Mobility Maven",
      archetype: "Always calculating the carbon cost of every mile",
    },
    food: {
      personality: "The Plate Philosopher",
      archetype: "Sees every meal as a climate statement",
    },
    home: {
      personality: "The Energy Architect",
      archetype: "Obsessed with watts, warmth, and waste",
    },
    travel: {
      personality: "The Horizon Hunter",
      archetype: "Balances wanderlust with footprint awareness",
    },
    shopping: {
      personality: "The Conscious Consumer",
      archetype: "Questions every purchase before it ships",
    },
  };

function hashChoices(data: OnboardingData): number {
  const str = `${data.transport}${data.diet}${data.homeEnergy}${data.travel}${data.shopping}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDominantCategory(
  breakdown: CategoryBreakdown
): keyof CategoryBreakdown {
  const entries = Object.entries(breakdown) as [
    keyof CategoryBreakdown,
    number,
  ][];
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

function generateTwin(data: OnboardingData, breakdown: CategoryBreakdown): TwinProfile {
  const hash = hashChoices(data);
  const prefix = NAME_PREFIXES[hash % NAME_PREFIXES.length];
  const suffix = NAME_SUFFIXES[(hash >> 3) % NAME_SUFFIXES.length];
  const dominant = getDominantCategory(breakdown);
  const persona = PERSONALITIES[dominant];

  const traits: string[] = [];
  if (data.transport === "bike" || data.transport === "walk")
    traits.push("Low-carbon commuter");
  if (data.diet === "vegan" || data.diet === "vegetarian")
    traits.push("Plant-forward");
  if (data.homeEnergy === "low") traits.push("Energy minimalist");
  if (data.travel === "rare") traits.push("Homebody explorer");
  if (data.shopping === "minimal") traits.push("Mindful spender");
  if (traits.length === 0) traits.push("Carbon curious");
  if (traits.length < 3) traits.push("Future optimizer");

  const annual = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const score = calculateCarbonScore(annual);
  const vsAvg = Math.round(((annual - AVG_ANNUAL_KG) / AVG_ANNUAL_KG) * 100);

  const summary = buildSummary(data, annual, score, vsAvg, dominant);

  const emojis = ["🌐", "⚡", "🔮", "🛰️", "💠", "🌀"];
  return {
    name: `${prefix}-${suffix}`,
    personality: persona.personality,
    archetype: persona.archetype,
    traits: traits.slice(0, 3),
    summary,
    avatarEmoji: emojis[hash % emojis.length],
  };
}

function buildSummary(
  data: OnboardingData,
  annualKg: number,
  score: number,
  vsAvg: number,
  dominant: keyof CategoryBreakdown
): string {
  const tonnes = (annualKg / 1000).toFixed(1);
  const comparison =
    vsAvg > 0
      ? `${vsAvg}% above the global average`
      : vsAvg < 0
        ? `${Math.abs(vsAvg)}% below the global average`
        : "right at the global average";

  const dominantLabel: Record<keyof CategoryBreakdown, string> = {
    transport: "transport habits",
    food: "dietary choices",
    home: "home energy use",
    travel: "travel patterns",
    shopping: "consumption habits",
  };

  const tip: Record<keyof CategoryBreakdown, string> = {
    transport:
      data.transport === "car"
        ? "Switching one weekly drive to transit could drop your score by 8 points."
        : "Your mobility choices are already a strength — keep optimizing short trips.",
    food:
      data.diet === "meat-heavy"
        ? "Reducing red meat by two meals a week is your fastest win."
        : "Your plate is already aligned — focus on local and seasonal next.",
    home:
      data.homeEnergy === "high"
        ? "Smart thermostat adjustments could cut home emissions by 15%."
        : "Your home footprint is lean — consider renewable energy next.",
    travel:
      data.travel === "frequent"
        ? "One fewer flight per year would be your biggest single improvement."
        : "Your travel footprint is controlled — keep choosing rail over air.",
    shopping:
      data.shopping === "frequent"
        ? "A 30-day buy-nothing challenge would noticeably shift your score."
        : "Your consumption is restrained — repair and reuse will compound gains.",
  };

  return `I've analyzed your lifestyle and mapped ${tonnes} tonnes of annual CO₂ — ${comparison}. With a Carbon Score of ${score}/100, your biggest lever is ${dominantLabel[dominant]}. ${tip[dominant]} I'm ready to guide every decision from here.`;
}

export function calculateCarbonScore(annualKg: number): number {
  const score = Math.round(100 - annualKg / 100);
  return Math.max(0, Math.min(100, score));
}

export function calculateCarbonResult(data: OnboardingData): CarbonResult {
  const breakdown: CategoryBreakdown = {
    transport: TRANSPORT_KG[data.transport],
    food: DIET_KG[data.diet],
    home: HOME_KG[data.homeEnergy],
    travel: TRAVEL_KG[data.travel],
    shopping: SHOPPING_KG[data.shopping],
  };

  const annualKg = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const monthlyKg = Math.round(annualKg / 12);
  const dailyKg = Math.round((annualKg / 365) * 10) / 10;
  const carbonScore = calculateCarbonScore(annualKg);

  const breakdownPct: CategoryBreakdown = {
    transport: Math.round((breakdown.transport / annualKg) * 100),
    food: Math.round((breakdown.food / annualKg) * 100),
    home: Math.round((breakdown.home / annualKg) * 100),
    travel: Math.round((breakdown.travel / annualKg) * 100),
    shopping: Math.round((breakdown.shopping / annualKg) * 100),
  };

  const vsAveragePct = Math.round(
    ((annualKg - AVG_ANNUAL_KG) / AVG_ANNUAL_KG) * 100
  );

  return {
    annualKg,
    monthlyKg,
    dailyKg,
    carbonScore,
    breakdown,
    breakdownPct,
    twin: generateTwin(data, breakdown),
    vsAveragePct,
  };
}

export function isOnboardingComplete(
  data: Partial<OnboardingData>
): data is OnboardingData {
  return !!(
    data.transport &&
    data.diet &&
    data.homeEnergy &&
    data.shopping &&
    data.travel
  );
}

// Fix buildSummary reference - I made an error with generateTwin.name
export function formatTonnes(kg: number): string {
  return (kg / 1000).toFixed(1);
}
