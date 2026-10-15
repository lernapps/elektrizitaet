import { describe, expect, it } from "vite-plus/test";
import {
  check,
  diagnose,
  emptySlots,
  flows,
  fromSlots,
  generate,
  lampSlots,
  meets,
  simulate,
  solution,
  solutionSlots,
  wrong,
  type Circuit,
  type Goal,
  type Part,
} from "./SchaltungBauen.ts";

const GOALS: Goal[] = ["eine", "schalter", "reihe", "parallel", "je-schalter", "haupt"];
const lamp = { kind: "lamp" } as const;
const open = { kind: "switch", closed: false } as const;
const shut = { kind: "switch", closed: true } as const;

describe("simulate", () => {
  it("lights a lamp in a closed loop", () => {
    expect(simulate([lamp]).lit).toEqual([0]);
  });
  it("keeps a lamp dark behind an open switch", () => {
    const sim = simulate([open, lamp]);
    expect(sim.conducts).toBe(false);
    expect(sim.lit).toEqual([]);
  });
  it("lights nothing when a lamp in series is unscrewed", () => {
    expect(simulate([{ kind: "lamp", out: true }, lamp]).lit).toEqual([]);
  });
  it("keeps the other lamp lit in a parallel group", () => {
    const circuit: Circuit = [{ kind: "parallel", branches: [[{ kind: "lamp", out: true }], [lamp]] }];
    expect(simulate(circuit).lit).toEqual([1]);
  });
  it("detects a short circuit: a bare switch and a battery", () => {
    expect(simulate([shut]).short).toBe(true);
  });
  it("detects a branch without a lamp as a short circuit that darkens the other lamps", () => {
    const sim = simulate([{ kind: "parallel", branches: [[], [lamp]] }]);
    expect(sim.short).toBe(true);
    expect(sim.lit).toEqual([]);
  });
  it("treats an empty circuit as a short circuit", () => {
    expect(simulate([]).short).toBe(true);
  });
  it("numbers the lamps of a board in the order of the loop", () => {
    const slots = emptySlots();
    slots.p2b = { kind: "lamp" };
    slots.m1 = { kind: "lamp" };
    expect(lampSlots(slots)).toEqual(["m1", "p2b"]);
  });
});

describe("goals", () => {
  for (const goal of GOALS) {
    it(`accepts the solution and rejects the empty circuit: ${goal}`, () => {
      expect(check({ goal }, solution({ goal }))).toBe(true);
      expect(check({ goal }, wrong({ goal }))).toBe(false);
    });
  }
  it("rejects two lamps in series for the parallel goal and the other way round", () => {
    expect(meets("parallel", solution({ goal: "reihe" }))).toBe(false);
    expect(meets("reihe", solution({ goal: "parallel" }))).toBe(false);
  });
  it("rejects a switch in the main line when each lamp needs its own", () => {
    expect(meets("je-schalter", solution({ goal: "haupt" }))).toBe(false);
    expect(meets("haupt", solution({ goal: "je-schalter" }))).toBe(false);
  });
  it("rejects a circuit with one lamp too many", () => {
    expect(meets("eine", [lamp, lamp])).toBe(false);
  });
  it("rejects a switch that is not in the loop of its lamp", () => {
    expect(meets("schalter", [lamp, { kind: "parallel", branches: [[shut], [lamp]] }])).toBe(false);
  });
});

describe("generate", () => {
  it("gives the same task for the same seed", () => {
    expect(generate(3, { goals: GOALS })).toEqual(generate(3, { goals: GOALS }));
  });
  it("draws the goals in turn", () => {
    expect(new Set([0, 1, 2, 3, 4, 5].map((seed) => generate(seed, { goals: GOALS }).goal)).size).toBe(6);
  });
  it("copes with no goals", () => {
    expect(generate(1, { goals: [] }).goal).toBe("eine");
  });
});

describe("fromSlots", () => {
  it("makes an empty board a short circuit", () => {
    expect(fromSlots(emptySlots())).toEqual([]);
    expect(simulate(fromSlots(emptySlots())).short).toBe(true);
  });
  it("treats a parallel section of bare wire as wire", () => {
    const slots = emptySlots();
    slots.m1 = { kind: "lamp" };
    slots.m2 = { kind: "lamp" };
    expect(fromSlots(slots)).toHaveLength(2);
    expect(meets("reihe", fromSlots(slots))).toBe(true);
  });
  it("lets a bare branch bypass the lamp in the other branch", () => {
    const slots = emptySlots();
    slots.p1a = { kind: "lamp" };
    const sim = simulate(fromSlots(slots));
    expect(sim.short).toBe(true);
    expect(sim.lit).toEqual([]);
  });
  it("solves every goal with its solution board", () => {
    for (const goal of GOALS) expect(meets(goal, fromSlots(solutionSlots({ goal })))).toBe(true);
  });
});

