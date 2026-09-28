<script setup lang="ts">
import { GROUPS, LIBRARIES, PUBLIC_LIBRARIES, namedProviders, type LibraryInfo } from "../../utils/libraries";

defineProps<{ library: LibraryInfo }>();
const emit = defineEmits<{ step: [delta: number]; pause: [paused: boolean] }>();

const providerCount = new Set(LIBRARIES.flatMap((row) => namedProviders(row.providers))).size;
const withSite = LIBRARIES.filter((row) => row.status === "docs").length;
const inProgress = LIBRARIES.length - PUBLIC_LIBRARIES.length;

const { copied, copy } = useCopied();
</script>

<template>
  <header class="org-hero hero-page">
    <div class="hero-zone">
      <span class="hero-cross hero-cross-tl" aria-hidden="true">+</span>
      <span class="hero-cross hero-cross-tr" aria-hidden="true">+</span>
      <span class="hero-bracket hero-bracket-l" aria-hidden="true" />
      <span class="hero-bracket hero-bracket-r" aria-hidden="true" />

      <p class="console-id">
        <span class="console-id-tag">ID</span>
        <span>agntn</span>
        <span class="console-id-sep" aria-hidden="true">/</span>
        <span>@agntn/*</span>
      </p>

      <h1 class="hero-title">One interface. <span>Every provider.</span></h1>
      <p class="hero-lead">
        Every library takes one domain and puts one TypeScript interface in front of all the
        providers in it. You get it as a library, a CLI, an AI SDK tool, an MCP server and Pi and
        OMP extensions. Change the provider string, the rest of your code stays.
      </p>

      <dl class="hero-metrics">
        <div>
          <dt>Libraries</dt>
          <dd>{{ LIBRARIES.length }}</dd>
          <dd class="hero-metric-sub">in {{ GROUPS.length }} domains</dd>
        </div>
        <div>
          <dt>On npm</dt>
          <dd class="hero-metric-accent">{{ PUBLIC_LIBRARIES.length }}</dd>
          <dd class="hero-metric-sub">{{ withSite }} with a docs site</dd>
        </div>
        <div>
          <dt>Providers</dt>
          <dd>{{ providerCount }}+</dd>
          <dd class="hero-metric-sub">named in the catalogue</dd>
        </div>
      </dl>
      <div class="hero-share" role="img" :aria-label="`${PUBLIC_LIBRARIES.length} libraries on npm, ${inProgress} in progress`">
        <span class="hero-share-closed" :style="{ flexGrow: inProgress }" />
        <span class="hero-share-open" :style="{ flexGrow: PUBLIC_LIBRARIES.length }" />
      </div>
      <p class="hero-share-read" aria-hidden="true">
        <span>in progress {{ inProgress }}</span><span>on npm {{ PUBLIC_LIBRARIES.length }}</span>
      </p>

      <div class="console-actions">
        <UButton to="/libraries" color="primary" variant="solid" trailing-icon="i-lucide-arrow-right" label="Browse the libraries" />
        <UButton
          to="https://github.com/agntn"
          target="_blank"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-github"
          label="agntn on GitHub"
        />
      </div>
      <div class="console-install">
        <span class="console-install-tag">Install</span>
        <code
          ><span class="console-install-prompt">$</span> pnpm add @agntn/<Transition name="org-roll" mode="out-in"
            ><span :key="library.key" class="org-roll-slot">{{ library.key }}</span></Transition
          ></code
        >
        <UButton
          color="neutral"
          variant="subtle"
          :icon="copied === 'install' ? 'i-lucide-check' : 'i-lucide-copy'"
          :aria-label="copied === 'install' ? 'Copied' : 'Copy install command'"
          @click="copy('install', `pnpm add @agntn/${library.key}`)"
        />
      </div>
    </div>

    <div class="hero-instrument">
      <svg :key="library.key" class="hero-circuit" viewBox="0 0 160 56" aria-hidden="true">
        <path class="hero-circuit-rail" d="M80 0V16L96 32V56" />
        <path class="hero-circuit-live" d="M80 0V16L96 32V56" pathLength="1" />
        <path class="hero-circuit-seg" d="M96 38V48" />
        <rect class="hero-circuit-node" x="92.5" y="52.5" width="7" height="7" />
      </svg>
      <span class="hero-circuit-tag" aria-hidden="true">import</span>
      <LandingLibrary :library="library" @step="emit('step', $event)" @pause="emit('pause', $event)" />
    </div>
  </header>
</template>
