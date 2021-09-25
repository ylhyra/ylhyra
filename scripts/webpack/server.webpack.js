const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const NodemonPlugin = require("nodemon-webpack-plugin");
// var HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const resolve = require("./resolve");
const shared = require("./shared");
// const polyfills = resolve('scripts/webpack/utils/config/polyfills.js')

module.exports = {
  ...shared,
  target: "node",
  devtool: "inline-source-map",
  node: {
    __dirname: true,
    __filename: false,
  },
  entry: {
    ylhyra_server: [/*polyfills,*/ resolve("src/server/index.js")],
  },
  output: {
    path:
      process.env.NODE_ENV === "development"
        ? resolve("build/server/development")
        : resolve("build/server"),
    filename:
      process.env.NODE_ENV === "development"
        ? "[name].development.js"
        : "[name].js",
  },
  externals: [nodeExternals()],
  cache: true,
  plugins: [
    // new HardSourceWebpackPlugin(),
    new NodemonPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.WatchIgnorePlugin({
      paths: [
        resolve("src/documents/Parse"),
        resolve("src/documents/Read"),
        resolve("src/documents/Render"),
        resolve("src/documents/Style"),
        resolve("src/documents/Templates"),
        resolve("src/app"),
      ],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /\.styl$/,
    }),
  ],
};
