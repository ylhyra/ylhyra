const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const config = {
  entry: "./src/index.js",
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "./../build/app"),
    filename: "ylhyra.[name].js",
    publicPath: "/app/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    modules: ["./src", "node_modules"],
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

module.exports = config;
