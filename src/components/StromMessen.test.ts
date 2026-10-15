import { describe, expect, it } from "vite-plus/test";
import { check, generate, measure, solution, wrong } from "./StromMessen.ts";

describe("measure", () => {
  it("shows the current of the loop in an ammeter in the wire", () => {
    expect(measure(12, { spot: "a", ohm: 30 }).ammeter).toBeCloseTo(0.4, 9);
    expect(measure(12, { spot: "b", ohm: 30 }).ammeter).toBeCloseTo(0.4, 9);
  });
  it("shows nothing for an ammeter across the source: a short circuit", () => {
    const reading = measure(12, { spot: "par", ohm: 30 });
    expect(reading.short).toBe(true);
    expect(reading.ammeter).toBeNull();
  });
  it("shows nothing without an ammeter", () => {
    expect(measure(12, { spot: null, ohm: 30 }).ammeter).toBeNull();
  });
});

describe("task", () => {
  it("is the same for the same seed and varies between seeds", () => {
    expect(generate(5)).toEqual(generate(5));
    expect(new Set(Array.from({ length: 40 }, (_, i) => JSON.stringify(generate(i)))).size).toBeGreaterThan(8);
  });
  it("has a solution and no answer in the start state, for 300 seeds", () => {
    for (let seed = 0; seed < 300; seed++) {
      const task = generate(seed);
      expect(check(task, solution(task)), `${seed}`).toBe(true);
      expect(check(task, wrong(task)), `${seed}`).toBe(false);
      expect(Math.abs(task.target * 1000 - Math.round(task.target * 1000))).toBeLessThan(1e-6);
    }
  });
  it("rejects the right resistor without an ammeter, and the ammeter across the source", () => {
    const task = generate(1);
    expect(check(task, { spot: null, ohm: task.ohm })).toBe(false);
    expect(check(task, { spot: "par", ohm: task.ohm })).toBe(false);
  });
  it("rejects the right place with the wrong resistor", () => {
    const task = generate(1);
    expect(check(task, { spot: "b", ohm: task.start })).toBe(false);
  });
});
