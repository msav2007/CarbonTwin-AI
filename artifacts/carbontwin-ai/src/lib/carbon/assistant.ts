/**
 * @file Carbon Twin, CarbonProfile, coaching insight, and recommendation generation.
 *
 * This module contains the rule-based intelligence layer that turns a raw
 * emission breakdown into a rich, personalised user experience:
 *
 * - `generateTwinProfile`     — deterministic AI persona from lifestyle choices
 * - `generateCarbonProfile`   — narrative strengths / challenges assessment
 * - `generateCoachingInsights`— coaching insight cards for the Dashboard Coach page
 * - `buildRecommendedActions` — ranked, difficulty-rated action plan
 *
 * All functions are pure (no side effects, no network calls).
 * Gemini AI enrichment is layered on top in `src/lib/gemini/client.ts`.
 */
import type { OnboardingData } from "@/types";
import {
  CATEGORY_LABELS,
  CATEGORY_TITLES,
  HOUSEHOLD_LABELS,
  MOTIVATION_FRAMES,
  MOTIVATION_LABELS,
  NAME_PREFIXES,
  NAME_SUFFIXES,
  PERSONALITIES,
} from "@/lib/carbon/constants";
import { calculateCarbonScore, formatTonnes, sumBreakdown } from "@/lib/carbon/math";
import type {
  CarbonProfile,
  CategoryBreakdown,
  CategoryKey,
  CoachingInsight,
  RecommendedAction,
  TwinProfile,
} from "@/lib/carbon/types";

function hashChoices(data: OnboardingData): number {
  const str = `${data.name}${data.transport}${data.diet}${data.homeEnergy}${data.household}${data.travel}${data.shopping}${data.motivation}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function dominantCategory(breakdown: CategoryBreakdown): CategoryKey {
  const entries = Object.entries(breakdown) as [CategoryKey, number][];
  return entries.reduce((highest, current) =>
    highest[1] > current[1] ? highest : current
  )[0];
}

function buildSummary(
  data: OnboardingData,
  annualKg: number,
  score: number,
  vsAveragePct: number,
  focusCategory: CategoryKey,
  topAction?: RecommendedAction
): string {
  const tonnes = formatTonnes(annualKg);
  const comparison =
    vsAveragePct > 0
      ? `${vsAveragePct}% above the 4.2t benchmark`
      : vsAveragePct < 0
        ? `${Math.abs(vsAveragePct)}% below the 4.2t benchmark`
        : "right on the 4.2t benchmark";
  const firstMove = topAction
    ? `Start with "${topAction.title}" and you can avoid about ${topAction.annualSavingsKg} kg CO2 each year.`
    : "Start by protecting your lowest-carbon routines and improving your highest-impact category.";

  return `I mapped ${data.name.trim()}'s lifestyle to ${tonnes} tonnes of annual CO2, ${comparison}. Your Carbon Score is ${score}/100 and ${CATEGORY_LABELS[focusCategory]} is the clearest lever to improve next. Because you care about ${MOTIVATION_FRAMES[data.motivation]}, I will coach you with practical steps instead of generic advice. ${firstMove}`;
}

/**
 * Generates a ranked list of personalised carbon reduction actions
 * based on the user's lifestyle choices and dominant emission category.
 *
 * Actions are filtered to those relevant to the user's current behaviour,
 * scored by estimated annual CO₂ savings, and sorted highest-savings first.
 * The result drives both the Twin Reveal recommendation cards and the
 * reduction potential calculation used in future simulations.
 *
 * @param data - Complete onboarding data used to select applicable actions
 * @param topCategory - The user's highest-emission category (used to weight action priority)
 * @returns Ranked array of {@link RecommendedAction} objects, highest-impact first
 */
