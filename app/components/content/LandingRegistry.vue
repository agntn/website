<script setup lang="ts">
import { GROUPS, LIBRARIES, PUBLIC_LIBRARIES, STATUS_LABEL, librariesIn, type LibraryInfo } from "../../utils/libraries";

const props = defineProps<{ library: LibraryInfo }>();
const emit = defineEmits<{ pause: [paused: boolean] }>();

type State = "current" | "published" | "soon";

/** One band per domain, a cell per library in catalogue order; the node says where it stands. */
const bands = computed(() =>
  GROUPS.map((group) => ({
    ...group,
    cells: librariesIn(group.key).map((library) => ({
      library,
      state: (library.key === props.library.key ? "current" : library.status === "soon" ? "soon" : "published") as State,
    })),
  })),
);

/**
 * What a cell's tooltip says.
 *
 * @param {LibraryInfo} library - A catalogue row.
 * @returns {string} The package, its status and what it covers.
 */
function about(library: LibraryInfo): string {
  return `@agntn/${library.key} · ${STATUS_LABEL[library.status]} · ${library.description}`;
}
</script>

<template>
  <section
    class="tool-console console-wide landing-registry"
    aria-label="Every library in the catalogue"
    @mouseenter="emit('pause', true)"
    @mouseleave="emit('pause', false)"
    @focusin="emit('pause', true)"
    @focusout="emit('pause', false)"
  >
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="console-bar">
      <span class="console-title"><span class="console-tag">List</span>@agntn/*</span>
      <span class="console-meta">{{ LIBRARIES.length }} libraries · {{ PUBLIC_LIBRARIES.length }} on npm</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true">
      <span :key="library.key" class="console-cursor" />
    </div>

    <div v-for="band in bands" :key="band.key" class="registry-band">
      <p class="console-label console-rule-title">
        <span
          >{{ band.label }}&#32;<span aria-hidden="true">[ {{ band.blurb.replace(/\.$/, "").toLowerCase() }} ]</span></span
        >
        <span class="console-mark" aria-hidden="true" />
      </p>
      <ul class="registry-cells">
        <li v-for="cell in band.cells" :key="cell.library.key">
          <UTooltip :text="about(cell.library)">
            <NuxtLink
              v-if="cell.library.status !== 'soon'"
              :to="cell.library.to"
              class="registry-cell"
              :data-state="cell.state"
              :aria-label="about(cell.library)"
            >
              <UIcon :name="cell.library.icon" class="registry-icon" aria-hidden="true" />
              <span class="registry-key">{{ cell.library.key }}</span>
              <span class="registry-node" aria-hidden="true" />
            </NuxtLink>
            <span v-else class="registry-cell" :data-state="cell.state" tabindex="0" :aria-label="about(cell.library)">
              <UIcon :name="cell.library.icon" class="registry-icon" aria-hidden="true" />
              <span class="registry-key">{{ cell.library.key }}</span>
              <span class="registry-node" aria-hidden="true" />
            </span>
          </UTooltip>
        </li>
      </ul>
    </div>

    <footer class="console-footer console-footer-plain">
      <span class="registry-legend"
        ><span class="registry-node" data-state="published" aria-hidden="true" /> on npm
        <span class="registry-node" data-state="soon" aria-hidden="true" /> in progress</span
      >
      <NuxtLink to="/libraries" class="registry-link"
        ><span aria-hidden="true">→ </span>the catalogue, with providers and status</NuxtLink
      >
    </footer>
  </section>
</template>

<style scoped>
.registry-band {
  padding: 14px 20px 16px;
  border-top: 1px solid var(--console-line);
}
.registry-band:first-of-type {
  border-top: 0;
}
.registry-band > .console-rule-title {
  margin: 0 0 12px;
}
/* A cell per library: glyph, name, node. The state rides on the node and the name, never a word in every cell. */
.registry-cells {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.registry-cell {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) 6px;
  gap: 8px;
  align-items: center;
  padding: 6px 9px;
  box-shadow: inset 0 0 0 1px var(--console-line);
  transition: box-shadow 0.3s ease;
}
.registry-icon {
  width: 14px;
  height: 14px;
  color: var(--ui-text-dimmed);
  transition: color 0.3s ease;
}
.registry-key {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-text-highlighted);
  transition: color 0.3s ease;
}
.registry-node {
  display: inline-block;
  width: 6px;
  height: 6px;
  box-shadow: inset 0 0 0 1px var(--console-line);
}
.registry-cell[data-state="soon"] .registry-key {
  color: var(--ui-text-dimmed);
}
.registry-node[data-state="published"],
.registry-cell[data-state="published"] .registry-node {
  box-shadow: inset 0 0 0 1px var(--console-accent);
}
.registry-cell[data-state="current"] {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--console-accent) 55%, transparent);
}
.registry-cell[data-state="current"] .registry-icon {
  color: var(--console-accent);
}
.registry-cell[data-state="current"] .registry-node {
  background: var(--console-accent);
  box-shadow: none;
}
a.registry-cell:hover {
  box-shadow: inset 0 0 0 1px var(--console-accent);
}
a.registry-cell:hover .registry-key {
  color: var(--console-accent);
}
.registry-cell:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
.registry-legend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.registry-legend > .registry-node:not(:first-child) {
  margin-left: 8px;
}
.registry-link {
  margin-left: auto;
  color: var(--ui-text-highlighted);
}
.registry-link:hover {
  color: var(--console-accent);
}
.registry-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
@media (width < 640px) {
  .registry-legend {
    display: none;
  }
}
@media (width < 400px) {
  .registry-band {
    padding-inline: 14px;
  }
  .registry-cells {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  }
}
@media (prefers-reduced-motion: reduce) {
  .registry-cell,
  .registry-icon,
  .registry-key {
    transition: none;
  }
}
</style>
