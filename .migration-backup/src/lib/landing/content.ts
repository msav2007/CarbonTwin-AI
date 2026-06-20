export const LIVE_FEATURES = [
  {
    id: "onboarding",
    title: "Personalized onboarding",
    description:
      "A focused five-step flow turns lifestyle choices into a usable carbon profile in under two minutes.",
    icon: "Sparkles",
  },
  {
    id: "profile",
    title: "Carbon profile generation",
    description:
      "CarbonTwin translates your transport, food, home, travel, and shopping signals into a real emissions breakdown.",
    icon: "Gauge",
  },
  {
    id: "reveal",
    title: "Twin reveal",
    description:
      "You get a named Carbon Twin, a clear score, dominant emission source, and a narrative summary grounded in your inputs.",
    icon: "MessageCircle",
  },
  {
    id: "coach",
    title: "Context-aware coaching",
    description:
      "Recommendations adapt to your goal, highest-impact category, and current carbon budget instead of using generic climate tips.",
    icon: "TrendingUp",
  },
  {
    id: "simulation",
    title: "Future impact simulation",
    description:
      "Steady and ambitious scenarios forecast how your footprint changes over 1, 5, and 10 years.",
    icon: "Clock",
  },
  {
    id: "actions",
    title: "Action plan dashboard",
    description:
      "Every suggestion includes why it matters, the next step to take, and the estimated annual CO2 reduction.",
    icon: "Leaf",
  },
] as const;

export const LANDING_STATS = [
  {
    label: "Lifestyle signals",
    value: "8",
    context: "Used to build the twin",
  },
  {
    label: "Priority actions",
    value: "4",
    context: "Ranked by impact and effort",
  },
  {
    label: "Future horizons",
    value: "3",
    context: "1, 5, and 10 years",
  },
  {
    label: "Carbon budget view",
    value: "Daily",
    context: "Tracked from your profile",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Map the lifestyle you live today",
    description:
      "Transport, food, home energy, travel, and shopping habits become the signal set for your carbon profile.",
    tag: "Input",
    outcome: "Personal baseline created",
  },
  {
    step: "02",
    title: "Reveal a twin built from your choices",
    description:
      "CarbonTwin names your profile, scores the footprint, and highlights the dominant emissions category.",
    tag: "Reveal",
    outcome: "Twin + score + top lever",
  },
  {
    step: "03",
    title: "Simulate future impact",
    description:
      "See what changes if you follow a steady plan or push harder with an ambitious reduction path.",
    tag: "Forecast",
    outcome: "1, 5, 10 year outlook",
  },
  {
    step: "04",
    title: "Act on the next best move",
    description:
      "Recommendations show why they matter, how to start, and how much CO2 they can realistically save.",
    tag: "Action",
    outcome: "Prioritized plan you can use",
    outcomeSuccess: true,
  },
] as const;

export const DEMO_HIGHLIGHTS = [
  {
    title: "Guided onboarding",
    detail: "Five signal groups with live footprint calibration",
  },
  {
    title: "Twin reveal",
    detail: "Named assistant, score, breakdown, and profile summary",
  },
  {
    title: "Carbon coaching",
    detail: "Goal-aware advice based on your current habits",
  },
  {
    title: "Future simulator",
    detail: "Steady vs ambitious reduction scenarios",
  },
  {
    title: "Action queue",
    detail: "Four ranked moves with savings, first step, and success metric",
  },
  {
    title: "Budget tracker",
    detail: "Daily carbon target translated from annual footprint",
  },
] as const;
