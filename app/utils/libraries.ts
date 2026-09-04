/**
 * One row per library, the only place library facts live. The landing, the sidebar,
 * `::library-facts` and the generated `/libraries` pages all read from here.
 *
 * `status`: `docs` has its own site, `npm` is published without one, `soon` sits in a
 * private repo with nothing public yet. Only `docs` and `npm` rows get links.
 */
export type LibraryStatus = "docs" | "npm" | "soon";

export type LibraryGroup = "web" | "code" | "chain" | "agents" | "data";

export interface LibraryInfo {
  /** Short name, the part after `@agntn/`. */
  readonly key: string;
  readonly description: string;
  readonly group: LibraryGroup;
  readonly status: LibraryStatus;
  readonly icon: string;
  /** Tailwind palette of the library's own site, or the one it would get. */
  readonly color: string;
  /** Accent hex for the landing grid, the dark shade of the palette above. */
  readonly accent: string;
  /** Docs site, when the library has one. */
  readonly site: string | null;
  /** Providers, platforms or chains the library speaks to. */
  readonly providers: readonly string[];
  /** Surfaces the package ships: library, cli, ai, mcp, pi, omp. */
  readonly surfaces: readonly string[];
  readonly to: string;
}

const define = (row: Omit<LibraryInfo, "to">): LibraryInfo => ({ ...row, to: `/libraries/${row.key}` });

