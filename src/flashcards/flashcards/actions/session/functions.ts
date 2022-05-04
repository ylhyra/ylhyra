import CardInSession from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import {
  getSession,
  MAX_SECONDS_TO_COUNT_PER_ITEM,
} from "flashcards/flashcards/sessionStore";
import { Rating } from "flashcards/flashcards/types/types";
import { log } from "modules/log";
import { getTime } from "modules/time";

export const updateRemainingTime = () => {
  const session = getSession();
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    getTime() - (session.lastTimestamp || 0)
  );
  session.remainingTime = Math.max(0, (session.remainingTime || 0) - diff);
  session.lastTimestamp = getTime();
  if (session.remainingTime <= 0) {
    sessionDone();
    session.done = true;
  }
};

export const getPercentageDone = () => {
  const session = getSession();

  if (session.totalTime && session.remainingTime) {
    return (
      ((session.totalTime - session.remainingTime) / session.totalTime) * 100
    );
  } else {
    return 0;
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

export const answer = (rating: Rating) => {
  const session = getSession();
  session.currentCard?.rate(rating);
  nextCard();
  if (!session.done) {
    // session.loadCardInInterface();
  }
};
