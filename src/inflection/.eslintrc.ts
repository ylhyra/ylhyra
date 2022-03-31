module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: "eslint:recommended",
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    ecmaVersion: 2020,
    experimentalDecorators: true,
    sourceType: "module",
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    "no-unused-vars": 0,
    "no-console": 0,
    "array-callback-return": 1,
    "no-unreachable": 0,
    "no-mixed-spaces-and-tabs": 1,
    "no-const-assign": 2,
    "no-duplicate-imports": 2,
    "no-useless-rename": 1,
    "no-irregular-whitespace": 1,
    "no-case-declarations": 0,
    "no-constant-condition": 0,
    "no-unneeded-ternary": 0,
    "no-empty": 0,
    "no-lonely-if": 0,
    "no-useless-catch": 0,
    "no-async-promise-executor": 0,
  },

  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/naming-convention": [
          "warn",
          {
            selector: "variable",
            format: ["snake_case", "UPPER_CASE"],
            leadingUnderscore: "allowSingleOrDouble",
          },
        ],
      },
    },
  ],
  globals: {
    process: true,
    __dirname: true,
    // Mocha tests
    describe: true,
    it: true,
  },
};
