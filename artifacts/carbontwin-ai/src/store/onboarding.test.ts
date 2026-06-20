import { describe, it, expect, beforeEach } from "vitest";
import { useOnboardingStore } from "@/store/onboarding";
import type { CarbonResult } from "@/lib/carbon/types";

const MOCK_RESULT = {
  annualKg: 5000,
  carbonScore: 42,
} as unknown as CarbonResult;

describe("onboarding store", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  describe("initial state after reset", () => {
    it("step defaults to 1", () => {
      expect(useOnboardingStore.getState().step).toBe(1);
    });

    it("data defaults to empty object", () => {
      expect(useOnboardingStore.getState().data).toEqual({});
    });

    it("result defaults to null", () => {
      expect(useOnboardingStore.getState().result).toBeNull();
    });
  });

  describe("setStep", () => {
    it("updates step to the given value", () => {
      useOnboardingStore.getState().setStep(3);
      expect(useOnboardingStore.getState().step).toBe(3);
    });

    it("can set step to 5", () => {
      useOnboardingStore.getState().setStep(5);
      expect(useOnboardingStore.getState().step).toBe(5);
    });

    it("can set step back to 1", () => {
      useOnboardingStore.getState().setStep(4);
      useOnboardingStore.getState().setStep(1);
      expect(useOnboardingStore.getState().step).toBe(1);
    });
  });

  describe("updateData", () => {
    it("merges partial data into existing data", () => {
      useOnboardingStore.getState().updateData({ transport: "bike" });
      expect(useOnboardingStore.getState().data.transport).toBe("bike");
    });

    it("preserves existing data when adding new fields", () => {
      useOnboardingStore.getState().updateData({ transport: "transit" });
      useOnboardingStore.getState().updateData({ diet: "vegan" });
      const data = useOnboardingStore.getState().data;
      expect(data.transport).toBe("transit");
      expect(data.diet).toBe("vegan");
    });

    it("overwrites a field that already exists", () => {
      useOnboardingStore.getState().updateData({ transport: "car" });
      useOnboardingStore.getState().updateData({ transport: "bike" });
      expect(useOnboardingStore.getState().data.transport).toBe("bike");
    });

    it("can update multiple fields in one call", () => {
      useOnboardingStore.getState().updateData({ transport: "walk", diet: "vegan" });
      const data = useOnboardingStore.getState().data;
      expect(data.transport).toBe("walk");
      expect(data.diet).toBe("vegan");
    });
  });

  describe("setResult", () => {
    it("stores the carbon result", () => {
      useOnboardingStore.getState().setResult(MOCK_RESULT);
      expect(useOnboardingStore.getState().result).toBe(MOCK_RESULT);
    });

    it("result remains after subsequent data updates", () => {
      useOnboardingStore.getState().setResult(MOCK_RESULT);
      useOnboardingStore.getState().updateData({ transport: "car" });
      expect(useOnboardingStore.getState().result).toBe(MOCK_RESULT);
    });
  });

  describe("setHasHydrated", () => {
    it("sets hasHydrated to true", () => {
      useOnboardingStore.getState().setHasHydrated(true);
      expect(useOnboardingStore.getState().hasHydrated).toBe(true);
    });

    it("sets hasHydrated to false", () => {
      useOnboardingStore.getState().setHasHydrated(true);
      useOnboardingStore.getState().setHasHydrated(false);
      expect(useOnboardingStore.getState().hasHydrated).toBe(false);
    });
  });

  describe("reset", () => {
    it("resets step to 1", () => {
      useOnboardingStore.getState().setStep(4);
      useOnboardingStore.getState().reset();
      expect(useOnboardingStore.getState().step).toBe(1);
    });

    it("resets data to empty object", () => {
      useOnboardingStore.getState().updateData({ transport: "car", diet: "vegan" });
      useOnboardingStore.getState().reset();
      expect(useOnboardingStore.getState().data).toEqual({});
    });

    it("resets result to null", () => {
      useOnboardingStore.getState().setResult(MOCK_RESULT);
      useOnboardingStore.getState().reset();
      expect(useOnboardingStore.getState().result).toBeNull();
    });

    it("can be called multiple times without error", () => {
      useOnboardingStore.getState().reset();
      useOnboardingStore.getState().reset();
      expect(useOnboardingStore.getState().step).toBe(1);
    });
  });

  describe("state isolation between operations", () => {
    it("updateData does not affect step", () => {
      useOnboardingStore.getState().setStep(3);
      useOnboardingStore.getState().updateData({ transport: "bike" });
      expect(useOnboardingStore.getState().step).toBe(3);
    });

    it("setResult does not affect step or data", () => {
      useOnboardingStore.getState().setStep(2);
      useOnboardingStore.getState().updateData({ transport: "car" });
      useOnboardingStore.getState().setResult(MOCK_RESULT);
      expect(useOnboardingStore.getState().step).toBe(2);
      expect(useOnboardingStore.getState().data.transport).toBe("car");
    });
  });
});
