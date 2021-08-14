import {
  MakeSummaryOfCardStatuses,
  studyParticularIds,
  printWord,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";
import { getCardIdsFromTermIds } from "app/Vocabulary/actions/functions";
import { getTermsFromCards } from "app/Vocabulary/actions/functions/index";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import { getCardIdsFromWords } from "documents/Compile/vocabulary/getCardIdsFromWords";
import { getPlaintextFromVocabularyEntry } from "app/VocabularyMaker/functions";
import _ from "underscore";
import { setDeck } from "app/Vocabulary/actions/deck";
const path = require("path");
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
      terms.map((term_id) => {
        return printWord(term_id).split(/;+ /g);
      })
    )
  );

  const cards = getCardIdsFromTermIds(terms);
  const dependencyCards = getCardIdsFromTermIds(dependencyTerms);

  let out = { terms, dependencyTerms, cards, dependencyCards, sentences };
  if (missing) {
    out.missing = missing;
  }
  return out;
};
