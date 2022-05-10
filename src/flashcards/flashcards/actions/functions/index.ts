import { getCardIdsFromAllDecks } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { Card } from "flashcards/flashcards/actions/card/card";
import { getCardsInSchedule } from "flashcards/flashcards/actions/card/functions";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { getTermIdFromCardId } from "flashcards/flashcards/actions/deck/compile/ids";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";
import { CardIds, Direction } from "flashcards/flashcards/types/types";
import { isDev } from "modules/isDev";
import { roundToInterval } from "modules/math";

/**
 * Used for debugging (printing cards to the console)
 */
export function printWord(this: Card): string | undefined {
  if (!isDev) return;
  return this.getCardData(
    this.getDirection() === Direction.FRONT_TO_BACK ? "front" : "back"
  );
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
      id.isNewTermThatHasNotBeenSeenInSession()
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
