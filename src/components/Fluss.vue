<script setup lang="ts">
import { computed } from "vue";
import { flow } from "./Fluss.ts";

const props = defineProps<{
  /** The path of the wire, drawn in the direction the current flows. */
  d: string;
  /** The current in amperes; no dots when it is zero. */
  current: number;
  /** The largest current of the exercise, for the look of the dots. */
  scale: number;
  /** The colour of the wire, for the height of the voltage. */
  colour?: string;
}>();

const look = computed(() => flow(props.current, props.scale));
</script>

<template>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path :d="d" :stroke="colour ?? '#111'" stroke-width="4" />
    <path
      v-if="current > 0.0001"
      class="dots"
      :d="d"
      stroke="#c25e00"
      stroke-width="7"
      :stroke-dasharray="`0.1 ${look.gap}`"
      :style="{ '--period': look.period, '--seconds': `${look.seconds}s` }"
    />
  </g>
</template>

<style scoped>
.dots {
  animation: flow var(--seconds) linear infinite;
}
@keyframes flow {
  to {
    stroke-dashoffset: calc(var(--period) * -1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .dots {
    animation: none;
  }
}
</style>
