// Logic of the Ohm's law exercise: set voltages, record measuring points and name the unknown resistor. OhmLabor.vue is
// the input of the task; the explainer checks an answer with check and gives the message of reason. describe states a
// task and its solution, about what the exercise is; template, params, mistakes and show give a tutor the task once and
// each number's inputs and outputs, the resistor hidden, as the learner does not see it.
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

/** Why an answer is wrong, for the app's message; null when it is right. */
export function diagnose(task: Task, answer: Answer): "points" | "answer" | "value" | null {
  if (check(task, answer)) return null;
  const volts = new Set(answer.points.filter((p) => p.volts > 0).map((p) => p.volts));
  if (volts.size < 3) return "points";
  return answer.ohm === null ? "answer" : "value";
}

interface DescribeProps {
  texts: Record<string, string>;
}

/** The app's message for a wrong answer, the text why… of the page for its mistake; undefined for a right one. */
export function reason(task: Task, answer: Answer, props: DescribeProps, _lang?: string): string | undefined {
  const why = diagnose(task, answer);
  if (why === null) return undefined;
  return { points: props.texts["whyPoints"], answer: props.texts["whyAnswer"], value: props.texts["whyValue"] }[why];
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

const SHOW: Record<string, { points: string; none: string; and: string; empty: string }> = {
  de: { points: "Messpunkte bei {V}", none: "keine Messpunkte", and: " und ", empty: "kein Widerstand" },
  en: { points: "measuring points at {V}", none: "no measuring points", and: " and ", empty: "no resistance" },
};

/** The task as a learner reads it: the prop task and the limits of the board; the resistor is not in it. */
export function template(props: DescribeProps, lang: string): string {
  return `${props.texts["task"]!} ${(WORDS[lang] ?? WORDS["de"]!).limits}`;
}

/** What sets a task: the resistor, which the learner does not see. */
export function params(task: Task, _props: DescribeProps, _lang: string): Record<string, number> {
  return { R: task.ohm };
}

/**
 * The answer of each typical mistake of about.mistakes: too few points and no resistance have many answers; the
 * resistance calculated the wrong way round, I : U, with the points of the solution.
 */
export function mistakes(task: Task, _props?: DescribeProps): (Answer | undefined)[] {
  return [undefined, undefined, { points: solution(task).points, ohm: 1 / task.ohm }];
}

/** An answer as the learner gives it: the voltages measured and the resistance, in the language lang. */
export function show(answer: Answer, _task: Task, props: DescribeProps, lang: string): string {
  const words = SHOW[lang] ?? SHOW["de"]!;
  const sep = props.texts["decimal"]!;
  const volts = [...new Set(answer.points.map((p) => p.volts))].map((v) => `${fmt(v, 1, sep)} V`);
  const points =
    volts.length === 0
      ? words.none
      : fill(words.points, {
          V: volts.length === 1 ? volts[0]! : `${volts.slice(0, -1).join(", ")}${words.and}${volts.at(-1)!}`,
        });
  const ohm = answer.ohm === null ? words.empty : `R = ${fmt(answer.ohm, 3, sep)} Ω`;
  return `${points}; ${ohm}`;
}

export const about = {
  task: {
    de: "Du stellst Spannungen an einer Batterie ein, setzt Messpunkte in ein Diagramm und gibst den unbekannten Widerstand an.",
    en: "You set voltages on a battery, record measuring points in a plot and give the unknown resistance.",
  },
  answer: {
    de: "Mindestens drei Messpunkte bei verschiedenen Spannungen über 0 V (Regler, dann „Messpunkt setzen“) und der Widerstand in Ω als Zahl im Feld darunter; dann „Prüfen“ unter dem Labor.",
    en: "At least three measuring points at different voltages above 0 V (slider, then “Record a measuring point”) and the resistance in Ω as a number in the field below; then “Check” below the lab.",
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
