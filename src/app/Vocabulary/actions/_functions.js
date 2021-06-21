import { getHash } from "server/vocabulary/setup/functions";
import store from "app/App/store";
/**
 * Various helper functions
 */
import Card, { BAD, GOOD, EASY } from "./card";
import _ from "underscore";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "./session";

export const getDeck = () => {
  return store.getState().vocabulary.deck;
};
export const MakeSummaryOfCardStatuses = (card_ids) => {
  const deck = getDeck();
  let not_seen = 0;
  let bad = 0;
  let good = 0;
  let easy = 0;
  card_ids.forEach((id) => {
    if (id in deck.schedule) {
      if (deck.schedule[id].score < GOOD) {
        bad++;
      } else if (deck.schedule[id].score < EASY) {
        good++;
      } else {
        easy++;
      }
    } else {
      not_seen++;
    }
  });
  return {
    not_seen,
    bad,
    good,
    easy,
  };
};

export const PercentageKnown = (card_ids) => {
  const summary = MakeSummaryOfCardStatuses(card_ids);
  let done_count = summary.good + summary.easy * 1 + summary.bad * 1;
  let remaining_count = summary.not_seen * 1 + summary.bad * 2;
  let percentage = Math.ceil(
    (done_count / (remaining_count + done_count)) * 100
  );
  if (percentage === 100 && done_count !== remaining_count) percentage = 99;
  return percentage;
};

export const PercentageKnownOverall = () => {
  const deck = getDeck();
  if (!deck) return null;
  const card_ids = Object.keys(deck.cards);
  return PercentageKnown(card_ids);
};

export const getWordFromId = (id) => {
  const card = getDeck().cards[id];
  return card[card.from];
};

export const getWordFromTerm = (term) => {
  if (getDeck().terms[term]) {
    return getWordFromId(getDeck().terms[term].cards[0]);
  } else {
    console.log(`No term ${term}`);
  }
};

export const getRelatedCardIds = (id) => {
  if (typeof id === "undefined")
    throw new Error("Nothing passed to getRelatedCardIds");
  const deck = getDeck();
  let out = [];
  deck.cards[id].terms.forEach((term) => {
    deck.terms[term].cards.forEach((sibling_card_id) => {
      out.push(sibling_card_id);
    });
  });
  return out;
};

// export const filterOnlyCardsThatExist = (card_ids) => {
//   const deck = getDeck()
//   return card_ids.filter(id => id in deck.cards)
// }

export const getCardIdsFromWords = (words) => {
  const deck = getDeck();
  let card_ids = [];
  let missing = [];
  words.forEach((word) => {
    const hash = getHash(word);
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
    console.log(`Missing terms: ${missing.join(" • ")}`);
  }
  return withDependencies(_.uniq(card_ids));
};

export const withDependencies = (card_ids) => {
  const deck = getDeck();
  let returns = [];
  let terms = [];
  card_ids.forEach(
    (card_id) => (terms = terms.concat(deck.cards[card_id].terms))
  );
  terms = _.uniq(terms);
  terms.forEach((term) => {
    let terms = [{ term, sortKey: -1 }];
    const chain = CreateDependencyChain(term, deck);
    Object.keys(chain).forEach((k) => {
      terms.push({ term: k, sortKey: chain[k] });
    });
    terms = terms.sort((a, b) => b.sortKey - a.sortKey).map((i) => i.term);
    terms.forEach((term) => {
      if (term in deck.terms) {
        returns = returns.concat(deck.terms[term].cards);
      }
    });
  });
  return _.uniq(returns);
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
      const alreadySeen = [
        ..._alreadySeen,
      ]; /* Deep copy in order to only watch direct parents */
      if (alreadySeen.includes(term)) return;
      alreadySeen.push(term);
      output[term] = Math.max(output[term] || 0, depth);
      alreadySeen.push(term);
      if (deck.dependencies[term]) {
        CreateDependencyChain(term, deck, alreadySeen, output, depth + 1);
      }
    });
  }
  return output;
};
