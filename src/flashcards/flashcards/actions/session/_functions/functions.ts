import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import {
  getSession,
  MAX_SECONDS_TO_COUNT_PER_ITEM,
} from "flashcards/flashcards/actions/session/session";
import { log } from "modules/log";
import { getTime, Milliseconds, seconds } from "modules/time";

export const createCardsIfNoneAreRemaining = (): void => {
  const session = getSession();

  const areThereNewCardsRemaining = session.cards?.some(
    (i: CardInSession) => !i.hasBeenSeenInSession() && !i.done && i.canBeShown()
  );
  if (!areThereNewCardsRemaining) {
    log("No cards remaining");
    createCards();
    log("New cards generated");
  }
};
