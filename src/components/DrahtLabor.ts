// Logic of the wire exercise: set the length and the thickness of a wire so that the current gets k times as large.
// DrahtLabor.vue is the input of the task; the explainer checks an answer with check and gives the message of reason.
// describe states a task and its solution, about what the exercise is; template, params, mistakes and show give a
// tutor the task once and each number's inputs and outputs.
import { fill, fmt, pick, random, round } from "./Fluss.ts";

export const LENGTHS: readonly number[] = [1, 2, 3, 4, 5, 6];
/** The thickness of the wire in tenths of a square millimetre, to keep the numbers exact. */
export const TENTHS: readonly number[] = [1, 2, 3, 4, 5];
/** The specific resistance of the wire (constantan) in ohm square millimetres per metre. */
export const RHO = 0.5;
export const VOLTS = 3;

export interface Task {
  /** The wire the exercise starts with. */
  length: number;
  tenths: number;
  /** How many times as large the current has to get. */
  factor: number;
}
export interface Answer {
  length: number;
  tenths: number;
}

/** The resistance of the wire in ohms. */
export const resistance = (length: number, tenths: number) => (RHO * length) / (tenths / 10);
/** The current in amperes at the source of the exercise. */
export const current = (length: number, tenths: number) => VOLTS / resistance(length, tenths);

export function generate(seed: number, _props: object = {}): Task {
  const rand = random(seed);
  return { length: pick(rand, [4, 5, 6]), tenths: pick(rand, [1, 2]), factor: pick(rand, [2, 3, 4]) };
}

export const check = (task: Task, answer: Answer): boolean =>
  current(answer.length, answer.tenths) >= task.factor * current(task.length, task.tenths) - 1e-9;

/** The shortest, thickest wire. */
export const solution = (_task: Task): Answer => ({ length: LENGTHS[0]!, tenths: TENTHS[TENTHS.length - 1]! });
/** The wire the exercise starts with. */
export const wrong = (task: Task): Answer => ({ length: task.length, tenths: task.tenths });

/** How many times as large the current of the answer is as the current of the start wire. */
export const ratio = (task: Task, answer: Answer) =>
  current(answer.length, answer.tenths) / current(task.length, task.tenths);

/** Why an answer is wrong, for the app's message; null when it is right. */
export function diagnose(task: Task, answer: Answer): "same" | "less" | null {
  if (check(task, answer)) return null;
  return answer.length === task.length && answer.tenths === task.tenths ? "same" : "less";
}

interface DescribeProps {
  texts: Record<string, string>;
}

/** The app's message for a wrong answer, the text why… of the page for its mistake; undefined for a right one. */
export function reason(task: Task, answer: Answer, props: DescribeProps, _lang?: string): string | undefined {
  const why = diagnose(task, answer);
  const t = props.texts;
  if (why === null) return undefined;
  if (why === "same") return t["whySame"];
  return fill(t["whyLess"]!, { X: fmt(ratio(task, answer), 1, t["decimal"]!), K: String(task.factor) });
}
const WORDS: Record<string, { limits: string; solution: string }> = {
  de: {
    limits:
      "Der Draht ist am Anfang {L} m lang und {A} mm² dick. Du kannst die Länge von 1 bis 6 m und die Dicke von 0,1 bis 0,5 mm² einstellen. Die Batterie hat 3 V.",
    solution:
      "Ein kürzerer oder dickerer Draht hat weniger Widerstand, also fließt mehr Strom: halb so lang oder doppelt so dick gibt den doppelten Strom. Zum Beispiel 1 m lang und 0,5 mm² dick: dann fließt das {X}-Fache.",
  },
  en: {
    limits:
      "The wire is {L} m long and {A} mm² thick at the start. You can set the length from 1 to 6 m and the thickness from 0.1 to 0.5 mm². The battery has 3 V.",
    solution:
      "A shorter or thicker wire has less resistance, so more current flows: half as long or twice as thick gives twice the current. For example 1 m long and 0.5 mm² thick: then {X} times as much flows.",
  },
};

