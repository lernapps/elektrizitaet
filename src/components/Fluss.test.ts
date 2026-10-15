import { describe, expect, it } from "vite-plus/test";
import { fill, flow, fmt, nice, pick, random, round, same } from "./Fluss.ts";

describe("flow", () => {
  it("lays the dots closer and runs them faster for a larger current", () => {
    const small = flow(0.1, 1);
    const large = flow(1, 1);
    expect(large.gap).toBeLessThan(small.gap);
    expect(large.seconds).toBeLessThan(small.seconds * 5);
    expect(large.gap).toBeGreaterThan(0);
  });
  it("keeps the look within its bounds for currents beyond the scale", () => {
    expect(flow(50, 1)).toEqual(flow(1, 1));
    expect(flow(-1, 1)).toEqual(flow(0, 1));
  });
});

describe("random", () => {
  it("gives the same numbers for the same seed and others for another", () => {
    expect(random(3)()).toBe(random(3)());
    expect(random(3)()).not.toBe(random(4)());
  });
  it("picks from the list", () => {
    expect([10, 20, 30]).toContain(pick(random(1), [10, 20, 30]));
  });
});

describe("numbers", () => {
  it("rounds and compares as the display does", () => {
    expect(round(0.12345, 3)).toBe(0.123);
    expect(same(0.4, 0.4004, 3)).toBe(true);
    expect(same(0.4, 0.41, 3)).toBe(false);
    expect(nice(0.24, 3)).toBe(true);
    expect(nice(1 / 3, 3)).toBe(false);
  });
  it("writes the decimal separator of the language and no trailing zeros", () => {
    expect(fmt(0.4, 3, ",")).toBe("0,4");
    expect(fmt(12, 0, ".")).toBe("12");
  });
  it("fills the placeholders of a text", () => {
    expect(fill("{n} Ω und {n} V", { n: "5" })).toBe("5 Ω und 5 V");
  });
});