export const LIBRARIES: readonly LibraryInfo[] = [
  define({
    key: "web",
    description: "Web search, reverse image search and page reading over Brave, Exa, Tavily, Firecrawl, Jina, SearXNG and five more.",
    group: "web",
    status: "docs",
    icon: "i-lucide-globe",
    color: "teal",
    accent: "#5eead4",
    site: "https://web.agntn.dev",
    providers: ["Brave", "Exa", "Tavily", "Firecrawl", "Jina", "SearXNG", "Mojeek", "SerpAPI", "SerpBase", "TinyFish", "Context"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "archives",
    description: "Snapshots, content and diffs from the Wayback Machine, Arquivo.pt, archive.today, Common Crawl, Memento and five more web archives.",
    group: "web",
    status: "docs",
    icon: "i-lucide-archive",
    color: "amber",
    accent: "#fcd34d",
    site: "https://archives.agntn.dev",
    providers: ["Wayback", "Arquivo.pt", "Webarchiv", "archive.today", "Common Crawl", "WebCite", "Memento", "Archive-It", "Conifer", "Perma.cc"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "registries",
    description: "Package, versions, dependencies and maintainers from npm, PyPI, crates.io, RubyGems, Packagist and Arch Linux. One PURL in, one Package out.",
    group: "code",
    status: "docs",
    icon: "i-lucide-package",
    color: "violet",
    accent: "#c4b5fd",
    site: "https://registries.agntn.dev",
    providers: ["npm", "PyPI", "crates.io", "RubyGems", "Packagist", "ALPM"],
    surfaces: ["library", "cli", "ai", "pi"],
  }),
  define({
    key: "forges",
    description: "Repositories, issues, pull requests, review threads, commits and code search on GitHub, GitLab, Gitea and GitBucket.",
    group: "code",
    status: "docs",
    icon: "i-lucide-git-branch",
    color: "rose",
    accent: "#fda4af",
    site: "https://forges.agntn.dev",
    providers: ["GitHub", "GitLab", "Gitea", "GitBucket"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "keys",
    description: "Key generation, HD derivation, addresses and message signing for Bitcoin, Ethereum, Solana, Tron, Aptos, Sui, Cardano and Base.",
    group: "chain",
    status: "docs",
    icon: "i-lucide-key-round",
    color: "sky",
    accent: "#7dd3fc",
    site: "https://keys.agntn.dev",
    providers: ["Bitcoin", "Ethereum", "Base", "Solana", "Tron", "Aptos", "Sui", "Cardano"],
    surfaces: ["library", "cli", "mcp", "pi"],
  }),
  define({
    key: "harnesses",
    description: "Metadata registry for AI coding harnesses. Binaries, configs, sessions and capabilities, plus running one harness from another.",
    group: "agents",
    status: "npm",
    icon: "i-lucide-bot",
    color: "orange",
    accent: "#fdba74",
    site: null,
    providers: ["Claude Code", "Codex", "Gemini CLI", "Cursor", "GitHub Copilot", "OpenCode", "Grok", "Antigravity", "Pi", "OMP", "MastraCode", "Freebuff"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "explorers",
    description: "Balances, transactions, tokens, contracts and gas from block explorers across many chains, same shape every time.",
    group: "chain",
    status: "npm",
    icon: "i-lucide-scan-search",
    color: "cyan",
    accent: "#67e8f9",
    site: null,
    providers: ["Etherscan", "Blockscout", "Blockchair", "Blockstream", "Mempool", "Solscan", "Helius", "Tronscan", "TON", "Aptos", "Koios", "Blockberry"],
    surfaces: ["library", "cli", "pi", "omp"],
  }),
  define({
    key: "chains",
    description: "Canonical blockchain classes with a registry, aliases, chain ids and address validation. Every library that touches a chain builds on it.",
    group: "chain",
    status: "npm",
    icon: "i-lucide-link",
    color: "indigo",
    accent: "#a5b4fc",
    site: null,
    providers: ["Bitcoin", "Ethereum", "Base", "Arbitrum", "Optimism", "Polygon", "Solana", "Stellar", "TON", "Tron", "Aptos", "Sui", "Cardano", "XRPL", "+12"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "ciphers",
    description: "Classical and puzzle ciphers with encode, decode, frequency analysis and brute force. Built for CTFs and riddles.",
    group: "data",
    status: "npm",
    icon: "i-lucide-binary",
    color: "fuchsia",
    accent: "#f0abfc",
    site: null,
    providers: ["Caesar", "Vigenère", "Playfair", "Enigma", "ADFGVX", "Bifid", "Polybius", "Bacon", "Morse", "Rail fence", "+8"],
    surfaces: ["library", "cli", "pi", "omp"],
  }),
  define({
    key: "sessions",
    description: "Reads AI coding sessions across harnesses in one shape, so one tool can search what another one said.",
    group: "agents",
    status: "soon",
    icon: "i-lucide-history",
    color: "orange",
    accent: "#fdba74",
    site: null,
    providers: ["Claude Code", "Codex", "Gemini CLI", "Pi", "OMP"],
    surfaces: ["library", "cli", "mcp", "pi"],
  }),
  define({
    key: "memory",
    description: "One interface for agent memory systems. Remember, recall, supersede and delete, with namespaces and profiles.",
    group: "agents",
    status: "soon",
    icon: "i-lucide-brain",
    color: "orange",
    accent: "#fdba74",
    site: null,
    providers: ["Cloudflare", "Mnemopi"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "browsers",
    description: "Browser as a service. Sessions, scraping, screenshots, PDFs and crawling on Browserbase, Browserless, Steel, Hyperbrowser and Kernel.",
    group: "web",
    status: "soon",
    icon: "i-lucide-app-window",
    color: "teal",
    accent: "#5eead4",
    site: null,
    providers: ["Browserbase", "Browserless", "Steel", "Hyperbrowser", "Kernel", "Anchor", "Cloudflare", "Playwright"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "urls",
    description: "Passive URL discovery for a domain from web archives, crawl indexes and threat intel feeds. Never touches the target.",
    group: "web",
    status: "soon",
    icon: "i-lucide-link-2",
    color: "teal",
    accent: "#5eead4",
    site: null,
    providers: ["Wayback", "Common Crawl", "Arquivo.pt", "Vefsafn", "URLScan", "VirusTotal", "AlienVault"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "nodes",
    description: "Node access over HTTP and WebSocket RPC across Bitcoin, EVM and Solana. Public endpoint resolved for you, or bring your own.",
    group: "chain",
    status: "soon",
    icon: "i-lucide-server",
    color: "indigo",
    accent: "#a5b4fc",
    site: null,
    providers: ["PublicNode", "Custom endpoints"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "nfts",
    description: "NFT collections, items, holdings and stats across chains through one provider interface.",
    group: "chain",
    status: "soon",
    icon: "i-lucide-image",
    color: "cyan",
    accent: "#67e8f9",
    site: null,
    providers: ["OpenSea", "Alchemy", "Magic Eden", "Getgems"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "storages",
    description: "Object storage on Cloudflare R2 and AI Search. Containers, put, get, stat, list and delete, one shape.",
    group: "data",
    status: "soon",
    icon: "i-lucide-database",
    color: "emerald",
    accent: "#6ee7b7",
    site: null,
    providers: ["Cloudflare R2", "Cloudflare AI Search"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "maps",
    description: "Geocoding, reverse geocoding and distances from map providers, boiled down to one place shape.",
    group: "data",
    status: "soon",
    icon: "i-lucide-map-pin",
    color: "emerald",
    accent: "#6ee7b7",
    site: null,
    providers: ["OpenStreetMap", "Google Maps"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "lyrics",
    description: "Song lyrics, plain and with timestamps, plus search and a lookup of the line playing at a given second.",
    group: "data",
    status: "soon",
    icon: "i-lucide-music",
    color: "emerald",
    accent: "#6ee7b7",
    site: null,
    providers: ["LRCLIB", "Genius", "Musixmatch", "AZLyrics", "Lyrics.ovh", "Tekstowo"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "books",
    description: "Book catalog search and public domain full text from library and archive providers.",
    group: "data",
    status: "soon",
    icon: "i-lucide-library",
    color: "emerald",
    accent: "#6ee7b7",
    site: null,
    providers: ["Open Library", "Gutendex", "Wolne Lektury", "Biblioteka Narodowa", "Lubimy czytać"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "wiki",
    description: "Structured wiki toolkit for agents and humans. Page elements, ingesting a repo, search, lint and reference health.",
    group: "agents",
    status: "soon",
    icon: "i-lucide-book-open",
    color: "orange",
    accent: "#fdba74",
    site: null,
    providers: ["Markdown vault"],
    surfaces: ["library", "cli", "pi", "omp"],
  }),
  define({
    key: "ox",
    description: "Shared oxlint and oxfmt policy every agntn repo consumes. Lint rules get decided once.",
    group: "code",
    status: "soon",
    icon: "i-lucide-wrench",
    color: "violet",
    accent: "#c4b5fd",
    site: null,
    providers: ["oxlint", "oxfmt"],
    surfaces: ["library"],
  }),
];

export const GROUPS: readonly { readonly key: LibraryGroup; readonly label: string; readonly blurb: string }[] = [
  { key: "web", label: "Web", blurb: "Search, read, archive and discover pages." },
  { key: "code", label: "Code", blurb: "Registries, forges and shared tooling." },
  { key: "chain", label: "Chains", blurb: "Keys, nodes, explorers and NFT data." },
  { key: "agents", label: "Agents", blurb: "Harnesses, sessions, memory and wiki." },
  { key: "data", label: "Data", blurb: "Storage, maps, lyrics, books and ciphers." },
];

export const SURFACES: readonly { readonly key: string; readonly label: string; readonly blurb: string; readonly icon: string }[] = [
  { key: "library", label: "Library", blurb: "ESM, strict TypeScript, typed errors.", icon: "i-lucide-layers" },
  { key: "cli", label: "CLI", blurb: "Same calls from a shell, --json for scripts.", icon: "i-lucide-terminal" },
  { key: "ai", label: "AI SDK", blurb: "Vercel AI SDK tools from the /ai subpath.", icon: "i-lucide-sparkles" },
  { key: "mcp", label: "MCP", blurb: "One server over stdio for every host.", icon: "i-lucide-plug" },
  { key: "pi", label: "Pi", blurb: "Extension shipped inside the package.", icon: "i-lucide-radio" },
  { key: "omp", label: "OMP", blurb: "Same executors, OMP packaging.", icon: "i-lucide-shapes" },
];

export const STATUS_LABEL: Record<LibraryStatus, string> = {
  docs: "docs",
  npm: "on npm",
  soon: "in progress",
};

export function librariesIn(group: LibraryGroup) {
  return LIBRARIES.filter((library) => library.group === group);
}

export function findLibrary(key: string) {
  return LIBRARIES.find((library) => library.key === key);
}

export const PUBLIC_LIBRARIES = LIBRARIES.filter((library) => library.status !== "soon");
