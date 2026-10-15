<script setup lang="ts">
import { computed, ref } from "vue";
import Fluss from "./Fluss.vue";
import Zeiger from "./Zeiger.vue";
import { fill, fmt } from "./Fluss.ts";
import { LENGTHS, TENTHS, VOLTS, check, current, generate } from "./DrahtLabor.ts";

interface Texts {
  board: string;
  length: string;
  thickness: string;
  summary: string;
  hint: string;
  taskLabel: string;
  task: string;
  reset: string;
  check: string;
  next: string;
  decimal: string;
}
const props = defineProps<{ texts: Texts }>();
const emit = defineEmits<{ answered: [{ correct: boolean }] }>();
defineOptions({ nojs: "caption" });

// The first render is the same on the server and in the browser: the task of the seed 1.
const seed = ref(1);
const task = computed(() => generate(seed.value));
const length = ref(generate(1).length);
const tenths = ref(generate(1).tenths);

const sep = computed(() => props.texts.decimal);
const start = computed(() => current(task.value.length, task.value.tenths));
const now = computed(() => current(length.value, tenths.value));
const scale = current(LENGTHS[0]!, TENTHS[TENTHS.length - 1]!);

// The wire is as long and as thick as the learner sets it: 30 units per metre, 6 units per tenth of a square millimetre.
const wire = computed(() => ({ width: 30 * length.value, height: 6 * tenths.value + 6 }));
const left = 110;

const taskText = computed(() =>
  fill(props.texts.task, { K: String(task.value.factor), I: fmt(start.value, 2, sep.value) }),
);
const summary = computed(() =>
  fill(props.texts.summary, {
    L: String(length.value),
    A: fmt(tenths.value / 10, 1, sep.value),
    I: fmt(now.value, 2, sep.value),
    V: fmt(VOLTS, 0, sep.value),
  }),
);
const reset = () => {
  length.value = task.value.length;
  tenths.value = task.value.tenths;
};
const next = () => {
  seed.value += 1;
  reset();
};
const verify = () => emit("answered", { correct: check(task.value, { length: length.value, tenths: tenths.value }) });
</script>

<template>
  <div class="dl">
    <p>
      <strong>{{ texts.taskLabel }}</strong> {{ taskText }}
    </p>
    <p>{{ texts.hint }}</p>

    <div class="dl-board" role="group" :aria-label="texts.board">
      <svg viewBox="0 0 400 270" aria-hidden="true" focusable="false">
        <rect width="400" height="270" fill="#fff" />
        <Fluss :d="`M50 128V40H${left}`" :current="now" :scale="scale" />
        <Fluss :d="`M${left + wire.width} 40H350V230H50V146`" :current="now" :scale="scale" />
        <path d="M30 128H70" stroke="#111" stroke-width="3" />
        <path d="M40 146H60" stroke="#111" stroke-width="7" />
        <text x="82" y="150" font-size="14" fill="#111">{{ fmt(VOLTS, 0, sep) }} V</text>
        <rect
          :x="left"
          :y="40 - wire.height / 2"
          :width="wire.width"
          :height="wire.height"
          rx="4"
          fill="#c9c9c9"
          stroke="#111"
          stroke-width="3"
        />
        <Fluss :d="`M${left} 40H${left + wire.width}`" :current="now" :scale="scale" colour="#c9c9c9" />
        <Zeiger :x="200" :y="150" kind="A" :value="now" :blank="false" :max="scale" :decimals="2" :separator="sep" />
      </svg>
    </div>

    <div class="dl-controls">
      <label>
        {{ texts.length }}: {{ length }} m
        <input v-model.number="length" type="range" :min="LENGTHS[0]" :max="LENGTHS[LENGTHS.length - 1]" step="1" />
      </label>
      <label>
        {{ texts.thickness }}: {{ fmt(tenths / 10, 1, sep) }} mm²
        <input v-model.number="tenths" type="range" :min="TENTHS[0]" :max="TENTHS[TENTHS.length - 1]" step="1" />
      </label>
    </div>
    <p role="status">{{ summary }}</p>
    <div class="dl-bar">
      <button type="button" @click="verify()">{{ texts.check }}</button>
      <button type="button" @click="reset()">{{ texts.reset }}</button>
      <button type="button" @click="next()">{{ texts.next }}</button>
    </div>
  </div>
</template>

<style scoped>
.dl-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.dl-bar button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
.dl-board {
  max-width: 28rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
  overflow: hidden;
}
.dl-board svg {
  display: block;
  width: 100%;
  height: auto;
}
.dl-controls {
  display: grid;
  gap: 0.5rem;
  max-width: 28rem;
  margin: 0.75rem 0;
}
.dl-controls label {
  display: grid;
  gap: 0.25rem;
}
.dl-controls input {
  width: 100%;
  min-height: 2.75rem;
}
</style>
