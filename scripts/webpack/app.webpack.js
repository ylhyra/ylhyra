const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");

const resolve = (input) => path.resolve(process.env.PWD, input);

let project;
if (process.env.PROJECT === "flashcards") {
  project = {
    entry: "./src/flashcards/app/app.tsx",
    filename: "ylhyra.[name].js",
  };
} else {
  project = {
    entry: "./src/ylhyra/app/index.tsx",
    filename: "ylhyra.[name].js",
  };
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "source-map",
  stats: "errors-only", // "minimal" or "errors-only"
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: require(resolve("babel.config.js")),
          },
          // {
          //   loader: "webpack-module-hot-accept",
          // },
        ],
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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ].filter(Boolean),
  },
  resolve: {
    modules: ["./src", "node_modules"],
    extensions: [".ts", ".tsx", ".js"],
  },
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: "index.html",
    },
    static: {
      directory: resolve("src/ylhyra/app/app/public"),
    },
    hot: false,
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
  entry: project.entry,
  output: {
    path: isProduction ? resolve("build/app_tmp") : resolve("build/app"),
    filename: project.filename,
    publicPath: "/app/",
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react", // automatically import react where needed
    }),
    isProduction && new MiniCssExtractPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: !isProduction,
      typescript: {
        configOverwrite: {
          compilerOptions: {
            skipLibCheck: true,
            inlineSourceMap: false,
            declarationMap: false,
            noEmit: true,
            incremental: true,
            strict: false,
          },
        },
      },
      issue: {
        include: [{ file: "**/src/flashcards/**/*.{ts,tsx}" }],
        exclude: [],
      },
    }),
    new HtmlWebpackPlugin({ inject: true }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ...(project.envs || {}),
      },
      "__REACT_DEVTOOLS_GLOBAL_HOOK__": "({ isDisabled: true })",
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
