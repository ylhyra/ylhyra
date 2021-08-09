import {
  MakeSummaryOfCardStatuses,
  studyParticularIds,
  printWord,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";

import { getTermsFromCards } from "app/Vocabulary/actions/functions/index.js";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import { getCardIdsFromWords } from "app/Vocabulary/actions/functions/getCardIdsFromWords";
import { getPlaintextFromVocabularyEntry } from "app/VocabularyMaker/functions";
import _ from "underscore";
import { setDeck } from "app/Vocabulary/actions/deck.js";
const path = require("path");
const fs = require("fs");
let deck;
const readDeck = () => {
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
  setDeck(deck);
};

export const parseVocabularyList = (vocabulary_list) => {
  if (!vocabulary_list) return;
  if (!deck) readDeck();
  const card_ids = getCardIdsFromWords(vocabulary_list, deck).filter(
    (id) => id in deck.cards
  );
  const terms = getTermsFromCards(card_ids, deck);
  const dependencyTerms = getTermsFromCards(
    _.difference(withDependencies(card_ids), card_ids)
  );
  if (terms.length === 0) return null;

  const sentences = terms.map((term_id) => {
    return printWord(term_id);
  });

  return { terms, dependencyTerms, sentences };
};
