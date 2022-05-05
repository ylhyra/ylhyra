import {
  getCardData,
  getCardsInSchedule,
  getTermIds,
} from "flashcards/flashcards/actions/card/cardData";
import { isNewTerm } from "flashcards/flashcards/actions/card/cardSchedule";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { getDirectionFromCardId } from "flashcards/flashcards/compile/ids";
import {
  getCardIdsFromAllDecks,
  getTermsFromAllDecks,
} from "flashcards/flashcards/flashcardsStore.functions";
import {
  CardId,
  CardIds,
  Direction,
  TermId,
} from "flashcards/flashcards/types/types";
import { getEntireSchedule } from "flashcards/flashcards/userDataStore";
import { isDev } from "modules/isDev";
import { log } from "modules/log";
import { roundToInterval } from "modules/math";

/**
 * Used for debugging (printing cards to the console)
 */
export const printWord = (id: CardId | TermId | string): string | undefined => {
  if (!isDev) return;
  if (getCardIdsFromAllDecks().includes(id as CardId)) {
    return getCardData(
      id as CardId,
      getDirectionFromCardId(id as CardId) === Direction.FRONT_TO_BACK
        ? "front"
        : "back"
    );
    // return card[card.getFrom() + "_plaintext"];
  } else if (id in getTermsFromAllDecks()) {
    return printWord(getTermsFromAllDecks()[id as TermId]!.cardIds[0]);
  } else {
    log(`No id ${id}`);
  }
};

export const studyParticularIds = async (
  allowedIds: CardIds,
  options?: CreateCardsOptions
) => {
  throw new Error("Not implemented");
  // const session = getSession();
  // session.reset();
  // session.allowedIds = allowedIds;
  // createCards(options);
  // initializeSession({ shouldReset: false });
  // goToUrl("/vocabulary/play");
};

export const studyNewTerms = () => {
  const newTerms: CardIds = [];
  (Object.keys(getCardIdsFromAllDecks()) as CardIds).forEach((id) => {
    if (!(id in getEntireSchedule()) && isNewTerm(id)) {
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
  return countTerms(getCardsInSchedule());
};

// if (isBrowser && isDev) {
//   window["studyParticularWords"] = async (...words) => {
//     await studyParticularIds(
//       getCardIdsFromTermIds(
//         words.map((i) => getHashForVocabulary(i)) as TermIds
//       )
//     );
//   };
//   window["studyParticularIds"] = studyParticularIds;
// }

export const exitVocabularyScreen = async () => {
  let url = window.location.pathname;
  if (url === "/vocabulary/play" || url === "/vocabulary/difficulty") {
    url = "/vocabulary";
  }
  // goToUrl(url);
};
