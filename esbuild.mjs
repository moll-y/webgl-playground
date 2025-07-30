import { build } from "esbuild";
import { glsl } from "esbuild-plugin-glsl";
import { glob } from "glob";
import path from "path";
import fs from "fs";

glob.sync("assets/js/*/main.js").forEach((entry) => {
  const id = path.basename(path.dirname(entry));
  const dir = `static/js/${id}`;
  fs.mkdirSync(dir, { recursive: true });
  build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: "esm",
    sourcemap: true,
    target: ["es2020"],
    outfile: `${dir}/bundle.js`,
    alias: {
      "@": path.resolve("assets/js"),
      "@glsl": path.resolve("assets/glsl"),
    },
    plugins: [
      glsl({
        minify: true,
      }),
    ],
    loader: {
      ".glsl": "text",
      ".vert": "text",
      ".frag": "text",
    },
  });
});
