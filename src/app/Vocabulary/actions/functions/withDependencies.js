import {
  printWord,
  getCardsWithSameTerm,
} from "app/Vocabulary/actions/functions";
import { average, clamp, mapValueToRange, round } from "app/App/functions/math";
import {
  getHash,
  getPlaintextFromFormatted,
} from "maker/VocabularyMaker/functions";
import store from "app/App/store";
import { InitializeSession } from "app/Vocabulary/actions/session";
import { updateURL } from "app/Router/actions";
import Card, { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import _ from "underscore";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "app/Vocabulary/actions/session";
import { deck } from "app/Vocabulary/actions/deck";
import { SortIdsByScore } from "app/Vocabulary/actions/createCards/functions";

export const withDependencies = (card_ids, options = {}) => {
  const { showDepth } = options;
  let returns = [];
  let terms = [];
  let depth = {};
  if (typeof card_ids === "string") {
    card_ids = [card_ids];
  }
  card_ids
    .filter((card_id) => card_id in deck.cards)
    .forEach((card_id) => (terms = terms.concat(deck.cards[card_id].terms)));
  terms = _.uniq(terms);
  terms.forEach((term) => {
    let terms = [{ term, dependencySortKey: 0 }];
    const chain = CreateDependencyChain(term, deck);
    // console.log(
    //   Object.keys(chain).map((j) => {
    //     return [printWord(j), chain[j]];
    //   })
    // );
    Object.keys(chain).forEach((k) => {
      terms.push({ term: k, dependencySortKey: chain[k] });
    });
    terms = terms.sort((a, b) => b.dependencySortKey - a.dependencySortKey); //.map((i) => i.term);
    terms.forEach((obj) => {
      term = obj.term;
      if (!deck.terms[term]) return;
      let card_ids = deck.terms[term].cards;
      if (deck.schedule && card_ids.some((id) => id in deck.schedule)) {
        // card_ids = _.shuffle(card_ids);
        card_ids = SortIdsByScore(card_ids);
      } else {
        card_ids = card_ids.sort((a, b) => {
          if (a.endsWith("is")) return -1;
          return 1;
        });
      }
      returns = returns.concat(card_ids);
      deck.terms[term].cards.forEach((card_id) => {
        depth[card_id] = Math.max(depth[card_id] || 0, obj.dependencySortKey);
      });
    });
  });
  const out = _.uniq(returns).filter((card_id) => card_id in deck.cards);
  if (showDepth) {
    let k = {};
    out.forEach((card_id) => {
      k[card_id] = depth[card_id];
    });
    return k;
  } else {
    return out;
  }
};

/**
 * Returns an object on the form { [key]: [depth] }
 */
const CreateDependencyChain = (
  from_term_id,
  deck,
  _alreadySeen = [],
  output = [],
  depth = 1
) => {
  deck.terms[from_term_id]?.dependsOn?.forEach((term) => {
    /* Deep copy in order to only watch direct parents */
    const alreadySeen = [..._alreadySeen];
    if (alreadySeen.includes(term)) return;
    alreadySeen.push(term);
    output[term] = Math.max(output[term] || 0, depth);
    CreateDependencyChain(term, deck, alreadySeen, output, depth + 1);
  });
  return output;
};
