/**
 * One row per library, the only place library facts live. The landing, the sidebar,
 * `::library-facts` and the generated `/libraries` pages all read from here.
 *
 * `status`: `docs` has its own site, `npm` is published without one, `soon` has nothing
 * on npm yet. Only `docs` and `npm` rows get links, and a GitHub link needs `repo` too:
 * a package can be published while its repository stays private.
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
  /** Docs site, when the library has one. */
  readonly site: string | null;
  /** Public GitHub repository. A package can be on npm while its repo stays private. */
  readonly repo: boolean;
  /** Providers, platforms or chains the library speaks to. A trailing `+N` stands for N more that the row leaves unnamed. */
  readonly providers: readonly string[];
  /** Surfaces the package ships: library, cli, ai, mcp, pi, omp. */
  readonly surfaces: readonly string[];
  readonly to: string;
}

const define = (row: Omit<LibraryInfo, "to">): LibraryInfo => ({ ...row, to: `/libraries/${row.key}` });

const PROVIDER_OVERFLOW = /^\+(\d+)$/;

/** Extra count in a trailing `+N` row, or null for a real name. */
export function providerOverflow(name: string): number | null {
  const match = PROVIDER_OVERFLOW.exec(name);
  return match ? Number(match[1]) : null;
}

/** Names from the row. A trailing `+N` is not one of them. */
export function namedProviders(providers: readonly string[]): string[] {
  return providers.filter((name) => providerOverflow(name) === null);
}

/** Providers a trailing `+N` row leaves unnamed. */
export function unnamedProviderCount(providers: readonly string[]): number {
  return providers.reduce((sum, name) => sum + (providerOverflow(name) ?? 0), 0);
}

/** A row as prose. `+16` reads "and 16 more". */
export function providerPhrase(name: string): string {
  const extra = providerOverflow(name);
  return extra === null ? name : `and ${extra} more`;
}

