import _ from "underscore";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { getHashForVocabulary } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { CardIds } from "ylhyra/vocabulary/types";

export const getCardIdsFromWords: {
  (words: string[]): CardIds;
  (words: string[], returnMissing: true): string[];
} = (words: string[], returnMissing?: boolean) => {
  let missingWords: string[] = [];
  let cardIds: CardIds = [];
  words.forEach((word) => {
    if (!word) return;
    const hash = getHashForVocabulary(word.split(" = ")[0]);
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
