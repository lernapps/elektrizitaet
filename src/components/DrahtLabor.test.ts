import { describe, expect, it } from "vite-plus/test";
import {
  about,
  check,
  current,
  describe as describeTask,
  generate,
  mistakes,
  params,
  reason,
  resistance,
  show,
  solution,
  template,
  wrong,
} from "./DrahtLabor.ts";

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

const texts = {
  task: "Am Anfang zeigt das Amperemeter {I} A. Stelle den Draht so ein, dass es mindestens {K}-mal so viel zeigt.",
  decimal: ",",
  whySame: "Du hast noch nichts verändert.",
  whyLess: "Der Strom ist erst das {X}-Fache, verlangt ist mindestens das {K}-Fache.",
};
const props = { texts };
/** A template with the values of params, as the learner reads them in German. */
const filled = (text: string, values: Record<string, number | string>) =>
  Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v).replace(".", ",")), text);

describe("reason", () => {
  it("names the start wire, gives the factor reached for too little, and none for a right answer", () => {
    const task = { length: 4, tenths: 2, factor: 3 };
    expect(reason(task, wrong(task), props)).toBe(texts.whySame);
    expect(reason(task, { length: 2, tenths: 2 }, props)).toBe(
      "Der Strom ist erst das 2-Fache, verlangt ist mindestens das 3-Fache.",
    );
    expect(reason(task, solution(task), props)).toBeUndefined();
  });
});

describe("for a tutor", () => {
  it("gives the task once, with the start current, the factor and the start wire of each number", () => {
    for (let seed = 0; seed < 20; seed++) {
      const task = generate(seed);
      const text = filled(template(props, "de"), params(task, props, "de"));
      expect(text.replace(/\s+/g, " ")).toBe(describeTask(task, props, "de").task.replace(/\s+/g, " "));
    }
  });
  it("has the start wire for the first typical mistake, which check rejects", () => {
    const task = generate(1);
    const answers = mistakes(task);
    expect(answers).toHaveLength(about.mistakes.length);
    expect(answers[0]).toEqual(wrong(task));
    expect(check(task, answers[0]!)).toBe(false);
  });
  it("shows a wire as the learner sets it", () => {
    const task = generate(1);
    expect(show(solution(task), task, props, "de")).toBe("1 m lang, 0,5 mm² dick");
    expect(show({ length: 3, tenths: 2 }, task, { texts: { ...texts, decimal: "." } }, "en")).toBe(
      "3 m long, 0.2 mm² thick",
    );
  });
});
