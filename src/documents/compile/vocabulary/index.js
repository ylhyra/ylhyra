import {
  getCardIdsFromTermIds,
  getTermsFromCards,
  printWord,
} from "app/vocabulary/actions/functions";
import { withDependencies } from "app/vocabulary/actions/card/dependencies";
import { getCardIdsFromWords } from "documents/compile/vocabulary/getCardIdsFromWords";
import _ from "underscore";
import { setDeck } from "app/vocabulary/actions/deck";

const fs = require("fs");
let deck;
export const readDeck = () => {
  deck = JSON.parse(
    fs.readFileSync(
      __basedir + `/build/vocabulary/vocabulary_database.json`,
      "utf8"
    )
  );
  deck.alternative_ids = JSON.parse(
    fs.readFileSync(
      __basedir + `/build/vocabulary/alternative_ids.json`,
      "utf8"
    )
  );
  deck.schedule = {};
  setDeck(deck);
};

export const parseVocabularyList = (vocabulary_list) => {
  if (!vocabulary_list) return;
  if (!deck) readDeck();
  const card_ids = getCardIdsFromWords(vocabulary_list, deck).filter(
    (id) => id in deck.cards
  );
  const missing = getCardIdsFromWords(vocabulary_list, deck, true);
  const terms = getTermsFromCards(card_ids, deck);
  const dependencyTerms = getTermsFromCards(
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
  if (missing) {
    out.missing = missing;
  }
  return out;
};
