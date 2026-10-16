// Logic of the prediction exercise: predict what a meter will show in a series or a parallel circuit with two resistors,
// then switch on and read it.
import { fill, fmt, nice, pick, random, same } from "./Fluss.ts";

export type Kind = "reihe-strom" | "reihe-spannung" | "parallel-gesamt" | "parallel-zweig";
export const KINDS: readonly Kind[] = ["reihe-strom", "reihe-spannung", "parallel-gesamt", "parallel-zweig"];

export const STOCK: readonly number[] = [10, 20, 30, 50, 100];
export const VOLTAGES: readonly number[] = [6, 9, 12];

export interface Task {
  kind: Kind;
  volts: number;
  r1: number;
  r2: number;
  /** What the meter shows: amperes, or volts for `reihe-spannung`. */
  value: number;
}
export interface Answer {
  /** The value the learner predicted, null while none. */
  value: number | null;
}
export interface Props {
  kinds: Kind[];
}

export const unit = (kind: Kind): "A" | "V" => (kind === "reihe-spannung" ? "V" : "A");
export const decimals = (kind: Kind) => (kind === "reihe-spannung" ? 2 : 3);

/** What the meter of the kind shows. */
export function value(kind: Kind, volts: number, r1: number, r2: number): number {
  switch (kind) {
    case "reihe-strom":
      return volts / (r1 + r2);
    case "reihe-spannung":
      return (volts * r2) / (r1 + r2);
    case "parallel-gesamt":
      return volts / r1 + volts / r2;
    case "parallel-zweig":
      return volts / r2;
  }
}

/** The currents in the parallel circuit, in amperes. */
export const branches = (t: { volts: number; r1: number; r2: number }) => ({
  first: t.volts / t.r1,
  second: t.volts / t.r2,
});

export function generate(seed: number, props: Props = { kinds: [...KINDS] }): Task {
  const kinds = props.kinds.length > 0 ? props.kinds : [...KINDS];
  const kind = kinds[Math.abs(Math.trunc(seed)) % kinds.length]!;
  const rand = random(seed);
  for (;;) {
    const volts = pick(rand, VOLTAGES);
    const r1 = pick(rand, STOCK);
    const r2 = pick(rand, STOCK);
    const shown = value(kind, volts, r1, r2);
    if (nice(shown, decimals(kind)) && shown > 0 && (kind !== "reihe-spannung" || shown < volts)) {
      return { kind, volts, r1, r2, value: shown };
    }
  }
}

export const check = (task: Task, answer: Answer): boolean =>
  answer.value !== null && same(answer.value, task.value, decimals(task.kind));
export const solution = (task: Task): Answer => ({ value: task.value });
export const wrong = (_task: Task): Answer => ({ value: null });

export type Why = "empty" | "series" | "parallel" | "one" | "whole" | "half" | "other";

/** Why an answer is wrong, for the hint under the feedback: the typical mistake it matches; null when it is right. */
export function diagnose(task: Task, answer: Answer): Why | null {
  if (check(task, answer)) return null;
  if (answer.value === null) return "empty";
  const { volts: u, r1, r2 } = task;
  const is = (x: number) => same(answer.value!, x, decimals(task.kind));
  switch (task.kind) {
    case "reihe-strom":
      return is(u / r1) || is(u / r2) ? "one" : is(u / r1 + u / r2) ? "parallel" : "other";
    case "reihe-spannung":
      return is(u) ? "whole" : is(u / 2) ? "half" : "other";
    case "parallel-gesamt":
      return is(u / (r1 + r2)) ? "series" : is(u / r1) || is(u / r2) ? "one" : "other";
    case "parallel-zweig":
      return is(u / (r1 + r2)) ? "series" : is(u / r1) ? "one" : "other";
  }
}

