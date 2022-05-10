import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { getSession } from "flashcards/flashcards/actions/session/session";

/**
 * Used to load more cards into an already ongoing session.
 * Called from {@link createCards}.
 */
export function loadCardsIntoSession(
  cards: Card[],
  options: CreateCardsOptions = {}
) {
  const session = getSession();

  /**
   * Todo:
   * getRanking() doesn't actually rely on the insert position as these are new cards,
   * which are all moved back. So this may need some reconsidering.
   */
  const insertAtPosition = 0;
  // if (!options.insertImmediately) {
  //   insertAtPosition = 200;
  //   // /* Insert new cards after the current cards */
  //   // const numberOfRemainingCards = session.cards.filter((i) => !i.done).length;
  //   // if (numberOfRemainingCards) {
  //   //   insertAtPosition = numberOfRemainingCards+200;
  //   // }
  // }

  cards.forEach((card, index) => {
    session.cards.push(
      new CardInSession(card, {
        insertAtPosition: insertAtPosition + index,
      })
    );
  });
}
