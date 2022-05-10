import {getCardIdsFromAllDecks} from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import {Card} from "flashcards/flashcards/actions/card/card";
import {getCardsInSchedule} from "flashcards/flashcards/actions/card/functions";
import {CreateCardsOptions} from "flashcards/flashcards/actions/createCards";
import {getRowIdFromCardId} from "flashcards/flashcards/actions/deck/compile/ids";
import {getEntireSchedule} from "flashcards/flashcards/actions/userData/userDataStore";
import {CardIds, Direction} from "flashcards/flashcards/types/types";
import {isDev} from "modules/isDev";
import {roundToInterval} from "modules/math";

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

export const studyNewRows = () => {
  const newRows: CardIds = [];
  (Object.keys(getCardIdsFromAllDecks()) as CardIds).forEach((id) => {
    if (
      !(id in getEntireSchedule()) &&
      id.isNewRowThatHasNotBeenSeenInSession()
    ) {
      newRows.push(id);
    }
  });
  studyParticularIds(newRows, {
    skipDependencies: true,
    dontSortByAllowedIds: true,
  });
};

export const countRows = (ids: CardIds, round = true) => {
  const i = rapidCountUnique(ids.map((id) => getRowIdFromCardId(id)));
  if (round) {
    return roundToInterval(i, i > 200 ? 50 : 5);
  } else {
    return i;
  }
};

/** Only used by {@link countRows} */
export const rapidCountUnique = (i: any[]) => new Set(i).size;

export const countRowsInSchedule = () => {
  return countRows(getCardsInSchedule());
};

// if (isBrowser && isDev) {
//   window["studyParticularWords"] = async (...words) => {
//     await studyParticularIds(
//       getCardIdsFromRowIds(
//         words.map((i) => getHashForVocabulary(i)) as RowIds
//       )
//     );
//   };
//   window["studyParticularIds"] = studyParticularIds;
// }

export const exitVocabularyScreen = () => {
  throw new Error("Not implemented");
};
