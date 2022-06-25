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
    //       (cardId.isBad() && cardId.wasRowSeenMoreRecentlyThan(45 * minutes)) ||
    //       (cardId.isFairlyBad() && cardId.wasRowSeenMoreRecentlyThan(2 * days)))
    // );

    if (isDev) {
      // if (after.length !== chosen_cards.length) {
      //   log(
      //     `Dependencies added, before:\n${chosen_cards
      //       .map((card) => card.printWord())
      //       .join(", ")}\nafter:\n${after
      //       .map((card) =>
      //         card.isIn(chosen_cards)
      //           ? card.printWord()
      //           : "<<<" + card.printWord() + ">>>"
      //       )
      //       .join(", ")}`
      //   );
      // }
    }
    // return after;
  });
}
