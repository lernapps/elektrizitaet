// Logic of the current exercise: build an ammeter into the circuit at the right place and choose the resistor that
// gives the target current. StromMessen.vue is the input of the task; the explainer checks an answer with check and
// gives the message of reason. describe states a task and its solution, about what the exercise is; template, params,
// mistakes and show give a tutor the task once and each number's inputs and outputs.
import { fill, fmt, nice, pick, random, round, same } from "./Fluss.ts";

/** Where the learner built the ammeter in: the top wire (a), the bottom wire (b), across the source (par) or nowhere. */
export type Spot = "a" | "b" | "par" | null;
export const SPOTS: readonly Exclude<Spot, null>[] = ["a", "b", "par"];

export const STOCK: readonly number[] = [10, 20, 30, 50, 100];
export const VOLTAGES: readonly number[] = [6, 9, 12];

export interface Task {
  volts: number;
  /** The current to reach, in amperes. */
  target: number;
  /** The resistor that reaches it, in ohms. */
  ohm: number;
  /** The resistor the board starts with. */
  start: number;
}
export interface Answer {
  spot: Spot;
  ohm: number;
}

/** The task of a seed: a source and the resistor that gives a round current. */
export function generate(seed: number, _props: object = {}): Task {
  const rand = random(seed);
  for (;;) {
    const volts = pick(rand, VOLTAGES);
    const ohm = pick(rand, STOCK);
    const start = pick(rand, STOCK);
    const target = volts / ohm;
    if (start !== ohm && nice(target, 3)) return { volts, target, ohm, start };
  }
}

export interface Reading {
  /** The ammeter bridges the source: the current is not defined. */
  short: boolean;
  /** The current through the resistor in amperes. */
  loop: number;
  /** What the ammeter shows, null without an ammeter or with a short circuit. */
  ammeter: number | null;
}

export function measure(volts: number, answer: Answer): Reading {
  const short = answer.spot === "par";
  const loop = short ? 0 : volts / answer.ohm;
  return { short, loop, ammeter: answer.spot === "a" || answer.spot === "b" ? loop : null };
}

/** Whether the ammeter sits in the circuit and shows the target. */
export function check(task: Task, answer: Answer): boolean {
  const reading = measure(task.volts, answer);
  return reading.ammeter !== null && same(reading.ammeter, task.target, 3);
}

export const solution = (task: Task): Answer => ({ spot: "a", ohm: task.ohm });
export const wrong = (task: Task): Answer => ({ spot: null, ohm: task.start });

/** Why an answer is wrong, for the app's message; null when it is right. */
export function diagnose(task: Task, answer: Answer): "ammeter" | "short" | "value" | null {
  if (check(task, answer)) return null;
  if (answer.spot === null) return "ammeter";
  if (answer.spot === "par") return "short";
  return "value";
}

interface DescribeProps {
  texts: Record<string, string>;
}

/** The app's message for a wrong answer, the text why… of the page for its mistake; undefined for a right one. */
export function reason(task: Task, answer: Answer, props: DescribeProps, _lang?: string): string | undefined {
  const why = diagnose(task, answer);
  const t = props.texts;
  if (why === null) return undefined;
  if (why === "value") {
    const sep = t["decimal"]!;
    const shown = measure(task.volts, answer).ammeter;
    return fill(t["whyValue"]!, { v: `${shown === null ? "" : fmt(shown, 3, sep)} A`, T: fmt(task.target, 3, sep) });
  }
  return why === "ammeter" ? t["whyAmmeter"] : t["whyShort"];
}
const WORDS: Record<string, { places: string; solution: string }> = {
  de: {
    places:
      "Das Amperemeter lässt sich an drei Stellen einbauen: 1 obere Leitung, 2 untere Leitung, 3 quer über der Batterie. Der Widerstand ist 10, 20, 30, 50 oder 100 Ω.",
    solution:
      "Das Amperemeter in die obere oder untere Leitung (Stelle 1 oder 2), nie quer über die Batterie, und ein Widerstand von {R} Ω, denn {U} V : {R} Ω = {T} A.",
  },
  en: {
    places:
      "The ammeter can be built in at three places: 1 top wire, 2 bottom wire, 3 straight across the battery. The resistor is 10, 20, 30, 50 or 100 Ω.",
    solution:
      "The ammeter in the top or bottom wire (place 1 or 2), never straight across the battery, and a resistor of {R} Ω, because {U} V : {R} Ω = {T} A.",
  },
};

