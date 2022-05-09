import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import {
  getSession,
  MAX_SECONDS_TO_COUNT_PER_ITEM,
} from "flashcards/flashcards/actions/session/session";
import { log } from "modules/log";
import { getTime, Milliseconds, seconds } from "modules/time";

/**
 * Recalculates and then returns the remaining time.
 * Returns 0 if there is no time remaining.
 * Used by {@link nextCard}.
 */
export const getRemainingTime = (): Milliseconds => {
  const session = getSession();
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * seconds,
    getTime() - (session.remainingTimeLastUpdatedAt || 0)
  );
  /** Cannot be negative */
  session.remainingTime = Math.max(0, (session.remainingTime || 0) - diff);
  session.remainingTimeLastUpdatedAt = getTime();
  return session.remainingTime;
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