export function buildRecommendedActions(
  data: OnboardingData,
  topCategory: CategoryKey
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (data.transport === "car") {
    actions.push({
      id: "car-to-transit",
      category: "transport",
      title: "Swap two weekly car trips",
      description:
        "Move two repeat trips to transit, carpooling, biking, or walking.",
      annualSavingsKg: 520,
      difficulty: "Medium",
      timelineLabel: "This week",
      firstStep:
        "Pick two recurring trips and decide the lower-carbon replacement before Monday.",
      reason:
        "You selected mostly driving, which makes transport one of the biggest signals in your profile.",
      successMetric: "Two car-free trips protected each week",
    });
  } else if (data.transport === "mixed") {
    actions.push({
      id: "optimize-mixed-commute",
      category: "transport",
      title: "Lock in a low-carbon commute day",
      description:
        "Choose one weekday where transit, cycling, or walking is the default.",
      annualSavingsKg: 260,
      difficulty: "Easy",
      timelineLabel: "Next 7 days",
      firstStep:
        "Reserve one repeat commute day in your calendar as a no-car day.",
      reason:
        "Your mixed-mode routine already has flexibility, so one committed low-carbon day can compound fast.",
      successMetric: "One recurring low-carbon commute day on the calendar",
    });
  } else {
    actions.push({
      id: "protect-low-carbon-mobility",
      category: "transport",
      title: "Protect your mobility advantage",
      description:
        "Keep short trips car-free and batch errands when a vehicle is needed.",
      annualSavingsKg: 120,
      difficulty: "Easy",
      timelineLabel: "Ongoing habit",
      firstStep:
        "Choose one errand route this week to batch into a single vehicle trip.",
      reason:
        "Your mobility choices are already low-carbon, so the best win is preserving that advantage.",
      successMetric: "No short convenience trips by car this week",
    });
  }

  if (data.diet === "meat-heavy") {
    actions.push({
      id: "reduce-red-meat",
      category: "food",
      title: "Shift two meat-heavy meals",
      description:
        "Replace two weekly red-meat meals with plant-forward alternatives.",
      annualSavingsKg: 430,
      difficulty: "Easy",
      timelineLabel: "This week",
      firstStep:
        "Choose the two easiest recurring meals to swap before your next grocery run.",
      reason:
        "A meat-heavy diet is pushing your food emissions up faster than any other food choice.",
      successMetric: "Two lower-carbon meal swaps completed per week",
    });
  } else if (data.diet === "balanced") {
    actions.push({
      id: "plant-forward-week",
      category: "food",
      title: "Make weekdays plant-forward",
      description:
        "Keep animal products for fewer meals and make staples plant-based.",
      annualSavingsKg: 260,
      difficulty: "Medium",
      timelineLabel: "Next 2 weeks",
      firstStep:
        "Plan one plant-forward breakfast and one lunch you can repeat every weekday.",
      reason:
        "Your balanced diet gives you room to lower emissions without redesigning every meal.",
      successMetric: "A repeatable weekday meal routine in place",
    });
  } else {
    actions.push({
      id: "seasonal-food",
      category: "food",
      title: "Tune your low-impact plate",
      description:
        "Favor seasonal, local, lower-packaging foods to compound your existing gains.",
      annualSavingsKg: 110,
      difficulty: "Easy",
      timelineLabel: "During your next shop",
      firstStep:
        "Replace one packaged staple with a seasonal or low-packaging alternative.",
      reason:
        "Your food baseline is already lean, so the next gains come from sourcing and waste reduction.",
      successMetric: "One lower-packaging food swap sustained for a month",
    });
  }

  if (data.homeEnergy === "high") {
    actions.push({
      id: "home-energy-tune",
      category: "home",
      title: "Run a home energy tune-up",
      description:
        "Adjust thermostat bands, seal leaks, and schedule always-on devices.",
      annualSavingsKg: 520,
      difficulty: "Focused",
      timelineLabel: "This month",
      firstStep:
        "List your three always-on devices and set schedules or smart plugs for each.",
      reason:
        "High home energy use means your home is a major controllable source of emissions and bills.",
      successMetric: "Three always-on loads scheduled or reduced",
    });
  } else if (data.homeEnergy === "medium") {
    actions.push({
      id: "smart-energy-routine",
      category: "home",
      title: "Automate your energy routine",
      description:
        "Use timers and smart plugs for cooling, heating, chargers, and standby loads.",
      annualSavingsKg: 260,
      difficulty: "Easy",
      timelineLabel: "Next 7 days",
      firstStep:
        "Choose one room and automate the biggest standby or cooling load first.",
      reason:
        "Average home energy is often improved by consistency, not a full home overhaul.",
      successMetric: "One high-use room running on a simpler energy routine",
    });
  } else {
    actions.push({
      id: "renewable-next",
      category: "home",
      title: "Explore renewable supply",
      description:
        "Your usage is lean; renewable electricity is the next meaningful lever.",
      annualSavingsKg: 160,
      difficulty: "Medium",
      timelineLabel: "This quarter",
      firstStep:
        "Check whether your utility offers a renewable energy or green tariff option.",
      reason:
        "Your home is already efficient, so cleaner supply matters more than more behavioral cuts.",
      successMetric: "Renewable supply option researched and compared",
    });
  }

  if (data.travel === "frequent") {
    actions.push({
      id: "one-less-flight",
      category: "travel",
      title: "Replace one flight this year",
      description:
        "Swap one short-haul flight for rail, remote attendance, or a longer combined trip.",
      annualSavingsKg: 700,
      difficulty: "Focused",
      timelineLabel: "Before your next booking",
      firstStep:
        "Review your next flight and ask whether it can be merged, shifted, or replaced.",
      reason:
        "Frequent flying sharply increases your footprint, so even one change has outsized impact.",
      successMetric: "One flight removed or replaced this year",
    });
  } else if (data.travel === "occasional") {
    actions.push({
      id: "bundle-travel",
      category: "travel",
      title: "Bundle your next trip",
      description:
        "Combine nearby travel goals into one itinerary instead of separate journeys.",
      annualSavingsKg: 330,
      difficulty: "Medium",
      timelineLabel: "Before your next trip",
      firstStep:
        "Combine two near-term travel needs into one shared route or single booking window.",
      reason:
        "Occasional travel stays manageable when trips are deliberate instead of fragmented.",
      successMetric: "At least one bundled itinerary this year",
    });
  } else {
    actions.push({
      id: "keep-travel-rare",
      category: "travel",
      title: "Keep rare travel intentional",
      description:
        "When you do travel, choose longer stays and lower-carbon local transport.",
      annualSavingsKg: 120,
      difficulty: "Easy",
      timelineLabel: "Ongoing habit",
      firstStep:
        "Set a simple rule: if you travel, make the stay longer and local mobility lighter.",
      reason:
        "You already avoid frequent travel, so the goal is protecting that low-emission pattern.",
      successMetric: "Future trips planned with longer stays and lighter local transport",
    });
  }

  if (data.shopping === "frequent") {
    actions.push({
      id: "pause-purchases",
      category: "shopping",
      title: "Add a 30-day purchase pause",
      description:
        "Delay non-essential purchases, batch deliveries, and repair before replacing.",
      annualSavingsKg: 420,
      difficulty: "Medium",
      timelineLabel: "Starting now",
      firstStep:
        "Create a list for non-essential purchases and hold them for 30 days before checkout.",
      reason:
        "Frequent shopping increases both product emissions and delivery-related impact.",
      successMetric: "One month of deliberate purchase pauses",
    });
  } else if (data.shopping === "moderate") {
    actions.push({
      id: "buy-less-better",
      category: "shopping",
      title: "Buy less, choose longer life",
      description:
        "Shift one recurring category toward secondhand, refillable, or durable options.",
      annualSavingsKg: 220,
      difficulty: "Easy",
      timelineLabel: "Next purchase",
      firstStep:
        "Pick one category you buy often and pre-commit to a longer-life alternative.",
      reason:
        "Moderate buying gives you room to improve quality and product lifespan without heavy sacrifice.",
      successMetric: "One repeat category switched to longer-life options",
    });
  } else {
    actions.push({
      id: "maintain-minimal-shopping",
      category: "shopping",
      title: "Keep your consumption baseline",
      description:
        "Track replacement cycles so minimal buying stays easy over time.",
      annualSavingsKg: 90,
      difficulty: "Easy",
      timelineLabel: "Once this month",
      firstStep:
        "List the products most likely to trigger impulse replacement in the next month.",
      reason:
        "Your shopping baseline is already low, so the main goal is preventing avoidable rebound.",
      successMetric: "No unplanned replacements this month",
    });
  }

  const motivationBonus: Record<
    OnboardingData["motivation"],
    RecommendedAction
  > = {
    "shrink-footprint": {
      id: "focus-biggest-lever",
      category: topCategory,
      title: `Attack your biggest lever: ${CATEGORY_TITLES[topCategory]}`,
      description:
        "Start with the category driving the largest share of your current footprint.",
      annualSavingsKg: 300,
      difficulty: "Medium",
      timelineLabel: "First 14 days",
      firstStep:
        "Block time this week for the single action in your highest-impact category that feels most realistic.",
      reason:
        "You asked to shrink your footprint, so the fastest path is concentrating effort where the emissions are highest.",
      successMetric: `One committed improvement in ${CATEGORY_LABELS[topCategory]}`,
    },
    "lower-bills": {
      id: "bill-saving-stack",
      category: "home",
      title: "Stack bill-saving automations",
      description:
        "Schedule HVAC, water heating, chargers, and standby devices around real use.",
      annualSavingsKg: 300,
      difficulty: "Easy",
      timelineLabel: "This month",
      firstStep:
        "Audit your biggest always-on devices and set one schedule that saves both energy and money.",
      reason:
        "You care about lower bills, so home energy changes are the clearest double-win.",
      successMetric: "One visible drop in avoidable home energy use",
    },
    "travel-smarter": {
      id: "travel-budget",
      category: "travel",
      title: "Create a travel carbon budget",
      description:
        "Pre-plan annual trips so one high-impact journey does not surprise your footprint.",
      annualSavingsKg: 280,
      difficulty: "Medium",
      timelineLabel: "Before your next trip",
      firstStep:
        "Set an annual travel cap and decide which trip matters most before booking anything else.",
      reason:
        "You want travel to stay possible, just more intentional and less automatic.",
      successMetric: "A clear travel budget guiding the next booking",
    },
    "consume-less": {
      id: "consumption-budget",
      category: "shopping",
      title: "Set a monthly buying budget",
      description:
        "Use a simple purchase cap for discretionary items and delivery orders.",
      annualSavingsKg: 250,
      difficulty: "Easy",
      timelineLabel: "Starting this month",
      firstStep:
        "Set one realistic ceiling for discretionary spending or deliveries this month.",
      reason:
        "You want a lighter consumption routine, so purchase boundaries will keep progress visible.",
      successMetric: "A spending cap that stays intact for one month",
    },
  };

  actions.push(motivationBonus[data.motivation]);

  return actions
    .sort((a, b) => b.annualSavingsKg - a.annualSavingsKg)
    .slice(0, 4);
}

