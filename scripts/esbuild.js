const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

esbuild.build({
  entryPoints: ["src/server/index.js"],
  nodePaths: ["src", "."],
  bundle: true,
  platform: "node",
  loader: { ".js": "jsx" },
  outfile: "build/out.js",
  plugins: [nodeExternalsPlugin()],
  // publicPath: 'https://www.example.com/v1',
});
