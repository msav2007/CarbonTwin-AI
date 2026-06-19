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
      partialize: (state) => ({
        step: state.step,
        data: state.data,
        result: state.result,
      }),
    }
  )
);
