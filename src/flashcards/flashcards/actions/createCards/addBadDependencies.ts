import { Card } from "flashcards/flashcards/actions/card/card";
import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export function addBadDependencies(chosenCards: Card[]): Card[] {
  return warnIfFunctionIsSlow.wrap(() => {
    isBrowser && console.warn("dependencies not implemented");
    return chosenCards;

    // const after = withDependencies(chosenCards, { skipSiblings: true }).filter(
    //   (cardId) =>
    //     !isInSession(cardId) &&
    //     /* Keep in those already chosen */
    //     (chosenCards.includes(cardId) ||
    //       (isBad(cardId,) && wasRowSeenMoreRecentlyThan(cardId,45 * minutes)) ||
    //       (isFairlyBad(cardId,) && wasRowSeenMoreRecentlyThan(cardId,2 * days)))
    // );

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
    // return after;
  });
}
