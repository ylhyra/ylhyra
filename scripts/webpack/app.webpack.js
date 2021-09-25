const webpack = require("webpack");
const resolve = require("./resolve");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const shared = require("./shared");

module.exports = {
  ...shared,
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: "index.html",
    },
    static: {
      directory: resolve("src/app/app/public"),
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
  entry: "./src/index.js",
  output: {
    path: resolve("build/app"),
    filename: "ylhyra.[name].js",
    publicPath: "/app/",
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
