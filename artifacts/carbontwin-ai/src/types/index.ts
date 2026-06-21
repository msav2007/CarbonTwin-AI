/**
 * @file Global TypeScript interfaces shared across the CarbonTwin application.
 *
 * `OnboardingData` is the canonical representation of a completed user profile.
 * It is the source of truth for all carbon calculations, twin generation,
 * simulation, and coaching logic in `src/lib/carbon/`.
 */

/**
 * The 8 lifestyle signals collected during the onboarding wizard.
 * All fields are required — `Partial<OnboardingData>` is used during
 * the wizard before the user has completed all steps.
 *
 * The literal union types for each field are intentionally narrow:
 * they map 1-to-1 with the emission factor lookup tables in
 * `src/lib/carbon/constants.ts`, making the type system enforce
 * that only valid emission-factor keys are ever used.
 */
export interface OnboardingData {
  /**
   * The user's display name, used to personalise coaching messages
   * and the Twin Reveal screen. Sanitised and validated by
   * `sanitizeNameInput` / `validateDisplayName` before storage.
   */
  name: string;
  /**
   * Primary mode of daily transport.
   * Emission range: 80 kg/yr (walk) – 3,200 kg/yr (car).
   */
  transport: "car" | "transit" | "bike" | "walk" | "mixed";
  /**
   * Dietary pattern.
   * Emission range: 800 kg/yr (vegan) – 2,800 kg/yr (meat-heavy).
   */
  diet: "meat-heavy" | "balanced" | "vegetarian" | "vegan";
  /**
   * Home energy usage level.
   * Emission range: 600 kg/yr (low) – 2,800 kg/yr (high),
   * then scaled by `HOUSEHOLD_HOME_MULTIPLIER`.
   */
  homeEnergy: "low" | "medium" | "high";
  /**
   * Number of people sharing the home's energy cost.
   * Used as a divisor multiplier for home energy emissions.
   * Multipliers: solo=1.0, couple=0.74, family=0.58.
   */
  household: "solo" | "couple" | "family";
  /**
   * Consumer spending / shopping intensity.
   * Emission range: 400 kg/yr (minimal) – 2,200 kg/yr (frequent).
   */
  shopping: "minimal" | "moderate" | "frequent";
  /**
   * Air travel frequency.
   * Emission range: 300 kg/yr (rare) – 3,500 kg/yr (frequent).
   */
  travel: "rare" | "occasional" | "frequent";
  /**
   * The user's stated primary motivation for reducing their footprint.
   * Used to personalise coaching tone and framing throughout the app.
   */
  motivation:
    | "shrink-footprint"
    | "lower-bills"
    | "travel-smarter"
    | "consume-less";
}
