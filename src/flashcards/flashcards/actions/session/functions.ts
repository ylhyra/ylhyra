import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import {
  getSession,
  MAX_SECONDS_TO_COUNT_PER_ITEM,
} from "flashcards/flashcards/sessionStore";
import { log } from "modules/log";
import { getTime, seconds } from "modules/time";

/**
 * Called by {@link nextCard}
 */
export const updateRemainingTime = () => {
  const session = getSession();
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * seconds,
    getTime() - (session.remainingTimeLastUpdatedAt || 0)
  );
  session.remainingTime = Math.max(0, (session.remainingTime || 0) - diff);
  session.remainingTimeLastUpdatedAt = getTime();
  if (session.remainingTime === 0) {
    sessionDone();
  }
};

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
