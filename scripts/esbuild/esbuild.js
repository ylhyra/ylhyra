const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const ignorePlugin = require("esbuild-plugin-ignore");
const argvFactory = require("minimist");
const argv = argvFactory(process.argv.slice(2));

esbuild.build({
  entryPoints: ["src/ylhyra/server/index.ts"],
  nodePaths: ["src"],
  bundle: true,
  platform: "node",
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
