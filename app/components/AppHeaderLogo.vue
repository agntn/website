<template>
  <!-- The mark: the favicon's ring in a boxed cell, then the name in mono. -->
  <span class="site-logo">
    <span class="site-logo-cell" aria-hidden="true"><UIcon name="i-lucide-circle-dot" /></span>
    <span class="site-logo-name">agntn</span>
  </span>
</template>

<style scoped>
.site-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.site-logo-cell {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  color: var(--console-accent);
  background: color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg));
  box-shadow: inset 0 0 0 1px var(--console-line);
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
}
.site-logo-cell > * {
  width: 14px;
  height: 14px;
}
.site-logo-name {
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: -0.01em;
  color: var(--ui-text-highlighted);
}
a:hover .site-logo-cell {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--console-accent) 55%, transparent);
}
</style>
