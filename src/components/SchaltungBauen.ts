// Logic of the circuit builder: the circuit model, its simulation and the tasks (goals) the learner solves.

export type Goal = "eine" | "schalter" | "reihe" | "parallel" | "je-schalter" | "haupt";

export interface Lamp {
  kind: "lamp";
  /** The lamp is unscrewed. */
  out?: boolean;
}
export interface Switch {
  kind: "switch";
  closed: boolean;
}
export type Part = Lamp | Switch;
export interface Group {
  kind: "parallel";
  branches: Part[][];
}
export type Element = Part | Group;
/** The loop of the circuit, in series with the battery. */
export type Circuit = Element[];

export interface Task {
  goal: Goal;
}
export interface Props {
  goals: Goal[];
}

export interface Overrides {
  /** Whether the switch with this number is closed; the switch itself when absent. */
  closed?: (i: number) => boolean;
  /** Whether the lamp with this number is unscrewed; the lamp itself when absent. */
  out?: (i: number) => boolean;
}

export interface Simulation {
  /** Whether current flows around the loop. */
  conducts: boolean;
  /** The numbers of the lamps that light up. */
  lit: number[];
  /** A short circuit: current flows without passing a lamp. */
  short: boolean;
  lamps: number;
  switches: number;
}

export function simulate(circuit: Circuit, over: Overrides = {}): Simulation {
  let lamp = 0;
  let sw = 0;
  let lamps = 0;
  let switches = 0;
  let groupShort = false;
  // For a part: whether it lets current through, and the lamps it lights when the loop around it conducts.
  const part = (p: Part): { conducts: boolean; lamps: number[] } => {
    if (p.kind === "lamp") {
      const i = lamp++;
      lamps++;
      const out = over.out === undefined ? p.out === true : over.out(i);
      return { conducts: !out, lamps: [i] };
    }
    const i = sw++;
    switches++;
    return { conducts: over.closed === undefined ? p.closed : over.closed(i), lamps: [] };
  };
  let conducts = true;
  const lit: number[] = [];
  for (const element of circuit) {
    if (element.kind !== "parallel") {
      const result = part(element);
      conducts &&= result.conducts;
      lit.push(...result.lamps);
      continue;
    }
    const branches = element.branches.map((branch) => {
      const parts = branch.map(part);
      return {
        conducts: parts.every((p) => p.conducts),
        lamps: parts.flatMap((p) => p.lamps),
        hasLamp: branch.some((p) => p.kind === "lamp"),
      };
    });
    const open = branches.filter((b) => b.conducts);
    conducts &&= open.length > 0;
    if (open.some((b) => !b.hasLamp)) groupShort = true;
    else lit.push(...open.flatMap((b) => b.lamps));
  }
  const on = conducts ? lit : [];
  return { conducts, lit: on, short: conducts && (groupShort || on.length === 0), lamps, switches };
}

const sameSet = (a: number[], b: number[]) => a.length === b.length && a.every((x) => b.includes(x));

/** Whether the circuit does what the goal asks, tried with every position of the switches and unscrewed lamps. */
export function meets(goal: Goal, circuit: Circuit): boolean {
  const all = simulate(circuit, { closed: () => true, out: () => false });
  const sim = (closed: (i: number) => boolean, out: (i: number) => boolean = () => false) =>
    simulate(circuit, { closed, out });
  const closed = () => true;
  const unscrewed = (n: number) => sim(closed, (i) => i === n);
  switch (goal) {
    case "eine":
      // One lamp that shines with the switches as they are; a switch in the loop does no harm.
      return circuit.length > 0 && all.lamps === 1 && sameSet(simulate(circuit).lit, [0]) && !all.short;
    case "schalter":
      return (
        all.lamps === 1 &&
        all.switches === 1 &&
        sameSet(all.lit, [0]) &&
        !all.short &&
        sim(() => false).lit.length === 0
      );
    case "reihe":
      return (
        all.lamps === 2 &&
        sameSet(all.lit, [0, 1]) &&
        !all.short &&
        unscrewed(0).lit.length === 0 &&
        unscrewed(1).lit.length === 0
      );
    case "parallel":
      return (
        all.lamps === 2 &&
        sameSet(all.lit, [0, 1]) &&
        !all.short &&
        sameSet(unscrewed(0).lit, [1]) &&
        sameSet(unscrewed(1).lit, [0])
      );
    case "je-schalter": {
      if (all.lamps !== 2 || all.switches !== 2 || !sameSet(all.lit, [0, 1]) || all.short) return false;
      const first = sim((i) => i !== 0).lit;
      const second = sim((i) => i !== 1).lit;
      return first.length === 1 && second.length === 1 && first[0] !== second[0] && sim(() => false).lit.length === 0;
    }
    case "haupt":
      return (
        all.lamps === 2 &&
        all.switches === 1 &&
        sameSet(all.lit, [0, 1]) &&
        !all.short &&
        sim(() => false).lit.length === 0 &&
        sameSet(unscrewed(0).lit, [1]) &&
        sameSet(unscrewed(1).lit, [0])
      );
  }
}

export function generate(seed: number, props: Props): Task {
  const goals = props.goals.length > 0 ? props.goals : (["eine"] as Goal[]);
  return { goal: goals[Math.abs(Math.trunc(seed)) % goals.length]! };
}

