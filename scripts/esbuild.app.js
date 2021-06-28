import esbuild from "esbuild";
import babel from "esbuild-plugin-babel";

esbuild.build({
  entryPoints: ["src/index.js"],
  nodePaths: ["src"],
  bundle: true,
  // target: ["es5"],
  loader: { ".js": "jsx" },
  outfile: "build/out.js",
  plugins: [babel()],
  // publicPath: 'https://www.example.com/v1',
  minify: true,
});
