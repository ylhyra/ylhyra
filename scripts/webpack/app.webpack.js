const webpack = require("webpack");
const resolve = require("./resolve");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const shared = require("./shared");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  ...shared,
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: "index.html",
    },
    static: {
      directory: resolve("src/ylhyra/app/app/public"),
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
  // entry: "./src/app/index.tsx",
  entry: "./src/flashcards/frontend/index.tsx",
  output: {
    path: isProduction ? resolve("build/app_tmp") : resolve("build/app"),
    filename: "ylhyra.[name].js",
    publicPath: "/app/",
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react", // automatically import react where needed
    }),
    isProduction && new MiniCssExtractPlugin(),
    !isProduction && new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      // async: isEnvDevelopment,
      typescript: {
        // typescriptPath: resolve.sync('typescript', {
        //   basedir: paths.appNodeModules,
        // }),
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
        include: [
          { file: "**/src/flashcards/**/*.{ts,tsx}" },
          { file: "**/src/ylhyra/server/**/*.{ts,tsx}" },
        ],
        exclude: [
          { file: "**/tests/**" },
          { file: "**/src/ylhyra/server/**" },
          { file: "**/src/ylhyra/server/vocabulary/**" },
          { file: "**/src/ylhyra/server/translator/**" },
        ],
      },
    }),
    new HtmlWebpackPlugin({ inject: true }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        REACT_APP_PWYW: JSON.stringify(process.env.REACT_APP_PWYW),
        REACT_APP_PP_CLIENT_ID: JSON.stringify(
          process.env.REACT_APP_PP_CLIENT_ID
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
