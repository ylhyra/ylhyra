module.exports = {
  extends: ["react-app"],
  plugins: ["@typescript-eslint", "import"],
  parser: "@typescript-eslint/parser",
  root: true,
  globals: {
    expect: true,
    beforeAll: true,
    NodeJS: true,
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
        "import/no-unused-modules": ["warn", { unusedExports: true }],

        "@typescript-eslint/naming-convention": [
          "warn",
          {
            selector: "variable",
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
            leadingUnderscore: "allowSingleOrDouble",
          },
        ],
        "import/no-default-export": "warn",
        "import/no-relative-packages": "error",
        "import/no-commonjs": "warn",
        "no-throw-literal": "off",
        "import/no-anonymous-default-export": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-for-in-array": "warn",
        "require-await": "warn",
        "@typescript-eslint/require-await": "warn",
        "@typescript-eslint/restrict-plus-operands": "warn",
        "@typescript-eslint/await-thenable": "warn",
        "no-invalid-this": "off",
        "@typescript-eslint/no-invalid-this": ["warn"],
        "@typescript-eslint/prefer-for-of": "warn",
      },
    },
    /**
     * Prevent Flashcards from importing from Ylhýra for now to prevent
     * accidental clashes.
     */
    {
      files: ["src/flashcards/**/*.ts", "src/flashcards/**/*.tsx"],
      rules: {
        "no-restricted-imports": [
          "warn",
          {
            patterns: ["ylhyra/*"],
          },
        ],
      },
    },
  ],
};
