import { fileURLToPath } from "node:url";
import { orgTheme } from "./shiki-theme";

export default defineNuxtConfig({
  extends: ["docus"],
  /** The sibling library repos are their own pnpm workspaces; Nuxt must not walk up into them. */
  workspaceDir: fileURLToPath(new URL("./", import.meta.url)),
  devtools: { enabled: false },
  telemetry: false,
  site: {
    url: "https://agntn.dev",
    name: "agntn",
  },
  llms: {
    domain: "https://agntn.dev",
    /** Spelled out per area, or agent discovery lumps every page into one alphabetical `Docs` list. */
    sections: [
      {
        title: "About",
        contentCollection: "docs",
        contentFilters: [{ field: "path", operator: "LIKE", value: "/about%" }],
      },
      {
        title: "Libraries",
        contentCollection: "docs",
        contentFilters: [{ field: "path", operator: "LIKE", value: "/libraries%" }],
      },
    ],
  },
  /** Docus pages define their own OG images; the alt text is the one thing they leave unset. */
  ogImage: {
    defaults: {
      alt: "agntn: one interface, every provider",
    },
  },
  icon: {
    clientBundle: {
      icons: [
        "lucide:app-window",
        "lucide:archive",
        "lucide:arrow-right",
        "lucide:arrow-up-right",
        "lucide:binary",
        "lucide:book-open",
        "lucide:book-text",
        "lucide:bot",
        "lucide:brain",
        "lucide:check",
        "lucide:chevron-left",
        "lucide:chevron-right",
        "lucide:compass",
        "lucide:copy",
        "lucide:database",
        "lucide:external-link",
        "lucide:file-text",
        "lucide:git-branch",
        "lucide:globe",
        "lucide:history",
        "lucide:image",
        "lucide:key-round",
        "lucide:layers",
        "lucide:library",
        "lucide:link",
        "lucide:link-2",
        "lucide:lock",
        "lucide:map-pin",
        "lucide:music",
        "lucide:package",
        "lucide:plug",
        "lucide:radio",
        "lucide:scan-search",
        "lucide:server",
        "lucide:shapes",
        "lucide:shield-alert",
        "lucide:sparkles",
        "lucide:terminal",
        "lucide:wrench",
        "lucide:x",
        "simple-icons:github",
        "simple-icons:npm",
        "vscode-icons:file-type-js",
        "vscode-icons:file-type-typescript",
        "vscode-icons:file-type-json",
        "vscode-icons:file-type-shell",
      ],
    },
  },
  colorMode: {
    preference: "dark",
  },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      meta: [
        { name: "theme-color", content: "#0b0d10" },
        { name: "apple-mobile-web-app-title", content: "agntn" },
      ],
    },
  },
  /** Docus ships an MCP endpoint that needs the Cloudflare Agents SDK on Workers. The site does not need it. */
  mcp: {
    enabled: false,
  },
  nitro: {
    preset: "cloudflare_module",
    compatibilityDate: "2026-09-03",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  /** Nuxt's own prerender option. The same keys under `nitro.prerender` are deprecated. */
  prerender: {
    crawlLinks: true,
    routes: ["/", "/sitemap.xml", "/robots.txt", "/llms.txt", "/llms-full.txt"],
  },
  compatibilityDate: "2026-09-03",
  /** Fonts live in public/fonts and app/assets/fonts.css, which is the only place nuxt-og-image reads them from. */
  css: ["~/assets/fonts.css"],
  fonts: {
    families: [
      { name: "Figtree", provider: "local", weights: [400, 500] },
      { name: "Fira Code", provider: "local", weights: [400, 500] },
    ],
  },
  content: {
    database: {
      type: "d1",
      bindingName: "DB",
    },
    /** Prerender runs on `node:sqlite`, no native build needed. */
    experimental: {
      sqliteConnector: "native",
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: orgTheme,
            light: orgTheme,
            dark: orgTheme,
          },
        },
      },
    },
  },
});
