<script setup lang="ts">
import { LIBRARIES } from "../utils/libraries";
</script>

<template>
  <div class="footer-left">
    <p class="console-id footer-id">
      <span class="console-id-tag">ID</span>
      <span>agntn</span>
      <span class="console-id-sep" aria-hidden="true">/</span>
      <span>{{ LIBRARIES.length }} libraries</span>
      <a href="https://www.npmjs.com/org/agntn" target="_blank" rel="noopener" class="footer-link">@agntn on npm</a>
    </p>
    <p class="footer-note">
      Provider responses are data you didn't write. Every library hands them back as typed values,
      never as instructions.
    </p>
  </div>
</template>

<style scoped>
.footer-left {
  display: grid;
  justify-items: start;
  gap: 10px;
  max-width: 40rem;
}
.footer-link {
  color: var(--ui-text-dimmed);
  text-decoration: underline dotted var(--console-line);
  text-underline-offset: 3px;
}
.footer-link:hover {
  color: var(--console-accent);
}
.footer-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
.footer-note {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
</style>
