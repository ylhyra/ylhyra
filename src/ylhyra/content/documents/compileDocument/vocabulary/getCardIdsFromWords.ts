import _ from "underscore";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { getHash } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { CardIds } from "ylhyra/vocabulary/types";

export const getCardIdsFromWords = (
  words: string[],
  returnMissing?: boolean
): CardIds => {
  let missingWords: string[] = [];
  let cardIds: CardIds = [];
  words.forEach((word) => {
    if (!word) return;
    const hash = getHash(word.split(" = ")[0]);
    if (hash in deck!.terms) {
      cardIds = cardIds.concat(deck!.terms[hash].cards);
    } else if (hash in deck!.alternativeIds) {
      deck!.alternativeIds[hash].forEach((j) => {
        cardIds = cardIds.concat(deck!.terms[j]?.cards || []);
      });
    } else {
      missingWords.push(word);
    }
  });
  if (returnMissing) {
    return missingWords;
  }
  return _.uniq(cardIds);
};
