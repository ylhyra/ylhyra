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
    "flashcards/store": ["store"],
    "mobx": [
      "action",
      "autorun",
      "computed",
      "makeAutoObservable",
      "makeObservable",
      "observable",
      "toJS",
      "spy",
    ],
    "mobx-react": ["observer", "Observer"],
    "express": ["Router", "Request", "Response"],
  },
};
