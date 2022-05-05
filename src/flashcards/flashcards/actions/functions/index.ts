import {
  getCardData,
  getCardsInSchedule,
  getDirection,
  getTermIds,
} from "flashcards/flashcards/actions/card/cardData";
import { isNewTerm } from "flashcards/flashcards/actions/card/cardSchedule";
import { getSession } from "flashcards/flashcards/sessionStore";
import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import { log } from "modules/log";
import { roundToInterval } from "modules/math";
import { getCardIdsFromTermIds } from "flashcards/flashcards/actions/card/term";

export const printWord = (id: CardId | TermId | string) => {
  if (!isDev) return;
  if (id in deck!.cards) {
    return getPlaintextFromFormatted(
      getCardData(
        id as CardId,
        (getDirection(id as CardId) + "_formatted") as
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
};

export const studyParticularIds = async (allowedIds: CardIds, options?) => {
  const session = getSession();

  session.reset();
  session.allowedIds = allowedIds;
  createCards(options);
  initializeSession({ shouldReset: false });
  goToUrl("/vocabulary/play");
};

export const studyNewTerms = () => {
  const newTerms: CardIds = [];
  (Object.keys(deck!.cards) as CardIds).forEach((id) => {
    if (!(id in deck!.schedule) && isNewTerm(id)) {
      newTerms.push(id);
    }
  });
  studyParticularIds(newTerms, {
    skipDependencies: true,
    dontSortByAllowedIds: true,
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
      getCardIdsFromTermIds(
        words.map((i) => getHashForVocabulary(i)) as TermIds
      )
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
