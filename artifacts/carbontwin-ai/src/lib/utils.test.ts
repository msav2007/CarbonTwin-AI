import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("returns a single class unchanged", () => {
    expect(cn("p-4")).toBe("p-4");
  });

  it("merges multiple class names with a space", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("drops falsy values", () => {
    const flag = false;
    expect(cn("a", flag && "b", undefined, null, "c")).toBe("a c");
  });

  it("deduplicates conflicting Tailwind utility classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional object syntax", () => {
    expect(cn({ "font-bold": true, italic: false })).toBe("font-bold");
  });

  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("trims and merges mixed conditional classes", () => {
    const active = true;
    const result = cn("base-class", active && "active", !active && "inactive");
    expect(result).toBe("base-class active");
  });
});
