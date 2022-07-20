/** This is here so that Jest can use the same Babel configuration */

const path = require("path");

// const node_modules = path.resolve(__dirname, "./node_modules");
// const development_plugins =
//   process.env.NODE_ENV === "development" && !process.env.JEST_WORKER_ID
//     ? [
//         require.resolve("react-refresh/babel"),
//         // [
//         //   node_modules + "/babel-plugin-jsdoc-runtime-typecheck",
//         //   {
//         //     useStrict: true,
//         //     useDirective: false,
//         //   },
//         // ],
//       ]
//     : [];
// const development_plugins = [];

module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
    // ["inline-json-import", {}],
    // ...development_plugins,
  ],
};
