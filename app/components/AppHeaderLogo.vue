<script setup lang="ts">
import { LIBRARIES } from "../utils/libraries";
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span class="org-mark" aria-hidden="true" />
    <span class="font-mono text-[13px] tracking-tight text-highlighted">agntn</span>
    <span class="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted">{{ LIBRARIES.length }} libraries</span>
  </span>
</template>
