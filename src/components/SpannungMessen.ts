// Logic of the voltage exercise: connect a voltmeter to two points of a circuit with two resistors in series so that it
// shows the target voltage.
import { nice, pick, random, same } from "./Fluss.ts";

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
