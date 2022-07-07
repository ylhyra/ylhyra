module.exports = {
  useRelativePaths: false,
  declarationKeyword: "import",
  excludes: ["./ylhyra/**", "./inflection/**"],
  globals: ["Record"],
  environments: ["browser", "node", "jest"],
  emptyLineBetweenGroups: false,
  danglingCommas: false,
  aliases: {
    _: "underscore",
  },
  logLevel: "debug",
  sortImports: false,
  namedExports: {
    mobx: [
      "action",
      "autorun",
      "computed",
      "makeAutoObservable",
      "makeObservable",
      "observable",
      "observer",
      "Observer",
      "toJS",
      "spy",
    ],
    express: ["Router", "Request", "Response"],
  },
};
