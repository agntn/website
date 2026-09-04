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
      primary: "lime",
      neutral: "slate",
    },
    button: {
      slots: {
        base: "h-9 rounded-lg px-3.5 text-sm leading-none font-medium cursor-pointer transition-colors",
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "org-primary-fill ring-0",
        },
        {
          color: "neutral",
          variant: "outline",
          class: "org-neutral-outline ring-0",
        },
      ],
    },
    pageHeader: {
      slots: {
        root: "py-8 border-b border-muted",
        headline: "org-eyebrow mb-3",
        title: "text-3xl sm:text-4xl font-medium tracking-tight text-highlighted",
        description: "text-base leading-7 text-muted",
      },
    },
    contentSurround: {
      slots: {
        link: "rounded-xl org-frame border-0 bg-default hover:bg-muted",
        linkLeadingIcon: "text-muted",
      },
    },
    prose: {
      callout: {
        slots: {
          base: "rounded-xl px-4 py-3.5",
        },
      },
      card: {
        slots: {
          base: "rounded-xl org-frame border-0 p-5 bg-default hover:bg-muted",
          icon: "size-5 mb-3 text-muted transition-colors group-hover:text-primary",
          title: "text-sm font-medium",
          description: "text-sm text-muted",
        },
      },
      cardGroup: {
        base: "grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 *:my-0",
      },
      table: {
        slots: {
          root: "rounded-xl org-frame",
        },
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
