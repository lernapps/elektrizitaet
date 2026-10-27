<script setup lang="ts">
// A circuit board for the task of the number seed: the learner builds a circuit of lamps, switches and wires and tests
// it with the power on. It is the input of the task: it emits the circuit with answer each time the learner changes
// the board (undefined until the first change and after "Zurücksetzen"), and the explainer draws "Prüfen", checks it
// with SchaltungBauen.ts and gives the feedback. Once the circuit is checked (checked), the power is on.
import { computed, ref, watch } from "vue";
import Fluss from "./Fluss.vue";
import {
  SLOTS,
  emptySlots,
  flows,
  fromSlots,
  generate,
  lampSlots,
  simulate,
  type Circuit,
  type Slots,
  type SlotId,
} from "./SchaltungBauen.ts";

interface Texts {
  battery: string;
  board: string;
  boardSimple: string;
  tools: string;
  toolWire: string;
  toolLamp: string;
  toolSwitch: string;
  hintOff: string;
  hintOn: string;
  powerOn: string;
  powerOff: string;
  slot: string;
  slotEmpty: string;
  slotLamp: string;
  slotLampOut: string;
  slotSwitchClosed: string;
  slotSwitchOpen: string;
  status: string;
  statusOff: string;
  short: string;
  /** The app's messages for the typical mistakes, which reason in SchaltungBauen.ts gives. */
  whyLamps: string;
  whySwitches: string;
  whyShort: string;
  whyDark: string;
  whyBehaviour: string;
  taskLabel: string;
  reset: string;
  goalEine: string;
  goalSchalter: string;
  goalReihe: string;
  goalParallel: string;
  goalJeSchalter: string;
  goalHaupt: string;
}

const props = defineProps<{
  seed: number;
  goals: ("eine" | "schalter" | "reihe" | "parallel" | "je-schalter" | "haupt")[];
  texts: Texts;
  /** Whether the explainer checked the circuit the board gives now. */
  checked: boolean;
}>();
const emit = defineEmits<{ answer: [Circuit | undefined] }>();

type Tool = "wire" | "lamp" | "switch";

// Place of each slot on the board (viewBox 400 x 300) and the turn of its symbol. The goals with one loop only get
// a board with two places in it; the goals with parallel lamps get the board with two branches.
const PARALLEL: Record<SlotId, { x: number; y: number; rot: number }> = {
  m1: { x: 130, y: 40, rot: 0 },
  m2: { x: 130, y: 260, rot: 0 },
  p1a: { x: 220, y: 105, rot: 90 },
  p1b: { x: 220, y: 195, rot: 90 },
  p2a: { x: 330, y: 105, rot: 90 },
  p2b: { x: 330, y: 195, rot: 90 },
};
const SIMPLE: Partial<Record<SlotId, { x: number; y: number; rot: number }>> = {
  m1: { x: 150, y: 40, rot: 0 },
  m2: { x: 270, y: 40, rot: 0 },
};

const slots = ref<Slots>(emptySlots());
const tool = ref<Tool>("lamp");
const powered = ref(false);

const task = computed(() => generate(props.seed, props));
const simple = computed(() => ["eine", "schalter", "reihe"].includes(task.value.goal));
const places = computed(() => (simple.value ? (["m1", "m2"] as SlotId[]) : [...SLOTS]));
const POS = computed(() => (simple.value ? SIMPLE : PARALLEL) as Record<SlotId, { x: number; y: number; rot: number }>);
const circuit = computed(() => fromSlots(slots.value));
const sim = computed(() => simulate(circuit.value));
const flow = computed(() => (powered.value ? flows(slots.value, sim.value) : { total: 0, first: 0, second: 0 }));
const litSlots = computed(() =>
  powered.value ? lampSlots(slots.value).filter((_, i) => sim.value.lit.includes(i)) : [],
);

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
const status = computed(() =>
  powered.value ? props.texts.status.replace("{n}", String(litSlots.value.length)) : props.texts.statusOff,
);

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
  return `${t.slot} ${places.value.indexOf(id) + 1}: ${what}`;
};

