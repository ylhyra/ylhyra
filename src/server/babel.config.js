module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-jsx",
    "babel-plugin-styled-components",
  ],
};
