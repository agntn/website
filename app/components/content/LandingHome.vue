<script setup lang="ts">
import { GROUPS, LIBRARIES, PUBLIC_LIBRARIES } from "../../utils/libraries";
import { shellTokens, type Token } from "../../utils/tokens";

const { paused, current, step } = useLandingClock();

/** The scripts every repo keeps, as the conventions page lists them. */
const SCRIPTS = [
  "# same scripts in every @agntn package",
  "pnpm build       # obuild, ESM, .d.mts",
  "pnpm test        # vitest",
  "pnpm lint        # oxlint + oxfmt via @agntn/ox",
  "pnpm typecheck   # tsc, TypeScript 7",
  "pnpm release     # changelogen, OIDC publish",
] as const;

/**
 * Colors one line of the list: the command through the shell tokenizer, a trailing # as a comment.
 *
 * @param {string} line - A command, a comment or both.
 * @returns {Token[]} Pieces that join back to the line.
 */
function scriptTokens(line: string): Token[] {
  const at = line.indexOf("#");
  const command = at === -1 ? line : line.slice(0, at);
  return [...shellTokens(command), ...(at === -1 ? [] : [{ text: line.slice(at), cls: "tok-cm" }])];
}
</script>

<template>
  <div class="org-landing not-prose">
    <LandingHero :library="current" @step="step" @pause="paused = $event" />

    <LandingFeature
      title="Same calls, every library"
      to="/about/shape"
      link="How a library is built"
      :checks="[
        'create(\'name\') resolves a registered class. Adapters register themselves, nothing to extend by hand',
        'Every answer is the shared type. Provider quirks stay in the adapter and never leak out',
        'Typed errors: RateLimitError with retryAfter, NotFoundError, HTTPError with the key already redacted',
      ]"
    >
      Pick the domain, pick the provider by name, call the method. Web search, package registries,
      git forges, block explorers, the call site looks the same. This file walks through the
      {{ PUBLIC_LIBRARIES.length }} published libraries, one real export each.
      <template #visual>
        <LandingRotatingCode :library="current" />
      </template>
    </LandingFeature>

    <LandingFeature
      title="Write once, run from any host"
      to="/about/surfaces"
      link="Library, CLI, AI SDK, MCP, Pi, OMP"
      :checks="[
        'CLI, MCP server and the Pi and OMP extensions share one set of tool executors',
        'AI SDK tools come from the /ai subpath with Zod schemas, the host abort signal passed straight through',
        'Nothing bundled twice. The extension sources ship inside the npm package',
      ]"
      reverse
    >
      A human types the command in a shell. An agent calls the same executor through MCP, the
      Vercel AI SDK, Pi or OMP. Same answer, same provider diagnostics, so what the model reads is
      what you'd have read yourself.
      <template #visual>
        <SurfaceGrid class="landing-panel" />
      </template>
    </LandingFeature>

    <section class="org-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-20 sm:px-12 lg:px-16">
        <div class="max-w-2xl">
          <h2 class="text-2xl font-medium tracking-tight text-highlighted sm:text-[1.75rem]">
            {{ GROUPS.length }} domains, {{ LIBRARIES.length }} libraries
          </h2>
          <p class="mt-4 text-sm leading-6 text-muted">
            Published ones link to their page here, with the docs site or the npm package from
            there. The rest are still in private repos and sit here so you know what's coming.
          </p>
        </div>
        <LandingRegistry class="mt-10" :library="current" @pause="paused = $event" />
      </div>
    </section>

    <LandingFeature
      title="Boring on purpose"
      to="/about/conventions"
      link="Stack and conventions"
      :checks="[
        'Node.js 22 or 24 and up per package, ESM only, strict TypeScript',
        'obuild, vitest, oxlint and oxfmt through the shared @agntn/ox policy',
        'Releases from GitHub Actions with npm trusted publishing, no tokens lying around',
      ]"
    >
      Every repo starts from the same template and keeps the same scripts, so jumping from one
      library to the next costs nothing. All of it is before 1.0, pin exact versions.
      <template #visual>
        <section class="tool-console landing-panel" aria-label="Scripts every repo keeps">
          <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
          <span class="console-cross console-cross-br" aria-hidden="true">+</span>
          <header class="console-bar">
            <span class="console-title"><span class="console-tag">List</span>scripts</span>
            <span class="console-meta">every repo</span>
            <span class="console-mark" aria-hidden="true" />
          </header>
          <div class="console-ruler" aria-hidden="true" />
          <div class="console-band">
            <!-- prettier-ignore -->
            <pre class="console-snippet console-lines"><code><span v-for="(line, index) in SCRIPTS" :key="index"><span v-for="(token, part) in scriptTokens(line)" :key="part" :class="token.cls">{{ token.text }}</span></span></code></pre>
          </div>
          <footer class="console-footer console-footer-plain">
            <span>Same template / same scripts</span>
          </footer>
        </section>
      </template>
    </LandingFeature>

    <section class="org-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-20 sm:px-12 lg:px-16">
        <LandingStart />
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-panel {
  width: 100%;
  max-width: 35rem;
}
</style>
