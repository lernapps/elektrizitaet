import { describe, expect, it } from "vite-plus/test";
import { check, current, generate, resistance, solution, wrong } from "./DrahtLabor.ts";

describe("wire", () => {
  it("has the larger resistance the longer and the thinner it is", () => {
    expect(resistance(2, 2)).toBeCloseTo(2 * resistance(1, 2), 9);
    expect(resistance(2, 4)).toBeCloseTo(resistance(2, 2) / 2, 9);
  });
  it("carries the smaller current the larger the resistance is", () => {
    expect(current(1, 5)).toBeGreaterThan(current(2, 5));
    expect(current(3, 5)).toBeGreaterThan(current(3, 2));
  });
});

describe("task", () => {
  it("is the same for the same seed and varies between seeds", () => {
    expect(generate(5)).toEqual(generate(5));
    expect(new Set(Array.from({ length: 60 }, (_, i) => JSON.stringify(generate(i)))).size).toBeGreaterThan(8);
  });
  it("has a solution, none in the start state, for 300 seeds", () => {
    for (let seed = 0; seed < 300; seed++) {
      const task = generate(seed);
      expect(check(task, solution(task)), `${seed}`).toBe(true);
      expect(check(task, wrong(task)), `${seed}`).toBe(false);
    }
  });
  it("accepts any wire with at least the factor, and not one with less", () => {
    const task = { length: 4, tenths: 2, factor: 2 };
    expect(check(task, { length: 2, tenths: 2 })).toBe(true);
    expect(check(task, { length: 4, tenths: 4 })).toBe(true);
    expect(check(task, { length: 3, tenths: 2 })).toBe(false);
    expect(check(task, { length: 5, tenths: 5 })).toBe(true);
  });
});
