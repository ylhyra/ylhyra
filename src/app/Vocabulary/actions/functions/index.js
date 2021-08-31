import { isBrowser } from "app/App/functions/isBrowser";
import { round } from "app/App/functions/math";
import { updateURL } from "app/Router/actions";
import { EASY, GOOD } from "app/Vocabulary/actions/card";
import { deck } from "app/Vocabulary/actions/deck";
import {
  getHash,
  getPlaintextFromFormatted,
} from "maker/VocabularyMaker/functions";
import _ from "underscore";

export const MakeSummaryOfCardStatuses = (card_ids) => {
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

export const printWord = (id) => {
  if (id in deck.cards) {
    const card = deck.cards[id];
    return getPlaintextFromFormatted(card[card.from + "_formatted"]);
  } else if (id in deck.terms) {
    return printWord(deck.terms[id].cards[0]);
  } else {
    console.log(`No id ${id}`);
  }
};

/**
 * Get cards that have the same term
 */
export const getCardsWithSameTerm = (id) => {
  if (typeof id === "undefined")
    throw new Error("Nothing passed to getCardsWithSameTerm");
  let out = [];
  deck.cards[id]?.terms.forEach((term) => {
    deck.terms[term].cards.forEach((sibling_card_id) => {
      out.push(sibling_card_id);
    });
  });
  return out;
};

// export const filterOnlyCardsThatExist = (card_ids) => {
//   return card_ids.filter(id => id in deck.cards)
// }

export const studyParticularIds = async (allowed_card_ids) => {
  const { session } = deck;
  session.reset();
  session.allowed_card_ids = allowed_card_ids;
  session.createCards();
  await session.InitializeSession({ shouldReset: false });
  updateURL("/vocabulary/play");
};

export const studyNewTerms = () => {
  const newTerms = [];
  Object.keys(deck.cards).forEach((id) => {
    if (!(id in deck.schedule)) {
      newTerms.push(id);
    }
  });
  studyParticularIds(newTerms);
};

export const countTerms = (cards) => {
  const i = _.uniq(_.flatten(cards.map((c) => c.terms))).length;
  return round(i, i > 200 ? 50 : 5);
};

export const getCardIdsFromTermIds = (term_ids) => {
  return _.uniq(
    _.flatten(term_ids.map((t) => deck.terms[t]?.cards)).filter(Boolean)
  );
};

export const getTermsFromCards = (card_ids) => {
  let terms = [];
  card_ids.forEach((id) => {
    terms = terms.concat(deck.cards[id].terms);
  });
  return _.uniq(terms);
};

if (isBrowser) {
  window.studyParticularWords = (...words) => {
    studyParticularIds(getCardIdsFromTermIds(words.map(getHash)));
  };
  window.studyParticularIds = studyParticularIds;
}
