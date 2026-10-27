import { describe, expect, it } from "vite-plus/test";
import {
  KINDS,
  about,
  check,
  generate,
  mistakes,
  params,
  parse,
  reason,
  show,
  solution,
  template,
  value,
  wrong,
  type Kind,
} from "./SchaltungVorhersage.ts";

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

const texts = {
  decimal: ",",
  taskReiheStrom: "Zwei Widerstände von {R1} Ω und {R2} Ω liegen in Reihe an {U} V. Was zeigt das Amperemeter?",
  taskReiheSpannung:
    "Zwei Widerstände von {R1} Ω und {R2} Ω liegen in Reihe an {U} V. Was zeigt das Voltmeter am zweiten Widerstand ({R2} Ω)?",
  taskParallelGesamt: "Zwei Widerstände von {R1} Ω und {R2} Ω liegen parallel an {U} V. Was zeigt das Amperemeter?",
  taskParallelZweig: "Zwei Widerstände von {R1} Ω und {R2} Ω liegen parallel an {U} V. Was zeigt es im Zweig?",
  whySeries: "series",
  whyParallel: "parallel",
  whyOne: "one",
  whyWhole: "whole",
  whyHalf: "half",
  whyOther: "other",
};
const series = { kinds: ["reihe-strom", "reihe-spannung"] as Kind[], texts };

describe("parse", () => {
  it("reads the number typed, with a comma or a point; none while the field is empty or no number", () => {
    expect(parse(" 0,3 ")).toBe(0.3);
    expect(parse("9.5")).toBe(9.5);
    expect(parse("")).toBeUndefined();
    expect(parse("neun")).toBeUndefined();
  });
});

describe("reason", () => {
  it("names the typical mistake a wrong number matches, and none for a right one", () => {
    const task = { kind: "reihe-strom" as const, volts: 12, r1: 10, r2: 30, value: 0.3 };
    expect(reason(task, { value: 1.2 }, series)).toBe("one");
    expect(reason(task, { value: 1.6 }, series)).toBe("parallel");
    expect(reason(task, { value: 7 }, series)).toBe("other");
    expect(reason(task, { value: 0.3 }, series)).toBeUndefined();
    const share = { kind: "reihe-spannung" as const, volts: 12, r1: 10, r2: 30, value: 9 };
    expect(reason(share, { value: 12 }, series)).toBe("whole");
    expect(reason(share, { value: 6 }, series)).toBe("half");
  });
});

describe("for a tutor", () => {
  it("gives the circuit the kinds share once, and the question of each number's kind", () => {
    expect(template(series, "de")).toBe("Zwei Widerstände von {R1} Ω und {R2} Ω liegen in Reihe an {U} V. {Frage}");
    const task = generate(1, series);
    expect(task.kind).toBe("reihe-spannung");
    expect(params(task, series, "de")).toEqual({
      R1: task.r1,
      R2: task.r2,
      U: task.volts,
      Frage: `Was zeigt das Voltmeter am zweiten Widerstand (${task.r2} Ω)?`,
    });
  });
  it("gives the whole text for a block with one kind", () => {
    const one = { kinds: ["reihe-strom"] as Kind[], texts };
    expect(template(one, "de")).toBe(texts.taskReiheStrom);
    expect(Object.keys(params(generate(1, one), one, "de"))).toEqual(["U", "R1", "R2"]);
  });
  it("has one answer for each typical mistake of the kind, which check rejects", () => {
    for (const kind of KINDS)
      for (let seed = 0; seed < 50; seed++) {
        const task = generate(seed, { kinds: [kind] });
        const answers = mistakes(task);
        expect(answers).toHaveLength(about.mistakes.length);
        expect(answers.filter((answer) => answer !== undefined)).toHaveLength(1);
        for (const answer of answers) if (answer !== undefined) expect(check(task, answer), `${seed}`).toBe(false);
      }
  });
  it("shows a number with the unit of the meter", () => {
    const task = { kind: "reihe-strom" as const, volts: 12, r1: 10, r2: 30, value: 0.3 };
    expect(show(solution(task), task, series, "de")).toBe("0,3 A");
    expect(show(mistakes(task)[0]!, task, series, "de")).toBe("1,2 A");
    expect(show({ value: 9 }, { ...task, kind: "reihe-spannung", value: 9 }, series, "de")).toBe("9 V");
  });
});
