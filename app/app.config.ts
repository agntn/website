export default defineAppConfig({
  docus: {
    colorMode: "dark",
  },
  header: {
    title: "agntn",
  },
  /** Landing JSON-LD: WebSite published by the agntn Organization, reconciled with GitHub and npm through sameAs. */
  seo: {
    title: "agntn",
    description:
      "Agnostic TypeScript libraries for AI agents and humans. One interface per domain, many providers behind it, same shape from a library call, a CLI, an AI SDK tool or an MCP server.",
    schema: {
      type: "Organization",
      organization: {
        name: "agntn",
        url: "https://agntn.dev",
        logo: "/icon-512.png",
        sameAs: ["https://github.com/agntn", "https://www.npmjs.com/org/agntn"],
      },
    },
  },
  github: {
    url: "https://github.com/agntn/website",
    branch: "main",
    rootDir: "",
  },
  socials: {
    github: "https://github.com/agntn",
    npm: "https://www.npmjs.com/org/agntn",
  },
  ui: {
    colors: {
      primary: "amber",
      neutral: "slate",
    },
    /**
     * Buttons in the instrument grammar, by variant, so a page writes <UButton> and gets the look
     * from app.css: primary solid and neutral outline are boxed actions with the glyph in its own
     * cell, neutral subtle the small control of an instrument (`square` for a step button), and
     * the site's own `chip` variant a chip, primary for the picked one. Docus renders its search
     * field as neutral soft and its own buttons as neutral ghost and link, so those stay default.
     */
    button: {
      slots: {
        base: "h-9 rounded-lg px-3.5 text-sm leading-none font-medium cursor-pointer transition-colors",
      },
      variants: {
        variant: {
          chip: "",
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "org-action org-action-primary ring-0",
        },
        {
          color: "neutral",
          variant: "outline",
          class: "org-action ring-0",
        },
        {
          color: "neutral",
          variant: "subtle",
          class: "org-control ring-0",
        },
        {
          color: "neutral",
          variant: "subtle",
          square: true,
          class: "org-control-square",
        },
        {
          color: "neutral",
          variant: "chip",
          class: "org-chip",
        },
        {
          color: "primary",
          variant: "chip",
          class: "org-chip org-chip-on",
        },
      ],
    },
    /** Status words as boxed mono capitals: neutral quiet, subtle bright, primary the accent, error red. */
    badge: {
      slots: {
        base: "org-badge",
      },
      compoundVariants: [
        { color: "neutral", variant: "subtle", class: "org-badge-bright ring-0" },
        { color: "neutral", variant: "outline", class: "ring-0" },
        { color: "primary", variant: "outline", class: "org-badge-accent ring-0" },
        { color: "error", variant: "outline", class: "org-badge-error ring-0" },
      ],
    },
    /** Tabs as mono capitals on a quiet rule, the active one over an accent segment. */
    tabs: {
      compoundVariants: [
        {
          variant: "link",
          class: {
            list: "org-tabs-list",
            trigger: "org-tabs-trigger",
            indicator: "org-tabs-indicator",
          },
        },
      ],
    },
    /** A field with variant none sits inside a readout row: the row is its frame, the value is mono. */
    input: {
      compoundVariants: [
        { variant: "none", class: { base: "org-field", leadingIcon: "org-field-icon" } },
      ],
    },
    selectMenu: {
      slots: {
        content: "org-menu rounded-none ring-0 shadow-none bg-transparent",
        group: "org-menu-group",
        item: "org-menu-item",
        itemLeadingIcon: "org-field-icon",
        input: "org-menu-input",
      },
      compoundVariants: [
        {
          variant: "none",
          class: {
            base: "org-field",
            leadingIcon: "org-field-icon",
            trailingIcon: "org-field-icon",
          },
        },
      ],
    },
    /** A failed read: a red edge and the message in mono, no box. */
    alert: {
      compoundVariants: [
        {
          color: "error",
          variant: "outline",
          class: {
            root: "org-alert ring-0",
            title: "org-alert-title",
            icon: "org-alert-icon",
          },
        },
      ],
    },
    /** A tooltip is a console label: flat, clipped corner, mono, and it wraps, because it carries full addresses. */
    tooltip: {
      slots: {
        content:
          "org-tooltip h-auto max-w-[min(32rem,calc(100vw-2rem))] rounded-none bg-transparent shadow-none ring-0 px-3 py-1.5 data-[state=delayed-open]:animate-none data-[state=closed]:animate-none",
        text: "whitespace-normal text-highlighted [overflow-wrap:anywhere]",
      },
    },
    /** The site header, the search field and the keys in the instrument grammar; the look lives in app.css. */
    header: {
      slots: {
        root: "org-site-header",
      },
    },
    contentSearchButton: {
      slots: {
        base: "org-search",
      },
    },
    /** The search modal and its palette in the instrument grammar; the look lives in app.css (portalled). */
    contentSearch: {
      slots: {
        modal: "org-search-modal",
      },
    },
    commandPalette: {
      slots: {
        root: "org-palette",
        input: "org-palette-input",
        close: "org-palette-close",
        group: "org-palette-group",
        label: "org-palette-label",
        item: "org-palette-item",
        itemLeadingIcon: "org-palette-icon",
        itemLabel: "org-palette-text",
        itemLabelBase: "org-palette-name",
        itemDescription: "org-palette-about",
        empty: "org-palette-empty",
      },
    },
    kbd: {
      base: "org-kbd",
    },
    pageHeader: {
      slots: {
        root: "org-page-header py-8 border-b-0",
        headline: "org-eyebrow mb-3",
        title: "text-3xl sm:text-4xl font-medium tracking-tight text-highlighted",
        description: "text-base leading-7 text-muted",
      },
    },
    /**
     * The layouts with a right aside get one track per panel instead of the ten column grid: the toc
     * takes a fixed 13.75rem, a little wider than Nuxt UI's, and the text keeps 52rem on a large
     * screen, the width the rosters need before they stack.
     */
    page: {
      compoundVariants: [
        {
          left: true,
          right: true,
          class: {
            root: "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_min(13.75rem,20%)]",
            left: "lg:col-span-1",
            center: "lg:col-span-1",
            right: "lg:col-span-1",
          },
        },
        {
          left: false,
          right: true,
          class: {
            root: "lg:grid-cols-[minmax(0,1fr)_min(13.75rem,20%)]",
            center: "lg:col-span-1",
            right: "lg:col-span-1",
          },
        },
      ],
    },
    /** Nuxt UI truncates TOC entries; headings here are sentences, so let them wrap. */
    contentToc: {
      slots: {
        linkText: "whitespace-normal",
      },
    },
    prose: {
      callout: {
        slots: {
          base: "rounded-xl px-4 py-3.5",
        },
      },
      /** Inline code in the instrument grammar; the look lives in `.org-code` in app.css. */
      code: {
        base: "org-code",
      },
      pre: {
        slots: {
          header: "border-default bg-default",
          base: "border-default bg-muted",
        },
      },
    },
    pageHero: {
      slots: {
        title: "font-medium tracking-tight",
        description: "text-base leading-7 sm:text-lg",
      },
    },
  },
});
