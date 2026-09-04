import type { LibraryInfo } from "./libraries";

export const SITE_URL = "https://agntn.dev";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** JSON-LD for one published library: the repo as SoftwareSourceCode, published by the agntn Organization. */
export function librarySchema(library: LibraryInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${SITE_URL}${library.to}#code`,
    name: `@agntn/${library.key}`,
    description: library.description,
    url: `${SITE_URL}${library.to}`,
    codeRepository: `https://github.com/agntn/${library.key}`,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    sameAs: [`https://www.npmjs.com/package/@agntn/${library.key}`, ...(library.site ? [library.site] : [])],
    keywords: library.providers.filter((name) => !name.startsWith("+")),
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** JSON-LD for the catalogue: every published library as one ItemList entry. */
export function catalogueSchema(libraries: readonly LibraryInfo[]) {
  const published = libraries.filter((library) => library.status !== "soon");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "agntn libraries",
    numberOfItems: published.length,
    itemListElement: published.map((library, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `@agntn/${library.key}`,
      url: `${SITE_URL}${library.to}`,
    })),
  };
}
