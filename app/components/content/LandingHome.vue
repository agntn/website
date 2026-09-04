<script setup lang="ts">
import { GROUPS, LIBRARIES, PUBLIC_LIBRARIES, SURFACES } from "../../utils/libraries";

const { tick, paused, current, step } = useLandingClock();

const providerCount = new Set(LIBRARIES.flatMap((library) => library.providers.filter((name) => !name.startsWith("+")))).size;

const stats = [
  { value: String(LIBRARIES.length), label: "libraries" },
  { value: String(PUBLIC_LIBRARIES.length), label: "on npm" },
  { value: `${providerCount}+`, label: "providers" },
  { value: String(SURFACES.length), label: "surfaces" },
] as const;

const copied = ref(false);

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(`pnpm add @agntn/${current.value.key}`);
  } catch {
    return;
  }
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1200);
}
</script>

<template>
  <div class="org-landing not-prose">
    <header class="org-hero mx-auto w-full max-w-[var(--ui-container)] px-8 pt-24 pb-20 text-center sm:px-12 lg:px-16">
      <p class="org-eyebrow org-enter justify-center">Agnostic libraries for AI agents and humans</p>
      <h1 class="org-enter mx-auto mt-5 max-w-4xl text-4xl leading-[1.08] font-medium tracking-tight text-highlighted sm:text-5xl lg:text-[3.5rem]">
        One interface. <span class="text-primary">Every provider.</span>
      </h1>
      <p class="org-enter org-enter-2 mx-auto mt-6 max-w-xl text-base leading-7 text-muted">
        Every library takes one domain, puts one TypeScript interface in front of all the providers
        in it, and ships that as a library, a CLI, an AI SDK tool, an MCP server and Pi and OMP
        extensions. Change the provider string, the rest of your code stays.
      </p>
      <div class="org-enter org-enter-3 mt-8 flex flex-wrap items-center justify-center gap-2">
        <UButton to="/libraries" color="primary" trailing-icon="i-lucide-arrow-right">
          Browse the libraries
        </UButton>
        <UButton to="https://github.com/agntn" target="_blank" color="neutral" variant="outline" icon="i-simple-icons-github">
          agntn on GitHub
        </UButton>
      </div>
      <button
        type="button"
        class="org-enter org-enter-4 org-install mt-5"
        :aria-label="copied ? 'Copied' : 'Copy install command'"
        @click="copyInstall"
      >
        <span class="text-dimmed">$</span>
        <span>pnpm add @agntn/<Transition name="org-roll" mode="out-in"><span :key="current.key" class="org-roll-slot">{{ current.key }}</span></Transition></span>
        <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5 text-dimmed" />
      </button>

      <div
        class="org-enter org-enter-4 mx-auto mt-16 hidden max-w-6xl md:block"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <LandingConstellation :active="current.key" :tick="tick" />
      </div>
    </header>

    <dl class="org-section grid grid-cols-2 sm:grid-cols-4">
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="border-default px-6 py-7 text-center"
        :class="{ 'border-t sm:border-t-0': i >= 2, 'border-l': i % 2 === 1, 'sm:border-l': i > 0 }"
      >
        <dd class="font-mono text-2xl text-highlighted">{{ stat.value }}</dd>
        <dt class="mt-1 font-mono text-[11px] tracking-[0.12em] text-dimmed uppercase">{{ stat.label }}</dt>
      </div>
    </dl>

    <LandingFeature
      eyebrow="The shape"
      title="Same calls, every library"
      to="/about/shape"
      link="How a library is built"
      :checks="[
        'create(\'name\') resolves a registered class. Adapters register themselves, nothing to extend by hand',
        'Every answer is the shared type. Provider quirks stay in the adapter and never leak out',
        'Typed errors: RateLimitError with retryAfter, NotFoundError, HTTPError with the key already redacted. Never an empty object that looks like an answer',
      ]"
    >
      Pick the domain, pick the provider by name, call the method. Web search, package registries,
      git forges, block explorers, the call site looks the same. This panel walks through the
      {{ PUBLIC_LIBRARIES.length }} published libraries.
      <template #visual>
        <div @mouseenter="paused = true" @mouseleave="paused = false">
          <LandingRotatingCode :library="current" />
          <div class="mt-3 flex items-center justify-between">
            <button type="button" class="org-copy" aria-label="Previous library" @click="step(-1)">
              <UIcon name="i-lucide-chevron-left" class="size-3.5" />
              prev
            </button>
            <NuxtLink :to="current.to" class="org-chip org-chip-ok" :style="{ '--lib': current.accent }">
              <span class="org-dot" />
              @agntn/{{ current.key }}
            </NuxtLink>
            <button type="button" class="org-copy" aria-label="Next library" @click="step(1)">
              next
              <UIcon name="i-lucide-chevron-right" class="size-3.5" />
            </button>
          </div>
        </div>
      </template>
    </LandingFeature>

    <LandingFeature
      eyebrow="Surfaces"
      title="Write once, run from any host"
      to="/about/surfaces"
      link="Library, CLI, AI SDK, MCP, Pi, OMP"
      :checks="[
        'CLI, MCP server and the Pi and OMP extensions share one set of tool executors',
        'AI SDK tools come from the /ai subpath with Zod schemas, host abort signal passed straight through',
        'Nothing bundled twice. The extension sources ship inside the npm package',
      ]"
      reverse
    >
      A human types the command in a shell. An agent calls the same executor through MCP, the
      Vercel AI SDK, Pi or OMP. Same answer, same provider diagnostics, so what the model reads is
      what you'd have read yourself.
      <template #visual>
        <SurfaceGrid />
      </template>
    </LandingFeature>

    <section class="org-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-20 sm:px-12 lg:px-16">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="org-eyebrow">Libraries</p>
            <h2 class="mt-3 text-2xl font-medium tracking-tight text-highlighted sm:text-[1.75rem]">
              {{ GROUPS.length }} domains, {{ LIBRARIES.length }} libraries
            </h2>
            <p class="mt-3 max-w-lg text-sm leading-6 text-muted">
              Published ones link to their docs site or npm page. The rest are in progress and sit here so you know what's coming.
            </p>
          </div>
          <NuxtLink to="/libraries" class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Full catalogue
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </NuxtLink>
        </div>
        <LibraryGrid :active="current.key" grouped />
      </div>
    </section>

    <LandingFeature
      eyebrow="Conventions"
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
        <div class="org-frame overflow-hidden rounded-xl">
          <div class="flex items-center gap-2 border-b border-muted bg-default px-4 py-2.5 font-mono text-[11px] text-dimmed">
            <UIcon name="i-vscode-icons-file-type-shell" class="size-4" />
            every repo
          </div>
          <pre class="org-rotating"><span class="tok-cm"># same scripts in every @agntn package</span>
pnpm <span class="tok-fn">build</span>       <span class="tok-cm"># obuild, ESM, .d.mts</span>
pnpm <span class="tok-fn">test</span>        <span class="tok-cm"># vitest</span>
pnpm <span class="tok-fn">lint</span>        <span class="tok-cm"># oxlint + oxfmt via @agntn/ox</span>
pnpm <span class="tok-fn">typecheck</span>   <span class="tok-cm"># tsc, TypeScript 7</span>
pnpm <span class="tok-fn">release</span>     <span class="tok-cm"># changelogen, OIDC publish</span></pre>
        </div>
      </template>
    </LandingFeature>

    <section class="org-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-20 text-center sm:px-12 lg:px-16">
        <h2 class="text-2xl font-medium tracking-tight text-highlighted sm:text-3xl">
          Pick a domain, add one package
        </h2>
        <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Provider responses are data you didn't write. Every library hands them back as typed values, never as instructions.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
          <UButton to="/libraries" color="primary" trailing-icon="i-lucide-arrow-right">
            Browse the libraries
          </UButton>
          <UButton to="/about" color="neutral" variant="outline">
            About agntn
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
