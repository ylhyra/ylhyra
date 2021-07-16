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

export const withDependencies = (card_ids) => {
  const deck = getDeck();
  let returns = [];
  let terms = [];
  if (typeof card_ids === "string") {
    card_ids = [card_ids];
  }
  card_ids
    .filter((card_id) => card_id in deck.cards)
    .forEach((card_id) => (terms = terms.concat(deck.cards[card_id].terms)));
  terms = _.uniq(terms);
  terms.forEach((term) => {
    let terms = [{ term, sortKey: -1 }];
    const chain = CreateDependencyChain(term, deck);
    // console.log(chain);
    Object.keys(chain).forEach((k) => {
      terms.push({ term: k, sortKey: chain[k] });
    });
    terms = terms.sort((a, b) => b.sortKey - a.sortKey).map((i) => i.term);
    terms.forEach((term) => {
      [term, ...(deck.alternative_ids[term] || [])].forEach((j) => {
        if (j in deck.terms) {
          returns = returns.concat(deck.terms[j].cards);
        }
      });
    });
  });
  return _.uniq(returns).filter((card_id) => card_id in deck.cards);
};

/**
 * Returns an object on the form { [key]: [depth] }
 */
const CreateDependencyChain = (
  from_term,
  deck,
  _alreadySeen = [],
  output = [],
  depth = 0
) => {
  if (from_term in deck.dependencies) {
    deck.dependencies[from_term].forEach((term) => {
      /* Deep copy in order to only watch direct parents */
      const alreadySeen = [..._alreadySeen];
      if (alreadySeen.includes(term)) return;
      alreadySeen.push(term);
      // if (term in deck.terms) {
      output[term] = Math.max(output[term] || 0, depth);
      // }
      [
        term,
        /* Through alternative ids */
        ...(deck.alternative_ids[term] || []),
      ]
        .filter(Boolean)
        .forEach((j) => {
          CreateDependencyChain(j, deck, alreadySeen, output, depth + 1);
        });
    });
  }
  return output;
};
