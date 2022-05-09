import {
  getCardIdsFromAllDecks,
  getTermsFromAllDecks,
} from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import {
  getCardData,
  getCardsInSchedule,
} from "flashcards/flashcards/actions/card/cardData";
import { isNewTermThatHasNotBeenSeenInSession } from "flashcards/flashcards/actions/card/cardSchedule";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import {
  getDirectionFromCardId,
  getTermIdFromCardId,
} from "flashcards/flashcards/actions/deck/compile/ids";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";
import {
  CardId,
  CardIds,
  Direction,
  TermId,
} from "flashcards/flashcards/types/types";
import { isDev } from "modules/isDev";
import { log } from "modules/log";
import { roundToInterval } from "modules/math";

/**
 * Used for debugging (printing cards to the console)
 */
export function printWord(
  this: Card,
  id: CardId | TermId | string
): string | undefined {
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
    // return printWord(getTermsFromAllDecks()[id as TermId]!.cardIds[0]);
  } else {
    log(`No id ${id}`);
  }
}

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
    if (
      !(id in getEntireSchedule()) &&
      isNewTermThatHasNotBeenSeenInSession(id)
    ) {
      newTerms.push(id);
    }
  });
  studyParticularIds(newTerms, {
    skipDependencies: true,
    dontSortByAllowedIds: true,
  });
};

export const countTerms = (ids: CardIds, round = true) => {
  const i = rapidCountUnique(ids.map((id) => getTermIdFromCardId(id)));
  if (round) {
    return roundToInterval(i, i > 200 ? 50 : 5);
  } else {
    return i;
  }
};

/** Only used by {@link countTerms} */
export const rapidCountUnique = (i: any[]) => new Set(i).size;

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

export const exitVocabularyScreen = () => {
  throw new Error("Not implemented");
};
