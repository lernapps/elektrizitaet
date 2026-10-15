import { describe, expect, it } from "vite-plus/test";
import { check, emptyBoard, generate, measure, solution, wrong, type Board, type Kind } from "./SchaltungMessen.ts";

const KINDS: Kind[] = ["strom", "spannung", "parallel"];
const board = (b: {
  slots?: Partial<Board["slots"]>;
  ammeters?: Board["ammeters"];
  voltmeters?: Board["voltmeters"];
}): Board => {
  const base = emptyBoard();
  return { ...base, ...b, slots: { ...base.slots, ...b.slots } };
};
const near = (x: number | null | undefined, y: number) => expect(x).toBeCloseTo(y, 9);

describe("measure", () => {
  it("shows the same current everywhere in a series circuit and shares the voltage", () => {
    const r = measure(board({ slots: { a: 10, b: 30 }, ammeters: ["a", "b"], voltmeters: ["a", "b"] }), 12);
    near(r.total, 0.3);
    near(r.amps.a, 0.3);
    near(r.amps.b, 0.3);
    near(r.volts.a, 3);
    near(r.volts.b, 9);
  });
  it("gives each branch the full voltage and adds the branch currents", () => {
    const r = measure(board({ slots: { p: 20, q: 30 }, ammeters: ["a", "p", "q"], voltmeters: ["p", "q"] }), 12);
    near(r.total, 1);
    near(r.amps.a, 1);
    near(r.amps.p, 0.6);
    near(r.amps.q, 0.4);
    near(r.volts.p, 12);
    near(r.volts.q, 12);
  });
  it("combines a series resistor with a parallel section", () => {
    const r = measure(board({ slots: { a: 20, p: 30, q: 60 }, voltmeters: ["a", "p"] }), 12);
    near(r.total, 0.3);
    near(r.volts.a, 6);
    near(r.volts.p, 6);
  });
  it("calls a loop without resistor a short circuit and reads nothing", () => {
    expect(measure(board({ ammeters: ["a"] }), 12).short).toBe(true);
    expect(measure(board({ slots: { p: null, q: null }, ammeters: ["a"] }), 12).total).toBeNull();
  });
  it("lets a bare branch bypass the resistor in the other branch", () => {
    const r = measure(board({ slots: { a: 30, p: 20 }, ammeters: ["p", "q"], voltmeters: ["p"] }), 12);
    expect(r.bypass).toBe(true);
    near(r.total, 0.4);
    near(r.amps.p, 0);
    near(r.amps.q, 0.4);
    near(r.volts.p, 0);
  });
  it("leaves the split undefined when both branches are bare but the loop still has a resistor", () => {
    const r = measure(board({ slots: { a: 30 }, ammeters: ["p"] }), 12);
    near(r.total, 0.4);
    expect(r.amps.p).toBeNull();
  });
});

describe("generate", () => {
  it("gives the same task for the same seed", () => {
    for (const kind of KINDS) expect(generate(7, { kinds: [kind] })).toEqual(generate(7, { kinds: [kind] }));
  });
  it("draws the kinds in turn and copes with none", () => {
    expect(new Set([0, 1, 2].map((seed) => generate(seed, { kinds: KINDS }).kind)).size).toBe(3);
    expect(generate(1, { kinds: [] }).kind).toBe("strom");
  });
  it("varies the values from seed to seed", () => {
    for (const kind of KINDS) {
      const targets = new Set(
        Array.from({ length: 60 }, (_, i) => generate(i, { kinds: [kind] })).map((t) => `${t.volts}/${t.target}`),
      );
      expect(targets.size).toBeGreaterThan(5);
    }
  });
  it("has a solution, no solution on the empty board, and round targets, for 300 seeds of each kind", () => {
    for (const kind of KINDS)
      for (let seed = 0; seed < 300; seed++) {
        const task = generate(seed, { kinds: [kind] });
        expect(check(task, solution(task)), `${kind} ${seed}`).toBe(true);
        expect(check(task, wrong(task)), `${kind} ${seed}`).toBe(false);
        const digits = kind === "spannung" ? 2 : 3;
        expect(Math.abs(task.target * 10 ** digits - Math.round(task.target * 10 ** digits))).toBeLessThan(1e-6);
        if (kind === "spannung") expect(task.target).toBeLessThan(task.volts);
      }
  });
});

describe("check", () => {
  it("accepts another board that shows the same current", () => {
    const task = { kind: "strom" as const, volts: 12, target: 0.4, answer: emptyBoard() };
    expect(check(task, board({ slots: { a: 30 }, ammeters: ["a"] }))).toBe(true);
    expect(check(task, board({ slots: { a: 10, b: 20 }, ammeters: ["b"] }))).toBe(true);
    expect(check(task, board({ slots: { p: 60, q: 60 }, ammeters: ["a"] }))).toBe(true);
  });
  it("rejects a value read in a branch for a current in the main wire", () => {
    const task = { kind: "strom" as const, volts: 12, target: 0.6, answer: emptyBoard() };
    expect(check(task, board({ slots: { p: 20, q: 30 }, ammeters: ["p"] }))).toBe(false);
  });
  it("rejects a board without the meter", () => {
    const task = { kind: "strom" as const, volts: 12, target: 0.4, answer: emptyBoard() };
    expect(check(task, board({ slots: { a: 30 } }))).toBe(false);
  });
  it("needs a resistor under the voltmeter for a voltage", () => {
    const task = { kind: "spannung" as const, volts: 12, target: 4, answer: emptyBoard() };
    expect(check(task, board({ slots: { a: 10, b: 20 }, voltmeters: ["a"] }))).toBe(true);
    expect(check(task, board({ slots: { a: 10, b: 20 }, voltmeters: ["b"] }))).toBe(false);
  });
  it("needs a resistor in both branches for the parallel task", () => {
    const task = { kind: "parallel" as const, volts: 12, target: 0.4, answer: emptyBoard() };
    expect(check(task, board({ slots: { p: 60, q: 60 }, ammeters: ["a"] }))).toBe(true);
    expect(check(task, board({ slots: { p: 100, q: 50 }, ammeters: ["a"] }))).toBe(false);
    expect(check(task, board({ slots: { a: 30, p: 60 }, ammeters: ["a"] }))).toBe(false);
  });
});
