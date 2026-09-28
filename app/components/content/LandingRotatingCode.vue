<script setup lang="ts">
import { PUBLIC_LIBRARIES, type LibraryInfo } from "../../utils/libraries";
import { tokens } from "../../utils/tokens";

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
  web: { symbol: "create", setup: 'await create("brave")', call: 'search("typescript 7 native", { maxResults: 5 })', result: "[{ url, title, snippet }], the same shape from every engine" },
  archives: { symbol: "createArchive", setup: 'createArchive("wayback")', call: 'snapshots("nuxt.com", { limit: 10 })', result: "{ success: true, pages: [{ url, timestamp, snapshot }] }" },
  registries: { symbol: "fetchPackageFromPURL", setup: "", call: 'fetchPackageFromPURL("pkg:npm/lodash")', result: "{ name, version, license, repository }" },
  forges: { symbol: "createProvider", setup: 'await createProvider("github")', call: 'pullRequests.list("agntn", "web")', result: "{ items: [{ number, title, state }], hasNextPage }" },
  keys: { symbol: "blockchains", setup: "await blockchains.bitcoin()()", call: "generateWallet()", result: "{ address, keyPublic, keyPrivate } as a Wallet" },
  harnesses: { symbol: "detectHarness", setup: "", call: "detectHarness(process.cwd())", result: "Harness | null, with binary, config and session paths" },
  explorers: { symbol: "create", setup: 'await create("etherscan")', call: 'getBalance("0xd8dA…6045")', result: "{ address, chain, balance, fetchedAt }" },
  chains: { symbol: "identify", setup: "", call: 'identify("0xd8dA…6045")', result: "{ matches: [Ethereum, Base, …], unchecked: [] }" },
  ciphers: { symbol: "create", setup: 'create("vigenere")', call: 'decode("LXFOPVEFRNHR", { key: "LEMON" })', result: '{ text: "ATTACKATDAWN", cipher: "vigenere" }' },
  puzzles: { symbol: "get", setup: "", call: 'get("b1000/71")', result: "Puzzle | undefined, with address(), keyRange() and balance()" },
  browsers: { symbol: "create", setup: 'await create("steel")', call: 'scrape("https://nuxt.com")', result: "{ url, title, markdown, text, statusCode }" },
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

/**
 * The file a snippet would be, one string per line.
 *
 * @param {string} key - The library key.
 * @returns {string[]} The lines, blank ones included.
 */
function fileLines(key: string): string[] {
  const snippet = SNIPPETS[key];
  if (!snippet) return [];
  const symbol = snippet.defaultImport ? snippet.symbol : `{ ${snippet.symbol} }`;
  const lines = [`import ${symbol} from "@agntn/${key}${snippet.path ?? ""}";`, ""];
  if (snippet.exported) {
    lines.push(`export default ${snippet.exported};`);
  } else if (snippet.setup) {
    lines.push(`const provider = ${snippet.setup};`, `const answer = await provider.${snippet.call};`);
  } else {
    lines.push(`const answer = await ${snippet.call};`);
  }
  lines.push("", `// ${snippet.result}`);
  return lines;
}

/** Every sample, so the hidden copies under the shown one give the file the height of the longest. */
const files = PUBLIC_LIBRARIES.map((row) => ({
  key: row.key,
  name: SNIPPETS[row.key]?.file ?? "agent.ts",
  lines: fileLines(row.key),
}));
const current = computed(() => files.find((file) => file.key === props.library.key) ?? files[0]!);

const { copied, copy } = useCopied();
</script>

<template>
  <section class="tool-console landing-call" aria-label="The same call shape in every library">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="console-bar">
      <span class="console-title"><span class="console-tag">File</span>{{ current.name }}</span>
      <span class="console-meta">@agntn/{{ current.key }}</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span :key="current.key" class="console-cursor" /></div>

    <div class="console-band">
      <p class="console-label console-rule-title">
        <span>Call <span aria-hidden="true">[ as written ]</span></span>
        <span class="console-mark" aria-hidden="true" />
        <UButton
          color="neutral"
          variant="subtle"
          :icon="copied === 'call' ? 'i-lucide-check' : 'i-lucide-copy'"
          :label="copied === 'call' ? 'copied' : 'copy'"
          :aria-label="copied === 'call' ? 'Copied' : 'Copy the call'"
          @click="copy('call', current.lines.join('\n'))"
        />
      </p>
      <div class="call-stack">
        <!-- prettier-ignore -->
        <pre
          v-for="file in files"
          :key="file.key"
          class="console-snippet call-file"
          :aria-hidden="file.key !== current.key"
          :data-shown="file.key === current.key"
        ><code><span v-for="(line, index) in file.lines" :key="index" class="call-line"><span class="call-no" aria-hidden="true">{{ index + 1 }}</span><span class="call-text"><span v-for="(token, part) in tokens(line)" :key="part" :class="token.cls">{{ token.text }}</span></span></span></code></pre>
      </div>
      <dl class="call-leads">
        <dd class="console-lead">
          <span class="console-tag">Install</span>
          <code class="call-lead-value">pnpm add @agntn/{{ library.key }}</code>
          <span class="console-leader" aria-hidden="true" />
        </dd>
        <dd class="console-lead">
          <span class="console-tag">Docs</span>
          <code class="call-lead-value">{{ library.site ? library.site.replace("https://", "") : "README on npm" }}</code>
          <span class="console-leader" aria-hidden="true" />
        </dd>
      </dl>
    </div>

    <footer class="console-footer console-footer-plain">
      <span>Real exports / nothing here runs</span>
      <NuxtLink :to="library.to" class="call-link"><span aria-hidden="true">→ </span>@agntn/{{ library.key }}</NuxtLink>
    </footer>
  </section>
</template>

<style scoped>
.landing-call {
  width: 100%;
  max-width: 35rem;
}
.landing-call .console-rule-title {
  margin: 0 0 12px;
}
.call-stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.call-file {
  grid-area: 1 / 1;
  visibility: hidden;
  padding-left: 0;
  font-size: 11.5px;
  white-space: pre;
}
.call-file[data-shown="true"] {
  visibility: visible;
}
/* The number and the code in two columns: an ellipsis on the line itself would hide a ::before number. */
.call-line {
  display: grid;
  grid-template-columns: 2.25em minmax(0, 1fr);
  gap: 1em;
  min-height: 1.7em;
}
.call-no {
  text-align: right;
  color: var(--ui-text-dimmed);
  user-select: none;
}
.call-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
.call-leads {
  margin: 14px 0 0;
}
.call-leads > .console-lead {
  margin: 0 0 6px;
  flex-wrap: nowrap;
  min-width: 0;
}
.call-leads .console-tag {
  flex: none;
  width: 4.5rem;
  text-align: center;
}
.call-lead-value {
  min-width: 0;
  overflow: hidden;
  font: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-text-highlighted);
}
.call-link {
  margin-left: auto;
  color: var(--ui-text-highlighted);
}
.call-link:hover {
  color: var(--console-accent);
}
.call-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
</style>
