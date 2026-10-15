// Logic of the current exercise: build an ammeter into the circuit at the right place and choose the resistor that
// gives the target current.
import { nice, pick, random, same } from "./Fluss.ts";

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
