import { build } from "esbuild";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createRumBuildConfig } from "../src/rum-policy.mjs";

const outputDirectory = resolve("dist");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(resolve("index.html"), resolve(outputDirectory, "index.html"));
for (const page of ["career.html", "about.html"]) {
  await cp(resolve(page), resolve(outputDirectory, page));
}
await cp(resolve("assets"), resolve(outputDirectory, "assets"), { recursive: true });
await cp(resolve("profile.jpg"), resolve(outputDirectory, "profile.jpg"));
await cp(resolve("projects"), resolve(outputDirectory, "projects"), { recursive: true });

const rumConfig = createRumBuildConfig(process.env);
await writeFile(
  resolve(outputDirectory, "rum-config.js"),
  `globalThis.__PERSONAL_SITE_RUM__ = Object.freeze(${JSON.stringify(rumConfig)});\n`,
  "utf8",
);

await build({
  entryPoints: [resolve("src/rum.js")],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  outfile: resolve(outputDirectory, "rum.js"),
  legalComments: "none",
});

console.log(
  `Built dist/ with privacy-safe RUM ${rumConfig.enabled ? "enabled" : "disabled"}.`,
);
