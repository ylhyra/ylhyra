//
// /* Automatic alt-ids */
// let prefixes = [
//   ["hér er", "here is"],
//   ["um", "about"],
//   ["frá", "from"],
//   ["til", "to"],
//   ["að", "to"],
//   ["ég", "I"],
//   ["þú", "you"],
//   ["hann er", "he is"],
//   ["hún er", "she is"],
//   ["það er", "it is"],
//   ["það er", "that is"],
//   ["hann", "he"],
//   ["hún", "she"],
//   ["það", "it"],
//   ["það", "that"],
//   ["við", "we"],
// ];
// const isPrefix = new RegExp(
//   `^(${prefixes.map((i) => i[0]).join("|")}) `,
//   "i"
// );
// const enPrefix = new RegExp(`${prefixes.map((i) => i[1]).join("|")} `, "i");
// let automaticAltIds: {
//   [key: RowId]: {
//     rows: RowIds;
//     score: number;
//   };
// } = {};
// for (let [, card] of Object.entries(cards)) {
//   if (!card.en_plaintext) continue;
//
//   /* Sleppa sjálfvirku á allra fyrstu orðunum í listanum */
//   if (
//     sortKeys &&
//     card.rows.some((row) => sortKeys[row] && sortKeys[row] < 20)
//   ) {
//     // console.log(card.en_plaintext + " hætt við vegna lágs sortkeys");
//     continue;
//   }
//
//   card.is_plaintext!.split(/ ?[,;-] ?/g).forEach((sentence) => {
//     /* Notað til að bæta við strengjum sem eru splittaðir með bandstriki */
//     const rowId: RowId = getHashForVocabulary(sentence) as RowId;
//     if (!(rowId in rows) && !(rowId in alternativeIds)) {
//       automaticAltIds[rowId] = {
//         rows: card.rows,
//         score: 0,
//       };
//       // if (sentence.match(/frá sér/)) {
//       //   console.log(sentence);
//       // }
//     }
//
//     /* Prefixar */
//     if (sentence.match(isPrefix) && card.en_plaintext!.match(enPrefix)) {
//       const without = sentence.replace(isPrefix, "");
//       const score = prefixes
//         .map((i) => i[0])
//         .indexOf((sentence.match(isPrefix)?.[1] as string).toLowerCase());
//       const rowId: RowId = getHashForVocabulary(without) as RowId;
//       if (
//         rowId in rows ||
//         rowId in alternativeIds ||
//         (rowId in automaticAltIds &&
//           automaticAltIds[rowId].score < score) ||
//         ["að"].includes(without)
//       )
//         return;
//       automaticAltIds[rowId] = {
//         rows: card.rows,
//         score: score,
//       };
//     }
//   });
// }
//
// /* TODO: Spaghetti code */
// let automaticAltIds2: {
//   [key: RowId]: RowIds;
// } = {};
// let i: RowId;
// for (i in automaticAltIds) {
//   automaticAltIds2[i] = automaticAltIds[i].rows;
//   alternativeIds[i] = automaticAltIds[i].rows;
// }