function press(id: SlotId) {
  const part = slots.value[id];
  // With the power on, a tap tests: it flips a switch and unscrews or screws in a lamp.
  if (powered.value) {
    if (part?.kind === "switch") part.closed = !part.closed;
    else if (part?.kind === "lamp") part.out = part.out !== true;
  }
  // While building, a tap puts the chosen part in place; the switch tool also flips a switch that is already there.
  else if (tool.value === "switch" && part?.kind === "switch") part.closed = !part.closed;
  else
    slots.value[id] =
      tool.value === "wire" ? null : tool.value === "lamp" ? { kind: "lamp" } : { kind: "switch", closed: true };
  // the answer: the circuit as it is now, a copy without Vue's proxies
  emit("answer", JSON.parse(JSON.stringify(circuit.value)) as Circuit);
}
const reset = () => {
  slots.value = emptySlots();
  powered.value = false;
  emit("answer", undefined);
};
watch(() => props.seed, reset);
// "Prüfen" switches the power on, so that the lamps shine as the circuit lets them.
watch(
  () => props.checked,
  (checked) => {
    if (checked) powered.value = true;
  },
);
</script>

<template>
  <div class="bau">
    <p class="bau-task">
      <strong>{{ texts.taskLabel }}</strong> {{ goalText }}
    </p>

    <div class="bau-bar" role="group" :aria-label="texts.tools">
      <button type="button" :aria-pressed="tool === 'lamp'" :disabled="powered" @click="tool = 'lamp'">
        {{ texts.toolLamp }}
      </button>
      <button type="button" :aria-pressed="tool === 'switch'" :disabled="powered" @click="tool = 'switch'">
        {{ texts.toolSwitch }}
      </button>
      <button type="button" :aria-pressed="tool === 'wire'" :disabled="powered" @click="tool = 'wire'">
        {{ texts.toolWire }}
      </button>
      <button type="button" class="bau-power" :aria-pressed="powered" @click="powered = !powered">
        {{ powered ? texts.powerOff : texts.powerOn }}
      </button>
    </div>
    <p class="bau-hint">{{ powered ? texts.hintOn : texts.hintOff }}</p>

    <div class="bau-board" role="group" :aria-label="simple ? texts.boardSimple : texts.board">
      <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
        <rect width="400" height="300" fill="#fff" />
        <g fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="simple">
            <Fluss d="M50 126V40H330V260H50V174" :current="flow.total" :scale="1.5" />
          </template>
          <template v-else>
            <Fluss d="M50 126V40H220" :current="flow.total" :scale="1.5" />
            <Fluss d="M220 40H330" :current="flow.second" :scale="1.5" />
            <Fluss d="M220 40V260" :current="flow.first" :scale="1.5" />
            <Fluss d="M330 40V260" :current="flow.second" :scale="1.5" />
            <Fluss d="M330 260H220" :current="flow.second" :scale="1.5" />
            <Fluss d="M220 260H50V174" :current="flow.total" :scale="1.5" />
          </template>
          <path d="M20 134H80" />
          <path d="M32 152H68" stroke-width="7" />
          <template v-for="id in places" :key="id">
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
                  <circle v-if="isLit(id)" r="24" fill="#ffd400" opacity="0.35" stroke="none" />
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
        v-for="id in places"
        :key="id"
        type="button"
        class="bau-slot"
        :style="{ left: `${(POS[id].x / 400) * 100}%`, top: `${(POS[id].y / 300) * 100}%` }"
        :aria-label="label(id)"
        @click="press(id)"
      ></button>
    </div>

    <p class="bau-status" role="status">{{ status }}</p>
    <p v-if="powered && sim.short" class="bau-short" role="status">{{ texts.short }}</p>
    <div class="bau-bar">
      <button type="button" @click="reset()">{{ texts.reset }}</button>
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
