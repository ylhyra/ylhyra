import { deck } from "app/vocabulary/actions/deck";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
import { isBrowser } from "app/app/functions/isBrowser";
import { log } from "app/app/functions/log";
import { round } from "app/app/functions/math";
import { updateURL } from "app/router/actions/updateURL";
import _ from "underscore";
import { isDev } from "app/app/functions/isDev";
import { getCardIdsFromTermIds } from "app/vocabulary/actions/card/functions";

/**
 * @param {string} id
 * @returns {string|undefined}
 */
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

/**
 * @param {Array.<string>} allowed_ids
 */
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

/**
 * @param {Array.<Card>} cards
 * @returns {number}
 */
export const countTerms = (cards) => {
  const i = (cards.map((c) => c.terms) |> _.flatten |> _.uniq).length;
  return round(i, i > 200 ? 50 : 5);
};

/**
 * @returns {null|*}
 */
export const countTermsInSchedule = () => {
  if (!deck) return null;
  return (
    Object.keys(deck.schedule).map((card_id) => deck.cards[card_id]?.terms)
    |> _.flatten
    |> _.uniq
  ).length;
};

if (isBrowser && isDev) {
  window.studyParticularWords = async (...words) => {
    await studyParticularIds(getCardIdsFromTermIds(words.map(getHash)));
  };
  window.studyParticularIds = studyParticularIds;
}
