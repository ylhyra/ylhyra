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
  // watch: {
  //   onRebuild(error, result) {
  //     if (error) console.error("watch build failed:", error);
  //     else console.log("watch build succeeded:", result);
  //     require("./../build/out.js");
  //   },
  // },
  // watch: process.env.NODE_ENV === "development",
  // minify: process.env.NODE_ENV === "development",
});
