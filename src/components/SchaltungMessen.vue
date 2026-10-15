<script setup lang="ts">
import { computed, ref } from "vue";
import { SLOTS, STOCK, check, emptyBoard, generate, measure, type Board, type SlotId } from "./SchaltungMessen.ts";

interface Texts {
  battery: string;
  board: string;
  tools: string;
  toolWire: string;
  toolResistor: string;
  toolAmmeter: string;
  toolVoltmeter: string;
  hintWire: string;
  hintResistor: string;
  hintAmmeter: string;
  hintVoltmeter: string;
  slot: string;
  slotWire: string;
  slotResistor: string;
  ammeterIn: string;
  voltmeterAcross: string;
  readAmmeter: string;
  readVoltmeter: string;
  noReading: string;
  readings: string;
  short: string;
  bypass: string;
  taskLabel: string;
  taskStrom: string;
  taskSpannung: string;
  taskParallel: string;
  reset: string;
  check: string;
  next: string;
  decimal: string;
}

const props = defineProps<{ kinds: ("strom" | "spannung" | "parallel")[]; texts: Texts }>();
const emit = defineEmits<{ answered: [{ correct: boolean }] }>();
defineOptions({ nojs: "caption" });

type Tool = "wire" | "resistor" | "ammeter" | "voltmeter";

// Place of each slot on the board (viewBox 400 x 300) and the turn of its symbol.
const POS: Record<SlotId, { x: number; y: number; rot: number }> = {
  a: { x: 130, y: 50, rot: 0 },
  b: { x: 130, y: 250, rot: 0 },
  p: { x: 230, y: 150, rot: 90 },
  q: { x: 330, y: 150, rot: 90 },
};
// Where the ammeter of a place sits, and where its reading is written.
const AMMETER: Record<SlotId, { x: number; y: number; tx: number; ty: number; anchor: "middle" | "start" }> = {
  a: { x: 185, y: 50, tx: 185, ty: 78, anchor: "middle" },
  b: { x: 185, y: 250, tx: 185, ty: 278, anchor: "middle" },
  p: { x: 230, y: 95, tx: 246, ty: 99, anchor: "start" },
  q: { x: 330, y: 95, tx: 346, ty: 99, anchor: "start" },
};
// Where the voltmeter of a place sits, the dotted lines to the place and its reading.
const VOLTMETER: Record<SlotId, { x: number; y: number; path: string; tx: number; ty: number }> = {
  a: { x: 130, y: 92, path: "M104 50V92H116M144 92H156V50", tx: 130, ty: 124 },
  b: { x: 130, y: 208, path: "M104 250V208H116M144 208H156V250", tx: 130, ty: 240 },
  p: { x: 280, y: 150, path: "M230 120H280V136M280 164V180H230", tx: 280, ty: 198 },
  q: { x: 375, y: 150, path: "M330 120H375V136M375 164V180H330", tx: 375, ty: 198 },
};

// The first render is the same on the server and in the browser: the task of the seed 1.
const seed = ref(1);
const board = ref<Board>(emptyBoard());
const tool = ref<Tool>("resistor");
const ohm = ref(STOCK[1]!);

const task = computed(() => generate(seed.value, props));
const reading = computed(() => measure(board.value, task.value.volts));

const fmt = (x: number, decimals: number) => String(Number(x.toFixed(decimals))).replace(".", props.texts.decimal);
const fill = (text: string, values: Record<string, string>) =>
  Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, v), text);

const taskText = computed(() => {
  const t = props.texts;
  const u = fmt(task.value.volts, 0);
  const target = fmt(task.value.target, task.value.kind === "spannung" ? 2 : 3);
  const text = { strom: t.taskStrom, spannung: t.taskSpannung, parallel: t.taskParallel }[task.value.kind];
  return fill(text, { U: u, T: target });
});

