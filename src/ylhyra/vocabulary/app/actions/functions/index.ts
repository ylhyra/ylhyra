// @ts-nocheck
import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import { log } from "modules/log";
import { roundToInterval } from "modules/math";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import {
  getCardData,
  getCardsInSchedule,
  getFrom,
  getTermIds,
} from "ylhyra/vocabulary/app/actions/card/card_data";
import { isNewTerm } from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { getCardIdsFromTermIds } from "ylhyra/vocabulary/app/actions/card/functions";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { getPlaintextFromFormatted } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/functions";
import { getHashForVocabulary } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { CardId, CardIds, TermId, TermIds } from "ylhyra/vocabulary/types";

export function printWord(id: CardId | TermId | string) {
  if (!isDev) return;
  if (id in deck!.cards) {
    return getPlaintextFromFormatted(
      getCardData(
        id as CardId,
        (getFrom(id as CardId) + "_formatted") as
          | "is_formatted"
          | "en_formatted"
      )
    );
    // return card[card.getFrom() + "_plaintext"];
  } else if (id in deck!.terms) {
    return printWord(deck!.terms[id].cards[0]);
  } else {
    log(`No id ${id}`);
  }
}

export async function studyParticularIds(allowed_ids: CardIds, options?) {
  const { session } = deck;
  session.reset();
  session.allowed_ids = allowed_ids;
  session.createCards(options);
  await session.initializeSession({ shouldReset: false });
  goToUrl("/vocabulary/play");
}

export function studyNewTerms() {
  const newTerms: CardIds = [];
  (Object.keys(deck!.cards) as CardIds).forEach((id) => {
    if (!(id in deck!.schedule) && isNewTerm(id)) {
      newTerms.push(id);
    }
  });
  studyParticularIds(newTerms, {
    skip_dependencies: true,
    dont_sort_by_allowed_ids: true,
  });
}

export function countTerms(ids: CardIds) {
  const i = rapidFlattenArrayAndCountUnique(ids.map((id) => getTermIds(id)));
  return roundToInterval(i, i > 200 ? 50 : 5);
}

export const rapidCountUnique = (i) => new Set(i).size;
export function rapidFlattenArrayAndCountUnique(arrOfArrs) {
  let s = new Set();
  arrOfArrs.forEach((arr) => {
    arr.forEach((i) => {
      s.add(i);
    });
  });
  return s.size;
}

export function countTermsInSchedule() {
  if (!deck) return null;
  return countTerms(getCardsInSchedule());
}

if (isBrowser && isDev) {
  window["studyParticularWords"] = async (...words) => {
    await studyParticularIds(
      getCardIdsFromTermIds(
        words.map((i) => getHashForVocabulary(i)) as TermIds
      )
    );
  };
  window["studyParticularIds"] = studyParticularIds;
}

export async function exitVocabularyScreen() {
  let url = window.location.pathname;
  if (url === "/vocabulary/play" || url === "/vocabulary/difficulty") {
    url = "/vocabulary";
  }
  goToUrl(url);
}