export function check(task: Task, answer: Circuit): boolean {
  return meets(task.goal, answer);
}

/** The places of the board: two in the main line (m1, m2) and two per branch of the parallel section (p1a to p2b). */
export type SlotId = "m1" | "p1a" | "p1b" | "p2a" | "p2b" | "m2";
/** The order of the loop; lamps and switches are numbered in it. */
export const SLOTS: readonly SlotId[] = ["m1", "p1a", "p1b", "p2a", "p2b", "m2"];
export type Slots = Record<SlotId, Part | null>;

export const emptySlots = (): Slots => ({ m1: null, p1a: null, p1b: null, p2a: null, p2b: null, m2: null });

/**
 * The circuit of a board: an empty place is a wire. A parallel section whose branches are all bare wire is just wire;
 * with a part in one branch only, the bare branch is a bypass.
 */
export function fromSlots(slots: Slots): Circuit {
  const parts = (...ids: SlotId[]) => ids.flatMap((id) => (slots[id] === null ? [] : [slots[id]!]));
  const branches = [parts("p1a", "p1b"), parts("p2a", "p2b")];
  return [
    ...parts("m1"),
    ...(branches.some((b) => b.length > 0) ? [{ kind: "parallel" as const, branches }] : []),
    ...parts("m2"),
  ];
}

/** The place of each lamp of the circuit, numbered as `simulate` does. */
export const lampSlots = (slots: Slots): SlotId[] => SLOTS.filter((id) => slots[id]?.kind === "lamp");

const lamp = (): Lamp => ({ kind: "lamp" });
const closedSwitch = (): Switch => ({ kind: "switch", closed: true });

/** A board that meets the goal. */
export function solutionSlots(task: Task): Slots {
  const slots = emptySlots();
  switch (task.goal) {
    case "eine":
      slots.m1 = lamp();
      break;
    case "schalter":
      slots.m1 = closedSwitch();
      slots.m2 = lamp();
      break;
    case "reihe":
      slots.m1 = lamp();
      slots.m2 = lamp();
      break;
    case "parallel":
      slots.p1a = lamp();
      slots.p2a = lamp();
      break;
    case "je-schalter":
      slots.p1a = closedSwitch();
      slots.p1b = lamp();
      slots.p2a = closedSwitch();
      slots.p2b = lamp();
      break;
    case "haupt":
      slots.m1 = closedSwitch();
      slots.p1a = lamp();
      slots.p2a = lamp();
      break;
  }
  return slots;
}

/** A circuit that meets the goal. */
export const solution = (task: Task): Circuit => fromSlots(solutionSlots(task));

/** A circuit that meets no goal: the battery alone. */
export function wrong(_task: Task): Circuit {
  return [];
}

export interface Flows {
  /** How strongly current flows through the main wire and each branch, 0 for none; 1 is a normal current. */
  total: number;
  first: number;
  second: number;
}

/**
 * How the current runs on the board, for the picture: through the main wire when the loop conducts, in each branch that
 * conducts, and only through a bare branch when there is a short circuit. A section of bare branches is just wire.
 */
export function flows(slots: Slots, sim: Simulation): Flows {
  if (!sim.conducts) return { total: 0, first: 0, second: 0 };
  const branch = (ids: SlotId[]) => {
    const parts = ids.flatMap((id) => (slots[id] === null ? [] : [slots[id]!]));
    const conducts = parts.every((p) => (p.kind === "lamp" ? p.out !== true : p.closed));
    return { bare: parts.length === 0, conducts };
  };
  const first = branch(["p1a", "p1b"]);
  const second = branch(["p2a", "p2b"]);
  if (first.bare && second.bare) return { total: 1, first: 1, second: 0 };
  const open = [first, second].filter((b) => b.conducts);
  const bypass = open.filter((b) => b.bare);
  if (bypass.length > 0) {
    const level = (b: { bare: boolean; conducts: boolean }) => (bypass.includes(b) ? 1.5 : 0);
    return { total: 1.5, first: level(first), second: level(second) };
  }
  const level = (b: { conducts: boolean }) => (b.conducts ? 1 / open.length : 0);
  return { total: 1, first: level(first), second: level(second) };
}

export type Reason = "lamps" | "switches" | "short" | "dark" | "behaviour";

const EXPECTED: Record<Goal, { lamps: number; switches: number | null }> = {
  eine: { lamps: 1, switches: null },
  schalter: { lamps: 1, switches: 1 },
  reihe: { lamps: 2, switches: null },
  parallel: { lamps: 2, switches: null },
  "je-schalter": { lamps: 2, switches: 2 },
  haupt: { lamps: 2, switches: 1 },
};

/** Why a circuit does not meet the goal, for a hint to the learner; null when it does. */
export function diagnose(goal: Goal, circuit: Circuit): Reason | null {
  if (meets(goal, circuit)) return null;
  const all = simulate(circuit, { closed: () => true, out: () => false });
  const expected = EXPECTED[goal];
  if (all.lamps !== expected.lamps) return "lamps";
  if (expected.switches !== null && all.switches !== expected.switches) return "switches";
  if (all.short) return "short";
  if (simulate(circuit).lit.length < all.lamps) return "dark";
  return "behaviour";
}
