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
