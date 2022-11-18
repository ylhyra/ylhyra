import { isInSession } from "flashcards/flashcards/actions/card/functions";
import { ChooseCards } from "flashcards/flashcards/actions/createCards/chooseCards";
import { loadCardsIntoSession } from "flashcards/flashcards/actions/session/loadCardsIntoSession";
import { logDev } from "modules/log";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";
import { withDependencies } from "flashcards/flashcards/actions/dependencies/withDependencies";

/**
 * Goes through the database of cards, finds relevant ones, and then loads them
 * into the session as {@link CardInSession}.
 */
export function createCards(): void {
  warnIfFunctionIsSlow.wrap(() => {
    const session = store.session;

    /* If all allowedCards are already in use, clear it */
    if (session.allowedCards?.every((card) => isInSession(card))) {
      session.allowedCards = undefined;
      logDev("allowedCards cleared");
    }

    /* Create cards */
    let chosenCards = new ChooseCards(session).run();

    /* Add dependencies */
    chosenCards = withDependencies(chosenCards, { addOnlyBad: true });

    /* Failed to generate cards, turn off allowed cards and try again */
    if (chosenCards.length === 0 && session.allowedCards) {
      console.warn(
        `Failed to generate more cards using the allowed ones, switching to all cards.`,
      );
      session.allowedCards = undefined;
      createCards();
      return;
    }

    loadCardsIntoSession(chosenCards);
  }, "createCards");
}
