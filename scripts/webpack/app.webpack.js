const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  devServer: {
    // static: {
    //   directory: path.join(__dirname, "./../public"),
    // },
    // compress: true,
    port: 3000,
    historyApiFallback: {
      index: "index.html",
    },
    // contentBase: "./public",
    // inline: true,
    hot: true,
    proxy: {
      "/api": "http://localhost:9123",
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  entry: "./src/index.js",
  mode: process.env.NODE_ENV,
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
    new HtmlWebpackPlugin({ inject: true }),
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [new TerserPlugin()],
  },
};

module.exports = config;
