const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const ignorePlugin = require("esbuild-plugin-ignore");

esbuild.build({
  entryPoints: ["src/ylhyra/server/index.ts"],
  nodePaths: ["src"],
  bundle: true,
  platform: "node",
  // loader: { ".js": "jsx" },
  outfile: "build/server/ylhyra_server.js",
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