describe("flows", () => {
  const run = (set: (s: ReturnType<typeof emptySlots>) => void) => {
    const slots = emptySlots();
    set(slots);
    return flows(slots, simulate(fromSlots(slots)));
  };
  it("runs nowhere when the loop does not conduct", () => {
    expect(run((s) => (s.m1 = { kind: "switch", closed: false }))).toEqual({ total: 0, first: 0, second: 0 });
  });
  it("runs through the main wire and every branch with a lamp", () => {
    const f = run((s) => {
      s.p1a = { kind: "lamp" };
      s.p2a = { kind: "lamp" };
    });
    expect(f.total).toBe(1);
    expect(f.first).toBe(0.5);
    expect(f.second).toBe(0.5);
  });
  it("leaves out a branch with an unscrewed lamp", () => {
    const f = run((s) => {
      s.p1a = { kind: "lamp", out: true };
      s.p2a = { kind: "lamp" };
    });
    expect(f.first).toBe(0);
    expect(f.second).toBe(1);
  });
  it("runs a short circuit through the bare branch only", () => {
    const f = run((s) => (s.p1a = { kind: "lamp" }));
    expect(f.first).toBe(0);
    expect(f.second).toBe(1.5);
  });
  it("treats two bare branches as one wire", () => {
    const f = run((s) => (s.m1 = { kind: "lamp" }));
    expect(f).toEqual({ total: 1, first: 1, second: 0 });
  });
});

describe("one lamp", () => {
  it("accepts a switch in the loop when the lamp shines", () => {
    expect(meets("eine", [shut, lamp])).toBe(true);
  });
  it("rejects a switch that is open, so that the lamp stays dark", () => {
    expect(meets("eine", [open, lamp])).toBe(false);
  });
  it("rejects a loop without a lamp", () => {
    expect(meets("eine", [])).toBe(false);
    expect(meets("eine", [shut])).toBe(false);
  });
});

describe("diagnose", () => {
  it("says nothing for a circuit that meets the goal", () => {
    for (const goal of GOALS) expect(diagnose(goal, solution({ goal }))).toBeNull();
  });
  it("names the wrong number of lamps and switches", () => {
    expect(diagnose("reihe", [lamp])).toBe("lamps");
    expect(diagnose("schalter", [lamp])).toBe("switches");
    expect(diagnose("reihe", [lamp, lamp, lamp])).toBe("lamps");
    expect(diagnose("haupt", [{ kind: "parallel", branches: [[lamp], [lamp]] }])).toBe("switches");
  });
  it("names a short circuit and a dark lamp", () => {
    expect(diagnose("parallel", [{ kind: "parallel", branches: [[lamp], []] }, lamp])).toBe("short");
    expect(diagnose("parallel", [{ kind: "parallel", branches: [[lamp, lamp], []] }])).toBe("short");
    expect(diagnose("eine", [open, lamp])).toBe("dark");
  });
  it("names a circuit with the right parts that behaves differently", () => {
    expect(diagnose("reihe", [{ kind: "parallel", branches: [[lamp], [lamp]] }])).toBe("behaviour");
  });
});

describe("equivalent solutions", () => {
  // The goals say what the circuit must do, not how it is built: every build that does it counts.
  it("accepts a series circuit in any order and with a switch anywhere", () => {
    expect(meets("reihe", [lamp, lamp])).toBe(true);
    expect(meets("reihe", [shut, lamp, lamp])).toBe(true);
    expect(meets("reihe", [lamp, shut, lamp])).toBe(true);
    expect(meets("reihe", [lamp, lamp, shut])).toBe(true);
  });
  it("accepts parallel lamps with a switch in the main wire, in either branch order", () => {
    const branches = (a: Part[], b: Part[]): Circuit => [{ kind: "parallel", branches: [a, b] }];
    expect(meets("parallel", branches([lamp], [lamp]))).toBe(true);
    expect(meets("parallel", [shut, ...branches([lamp], [lamp])])).toBe(true);
    expect(meets("parallel", branches([lamp, shut], [shut, lamp]))).toBe(true);
  });
  it("accepts the lamp and the switch in either order, and the switch in the other half of the loop", () => {
    expect(meets("schalter", [shut, lamp])).toBe(true);
    expect(meets("schalter", [lamp, shut])).toBe(true);
    expect(meets("eine", [lamp, shut])).toBe(true);
  });
  it("accepts either lamp with its own switch in either branch, and either order inside the branch", () => {
    const branches = (a: Part[], b: Part[]): Circuit => [{ kind: "parallel", branches: [a, b] }];
    expect(meets("je-schalter", branches([shut, lamp], [shut, lamp]))).toBe(true);
    expect(meets("je-schalter", branches([lamp, shut], [shut, lamp]))).toBe(true);
  });
  it("accepts the common switch before or after the parallel lamps", () => {
    const parallel: Circuit = [{ kind: "parallel", branches: [[lamp], [lamp]] }];
    expect(meets("haupt", [shut, ...parallel])).toBe(true);
    expect(meets("haupt", [...parallel, shut])).toBe(true);
  });
});
