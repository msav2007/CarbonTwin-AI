import { describe, it, expect } from "vitest";
import {
  TRANSPORT_OPTIONS,
  FOOD_OPTIONS,
  ENERGY_OPTIONS,
  HOUSEHOLD_OPTIONS,
  TRAVEL_OPTIONS,
  SHOPPING_OPTIONS,
  MOTIVATION_OPTIONS,
  STEP_META,
  IMPACT_COLORS,
  getOptionLabel,
} from "@/lib/onboarding/options";
import type { OnboardingOption } from "@/lib/onboarding/options";

function expectValidOption(opt: OnboardingOption) {
  expect(typeof opt.value).toBe("string");
  expect(opt.value.length).toBeGreaterThan(0);
  expect(typeof opt.label).toBe("string");
  expect(opt.label.length).toBeGreaterThan(0);
  expect(typeof opt.description).toBe("string");
  expect(["low", "medium", "high"]).toContain(opt.impact);
  expect(opt.icon).toBeDefined();
}

describe("TRANSPORT_OPTIONS", () => {
  it("has all required transport modes", () => {
    const values = TRANSPORT_OPTIONS.map((o) => o.value);
    expect(values).toContain("car");
    expect(values).toContain("mixed");
    expect(values).toContain("transit");
    expect(values).toContain("bike");
    expect(values).toContain("walk");
  });

  it("each option has required fields", () => {
    TRANSPORT_OPTIONS.forEach(expectValidOption);
  });

  it("car has high impact", () => {
    expect(TRANSPORT_OPTIONS.find((o) => o.value === "car")?.impact).toBe("high");
  });

  it("walk has low impact", () => {
    expect(TRANSPORT_OPTIONS.find((o) => o.value === "walk")?.impact).toBe("low");
  });
});

describe("FOOD_OPTIONS", () => {
  it("has all required diet modes", () => {
    const values = FOOD_OPTIONS.map((o) => o.value);
    expect(values).toContain("meat-heavy");
    expect(values).toContain("balanced");
    expect(values).toContain("vegetarian");
    expect(values).toContain("vegan");
  });

  it("each option has required fields", () => {
    FOOD_OPTIONS.forEach(expectValidOption);
  });

  it("meat-heavy has high impact", () => {
    expect(FOOD_OPTIONS.find((o) => o.value === "meat-heavy")?.impact).toBe("high");
  });

  it("vegan has low impact", () => {
    expect(FOOD_OPTIONS.find((o) => o.value === "vegan")?.impact).toBe("low");
  });
});

describe("ENERGY_OPTIONS", () => {
  it("has low, medium, high", () => {
    const values = ENERGY_OPTIONS.map((o) => o.value);
    expect(values).toContain("low");
    expect(values).toContain("medium");
    expect(values).toContain("high");
  });

  it("each option has required fields", () => {
    ENERGY_OPTIONS.forEach(expectValidOption);
  });
});

describe("HOUSEHOLD_OPTIONS", () => {
  it("has solo, couple, family", () => {
    const values = HOUSEHOLD_OPTIONS.map((o) => o.value);
    expect(values).toContain("solo");
    expect(values).toContain("couple");
    expect(values).toContain("family");
  });

  it("each option has required fields", () => {
    HOUSEHOLD_OPTIONS.forEach(expectValidOption);
  });
});

describe("TRAVEL_OPTIONS", () => {
  it("has rare, occasional, frequent", () => {
    const values = TRAVEL_OPTIONS.map((o) => o.value);
    expect(values).toContain("rare");
    expect(values).toContain("occasional");
    expect(values).toContain("frequent");
  });

  it("frequent has high impact", () => {
    expect(TRAVEL_OPTIONS.find((o) => o.value === "frequent")?.impact).toBe("high");
  });
});

describe("SHOPPING_OPTIONS", () => {
  it("has minimal, moderate, frequent", () => {
    const values = SHOPPING_OPTIONS.map((o) => o.value);
    expect(values).toContain("minimal");
    expect(values).toContain("moderate");
    expect(values).toContain("frequent");
  });
});

describe("MOTIVATION_OPTIONS", () => {
  it("has all four motivations", () => {
    const values = MOTIVATION_OPTIONS.map((o) => o.value);
    expect(values).toContain("shrink-footprint");
    expect(values).toContain("lower-bills");
    expect(values).toContain("travel-smarter");
    expect(values).toContain("consume-less");
  });

  it("each option has required fields", () => {
    MOTIVATION_OPTIONS.forEach(expectValidOption);
  });
});

describe("STEP_META", () => {
  it("has exactly 5 steps", () => {
    expect(STEP_META).toHaveLength(5);
  });

  it("steps have sequential ids 1-5", () => {
    STEP_META.forEach((step, i) => {
      expect(step.id).toBe(i + 1);
    });
  });

  it("each step has a title and subtitle", () => {
    STEP_META.forEach((step) => {
      expect(typeof step.title).toBe("string");
      expect(step.title.length).toBeGreaterThan(0);
      expect(typeof step.subtitle).toBe("string");
      expect(step.subtitle.length).toBeGreaterThan(0);
    });
  });
});

describe("IMPACT_COLORS", () => {
  it("has entries for all three impact levels", () => {
    expect(IMPACT_COLORS.low).toBeDefined();
    expect(IMPACT_COLORS.medium).toBeDefined();
    expect(IMPACT_COLORS.high).toBeDefined();
  });

  it("values are non-empty strings", () => {
    Object.values(IMPACT_COLORS).forEach((cls) => {
      expect(typeof cls).toBe("string");
      expect(cls.length).toBeGreaterThan(0);
    });
  });
});

describe("getOptionLabel", () => {
  it("returns the label for a valid transport value", () => {
    expect(getOptionLabel("transport", "car")).toBe(
      TRANSPORT_OPTIONS.find((o) => o.value === "car")?.label
    );
  });

  it("returns the label for a valid diet value", () => {
    expect(getOptionLabel("diet", "vegan")).toBe(
      FOOD_OPTIONS.find((o) => o.value === "vegan")?.label
    );
  });

  it("returns the label for homeEnergy", () => {
    expect(getOptionLabel("homeEnergy", "high")).toBe(
      ENERGY_OPTIONS.find((o) => o.value === "high")?.label
    );
  });

  it("returns the label for household", () => {
    expect(getOptionLabel("household", "family")).toBe(
      HOUSEHOLD_OPTIONS.find((o) => o.value === "family")?.label
    );
  });

  it("returns the label for travel", () => {
    expect(getOptionLabel("travel", "frequent")).toBe(
      TRAVEL_OPTIONS.find((o) => o.value === "frequent")?.label
    );
  });

  it("returns the label for shopping", () => {
    expect(getOptionLabel("shopping", "minimal")).toBe(
      SHOPPING_OPTIONS.find((o) => o.value === "minimal")?.label
    );
  });

  it("returns the label for motivation", () => {
    expect(getOptionLabel("motivation", "lower-bills")).toBe(
      MOTIVATION_OPTIONS.find((o) => o.value === "lower-bills")?.label
    );
  });

  it("falls back to the raw value when not found", () => {
    expect(getOptionLabel("transport", "unicycle" as never)).toBe("unicycle");
  });

  it("falls back when field is unknown", () => {
    expect(getOptionLabel("name" as never, "Alice")).toBe("Alice");
  });
});
