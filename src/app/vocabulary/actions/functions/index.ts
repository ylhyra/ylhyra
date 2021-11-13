import { deck } from "app/vocabulary/actions/deck";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
import { isBrowser } from "app/app/functions/isBrowser";
import { log } from "app/app/functions/log";
import { roundToInterval } from "app/app/functions/math";
import { updateURL } from "app/router/actions/updateURL";
import { isDev } from "app/app/functions/isDev";
import { getCardIdsFromTermIds } from "app/vocabulary/actions/card/functions";
import { CardIds } from "app/vocabulary/actions/card/card";
import {
  getCardsInSchedule,
  getData,
  getFrom,
  getTermIds,
} from "app/vocabulary/actions/card/card_data";
import { isNewTerm } from "app/vocabulary/actions/card/card_schedule";

export const printWord = (id) => {
  if (!isDev) return;
  if (id in deck.cards) {
    return getPlaintextFromFormatted(getData(id, getFrom(id) + "_formatted"));
    // return card[card.getFrom() + "_plaintext"];
  } else if (id in deck.terms) {
    return printWord(deck.terms[id].cards[0]);
  } else {
    log(`No id ${id}`);
  }
};

export const studyParticularIds = async (allowed_ids: CardIds, options?) => {
  const { session } = deck;
  session.reset();
  session.allowed_ids = allowed_ids;
  session.createCards(options);
  await session.InitializeSession({ shouldReset: false });
  updateURL("/vocabulary/play");
};

export const studyNewTerms = () => {
  const newTerms: CardIds = [];
  Object.keys(deck.cards).forEach((id) => {
    if (!(id in deck.schedule) && isNewTerm(id)) {
      newTerms.push(id);
    }
  });
  studyParticularIds(newTerms, {
    skip_dependencies: true,
    dont_sort_by_allowed_ids: true,
  });
};

export const countTerms = (ids: CardIds) => {
  const i = rapidFlattenArrayAndCountUnique(ids.map((id) => getTermIds(id)));
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

export const countTermsInSchedule = () => {
  if (!deck) return null;
  return countTerms(getCardsInSchedule());
};

if (isBrowser && isDev) {
  window["studyParticularWords"] = async (...words) => {
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
