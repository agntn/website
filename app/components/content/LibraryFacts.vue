<script setup lang="ts">
import { STATUS_LABEL, findLibrary } from "../../utils/libraries";
import { librarySchema } from "../../utils/schema";

const props = defineProps<{ name: string }>();

const library = computed(() => findLibrary(props.name));

useHead({
  script: computed(() =>
    library.value && library.value.status !== "soon"
      ? [{ type: "application/ld+json", innerHTML: JSON.stringify(librarySchema(library.value)) }]
      : [],
  ),
});

const links = computed(() => {
  if (!library.value || library.value.status === "soon") {
    return [];
  }
  const rows = [
    { label: "GitHub", href: `https://github.com/agntn/${library.value.key}`, icon: "i-simple-icons-github" },
    { label: "npm", href: `https://www.npmjs.com/package/@agntn/${library.value.key}`, icon: "i-simple-icons-npm" },
  ];
  if (library.value.site) {
    rows.unshift({ label: library.value.site.replace("https://", ""), href: library.value.site, icon: "i-lucide-book-open" });
  }
  return rows;
});
</script>

<template>
  <div v-if="library" class="not-prose my-6 space-y-4" :style="{ '--lib': library.accent }">
    <div class="org-frame overflow-hidden rounded-xl">
      <dl class="org-kv">
        <dt>package</dt>
        <dd class="font-mono">@agntn/{{ library.key }}</dd>
        <dt>status</dt>
        <dd class="flex items-center gap-2">
          <span class="org-dot" :class="{ 'org-dot-soon': library.status === 'soon' }" />
          {{ STATUS_LABEL[library.status] }}
        </dd>
        <dt>providers</dt>
        <dd>{{ library.providers.join(", ") }}</dd>
        <dt>surfaces</dt>
        <dd class="font-mono text-[13px]">{{ library.surfaces.join(" · ") }}</dd>
        <template v-if="library.status !== 'soon'">
          <dt>install</dt>
          <dd class="font-mono text-[13px]">pnpm add @agntn/{{ library.key }}</dd>
        </template>
      </dl>
    </div>
    <div v-if="links.length" class="flex flex-wrap gap-2">
      <a v-for="link in links" :key="link.href" :href="link.href" target="_blank" rel="noopener" class="org-btn">
        <UIcon :name="link.icon" class="size-4 text-muted" />
        {{ link.label }}
        <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-dimmed" />
      </a>
    </div>
    <p v-else class="text-sm text-muted">
      Still in a private repo. Shows up on npm and GitHub once the first release is cut.
    </p>
    <SurfaceGrid :library="library" />
  </div>
  <p v-else class="text-sm text-muted">Unknown library.</p>
</template>
