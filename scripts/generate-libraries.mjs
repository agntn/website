/** Writes one page per library into content/2.libraries from the catalogue. Run `pnpm libraries` after editing it. */
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { LIBRARIES, STATUS_LABEL } from "../app/utils/libraries.ts";

const dir = fileURLToPath(new URL("../content/2.libraries/", import.meta.url));
await mkdir(dir, { recursive: true });

for (const file of await readdir(dir)) {
  if (/^\d{2}\.[a-z-]+\.md$/.test(file)) {
    await unlink(`${dir}${file}`);
  }
}

const page = (library, index) => {
  const number = String(index + 1).padStart(2, "0");
  const links =
    library.status === "soon"
      ? ""
      : [
          library.site ? `- Docs: [${library.site.replace("https://", "")}](${library.site})` : "",
          `- GitHub: [agntn/${library.key}](https://github.com/agntn/${library.key})`,
          `- npm: [@agntn/${library.key}](https://www.npmjs.com/package/@agntn/${library.key})`,
        ]
          .filter(Boolean)
          .join("\n");
  const install =
    library.status === "soon"
      ? ""
      : `## Install

\`\`\`bash
pnpm add @agntn/${library.key}
\`\`\`
`;
  return {
    file: `${number}.${library.key}.md`,
    body: `---
title: "@agntn/${library.key}"
description: ${JSON.stringify(library.description)}
navigation:
  title: ${library.key}
---

::library-facts{name="${library.key}"}
::

${install}
## Providers

${library.providers.map((provider) => (provider.startsWith("+") ? `- and ${provider.slice(1)} more` : `- ${provider}`)).join("\n")}

## Status

${STATUS_LABEL[library.status] === "docs" ? "Published on npm with a docs site of its own." : STATUS_LABEL[library.status] === "on npm" ? "Published on npm. The README on GitHub is the reference until it gets a docs site." : "Still in a private repo. Links show up here after the first release."}
${links ? `\n## Links\n\n${links}\n` : ""}`,
  };
};

for (const [index, library] of LIBRARIES.entries()) {
  const { file, body } = page(library, index);
  await writeFile(`${dir}${file}`, body);
}

console.log(`wrote ${LIBRARIES.length} pages to content/2.libraries`);
