import {
  filterCardsThatExist,
  isInSession,
} from "flashcards/flashcards/play/actions/card/card";
import { loadCardsIntoSession } from "flashcards/flashcards/play/actions/session/loadCardsIntoSession";
import { getSession } from "flashcards/flashcards/play/actions/session/sessionStore";
import { logDev } from "modules/log";
// eslint-disable-next-line no-restricted-imports
import { warnIfSlow } from "modules/warnIfSlow";

export const CARDS_TO_CREATE = 50;

export type CreateCardsOptions = {
  skip_dependencies?: Boolean;
  skipOverTheEasiest?: Boolean;
  insertImmediately?: Boolean;
  dont_sort_by_allowedIds?: Boolean;
};
export function createCards(options?: CreateCardsOptions): void {
  warnIfSlow.start("createCards");

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
  let chosenCards = ChooseCards(options);

  /* Add dependencies */
  if (!options?.skip_dependencies) {
    chosenCards = Dependencies(chosenCards);
  }

  /* Failed to generate cards, turn off allowed cards and try again */
  if (chosenCards.length === 0 && session.allowedIds) {
    console.warn(
      `Failed to generate more cards using the allowed ones, switching to all cards.`
    );
    session.allowedIds = null;
    return createCards({ skipOverTheEasiest: true });
  }

  warnIfSlow.end("createCards");

  loadCardsIntoSession(chosenCards, options);
}
