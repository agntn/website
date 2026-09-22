<script setup lang="ts">
import type { LibraryInfo } from "../../utils/libraries";

/** One real call per published library, checked against what that package exports. Nothing here runs. */
const props = defineProps<{ library: LibraryInfo }>();

interface Snippet {
  /** Imported symbol, named unless `defaultImport` is set. */
  symbol: string;
  /** Subpath after the package name, for a package that exports no root. */
  path?: string;
  /** Default import instead of a named one. */
  defaultImport?: boolean;
  /** File the snippet would live in. */
  file?: string;
  /** Expression that builds the object the call runs on, empty for a free function. */
  setup: string;
  /** The call, made on `provider` when `setup` is set. Empty when `exported` carries the usage. */
  call: string;
  /** Object the snippet exports, for a package that is configuration rather than a call. */
  exported?: string;
  result: string;
}

const SNIPPETS: Record<string, Snippet> = {
  web: { symbol: "create", setup: 'create("brave")', call: 'search({ query: "typescript 7 native", maxResults: 5 })', result: "{ results: [{ url, title, snippet }], ignoredFilters: [] }" },
  archives: { symbol: "createArchive", setup: 'createArchive("wayback")', call: 'snapshots("nuxt.com", { limit: 10 })', result: "{ success: true, pages: [{ url, timestamp, snapshot }] }" },
  registries: { symbol: "fetchPackageFromPURL", setup: "", call: 'fetchPackageFromPURL("pkg:npm/lodash")', result: "{ name, version, license, repository }" },
  forges: { symbol: "createProvider", setup: 'createProvider("github")', call: 'pullRequests.list("agntn", "web")', result: "{ items: [{ number, title, state }], hasNextPage }" },
  keys: { symbol: "blockchains", setup: "await blockchains.bitcoin()()", call: "generateWallet()", result: "{ address, keyPublic, keyPrivate } as a Wallet" },
  harnesses: { symbol: "detectHarness", setup: "", call: "detectHarness(process.cwd())", result: "Harness | null, with binary, config and session paths" },
  explorers: { symbol: "create", setup: 'await create("etherscan")', call: 'getBalance("0xd8dA…6045")', result: "{ address, chain, balance, fetchedAt }" },
  chains: { symbol: "identify", setup: "", call: 'identify("0xd8dA…6045")', result: "{ matches: [Ethereum, Base, …], unchecked: [] }" },
  ciphers: { symbol: "create", setup: 'create("vigenere")', call: 'decode("LXFOPVEFRNHR", { key: "LEMON" })', result: '{ text: "ATTACKATDAWN", cipher: "vigenere" }' },
  puzzles: { symbol: "get", setup: "", call: 'get("b1000/71")', result: "Puzzle | undefined, with address(), keyRange() and balance()" },
  browsers: { symbol: "create", setup: 'create("steel")', call: 'scrape("https://nuxt.com")', result: "{ url, title, markdown, text, statusCode }" },
  urls: { symbol: "create", setup: 'await create("wayback")', call: 'discover("nuxt.com", { limit: 50 })', result: "[{ url, source, input, ext }], deduplicated and in scope" },
  lyrics: { symbol: "create", setup: 'create("lrclib")', call: 'lyrics({ artist: "Radiohead", track: "Nude" })', result: "{ provider, artist, track, plain, synced }" },
  ox: {
    symbol: "oxlint",
    path: "/oxlint",
    defaultImport: true,
    file: "oxlint.config.ts",
    setup: "",
    call: "",
    exported: '{ ...oxlint, ignorePatterns: ["dist"] }',
    result: "the shared rules, options and all, plus one repo-local setting",
  },
};

const snippet = computed<Snippet>(() => SNIPPETS[props.library.key] ?? { symbol: "create", setup: "", call: "…", result: "…" });
</script>

<template>
  <div class="org-frame overflow-hidden rounded-xl">
    <div class="flex items-center justify-between border-b border-muted bg-default px-4 py-2.5">
      <span class="flex items-center gap-2 font-mono text-[11px] text-dimmed">
        <UIcon name="i-vscode-icons-file-type-typescript" class="size-4" />
        {{ snippet.file ?? "agent.ts" }}
      </span>
      <span class="org-chip org-chip-small">
        <span class="org-dot" :style="{ '--lib': library.accent }" />
        @agntn/{{ library.key }}
      </span>
    </div>
    <Transition name="org-roll" mode="out-in">
      <pre :key="library.key" class="org-rotating"><span class="tok-kw">import</span> <template v-if="snippet.defaultImport"><span class="tok-key">{{ snippet.symbol }}</span></template><template v-else>{ <span class="tok-key">{{ snippet.symbol }}</span> }</template> <span class="tok-kw">from</span> <span class="tok-str">"@agntn/{{ library.key }}{{ snippet.path ?? "" }}"</span>;
<template v-if="snippet.exported">
<span class="tok-kw">export default</span> {{ snippet.exported }};</template><template v-else-if="snippet.setup">
<span class="tok-kw">const</span> provider = <span class="tok-fn">{{ snippet.setup }}</span>;
<span class="tok-kw">const</span> answer = <span class="tok-kw">await</span> provider.<span class="tok-fn">{{ snippet.call }}</span>;</template><template v-else>
<span class="tok-kw">const</span> answer = <span class="tok-kw">await</span> <span class="tok-fn">{{ snippet.call }}</span>;</template>

<span class="tok-cm">// {{ snippet.result }}</span></pre>
    </Transition>
  </div>
</template>
