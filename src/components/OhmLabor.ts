// Logic of the Ohm's law exercise: set voltages, record measuring points and name the unknown resistor.
import { pick, random } from "./Fluss.ts";

/** The voltages the learner can set, in volts. */
export const STEPS: readonly number[] = [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12];
export const STOCK: readonly number[] = [10, 20, 30, 50, 100];
export const MAX = STEPS[STEPS.length - 1]!;

export interface Task {
  /** The hidden resistance in ohms. */
  ohm: number;
}
export interface Point {
  volts: number;
  amps: number;
}
export interface Answer {
  points: Point[];
  /** The resistance the learner names, null while none. */
  ohm: number | null;
}

export const generate = (seed: number, _props: object = {}): Task => ({ ohm: pick(random(seed), STOCK) });

/** The point measured at a voltage. */
export const measure = (task: Task, volts: number): Point => ({ volts, amps: volts / task.ohm });

/** At least three different voltages above zero measured, and the resistance named within half an ohm. */
export function check(task: Task, answer: Answer): boolean {
  const volts = new Set(answer.points.filter((p) => p.volts > 0).map((p) => p.volts));
  return volts.size >= 3 && answer.ohm !== null && Math.abs(answer.ohm - task.ohm) <= 0.5;
}

export const solution = (task: Task): Answer => ({
  points: [3, 6, 9].map((volts) => measure(task, volts)),
  ohm: task.ohm,
});
export const wrong = (_task: Task): Answer => ({ points: [], ohm: null });
