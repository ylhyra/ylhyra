import _ from "underscore";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { getHash } from "ylhyra/maker/vocabulary_maker/compile/functions";

export const getCardIdsFromWords = (
  words: string[],
  returnMissing?: boolean
) => {
  let missing = [];
  let cardIds = [];
  words.forEach((word) => {
    if (!word) return;
    const hash = getHash(word.split(" = ")[0]);
    if (hash in deck.terms) {
      cardIds = cardIds.concat(deck.terms[hash].cards);
    } else if (hash in deck.alternative_ids) {
      deck.alternative_ids[hash].forEach((j) => {
        cardIds = cardIds.concat(deck.terms[j]?.cards || []);
      });
    } else {
      missing.push(word);
    }
  });
  if (returnMissing) {
    return missing;
  }
  return _.uniq(cardIds);
};
