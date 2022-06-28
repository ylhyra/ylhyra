const esbuild = require("esbuild");
// const { nodeExternalsPlugin } = require("esbuild-node-externals");
const ignorePlugin = require("esbuild-plugin-ignore");
const argv = require("minimist")(process.argv.slice(2));

esbuild.build({
  entryPoints: [argv.entry || "src/ylhyra/server/index.ts"],
  nodePaths: ["src"],
  bundle: true,
  platform: "node",
  outfile: argv.out || "build/server/ylhyra_server.js",
  sourcemap: true,
  external: ["./node_modules/*"],

  plugins: [
    // nodeExternalsPlugin(),
    ignorePlugin([
      {
        resourceRegExp: /.styl$/,
      },
    ]),
  ],
});