const number = (id: SlotId) => SLOTS.indexOf(id) + 1;
const has = (id: SlotId) => board.value.slots[id] !== null;
const hasAmmeter = (id: SlotId) => board.value.ammeters.includes(id);
const hasVoltmeter = (id: SlotId) => board.value.voltmeters.includes(id);
const ampText = (id: SlotId) => {
  const x = reading.value.amps[id];
  return reading.value.short || x === undefined || x === null ? "–" : `${fmt(x, 3)} A`;
};
const voltText = (id: SlotId) => {
  const x = reading.value.volts[id];
  return reading.value.short || x === undefined ? "–" : `${fmt(x, 2)} V`;
};

const label = (id: SlotId) => {
  const t = props.texts;
  const what = has(id) ? fill(t.slotResistor, { n: String(board.value.slots[id]) }) : t.slotWire;
  const meters = [hasAmmeter(id) ? t.ammeterIn : "", hasVoltmeter(id) ? t.voltmeterAcross : ""].filter((s) => s !== "");
  return `${t.slot} ${number(id)}: ${[what, ...meters].join(", ")}`;
};

const toggle = (list: SlotId[], id: SlotId) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
function press(id: SlotId) {
  const b = board.value;
  if (tool.value === "wire") b.slots[id] = null;
  else if (tool.value === "resistor") b.slots[id] = ohm.value;
  else if (tool.value === "ammeter") b.ammeters = toggle(b.ammeters, id);
  else b.voltmeters = toggle(b.voltmeters, id);
}
const choose = (value: number) => {
  tool.value = "resistor";
  ohm.value = value;
};
const hint = computed(
  () =>
    props.texts[
      { wire: "hintWire", resistor: "hintResistor", ammeter: "hintAmmeter", voltmeter: "hintVoltmeter" }[
        tool.value
      ] as "hintWire"
    ],
);
const reset = () => {
  board.value = emptyBoard();
};
const next = () => {
  seed.value += 1;
  reset();
};
const verify = () => emit("answered", { correct: check(task.value, board.value) });
</script>

