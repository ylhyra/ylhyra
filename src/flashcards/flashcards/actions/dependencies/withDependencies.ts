import { Card } from "../card/card";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";
import { isInSession } from "flashcards/flashcards/actions/card/functions";
import {
  isBad,
  isFairlyBad,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import { wasRowSeenMoreRecentlyThan } from "flashcards/flashcards/actions/card/cardSchedule";
import { minutes, days } from "modules/time";
import { isDev } from "modules/isDev";

/** Returns an array of cards with all necessary dependencies of a card coming before it */
export const withDependencies = (
  cards: Card[],
  options?: { skipSiblings?: boolean },
): Card[] => {
  let out: Card[] = [];
  for (const card of cards) {
    card.row.dependencies.forEach((dependency) => {});
  }

  getRowIdsFromCardIds(cardIds).forEach((rowId) => {
    let k = getSortedCardDependenciesAsCardIds(rowId);

    // /* Filter siblings, leaving dependencies */
    // if (options?.skipSiblings) {
    //   k = k.filter(
    //     (cardId) =>
    //       !getCardIdsFromRowId(rowId).includes(cardId) ||
    //       cardIds.includes(cardId),
    //   );
    // }

    out = out.concat(k);
  });
  return _.uniq(out);
};

export function addBadDependencies(chosenCards: Card[]): Card[] {
  return warnIfFunctionIsSlow.wrap(() => {
    const after = withDependencies(
      chosenCards,
      // { skipSiblings: true }
    ).filter(
      (card) =>
        !isInSession(card) &&
        /* Keep in those already chosen */
        (card.isIn(chosenCards) ||
          (isBad(card) && wasRowSeenMoreRecentlyThan(card, 45 * minutes)) ||
          (isFairlyBad(card) && wasRowSeenMoreRecentlyThan(card, 2 * days))),
    );

    if (isDev) {
      // if (after.length !== chosen_cards.length) {
      //   log(
      //     `Dependencies added, before:\n${chosen_cards
      //       .map((card) => printWord(card,))
      //       .join(", ")}\nafter:\n${after
      //       .map((card) =>
      //         card.isIn(chosen_cards)
      //           ? printWord(card,)
      //           : "<<<" + printWord(card,) + ">>>"
      //       )
      //       .join(", ")}`
      //   );
      // }
    }
    return after;
  });
}
