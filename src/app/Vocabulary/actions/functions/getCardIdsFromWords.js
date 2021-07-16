import createCards from "app/Vocabulary/actions/createCards";
import { average, clamp, mapValueToRange, round } from "app/App/functions/math";
import {
  getHash,
  getPlaintextFromFormatted,
} from "app/VocabularyMaker/functions";
import store from "app/App/store";
import { InitializeSession } from "app/Vocabulary/actions/session";
import { updateURL } from "app/Router/actions";
import Card, { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import _ from "underscore";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "app/Vocabulary/actions/session";
import { getDeck } from "app/Vocabulary/actions/functions/index";

let missing = [];
let timer;
export const getCardIdsFromWords = (words) => {
  const deck = getDeck();
  let card_ids = [];
  words.forEach((word) => {
    if (!word) return;
    const hash = getHash(word.split(" = ")[0]);
    if (hash in deck.terms) {
      card_ids = card_ids.concat(deck.terms[hash].cards);
    } else if (hash in deck.alternative_ids) {
      deck.alternative_ids[hash].forEach((j) => {
        card_ids = card_ids.concat(deck.terms[j].cards);
      });
    } else {
      missing.push(word);
    }
  });
  if (missing.length > 0) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(`Missing terms:\n${_.uniq(missing).join("\n")}`);
    }, 1000);
  }
  return _.uniq(card_ids);
};
