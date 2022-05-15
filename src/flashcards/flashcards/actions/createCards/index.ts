import { addBadDependencies } from "flashcards/flashcards/actions/createCards/addBadDependencies";
import { ChooseCards } from "flashcards/flashcards/actions/createCards/wip/chooseCards";
import { loadCardsIntoSession } from "flashcards/flashcards/actions/session/loadCardsIntoSession";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { logBrowser, logDev } from "modules/log";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export type CreateCardsOptions = {
  skipDependencies?: boolean;
  // skipOverTheEasiest?: boolean;
  /** Used by {@link loadCardsIntoSession} */
  insertImmediately?: boolean;
  // dontSortByAllowedCards?: boolean;
};

/**
 * Goes through the database of cards, finds relevant ones,
 * and then loads them into the session as {@link CardInSession}.
 */
export const createCards = (
  /** TODO: delete */ options?: CreateCardsOptions
): void => {
  warnIfFunctionIsSlow.wrap(() => {
    const session = getSession();

    /* If all allowedCards are already in use, clear it */
    if (session.allowedCards?.every((card) => card.isInSession())) {
      session.allowedCards = undefined;
      logDev("allowedCards cleared");
    }

    /* Create cards */
    let chosenCards = new ChooseCards(session).run();
    logBrowser({ chosenCards });

    /* Add dependencies */
    if (!options?.skipDependencies) {
      chosenCards = addBadDependencies(chosenCards);
    }

    /* Failed to generate cards, turn off allowed cards and try again */
    if (chosenCards.length === 0 && session.allowedCards) {
      console.warn(
        `Failed to generate more cards using the allowed ones, switching to all cards.`
      );
      session.allowedCards = undefined;
      createCards(options);
      return;
    }

    loadCardsIntoSession(chosenCards, options);
  }, "createCards");
};
