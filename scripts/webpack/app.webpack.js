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
  stats: "errors-only", // "minimal" or "errors-only"
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
        test: /\.js$/,
        // use: "babel-loader",
        loader: "babel-loader",
        exclude: /node_modules/,
        options: require("./babel.js"),
      },
      {
        test: /\.styl$/,
        // loader: "stylus-loader",
        // use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
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
    ],
  },
  resolve: {
    modules: ["./src", "node_modules"],
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new MiniCssExtractPlugin(),
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
  ],
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [new TerserPlugin()],
  },
};

module.exports = config;
