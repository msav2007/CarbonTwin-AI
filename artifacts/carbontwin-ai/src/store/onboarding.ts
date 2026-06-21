import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CarbonResult } from "@/lib/carbon/types";
import type { OnboardingData } from "@/types";

/**
 * Shape of the onboarding Zustand store.
 * Persisted fields: `step`, `data`, `result` (schema version 2).
 * Non-persisted fields: `hasHydrated` (runtime flag only).
 */
interface OnboardingStore {
  /** True once the Zustand `persist` middleware has finished re-hydrating from localStorage. */
  hasHydrated: boolean;
  /** Current onboarding wizard step (1–5). Clamped to [1, 5] during migration. */
  step: number;
  /** Partially-completed onboarding form data collected across wizard steps. */
  data: Partial<OnboardingData>;
  /** Calculated carbon result, set after the user completes onboarding. `null` until then. */
  result: CarbonResult | null;
  /** Marks the store as fully hydrated from persistent storage. */
  setHasHydrated: (hasHydrated: boolean) => void;
  /** Advances or retreats to the given wizard step. */
  setStep: (step: number) => void;
  /** Merges partial onboarding data into the existing store (shallow merge). */
  updateData: (data: Partial<OnboardingData>) => void;
  /** Stores the completed carbon calculation result after onboarding finishes. */
  setResult: (result: CarbonResult) => void;
  /** Resets the store to its initial state (clears data and result, returns to step 1). */
  reset: () => void;
}

/**
 * Primary application store for onboarding state.
 *
 * Uses `zustand/middleware/persist` (schema v2) to survive page refreshes.
 * On schema mismatch, `migrate` clamps the step and clears the result to
 * avoid displaying stale carbon scores from a previous session's calculation.
 *
 * @example
 * const { step, updateData, setStep } = useOnboardingStore();
 */
export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasHydrated: false,
      step: 1,
      data: {},
      result: null,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setStep: (step) => set({ step }),
      updateData: (data) =>
        set((state) => ({ data: { ...state.data, ...data } })),
      setResult: (result) => set({ result }),
      reset: () => set({ step: 1, data: {}, result: null }),
    }),
    {
      name: "carbontwin-onboarding",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<OnboardingStore>;

        return {
          step: Math.min(Math.max(state.step ?? 1, 1), 5),
          data: state.data ?? {},
          result: null,
        };
      },
      partialize: (state) => ({
        step: state.step,
        data: state.data,
        result: state.result,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
