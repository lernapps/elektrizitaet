// Logic of the prediction exercise: predict what a meter will show in a series or a parallel circuit with two resistors,
// then switch on and read it.
import { nice, pick, random, same } from "./Fluss.ts";

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
