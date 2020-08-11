module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: "eslint:recommended",
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    experimentalDecorators: true,
    sourceType: "module",
  },
  plugins: [
    "react",
  ],
  rules: {
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-unused-vars": 0,
    "no-console": 0,
    "array-callback-return": 1,
    "no-lonely-if": 1,
    "no-unreachable": 0,
    "no-mixed-spaces-and-tabs": 1,
    "no-unneeded-ternary": 1,
    "no-const-assign": 2,
    "no-duplicate-imports": 2,
    "no-useless-rename": 1,
    "react/jsx-uses-vars": 1,
    // "no-irregular-whitespace":0,
    // "prefer-arrow-callback": 1,
    "no-case-declarations": 0,
    "no-constant-condition": 0,
    "no-unneeded-ternary": 0,
    "no-empty": 0,
    "no-lonely-if": 0,
    "no-useless-catch": 0,
    "no-async-promise-executor": 0,
  },
  globals: {
    process: true,
    cordova: true,
    __dirname: true,
    Buffer: true,
    $: true,
    mw: true, // MediaWiki
  }
}
