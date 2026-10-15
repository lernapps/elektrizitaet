<script setup lang="ts">
import { computed } from "vue";
import { needleAngle, readingText } from "./Zeiger.ts";

const props = defineProps<{
  x: number;
  y: number;
  /** A for an ammeter, V for a voltmeter. */
  kind: "A" | "V";
  /** The reading. */
  value: number;
  /** The meter shows nothing: no reading, the needle at zero. */
  blank: boolean;
  /** The end of the scale. */
  max: number;
  decimals: number;
  separator: string;
}>();

const angle = computed(() => needleAngle(props.blank ? 0 : props.value, props.max));
const reading = computed(() => readingText(props.blank, props.value, props.kind, props.decimals, props.separator));
const arc = (r: number, from: number, to: number) => {
  const point = (deg: number) =>
    `${props.x + r * Math.sin((deg * Math.PI) / 180)} ${props.y + 12 - r * Math.cos((deg * Math.PI) / 180)}`;
  return `M${point(from)}A${r} ${r} 0 0 1 ${point(to)}`;
};
</script>

<template>
  <g>
    <circle :cx="x" :cy="y" r="28" fill="#fff" stroke="#111" stroke-width="3" />
    <path :d="arc(19, -60, 60)" fill="none" stroke="#555" stroke-width="2" />
    <text :x="x" :y="y - 11" text-anchor="middle" font-size="14" font-weight="bold" fill="#111">{{ kind }}</text>
    <line
      class="needle"
      :x1="x"
      :y1="y + 12"
      :x2="x"
      :y2="y - 1"
      stroke="#b00020"
      stroke-width="3"
      stroke-linecap="round"
      :style="{ transform: `rotate(${angle}deg)`, transformOrigin: `${x}px ${y + 12}px` }"
    />
    <circle :cx="x" :cy="y + 12" r="3" fill="#111" />
    <text
      :x="x"
      :y="y + 50"
      text-anchor="middle"
      font-size="14"
      font-weight="bold"
      fill="#111"
      stroke="#fff"
      stroke-width="5"
      paint-order="stroke"
    >
      {{ reading }}
    </text>
  </g>
</template>

<style scoped>
.needle {
  transition: transform 0.6s ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .needle {
    transition: none;
  }
}
</style>
