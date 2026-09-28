<script setup lang="ts">
import {
  GROUPS,
  LIBRARIES,
  STATUS_LABEL,
  SURFACES,
  findLibrary,
  namedProviders,
  unnamedProviderCount,
} from "../../utils/libraries";
import { librarySchema } from "../../utils/schema";

const props = defineProps<{ name: string }>();

const library = computed(() => findLibrary(props.name));
const position = computed(() => LIBRARIES.findIndex((row) => row.key === props.name) + 1);
const group = computed(() => GROUPS.find((row) => row.key === library.value?.group));
const named = computed(() => (library.value ? namedProviders(library.value.providers) : []));
const unnamed = computed(() => (library.value ? unnamedProviderCount(library.value.providers) : 0));
const surfaces = computed(() =>
  SURFACES.map((surface) => ({ ...surface, shipped: Boolean(library.value?.surfaces.includes(surface.key)) })),
);
const shipped = computed(() => surfaces.value.filter((surface) => surface.shipped).length);

useHead({
  script: computed(() =>
    library.value && library.value.status !== "soon"
      ? [{ type: "application/ld+json", innerHTML: JSON.stringify(librarySchema(library.value)) }]
      : [],
  ),
});

/** Where a published library lives; a private repo gets no GitHub lead, a `soon` row gets none at all. */
const links = computed(() => {
  const row = library.value;
  if (!row || row.status === "soon") return [];
  return [
    ...(row.site ? [{ tag: "Docs", text: row.site.replace("https://", ""), href: row.site }] : []),
    ...(row.repo ? [{ tag: "GitHub", text: `agntn/${row.key}`, href: `https://github.com/agntn/${row.key}` }] : []),
    { tag: "npm", text: `@agntn/${row.key}`, href: `https://www.npmjs.com/package/@agntn/${row.key}` },
  ];
});
</script>

