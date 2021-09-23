const webpack = require("webpack");
const resolve = require("./resolve");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

let config;
config = {
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: "index.html",
    },
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
  stats: "errors-only", // "minimal" or "errors-only"
  entry: "./src/index.js",
  mode: process.env.NODE_ENV,
  devtool: "source-map",
  output: {
    path: resolve("build/app"),
    filename: "ylhyra.[name].js",
    publicPath: "/app/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: require("./babel.js"),
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
    extensions: [".js"],
  },
  plugins: [
    isProduction ? new MiniCssExtractPlugin() : null,
    new HtmlWebpackPlugin({ inject: true }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        REACT_APP_PWYW: JSON.stringify(process.env.REACT_APP_PWYW),
        REACT_APP_PAYPAL_CLIENT_ID: JSON.stringify(
          process.env.REACT_APP_PAYPAL_CLIENT_ID
        ),
        REACT_APP_MERCHANT_ID: JSON.stringify(
          process.env.REACT_APP_MERCHANT_ID
        ),
      },
    }),
  ].filter(Boolean),
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // keep_fnames: true,
        },
      }),
    ],
  },
};

module.exports = config;
