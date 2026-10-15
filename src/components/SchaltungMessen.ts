// Logic of the measuring circuit builder: the board, its calculation (direct current, ideal source and meters) and the
// tasks, which are drawn from a seed and checked by what the meters show, not by how the board is built.

export type Kind = "strom" | "spannung" | "parallel";

/** Resistors the learner can choose from, in ohms. */
export const STOCK: readonly number[] = [10, 20, 30, 50, 100];
/** Voltages of the source, in volts. */
export const VOLTAGES: readonly number[] = [6, 9, 12];

/**
 * The places of the board: two in the main wire (a, b) and one in each of the two branches of a parallel section
 * (p, q). The loop runs a, then the section, then b. A place holds a resistor, or is bare wire.
 */
export type SlotId = "a" | "p" | "q" | "b";
export const SLOTS: readonly SlotId[] = ["a", "p", "q", "b"];
export interface Board {
  /** The resistance in ohms of each place, null for bare wire. */
  slots: Record<SlotId, number | null>;
  /** The places an ammeter is built into: in series with the place. */
  ammeters: SlotId[];
  /** The places a voltmeter is connected across: in parallel with the place. */
  voltmeters: SlotId[];
}

export const emptyBoard = (): Board => ({
  slots: { a: null, p: null, q: null, b: null },
  voltmeters: [],
  ammeters: [],
});

export interface Task {
  kind: Kind;
  /** Voltage of the source in volts. */
  volts: number;
  /** The reading to reach: amperes for `strom` and `parallel`, volts for `spannung`. */
  target: number;
  /** A board that reaches it. */
  answer: Board;
}
export interface Props {
  kinds: Kind[];
}

export interface Reading {
  /** No resistor in the loop: the source is short-circuited and nothing can be read. */
  short: boolean;
  /** A branch of the parallel section is bare wire: it bypasses the other branch. */
  bypass: boolean;
  /** The current through the source in amperes, null with a short circuit. */
  total: number | null;
  /** The current through each place with an ammeter, null when it is not defined (both branches bare). */
  amps: Partial<Record<SlotId, number | null>>;
  /** The voltage across each place with a voltmeter. */
  volts: Partial<Record<SlotId, number>>;
}

const ohm = (board: Board, id: SlotId) => board.slots[id] ?? 0;

/** What the meters of the board show at the given source voltage. */
export function measure(board: Board, volts: number): Reading {
  const rp = ohm(board, "p");
  const rq = ohm(board, "q");
  const section = board.slots.p !== null || board.slots.q !== null;
  const bypass = section && (rp === 0 || rq === 0);
  const rpar = !section || bypass ? 0 : (rp * rq) / (rp + rq);
  const total = ohm(board, "a") + ohm(board, "b") + rpar;
  const reading: Reading = { short: total === 0, bypass, total: null, amps: {}, volts: {} };
  if (reading.short) return reading;
  const current = volts / total;
  reading.total = current;
  const across = current * rpar;
  // A bare branch carries all the current when the other one has a resistor; two bare branches split it undefined.
  const branch = (r: number, other: number): number | null => (r > 0 ? across / r : other > 0 ? current : null);
  const through: Record<SlotId, number | null> = { a: current, b: current, p: branch(rp, rq), q: branch(rq, rp) };
  const dropped: Record<SlotId, number> = {
    a: current * ohm(board, "a"),
    b: current * ohm(board, "b"),
    p: rp > 0 ? across : 0,
    q: rq > 0 ? across : 0,
  };
  for (const id of board.ammeters) reading.amps[id] = through[id];
  for (const id of board.voltmeters) reading.volts[id] = dropped[id];
  return reading;
}

const AMP_DECIMALS = 3;
const VOLT_DECIMALS = 2;
const round = (x: number, decimals: number) => Math.round(x * 10 ** decimals) / 10 ** decimals;
/** Whether a value is exactly what its rounded display shows. */
const nice = (x: number, decimals: number) => Math.abs(x - round(x, decimals)) < 1e-9;
const same = (x: number, y: number, decimals: number) => Math.abs(round(x, decimals) - round(y, decimals)) < 1e-9;

/** The currents the ammeters in the main wire show. */
const mainAmps = (r: Reading) => [r.amps.a, r.amps.b].filter((x): x is number => typeof x === "number");

/** Whether the board does what the task asks. */
export function check(task: Task, board: Board): boolean {
  const reading = measure(board, task.volts);
  if (reading.short) return false;
  switch (task.kind) {
    case "strom":
      return mainAmps(reading).some((x) => same(x, task.target, AMP_DECIMALS));
    case "spannung":
      return SLOTS.some(
        (id) => id in reading.volts && ohm(board, id) > 0 && same(reading.volts[id]!, task.target, VOLT_DECIMALS),
      );
    case "parallel":
      return (
        ohm(board, "p") > 0 && ohm(board, "q") > 0 && mainAmps(reading).some((x) => same(x, task.target, AMP_DECIMALS))
      );
  }
}

/** A deterministic random number generator (mulberry32). */
function random(seed: number): () => number {
  let s = Math.trunc(seed) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T>(rand: () => number, xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!;

/** The task for a board that reaches its target; undefined when the target is not a round number. */
function task(kind: Kind, volts: number, board: Board): Task | undefined {
  const reading = measure(board, volts);
  const value = kind === "spannung" ? reading.volts.a : reading.total;
  if (value === undefined || value === null) return undefined;
  const decimals = kind === "spannung" ? VOLT_DECIMALS : AMP_DECIMALS;
  if (!nice(value, decimals) || value <= 0 || (kind === "spannung" && value >= volts)) return undefined;
  return { kind, volts, target: round(value, decimals), answer: board };
}

function draw(kind: Kind, volts: number, rand: () => number): Task | undefined {
  const board = emptyBoard();
  if (kind === "strom") {
    board.slots.a = pick(rand, STOCK);
    if (rand() < 0.5) board.slots.b = pick(rand, STOCK);
    board.ammeters = ["a"];
  } else if (kind === "spannung") {
    board.slots.a = pick(rand, STOCK);
    board.slots.b = pick(rand, STOCK);
    board.voltmeters = ["a"];
  } else {
    board.slots.p = pick(rand, STOCK);
    board.slots.q = pick(rand, STOCK);
    board.ammeters = ["a"];
  }
  return task(kind, volts, board);
}

/** A task that always works, for the rare seed that draws no round target. */
const FALLBACK: Record<Kind, Task> = {
  strom: task("strom", 12, { slots: { a: 30, p: null, q: null, b: null }, ammeters: ["a"], voltmeters: [] })!,
  spannung: task("spannung", 12, { slots: { a: 10, p: null, q: null, b: 30 }, ammeters: [], voltmeters: ["a"] })!,
  parallel: task("parallel", 12, { slots: { a: null, p: 20, q: 30, b: null }, ammeters: ["a"], voltmeters: [] })!,
};

/** The task of a seed: the kinds of the props in turn, with values drawn from the seed. */
export function generate(seed: number, props: Props): Task {
  const kinds = props.kinds.length > 0 ? props.kinds : (["strom"] as Kind[]);
  const kind = kinds[Math.abs(Math.trunc(seed)) % kinds.length]!;
  const rand = random(seed);
  for (let i = 0; i < 200; i++) {
    const drawn = draw(kind, pick(rand, VOLTAGES), rand);
    if (drawn !== undefined) return drawn;
  }
  return FALLBACK[kind];
}

/** A board that meets the task. */
export const solution = (task: Task): Board => task.answer;

/** A board that meets no task: nothing on it. */
export const wrong = (_task: Task): Board => emptyBoard();