/**
 * Generates the user's Carbon Twin — a deterministic AI persona derived from
 * their onboarding answers.
 *
 * The twin name (e.g. `"Terra-Sage"`) is produced by hashing the user's choices,
 * ensuring the same inputs always produce the same twin. Personality archetype,
 * traits, and the opening narrative are also derived deterministically, with
 * Gemini AI optionally enriching the summary at display time.
 *
 * @param data - Complete onboarding data (all 8 signals)
 * @param breakdown - Per-category annual CO₂ emissions in kg
 * @param actions - Ranked recommended actions (the top action shapes the summary)
 * @returns A fully-populated {@link TwinProfile} ready to render on the reveal screen
 */
export function buildTwinProfile(
  data: OnboardingData,
  breakdown: CategoryBreakdown,
  actions: RecommendedAction[]
): TwinProfile {
  const hash = hashChoices(data);
  const prefix = NAME_PREFIXES[hash % NAME_PREFIXES.length];
  const suffix = NAME_SUFFIXES[(hash >> 3) % NAME_SUFFIXES.length];
  const focusCategory = dominantCategory(breakdown);
  const persona = PERSONALITIES[focusCategory];
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
  const vsAveragePct = Math.round(((annual - 4200) / 4200) * 100);

  return {
    name: `${prefix}-${suffix}`,
    ownerName,
    personality: persona.personality,
    archetype: persona.archetype,
    traits: traits.slice(0, 3),
    summary: buildSummary(
      data,
      annual,
      score,
      vsAveragePct,
      focusCategory,
      actions[0]
    ),
    avatarCode: `CT-${String((hash % 90) + 10)}`,
    dominantCategory: focusCategory,
    signal: `${CATEGORY_TITLES[focusCategory]} is the strongest signal in ${ownerName}'s profile`,
  };
}

