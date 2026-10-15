// Logic of the meter with its needle.
import { fmt } from "./Fluss.ts";

/** The turn of the needle in degrees: from -60 at zero to +60 at the end of the scale. */
export const needleAngle = (value: number, max: number) => -60 + 120 * Math.max(0, Math.min(1, value / max));

/** The text under the meter: the value with its unit, or a dash when the meter shows nothing. */
export const readingText = (blank: boolean, value: number, kind: "A" | "V", decimals: number, separator: string) =>
  blank ? "–" : `${fmt(value, decimals, separator)} ${kind}`;
