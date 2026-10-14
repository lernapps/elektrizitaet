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

/** The same structure with the number of each lamp and switch, in the order of the loop. */
export type View = (
  | { kind: "lamp"; part: Lamp; i: number }
  | { kind: "switch"; part: Switch; i: number }
  | {
      kind: "parallel";
      branches: ({ kind: "lamp"; part: Lamp; i: number } | { kind: "switch"; part: Switch; i: number })[][];
    }
)[];

export function indexed(circuit: Circuit): View {
  let lamp = 0;
  let sw = 0;
  const part = (p: Part) =>
    p.kind === "lamp" ? { kind: "lamp" as const, part: p, i: lamp++ } : { kind: "switch" as const, part: p, i: sw++ };
  return circuit.map((element) =>
    element.kind === "parallel"
      ? { kind: "parallel" as const, branches: element.branches.map((branch) => branch.map(part)) }
      : part(element),
  );
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
      return all.lamps === 1 && all.switches === 0 && sameSet(all.lit, [0]) && !all.short;
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
        all.switches === 0 &&
        sameSet(all.lit, [0, 1]) &&
        !all.short &&
        unscrewed(0).lit.length === 0 &&
        unscrewed(1).lit.length === 0
      );
    case "parallel":
      return (
        all.lamps === 2 &&
        all.switches === 0 &&
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

const lamp = (): Lamp => ({ kind: "lamp" });
const closedSwitch = (): Switch => ({ kind: "switch", closed: true });

/** A circuit that meets the goal. */
export function solution(task: Task): Circuit {
  switch (task.goal) {
    case "eine":
      return [lamp()];
    case "schalter":
      return [closedSwitch(), lamp()];
    case "reihe":
      return [lamp(), lamp()];
    case "parallel":
      return [{ kind: "parallel", branches: [[lamp()], [lamp()]] }];
    case "je-schalter":
      return [
        {
          kind: "parallel",
          branches: [
            [closedSwitch(), lamp()],
            [closedSwitch(), lamp()],
          ],
        },
      ];
    case "haupt":
      return [closedSwitch(), { kind: "parallel", branches: [[lamp()], [lamp()]] }];
  }
}

/** A circuit that meets no goal: the battery alone. */
export function wrong(_task: Task): Circuit {
  return [];
}
