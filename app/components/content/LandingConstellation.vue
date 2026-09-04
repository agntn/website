<script setup lang="ts">
import { LIBRARIES } from "../../utils/libraries";

const props = defineProps<{ active: string; tick: number }>();

const W = 1200;
const H = 520;
const CX = W / 2;
const CY = H / 2;
const CORE = { w: 260, h: 96 };
/** Two rings, the public libraries on the inner one. */
const INNER = { rx: 330, ry: 150 };
const OUTER = { rx: 560, ry: 232 };

const nodes = computed(() => {
  const publicRows = LIBRARIES.filter((library) => library.status !== "soon");
  const soonRows = LIBRARIES.filter((library) => library.status === "soon");
  const place = (rows: typeof LIBRARIES, ring: { rx: number; ry: number }, offset: number) =>
    rows.map((library, index) => {
      const angle = offset + (index / rows.length) * Math.PI * 2;
      return {
        ...library,
        x: CX + Math.cos(angle) * ring.rx,
        y: CY + Math.sin(angle) * ring.ry,
        angle,
      };
    });
  const stagger = soonRows.length ? Math.PI / soonRows.length : 0;
  return [...place(publicRows, INNER, -Math.PI / 2), ...place(soonRows, OUTER, -Math.PI / 2 + stagger)];
});

function spoke(node: { x: number; y: number }) {
  const dx = node.x - CX;
  const dy = node.y - CY;
  const length = Math.hypot(dx, dy) || 1;
  const startX = CX + (dx / length) * (CORE.w / 2 - 10);
  const startY = CY + (dy / length) * (CORE.h / 2 - 6);
  const mid = { x: (startX + node.x) / 2, y: (startY + node.y) / 2 };
  return `M ${startX} ${startY} Q ${mid.x} ${CY + (mid.y - CY) * 0.6}, ${node.x} ${node.y}`;
}

const activeNode = computed(() => nodes.value.find((node) => node.key === props.active));
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="org-flow" role="img" aria-label="One agent host reaches every agntn library through the same tool shape">
    <ellipse :cx="CX" :cy="CY" :rx="INNER.rx" :ry="INNER.ry" class="org-flow-orbit" />
    <ellipse :cx="CX" :cy="CY" :rx="OUTER.rx" :ry="OUTER.ry" class="org-flow-orbit" />

    <g class="org-flow-wires">
      <path
        v-for="node in nodes"
        :key="`s${node.key}`"
        :d="spoke(node)"
        class="org-flow-spoke"
        :class="{ 'org-flow-spoke-active': node.key === active, 'org-flow-wire-dim': node.status === 'soon' }"
        :style="{ '--lib': node.accent }"
      />
    </g>
    <g v-if="activeNode" :key="tick">
      <path :d="spoke(activeNode)" class="org-flow-pulse" :style="{ stroke: activeNode.accent }" />
    </g>

    <g
      v-for="node in nodes"
      :key="node.key"
      class="org-flow-lib"
      :class="{ 'org-flow-lib-active': node.key === active, 'org-flow-lib-soon': node.status === 'soon' }"
      :style="{ '--lib': node.accent }"
    >
      <circle :cx="node.x" :cy="node.y" r="5" />
      <text
        :x="node.x + (Math.cos(node.angle) >= 0 ? 12 : -12)"
        :y="node.y + 4"
        :text-anchor="Math.cos(node.angle) >= 0 ? 'start' : 'end'"
      >
        {{ node.key }}
      </text>
    </g>

    <g class="org-flow-core">
      <rect :x="CX - CORE.w / 2" :y="CY - CORE.h / 2" :width="CORE.w" :height="CORE.h" rx="12" />
      <text :x="CX" :y="CY - 18" text-anchor="middle" class="org-flow-label">agent host</text>
      <text :x="CX" :y="CY + 8" text-anchor="middle" class="org-flow-title">
        <tspan :key="active" class="org-derive">{{ active }}_tool(input)</tspan>
      </text>
      <text :x="CX" :y="CY + 30" text-anchor="middle" class="org-flow-mono">AI SDK · MCP · Pi · OMP · CLI</text>
    </g>
  </svg>
</template>
