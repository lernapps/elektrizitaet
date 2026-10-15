// Logic of the wire exercise: set the length and the thickness of a wire so that the current gets k times as large.
import { pick, random } from "./Fluss.ts";

export const LENGTHS: readonly number[] = [1, 2, 3, 4, 5, 6];
/** The thickness of the wire in tenths of a square millimetre, to keep the numbers exact. */
export const TENTHS: readonly number[] = [1, 2, 3, 4, 5];
/** The specific resistance of the wire (constantan) in ohm square millimetres per metre. */
export const RHO = 0.5;
export const VOLTS = 3;

export interface Task {
  /** The wire the exercise starts with. */
  length: number;
  tenths: number;
  /** How many times as large the current has to get. */
  factor: number;
}
export interface Answer {
  length: number;
  tenths: number;
}

/** The resistance of the wire in ohms. */
export const resistance = (length: number, tenths: number) => (RHO * length) / (tenths / 10);
/** The current in amperes at the source of the exercise. */
export const current = (length: number, tenths: number) => VOLTS / resistance(length, tenths);

export function generate(seed: number, _props: object = {}): Task {
  const rand = random(seed);
  return { length: pick(rand, [4, 5, 6]), tenths: pick(rand, [1, 2]), factor: pick(rand, [2, 3, 4]) };
}

export const check = (task: Task, answer: Answer): boolean =>
  current(answer.length, answer.tenths) >= task.factor * current(task.length, task.tenths) - 1e-9;

/** The shortest, thickest wire. */
export const solution = (_task: Task): Answer => ({ length: LENGTHS[0]!, tenths: TENTHS[TENTHS.length - 1]! });
/** The wire the exercise starts with. */
export const wrong = (task: Task): Answer => ({ length: task.length, tenths: task.tenths });
