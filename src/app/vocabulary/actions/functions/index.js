import { deck } from "app/vocabulary/actions/deck";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
import { isBrowser } from "app/app/functions/isBrowser";
import { log } from "app/app/functions/log";
import { roundToInterval } from "app/app/functions/math";
import { updateURL } from "app/router/actions/updateURL";
import _ from "underscore";
import { isDev } from "app/app/functions/isDev";
import {
  getCardById,
  getCardIdsFromTermIds,
  getCardsByIds,
} from "app/vocabulary/actions/card/functions";

/**
 * @param {CardID|TermID} id
 * @returns {string|undefined}
 */
export const printWord = (id) => {
  if (!isDev) return;
  if (id in deck.cards) {
    const card = deck.cards[id];
    return getPlaintextFromFormatted(
      card.getData(card.getFrom() + "_formatted")
    );
    // return card[card.getFrom() + "_plaintext"];
  } else if (id in deck.terms) {
    return printWord(deck.terms[id].cards[0]);
  } else {
    log(`No id ${id}`);
  }
};

/**
 * @param {Array.<CardID>} allowed_ids
 * @param {Object?} options
 */
export const studyParticularIds = async (allowed_ids, options) => {
  const { session } = deck;
  session.reset();
  session.allowed_ids = allowed_ids;
  session.createCards(options);
  await session.InitializeSession({ shouldReset: false });
  updateURL("/vocabulary/play");
};

export const studyNewTerms = () => {
  const newTerms = [];
  Object.keys(deck.cards).forEach((id) => {
    if (!(id in deck.schedule) && getCardById(id)?.isNewTerm()) {
      newTerms.push(id);
    }
  });
  studyParticularIds(newTerms, {
    skip_dependencies: true,
    dont_sort_by_allowed_ids: true,
  });
};

/**
 * @param {Array.<Card>} cards
 * @returns {number}
 */
export const countTerms = (cards) => {
  // const i = rapidCountUnique(_.flatten(cards.map((c) => c.terms)));
  const i = rapidFlattenArrayAndCountUnique(cards.map((c) => c.getTermIds()));
  return roundToInterval(i, i > 200 ? 50 : 5);
};

export const rapidCountUnique = (i) => new Set(i).size;
export const rapidFlattenArrayAndCountUnique = (arrOfArrs) => {
  let s = new Set();
  arrOfArrs.forEach((arr) => {
    arr.forEach((i) => {
      s.add(i);
    });
  });
  return s.size;
};

/**
 * @returns {number|null}
 */
export const countTermsInSchedule = () => {
  if (!deck) return null;
  return countTerms(getCardsByIds(Object.keys(deck.schedule)));
};

if (isBrowser && isDev) {
  window.studyParticularWords = async (...words) => {
    await studyParticularIds(getCardIdsFromTermIds(words.map(getHash)));
  };
  window["studyParticularIds"] = studyParticularIds;
}

export const exitVocabularyScreen = async () => {
  let url = window.location.pathname;
  if (url === "/vocabulary/play" || url === "/vocabulary/difficulty") {
    url = "/vocabulary";
  }
  await updateURL(url);
};
