// Logic of the circuit builder: the circuit model, its simulation and the tasks (goals) the learner solves.
// SchaltungBauen.vue is the input of the task; the explainer checks a circuit with check and gives the message of
// reason. describe states a task and its solution, about what the exercise is; template, params, mistakes and show give
// a tutor the task once and each number's goal and solution, the circuit as a short text.

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

/** Why a circuit does not meet the goal, for the app's message; null when it does. */
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

interface DescribeProps {
  texts: Record<string, string>;
}

/** The app's message for a wrong circuit, the text why… of the page for its mistake; undefined for a right one. */
export function reason(task: Task, answer: Circuit, props: DescribeProps, _lang?: string): string | undefined {
  const why = diagnose(task.goal, answer);
  if (why === null) return undefined;
  const key = {
    lamps: "whyLamps",
    switches: "whySwitches",
    short: "whyShort",
    dark: "whyDark",
    behaviour: "whyBehaviour",
  }[why];
  return props.texts[key];
}
const GOAL_KEYS: Record<Goal, string> = {
  eine: "goalEine",
  schalter: "goalSchalter",
  reihe: "goalReihe",
  parallel: "goalParallel",
  "je-schalter": "goalJeSchalter",
  haupt: "goalHaupt",
};
const WORDS: Record<string, { simple: string; branches: string; solution: Record<Goal, string> }> = {
  de: {
    simple:
      "Das Schaltbrett ist ein Stromkreis mit zwei Plätzen. Du wählst Lampe, Schalter oder Kabel, tippst auf einen Platz und schaltest dann den Strom ein.",
    branches:
      "Das Schaltbrett hat sechs Plätze: 1 und 6 in der Hauptleitung, 2 und 3 im ersten Zweig, 4 und 5 im zweiten. Du wählst Lampe, Schalter oder Kabel, tippst auf einen Platz und schaltest dann den Strom ein.",
    solution: {
      eine: "Eine Lampe auf einen der beiden Plätze. Ein zusätzlicher Schalter ist erlaubt, wenn er geschlossen ist.",
      schalter: "Die Lampe auf einen Platz, der Schalter auf den anderen: Mit dem Schalter geht die Lampe an und aus.",
      reihe:
        "Eine Lampe auf jeden der beiden Plätze, ein Schalter ist erlaubt. Schraubst du eine heraus, geht die andere aus.",
      parallel:
        "Eine Lampe in jeden Zweig, zum Beispiel auf Platz 2 und 4. Schraubst du eine heraus, leuchtet die andere weiter.",
      "je-schalter":
        "In jeden Zweig ein Schalter und eine Lampe, zum Beispiel Schalter auf Platz 2 und 4, Lampen auf Platz 3 und 5.",
      haupt: "Ein Schalter in die Hauptleitung (Platz 1) und eine Lampe in jeden Zweig (zum Beispiel Platz 2 und 4).",
    },
  },
  en: {
    simple:
      "The circuit board is a circuit with two places. You choose lamp, switch or wire, tap a place and then switch the power on.",
    branches:
      "The circuit board has six places: 1 and 6 in the main wire, 2 and 3 in the first branch, 4 and 5 in the second. You choose lamp, switch or wire, tap a place and then switch the power on.",
    solution: {
      eine: "A lamp on one of the two places. An additional switch is allowed if it is closed.",
      schalter: "The lamp on one place, the switch on the other: the switch turns the lamp on and off.",
      reihe: "A lamp on each of the two places, a switch is allowed. If you unscrew one, the other goes out.",
      parallel: "A lamp in each branch, for example on places 2 and 4. If you unscrew one, the other keeps shining.",
      "je-schalter":
        "A switch and a lamp in each branch, for example switches on places 2 and 4, lamps on places 3 and 5.",
      haupt: "A switch in the main wire (place 1) and a lamp in each branch (for example places 2 and 4).",
    },
  },
};

/** The task as the learner sees it, and its solution, in the language lang. */
export function describe(task: Task, props: DescribeProps, lang: string) {
  const words = WORDS[lang] ?? WORDS["de"]!;
  const simple = ["eine", "schalter", "reihe"].includes(task.goal);
  return {
    task: `${props.texts[GOAL_KEYS[task.goal]]!}\n\n${simple ? words.simple : words.branches}`,
    solution: words.solution[task.goal],
  };
}

const SHOW: Record<
  string,
  {
    task: string;
    lamp: string;
    lampOut: string;
    closed: string;
    open: string;
    wire: string;
    and: string;
    series: string;
    main: string;
    branch: string;
  }
