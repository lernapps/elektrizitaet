// Logic of the prediction exercise: predict what a meter will show in a series or a parallel circuit with two resistors,
// then switch on and read it. SchaltungVorhersage.vue is the input of the task; the explainer checks an answer with
// check and gives the message of reason. describe states a task and its solution, about what the exercise is; template,
// params, mistakes and show give a tutor the task once and each number's inputs and outputs.
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
  /** The value the learner predicted. */
  value: number;
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
  typeof answer.value === "number" && same(answer.value, task.value, decimals(task.kind));
export const solution = (task: Task): Answer => ({ value: task.value });
/** A wrong answer: 0, which no meter of a task shows. */
export const wrong = (_task: Task): Answer => ({ value: 0 });

/** The number typed, with a comma or a point; undefined while there is none. */
export function parse(typed: string): number | undefined {
  const text = typed.trim().replace(",", ".");
  const number = Number(text);
  return text === "" || Number.isNaN(number) ? undefined : number;
}

export type Why = "series" | "parallel" | "one" | "whole" | "half" | "other";

/** Why an answer is wrong, for the app's message: the typical mistake it matches; null when it is right. */
export function diagnose(task: Task, answer: Answer): Why | null {
  if (check(task, answer)) return null;
  if (typeof answer.value !== "number") return "other";
  const { volts: u, r1, r2 } = task;
  const is = (x: number) => same(answer.value, x, decimals(task.kind));
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

/** The app's message for a wrong answer, the text why… of the page for its mistake; undefined for a right one. */
export function reason(task: Task, answer: Answer, props: DescribeProps, _lang?: string): string | undefined {
  const why = diagnose(task, answer);
  if (why === null) return undefined;
  const key = {
    series: "whySeries",
    parallel: "whyParallel",
    one: "whyOne",
    whole: "whyWhole",
    half: "whyHalf",
    other: "whyOther",
  }[why];
  return props.texts[key];
}

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

interface TableProps {
  kinds: Kind[];
  texts: Record<string, string>;
}

/** The name of the input that holds the question of a task, in the language lang. */
const QUESTION: Record<string, string> = { de: "Frage", en: "question" };

/**
 * The texts of the kinds of the block, split for a tutor: the beginning all of them share, up to the end of a sentence
 * (the circuit, with {R1}, {R2} and {U}), and for each kind the rest (its question). With one kind the whole text is
 * shared.
 */
function shared(props: TableProps): { start: string; rest: (kind: Kind) => string } {
  const kinds = props.kinds.length > 0 ? props.kinds : [...KINDS];
  const texts = kinds.map((kind) => props.texts[TASK_KEYS[kind]]!.replace(/\s+/g, " ").trim());
  const whole = (kind: Kind) => props.texts[TASK_KEYS[kind]]!.replace(/\s+/g, " ").trim();
  if (new Set(texts).size === 1) return { start: texts[0]!, rest: () => "" };
  let common = 0;
  while (texts.every((text) => text[common] === texts[0]![common]) && common < texts[0]!.length) common++;
  const end = Math.max(texts[0]!.lastIndexOf(". ", common - 2), texts[0]!.lastIndexOf("? ", common - 2));
  const start = end < 0 ? "" : texts[0]!.slice(0, end + 2);
  return { start, rest: (kind) => whole(kind).slice(start.length) };
}

/** The values of a task's placeholders, as the learner reads them. */
const values = (task: Task, props: TableProps) => ({
  U: fmt(task.volts, 0, props.texts["decimal"]!),
  R1: String(task.r1),
  R2: String(task.r2),
});

/**
 * The task as a learner reads it: the circuit all kinds of the block share, with {R1}, {R2} and {U}, and {Frage} for
 * the question of the kind when the block has more than one.
 */
export function template(props: TableProps, lang: string): string {
  const { start, rest } = shared(props);
  const kinds = props.kinds.length > 0 ? props.kinds : [...KINDS];
  return rest(kinds[0]!) === "" ? start : `${start}{${QUESTION[lang] ?? QUESTION["de"]!}}`;
}

/** What sets a task: the placeholders of the shared circuit, and the question of its kind when there are several. */
export function params(task: Task, props: TableProps, lang: string): Record<string, number | string> {
  const { start, rest } = shared(props);
  const numbers = { U: task.volts, R1: task.r1, R2: task.r2 };
  const given: Record<string, number | string> = {};
  for (const [name, value] of Object.entries(numbers)) if (start.includes(`{${name}}`)) given[name] = value;
  const question = rest(task.kind);
  if (question !== "") given[QUESTION[lang] ?? QUESTION["de"]!] = fill(question, values(task, props));
  return given;
}

/**
 * The answer of each typical mistake of about.mistakes, for the kinds it is about: in series the current of the first
 * resistor alone (voltage : R1), the whole voltage for the partial voltage, in parallel the series current
 * (voltage : (R1 + R2)); none for the other kinds.
 */
export function mistakes(task: Task, _props?: TableProps): (Answer | undefined)[] {
  const { kind, volts: u, r1, r2 } = task;
  return [
    kind === "reihe-strom" ? { value: u / r1 } : undefined,
    kind === "reihe-spannung" ? { value: u } : undefined,
    kind === "parallel-gesamt" || kind === "parallel-zweig" ? { value: u / (r1 + r2) } : undefined,
  ];
}

/** An answer as the learner gives it: the number with the unit of the meter. */
export function show(answer: Answer, task: Task, props: TableProps, _lang: string): string {
  return `${fmt(answer.value, decimals(task.kind), props.texts["decimal"]!)} ${unit(task.kind)}`;
}

export const about = {
  task: {
    de: "Du sagst vorher, was ein Messgerät in einer Reihen- oder Parallelschaltung mit zwei Widerständen zeigt, und schaltest dann ein.",
    en: "You predict what a meter shows in a series or parallel circuit with two resistors, and then switch on.",
  },
  answer: {
    de: "Eine Zahl, ins Feld „Deine Vorhersage“ getippt: die Stromstärke in A oder die Spannung in V, je nach Aufgabe (mit Komma oder Punkt); dann „Prüfen“ unter dem Schaltbild. Ist die Vorhersage richtig, wird beim Prüfen eingeschaltet, und das Messgerät bestätigt sie; bei einer falschen bleibt der Stromkreis aus. Für eine neue Vorhersage „Neu anfangen“.",
    en: "A number, typed into the field “Your prediction”: the current in A or the voltage in V, depending on the task (with comma or point); then “Check” below the circuit. A right prediction switches on when checked, and the meter confirms it; after a wrong one the circuit stays off. For a new prediction “Start again”.",
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
