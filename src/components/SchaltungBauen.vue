<script setup lang="ts">
import { computed, ref } from "vue";
import {
  SLOTS,
  check,
  emptySlots,
  fromSlots,
  generate,
  lampSlots,
  simulate,
  type Slots,
  type SlotId,
} from "./SchaltungBauen.ts";

interface Texts {
  battery: string;
  board: string;
  tools: string;
  toolWire: string;
  toolLamp: string;
  toolSwitch: string;
  modes: string;
  modeBuild: string;
  modeTest: string;
  hintBuild: string;
  hintTest: string;
  slot: string;
  slotEmpty: string;
  slotLamp: string;
  slotLampOut: string;
  slotSwitchClosed: string;
  slotSwitchOpen: string;
  status: string;
  short: string;
  taskLabel: string;
  reset: string;
  check: string;
  next: string;
  goalEine: string;
  goalSchalter: string;
  goalReihe: string;
  goalParallel: string;
  goalJeSchalter: string;
  goalHaupt: string;
}

const props = defineProps<{
  goals: ("eine" | "schalter" | "reihe" | "parallel" | "je-schalter" | "haupt")[];
  texts: Texts;
}>();
const emit = defineEmits<{ answered: [{ correct: boolean }] }>();
defineOptions({ nojs: "caption" });

type Tool = "wire" | "lamp" | "switch";

// Place of each slot on the board (viewBox 400 x 300) and the turn of its symbol.
const POS: Record<SlotId, { x: number; y: number; rot: number }> = {
  m1: { x: 130, y: 40, rot: 0 },
  m2: { x: 130, y: 260, rot: 0 },
  p1a: { x: 220, y: 105, rot: 90 },
  p1b: { x: 220, y: 195, rot: 90 },
  p2a: { x: 330, y: 105, rot: 90 },
  p2b: { x: 330, y: 195, rot: 90 },
};

// The first render is the same on the server and in the browser: the task of the seed 1.
const seed = ref(1);
const slots = ref<Slots>(emptySlots());
const tool = ref<Tool>("lamp");
const mode = ref<"build" | "test">("build");

const task = computed(() => generate(seed.value, props));
const circuit = computed(() => fromSlots(slots.value));
const sim = computed(() => simulate(circuit.value));
const litSlots = computed(() => lampSlots(slots.value).filter((_, i) => sim.value.lit.includes(i)));

const goalText = computed(() => {
  const t = props.texts;
  return {
    eine: t.goalEine,
    schalter: t.goalSchalter,
    reihe: t.goalReihe,
    parallel: t.goalParallel,
    "je-schalter": t.goalJeSchalter,
    haupt: t.goalHaupt,
  }[task.value.goal];
});
const status = computed(() => props.texts.status.replace("{n}", String(litSlots.value.length)));

const kind = (id: SlotId) => slots.value[id]?.kind ?? "wire";
const isLit = (id: SlotId) => litSlots.value.includes(id);
const isOut = (id: SlotId) => {
  const part = slots.value[id];
  return part?.kind === "lamp" && part.out === true;
};
const isClosed = (id: SlotId) => {
  const part = slots.value[id];
  return part?.kind === "switch" && part.closed;
};
const label = (id: SlotId) => {
  const t = props.texts;
  const what =
    kind(id) === "lamp"
      ? isOut(id)
        ? t.slotLampOut
        : t.slotLamp
      : kind(id) === "switch"
        ? isClosed(id)
          ? t.slotSwitchClosed
          : t.slotSwitchOpen
        : t.slotEmpty;
  return `${t.slot} ${SLOTS.indexOf(id) + 1}: ${what}`;
};

function press(id: SlotId) {
  const part = slots.value[id];
  if (mode.value === "test") {
    if (part?.kind === "switch") part.closed = !part.closed;
    else if (part?.kind === "lamp") part.out = part.out !== true;
    return;
  }
  slots.value[id] =
    tool.value === "wire" ? null : tool.value === "lamp" ? { kind: "lamp" } : { kind: "switch", closed: true };
}
const reset = () => {
  slots.value = emptySlots();
};
const next = () => {
  seed.value += 1;
  reset();
};
const verify = () => emit("answered", { correct: check(task.value, circuit.value) });
</script>

