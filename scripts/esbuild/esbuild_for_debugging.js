/* eslint-disable */
/**
 * Used for debugging within Webstorm.
 *
 * node scripts/esbuild/esbuild_for_debugging.js
 */
const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const ignorePlugin = require("esbuild-plugin-ignore");

esbuild.build({
  entryPoints: ["src/flashcards/flashcards/actions/tmp_debug.ts"],
  nodePaths: ["src"],
  bundle: true,
  platform: "node",
  outfile: "build/ts/debug.js",
  sourcemap: true,
  plugins: [
    nodeExternalsPlugin(),
    ignorePlugin([
      {
        resourceRegExp: /.styl$/,
      },
    ]),
  ],
});
