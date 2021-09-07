import { deck } from "app/vocabulary/actions/deck";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
import { isBrowser } from "app/app/functions/isBrowser";
import { log } from "app/app/functions/log";
import { round } from "app/app/functions/math";
import { updateURL } from "app/router/actions/updateURL";
import _ from "underscore";
import { isDev } from "app/app/functions/isDev";

export const printWord = (id) => {
  if (id in deck.cards) {
    const card = deck.cards[id];
    return getPlaintextFromFormatted(card[card.from + "_formatted"]);
  } else if (id in deck.terms) {
    return printWord(deck.terms[id].cards[0]);
  } else {
    log(`No id ${id}`);
  }
};

export const studyParticularIds = async (allowed_ids) => {
  const { session } = deck;
  session.reset();
  session.allowed_ids = allowed_ids;
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

if (isBrowser && isDev) {
  window.studyParticularWords = async (...words) => {
    await studyParticularIds(getCardIdsFromTermIds(words.map(getHash)));
  };
  window.studyParticularIds = studyParticularIds;
}
