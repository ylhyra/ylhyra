export const addRowsIfMissing = (text: string) => {
  // let seen = [];
  // // let promptLevel = !getDeckName() ? window.prompt("Level:") : null;
  // text.split(/\n/g).forEach((row) => {
  //   if (!row || !row.trim()) return;
  //   let [is, en, note /*level, depends_on, lemmas*/] = row
  //     .replace(/^- /, "")
  //     .split(/(?: = |\t)/g);
  //   if (getDeckName()) {
  //     is = is?.replace(/;+/g, ";;").replace(/,/g, ";");
  //     en = en?.replace(/;+/g, ";;").replace(/,/g, ";");
  //   }
  //   if (
  //     !(getHashForVocabulary(is) in Database.terms) &&
  //     !(getHashForVocabulary(is) in Database.alternativeIds) &&
  //     !Database.rows.some((j) => j.icelandic === is) &&
  //     !seen.includes(getHashForVocabulary(is))
  //   ) {
  //     Database.rows.push({
  //       row_id: Database.maxID++ + 1,
  //       icelandic: is.trim(),
  //       english: en?.trim(),
  //       alternative_id: is.trim(),
  //       // // level: DECK ? null : level || window.term_level || 1,
  //       // level: level || prompt_level || null,
  //       // depends_on: depends_on || "",
  //       // lemmas: lemmas || "",
  //       note: note || "",
  //     });
  //     console.log("added " + is);
  //     seen.push(getHashForVocabulary(is));
  //   }
  // });
  // // console.log(rows);
  // save();
  // refreshRows();
};
