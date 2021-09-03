/* Automatic alt-ids */

export default function () {
  let prefixes = [
    ["hér er", "here is"],
    ["hér eru", "here are"],
    ["um", "about"],
    ["frá", "from"],
    ["til", "to"],
    ["að", "to"],
    ["ég", "I"],
    ["þú", "you"],
    ["hann er", "he is"],
    ["hún er", "she is"],
    ["það er", "it is"],
    ["það er", "that is"],
    ["hann", "he"],
    ["hún", "she"],
    ["það", "it"],
    ["það", "that"],
    ["við", "we"],
  ];
  const is_prefix = new RegExp(
    `^(${prefixes.map((i) => i[0]).join("|")}) `,
    "i"
  );
  const en_prefix = new RegExp(`${prefixes.map((i) => i[1]).join("|")} `, "i");

  let automatic_alt_ids = {};
  for (let [key, card] of Object.entries(cards)) {
    if (!card.en_plaintext) continue;
    card.is_plaintext.split(/ ?[,;-] ?/g).forEach((sentence) => {
      /* Bæta við strengjum sem eru splittaðir með bandstriki */
      const sentence_hash = getHash(sentence);
      if (!(sentence_hash in terms) && !(sentence_hash in alternative_ids)) {
        automatic_alt_ids[sentence_hash] = {
          terms: card.terms,
          score: 0,
        };
      }
      // if (sentence.match(/um þig/)) {
      //   console.log(sentence);
      // }

      /* Prefixar */
      if (sentence.match(is_prefix) && card.en_plaintext.match(en_prefix)) {
        const without = sentence.replace(is_prefix, "");
        const score = prefixes
          .map((i) => i[0])
          .indexOf(sentence.match(is_prefix)[1].toLowerCase());
        const hash = getHash(without);
        if (
          hash in terms ||
          hash in alternative_ids ||
          (hash in automatic_alt_ids &&
            automatic_alt_ids[hash].score < score) ||
          ["að"].includes(without)
        )
          return;
        automatic_alt_ids[hash] = {
          terms: card.terms,
          score: score,
        };
      }
    });
  }
  Object.keys(automatic_alt_ids).forEach((i) => {
    automatic_alt_ids[i] = automatic_alt_ids[i].terms;
    alternative_ids[i] = automatic_alt_ids[i].terms;
  });
}
