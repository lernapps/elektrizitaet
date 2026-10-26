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
} from "./StromMessen.ts";

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

const texts = {
  task: "Die Batterie hat {U} V. Wähle den Widerstand so, dass es {T} A zeigt.",
  decimal: ",",
  whyAmmeter: "Es ist noch kein Amperemeter eingebaut.",
  whyShort: "Das ist ein Kurzschluss.",
  whyValue: "Das Amperemeter zeigt {v}, verlangt sind {T} A.",
};
const props = { texts };
/** A template with the values of params, as the learner reads them in German. */
const filled = (text: string, values: Record<string, number | string>) =>
  Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v).replace(".", ",")), text);

describe("reason", () => {
  it("names the mistake of a wrong answer, with the reading for a wrong resistor, and none for a right one", () => {
    const task = { volts: 12, target: 0.4, ohm: 30, start: 10 };
    expect(reason(task, { spot: null, ohm: 30 }, props)).toBe(texts.whyAmmeter);
    expect(reason(task, { spot: "par", ohm: 30 }, props)).toBe(texts.whyShort);
    expect(reason(task, { spot: "b", ohm: 20 }, props)).toBe("Das Amperemeter zeigt 0,6 A, verlangt sind 0,4 A.");
    expect(reason(task, { spot: "a", ohm: 30 }, props)).toBeUndefined();
  });
});

describe("for a tutor", () => {
  it("gives the task once, with the voltage and the target current of each number", () => {
    for (let seed = 0; seed < 20; seed++) {
      const task = generate(seed);
      const text = filled(template(props, "de"), params(task, props, "de"));
      expect(text.replace(/\s+/g, " ")).toBe(describeTask(task, props, "de").task.replace(/\s+/g, " "));
    }
  });
  it("has no single answer for any typical mistake", () => {
    expect(mistakes(generate(1))).toEqual(about.mistakes.map(() => undefined));
  });
  it("shows an answer as the learner gives it", () => {
    const task = generate(1);
    expect(show(solution(task), task, props, "de")).toBe(`Amperemeter an Stelle 1, Widerstand ${task.ohm} Ω`);
    expect(show(wrong(task), task, props, "en")).toBe(`no ammeter, resistor ${task.start} Ω`);
  });
});
