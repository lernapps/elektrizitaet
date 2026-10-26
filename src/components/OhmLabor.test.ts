import { describe, expect, it } from "vite-plus/test";
import {
  about,
  check,
  describe as describeTask,
  generate,
  measure,
  mistakes,
  params,
  reason,
  show,
  solution,
  template,
  wrong,
} from "./OhmLabor.ts";

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

const texts = {
  task: "Der Widerstand im Kreis ist unbekannt.",
  decimal: ",",
  whyPoints: "Setze mindestens drei Messpunkte.",
  whyAnswer: "Trage den Widerstand ein.",
  whyValue: "Der Widerstand stimmt noch nicht.",
};
const props = { texts };

describe("reason", () => {
  const task = { ohm: 30 };
  const points = [3, 6, 9].map((v) => measure(task, v));
  it("names the mistake of a wrong answer, and none for a right one", () => {
    expect(reason(task, { points: points.slice(0, 2), ohm: 30 }, props)).toBe(texts.whyPoints);
    expect(reason(task, { points, ohm: null }, props)).toBe(texts.whyAnswer);
    expect(reason(task, { points, ohm: 20 }, props)).toBe(texts.whyValue);
    expect(reason(task, { points, ohm: 30 }, props)).toBeUndefined();
  });
});

describe("for a tutor", () => {
  it("gives the task without the resistor, which params hold hidden", () => {
    const task = generate(1);
    const text = template(props, "de");
    expect(text).toContain(texts.task);
    expect(text).not.toContain("{R}");
    expect(params(task, props, "de")).toEqual({ R: task.ohm });
    expect(text.replace(/\s+/g, " ")).toBe(describeTask(task, props, "de").task.replace(/\s+/g, " "));
  });
  it("has one answer for each typical mistake, which check rejects", () => {
    for (let seed = 0; seed < 50; seed++) {
      const task = generate(seed);
      const answers = mistakes(task);
      expect(answers).toHaveLength(about.mistakes.length);
      for (const answer of answers) if (answer !== undefined) expect(check(task, answer), `${seed}`).toBe(false);
    }
  });
  it("shows an answer as the learner gives it", () => {
    const task = { ohm: 50 };
    expect(show(solution(task), task, props, "de")).toBe("Messpunkte bei 3 V, 6 V und 9 V; R = 50 Ω");
    expect(show(mistakes(task)[2]!, task, props, "de")).toBe("Messpunkte bei 3 V, 6 V und 9 V; R = 0,02 Ω");
    expect(show({ points: [], ohm: null }, task, { texts: { ...texts, decimal: "." } }, "en")).toBe(
      "no measuring points; no resistance",
    );
  });
});
