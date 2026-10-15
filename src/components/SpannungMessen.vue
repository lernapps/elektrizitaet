<script setup lang="ts">
import { computed, ref } from "vue";
import Fluss from "./Fluss.vue";
import Zeiger from "./Zeiger.vue";
import { fill, fmt } from "./Fluss.ts";
import { NODES, check, current, generate, measure, potentials, type Node } from "./SpannungMessen.ts";

interface Texts {
  board: string;
  node: string;
  nodeFirst: string;
  nodeBoth: string;
  hint: string;
  voltmeter: string;
  noVoltmeter: string;
  taskLabel: string;
  task: string;
  reset: string;
  check: string;
  next: string;
  decimal: string;
  switchOn: string;
  switchOff: string;
  off: string;
}
const props = defineProps<{ texts: Texts }>();
const emit = defineEmits<{ answered: [{ correct: boolean }] }>();

// The first render is the same on the server and in the browser: the task of the seed 1.
const seed = ref(1);
const task = computed(() => generate(seed.value));
const from = ref<Node | null>(null);
const to = ref<Node | null>(null);
const powered = ref(false);

const answer = computed(() => ({ from: from.value, to: to.value }));
const shown = computed(() => measure(task.value, answer.value));
const level = computed(() => potentials(task.value));
// Nothing flows and the voltmeter shows nothing until the power is on.
const amps = computed(() => (powered.value ? current(task.value) : 0));
const scale = computed(() => task.value.volts / 20);
const sep = computed(() => props.texts.decimal);

// A wire is the redder the higher its voltage against the minus pole, the bluer the lower.
const colour = (node: Node) => `hsl(${Math.round(220 * (1 - level.value[node] / task.value.volts))} 75% 38%)`;
const POS: Record<Node, { x: number; y: number }> = {
  n0: { x: 85, y: 40 },
  n1: { x: 210, y: 40 },
  n2: { x: 325, y: 40 },
  n3: { x: 200, y: 230 },
};
const METER = { x: 200, y: 135 };

const taskText = computed(() =>
  fill(props.texts.task, { U: fmt(task.value.volts, 0, sep.value), T: fmt(task.value.target, 2, sep.value) }),
);
const nodeLabel = (n: Node) => {
  const chosen = from.value === n ? props.texts.nodeFirst : to.value === n ? props.texts.nodeBoth : "";
  return `${props.texts.node} ${NODES.indexOf(n) + 1}${chosen === "" ? "" : `, ${chosen}`}`;
};
function press(n: Node) {
  if (from.value === null || to.value !== null) {
    from.value = n;
    to.value = null;
  } else if (n !== from.value) to.value = n;
}
const status = computed(() =>
  shown.value === null
    ? props.texts.noVoltmeter
    : !powered.value
      ? props.texts.off
      : fill(props.texts.voltmeter, { v: `${fmt(shown.value, 2, sep.value)} V` }),
);
const reset = () => {
  powered.value = false;
  from.value = null;
  to.value = null;
};
const next = () => {
  seed.value += 1;
  reset();
};
const verify = () => {
  powered.value = true;
  emit("answered", { correct: check(task.value, answer.value) });
};
</script>

<template>
  <div class="sp">
    <p>
      <strong>{{ texts.taskLabel }}</strong> {{ taskText }}
    </p>
    <p class="sp-hint">{{ texts.hint }}</p>

    <div class="sp-board" role="group" :aria-label="texts.board">
      <svg viewBox="0 0 400 310" aria-hidden="true" focusable="false">
        <rect width="400" height="310" fill="#fff" />
        <Fluss d="M50 128V40H120" :current="amps" :scale="scale" :colour="colour('n0')" />
        <Fluss d="M180 40H240" :current="amps" :scale="scale" :colour="colour('n1')" />
        <Fluss d="M300 40H350V230H50V146" :current="amps" :scale="scale" :colour="colour('n2')" />
        <path d="M30 128H70" stroke="#111" stroke-width="3" />
        <path d="M40 146H60" stroke="#111" stroke-width="7" />
        <rect x="120" y="28" width="60" height="24" fill="#fff" stroke="#111" stroke-width="3" />
        <rect x="240" y="28" width="60" height="24" fill="#fff" stroke="#111" stroke-width="3" />
        <text x="150" y="20" text-anchor="middle" font-size="14" fill="#111">{{ task.r1 }} Ω</text>
        <text x="270" y="20" text-anchor="middle" font-size="14" fill="#111">{{ task.r2 }} Ω</text>
        <text x="82" y="150" font-size="14" fill="#111">{{ fmt(task.volts, 0, sep) }} V</text>
        <g v-if="from !== null" stroke="#111" stroke-width="2" stroke-dasharray="5 4">
          <path :d="`M${METER.x} ${METER.y}L${POS[from].x} ${POS[from].y}`" />
          <path v-if="to !== null" :d="`M${METER.x} ${METER.y}L${POS[to].x} ${POS[to].y}`" />
        </g>
        <Zeiger
          v-if="to !== null"
          :x="METER.x"
          :y="METER.y"
          kind="V"
          :value="shown ?? 0"
          :blank="shown === null || !powered"
          :max="task.volts"
          :decimals="2"
          :separator="sep"
        />
        <template v-for="(n, i) in NODES" :key="n">
          <circle
            :cx="POS[n].x"
            :cy="POS[n].y"
            r="13"
            fill="#fff"
            stroke="#111"
            :stroke-width="from === n || to === n ? 4 : 2"
          />
          <text :x="POS[n].x" :y="POS[n].y + 5" text-anchor="middle" font-size="14" font-weight="bold" fill="#111">
            {{ i + 1 }}
          </text>
        </template>
      </svg>
      <button
        v-for="n in NODES"
        :key="n"
        type="button"
        class="sp-node"
        :style="{ left: `${(POS[n].x / 400) * 100}%`, top: `${(POS[n].y / 310) * 100}%` }"
        :aria-label="nodeLabel(n)"
        @click="press(n)"
      ></button>
    </div>

    <p role="status">{{ status }}</p>
    <div class="sp-bar">
      <button type="button" :aria-pressed="powered" @click="powered = !powered">
        {{ powered ? texts.switchOff : texts.switchOn }}
      </button>
      <button type="button" @click="verify()">{{ texts.check }}</button>
      <button type="button" @click="reset()">{{ texts.reset }}</button>
      <button type="button" @click="next()">{{ texts.next }}</button>
    </div>
  </div>
</template>

<style scoped>
.sp-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.sp-bar button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
.sp-board {
  position: relative;
  max-width: 28rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
  overflow: hidden;
}
.sp-board svg {
  display: block;
  width: 100%;
  height: auto;
}
.sp-node {
  position: absolute;
  width: 12%;
  min-width: 2.75rem;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}
.sp-node:hover {
  background: rgba(0, 90, 220, 0.12);
}
.sp-node:focus-visible {
  outline: 3px solid #0050d0;
  outline-offset: 1px;
}
</style>
