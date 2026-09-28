<script setup lang="ts">
import { SURFACES } from "../../utils/libraries";
</script>

<template>
  <section class="tool-console console-wide surface-panel not-prose my-6" aria-label="Surfaces">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="console-bar">
      <span class="console-title"><span class="console-tag">List</span>surfaces</span>
      <span class="console-meta">one set of executors</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true" />
    <dl class="surface-rows">
      <div
        v-for="(surface, index) in SURFACES"
        :key="surface.key"
        class="console-lead console-animate surface-row"
        :style="{ animationDelay: `${index * 45}ms` }"
      >
        <dt class="console-tag">{{ surface.label }}</dt>
        <dd>
          <UIcon :name="surface.icon" class="surface-icon" aria-hidden="true" />
          <span class="surface-about">{{ surface.blurb }}</span>
          <span class="console-leader" aria-hidden="true" />
        </dd>
      </div>
    </dl>
    <footer class="console-footer console-footer-plain">
      <span>Written once / called from every host</span>
    </footer>
  </section>
</template>

<style scoped>
.surface-panel {
  width: 100%;
}
.surface-rows {
  margin: 0;
  padding: 12px 20px 18px;
}
.surface-row {
  margin: 10px 0 0;
  flex-wrap: nowrap;
  min-width: 0;
}
.surface-row > .console-tag {
  flex: none;
  width: 4.75rem;
  margin: 0;
  text-align: center;
}
.surface-row > dd {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  margin: 0;
}
.surface-icon {
  position: relative;
  top: 2px;
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--console-accent);
}
.surface-about {
  min-width: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ui-text);
}
@media (width < 640px) {
  .surface-row .console-leader {
    display: none;
  }
}
@media (width < 400px) {
  .surface-rows {
    padding-inline: 14px;
  }
}
</style>