/** The task as the learner sees it, and its solution, in the language lang. */
export function describe(task: Task, props: DescribeProps, lang: string) {
  const words = WORDS[lang] ?? WORDS["de"]!;
  const sep = props.texts["decimal"]!;
  const values = { U: fmt(task.volts, 0, sep), T: fmt(task.target, 3, sep), R: String(task.ohm) };
  return {
    task: `${fill(props.texts["task"]!, values)}\n\n${words.places}`,
    solution: fill(words.solution, values),
  };
}

const SHOW: Record<string, { at: string; none: string; resistor: string }> = {
  de: { at: "Amperemeter an Stelle {n}", none: "kein Amperemeter", resistor: "Widerstand {R} Ω" },
  en: { at: "ammeter at place {n}", none: "no ammeter", resistor: "resistor {R} Ω" },
};

/** The task as a learner reads it, with {U} and {T}: the prop task and the places of the board. */
export function template(props: DescribeProps, lang: string): string {
  return `${props.texts["task"]!} ${(WORDS[lang] ?? WORDS["de"]!).places}`;
}

/** What sets a task: the voltage of the battery and the current to reach. */
export function params(task: Task, _props: DescribeProps, _lang: string): Record<string, number> {
  return { U: task.volts, T: round(task.target, 3) };
}

/**
 * The answer of each typical mistake of about.mistakes: none has a single answer, as each goes with any resistor or
 * any wrong one.
 */
export function mistakes(_task: Task, _props?: DescribeProps): (Answer | undefined)[] {
  return [undefined, undefined, undefined];
}

/** An answer as the learner gives it: the place of the ammeter and the resistor chosen. */
export function show(answer: Answer, _task: Task, _props: DescribeProps, lang: string): string {
  const words = SHOW[lang] ?? SHOW["de"]!;
  const at = answer.spot === null ? words.none : fill(words.at, { n: String(SPOTS.indexOf(answer.spot) + 1) });
  return `${at}, ${fill(words.resistor, { R: String(answer.ohm) })}`;
}

export const about = {
  task: {
    de: "Du baust ein Amperemeter in einen Stromkreis mit Batterie und Widerstand ein und wählst den Widerstand, bis es den Zielstrom zeigt.",
    en: "You build an ammeter into a circuit with a battery and a resistor and choose the resistor until it shows the target current.",
  },
  answer: {
    de: "Die Stelle des Amperemeters (eine von drei, antippen) und der Widerstand (10, 20, 30, 50 oder 100 Ω, Knöpfe unter dem Schaltbild); dann „Prüfen“ unter dem Schaltbild. Beim Prüfen wird der Strom eingeschaltet.",
    en: "The place of the ammeter (one of three, tap it) and the resistor (10, 20, 30, 50 or 100 Ω, buttons below the circuit); then “Check” below the circuit. Checking switches the power on.",
  },
  correct: {
    de: "Das Amperemeter sitzt in der Leitung, nicht quer über der Batterie, und zeigt den Zielstrom: Spannung geteilt durch Widerstand. Die obere und die untere Leitung gelten gleich.",
    en: "The ammeter sits in the wire, not straight across the battery, and shows the target current: voltage divided by resistance. The top and the bottom wire count the same.",
  },
  mistakes: [
    {
      de: "Das Amperemeter quer über die Batterie: Kurzschluss, es zeigt nichts an.",
      en: "The ammeter straight across the battery: a short circuit, it shows nothing.",
    },
    {
      de: "Kein Amperemeter eingebaut.",
      en: "No ammeter built in.",
    },
    {
      de: "Den falschen Widerstand gewählt: Strom = Spannung : Widerstand, ein größerer Widerstand gibt einen kleineren Strom.",
      en: "The wrong resistor chosen: current = voltage : resistance, a larger resistance gives a smaller current.",
    },
  ],
};
