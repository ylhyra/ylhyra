import {
  getCardIdsFromTermIds,
  getTermIdsFromCardIds,
} from "app/vocabulary/actions/card/functions";
import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import { withDependencies } from "app/vocabulary/actions/functions/dependencies";
import { getCardIdsFromWords } from "documents/compile/vocabulary/getCardIdsFromWords";
import { initializeDeckFromFile } from "documents/compile/vocabulary/initializeDeckFromFile";
import _ from "underscore";

export const parseVocabularyList = (vocabulary_list) => {
  if (!vocabulary_list) return;
  if (!deck) initializeDeckFromFile();
  const card_ids = getCardIdsFromWords(vocabulary_list).filter(
    (id) => id in deck.cards
  );
  // const missing = getCardIdsFromWords(vocabulary_list, true);
  const terms = getTermIdsFromCardIds(card_ids);
  const dependencyTerms = getTermIdsFromCardIds(
    _.difference(withDependencies(card_ids), card_ids)
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
