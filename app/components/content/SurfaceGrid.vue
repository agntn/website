<script setup lang="ts">
import { SURFACES, type LibraryInfo } from "../../utils/libraries";

const props = defineProps<{ library?: LibraryInfo }>();

const rows = computed(() =>
  SURFACES.map((surface) => ({
    ...surface,
    shipped: props.library ? props.library.surfaces.includes(surface.key) : true,
  })),
);
</script>

<template>
  <div class="not-prose org-grid">
    <div class="org-grid-inner grid grid-cols-2 sm:grid-cols-3">
      <div
        v-for="surface in rows"
        :key="surface.key"
        class="org-surface org-cell"
        :class="{ 'opacity-50': !surface.shipped }"
      >
        <UIcon :name="surface.icon" class="size-5" :class="surface.shipped ? 'text-primary' : 'text-dimmed'" />
        <span class="text-sm font-medium text-highlighted">{{ surface.label }}</span>
        <span class="text-[13px] leading-5 text-muted">{{ surface.blurb }}</span>
        <span v-if="library" class="org-surface-key mt-auto pt-1">{{ surface.shipped ? "shipped" : "not yet" }}</span>
      </div>
    </div>
  </div>
</template>
