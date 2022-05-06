// import _ from "underscore";
//
// export const addValuesToADependencyGraph = (
//   input: Record<string, string[]>,
//   /** These will become keys */
//   first: string[],
//   /** These will become values for each of the above keys */
//   second: string[]
// ) => {
//   if (!second || second.length === 0) return;
//   first.forEach((key) => {
//     input[key] = _.uniq([...(input[key] || []), ...second]).filter(
//       (j) => j !== key
//     );
//     if (input[key].length === 0) {
//       delete input[key];
//     }
//   });
// };

const deps: TermIdToDependencyDepth = createDependencyChainBackend(
  deck,
  termId
);
