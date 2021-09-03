/* Automatic dependency graphs */
export default function () {
  // TODO: Sleppa þegar deps innihalda nú þegar þetta orð!
  for (let [key, card] of Object.entries(cards)) {
    card.is_plaintext.split(/(?:[,;] ?| - )/g).forEach((sentence) => {
      const split = sentence.replace(/[,.!;:?"„“]/g, "").split(/ /g);
      const min_len = 1;
      for (let i = 0; i + min_len <= split.length && i <= 5; i++) {
        for (let b = i + min_len; b <= split.length && b <= i + 5; b++) {
          if (i === 0 && b === split.length) continue;
          const range = split.slice(i, b).join(" ");

          /* Checks if the hash of a particular range exists */
          const hash = getHash(range);
          if (hash === getHash(sentence) || hash === getHash(card.is_plaintext))
            continue;
          const term_ids = [
            hash,
            ...(alternative_ids[hash] || []),
            ...(automatic_alt_ids[hash] || []),
          ];

          term_ids.forEach((term_id) => {
            let term = terms[term_id];
            if (term) {
              if (
                term.cards.some((card_id) => cards[card_id].level <= card.level)
              ) {
                // if (/r einhver anna/.test(sentence)) {
                //   console.log(term_id);
                //   console.log({
                //     t: card.terms,
                //     term_id,
                //   });
                // }
                AddToDependencyGraph(card.terms, [term_id]);
              }
            }
          });
        }
      }
    });
  }

  console.log(dependencies[getHash("einhver annar")]);
  window.dependencies = dependencies;
}
