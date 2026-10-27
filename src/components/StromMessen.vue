<script setup lang="ts">
// A circuit with a battery and a resistor for the task of the number seed: build the ammeter in and choose the
// resistor. It is the input of the task: it emits the place and the resistor with answer (undefined until the learner
// changes either), and the explainer draws "Prüfen", checks it with StromMessen.ts and gives the feedback. Once the
// answer is checked (checked), the power is on and the ammeter shows what it measures.
import { computed, ref, watch } from "vue";
import Fluss from "./Fluss.vue";
import Zeiger from "./Zeiger.vue";
import { fill, fmt } from "./Fluss.ts";
import { STOCK, generate, measure, type Answer, type Spot } from "./StromMessen.ts";

interface Texts {
  board: string;
  resistors: string;
  resistor: string;
  spot: string;
  spotA: string;
  spotB: string;
  spotPar: string;
  spotFree: string;
  spotTaken: string;
  hint: string;
  short: string;
  ammeter: string;
  noAmmeter: string;
  taskLabel: string;
  task: string;
  /** The app's messages for the typical mistakes, which reason in StromMessen.ts gives. */
  whyAmmeter: string;
  whyShort: string;
  whyValue: string;
  reset: string;
  decimal: string;
  switchOn: string;
  switchOff: string;
  off: string;
}
const props = defineProps<{
  seed: number;
  texts: Texts;
  /** Whether the explainer checked the answer the circuit gives now. */
  checked: boolean;
}>();
const emit = defineEmits<{ answer: [Answer | undefined] }>();

// The explainer gives the seed: the number of the task.
const task = computed(() => generate(props.seed, props));
const spot = ref<Spot>(null);
const powered = ref(false);
const ohm = ref(task.value.start);

const answer = computed(() => ({ spot: spot.value, ohm: ohm.value }));
const reading = computed(() => measure(task.value.volts, answer.value));
// Nothing flows and no meter shows anything until the power is on.
const current = computed(() => (powered.value ? reading.value.loop : 0));
const shown = computed(() => (powered.value ? reading.value.ammeter : null));
const scale = computed(() => task.value.volts / STOCK[0]!);
const sep = computed(() => props.texts.decimal);

const POS = { a: { x: 130, y: 40 }, b: { x: 200, y: 230 }, par: { x: 100, y: 135 } };
const NAMES = computed(() => ({ a: props.texts.spotA, b: props.texts.spotB, par: props.texts.spotPar }));
const spots = ["a", "b", "par"] as const;

const taskText = computed(() =>
  fill(props.texts.task, { U: fmt(task.value.volts, 0, sep.value), T: fmt(task.value.target, 3, sep.value) }),
);
const spotLabel = (id: (typeof spots)[number]) =>
  `${props.texts.spot} ${spots.indexOf(id) + 1}: ${NAMES.value[id]}, ${spot.value === id ? props.texts.spotTaken : props.texts.spotFree}`;
const press = (id: (typeof spots)[number]) => {
  spot.value = spot.value === id ? null : id;
  emit("answer", { ...answer.value });
};
const readingText = computed(() =>
  !powered.value
    ? props.texts.off
    : reading.value.short
      ? props.texts.short
      : reading.value.ammeter === null
        ? props.texts.noAmmeter
        : fill(props.texts.ammeter, { v: `${fmt(reading.value.ammeter, 3, sep.value)} A` }),
);
// The answer: the place and the resistor, given when the learner changes either; none again after "Zurücksetzen".
const choose = (value: number) => {
  ohm.value = value;
  emit("answer", { ...answer.value });
};
const reset = () => {
  powered.value = false;
  spot.value = null;
  ohm.value = task.value.start;
  emit("answer", undefined);
};
watch(() => props.seed, reset);
// "Prüfen" switches the power on, so that the ammeter shows what it measures.
watch(
  () => props.checked,
  (checked) => {
    if (checked) powered.value = true;
  },
);
</script>

<template>
  <div class="sm">
    <p>
      <strong>{{ texts.taskLabel }}</strong> {{ taskText }}
    </p>
    <p class="sm-hint">{{ texts.hint }}</p>

    <div class="sm-board" role="group" :aria-label="texts.board">
      <svg viewBox="0 0 400 310" aria-hidden="true" focusable="false">
        <rect width="400" height="310" fill="#fff" />
        <Fluss d="M50 128V40H220" :current="current" :scale="scale" />
        <Fluss d="M280 40H350V230H50V146" :current="current" :scale="scale" />
        <Fluss v-if="powered && reading.short" d="M100 40V230" :current="scale * 4" :scale="scale" colour="#b00020" />
        <path d="M30 128H70" stroke="#111" stroke-width="3" />
        <path d="M40 146H60" stroke="#111" stroke-width="7" />
        <text x="82" y="150" font-size="14" fill="#111">{{ fmt(task.volts, 0, sep) }} V</text>
        <rect x="220" y="28" width="60" height="24" fill="#fff" stroke="#111" stroke-width="3" />
        <text x="250" y="20" text-anchor="middle" font-size="14" fill="#111">{{ ohm }} Ω</text>
        <template v-for="(id, i) in spots" :key="id">
          <circle
            v-if="spot !== id"
            :cx="POS[id].x"
            :cy="POS[id].y"
            r="18"
            fill="#fff"
            stroke="#666"
            stroke-width="2"
            stroke-dasharray="5 4"
          />
          <text v-if="spot !== id" :x="POS[id].x" :y="POS[id].y + 5" text-anchor="middle" font-size="14" fill="#444">
            {{ i + 1 }}
          </text>
        </template>
        <Zeiger
          v-if="spot !== null"
          :x="POS[spot].x"
          :y="POS[spot].y"
          kind="A"
          :value="shown ?? 0"
          :blank="shown === null"
          :max="scale"
          :decimals="3"
          :separator="sep"
        />
      </svg>
      <button
        v-for="id in spots"
        :key="id"
        type="button"
        class="sm-spot"
        :style="{ left: `${(POS[id].x / 400) * 100}%`, top: `${(POS[id].y / 310) * 100}%` }"
        :aria-label="spotLabel(id)"
        @click="press(id)"
      ></button>
    </div>

    <div class="sm-bar" role="group" :aria-label="texts.resistors">
      <button v-for="value in STOCK" :key="value" type="button" :aria-pressed="ohm === value" @click="choose(value)">
        {{ fill(texts.resistor, { n: String(value) }) }}
      </button>
    </div>
    <p role="status" :class="{ 'sm-warn': powered && reading.short }">{{ readingText }}</p>
    <div class="sm-bar">
      <button type="button" :aria-pressed="powered" @click="powered = !powered">
        {{ powered ? texts.switchOff : texts.switchOn }}
      </button>
      <button type="button" @click="reset()">{{ texts.reset }}</button>
    </div>
  </div>
</template>

<style scoped>
.sm-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.sm-bar button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
.sm-bar button[aria-pressed="true"] {
  font-weight: bold;
  outline: 3px solid currentColor;
  outline-offset: 1px;
}
.sm-board {
  position: relative;
  max-width: 28rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
  overflow: hidden;
}
.sm-board svg {
  display: block;
  width: 100%;
  height: auto;
}
.sm-spot {
  position: absolute;
  width: 16%;
  min-width: 2.75rem;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}
.sm-spot:hover {
  background: rgba(0, 90, 220, 0.12);
}
.sm-spot:focus-visible {
  outline: 3px solid #0050d0;
  outline-offset: 1px;
}
.sm-warn {
  font-weight: bold;
}
</style>
