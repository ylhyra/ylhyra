const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const resolve = (input) => path.resolve(__dirname, "./../../" + input);
const NodemonPlugin = require("nodemon-webpack-plugin");
var HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

// const polyfills = resolve('scripts/webpack/utils/config/polyfills.js')
const modules = [
  resolve("src/"),
  // resolve('node_modules'),
];
module.exports = {
  target: "node",
  devtool: "inline-source-map",
  node: {
    __dirname: true,
    __filename: false,
  },
  mode: process.env.NODE_ENV,
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
  resolve: {
    modules: [...modules, resolve("src/server/inflection/"), resolve(".")],
    extensions: [".js", ".json"],
  },
  externals: [nodeExternals()],
  stats: "errors-only",
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        // use: "babel-loader",
        loader: "babel-loader",
        exclude: /node_modules/,
        options: require("./babel.js"),
      },
    ],
  },
  cache: false,
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
  ],
};
