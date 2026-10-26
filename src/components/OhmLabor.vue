<script setup lang="ts">
// The Ohm's law lab for the task of the number seed: set voltages, record measuring points and name the unknown
// resistor. It is the input of the task: it emits the points and the resistance typed with answer (undefined until the
// learner records a point or types), and the explainer draws "Prüfen", checks it with OhmLabor.ts and gives the
// feedback; Enter in the field checks too.
import { computed, ref, watch } from "vue";
import Fluss from "./Fluss.vue";
import Zeiger from "./Zeiger.vue";
import { fill, fmt } from "./Fluss.ts";
import { MAX, STEPS, STOCK, generate, measure, type Answer, type Point } from "./OhmLabor.ts";

interface Texts {
  board: string;
  plot: string;
  voltage: string;
  record: string;
  points: string;
  resistance: string;
  hint: string;
  taskLabel: string;
  task: string;
  /** The app's messages for the typical mistakes, which reason in OhmLabor.ts gives. */
  whyPoints: string;
  whyAnswer: string;
  whyValue: string;
  reset: string;
  decimal: string;
}
const props = defineProps<{ seed: number; texts: Texts }>();
const emit = defineEmits<{ answer: [Answer | undefined] }>();

// The explainer gives the seed: the number of the task.
const task = computed(() => generate(props.seed, props));
const step = ref(0);
const points = ref<Point[]>([]);
const typed = ref("");

const sep = computed(() => props.texts.decimal);
const volts = computed(() => STEPS[step.value]!);
const now = computed(() => measure(task.value, volts.value));
const top = computed(() => MAX / STOCK[0]!);
const named = computed(() => {
  const x = Number(typed.value.replace(",", "."));
  return typed.value.trim() === "" || Number.isNaN(x) ? null : x;
});

// The plot: 25 units per volt to the right, up to the largest current of the exercise, 190 units high.
const X0 = 60;
const Y0 = 225;
const px = (v: number) => X0 + 25 * v;
// The scale of the current grows with the points; it must not depend on the resistor, which would give it away.
const yMax = computed(() => Math.max(0.1, ...points.value.map((p) => p.amps)) * 1.2);
const py = (a: number) => Y0 - (190 * a) / yMax.value;
const xTicks = [0, 3, 6, 9, 12];
const yTicks = computed(() => [0, 1, 2, 3, 4].map((i) => (i / 4) * yMax.value));

const taskText = computed(() => props.texts.task);
const recordedText = computed(() => fill(props.texts.points, { n: String(points.value.length) }));
const record = () => {
  if (volts.value > 0 && !points.value.some((p) => p.volts === volts.value)) points.value.push(now.value);
};
const reset = () => {
  step.value = 0;
  points.value = [];
  typed.value = "";
};
watch(() => props.seed, reset);
// The answer: the points recorded and the resistance typed; none while the learner has done neither.
watch(
  [points, named],
  () => {
    const started = points.value.length > 0 || typed.value.trim() !== "";
    emit("answer", started ? { points: points.value.map((p) => ({ ...p })), ohm: named.value } : undefined);
  },
  { deep: true },
);
</script>

<template>
  <div class="ol">
    <p>
      <strong>{{ texts.taskLabel }}</strong> {{ taskText }}
    </p>
    <p>{{ texts.hint }}</p>

    <div class="ol-board" role="group" :aria-label="texts.board">
      <svg viewBox="0 0 400 230" aria-hidden="true" focusable="false">
        <rect width="400" height="230" fill="#fff" />
        <Fluss d="M50 108V30H170" :current="now.amps" :scale="top" />
        <Fluss d="M230 30H350V200H50V126" :current="now.amps" :scale="top" />
        <path d="M30 108H70" stroke="#111" stroke-width="3" />
        <path d="M40 126H60" stroke="#111" stroke-width="7" />
        <rect x="170" y="18" width="60" height="24" fill="#fff" stroke="#111" stroke-width="3" />
        <text x="200" y="35" text-anchor="middle" font-size="16" font-weight="bold" fill="#111">?</text>
        <path d="M170 30V70H200M200 70H230V30" fill="none" stroke="#111" stroke-width="2" stroke-dasharray="5 4" />
        <Zeiger
          :x="200"
          :y="105"
          kind="V"
          :value="now.volts"
          :blank="false"
          :max="MAX"
          :decimals="1"
          :separator="sep"
        />
        <Zeiger :x="350" :y="115" kind="A" :value="now.amps" :blank="false" :max="top" :decimals="3" :separator="sep" />
      </svg>
    </div>

    <label class="ol-row">
      {{ texts.voltage }} {{ fmt(volts, 1, sep) }} V
      <input v-model.number="step" type="range" min="0" :max="STEPS.length - 1" step="1" />
    </label>
    <div class="ol-bar">
      <button type="button" @click="record()">{{ texts.record }}</button>
    </div>

    <div class="ol-board" role="img" :aria-label="`${texts.plot} ${recordedText}`">
      <svg viewBox="0 0 400 270" aria-hidden="true" focusable="false">
        <rect width="400" height="270" fill="#fff" />
        <g stroke="#111" stroke-width="2" fill="none">
          <path :d="`M${X0} ${Y0}V20M${X0} ${Y0}H380`" />
          <path v-for="t in xTicks" :key="`x${t}`" :d="`M${px(t)} ${Y0}v6`" />
          <path v-for="(t, i) in yTicks" :key="`y${i}`" :d="`M${X0 - 6} ${py(t)}h6`" />
        </g>
        <g font-size="12" fill="#111" text-anchor="middle">
          <text v-for="t in xTicks" :key="`xt${t}`" :x="px(t)" :y="Y0 + 20">{{ t }}</text>
          <text v-for="(t, i) in yTicks" :key="`yt${i}`" :x="X0 - 10" :y="py(t) + 4" text-anchor="end">
            {{ fmt(t, 2, sep) }}
          </text>
          <text :x="380" :y="Y0 + 40" font-size="14" font-weight="bold" text-anchor="end">U in V</text>
          <text :x="X0 + 8" y="14" font-size="14" font-weight="bold" text-anchor="start">I in A</text>
        </g>
        <circle v-for="p in points" :key="p.volts" :cx="px(p.volts)" :cy="py(p.amps)" r="6" fill="#b00020" />
      </svg>
    </div>

    <p role="status">{{ recordedText }}</p>
    <label class="ol-row">
      {{ texts.resistance }}
      <input v-model="typed" type="text" inputmode="decimal" size="6" />
    </label>
    <div class="ol-bar">
      <button type="button" @click="reset()">{{ texts.reset }}</button>
    </div>
  </div>
</template>

<style scoped>
.ol-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.ol-bar button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
.ol-board {
  max-width: 28rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
  overflow: hidden;
  margin: 0.5rem 0;
}
.ol-board svg {
  display: block;
  width: 100%;
  height: auto;
}
.ol-row {
  display: grid;
  gap: 0.25rem;
  max-width: 28rem;
  margin: 0.5rem 0;
}
.ol-row input[type="range"] {
  width: 100%;
  min-height: 2.75rem;
}
.ol-row input[type="text"] {
  min-height: 2.75rem;
  max-width: 10rem;
}
</style>