/**
 * Builds the user's Carbon Profile — a structured assessment of strengths,
 * challenges, and category-level narrative generated from their footprint breakdown.
 *
 * The profile identifies the dominant emission category, surfaces the
 * sustainability strengths the user already demonstrates, and provides
 * a challenge statement for the highest-impact area to address next.
 *
 * @param data - Complete onboarding data
 * @param breakdown - Per-category annual CO₂ emissions in kg
 * @returns A {@link CarbonProfile} with strengths, challenges, and narrative fields
 */
export function buildCarbonProfile(
  data: OnboardingData,
  breakdown: CategoryBreakdown
): CarbonProfile {
  const focusCategory = dominantCategory(breakdown);

  const challenge: Record<CategoryKey, string> = {
    transport:
      data.transport === "car"
        ? "Driving is doing the most damage right now, so commuting choices will change your curve fastest."
        : "Transport is still your largest source, even with some low-carbon mobility already in place.",
    food:
      data.diet === "meat-heavy"
        ? "Food is your biggest challenge because meat-heavy meals add up quickly across the year."
        : "Food is your largest share, so small routine changes can produce steady wins.",
    home:
      data.homeEnergy === "high"
        ? "Home energy is your clearest controllable lever because your usage is on the high side."
        : "Home energy is leading your profile, so daily comfort habits matter more than one-off fixes.",
    travel:
      data.travel === "frequent"
        ? "Travel dominates your footprint, which means one better itinerary matters more than many tiny swaps."
        : "Travel still leads your profile, so keeping trips intentional is your biggest lever.",
    shopping:
      data.shopping === "frequent"
        ? "Shopping is a major signal for you, especially when purchases and deliveries become automatic."
        : "Shopping is your top lever, so durable and delayed purchases will compound well.",
  };

  const strongestHabit =
    data.transport === "walk" || data.transport === "bike"
      ? "Your transport choices already protect you from a major source of carbon."
      : data.diet === "vegan" || data.diet === "vegetarian"
        ? "Your diet is already doing meaningful climate work every week."
        : data.travel === "rare"
          ? "You avoid the hardest-to-reduce source by keeping travel rare."
          : data.shopping === "minimal"
            ? "Your shopping habits already prevent a lot of hidden embodied carbon."
            : "You have enough structure in your routine to improve without changing everything.";

  return {
    headline: `${CATEGORY_TITLES[focusCategory]} first, ${MOTIVATION_LABELS[data.motivation].toLowerCase()} second`,
    summary: `CarbonTwin sees a ${CATEGORY_LABELS[focusCategory]}-led profile for a ${HOUSEHOLD_LABELS[data.household].toLowerCase()} and will coach around ${MOTIVATION_FRAMES[data.motivation]}.`,
    topChallenge: challenge[focusCategory],
    strongestHabit,
    coachMode: `Coach mode: ${MOTIVATION_LABELS[data.motivation]}`,
    householdContext: `${HOUSEHOLD_LABELS[data.household]} with ${data.homeEnergy} home energy use.`,
  };
}

