import { deck } from "app/vocabulary/actions/deck";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import _ from "underscore";

export const getCardIdsFromWords = (words, returnMissing) => {
  let missing = [];
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
  if (returnMissing) {
    return missing;
  }
  return _.uniq(card_ids);
};