<template>
  <div class="mess">
    <p class="mess-task">
      <strong>{{ texts.taskLabel }}</strong> {{ taskText }}
    </p>

    <div class="mess-bar" role="group" :aria-label="texts.tools">
      <button
        v-for="value in STOCK"
        :key="value"
        type="button"
        :aria-pressed="tool === 'resistor' && ohm === value"
        @click="choose(value)"
      >
        {{ fill(texts.toolResistor, { n: String(value) }) }}
      </button>
      <button type="button" :aria-pressed="tool === 'wire'" @click="tool = 'wire'">{{ texts.toolWire }}</button>
      <button type="button" :aria-pressed="tool === 'ammeter'" @click="tool = 'ammeter'">
        {{ texts.toolAmmeter }}
      </button>
      <button type="button" :aria-pressed="tool === 'voltmeter'" @click="tool = 'voltmeter'">
        {{ texts.toolVoltmeter }}
      </button>
    </div>
    <p class="mess-hint">{{ hint }}</p>

    <div class="mess-board" role="group" :aria-label="texts.board">
      <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
        <rect width="400" height="300" fill="#fff" />
        <g fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 50H330M50 250H330M50 50V126M50 174V250M230 50V250M330 50V250" />
          <path d="M32 134H68" />
          <path d="M20 152H80" stroke-width="7" />
          <circle cx="230" cy="50" r="4" fill="#111" />
          <circle cx="230" cy="250" r="4" fill="#111" />
          <circle cx="330" cy="50" r="4" fill="#111" />
          <circle cx="330" cy="250" r="4" fill="#111" />
          <template v-for="id in SLOTS" :key="id">
            <g :transform="`translate(${POS[id].x} ${POS[id].y}) rotate(${POS[id].rot})`">
              <rect
                v-if="!has(id)"
                x="-26"
                y="-26"
                width="52"
                height="52"
                rx="8"
                stroke-dasharray="5 5"
                stroke-width="2"
                stroke="#777"
              />
              <template v-else>
                <rect x="-26" y="-26" width="52" height="52" rx="8" fill="#fff" stroke="#bbb" stroke-width="1.5" />
                <path d="M-26 0H-24M24 0H26" />
                <rect x="-24" y="-10" width="48" height="20" fill="#fff" />
              </template>
            </g>
            <g v-if="hasAmmeter(id)">
              <circle :cx="AMMETER[id].x" :cy="AMMETER[id].y" r="14" fill="#fff" />
              <text
                :x="AMMETER[id].x"
                :y="AMMETER[id].y + 6"
                text-anchor="middle"
                font-size="17"
                font-weight="bold"
                fill="#111"
                stroke="none"
              >
                A
              </text>
            </g>
            <g v-if="hasVoltmeter(id)">
              <path :d="VOLTMETER[id].path" stroke-dasharray="4 4" stroke-width="2" />
              <circle :cx="VOLTMETER[id].x" :cy="VOLTMETER[id].y" r="14" fill="#fff" />
              <text
                :x="VOLTMETER[id].x"
                :y="VOLTMETER[id].y + 6"
                text-anchor="middle"
                font-size="17"
                font-weight="bold"
                fill="#111"
                stroke="none"
              >
                V
              </text>
            </g>
          </template>
        </g>
        <g fill="#111" font-family="sans-serif" font-size="14" stroke="none">
          <text x="90" y="156">{{ texts.battery }} {{ fmt(task.volts, 0) }} V</text>
          <template v-for="id in SLOTS" :key="id">
            <text
              v-if="has(id)"
              :x="POS[id].x"
              :y="POS[id].y + (POS[id].rot === 0 ? 5 : 43)"
              text-anchor="middle"
              font-size="13"
            >
              {{ board.slots[id] }} Ω
            </text>
            <text
              v-if="hasAmmeter(id)"
              :x="AMMETER[id].tx"
              :y="AMMETER[id].ty"
              :text-anchor="AMMETER[id].anchor"
              font-size="13"
            >
              {{ ampText(id) }}
            </text>
            <text
              v-if="hasVoltmeter(id)"
              :x="VOLTMETER[id].tx"
              :y="VOLTMETER[id].ty"
              text-anchor="middle"
              font-size="13"
            >
              {{ voltText(id) }}
            </text>
          </template>
        </g>
      </svg>
      <button
        v-for="id in SLOTS"
        :key="id"
        type="button"
        class="mess-slot"
        :style="{ left: `${(POS[id].x / 400) * 100}%`, top: `${(POS[id].y / 300) * 100}%` }"
        :aria-label="label(id)"
        @click="press(id)"
      ></button>
    </div>

    <p v-if="reading.short" class="mess-warn" role="status">{{ texts.short }}</p>
    <p v-else-if="reading.bypass" class="mess-warn" role="status">{{ texts.bypass }}</p>
    <div role="status">
      <p class="mess-readings">{{ texts.readings }}</p>
      <ul>
        <li v-for="id in SLOTS.filter(hasAmmeter)" :key="`a${id}`">
          {{ fill(texts.readAmmeter, { n: String(number(id)), v: ampText(id) }) }}
        </li>
        <li v-for="id in SLOTS.filter(hasVoltmeter)" :key="`v${id}`">
          {{ fill(texts.readVoltmeter, { n: String(number(id)), v: voltText(id) }) }}
        </li>
      </ul>
      <p v-if="board.ammeters.length === 0 && board.voltmeters.length === 0">{{ texts.noReading }}</p>
    </div>

    <div class="mess-bar">
      <button type="button" @click="verify()">{{ texts.check }}</button>
      <button type="button" @click="reset()">{{ texts.reset }}</button>
      <button type="button" @click="next()">{{ texts.next }}</button>
    </div>
  </div>
</template>

<style scoped>
.mess-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.mess-bar button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
.mess-bar button[aria-pressed="true"] {
  font-weight: bold;
  outline: 3px solid currentColor;
  outline-offset: 1px;
}
.mess-board {
  position: relative;
  max-width: 28rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
  overflow: hidden;
}
.mess-board svg {
  display: block;
  width: 100%;
  height: auto;
}
.mess-slot {
  position: absolute;
  width: 14%;
  min-width: 2.75rem;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  background: transparent;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
}
.mess-slot:hover {
  background: rgba(0, 90, 220, 0.12);
}
.mess-slot:focus-visible {
  outline: 3px solid #0050d0;
  outline-offset: 1px;
}
.mess-warn {
  font-weight: bold;
}
</style>
