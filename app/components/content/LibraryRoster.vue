<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { GROUPS, LIBRARIES, PUBLIC_LIBRARIES, STATUS_LABEL, namedProviders, unnamedProviderCount } from "../../utils/libraries";
import { ROSTER_CLASS, ROSTER_TABLE_UI } from "../../utils/roster";
import { catalogueSchema } from "../../utils/schema";

/** `schema` adds the catalogue's ItemList JSON-LD; one roster per page carries it. */
const props = defineProps<{ schema?: boolean }>();

useHead({
  script: computed(() =>
    props.schema ? [{ type: "application/ld+json", innerHTML: JSON.stringify(catalogueSchema(LIBRARIES)) }] : [],
  ),
});

/** Empty until a header is clicked: the rows then keep the catalogue order. */
const sorting = ref<{ id: string; desc: boolean }[]>([]);

const roster = useTemplateRef<HTMLElement>("roster");
useRosterFlip(
  () => roster.value,
  () => sorting.value,
);

const GROUP_ORDER = new Map(GROUPS.map((group, index) => [group.key, index]));

const rows = LIBRARIES.map((library) => ({
  ...library,
  name: library.key,
  domain: GROUPS.find((group) => group.key === library.group)!.label,
  domainOrder: GROUP_ORDER.get(library.group)!,
  providerCount: namedProviders(library.providers).length + unnamedProviderCount(library.providers),
}));
type Row = (typeof rows)[number];

const columns: TableColumn<Row>[] = [
  { accessorKey: "name", header: "Library", sortingFn: "text", meta: { class: { th: "w-[10rem]" } } },
  /* Narrow, the row reads name and status first, then the domain and providers, then the sentence. */
  {
    accessorKey: "domainOrder",
    header: "Domain",
    meta: { class: { th: "w-[6.5rem]", td: "@max-[52rem]/roster:order-2 @max-[52rem]/roster:col-span-1! @max-[52rem]/roster:justify-self-start!" } },
  },
  {
    accessorKey: "description",
    header: "What it covers",
    enableSorting: false,
    meta: { class: { td: "@max-[52rem]/roster:order-3" } },
  },
  {
    accessorKey: "providerCount",
    header: "Providers",
    meta: {
      class: {
        th: "w-[6.5rem] text-end",
        td: "text-end @max-[52rem]/roster:order-2 @max-[52rem]/roster:col-span-1! @max-[52rem]/roster:justify-self-end",
      },
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    sortingFn: "text",
    meta: {
      class: {
        th: "w-[8.5rem]",
        td: "@max-[52rem]/roster:order-1 @max-[52rem]/roster:col-span-1! @max-[52rem]/roster:justify-self-end",
      },
    },
  },
];

const order = computed(() => {
  const [first] = sorting.value;
  if (first === undefined) return "catalogue order";
  const label = columns.find((column) => "accessorKey" in column && column.accessorKey === first.id)?.header;
  return `by ${String(label).toLowerCase()} ${first.desc ? "descending" : "ascending"}`;
});
</script>

<template>
  <section ref="roster" class="roster not-prose my-6" aria-label="Libraries">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header :class="ROSTER_CLASS.bar">
      <span :class="ROSTER_CLASS.title">@agntn/*</span>
      <span :class="ROSTER_CLASS.meta">{{ LIBRARIES.length }} libraries · {{ order }}</span>
    </header>
    <div class="roster-ruler" aria-hidden="true" />
    <UTable v-model:sorting="sorting" :data="rows" :columns="columns" :get-row-id="(row) => row.key" :ui="ROSTER_TABLE_UI">
      <template #name-header="{ column }"><RosterSort :column="column" label="Library" /></template>
      <template #domainOrder-header="{ column }"><RosterSort :column="column" label="Domain" /></template>
      <template #providerCount-header="{ column }"><RosterSort :column="column" label="Providers" /></template>
      <template #status-header="{ column }"><RosterSort :column="column" label="Status" /></template>
      <template #name-cell="{ row }">
        <NuxtLink v-if="row.original.status !== 'soon'" :to="row.original.to" :class="[ROSTER_CLASS.name, 'items-baseline']">
          <UIcon :name="row.original.icon" class="relative top-0.5 size-3.5 flex-none" aria-hidden="true" />
          <span>{{ row.original.key }}</span>
        </NuxtLink>
        <span v-else class="inline-flex min-w-0 items-baseline gap-2 text-muted">
          <UIcon :name="row.original.icon" class="relative top-0.5 size-3.5 flex-none" aria-hidden="true" />
          <span>{{ row.original.key }}</span>
        </span>
      </template>
      <template #domainOrder-cell="{ row }">
        <span :class="ROSTER_CLASS.id">{{ row.original.domain }}</span>
      </template>
      <template #description-cell="{ row }">
        <span :class="ROSTER_CLASS.about">{{ row.original.description }}</span>
      </template>
      <template #providerCount-cell="{ row }">
        <span class="whitespace-nowrap text-highlighted">{{ row.original.providerCount }}</span>
      </template>
      <template #status-cell="{ row }">
        <span :class="ROSTER_CLASS.count"
          ><span :class="ROSTER_CLASS.leader" aria-hidden="true" /><span
            class="whitespace-nowrap"
            :class="row.original.status === 'soon' ? 'text-dimmed' : 'text-(--console-accent)'"
            >{{ STATUS_LABEL[row.original.status] }}</span
          ></span
        >
      </template>
    </UTable>
    <footer :class="ROSTER_CLASS.footer">
      <span>{{ PUBLIC_LIBRARIES.length }} of {{ LIBRARIES.length }} on npm</span>
      <span :class="ROSTER_CLASS.meta">read from the catalogue / no network</span>
    </footer>
  </section>
</template>
