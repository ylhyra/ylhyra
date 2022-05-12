/**
 * This is here so that Jest can use the same Babel configuration
 */

const path = require("path");

const node_modules = path.resolve(__dirname, "./node_modules");
const development_plugins =
  process.env.NODE_ENV === "development" && !process.env.JEST_WORKER_ID
    ? [
        require.resolve("react-refresh/babel"),
        // [
        //   node_modules + "/babel-plugin-jsdoc-runtime-typecheck",
        //   {
        //     useStrict: true,
        //     useDirective: false,
        //   },
        // ],
      ]
    : [];
// const development_plugins = [];

module.exports = {
  presets: [
    // [node_modules + "/@babel/preset-env"],
    // [node_modules + "/@babel/preset-react"],
    ["@babel/preset-env"],
    ["@babel/preset-react"],
    "@babel/preset-typescript",
  ],
  plugins: [
    /**
     * Test: Babel's helper functions are too slow
     */
    "transform-class",
    // [node_modules + "/@babel/plugin-transform-runtime"],
    ["@babel/plugin-transform-runtime"],
    ["inline-json-import", {}],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ...development_plugins,
  ],
};
