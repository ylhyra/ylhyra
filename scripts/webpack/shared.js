const webpack = require("webpack");
const resolve = require("./resolve");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "source-map",
  stats: "errors-only", // "minimal" or "errors-only"
  module: {
    rules: [
      // {
      //   test: /\.(js|ts)$/,
      //   loader: "babel-loader",
      //   exclude: /node_modules/,
      //   options: require(resolve("babel.config.js")),
      // },

      {
        test: /\.(js|ts)x?$/,
        loader: "esbuild-loader",
        options: {
          loader: "tsx",
          target: "es2015",
        },
      },

      /* Main Stylus file extracted to a separate file */
      isProduction && {
        test: /main\.styl$/,
        use: [
          "style-loader",
          {
            loader: "file-loader",
            options: {
              name: "main.css",
            },
          },
          {
            loader: "stylus-loader",
          },
        ],
      },
      /* Other Stylus files inlined */
      {
        test: isProduction ? /index\.styl$/ : /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
    ].filter(Boolean),
  },
  resolve: {
    modules: ["./src", "node_modules"],
    extensions: [".js", ".ts"],
  },
};