interface DescribeProps {
  texts: Record<string, string>;
}
const WORDS: Record<string, { task: Record<Kind, string>; solution: Record<Kind, string> }> = {
  de: {
    task: {
      "reihe-strom":
        "Die Schaltung ist ausgeschaltet. Sag die Zahl vorher, schalte dann ein: Das Amperemeter sitzt im Kreis.",
      "reihe-spannung":
        "Die Schaltung ist ausgeschaltet. Sag die Zahl vorher, schalte dann ein: Das Voltmeter liegt am zweiten Widerstand.",
      "parallel-gesamt":
        "Die Schaltung ist ausgeschaltet. Sag die Zahl vorher, schalte dann ein: Das Amperemeter sitzt in der Hauptleitung.",
      "parallel-zweig":
        "Die Schaltung ist ausgeschaltet. Sag die Zahl vorher, schalte dann ein: Das Amperemeter sitzt im Zweig mit dem zweiten Widerstand.",
    },
    solution: {
      "reihe-strom":
        "Der Gesamtwiderstand ist {R1} Ω + {R2} Ω; der Strom ist {U} V : ({R1} + {R2}) Ω = {V} A, überall im Kreis.",
      "reihe-spannung": "Der Strom ist {U} V : ({R1} + {R2}) Ω; am zweiten Widerstand liegen {R2} Ω · Strom = {V} V.",
      "parallel-gesamt": "Jeder Zweig liegt an {U} V: {U} V : {R1} Ω + {U} V : {R2} Ω = {V} A in der Hauptleitung.",
      "parallel-zweig":
        "Der zweite Zweig liegt an {U} V: {U} V : {R2} Ω = {V} A. Der erste Widerstand ändert daran nichts.",
    },
  },
  en: {
    task: {
      "reihe-strom":
        "The circuit is switched off. Predict the number, then switch on: the ammeter sits in the circuit.",
      "reihe-spannung":
        "The circuit is switched off. Predict the number, then switch on: the voltmeter is across the second resistor.",
      "parallel-gesamt":
        "The circuit is switched off. Predict the number, then switch on: the ammeter sits in the main wire.",
      "parallel-zweig":
        "The circuit is switched off. Predict the number, then switch on: the ammeter sits in the branch with the second resistor.",
    },
    solution: {
      "reihe-strom":
        "The total resistance is {R1} Ω + {R2} Ω; the current is {U} V : ({R1} + {R2}) Ω = {V} A, everywhere in the circuit.",
      "reihe-spannung":
        "The current is {U} V : ({R1} + {R2}) Ω; across the second resistor there are {R2} Ω · current = {V} V.",
      "parallel-gesamt": "Each branch is across {U} V: {U} V : {R1} Ω + {U} V : {R2} Ω = {V} A in the main wire.",
      "parallel-zweig":
        "The second branch is across {U} V: {U} V : {R2} Ω = {V} A. The first resistor changes nothing about it.",
    },
  },
};

const TASK_KEYS: Record<Kind, string> = {
  "reihe-strom": "taskReiheStrom",
  "reihe-spannung": "taskReiheSpannung",
  "parallel-gesamt": "taskParallelGesamt",
  "parallel-zweig": "taskParallelZweig",
};

/** The task as the learner sees it, and its solution, in the language lang. */
export function describe(task: Task, props: DescribeProps, lang: string) {
  const words = WORDS[lang] ?? WORDS["de"]!;
  const sep = props.texts["decimal"]!;
  const values = {
    U: fmt(task.volts, 0, sep),
    R1: String(task.r1),
    R2: String(task.r2),
    V: fmt(task.value, decimals(task.kind), sep),
  };
  return {
    task: `${fill(props.texts[TASK_KEYS[task.kind]]!, values)}\n\n${words.task[task.kind]}`,
    solution: fill(words.solution[task.kind], values),
  };
}

export const about = {
  task: {
    de: "Du sagst vorher, was ein Messgerät in einer Reihen- oder Parallelschaltung mit zwei Widerständen zeigt, und schaltest dann ein.",
    en: "You predict what a meter shows in a series or parallel circuit with two resistors, and then switch on.",
  },
  answer: {
    de: "Eine Zahl: die Stromstärke in A oder die Spannung in V, je nach Aufgabe (mit Komma oder Punkt); dann „Prüfen“.",
    en: "A number: the current in A or the voltage in V, depending on the task (with comma or point); then “Check”.",
  },
  correct: {
    de: "Die Zahl stimmt auf drei Stellen (Ampere) beziehungsweise zwei Stellen (Volt) mit der Anzeige überein. Der Weg zur Zahl ist frei.",
    en: "The number matches the reading to three places (amperes) or two places (volts). The way to the number is free.",
  },
  mistakes: [
    {
      de: "Reihenschaltung: nur einen Widerstand benutzt (Spannung : R1), statt R1 und R2 zu addieren; oder die Zweigströme addiert wie bei einer Parallelschaltung.",
      en: "Series circuit: used only one resistor (voltage : R1) instead of adding R1 and R2; or added branch currents as in a parallel circuit.",
    },
    {
      de: "Teilspannung: die ganze Spannung genommen oder die Spannung zu gleichen Teilen geteilt, obwohl die Widerstände verschieden sind.",
      en: "Partial voltage: took the whole voltage or split it equally although the resistors differ.",
    },
    {
      de: "Parallelschaltung: wie eine Reihenschaltung gerechnet (Spannung : (R1 + R2)) oder nur einen Zweig betrachtet.",
      en: "Parallel circuit: calculated as a series circuit (voltage : (R1 + R2)) or looked at one branch only.",
    },
  ],
};
