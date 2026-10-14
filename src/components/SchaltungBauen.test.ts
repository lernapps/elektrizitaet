import { describe, expect, it } from "vite-plus/test";
import {
  check,
  generate,
  indexed,
  meets,
  simulate,
  solution,
  wrong,
  type Circuit,
  type Goal,
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
  it("numbers lamps and switches in the order of the loop", () => {
    const view = indexed([lamp, { kind: "parallel", branches: [[shut, lamp], [lamp]] }]);
    expect(view[0]).toMatchObject({ kind: "lamp", i: 0 });
    expect(view[1]).toMatchObject({ kind: "parallel" });
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
