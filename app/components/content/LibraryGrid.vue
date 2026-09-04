<script setup lang="ts">
import { GROUPS, LIBRARIES, STATUS_LABEL, librariesIn, type LibraryGroup } from "../../utils/libraries";
import { catalogueSchema } from "../../utils/schema";

const props = withDefaults(
  defineProps<{
    /** Highlighted library key, driven by the landing clock. */
    active?: string;
    /** Restrict the grid to one group. */
    group?: LibraryGroup;
    /** Show the group headings. */
    grouped?: boolean;
    /** Columns at the widest breakpoint: 3 on the landing, 2 inside the docs column. */
    columns?: 2 | 3 | "2" | "3";
    /** Emit the ItemList JSON-LD, once per page, on the catalogue page. */
    schema?: boolean;
  }>(),
  { active: "", group: undefined, grouped: false, columns: 3, schema: false },
);

if (props.schema) {
  useHead({ script: [{ type: "application/ld+json", innerHTML: JSON.stringify(catalogueSchema(LIBRARIES)) }] });
}

const sections = computed(() => {
  if (props.group) {
    return [{ ...GROUPS.find((entry) => entry.key === props.group)!, libraries: librariesIn(props.group) }];
  }
  if (props.grouped) {
    return GROUPS.map((entry) => ({ ...entry, libraries: librariesIn(entry.key) }));
  }
  return [{ key: "all", label: "", blurb: "", libraries: LIBRARIES }];
});

const gridClass = computed(() =>
  String(props.columns) === "2" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
);

function tail(library: (typeof LIBRARIES)[number]) {
  const shown = library.providers.slice(0, 4);
  const rest = library.providers.length - shown.length;
  return rest > 0 ? `${shown.join(" · ")} +${rest}` : shown.join(" · ");
}
</script>

<template>
  <div class="not-prose space-y-10">
    <section v-for="section in sections" :key="section.key">
      <header v-if="section.label" class="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 class="text-lg font-medium tracking-tight text-highlighted">{{ section.label }}</h2>
        <p class="text-sm text-muted">{{ section.blurb }}</p>
      </header>
      <div class="org-grid">
        <div class="org-grid-inner grid" :class="gridClass">
          <component
            :is="library.status === 'soon' ? 'div' : 'NuxtLink'"
            v-for="library in section.libraries"
            :key="library.key"
            :to="library.status === 'soon' ? undefined : library.to"
            class="org-card org-cell group"
            :class="{
              'org-card-active': library.key === active,
              'org-card-soon': library.status === 'soon',
            }"
            :style="{ '--lib': library.accent }"
          >
            <div class="flex items-center justify-between gap-3">
              <UIcon :name="library.icon" class="org-card-icon size-5" />
              <span class="org-chip org-chip-small">
                <span class="org-dot" :class="{ 'org-dot-soon': library.status === 'soon' }" />
                {{ STATUS_LABEL[library.status] }}
              </span>
            </div>
            <span>
              <span class="org-card-name block font-mono text-[13px] text-highlighted">@agntn/{{ library.key }}</span>
              <span class="mt-1.5 block text-sm leading-5 text-muted">{{ library.description }}</span>
            </span>
            <span class="mt-auto block pt-1 font-mono text-[11px] leading-5 text-dimmed">{{ tail(library) }}</span>
          </component>
        </div>
      </div>
    </section>
  </div>
</template>