<template>
  <div class="bau">
    <p class="bau-task">
      <strong>{{ texts.taskLabel }}</strong> {{ goalText }}
    </p>

    <div class="bau-bar" role="group" :aria-label="texts.tools">
      <button type="button" :aria-pressed="tool === 'lamp'" @click="tool = 'lamp'">{{ texts.toolLamp }}</button>
      <button type="button" :aria-pressed="tool === 'switch'" @click="tool = 'switch'">{{ texts.toolSwitch }}</button>
      <button type="button" :aria-pressed="tool === 'wire'" @click="tool = 'wire'">{{ texts.toolWire }}</button>
    </div>
    <div class="bau-bar" role="group" :aria-label="texts.modes">
      <button type="button" :aria-pressed="mode === 'build'" @click="mode = 'build'">{{ texts.modeBuild }}</button>
      <button type="button" :aria-pressed="mode === 'test'" @click="mode = 'test'">{{ texts.modeTest }}</button>
    </div>
    <p class="bau-hint">{{ mode === "build" ? texts.hintBuild : texts.hintTest }}</p>

    <div class="bau-board" role="group" :aria-label="texts.board">
      <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
        <rect width="400" height="300" fill="#fff" />
        <g fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 40H330M50 260H330M50 40V126M50 174V260M220 40V260M330 40V260" />
          <path d="M32 134H68" />
          <path d="M20 152H80" stroke-width="7" />
          <template v-for="id in SLOTS" :key="id">
            <g :transform="`translate(${POS[id].x} ${POS[id].y}) rotate(${POS[id].rot})`">
              <rect
                v-if="kind(id) === 'wire'"
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
                <template v-if="kind(id) === 'lamp'">
                  <path d="M-26 0H-14M14 0H26" />
                  <circle
                    r="14"
                    :fill="isLit(id) ? '#ffd400' : '#fff'"
                    :stroke-dasharray="isOut(id) ? '4 4' : undefined"
                  />
                  <path d="M-9 -9L9 9M9 -9L-9 9" />
                </template>
                <template v-else>
                  <path d="M-26 0H-14M14 0H26" />
                  <circle cx="-14" r="3.5" fill="#111" />
                  <circle cx="14" r="3.5" fill="#111" />
                  <path v-if="isClosed(id)" d="M-14 0H14" stroke-width="4" />
                  <path v-else d="M-14 0L10 -16" stroke-width="4" />
                </template>
              </template>
            </g>
          </template>
        </g>
        <text x="90" y="156" font-size="15" fill="#111">{{ texts.battery }}</text>
      </svg>
      <button
        v-for="id in SLOTS"
        :key="id"
        type="button"
        class="bau-slot"
        :style="{ left: `${(POS[id].x / 400) * 100}%`, top: `${(POS[id].y / 300) * 100}%` }"
        :aria-label="label(id)"
        @click="press(id)"
      ></button>
    </div>

    <p class="bau-status" role="status">{{ status }}</p>
    <p v-if="sim.short" class="bau-short" role="status">{{ texts.short }}</p>
    <div class="bau-bar">
      <button type="button" @click="verify()">{{ texts.check }}</button>
      <button type="button" @click="reset()">{{ texts.reset }}</button>
      <button type="button" @click="next()">{{ texts.next }}</button>
    </div>
  </div>
</template>

<style scoped>
.bau-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.bau-bar button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
.bau-bar button[aria-pressed="true"] {
  font-weight: bold;
  outline: 3px solid currentColor;
  outline-offset: 1px;
}
.bau-board {
  position: relative;
  max-width: 28rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
  overflow: hidden;
}
.bau-board svg {
  display: block;
  width: 100%;
  height: auto;
}
.bau-slot {
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
.bau-slot:hover {
  background: rgba(0, 90, 220, 0.12);
}
.bau-slot:focus-visible {
  outline: 3px solid #0050d0;
  outline-offset: 1px;
}
.bau-short {
  font-weight: bold;
}
</style>
