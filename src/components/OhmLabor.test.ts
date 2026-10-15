import { describe, expect, it } from "vite-plus/test";
import { check, generate, measure, solution, wrong } from "./OhmLabor.ts";

describe("measure", () => {
  it("shows a point on a straight line through the origin", () => {
    const task = { ohm: 30 };
    expect(measure(task, 6).amps).toBeCloseTo(0.2, 9);
    expect(measure(task, 12).amps).toBeCloseTo(2 * measure(task, 6).amps, 9);
    expect(measure(task, 0).amps).toBe(0);
  });
});

describe("task", () => {
  it("is the same for the same seed and varies between seeds", () => {
    expect(generate(5)).toEqual(generate(5));
    expect(new Set(Array.from({ length: 40 }, (_, i) => generate(i).ohm)).size).toBeGreaterThan(3);
  });
  it("has a solution and none on the empty answer, for 300 seeds", () => {
    for (let seed = 0; seed < 300; seed++) {
      const task = generate(seed);
      expect(check(task, solution(task)), `${seed}`).toBe(true);
      expect(check(task, wrong(task)), `${seed}`).toBe(false);
    }
  });
  it("needs three different voltages above zero", () => {
    const task = { ohm: 30 };
    const points = [3, 3, 6].map((v) => measure(task, v));
    expect(check(task, { points, ohm: 30 })).toBe(false);
    expect(check(task, { points: [0, 3, 6].map((v) => measure(task, v)), ohm: 30 })).toBe(false);
    expect(check(task, { points: [3, 6, 9].map((v) => measure(task, v)), ohm: 30 })).toBe(true);
  });
  it("needs the right resistance", () => {
    const task = { ohm: 30 };
    const points = [3, 6, 9].map((v) => measure(task, v));
    expect(check(task, { points, ohm: 20 })).toBe(false);
    expect(check(task, { points, ohm: null })).toBe(false);
    expect(check(task, { points, ohm: 30.4 })).toBe(true);
  });
});
