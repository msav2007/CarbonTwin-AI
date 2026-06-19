import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CarbonResult } from "@/lib/carbon/calculator";
import type { OnboardingData } from "@/types";

interface OnboardingStore {
  step: number;
  data: Partial<OnboardingData>;
  result: CarbonResult | null;
  setStep: (step: number) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  setResult: (result: CarbonResult) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      result: null,
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
    }
  )
);
