module.exports = {
  ignorePatterns: ["**/esbuild.js"],
  extends: ["react-app"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  root: true,
  globals: {
    __basedir: true,
    expect: true,
    beforeAll: true,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],

      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      rules: {
        "no-undef": "error",
        "@typescript-eslint/naming-convention": [
          "warn",
          {
            selector: "variable",
            format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
            leadingUnderscore: "allowSingleOrDouble",
          },
        ],
        "no-throw-literal": "off",
        "import/no-anonymous-default-export": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-for-in-array": "warn",
        "require-await": "warn",
        "@typescript-eslint/require-await": "warn",
        "@typescript-eslint/restrict-plus-operands": "warn",
        "@typescript-eslint/restrict-template-expressions": "warn",
        "@typescript-eslint/await-thenable": "warn",
        "no-invalid-this": "off",
        "@typescript-eslint/no-invalid-this": ["warn"],
        // "@typescript-eslint/prefer-for-of": "warn",

        // "@typescript-eslint/no-unsafe-argument": "warn",
        // "@typescript-eslint/no-unsafe-assignment": "warn",
        // "@typescript-eslint/no-unsafe-call": "warn",
        // "@typescript-eslint/no-unsafe-member-access": "warn",
        // "@typescript-eslint/no-unsafe-return": "warn",
      },
    },
  ],
};
