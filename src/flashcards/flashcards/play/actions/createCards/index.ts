import {
  filterCardsThatExist,
  isInSession,
} from "flashcards/flashcards/play/actions/card/card";
import { chooseCards } from "flashcards/flashcards/play/actions/createCards/3_Choose_cards";
import { dependencies } from "flashcards/flashcards/play/actions/createCards/4_Dependencies";
import { loadCardsIntoSession } from "flashcards/flashcards/play/actions/session/loadCardsIntoSession";
import { getSession } from "flashcards/flashcards/play/actions/session/sessionStore";
import { logDev } from "modules/log";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export const CARDS_TO_CREATE = 50;

export type CreateCardsOptions = {
  skipDependencies?: Boolean;
  skipOverTheEasiest?: Boolean;
  insertImmediately?: Boolean;
  dontSortByAllowedIds?: Boolean;
};

export const createCards = warnIfFunctionIsSlow(
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