<template>
  <section v-if="library" class="tool-console console-wide not-prose my-6" aria-label="Library record">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="console-bar">
      <span class="console-title"
        ><span class="console-tag">ID</span>{{ library.key
        }}<span class="console-file">{{ String(position).padStart(2, "0") }} / {{ LIBRARIES.length }}</span></span
      >
      <span class="console-meta">{{ group?.label }} · {{ STATUS_LABEL[library.status] }}</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span class="console-cursor" /></div>

    <div class="console-band console-subject-band">
      <div class="console-scan" aria-hidden="true" />
      <div class="facts-identity">
      <div class="console-identity-block">
        <ConsoleReticle :key="library.key" :icon="library.icon" />
        <div class="console-name">
          <span class="console-label">Library / <span class="console-label-key">{{ group?.label }}</span></span>
          <h3 class="console-name-mono">@agntn/{{ library.key }}</h3>
          <p class="facts-spellings">
            <span v-if="library.status !== 'soon'" class="facts-spelling">pnpm add @agntn/{{ library.key }}</span>
            <span v-else class="facts-spelling facts-none">not on npm yet</span>
          </p>
        </div>
      </div>

        <p class="console-label console-rule-title facts-rule">
          <span>Providers <span aria-hidden="true">[ behind one interface ]</span></span>
          <span class="console-mark" aria-hidden="true" />
        </p>
        <ul class="org-cells" :aria-label="`Providers of @agntn/${library.key}`">
          <li v-for="provider in named" :key="provider" class="org-cell">
            <span class="org-cell-name">{{ provider }}</span>
            <span class="org-cell-node" aria-hidden="true" />
          </li>
          <li v-if="unnamed > 0" class="org-cell" data-state="more">
            <span class="org-cell-name">+{{ unnamed }} more</span>
            <span class="org-cell-node" aria-hidden="true" />
          </li>
        </ul>
      </div>

      <div class="console-readout">
        <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
          <circle cx="3" cy="12" r="2.5" />
          <path d="M5.5 12H14L22 20H32" />
        </svg>
        <dl class="console-readout-rows">
          <div>
            <dt>Status</dt>
            <dd>{{ STATUS_LABEL[library.status] }}</dd>
          </div>
          <div>
            <dt>Providers</dt>
            <dd class="console-accent">{{ named.length + unnamed }}</dd>
          </div>
          <div>
            <dt>Repository</dt>
            <dd :class="{ 'facts-none': !library.repo }">{{ library.repo ? "public" : "private" }}</dd>
          </div>
        </dl>
        <div class="console-gauge" :aria-label="`${shipped} of ${SURFACES.length} surfaces shipped`">
          <span class="console-ticks" aria-hidden="true">
            <span
              v-for="(surface, index) in surfaces"
              :key="surface.key"
              :class="surface.shipped ? 'console-tick-open' : 'console-tick-closed'"
              :style="{ animationDelay: `${index * 12}ms` }"
            />
          </span>
          <span class="console-gauge-read">surfaces {{ shipped }} / {{ SURFACES.length }}</span>
        </div>
      </div>
    </div>

    <div class="console-band facts-surfaces-band">
      <p class="console-label console-rule-title">
        <span>Surfaces <span aria-hidden="true">[ same executors on each ]</span></span>
        <span class="console-mark" aria-hidden="true" />
      </p>
      <ul class="org-cells facts-surfaces">
        <li v-for="surface in surfaces" :key="surface.key" class="org-cell org-cell-icon" :data-state="surface.shipped ? undefined : 'off'">
          <UIcon :name="surface.icon" class="org-cell-glyph" aria-hidden="true" />
          <span class="org-cell-name">{{ surface.label }}</span>
          <span class="org-cell-node" :aria-label="surface.shipped ? 'shipped' : 'not shipped'" role="img" />
        </li>
      </ul>
    </div>

    <div class="console-band">
      <p class="console-label console-rule-title">
        <span>Links <span aria-hidden="true">[ docs · GitHub · npm ]</span></span>
        <span class="console-mark" aria-hidden="true" />
      </p>
      <dl v-if="links.length" class="facts-leads">
        <dd v-for="link in links" :key="link.tag" class="console-lead">
          <span class="console-tag">{{ link.tag }}</span>
          <a :href="link.href" target="_blank" rel="noopener" class="facts-code">{{ link.text }}</a>
          <span class="console-leader" aria-hidden="true" />
        </dd>
      </dl>
      <p v-else class="facts-note">
        Still in a private repo. Shows up on npm and GitHub once the first release is cut.
      </p>
    </div>

    <footer class="console-footer console-footer-plain">
      <ul class="console-links">
        <li>
          <NuxtLink to="/libraries"><span aria-hidden="true">→ </span>All libraries</NuxtLink>
        </li>
      </ul>
      <span class="console-meta">read from the catalogue / no network</span>
    </footer>
  </section>
  <p v-else class="text-sm text-muted">Unknown library.</p>
</template>

<style scoped>
.facts-identity {
  display: grid;
  align-content: start;
  min-width: 0;
}
.facts-rule {
  margin: 22px 0 12px;
}
/* Six surfaces in one row where they fit, three and three where they don't. */
.facts-surfaces-band {
  container-type: inline-size;
}
.facts-surfaces {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
@container (width < 44rem) {
  .facts-surfaces {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.facts-spellings {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 2px 0 0;
}
.facts-spelling {
  padding: 1px 7px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--ui-text-highlighted);
  box-shadow: inset 0 0 0 1px var(--console-line);
}
.facts-none,
.facts-spelling.facts-none {
  color: var(--ui-text-dimmed);
}
.facts-leads {
  display: grid;
  margin: 0;
}
.facts-leads > .console-lead {
  margin: 0 0 8px;
  flex-wrap: nowrap;
  min-width: 0;
}
.facts-leads > .console-lead > .console-tag {
  flex: none;
  width: 4.5rem;
  text-align: center;
}
.facts-code {
  min-width: 0;
  overflow: hidden;
  font: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-text-highlighted);
}
a.facts-code:hover {
  color: var(--console-accent);
}
a.facts-code:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
.facts-note {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ui-text-muted);
}
@media (width < 640px) {
  .facts-leads .console-leader {
    display: none;
  }
}
</style>
