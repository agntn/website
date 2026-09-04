# agntn.dev

The organization site for [agntn](https://github.com/agntn): agnostic TypeScript libraries for AI agents and humans.

Docus on Nuxt, deployed to Cloudflare Workers, same look as the docs sites of the individual libraries.

```bash
pnpm install
pnpm dev
```

The catalogue lives in `app/utils/libraries.ts`. Edit it, run `pnpm libraries`, the pages under `content/2.libraries` get regenerated.

See [AGENTS.md](AGENTS.md) for the layout and deployment notes.
