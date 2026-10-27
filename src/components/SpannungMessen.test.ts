import { describe, expect, it } from "vite-plus/test";
import {
  about,
  check,
  describe as describeTask,
  generate,
  measure,
  mistakes,
  params,
  potentials,
  reason,
  show,
  solution,
  template,
  wrong,
} from "./SpannungMessen.ts";

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

const texts = {
  task: "Die Batterie hat {U} V. Schließe das Voltmeter so an, dass es {T} V zeigt.",
  decimal: ",",
  whyPoints: "Das Voltmeter ist noch nicht an zwei Punkten angeschlossen.",
  whyWire: "Das Voltmeter zeigt 0 V.",
  whyValue: "Das Voltmeter zeigt {v}, verlangt sind {T} V.",
};
const props = { texts };
/** A template with the values of params, as the learner reads them in German. */
const filled = (text: string, values: Record<string, number | string>) =>
  Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v).replace(".", ",")), text);

describe("reason", () => {
  it("names the mistake of a wrong answer, with the reading for a wrong pair, and none for a right one", () => {
    const task = { volts: 12, r1: 10, r2: 30, target: 3, across: "r1" as const };
    expect(reason(task, { from: "n0", to: null }, props)).toBe(texts.whyPoints);
    expect(reason(task, { from: "n2", to: "n3" }, props)).toBe(texts.whyWire);
    expect(reason(task, { from: "n0", to: "n2" }, props)).toBe("Das Voltmeter zeigt 12 V, verlangt sind 3 V.");
    expect(reason(task, { from: "n1", to: "n0" }, props)).toBeUndefined();
  });
});

describe("for a tutor", () => {
  it("gives the task once, with the voltages and the resistors of each number", () => {
    for (let seed = 0; seed < 20; seed++) {
      const task = generate(seed);
      const text = filled(template(props, "de"), params(task, props, "de"));
      expect(text.replace(/\s+/g, " ")).toBe(describeTask(task, props, "de").task.replace(/\s+/g, " "));
    }
  });
  it("has one answer for each typical mistake, which check rejects", () => {
    for (let seed = 0; seed < 50; seed++) {
      const task = generate(seed);
      const answers = mistakes(task);
      expect(answers).toHaveLength(about.mistakes.length);
      for (const answer of answers) if (answer !== undefined) expect(check(task, answer), `${seed}`).toBe(false);
    }
  });
  it("shows an answer by the numbers of its points", () => {
    const task = generate(1);
    expect(show({ from: "n0", to: "n1" }, task, props, "de")).toBe("Punkt 1 und Punkt 2");
    expect(show({ from: "n2", to: null }, task, props, "de")).toBe("nur Punkt 3");
    expect(show(wrong(task), task, props, "en")).toBe("no point");
  });
});
