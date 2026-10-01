import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Internal links are plain <a>: PageTransition intercepts clicks on the document to play the
      // block wipe before routing, and next/link would handle (and preventDefault) the click first.
      "@next/next/no-html-link-for-pages": "off",
      // Section CSS positions, scales and parallaxes <img> directly; next/image's wrapper styles fight it.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
