import _ from "underscore";
import {
  getCardIdsFromTermIds,
  getTermIdsFromCardIds,
} from "ylhyra/vocabulary/app/actions/card/functions";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { printWord } from "ylhyra/vocabulary/app/actions/functions";
import { withDependencies } from "ylhyra/vocabulary/app/actions/functions/dependencies";
import { getCardIdsFromWords } from "ylhyra/documents/compile/vocabulary/getCardIdsFromWords";
import { initializeDeckFromFile } from "ylhyra/documents/compile/vocabulary/initializeDeckFromFile";

export const parseVocabularyList = (vocabulary_list) => {
  if (!vocabulary_list) return;
  if (!deck) initializeDeckFromFile();
  const cardIds = getCardIdsFromWords(vocabulary_list).filter(
    (id) => id in deck!.cards
  );
  // const missing = getCardIdsFromWords(vocabulary_list, true);
  const terms = getTermIdsFromCardIds(cardIds);
  const dependencyTerms = getTermIdsFromCardIds(
    _.difference(withDependencies(cardIds), cardIds)
  );
  if (terms.length === 0) return null;

  const sentences = _.uniq(
    _.flatten(
      terms
        .map((term_id) => {
          return printWord(term_id)?.split(/;+ /g);
        })
        .filter(Boolean)
    )
  );

  const cards = getCardIdsFromTermIds(terms);
  const dependencyCards = getCardIdsFromTermIds(dependencyTerms);

  let out = {
    terms,
    dependencyTerms,
    cards,
    dependencyCards,
    sentences,
  };
  // if (missing) {
  //   out.missing = missing;
  // }
  return out;
};
