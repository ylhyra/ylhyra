import _ from "underscore";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { getHashForVocabulary } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { CardIds, TermId } from "ylhyra/vocabulary/types";

export function getCardIdsFromWords(
  words: string[],
  returnMissing?: boolean
): CardIds | string[] {
  let missingWords: string[] = [];
  let cardIds: CardIds = [];
  words.forEach((word) => {
    if (!word) return;
    const termId = getHashForVocabulary(word.split(" = ")[0]) as TermId;
    if (termId in deck!.terms) {
      cardIds = cardIds.concat(deck!.terms[termId].cards);
    } else if (deck!.alternativeIds && termId in deck!.alternativeIds) {
      deck!.alternativeIds[termId].forEach((j) => {
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
}