> = {
  de: {
    task: "Aufgabe",
    lamp: "Lampe",
    lampOut: "Lampe (herausgeschraubt)",
    closed: "Schalter (geschlossen)",
    open: "Schalter (offen)",
    wire: "nur Kabel",
    and: " und ",
    series: "{P} in Reihe",
    main: "Hauptleitung",
    branch: "Zweig {n}",
  },
  en: {
    task: "task",
    lamp: "lamp",
    lampOut: "lamp (unscrewed)",
    closed: "switch (closed)",
    open: "switch (open)",
    wire: "just wire",
    and: " and ",
    series: "{P} in series",
    main: "main wire",
    branch: "branch {n}",
  },
};

/** The task as a learner reads it: {Aufgabe} for the text of its goal, which is all the task says. */
export function template(_props: DescribeProps, lang: string): string {
  return `{${(SHOW[lang] ?? SHOW["de"]!).task}}`;
}

/** What sets a task: its goal, as the text of the page. */
export function params(task: Task, props: DescribeProps, lang: string): Record<string, string> {
  return { [(SHOW[lang] ?? SHOW["de"]!).task]: props.texts[GOAL_KEYS[task.goal]]!.replace(/\s+/g, " ").trim() };
}

/** The answer of each typical mistake of about.mistakes: none has a single circuit, each comes in many builds. */
export function mistakes(_task: Task, _props?: DescribeProps): (Circuit | undefined)[] {
  return [undefined, undefined, undefined];
}

/**
 * A circuit as a learner describes it: its parts in series, or with a parallel section the parts of the main wire and
 * of each branch; a lamp unscrewed and a switch open or closed as they are.
 */
export function show(answer: Circuit, _task: Task, _props: DescribeProps, lang: string): string {
  const words = SHOW[lang] ?? SHOW["de"]!;
  const name = (part: Part) =>
    part.kind === "lamp" ? (part.out === true ? words.lampOut : words.lamp) : part.closed ? words.closed : words.open;
  const list = (parts: Part[]) => (parts.length === 0 ? words.wire : parts.map(name).join(words.and));
  const main = answer.filter((element): element is Part => element.kind !== "parallel");
  const group = answer.find((element): element is Group => element.kind === "parallel");
  if (group === undefined) return main.length > 1 ? words.series.replace("{P}", list(main)) : list(main);
  return [
    `${words.main}: ${list(main)}`,
    ...group.branches.map((branch, index) => `${words.branch.replace("{n}", String(index + 1))}: ${list(branch)}`),
  ].join("; ");
}

export const about = {
  task: {
    de: "Du baust einen Stromkreis aus Lampen, Schaltern und Kabeln, der tut, was die Aufgabe verlangt, schaltest den Strom ein und testest ihn.",
    en: "You build a circuit from lamps, switches and wires that does what the task asks, switch the power on and test it.",
  },
  answer: {
    de: "Der gebaute Stromkreis auf dem Schaltbrett (Lampe, Schalter oder Kabel pro Platz: Bauteil wählen, dann auf den Platz tippen); dann „Prüfen“ unter dem Schaltbrett. Beim Prüfen wird der Strom eingeschaltet.",
    en: "The circuit built on the board (lamp, switch or wire per place: choose a part, then tap the place); then “Check” below the board. Checking switches the power on.",
  },
  correct: {
    de: "Der Stromkreis verhält sich so, wie die Aufgabe es sagt: Lampen leuchten, Schalter und herausgeschraubte Lampen wirken wie verlangt. Jeder Aufbau zählt, der das tut, nicht nur die Musterlösung; ein zusätzlicher Schalter ist nur dort ein Fehler, wo die Aufgabe eine feste Zahl nennt.",
    en: "The circuit behaves as the task says: lamps shine, switches and unscrewed lamps act as asked. Any build that does this counts, not only the model solution; an additional switch is only a mistake where the task names a fixed number.",
  },
  mistakes: [
    {
      de: "Falsche Zahl von Lampen oder Schaltern.",
      en: "The wrong number of lamps or switches.",
    },
    {
      de: "Ein Zweig bleibt leer, während im anderen eine Lampe sitzt: ein Kurzschluss, die Lampen bleiben dunkel.",
      en: "One branch stays empty while the other holds a lamp: a short circuit, the lamps stay dark.",
    },
    {
      de: "Die Teile stimmen, aber ein Schalter schaltet die falschen Lampen oder die Lampen hängen in Reihe statt parallel.",
      en: "The parts are right, but a switch switches the wrong lamps or the lamps are in series instead of parallel.",
    },
  ],
};
