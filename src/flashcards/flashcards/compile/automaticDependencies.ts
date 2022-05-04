export const automaticDependencies = () => {};

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
//           const hash = getHashForVocabulary(range) as TermId;
//           const termIds = [
//             hash,
//             ...(alternativeIds[hash] || []),
//             ...(automaticAltIds2[hash] || []),
//           ];
//
//           termIds.forEach((term_id) => {
//             let term = terms[term_id];
//             if (term) {
//               if (
//                 term.cards.some((cardId) => cards[cardId].level <= card.level)
//               ) {
//                 // if (sentence === "Þetta er mjög auðvelt.") {
//                 //   console.log(term_id);
//                 // }
//                 AddToDependencyGraph(card.terms, [term_id]);
//               }
//             }
//           });
//         }
//       }
//     });
//   }