export const LIBRARIES: readonly LibraryInfo[] = [
  define({
    key: "web",
    description: "Web search, reverse image search and page reading over Brave, Exa, Tavily, Firecrawl, Jina, SearXNG and more.",
    group: "web",
    status: "docs",
    icon: "i-lucide-globe",
    site: "https://web.agntn.dev",
    repo: true,
    providers: ["Brave", "Exa", "Tavily", "Firecrawl", "Jina", "SearXNG", "Marginalia", "Mojeek", "SerpAPI", "SerpBase", "TinyFish", "Context", "OpenAI Codex"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "archives",
    description: "Snapshots, content and diffs from the Wayback Machine, Arquivo.pt, archive.today, Common Crawl, Memento and more web archives.",
    group: "web",
    status: "docs",
    icon: "i-lucide-archive",
    site: "https://archives.agntn.dev",
    repo: true,
    providers: ["Wayback", "Arquivo.pt", "Webarchiv", "Vefsafn", "OSZK", "NLNZ", "archive.today", "Common Crawl", "WebCite", "Memento", "Archive-It", "Conifer", "Perma.cc"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "registries",
    description: "Package, versions, dependencies and maintainers from npm, PyPI, crates.io, RubyGems, Packagist and Arch Linux. One PURL in, one Package out.",
    group: "code",
    status: "docs",
    icon: "i-lucide-package",
    site: "https://registries.agntn.dev",
    repo: true,
    providers: ["npm", "PyPI", "crates.io", "RubyGems", "Packagist", "ALPM"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "forges",
    description: "Repositories, issues, pull requests, reviews, commits and code search across forges, plus Cloudflare Artifacts. Git without a forge has no issues to file.",
    group: "code",
    status: "docs",
    icon: "i-lucide-git-branch",
    site: "https://forges.agntn.dev",
    repo: true,
    providers: ["GitHub", "GitLab", "Gitea", "Bitbucket", "Gitee", "Azure DevOps", "GitBucket", "Cloudflare Artifacts"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "keys",
    description: "Generate keys, derive addresses and sign messages for Bitcoin, Ethereum, Solana, Monero, TON and more. That's a lot of chains for one key library.",
    group: "chain",
    status: "docs",
    icon: "i-lucide-key-round",
    site: "https://keys.agntn.dev",
    repo: true,
    providers: ["Bitcoin", "Ethereum", "Base", "Solana", "Stellar", "Tron", "Aptos", "Sui", "Cardano", "XRPL", "Monero", "TON", "Polkadot", "Cosmos", "+10"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "harnesses",
    description: "Metadata registry for AI coding harnesses. Binaries, configs, sessions and capabilities, plus running one harness from another.",
    group: "agents",
    status: "docs",
    icon: "i-lucide-bot",
    site: "https://harnesses.agntn.dev",
    repo: true,
    providers: ["Claude Code", "Codex", "Gemini CLI", "Cursor", "GitHub Copilot", "OpenCode", "Grok", "Antigravity", "Kilo Code", "Pi", "OMP", "MastraCode", "Freebuff", "Prime Agent", "OpenBot"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "explorers",
    description: "Balances, transactions, tokens, contracts and gas from block explorers across many chains, same shape every time.",
    group: "chain",
    status: "docs",
    icon: "i-lucide-scan-search",
    site: "https://explorers.agntn.dev",
    repo: true,
    providers: ["Etherscan", "Blockscout", "Blockchair", "Blockstream", "Mempool", "Solscan", "Helius", "Tronscan", "TON", "Aptos", "Koios", "Arweave", "dcrdata", "Horizon", "+9"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "chains",
    description: "Canonical blockchain classes with a registry, aliases, chain ids and address validation. Every library that touches a chain builds on it.",
    group: "chain",
    status: "docs",
    icon: "i-lucide-link",
    site: "https://chains.agntn.dev",
    repo: true,
    providers: ["Bitcoin", "Ethereum", "Base", "Arbitrum", "Optimism", "Polygon", "Solana", "Stellar", "TON", "Tron", "Aptos", "Sui", "Cardano", "XRPL", "+24"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "ciphers",
    description: "Classical, block and stream ciphers for CTFs and riddles. Frequency analysis and brute force are handy when the key isn't part of the clue.",
    group: "data",
    status: "docs",
    icon: "i-lucide-binary",
    site: "https://ciphers.agntn.dev",
    repo: true,
    providers: ["Caesar", "Vigenère", "Playfair", "Enigma", "ADFGVX", "Bifid", "Morse", "AES", "ChaCha20", "RC4", "+65"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "puzzles",
    description: "Public crypto puzzles and bounties as typed records, with addresses, key material, solvers and live balances. Solved doesn't always mean swept.",
    group: "chain",
    status: "docs",
    icon: "i-lucide-puzzle",
    site: "https://puzzles.agntn.dev",
    repo: true,
    providers: ["Bitcoin puzzle transaction", "RushWallet", "Zden", "Arweave", "WarpWallet", "Hash collision", "Ballet", "Bitimage", "Bitaps", "GSMG.io", "Bitcoin Movie Enigma", "+40"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "browsers",
    description: "Browser as a service. Sessions, scraping, screenshots, PDFs and crawling on Browserbase, Browserless, Steel, Hyperbrowser, Kernel and more.",
    group: "web",
    status: "docs",
    icon: "i-lucide-app-window",
    site: "https://browsers.agntn.dev",
    repo: true,
    providers: ["Browserbase", "Browserless", "Steel", "Hyperbrowser", "Kernel", "Anchor", "Cloudflare", "Playwright", "Lightpanda", "Attach"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "urls",
    description: "Passive URL discovery for a domain from web archives, crawl indexes and threat intel feeds. Never touches the target.",
    group: "web",
    status: "docs",
    icon: "i-lucide-link-2",
    site: "https://urls.agntn.dev",
    repo: true,
    providers: ["Wayback", "Common Crawl", "Arquivo.pt", "Vefsafn", "URLScan", "VirusTotal", "AlienVault"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "hashes",
    description: "Hashes, HMAC and key derivation for text or bytes. Results record rounds and chaining, because hashing bytes and hashing their hex aren't the same.",
    group: "data",
    status: "docs",
    icon: "i-lucide-hash",
    site: "https://hashes.agntn.dev",
    repo: true,
    providers: ["SHA-256", "SHA3-256", "Keccak-256", "BLAKE3", "RIPEMD-160", "MD5", "CRC-32", "xxHash", "scrypt", "Argon2id", "bcrypt", "+37"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "encodings",
    description: "Binary encodings through bech32, written from the specs. It decodes and ranks candidates rather than guessing by appearance, and checks checksums.",
    group: "data",
    status: "docs",
    icon: "i-lucide-brackets",
    site: "https://encodings.agntn.dev",
    repo: true,
    providers: ["Base64", "Base58", "Bech32", "Base32", "Base45", "Base85", "Base91", "Hex", "uuencode", "Quoted-Printable", "+10"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "compressions",
    description: "Compression through zstd, written from the specs without a zlib binding. Identifies blobs, checks checksums and peels layers, even when formats nest.",
    group: "data",
    status: "docs",
    icon: "i-lucide-shrink",
    site: "https://compressions.agntn.dev",
    repo: true,
    providers: ["gzip", "zlib", "deflate", "bzip2", "xz", "LZMA", "zstd", "Brotli", "LZ4", "Unix compress"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "curves",
    description: "Arithmetic on defined and named curves, with signing, verification, recovery and small curve discrete logs. Modular inverses deserve more than a guess.",
    group: "chain",
    status: "docs",
    icon: "i-lucide-spline",
    site: "https://curves.agntn.dev",
    repo: true,
    providers: ["Your own curve", "secp256k1", "P-256", "P-384", "P-521", "Brainpool", "Ed25519", "Ed448", "sr25519", "ristretto255"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "tools",
    description: "One tool definition for MCP, Pi, OMP and the Vercel AI SDK, with input validation on every host. One definition leaves less room for drift.",
    group: "agents",
    status: "docs",
    icon: "i-lucide-hammer",
    site: "https://tools.agntn.dev",
    repo: true,
    providers: ["MCP", "Pi", "OMP", "Vercel AI SDK", "h3-mcp", "CLI"],
    surfaces: ["library"],
  }),
  define({
    key: "memory",
    description: "One interface for agent memory systems. Remember, recall, supersede and delete, with namespaces and profiles.",
    group: "agents",
    status: "npm",
    icon: "i-lucide-brain",
    site: null,
    repo: true,
    providers: ["Cloudflare", "Mnemopi"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "maps",
    description: "Geocoding, reverse geocoding and distances from map providers, boiled down to one place shape.",
    group: "data",
    status: "npm",
    icon: "i-lucide-map-pin",
    site: null,
    repo: true,
    providers: ["OpenStreetMap", "Google Maps"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "lyrics",
    description: "Song lyrics, plain and with timestamps, plus search and a lookup of the line playing at a given second.",
    group: "data",
    status: "npm",
    icon: "i-lucide-music",
    site: null,
    repo: true,
    providers: ["LRCLIB", "Genius", "Musixmatch", "AZLyrics", "Lyrics.ovh", "Tekstowo"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "books",
    description: "Book catalog search and public domain full text from library and archive providers.",
    group: "data",
    status: "npm",
    icon: "i-lucide-library",
    site: null,
    repo: true,
    providers: ["Open Library", "Gutendex", "Wolne Lektury", "Biblioteka Narodowa", "Lubimy czytać"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "credentials",
    description: "Resolves and lists tokens already held by CLIs and the environment, consistently across packages. Error messages aren't a place for tokens.",
    group: "code",
    status: "npm",
    icon: "i-lucide-key-square",
    site: null,
    repo: true,
    providers: ["GitHub", "GitLab", "Gitea", "Gitee", "Sourcehut", "Bitbucket", "Azure DevOps", "Pushin", "Cursor Origin", "GitCafe", "Tangled", "Cloudflare"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "ox",
    description: "Shared oxlint and oxfmt policy every agntn repo consumes. Lint rules get decided once.",
    group: "code",
    status: "npm",
    icon: "i-lucide-wrench",
    site: null,
    repo: false,
    providers: ["oxlint", "oxfmt"],
    surfaces: ["library"],
  }),
  define({
    key: "sessions",
    description: "Reads AI coding sessions across harnesses in one shape, so one tool can search what another one said.",
    group: "agents",
    status: "soon",
    icon: "i-lucide-history",
    site: null,
    repo: false,
    providers: ["Claude Code", "Codex", "Gemini CLI", "Pi", "OMP", "AEI", "Mastra", "OpenClaw", "OpenCode"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "nodes",
    description: "Node access over HTTP and WebSocket RPC across Bitcoin, Decred, EVM, Solana and Arweave. Public endpoint resolved for you, or bring your own.",
    group: "chain",
    status: "soon",
    icon: "i-lucide-server",
    site: null,
    repo: false,
    providers: ["PublicNode", "Forward Research", "Custom endpoints"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
  define({
    key: "nfts",
    description: "NFT collections, items, holdings and stats across chains through one provider interface.",
    group: "chain",
    status: "soon",
    icon: "i-lucide-image",
    site: null,
    repo: false,
    providers: ["OpenSea", "Alchemy", "Magic Eden", "Getgems"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "storages",
    description: "Object storage on Cloudflare R2 and AI Search. Containers, put, get, stat, list and delete, one shape.",
    group: "data",
    status: "soon",
    icon: "i-lucide-database",
    site: null,
    repo: false,
    providers: ["Cloudflare R2", "Cloudflare AI Search"],
    surfaces: ["library", "cli", "ai", "mcp", "pi", "omp"],
  }),
  define({
    key: "wiki",
    description: "Structured wiki toolkit for agents and humans. Page elements, ingesting a repo, search, lint and reference health.",
    group: "agents",
    status: "soon",
    icon: "i-lucide-book-open",
    site: null,
    repo: false,
    providers: ["Markdown vault"],
    surfaces: ["library", "cli", "mcp", "pi", "omp"],
  }),
];

export const GROUPS: readonly { readonly key: LibraryGroup; readonly label: string; readonly blurb: string }[] = [
  { key: "web", label: "Web", blurb: "Search, read, archive and discover pages." },
  { key: "code", label: "Code", blurb: "Registries, forges, credentials and shared tooling." },
  { key: "chain", label: "Chains", blurb: "Keys, curves, nodes, explorers, puzzles and NFT data." },
  { key: "agents", label: "Agents", blurb: "Harnesses, tools, sessions, memory and wiki." },
  { key: "data", label: "Data", blurb: "Ciphers, hashes, encodings, compressions, maps, lyrics, books and storage." },
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
