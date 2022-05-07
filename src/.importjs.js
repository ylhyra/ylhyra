module.exports = {
  useRelativePaths: false,
  declarationKeyword: "import",
  excludes: ["./ylhyra/**"],
  globals: ["Record"],
  environments: ["browser", "node", "jest"],
  emptyLineBetweenGroups: false,
  danglingCommas: false,
  aliases: {
    _: "third-party-libs/underscore",
  },
  logLevel: "debug",
};
