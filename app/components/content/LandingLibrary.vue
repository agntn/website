<script setup lang="ts">
import {
  GROUPS,
  PUBLIC_LIBRARIES,
  STATUS_LABEL,
  SURFACES,
  namedProviders,
  unnamedProviderCount,
  type LibraryInfo,
} from "../../utils/libraries";

const props = defineProps<{ library: LibraryInfo }>();
const emit = defineEmits<{ step: [delta: number]; pause: [paused: boolean] }>();

const position = computed(() => PUBLIC_LIBRARIES.findIndex((row) => row.key === props.library.key) + 1);
const group = computed(() => GROUPS.find((row) => row.key === props.library.group)!);
const named = computed(() => namedProviders(props.library.providers));
const unnamed = computed(() => unnamedProviderCount(props.library.providers));
const shipped = computed(() => SURFACES.filter((surface) => props.library.surfaces.includes(surface.key)).length);

/** Cells every sample gets, so the provider grid, and the instrument with it, keeps one height. */
const SLOTS = Math.max(
  ...PUBLIC_LIBRARIES.map((row) => namedProviders(row.providers).length + (unnamedProviderCount(row.providers) > 0 ? 1 : 0)),
);
const empty = computed(() => SLOTS - named.value.length - (unnamed.value > 0 ? 1 : 0));
</script>

<template>
  <section
    class="tool-console console-wide landing-library"
    aria-label="One published library and the providers behind it"
    @mouseenter="emit('pause', true)"
    @mouseleave="emit('pause', false)"
    @focusin="emit('pause', true)"
    @focusout="emit('pause', false)"
  >
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="console-bar">
      <span class="console-title"
        ><span class="console-tag">ID</span>@agntn/{{ library.key
        }}<span class="console-file">{{ String(position).padStart(2, "0") }} / {{ PUBLIC_LIBRARIES.length }}</span></span
      >
      <span class="console-meta">{{ group.label }} · {{ STATUS_LABEL[library.status] }}</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span :key="library.key" class="console-cursor" /></div>

    <div class="console-band console-subject-band">
      <div :key="library.key" class="console-scan" aria-hidden="true" />
      <div class="library-identity">
        <div class="console-identity-block">
          <ConsoleReticle :key="library.key" :icon="library.icon" />
          <div class="console-name">
            <span class="console-label">Library / <span class="console-label-key">{{ group.label }}</span></span>
            <h3 class="console-name-mono">@agntn/{{ library.key }}</h3>
            <!-- Every description sits in the same cell, so the tallest one sets the height for all. -->
            <div class="library-about">
              <p
                v-for="row in PUBLIC_LIBRARIES"
                :key="row.key"
                class="console-about"
                :aria-hidden="row.key !== library.key"
                :data-shown="row.key === library.key"
              >
                {{ row.description }}
              </p>
            </div>
          </div>
        </div>

        <p class="console-label console-rule-title library-rule">
          <span>Providers <span aria-hidden="true">[ one interface ]</span></span>
          <span class="console-mark" aria-hidden="true" />
        </p>
        <ul class="org-cells" :aria-label="`Providers of @agntn/${library.key}`">
          <li v-for="(name, index) in named" :key="`${library.key}-${name}`" class="org-cell console-animate" :style="{ animationDelay: `${index * 30}ms` }">
            <span class="org-cell-name">{{ name }}</span>
            <span class="org-cell-node" aria-hidden="true" />
          </li>
          <li v-if="unnamed > 0" class="org-cell" data-state="more">
            <span class="org-cell-name">+{{ unnamed }} more</span>
            <span class="org-cell-node" aria-hidden="true" />
          </li>
          <li v-for="slot in empty" :key="`slot-${slot}`" class="org-cell" data-state="slot" aria-hidden="true" />
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
            <dd>{{ library.repo ? "public" : "private" }}</dd>
          </div>
          <div>
            <dt>Docs</dt>
            <dd class="library-line">{{ library.site ? library.site.replace("https://", "") : "README on npm" }}</dd>
          </div>
        </dl>
        <div class="console-gauge" :aria-label="`${shipped} of ${SURFACES.length} surfaces shipped`">
          <span class="console-ticks" aria-hidden="true">
            <span
              v-for="(surface, index) in SURFACES"
              :key="`${library.key}-${surface.key}`"
              :class="library.surfaces.includes(surface.key) ? 'console-tick-open' : 'console-tick-closed'"
              :style="{ animationDelay: `${index * 12}ms` }"
            />
          </span>
          <span class="console-gauge-read">surfaces {{ shipped }} / {{ SURFACES.length }}</span>
        </div>
      </div>
    </div>

    <footer class="console-footer console-footer-plain">
      <div class="library-controls">
        <UButton color="neutral" variant="subtle" square icon="i-lucide-chevron-left" aria-label="Previous library" @click="emit('step', -1)" />
        <UButton color="neutral" variant="subtle" square icon="i-lucide-chevron-right" aria-label="Next library" @click="emit('step', 1)" />
      </div>
      <NuxtLink :to="library.to" class="library-link"><span aria-hidden="true">→ </span>@agntn/{{ library.key }}</NuxtLink>
    </footer>
  </section>
</template>

<style scoped>
.library-identity {
  display: grid;
  align-content: start;
  min-width: 0;
}
.library-about {
  display: grid;
}
.library-about > .console-about {
  grid-area: 1 / 1;
  visibility: hidden;
}
.library-about > .console-about[data-shown="true"] {
  visibility: visible;
}
.library-rule {
  margin: 22px 0 12px;
}
/* Side by side, the readout is as tall as the identity and the providers; its rows share the height. */
@container (width >= 46rem) {
  .landing-library .console-readout {
    align-self: stretch;
    display: flex;
    flex-direction: column;
  }
  .landing-library .console-readout-rows {
    display: grid;
    flex: 1;
    grid-auto-rows: 1fr;
  }
  .landing-library .console-readout-rows > div {
    align-items: center;
  }
}
.library-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.library-controls {
  display: flex;
  gap: 6px;
}
.library-link {
  margin-left: auto;
  color: var(--ui-text-highlighted);
}
.library-link:hover {
  color: var(--console-accent);
}
.library-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
</style>
