<script setup lang="ts">
import { computed, ref } from "vue";
import Fluss from "./Fluss.vue";
import Zeiger from "./Zeiger.vue";
import { fill, fmt } from "./Fluss.ts";
import { branches, check, decimals, generate, unit } from "./SchaltungVorhersage.ts";

interface Texts {
  board: string;
  prediction: string;
  on: string;
  off: string;
  right: string;
  wrong: string;
  taskReiheStrom: string;
  taskReiheSpannung: string;
  taskParallelGesamt: string;
  taskParallelZweig: string;
  taskLabel: string;
  reset: string;
  check: string;
  next: string;
  decimal: string;
}
const props = defineProps<{
  kinds: ("reihe-strom" | "reihe-spannung" | "parallel-gesamt" | "parallel-zweig")[];
  texts: Texts;
}>();
const emit = defineEmits<{ answered: [{ correct: boolean }] }>();
defineOptions({ nojs: "caption" });

// The first render is the same on the server and in the browser: the task of the seed 1.
const seed = ref(1);
const task = computed(() => generate(seed.value, props));
const typed = ref("");
const on = ref(false);
const result = ref<boolean | null>(null);

const sep = computed(() => props.texts.decimal);
const series = computed(() => task.value.kind.startsWith("reihe"));
const volts = computed(() => task.value.volts);
const loop = computed(() => (series.value ? volts.value / (task.value.r1 + task.value.r2) : 0));
const split = computed(() => branches(task.value));
const total = computed(() => split.value.first + split.value.second);
const scale = computed(() => (series.value ? volts.value / 20 : (2 * volts.value) / 10));
// Without current the circuit is switched off: no dots, the needle at zero.
const flowOf = (x: number) => (on.value ? x : 0);
const shown = computed(() => (on.value ? task.value.value : 0));
const named = computed(() => {
  const x = Number(typed.value.replace(",", "."));
  return typed.value.trim() === "" || Number.isNaN(x) ? null : x;
});

const taskText = computed(() => {
  const t = props.texts;
  const text = {
    "reihe-strom": t.taskReiheStrom,
    "reihe-spannung": t.taskReiheSpannung,
    "parallel-gesamt": t.taskParallelGesamt,
    "parallel-zweig": t.taskParallelZweig,
  }[task.value.kind];
  return fill(text, { U: fmt(volts.value, 0, sep.value), R1: String(task.value.r1), R2: String(task.value.r2) });
});
const label = computed(() => `${props.texts.prediction} (${unit(task.value.kind)})`);
const feedback = computed(() => {
  if (result.value === null) return "";
  const text = fill(result.value ? props.texts.right : props.texts.wrong, {
    v: `${fmt(task.value.value, decimals(task.value.kind), sep.value)} ${unit(task.value.kind)}`,
  });
  return text;
});
const reset = () => {
  typed.value = "";
  on.value = false;
  result.value = null;
};
const next = () => {
  seed.value += 1;
  reset();
};
function verify() {
  if (named.value === null) {
    result.value = null;
    return;
  }
  on.value = true;
  result.value = check(task.value, { value: named.value });
  emit("answered", { correct: result.value });
}
</script>