/**
 * Generates a set of personalised coaching insight cards shown on the
 * Dashboard Coach page.
 *
 * Each insight has a tone (`warning`, `encouraging`, or `tip`), a title,
 * a description, and an optional action call-to-action. The set always
 * includes a daily budget check, a top-action recommendation, and a
 * motivation-framed encouragement card. Gemini AI can optionally enrich
 * or replace these with a fully personalised coaching response.
 *
 * @param data - Complete onboarding data (motivation framing is used throughout)
 * @param annualKg - User's current annual CO₂ emissions in kilograms
 * @param dailyKg - User's current daily CO₂ equivalent in kilograms
 * @param dailyBudgetKg - The 1.5°C-aligned daily CO₂ budget per person (≈ 11.5 kg)
 * @param topCategory - The user's highest-emission category
 * @param topAction - The single highest-impact recommended action
 * @returns Array of {@link CoachingInsight} cards to display in the coach view
 */
export function buildCoachingInsights(
  data: OnboardingData,
  annualKg: number,
  dailyKg: number,
  dailyBudgetKg: number,
  topCategory: CategoryKey,
  topAction: RecommendedAction
): CoachingInsight[] {
  const overBudget = dailyKg > dailyBudgetKg;
  const difference = Math.abs(dailyKg - dailyBudgetKg).toFixed(1);

  return [
    {
      id: "today",
      tone: overBudget ? "warning" : "encouraging",
      title: overBudget ? "Today needs a reset" : "You are within reach",
      description: overBudget
        ? `Your current lifestyle maps to about ${difference} kg/day above the 4.2t path. Start with ${CATEGORY_LABELS[topCategory]} to bend that number first.`
        : `You are only ${difference} kg/day away from the 4.2t path. Protect your best habits and avoid rebound in ${CATEGORY_LABELS[topCategory]}.`,
      cta: overBudget
        ? `Use "${topAction.title}" as your first correction.`
        : "Lock in one repeatable low-carbon habit this week.",
    },
    {
      id: "friction",
      tone: "opportunity",
      title: "Remove the biggest friction",
      description: `Because you selected "${MOTIVATION_LABELS[data.motivation]}", the assistant will prioritize practical steps that feel realistic inside your current routine.`,
      cta: topAction.firstStep,
    },
    {
      id: "trajectory",
      tone: annualKg > 4200 ? "warning" : "encouraging",
      title: annualKg > 4200 ? "You have room to recover fast" : "You already have a strong base",
      description:
        annualKg > 4200
          ? `At ${formatTonnes(annualKg)}t/year, focused action in ${CATEGORY_LABELS[topCategory]} will create the fastest visible improvement.`
          : `At ${formatTonnes(annualKg)}t/year, your next gains come from consistency and better sequencing instead of drastic change.`,
      cta: topAction.successMetric,
    },
  ];
}
