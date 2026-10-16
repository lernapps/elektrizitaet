// Logic of the voltage exercise: connect a voltmeter to two points of a circuit with two resistors in series so that it
// shows the target voltage.
import { fill, fmt, nice, pick, random, same } from "./Fluss.ts";

/** The points of the circuit: before the first resistor (n0), between them (n1), after the second (n2) and in the
 * bottom wire (n3). */
export type Node = "n0" | "n1" | "n2" | "n3";
export const NODES: readonly Node[] = ["n0", "n1", "n2", "n3"];

export const STOCK: readonly number[] = [10, 20, 30, 50, 100];
export const VOLTAGES: readonly number[] = [6, 9, 12];

export interface Task {
  volts: number;
  r1: number;
  r2: number;
  /** The voltage to reach, in volts. */
  target: number;
  /** Across which resistor it is measured, for the solution. */
  across: "r1" | "r2";
}
/** The two points the voltmeter is connected to; null while one is missing. */
export interface Answer {
  from: Node | null;
  to: Node | null;
}

export const current = (t: { volts: number; r1: number; r2: number }) => t.volts / (t.r1 + t.r2);

/** The voltage of each point against the minus pole, in volts. */
export function potentials(t: { volts: number; r1: number; r2: number }): Record<Node, number> {
  return { n0: t.volts, n1: t.volts - current(t) * t.r1, n2: 0, n3: 0 };
}

/** What the voltmeter shows, null while it is not connected at two points. */
export function measure(t: { volts: number; r1: number; r2: number }, a: Answer): number | null {
  if (a.from === null || a.to === null) return null;
  const p = potentials(t);
  return Math.abs(p[a.from] - p[a.to]);
}

export function generate(seed: number, _props: object = {}): Task {
  const rand = random(seed);
  for (;;) {
    const volts = pick(rand, VOLTAGES);
    const r1 = pick(rand, STOCK);
    const r2 = pick(rand, STOCK);
    const across = pick(rand, ["r1", "r2"] as const);
    const target = measure({ volts, r1, r2 }, across === "r1" ? { from: "n0", to: "n1" } : { from: "n1", to: "n2" })!;
    if (nice(target, 2) && target > 0 && target < volts) return { volts, r1, r2, target, across };
  }
}

export function check(task: Task, answer: Answer): boolean {
  const shown = measure(task, answer);
  return shown !== null && same(shown, task.target, 2);
}

export const solution = (task: Task): Answer =>
  task.across === "r1" ? { from: "n0", to: "n1" } : { from: "n1", to: "n2" };
export const wrong = (_task: Task): Answer => ({ from: null, to: null });

/** Why an answer is wrong, for the hint under the feedback; null when it is right. */
export function diagnose(task: Task, answer: Answer): "points" | "wire" | "value" | null {
  if (check(task, answer)) return null;
  const shown = measure(task, answer);
  if (shown === null) return "points";
  return shown === 0 ? "wire" : "value";
}

interface DescribeProps {
  texts: Record<string, string>;
}
const WORDS: Record<string, { points: string; solution: string; first: string; second: string }> = {
  de: {
    points:
      "Die vier Punkte: 1 vor dem ersten Widerstand ({R1} Ω), 2 zwischen den Widerständen, 3 hinter dem zweiten ({R2} Ω), 4 in der unteren Leitung.",
    solution:
      "Das Voltmeter an Punkt {A} und Punkt {B}, also parallel zum {N} Widerstand ({R} Ω): {U} V · {R} Ω : ({R1} + {R2}) Ω = {T} V.",
    first: "ersten",
    second: "zweiten",
  },
  en: {
    points:
      "The four points: 1 before the first resistor ({R1} Ω), 2 between the resistors, 3 after the second ({R2} Ω), 4 in the bottom wire.",
    solution:
      "The voltmeter at point {A} and point {B}, that is, in parallel with the {N} resistor ({R} Ω): {U} V · {R} Ω : ({R1} + {R2}) Ω = {T} V.",
    first: "first",
    second: "second",
  },
};

/** The task as the learner sees it, and its solution, in the language lang. */
export function describe(task: Task, props: DescribeProps, lang: string) {
  const words = WORDS[lang] ?? WORDS["de"]!;
  const sep = props.texts["decimal"]!;
  const first = task.across === "r1";
  const values = {
    U: fmt(task.volts, 0, sep),
    T: fmt(task.target, 2, sep),
    R1: String(task.r1),
    R2: String(task.r2),
    R: String(first ? task.r1 : task.r2),
    A: first ? "1" : "2",
    B: first ? "2" : "3",
    N: first ? words.first : words.second,
  };
  return {
    task: `${fill(props.texts["task"]!, values)}\n\n${fill(words.points, values)}`,
    solution: fill(words.solution, values),
  };
}

export const about = {
  task: {
    de: "Du schließt ein Voltmeter an zwei Punkte eines Stromkreises mit zwei Widerständen in Reihe an, bis es den Zielwert zeigt.",
    en: "You connect a voltmeter to two points of a circuit with two resistors in series until it shows the target value.",
  },
  answer: {
    de: "Zwei der vier Punkte nacheinander antippen; dann „Prüfen“.",
    en: "Tap two of the four points one after the other; then “Check”.",
  },
  correct: {
    de: "Das Voltmeter zeigt den Zielwert, also den Teil der Spannung an einem der beiden Widerstände. Welche Punkte das sind, ist egal, wenn der Wert stimmt, und die Reihenfolge der beiden Punkte auch.",
    en: "The voltmeter shows the target value, that is, the share of the voltage across one of the two resistors. Which points they are does not matter if the value is right, and neither does the order of the two points.",
  },
  mistakes: [
    {
      de: "Nur einen Punkt oder keinen gewählt: das Voltmeter ist nicht angeschlossen.",
      en: "Only one point or none chosen: the voltmeter is not connected.",
    },
    {
      de: "Zwei Punkte an derselben Leitung gewählt: dort liegt keine Spannung, das Voltmeter zeigt 0 V.",
      en: "Two points on the same wire chosen: there is no voltage there, the voltmeter shows 0 V.",
    },
    {
      de: "Über beide Widerstände gemessen: das ist die ganze Spannung der Batterie, nicht der Teil an einem Widerstand.",
      en: "Measured across both resistors: that is the whole voltage of the battery, not the share across one resistor.",
    },
  ],
};
