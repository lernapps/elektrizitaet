// Logic of the Ohm's law exercise: set voltages, record measuring points and name the unknown resistor.
import { fill, fmt, pick, random } from "./Fluss.ts";

/** The voltages the learner can set, in volts. */
export const STEPS: readonly number[] = [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12];
export const STOCK: readonly number[] = [10, 20, 30, 50, 100];
export const MAX = STEPS[STEPS.length - 1]!;

export interface Task {
  /** The hidden resistance in ohms. */
  ohm: number;
}
export interface Point {
  volts: number;
  amps: number;
}
export interface Answer {
  points: Point[];
  /** The resistance the learner names, null while none. */
  ohm: number | null;
}

export const generate = (seed: number, _props: object = {}): Task => ({ ohm: pick(random(seed), STOCK) });

/** The point measured at a voltage. */
export const measure = (task: Task, volts: number): Point => ({ volts, amps: volts / task.ohm });

/** At least three different voltages above zero measured, and the resistance named within half an ohm. */
export function check(task: Task, answer: Answer): boolean {
  const volts = new Set(answer.points.filter((p) => p.volts > 0).map((p) => p.volts));
  return volts.size >= 3 && answer.ohm !== null && Math.abs(answer.ohm - task.ohm) <= 0.5;
}

export const solution = (task: Task): Answer => ({
  points: [3, 6, 9].map((volts) => measure(task, volts)),
  ohm: task.ohm,
});
export const wrong = (_task: Task): Answer => ({ points: [], ohm: null });

/** Why an answer is wrong, for the hint under the feedback; null when it is right. */
export function diagnose(task: Task, answer: Answer): "points" | "answer" | "value" | null {
  if (check(task, answer)) return null;
  const volts = new Set(answer.points.filter((p) => p.volts > 0).map((p) => p.volts));
  if (volts.size < 3) return "points";
  return answer.ohm === null ? "answer" : "value";
}

interface DescribeProps {
  texts: Record<string, string>;
}
const WORDS: Record<string, { limits: string; solution: string }> = {
  de: {
    limits:
      "Die Batterie lässt sich von 0 bis 12 V in Schritten von 1,5 V einstellen. Das Voltmeter zeigt die Spannung am Widerstand, das Amperemeter die Stromstärke. Der Widerstand ist unbekannt.",
    solution:
      "Zum Beispiel bei 3 V, 6 V und 9 V messen. Bei 6 V zeigt das Amperemeter {I} A, also ist R = 6 V : {I} A = {R} Ω. Die Punkte liegen auf einer Geraden durch den Nullpunkt.",
  },
  en: {
    limits:
      "The battery can be set from 0 to 12 V in steps of 1.5 V. The voltmeter shows the voltage across the resistor, the ammeter the current. The resistor is unknown.",
    solution:
      "For example measure at 3 V, 6 V and 9 V. At 6 V the ammeter shows {I} A, so R = 6 V : {I} A = {R} Ω. The points lie on a straight line through the origin.",
  },
};

/** The task as the learner sees it, and its solution, in the language lang. */
export function describe(task: Task, props: DescribeProps, lang: string) {
  const words = WORDS[lang] ?? WORDS["de"]!;
  const sep = props.texts["decimal"]!;
  const values = { I: fmt(measure(task, 6).amps, 3, sep), R: String(task.ohm) };
  return {
    task: `${props.texts["task"]!}\n\n${words.limits}`,
    solution: fill(words.solution, values),
  };
}

export const about = {
  task: {
    de: "Du stellst Spannungen an einer Batterie ein, setzt Messpunkte in ein Diagramm und gibst den unbekannten Widerstand an.",
    en: "You set voltages on a battery, record measuring points in a plot and give the unknown resistance.",
  },
  answer: {
    de: "Mindestens drei Messpunkte bei verschiedenen Spannungen über 0 V (Regler, dann „Messpunkt setzen“) und der Widerstand in Ω als Zahl; dann „Prüfen“.",
    en: "At least three measuring points at different voltages above 0 V (slider, then “Record a measuring point”) and the resistance in Ω as a number; then “Check”.",
  },
  correct: {
    de: "Drei verschiedene Spannungen über 0 V sind gemessen, und der angegebene Widerstand weicht höchstens 0,5 Ω vom wahren ab. Welche Spannungen man wählt, ist egal.",
    en: "Three different voltages above 0 V are measured, and the resistance given is at most 0.5 Ω away from the true one. Which voltages you choose does not matter.",
  },
  mistakes: [
    {
      de: "Weniger als drei Messpunkte, oder dieselbe Spannung mehrfach, oder 0 V.",
      en: "Fewer than three measuring points, or the same voltage several times, or 0 V.",
    },
    {
      de: "Keinen Widerstand eingetragen.",
      en: "No resistance entered.",
    },
    {
      de: "Spannung geteilt durch Stromstärke falsch herum gerechnet (I : U statt U : I) oder die Stromstärke in mA nicht umgerechnet.",
      en: "Calculated voltage divided by current the wrong way round (I : U instead of U : I) or did not convert the current from mA.",
    },
  ],
};
