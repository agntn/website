import { fileURLToPath } from "node:url";

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
        { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#0b0d10" },
        { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#eef1f4" },
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
    prerender: {
      crawlLinks: true,
      routes: ["/", "/sitemap.xml", "/robots.txt", "/llms.txt", "/llms-full.txt"],
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  compatibilityDate: "2026-09-03",
  /** Fonts live in public/fonts and app/assets/fonts.css, which is the only place nuxt-og-image reads them from. */
  css: ["~/assets/fonts.css"],
  fonts: {
    families: [
      { name: "Space Grotesk", provider: "local", weights: [400, 500, 600] },
      { name: "Space Mono", provider: "local", weights: [400, 700] },
    ],
  },
  content: {
    database: {
      type: "d1",
      bindingName: "DB",
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-light",
            light: "github-light",
            dark: "poimandres",
          },
        },
      },
    },
  },
});
