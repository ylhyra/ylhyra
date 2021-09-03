import { getHash } from "maker/vocabulary_maker/functions";
import _ from "underscore";
// import { deck } from "app/Vocabulary/actions/deck";

let missing = [];
export const getCardIdsFromWords = (words, deck, returnMissing) => {
  let card_ids = [];
  words.forEach((word) => {
    if (!word) return;
    const hash = getHash(word.split(" = ")[0]);
    if (hash in deck.terms) {
      card_ids = card_ids.concat(deck.terms[hash].cards);
    } else if (hash in deck.alternative_ids) {
      deck.alternative_ids[hash].forEach((j) => {
        card_ids = card_ids.concat(deck.terms[j]?.cards || []);
      });
    } else {
      missing.push(word);
    }
  });
  // if (missing.length > 0) {
  //   timer && clearTimeout(timer);
  //   timer = setTimeout(() => {
  //     missing = _.uniq(missing);
  //     // console.log(`${missing.length} missing terms:\n${_.uniq(missing).join("\n")}`);
  //     // console.log(missing.join("\n"));
  //   }, 1000);
  // }
  if (returnMissing) {
    return missing;
  }
  return _.uniq(card_ids);
};
