import esbuild from "esbuild";
import babel from "esbuild-plugin-babel";
import sassPlugin from "esbuild-sass-plugin";

esbuild.build({
  entryPoints: ["src/app/index.js"],
  nodePaths: ["src"],
  bundle: true,
  loader: { ".js": "jsx" },
  outfile: "build/app.js",
  plugins: [
    sassPlugin.sassPlugin(),
    // babel({
    //   // config: {
    //   //   presets: [["@babel/preset-env", { targets: "ie 11, not ie_mob 11" }]],
    //   // },
    // }),
  ],
  // target: ["es5"],
  publicPath: "/app",
  watch: process.env.NODE_ENV === "development",
  minify: process.env.NODE_ENV === "development",
});
