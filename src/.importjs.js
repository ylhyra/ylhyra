module.exports = {
  useRelativePaths: false,
  declarationKeyword: "import",
  excludes: ["./ylhyra/**"],
  globals: ["Record"],
  environments: ["browser", "node", "jest"],
  emptyLineBetweenGroups: false,
  danglingCommas: false,
  aliases: {
    _: "underscore",
  },
  logLevel: "debug",
  namedExports: {
    mobx: ["action", "makeObservable", "observable"],
  },
};
