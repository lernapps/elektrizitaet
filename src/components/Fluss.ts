// Logic of the flow picture (the dots in the wires) and the helpers all interactive exercises share: seeded random
// numbers, rounding, number format and text filling.

/** A deterministic random number generator (mulberry32). */
export function random(seed: number): () => number {
  let s = Math.trunc(seed) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const pick = <T>(rand: () => number, xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!;

export const round = (x: number, decimals: number) => Math.round(x * 10 ** decimals) / 10 ** decimals;
/** Whether a value is exactly what its rounded display shows. */
export const nice = (x: number, decimals: number) => Math.abs(x - round(x, decimals)) < 1e-9;
/** Whether two values show the same when rounded to the decimals. */
export const same = (x: number, y: number, decimals: number) =>
  Math.abs(round(x, decimals) - round(y, decimals)) < 1e-9;

/** A number as text with the decimal separator of the language, without trailing zeros. */
export const fmt = (x: number, decimals: number, separator: string) =>
  String(Number(x.toFixed(decimals))).replace(".", separator);

/** Replaces {name} in a text by the values. */
export const fill = (text: string, values: Record<string, string>) =>
  Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, v), text);

/**
 * How the current looks: the dots lie closer and run faster the larger the current is, relative to the largest
 * current of the exercise. So the picture says "more" and "less" even when it stands still.
 */
export function flow(current: number, scale: number) {
  const level = Math.max(0, Math.min(1, current / scale));
  const gap = 46 - 36 * level;
  const speed = 12 + 90 * level;
  return { gap, period: gap + 0.1, seconds: (gap + 0.1) / speed };
}
