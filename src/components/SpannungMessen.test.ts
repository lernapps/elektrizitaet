import { describe, expect, it } from "vite-plus/test";
import { check, generate, measure, potentials, solution, wrong } from "./SpannungMessen.ts";

const t = { volts: 12, r1: 10, r2: 30 };

describe("potentials and measure", () => {
  it("lowers the voltage at each resistor by its share", () => {
    const p = potentials(t);
    expect(p.n0).toBe(12);
    expect(p.n1).toBeCloseTo(9, 9);
    expect(p.n2).toBe(0);
    expect(p.n3).toBe(0);
  });
  it("shows the share of a resistor, the whole voltage across both and nothing along a wire", () => {
    expect(measure(t, { from: "n0", to: "n1" })).toBeCloseTo(3, 9);
    expect(measure(t, { from: "n2", to: "n1" })).toBeCloseTo(9, 9);
    expect(measure(t, { from: "n0", to: "n2" })).toBeCloseTo(12, 9);
    expect(measure(t, { from: "n2", to: "n3" })).toBe(0);
  });
  it("shows nothing until both points are chosen", () => {
    expect(measure(t, { from: "n0", to: null })).toBeNull();
  });
});

describe("task", () => {
  it("is the same for the same seed and varies between seeds", () => {
    expect(generate(5)).toEqual(generate(5));
    expect(new Set(Array.from({ length: 60 }, (_, i) => JSON.stringify(generate(i)))).size).toBeGreaterThan(15);
  });
  it("has a solution, none on the empty answer and a round target, for 300 seeds", () => {
    for (let seed = 0; seed < 300; seed++) {
      const task = generate(seed);
      expect(check(task, solution(task)), `${seed}`).toBe(true);
      expect(check(task, wrong(task)), `${seed}`).toBe(false);
      expect(task.target).toBeLessThan(task.volts);
      expect(Math.abs(task.target * 100 - Math.round(task.target * 100))).toBeLessThan(1e-6);
    }
  });
  it("rejects the whole voltage and the wire", () => {
    const task = generate(1);
    expect(check(task, { from: "n0", to: "n2" })).toBe(false);
    expect(check(task, { from: "n2", to: "n3" })).toBe(false);
  });
  it("accepts the other pair of points that shows the same value", () => {
    const task = { volts: 12, r1: 20, r2: 20, target: 6, across: "r1" as const };
    expect(check(task, { from: "n1", to: "n3" })).toBe(true);
  });
});