/** The task as the learner sees it, and its solution, in the language lang. */
export function describe(task: Task, props: DescribeProps, lang: string) {
  const words = WORDS[lang] ?? WORDS["de"]!;
  const sep = props.texts["decimal"]!;
  const best = solution(task);
  const values = {
    K: String(task.factor),
    I: fmt(current(task.length, task.tenths), 2, sep),
    L: String(task.length),
    A: fmt(task.tenths / 10, 1, sep),
    X: fmt(ratio(task, best), 0, sep),
  };
  return {
    task: `${fill(props.texts["task"]!, values)}\n\n${fill(words.limits, values)}`,
    solution: fill(words.solution, values),
  };
}

const SHOW: Record<string, string> = {
  de: "{L} m lang, {A} mm² dick",
  en: "{L} m long, {A} mm² thick",
};

/** The task as a learner reads it, with {I}, {K}, {L} and {A}: the prop task and the wire at the start. */
export function template(props: DescribeProps, lang: string): string {
  return `${props.texts["task"]!} ${(WORDS[lang] ?? WORDS["de"]!).limits}`;
}

/** What sets a task: the current at the start, the factor, and the length and the thickness of the start wire. */
export function params(task: Task, _props: DescribeProps, _lang: string): Record<string, number> {
  return {
    I: round(current(task.length, task.tenths), 2),
    K: task.factor,
    L: task.length,
    A: round(task.tenths / 10, 1),
  };
}

/**
 * The answer of each typical mistake of about.mistakes: nothing changed, the start wire; a longer or thinner wire, and
 * a change too small, have many answers.
 */
export function mistakes(task: Task, _props?: DescribeProps): (Answer | undefined)[] {
  return [wrong(task), undefined, undefined];
}

/** An answer as the learner gives it: the wire set. */
export function show(answer: Answer, _task: Task, props: DescribeProps, lang: string): string {
  return fill(SHOW[lang] ?? SHOW["de"]!, {
    L: String(answer.length),
    A: fmt(answer.tenths / 10, 1, props.texts["decimal"]!),
  });
}

export const about = {
  task: {
    de: "Du stellst Länge und Dicke eines Drahts mit zwei Reglern ein, bis der Strom mindestens ein Vielfaches des Anfangsstroms ist.",
    en: "You set the length and the thickness of a wire with two sliders until the current is at least a multiple of the starting current.",
  },
  answer: {
    de: "Die Länge (1 bis 6 m) und die Dicke (0,1 bis 0,5 mm²) des Drahts, mit den beiden Reglern eingestellt; dann „Prüfen“ unter dem Labor.",
    en: "The length (1 to 6 m) and the thickness (0.1 to 0.5 mm²) of the wire, set with the two sliders; then “Check” below the lab.",
  },
  correct: {
    de: "Der Strom ist mindestens so viel mal so groß wie am Anfang, wie die Aufgabe verlangt. Jeder Draht, der das schafft, zählt: kürzer, dicker oder beides.",
    en: "The current is at least as many times as large as at the start as the task asks. Any wire that manages it counts: shorter, thicker or both.",
  },
  mistakes: [
    {
      de: "Nichts verändert: der Strom ist noch genauso groß wie am Anfang.",
      en: "Nothing changed: the current is still as large as at the start.",
    },
    {
      de: "Den Draht länger oder dünner gemacht: der Widerstand wird größer und der Strom kleiner.",
      en: "Made the wire longer or thinner: the resistance gets larger and the current smaller.",
    },
    {
      de: "Zu wenig verändert: halb so lang gibt erst den doppelten Strom, für das Dreifache oder Vierfache braucht es mehr.",
      en: "Changed too little: half as long gives only twice the current; three or four times needs more.",
    },
  ],
};
