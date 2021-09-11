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
  // devtool: "source-map",
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
    modules: [
      ...modules,
      // resolve('src/server/'),
      resolve("src/server/inflection/"),
      resolve("."),
      // resolve('server/node_modules/'),
      // resolve('node_modules/'),
    ],
    extensions: [".js", ".json"],
  },
  externals: [nodeExternals()],
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false,
  },
  // bail: true,
  // watchOptions: {
  //   ignored: [
  //     resolve("node_modules/**"),
  //     resolve("src/documents/Parse/**"),
  //     resolve("src/documents/Read/**"),
  //     resolve("src/documents/Render/**"),
  //     resolve("src/documents/Style/**"),
  //     resolve("src/documents/Templates/**"),
  //     resolve("src/app/**"),
  //     resolve("src/maker/**"),
  //   ],
  //   aggregateTimeout: 50,
  // },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            include: modules,
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      // {
      //   oneOf: [{
      //     test: /\.(scss)$/,
      //     include: modules,
      //     loader: require.resolve('ignore-loader'),
      //   }, ],
      // },
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
