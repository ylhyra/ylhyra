import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import { log } from "modules/log";
import { roundToInterval } from "ylhyra/app/app/functions/math";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import {
  getCardsInSchedule,
  getData,
  getFrom,
  getTermIds,
} from "ylhyra/app/vocabulary/actions/card/card_data";
import { isNewTerm } from "ylhyra/app/vocabulary/actions/card/card_schedule";
import { getCardIdsFromTermIds } from "ylhyra/app/vocabulary/actions/card/functions";
import {
  CardId,
  CardIds,
  TermId,
  TermIds,
} from "ylhyra/app/vocabulary/actions/card/types";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { getPlaintextFromFormatted } from "ylhyra/maker/vocabulary_maker/compile/format";
import { getHash } from "ylhyra/maker/vocabulary_maker/compile/functions";

export const printWord = (id: CardId | TermId | string) => {
  if (!isDev) return;
  if (id in deck.cards) {
    return getPlaintextFromFormatted(
      getData(id as CardId, getFrom(id as CardId) + "_formatted")
    );
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
  await session.initializeSession({ shouldReset: false });
  goToUrl("/vocabulary/play");
};

export const studyNewTerms = () => {
  const newTerms: CardIds = [];
  (Object.keys(deck.cards) as CardIds).forEach((id) => {
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
    await studyParticularIds(
      getCardIdsFromTermIds(words.map(getHash) as TermIds)
    );
  };
  window["studyParticularIds"] = studyParticularIds;
}

export const exitVocabularyScreen = async () => {
  let url = window.location.pathname;
  if (url === "/vocabulary/play" || url === "/vocabulary/difficulty") {
    url = "/vocabulary";
  }
  goToUrl(url);
};
