const esbuild = require("esbuild");
const glob = require("glob");
const path = require("path");
const fs = require("fs");

glob.sync("assets/js/*/main.js").forEach((entry) => {
  const id = path.basename(path.dirname(entry));
  const dir = `static/js/${id}`;
  fs.mkdirSync(dir, { recursive: true });
  esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: "esm",
    sourcemap: true,
    target: ["es2020"],
    outfile: `${dir}/bundle.js`,
    alias: {
      "@": path.resolve("assets/js"),
    },
  });
});
