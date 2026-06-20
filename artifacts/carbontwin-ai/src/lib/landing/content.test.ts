import { describe, it, expect } from "vitest";
import {
  LIVE_FEATURES,
  LANDING_STATS,
  HOW_IT_WORKS_STEPS,
  DEMO_HIGHLIGHTS,
} from "@/lib/landing/content";

describe("LIVE_FEATURES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(LIVE_FEATURES)).toBe(true);
    expect(LIVE_FEATURES.length).toBeGreaterThan(0);
  });

  it("each feature has id, title, description, and icon", () => {
    LIVE_FEATURES.forEach((f) => {
      expect(typeof f.id).toBe("string");
      expect(typeof f.title).toBe("string");
      expect(typeof f.description).toBe("string");
      expect(typeof f.icon).toBe("string");
    });
  });
});

describe("LANDING_STATS", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(LANDING_STATS)).toBe(true);
    expect(LANDING_STATS.length).toBeGreaterThan(0);
  });

  it("each stat has a value and label", () => {
    LANDING_STATS.forEach((s) => {
      expect(s.value).toBeDefined();
      expect(s.label).toBeDefined();
    });
  });
});

describe("HOW_IT_WORKS_STEPS", () => {
  it("has at least 3 steps", () => {
    expect(HOW_IT_WORKS_STEPS.length).toBeGreaterThanOrEqual(3);
  });

  it("each step has a title and description", () => {
    HOW_IT_WORKS_STEPS.forEach((s) => {
      expect(typeof s.title).toBe("string");
      expect(typeof s.description).toBe("string");
    });
  });
});

describe("DEMO_HIGHLIGHTS", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(DEMO_HIGHLIGHTS)).toBe(true);
    expect(DEMO_HIGHLIGHTS.length).toBeGreaterThan(0);
  });

  it("each highlight has a title and detail", () => {
    DEMO_HIGHLIGHTS.forEach((h) => {
      expect(typeof h.title).toBe("string");
      expect(typeof h.detail).toBe("string");
    });
  });
});