<template>
  <div class="sv">
    <p>
      <strong>{{ texts.taskLabel }}</strong> {{ taskText }}
    </p>

    <div class="sv-board" role="group" :aria-label="texts.board">
      <svg v-if="series" viewBox="0 0 400 310" aria-hidden="true" focusable="false">
        <rect width="400" height="310" fill="#fff" />
        <Fluss d="M50 128V40H120" :current="flowOf(loop)" :scale="scale" />
        <Fluss d="M180 40H240" :current="flowOf(loop)" :scale="scale" />
        <Fluss d="M300 40H350V230H50V146" :current="flowOf(loop)" :scale="scale" />
        <path d="M30 128H70" stroke="#111" stroke-width="3" />
        <path d="M40 146H60" stroke="#111" stroke-width="7" />
        <text x="82" y="150" font-size="14" fill="#111">{{ fmt(volts, 0, sep) }} V</text>
        <rect x="120" y="28" width="60" height="24" fill="#fff" stroke="#111" stroke-width="3" />
        <rect x="240" y="28" width="60" height="24" fill="#fff" stroke="#111" stroke-width="3" />
        <text x="150" y="20" text-anchor="middle" font-size="14" fill="#111">{{ task.r1 }} Ω</text>
        <text x="270" y="20" text-anchor="middle" font-size="14" fill="#111">{{ task.r2 }} Ω</text>
        <Zeiger
          v-if="task.kind === 'reihe-strom'"
          :x="200"
          :y="230"
          kind="A"
          :value="shown"
          :blank="!on"
          :max="scale"
          :decimals="3"
          :separator="sep"
        />
        <template v-else>
          <path d="M240 40L270 130M300 40L270 130" stroke="#111" stroke-width="2" stroke-dasharray="5 4" />
          <Zeiger :x="270" :y="130" kind="V" :value="shown" :blank="!on" :max="volts" :decimals="2" :separator="sep" />
        </template>
      </svg>
      <svg v-else viewBox="0 0 400 320" aria-hidden="true" focusable="false">
        <rect width="400" height="320" fill="#fff" />
        <Fluss d="M50 128V40H200" :current="flowOf(total)" :scale="scale" />
        <Fluss d="M200 40H320" :current="flowOf(split.second)" :scale="scale" />
        <Fluss d="M200 40V270" :current="flowOf(split.first)" :scale="scale" />
        <Fluss d="M320 40V270" :current="flowOf(split.second)" :scale="scale" />
        <Fluss d="M320 270H200" :current="flowOf(split.second)" :scale="scale" />
        <Fluss d="M200 270H50V146" :current="flowOf(total)" :scale="scale" />
        <path d="M30 128H70" stroke="#111" stroke-width="3" />
        <path d="M40 146H60" stroke="#111" stroke-width="7" />
        <text x="82" y="150" font-size="14" fill="#111">{{ fmt(volts, 0, sep) }} V</text>
        <rect x="188" y="100" width="24" height="56" fill="#fff" stroke="#111" stroke-width="3" />
        <rect x="308" y="100" width="24" height="56" fill="#fff" stroke="#111" stroke-width="3" />
        <text x="176" y="132" text-anchor="end" font-size="14" fill="#111">{{ task.r1 }} Ω</text>
        <text x="296" y="132" text-anchor="end" font-size="14" fill="#111">{{ task.r2 }} Ω</text>
        <circle cx="200" cy="40" r="4" fill="#111" />
        <circle cx="200" cy="270" r="4" fill="#111" />
        <Zeiger
          v-if="task.kind === 'parallel-gesamt'"
          :x="110"
          :y="40"
          kind="A"
          :value="shown"
          :blank="!on"
          :max="scale"
          :decimals="3"
          :separator="sep"
        />
        <Zeiger
          v-else
          :x="320"
          :y="205"
          kind="A"
          :value="shown"
          :blank="!on"
          :max="scale"
          :decimals="3"
          :separator="sep"
        />
      </svg>
    </div>

    <label class="sv-row">
      {{ label }}
      <input v-model="typed" type="text" inputmode="decimal" size="8" :disabled="on" />
    </label>
    <p role="status">
      <template v-if="result === null">{{ on ? texts.on : texts.off }}</template>
      <template v-else>{{ feedback }}</template>
    </p>
    <div class="sv-bar">
      <button type="button" :disabled="on" @click="verify()">{{ texts.check }}</button>
      <button type="button" @click="reset()">{{ texts.reset }}</button>
      <button type="button" @click="next()">{{ texts.next }}</button>
    </div>
  </div>
</template>

<style scoped>
.sv-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.sv-bar button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
.sv-board {
  max-width: 28rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
  overflow: hidden;
}
.sv-board svg {
  display: block;
  width: 100%;
  height: auto;
}
.sv-row {
  display: grid;
  gap: 0.25rem;
  max-width: 28rem;
  margin: 0.75rem 0;
}
.sv-row input {
  min-height: 2.75rem;
  max-width: 10rem;
}
</style>
