import {
  filterCardsThatExist,
  isInSession,
} from "flashcards/flashcards/actions/card/card";
import { chooseCards } from "flashcards/flashcards/actions/createCards/3_Choose_cards";
import { dependencies } from "flashcards/flashcards/actions/createCards/4_Dependencies";
import { loadCardsIntoSession } from "flashcards/flashcards/actions/session/loadCardsIntoSession";
import { getSession } from "flashcards/flashcards/sessionStore";
import { log, logDev } from "modules/log";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export const CARDS_TO_CREATE = 50;

export type CreateCardsOptions = {
  skipDependencies?: boolean;
  skipOverTheEasiest?: boolean;
  /** Used by {@link loadCardsIntoSession} */
  insertImmediately?: boolean;
  dontSortByAllowedIds?: boolean;
};

/**
 * Goes through the database of cards, finds relevant ones,
 * and then loads them into the session as {@link CardInSession}.
 */
export const createCards = warnIfFunctionIsSlow(
  "createCards",
  (options?: CreateCardsOptions): void => {
    const session = getSession();

    /* If all allowedIds are already in use, clear it */
    if (
      session.allowedIds &&
      (filterCardsThatExist(session.allowedIds).length === 0 ||
        filterCardsThatExist(session.allowedIds).every((id) => isInSession(id)))
    ) {
      session.allowedIds = null;
      logDev("allowedIds cleared");
    }

    /* Create cards */
    let chosenCards = chooseCards(options);
    log({ chosenCards });

    /* Add dependencies */
    if (!options?.skipDependencies) {
      chosenCards = dependencies(chosenCards);
    }

    /* Failed to generate cards, turn off allowed cards and try again */
    if (chosenCards.length === 0 && session.allowedIds) {
      console.warn(
        `Failed to generate more cards using the allowed ones, switching to all cards.`
      );
      session.allowedIds = null;
      return createCards({ skipOverTheEasiest: true });
    }

    loadCardsIntoSession(chosenCards, options);
  }
);
