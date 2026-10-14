<script setup lang="ts">
import { computed, ref } from "vue";
import { check, generate, indexed, simulate, type Circuit, type Part } from "./SchaltungBauen.ts";

interface Texts {
  battery: string;
  lamp: string;
  lampLit: string;
  lampDark: string;
  switchClosed: string;
  switchOpen: string;
  unscrew: string;
  screwIn: string;
  addLamp: string;
  addSwitch: string;
  addParallel: string;
  addBranch: string;
  remove: string;
  removeBranch: string;
  parallelGroup: string;
  branch: string;
  circuit: string;
  taskLabel: string;
  short: string;
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

const MAX_TOP = 6;
const MAX_BRANCHES = 3;
const MAX_BRANCH = 3;

// The first render is the same on the server and in the browser: the task of the seed 1.
const seed = ref(1);
const circuit = ref<Circuit>([]);
const task = computed(() => generate(seed.value, props));
const view = computed(() => indexed(circuit.value));
const sim = computed(() => simulate(circuit.value));

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

const lit = (i: number) => sim.value.lit.includes(i);
const partLabel = (kind: "lamp" | "switch") => (kind === "lamp" ? props.texts.lamp : "");

function add(list: Part[], kind: "lamp" | "switch") {
  list.push(kind === "lamp" ? { kind: "lamp" } : { kind: "switch", closed: true });
}
const addTop = (kind: "lamp" | "switch") => add(circuit.value as unknown as Part[], kind);
const addGroup = () => circuit.value.push({ kind: "parallel", branches: [[], []] });
const groupAt = (gi: number) => {
  const element = circuit.value[gi];
  if (element === undefined || element.kind !== "parallel") throw new Error("no group");
  return element;
};
const toggle = (part: Part) => {
  if (part.kind === "switch") part.closed = !part.closed;
  else part.out = part.out !== true;
};
const reset = () => {
  circuit.value = [];
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
    <ol class="bau-loop" :aria-label="texts.circuit">
      <li class="bau-part">{{ texts.battery }}</li>
      <template v-for="(element, gi) in view" :key="gi">
        <li v-if="element.kind !== 'parallel'" class="bau-part">
          <span v-if="element.kind === 'lamp'" class="bau-lamp" :data-lit="lit(element.i)" aria-hidden="true"></span>
          <span>{{ element.kind === "lamp" ? partLabel("lamp") : "" }}</span>
          <span v-if="element.kind === 'lamp'">{{ lit(element.i) ? texts.lampLit : texts.lampDark }}</span>
          <button v-if="element.kind === 'switch'" type="button" @click="toggle(element.part)">
            {{ element.part.closed ? texts.switchClosed : texts.switchOpen }}
          </button>
          <button v-else type="button" @click="toggle(element.part)">
            {{ element.part.out ? texts.screwIn : texts.unscrew }}
          </button>
          <button type="button" @click="circuit.splice(gi, 1)">{{ texts.remove }}</button>
        </li>
        <li v-else class="bau-part bau-group">
          <span>{{ texts.parallelGroup }}</span>
          <ul class="bau-branches">
            <li v-for="(branch, bi) in element.branches" :key="bi" class="bau-branch">
              <span>{{ texts.branch }} {{ bi + 1 }}</span>
              <span v-for="(item, pi) in branch" :key="pi" class="bau-part">
                <span v-if="item.kind === 'lamp'" class="bau-lamp" :data-lit="lit(item.i)" aria-hidden="true"></span>
                <span v-if="item.kind === 'lamp'">
                  {{ texts.lamp }}: {{ lit(item.i) ? texts.lampLit : texts.lampDark }}
                </span>
                <button v-if="item.kind === 'switch'" type="button" @click="toggle(item.part)">
                  {{ item.part.closed ? texts.switchClosed : texts.switchOpen }}
                </button>
                <button v-else type="button" @click="toggle(item.part)">
                  {{ item.part.out ? texts.screwIn : texts.unscrew }}
                </button>
                <button type="button" @click="groupAt(gi).branches[bi]!.splice(pi, 1)">{{ texts.remove }}</button>
              </span>
              <button v-if="branch.length < MAX_BRANCH" type="button" @click="add(groupAt(gi).branches[bi]!, 'lamp')">
                {{ texts.addLamp }}
              </button>
              <button v-if="branch.length < MAX_BRANCH" type="button" @click="add(groupAt(gi).branches[bi]!, 'switch')">
                {{ texts.addSwitch }}
              </button>
              <button v-if="element.branches.length > 1" type="button" @click="groupAt(gi).branches.splice(bi, 1)">
                {{ texts.removeBranch }}
              </button>
            </li>
          </ul>
          <button v-if="element.branches.length < MAX_BRANCHES" type="button" @click="groupAt(gi).branches.push([])">
            {{ texts.addBranch }}
          </button>
          <button type="button" @click="circuit.splice(gi, 1)">{{ texts.remove }}</button>
        </li>
      </template>
    </ol>
    <p v-if="sim.short" class="bau-short" role="status">{{ texts.short }}</p>
    <div class="bau-actions" v-if="circuit.length < MAX_TOP">
      <button type="button" @click="addTop('lamp')">{{ texts.addLamp }}</button>
      <button type="button" @click="addTop('switch')">{{ texts.addSwitch }}</button>
      <button type="button" @click="addGroup()">{{ texts.addParallel }}</button>
    </div>
    <div class="bau-actions">
      <button type="button" @click="verify()">{{ texts.check }}</button>
      <button type="button" @click="reset()">{{ texts.reset }}</button>
      <button type="button" @click="next()">{{ texts.next }}</button>
    </div>
  </div>
</template>

<style scoped>
.bau-loop,
.bau-branches {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0;
  display: grid;
  gap: 0.5rem;
}
.bau-part {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid currentColor;
  border-radius: 0.4rem;
}
.bau-branch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-left: 4px solid currentColor;
}
.bau-group {
  flex-direction: column;
  align-items: flex-start;
}
.bau-lamp {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: transparent;
}
.bau-lamp[data-lit="true"] {
  background: #ffd400;
  box-shadow: 0 0 0.6rem #ffd400;
}
.bau-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.bau-short {
  font-weight: bold;
}
button {
  min-height: 2.75rem;
  padding: 0.25rem 0.75rem;
}
</style>
