const path = require("path");

const node_modules = path.resolve(__dirname, "./../../node_modules");
const development_plugins =
  process.env.NODE_ENV === "development"
    ? [
        [
          node_modules + "/babel-plugin-jsdoc-runtime-typecheck",
          {
            useStrict: true,
            useDirective: false,
          },
        ],
      ]
    : [];

module.exports = {
  presets: [
    [node_modules + "/@babel/preset-env"],
    [node_modules + "/@babel/preset-react"],
  ],
  plugins: [
    [node_modules + "/@babel/plugin-proposal-decorators"],
    [node_modules + "/@babel/plugin-transform-runtime"],
    [
      node_modules + "/@babel/plugin-proposal-pipeline-operator",
      {
        proposal: "fsharp",
      },
    ],
    ...development_plugins,
  ],
};
