import { Card } from "flashcards/flashcards/actions/card/card";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { CardIds, Direction } from "flashcards/flashcards/types";
import { isDev } from "modules/isDev";

/**
 * Used for debugging (printing cards to the console)
 */
export function printWord(this: Card): string | undefined {
  if (!isDev) return;
  return this.getCardData(
    this.direction === Direction.FRONT_TO_BACK ? "front" : "back"
  );
}

export const studyParticularIds = async (
  allowedCards: CardIds,
  options?: CreateCardsOptions
) => {
  throw new Error("Not implemented");
  // const session = getSession();
  // session.reset();
  // session.allowedCards = allowedCards;
  // await createCards(options);
  // initializeSession({ shouldReset: false });
  // goToUrl("/vocabulary/play");
};

export const studyNewRows = () => {
  // const newRows: CardIds = [];
  // (Object.keys(getCardIdsFromAllDecks()) as CardIds).forEach((id) => {
  //   if (
  //     !(id in getEntireSchedule()) &&
  //     id.isNewRowThatHasNotBeenSeenInSession()
  //   ) {
  //     newRows.push(id);
  //   }
  // });
  // studyParticularIds(newRows, {
  //   skipDependencies: true,
  //   dontSortByallowedCards: true,
  // });
};

export const countRows = (ids: CardIds, round = true) => {
  throw new Error("Not implemented");
  // const i = rapidCountUnique(ids.map((id) => id.rowId));
  // if (round) {
  //   return roundToInterval(i, i > 200 ? 50 : 5);
  // } else {
  //   return i;
  // }
};

/** Only used by {@link countRows} */
export const rapidCountUnique = (i: any[]) => new Set(i).size;

export const countRowsInSchedule = () => {
  throw new Error("Not implemented");
  // return countRows(getCardsInSchedule());
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
