import { describe, expect, it } from "vite-plus/test";
import { KINDS, check, generate, solution, value, wrong, type Kind } from "./SchaltungVorhersage.ts";

describe("value", () => {
  it("is the series current, the share of the second resistor, the total and the branch current", () => {
    expect(value("reihe-strom", 12, 10, 30)).toBeCloseTo(0.3, 9);
    expect(value("reihe-spannung", 12, 10, 30)).toBeCloseTo(9, 9);
    expect(value("parallel-gesamt", 12, 20, 30)).toBeCloseTo(1, 9);
    expect(value("parallel-zweig", 12, 20, 30)).toBeCloseTo(0.4, 9);
  });
});

describe("task", () => {
  it("is the same for the same seed, draws the kinds in turn and copes with none", () => {
    expect(generate(5)).toEqual(generate(5));
    expect(new Set([0, 1, 2, 3].map((seed) => generate(seed, { kinds: [...KINDS] }).kind)).size).toBe(4);
    expect(generate(2, { kinds: [] }).kind).toBe(KINDS[2]);
  });
  it("varies the values from seed to seed", () => {
    for (const kind of KINDS) {
      const seen = new Set(Array.from({ length: 60 }, (_, i) => JSON.stringify(generate(i, { kinds: [kind] }))));
      expect(seen.size, kind).toBeGreaterThan(8);
    }
  });
  it("has a solution, none on the empty answer and a round value, for 300 seeds of each kind", () => {
    for (const kind of KINDS as Kind[])
      for (let seed = 0; seed < 300; seed++) {
        const task = generate(seed, { kinds: [kind] });
        expect(check(task, solution(task)), `${kind} ${seed}`).toBe(true);
        expect(check(task, wrong(task)), `${kind} ${seed}`).toBe(false);
        const digits = kind === "reihe-spannung" ? 2 : 3;
        expect(Math.abs(task.value * 10 ** digits - Math.round(task.value * 10 ** digits))).toBeLessThan(1e-6);
      }
  });
  it("rejects the mistakes it teaches: the current of one resistor, and the sum in the series", () => {
    const task = { kind: "reihe-strom" as const, volts: 12, r1: 10, r2: 30, value: 0.3 };
    expect(check(task, { value: 12 / 10 })).toBe(false);
    expect(check(task, { value: 12 / 10 + 12 / 30 })).toBe(false);
    expect(check({ ...task, kind: "parallel-gesamt", value: 1.6 }, { value: 12 / 40 })).toBe(false);
  });
});
