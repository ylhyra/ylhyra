const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const { stylusLoader } = require("esbuild-stylus-loader");
const ignorePlugin = require("esbuild-plugin-ignore");

esbuild.build({
  entryPoints: ["src/server/index.js"],
  nodePaths: ["src"],
  bundle: true,
  platform: "node",
  loader: { ".js": "jsx" },
  outfile: "build/server/ylhyra_server.js",
  sourcemap: true,
  // minify: true,
  plugins: [
    nodeExternalsPlugin(),
    ignorePlugin([
      {
        resourceRegExp: /.styl$/,
      },
    ]),
    // stylusLoader({
    //   stylusOptions: {
    //     define: [],
    //   },
    // }),
  ],
});
