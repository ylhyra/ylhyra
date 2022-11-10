export function automaticDependencies() {}

// /* Automatic dependency graphs */
//   const ignoredAutomaticWords = [
//     "hér",
//     "hér er",
//     "um",
//     "frá",
//     "til",
//     "hann",
//     "hún",
//     "það",
//     "er",
//     "ert",
//     "ég",
//     "eru",
//     "að",
//     "við",
//     "hann er",
//     "ég er",
//     "þú ert",
//     "hún er",
//     "það er",
//   ];
//   // TODO: Sleppa þegar deps innihalda nú þegar þetta orð!
//   for (let [, card] of Object.entries(cards)) {
//     card.is_plaintext!.split(/[,;] ?/g).forEach((sentence) => {
//       const split = sentence.replace(/[,.!;:?"„“]/g, "").split(/ /g);
//       const minLen = 1;
//       for (let i = 0; i + minLen <= split.length && i <= 5; i++) {
//         for (let b = i + minLen; b <= split.length && b <= i + 5; b++) {
//           if (i === 0 && b === split.length) continue;
//           const range = split.slice(i, b).join(" ");
//
//           if (ignoredAutomaticWords.includes(range.toLowerCase())) {
//             continue;
//           }
//
//           const hash = getHashForVocabulary(range) as RowId;
//           const rowIds = [
//             hash,
//             ...(alternativeIds[hash] || []),
//             ...(automaticAltIds2[hash] || []),
//           ];
//
//           rowIds.forEach((row_id) => {
//             let row = rows[row_id];
//             if (row) {
//               if (
//                 row.cards.some((cardId) => cards[cardId].level <= card.level)
//               ) {
//                 // if (sentence === "Þetta er mjög auðvelt.") {
//                 //   console.log(row_id);
//                 // }
//                 AddToDependencyGraph(card.rows, [row_id]);
//               }
//             }
//           });
//         }
//       }
//     });
//   }
