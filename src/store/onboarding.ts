import { create } from "zustand";
import type { OnboardingData } from "@/types";

interface OnboardingStore {
  step: number;
  data: Partial<OnboardingData>;
  setStep: (step: number) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  data: {},
  setStep: (step) => set({ step }),
  updateData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
  reset: () => set({ step: 1, data: {} }),
}));
